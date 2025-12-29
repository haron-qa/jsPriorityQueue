import PriorityQueue from '../src/PriorityQueue.js';
import FastPriorityQueue from 'fastpriorityqueue';
import TinyQueue from 'tinyqueue';
import fs from 'fs';
import path from 'path';

const ROUNDS = 25;
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
    arr: []
};

// Warmup
console.log('Warming up...');
for (let i = 0; i < 5; i++) {
    const input = Array.from({ length: 10000 }, () => Math.random());
    const pq = new PriorityQueue((a, b) => a - b);
    const fpq = new FastPriorityQueue((a, b) => a - b);
    const tq = new TinyQueue(undefined, (a, b) => a - b);
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
        const fpq = new FastPriorityQueue((a, b) => a - b);
        const t = timeIt(() => {
            for (let num of input) fpq.add(num);
            while (!fpq.isEmpty()) fpq.poll();
        });
        results.fpq.push(t);
    }

    // --- TinyQueue ---
    {
        const tq = new TinyQueue(undefined, (a, b) => a - b);
        const t = timeIt(() => {
            for (let num of input) tq.push(num);
            while (tq.length > 0) tq.pop();
        });
        results.tq.push(t);
    }

    // --- My PQ ---
    {
        const pq = new PriorityQueue((a, b) => a - b);
        const t = timeIt(() => {
            for (let num of input) pq.push(num);
            while (!pq.isEmpty()) pq.pop();
        });
        results.myPQ.push(t);
    }


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

fs.writeFileSync(path.join(process.cwd(), 'benchmarks/PERFORMANCE_COMP_SUMMARY.md'), output);
console.log('Report saved to benchmarks/PERFORMANCE_COMP_SUMMARY.md');