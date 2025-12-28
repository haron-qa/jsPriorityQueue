import PriorityQueue from '../src/PriorityQueue.js';
import FastPriorityQueue from 'fastpriorityqueue';
import TinyQueue from 'tinyqueue';
import fs from 'fs';
import path from 'path';

const ROUNDS = 100;
const N = 1_000_000;

function timeIt(fn) {
    const start = process.hrtime();
    fn();
    const [seconds, nanoseconds] = process.hrtime(start);
    return seconds * 1000 + nanoseconds / 1e6;
}

function getStats(times) {
    times.sort((a, b) => a - b);
    const min = times[0];
    const max = times[times.length - 1];
    const avg = times.reduce((a, b) => a + b, 0) / times.length;
    const median = times[Math.floor(times.length / 2)];
    return { min, max, avg, median };
}

console.log(`Starting Rigorous Benchmark (${ROUNDS} rounds, N=${N})...`);

const results = {
    myPQ: [],
    fpq: [],
    tq: [],
    // myPQc: [],
    // tqc: [],
    // fpqc: [],
    arr: []
};

// Warmup
console.log('Warming up...');
for (let i = 0; i < 5; i++) {
    const input = Array.from({ length: 10000 }, () => Math.random());
    const pq = new PriorityQueue();
    const fpq = new FastPriorityQueue();
    const tq = new TinyQueue();
    for (let n of input) pq.push(n);
    while (!pq.isEmpty()) pq.pop();
    for (let n of input) fpq.add(n);
    while (!fpq.isEmpty()) fpq.poll();
    for (let n of input) tq.push(n);
    while (tq.length > 0) tq.pop();
}

for (let r = 1; r <= ROUNDS; r++) {
    process.stdout.write(`\rRound ${r}/${ROUNDS}`);

    // Generate fresh input for each round to avoid caching weirdness, 
    // although generally V8 handles it.
    const input = Array.from({ length: N }, () => Math.random());

    // --- FastPriorityQueue ---
    // FPQ Default is MaxHeap-ish logic? 
    // "Default: Expects numbers, max heap." (from previous step analysis)
    // To match our MinHeap logic (comparator a-b), let's ensure we are consistent.
    // If we just want raw speed of "a priority queue", default is fine.
    // But let's try to be fair on comparator overhead.
    // We'll use the constructor that matches the logic.
    {
        const fpq = new FastPriorityQueue();
        const t = timeIt(() => {
            for (let num of input) fpq.add(num);
            while (!fpq.isEmpty()) fpq.poll();
        });
        results.fpq.push(t);
    }

    // --- TinyQueue ---
    {
        const tq = new TinyQueue();
        const t = timeIt(() => {
            for (let num of input) tq.push(num);
            while (tq.length > 0) tq.pop();
        });
        results.tq.push(t);
    }

    // --- My PQ ---
    {
        const pq = new PriorityQueue();
        const t = timeIt(() => {
            for (let num of input) pq.push(num);
            while (!pq.isEmpty()) pq.pop();
        });
        results.myPQ.push(t);
    }

    // // --- My PQ comparator ---
    // {
    //     const pqc = new PriorityQueue((a, b) => a - b);
    //     const t = timeIt(() => {
    //         for (let num of input) pqc.push(num);
    //         while (!pqc.isEmpty()) pqc.pop();
    //     });
    //     results.myPQc.push(t);
    // }

    // // --- TinyQueue comparator ---
    // {
    //     const tqc = new TinyQueue(undefined, (a, b) => a - b);
    //     const t = timeIt(() => {
    //         for (let num of input) tqc.push(num);
    //         while (tqc.length > 0) tqc.pop();
    //     });
    //     results.tqc.push(t);
    // }

    // // --- FastPriorityQueue comparator ---
    // {
    //     const fpqc = new FastPriorityQueue((a, b) => a - b);
    //     const t = timeIt(() => {
    //         for (let num of input) fpqc.add(num);
    //         while (!fpqc.isEmpty()) fpqc.poll();
    //     });
    //     results.fpqc.push(t);
    // }

    // --- Array.sort ---
    {
        const arr = [...input];
        const t = timeIt(() => {
            arr.sort((a, b) => a - b);
        });
        results.arr.push(t);
    }
}

console.log('\nCalculating statistics...');

const stats = {
    myPQ: getStats(results.myPQ),
    fpq: getStats(results.fpq),
    tq: getStats(results.tq),
    // myPQc: getStats(results.myPQc),
    // tqc: getStats(results.tqc),
    // fpqc: getStats(results.fpqc),
    arr: getStats(results.arr)
};

const output = `# Rigorous Performance Report
**Iterations**: ${ROUNDS}
**Items per Iteration**: ${N.toLocaleString()}

| Implementation | Average (ms) | Median (ms) | Min (ms) | Max (ms) |
|---|---|---|---|---|
| **FastPriorityQueue** | ${stats.fpq.avg.toFixed(2)} | ${stats.fpq.median.toFixed(2)} | ${stats.fpq.min.toFixed(2)} | ${stats.fpq.max.toFixed(2)} |
| **jsPriorityQueue** | **${stats.myPQ.avg.toFixed(2)}** | **${stats.myPQ.median.toFixed(2)}** | **${stats.myPQ.min.toFixed(2)}** | **${stats.myPQ.max.toFixed(2)}** |
| **TinyQueue** | ${stats.tq.avg.toFixed(2)} | ${stats.tq.median.toFixed(2)} | ${stats.tq.min.toFixed(2)} | ${stats.tq.max.toFixed(2)} |
| **Array.sort** | ${stats.arr.avg.toFixed(2)} | ${stats.arr.median.toFixed(2)} | ${stats.arr.min.toFixed(2)} | ${stats.arr.max.toFixed(2)} |

*Generated on ${new Date().toISOString()}*
`;

fs.writeFileSync(path.join(process.cwd(), 'PERFORMANCE_SUMMARY.md'), output);
console.log('Report saved to PERFORMANCE_SUMMARY.md');

/* table rows for comparator results: 
| **FastPriorityQueue comparator** | ${stats.fpq.avg.toFixed(2)} | ${stats.fpq.median.toFixed(2)} | ${stats.fpq.min.toFixed(2)} | ${stats.fpq.max.toFixed(2)} |
| **jsPriorityQueue comparator** | **${stats.myPQc.avg.toFixed(2)}** | **${stats.myPQc.median.toFixed(2)}** | **${stats.myPQc.min.toFixed(2)}** | **${stats.myPQc.max.toFixed(2)}** |
| **TinyQueue comparator** | ${stats.tqc.avg.toFixed(2)} | ${stats.tqc.median.toFixed(2)} | ${stats.tqc.min.toFixed(2)} | ${stats.tqc.max.toFixed(2)} |
*/