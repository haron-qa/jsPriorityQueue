import PriorityQueue from '../src/PriorityQueue.js';
import FastPriorityQueue from 'fastpriorityqueue';
import TinyQueue from 'tinyqueue';
import HeapJs from 'heap-js';
const { Heap } = HeapJs;
import FlatQueue from 'flatqueue';
import HeapifyPkg from 'heapify';
const { MinQueue } = HeapifyPkg;
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
    heapJs: [],
    flatQueue: [],
    heapify: [],
    arr: []
};

// Warmup
console.log('Warming up...');
for (let i = 0; i < 5; i++) {
    const input = Array.from({ length: 10000 }, () => Math.random());
    const pq = new PriorityQueue();
    const fpq = new FastPriorityQueue();
    const tq = new TinyQueue();
    const hj = new Heap();
    const fq = new FlatQueue();
    const hf = new MinQueue(10000);
    for (let n of input) pq.push(n);
    while (!pq.isEmpty()) pq.pop();
    for (let n of input) fpq.add(n);
    while (!fpq.isEmpty()) fpq.poll();
    for (let n of input) tq.push(n);
    while (tq.length > 0) tq.pop();
    for (let n of input) hj.push(n);
    while (hj.length > 0) hj.pop();
    for (let j = 0; j < input.length; j++) fq.push(input[j], input[j]);
    while (fq.length > 0) fq.pop();
    for (let j = 0; j < input.length; j++) hf.push(j, input[j]);
    while (hf.size > 0) hf.pop();
}

for (let r = 1; r <= ROUNDS; r++) {
    process.stdout.write(`\rRound ${r}/${ROUNDS}`);

    const input = Array.from({ length: N }, () => Math.random());

    // --- FastPriorityQueue ---
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

    // --- heap-js ---
    {
        const hj = new Heap();
        const t = timeIt(() => {
            for (let num of input) hj.push(num);
            while (hj.length > 0) hj.pop();
        });
        results.heapJs.push(t);
    }

    // --- FlatQueue ---
    {
        const fq = new FlatQueue(N);
        const t = timeIt(() => {
            for (let num of input) fq.push(num, num);
            while (fq.length > 0) fq.pop();
        });
        results.flatQueue.push(t);
    }

    // --- Heapify ---
    {
        const hf = new MinQueue(N);
        const t = timeIt(() => {
            for (let i = 0; i < input.length; i++) hf.push(i, input[i]);
            while (hf.size > 0) hf.pop();
        });
        results.heapify.push(t);
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
    heapJs: getStats(results.heapJs),
    flatQueue: getStats(results.flatQueue),
    heapify: getStats(results.heapify),
    arr: getStats(results.arr)
};

const output = `# Rigorous Performance Report
**Iterations**: ${ROUNDS}
**Items per Iteration**: ${N.toLocaleString()}

| Implementation | Average (ms) | Median (ms) | Min (ms) | Max (ms) |
|---|---|---|---|---|
| **Heapify** | ${stats.heapify.avg.toFixed(2)} | ${stats.heapify.median.toFixed(2)} | ${stats.heapify.min.toFixed(2)} | ${stats.heapify.max.toFixed(2)} |
| **FastPriorityQueue** | ${stats.fpq.avg.toFixed(2)} | ${stats.fpq.median.toFixed(2)} | ${stats.fpq.min.toFixed(2)} | ${stats.fpq.max.toFixed(2)} |
| **js-pq** | **${stats.myPQ.avg.toFixed(2)}** | **${stats.myPQ.median.toFixed(2)}** | **${stats.myPQ.min.toFixed(2)}** | **${stats.myPQ.max.toFixed(2)}** |
| **TinyQueue** | ${stats.tq.avg.toFixed(2)} | ${stats.tq.median.toFixed(2)} | ${stats.tq.min.toFixed(2)} | ${stats.tq.max.toFixed(2)} |
| **heap-js** | ${stats.heapJs.avg.toFixed(2)} | ${stats.heapJs.median.toFixed(2)} | ${stats.heapJs.min.toFixed(2)} | ${stats.heapJs.max.toFixed(2)} |
| **FlatQueue** | ${stats.flatQueue.avg.toFixed(2)} | ${stats.flatQueue.median.toFixed(2)} | ${stats.flatQueue.min.toFixed(2)} | ${stats.flatQueue.max.toFixed(2)} |
| **Array.sort** | ${stats.arr.avg.toFixed(2)} | ${stats.arr.median.toFixed(2)} | ${stats.arr.min.toFixed(2)} | ${stats.arr.max.toFixed(2)} |

*Generated on ${new Date().toISOString()}*
`;

fs.writeFileSync(path.join(process.cwd(), 'benchmarks/PERFORMANCE_SUMMARY.md'), output);
console.log('Report saved to benchmarks/PERFORMANCE_SUMMARY.md');

