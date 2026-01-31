import PriorityQueue from '../src/PriorityQueue.js';
import FastPriorityQueue from 'fastpriorityqueue';
import TinyQueue from 'tinyqueue';
import HeapJs from 'heap-js';
const { Heap } = HeapJs;
import FlatQueue from 'flatqueue';
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
    const data = [];
    for (let j = 0; j < 10000; j++) data[j] = { value: Math.random() };
    const pq = new PriorityQueue((a, b) => a.value < b.value);
    const fpq = new FastPriorityQueue((a, b) => a.value < b.value);
    const tq = new TinyQueue([], (a, b) => a.value - b.value);
    const hj = new Heap((a, b) => a.value - b.value);
    const fq = new FlatQueue();
    for (let obj of data) pq.push(obj);
    while (!pq.isEmpty()) pq.pop();
    for (let obj of data) fpq.add(obj);
    while (!fpq.isEmpty()) fpq.poll();
    for (let obj of data) tq.push(obj);
    while (tq.length > 0) tq.pop();
    for (let obj of data) hj.push(obj);
    while (hj.length > 0) hj.pop();
    for (let j = 0; j < data.length; j++) fq.push(data[j], data[j].value);
    while (fq.length > 0) fq.pop();
}

for (let r = 1; r <= ROUNDS; r++) {
    process.stdout.write(`\rRound ${r}/${ROUNDS}`);

    const data = [];
    for (let i = 0; i < N; i++) data[i] = { value: Math.random() };

    // --- FastPriorityQueue ---
    {
        const fpq = new FastPriorityQueue((a, b) => a.value < b.value);
        const t = timeIt(() => {
            for (let obj of data) fpq.add(obj);
            while (!fpq.isEmpty()) fpq.poll();
        });
        results.fpq.push(t);
    }

    // --- TinyQueue ---
    {
        const tq = new TinyQueue([], (a, b) => a.value - b.value);
        const t = timeIt(() => {
            for (let obj of data) tq.push(obj);
            while (tq.length > 0) tq.pop();
        });
        results.tq.push(t);
    }

    // --- My PQ ---
    {
        const pq = new PriorityQueue((a, b) => a.value < b.value);
        const t = timeIt(() => {
            for (let obj of data) pq.push(obj);
            while (!pq.isEmpty()) pq.pop();
        });
        results.myPQ.push(t);
    }

    // --- heap-js ---
    {
        const hj = new Heap((a, b) => a.value - b.value);
        const t = timeIt(() => {
            for (let obj of data) hj.push(obj);
            while (hj.length > 0) hj.pop();
        });
        results.heapJs.push(t);
    }

    // --- FlatQueue ---
    {
        const fq = new FlatQueue(N);
        const t = timeIt(() => {
            for (let obj of data) fq.push(obj, obj.value);
            while (fq.length > 0) fq.pop();
        });
        results.flatQueue.push(t);
    }

    // --- Array.sort ---
    {
        const arr = [...data];
        const t = timeIt(() => {
            arr.sort((a, b) => a.value - b.value);
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
    arr: getStats(results.arr)
};

const output = `# Rigorous Performance Report (Object Comparisons)
**Iterations**: ${ROUNDS}
**Items per Iteration**: ${N.toLocaleString()}

| Implementation | Average (ms) | Median (ms) | Min (ms) | Max (ms) |
|---|---|---|---|---|
| **FastPriorityQueue** | ${stats.fpq.avg.toFixed(2)} | ${stats.fpq.median.toFixed(2)} | ${stats.fpq.min.toFixed(2)} | ${stats.fpq.max.toFixed(2)} |
| **js-pq** | **${stats.myPQ.avg.toFixed(2)}** | **${stats.myPQ.median.toFixed(2)}** | **${stats.myPQ.min.toFixed(2)}** | **${stats.myPQ.max.toFixed(2)}** |
| **TinyQueue** | ${stats.tq.avg.toFixed(2)} | ${stats.tq.median.toFixed(2)} | ${stats.tq.min.toFixed(2)} | ${stats.tq.max.toFixed(2)} |
| **heap-js** | ${stats.heapJs.avg.toFixed(2)} | ${stats.heapJs.median.toFixed(2)} | ${stats.heapJs.min.toFixed(2)} | ${stats.heapJs.max.toFixed(2)} |
| **FlatQueue** | ${stats.flatQueue.avg.toFixed(2)} | ${stats.flatQueue.median.toFixed(2)} | ${stats.flatQueue.min.toFixed(2)} | ${stats.flatQueue.max.toFixed(2)} |
| **Array.sort** | ${stats.arr.avg.toFixed(2)} | ${stats.arr.median.toFixed(2)} | ${stats.arr.min.toFixed(2)} | ${stats.arr.max.toFixed(2)} |

*Generated on ${new Date().toISOString()}*
`;

fs.writeFileSync(path.join(process.cwd(), 'benchmarks/PERFORMANCE_SUMMARY_OBJECTS.md'), output);
console.log('Report saved to benchmarks/PERFORMANCE_SUMMARY_OBJECTS.md');

