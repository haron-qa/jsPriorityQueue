import PriorityQueue from '../src/PriorityQueue.js';
import FastPriorityQueue from 'fastpriorityqueue';
import TinyQueue from 'tinyqueue';

function timeIt(label, fn) {
    const start = process.hrtime();
    fn();
    const [seconds, nanoseconds] = process.hrtime(start);
    const ms = seconds * 1000 + nanoseconds / 1e6;
    return ms;
}

const N_VALUES = [10_000, 100_000, 1_000_000];

console.log('| Metric | N | PriorityQueue (ms) | FastPriorityQueue (ms) | TinyQueue (ms) | Array.sort (ms) |');
console.log('|---|---|---|---|---|---|');

N_VALUES.forEach(n => {
    // Data Prep
    const input = Array.from({ length: n }, () => Math.random());

    // --- My Implementation ---
    const myPQ = new PriorityQueue();
    const myPushTime = timeIt('MyPQ Push', () => {
        for (let num of input) myPQ.push(num);
    });
    const myPopTime = timeIt('MyPQ Pop', () => {
        while (!myPQ.isEmpty()) myPQ.pop();
    });

    // --- FastPriorityQueue ---
    // FPQ defaults to MaxHeap? Default comparator: function(a, b) { return a < b; } which means a < b is true? 
    // Docs say: "Default: Expects numbers, max heap." 
    // Wait, simple binary heap usually min or max.
    // Let's check default behavior is MinHeap for fair comparison?
    // My PQ is MinHeap by default (a-b). 
    // TinyQueue is MinHeap by default.
    // FastPriorityQueue is MaxHeap by default (comparator returns true if a < b? No, if a should be before b?).
    // "The comparator function returns true if a < b." -> MaxHeap if it maintains logic where top is max?
    // Actually, let's just use default numeric comparators for all if possible, or force MinHeap.
    // FPQ: var x = new FastPriorityQueue(function(a,b) { return a < b; }); (MinHeap?)
    // Actually simplicity: Default all to MinHeap.

    const fpq = new FastPriorityQueue((a, b) => a < b); // MinHeap logic for FPQ usually
    const fpqPushTime = timeIt('FPQ Push', () => {
        for (let num of input) fpq.add(num);
    });
    const fpqPopTime = timeIt('FPQ Pop', () => {
        while (!fpq.isEmpty()) fpq.poll();
    });

    // --- TinyQueue ---
    const tq = new TinyQueue(); // MinHeap by default
    const tqPushTime = timeIt('TinyQueue Push', () => {
        for (let num of input) tq.push(num);
    });
    const tqPopTime = timeIt('TinyQueue Pop', () => {
        while (tq.length > 0) tq.pop();
    });

    // --- Array.sort ---
    const arr = [...input];
    const sortTime = timeIt('Array Sort', () => {
        // Just sort once
        arr.sort((a, b) => a - b);
    });

    // Output Row for Push + Pop (Total)
    // We can also split them, but total cycle is good summary.
    console.log(`| Push | ${n} | ${myPushTime.toFixed(2)} | ${fpqPushTime.toFixed(2)} | ${tqPushTime.toFixed(2)} | - |`);
    console.log(`| Pop  | ${n} | ${myPopTime.toFixed(2)} | ${fpqPopTime.toFixed(2)} | ${tqPopTime.toFixed(2)} | - |`);
    console.log(`| Total| ${n} | ${(myPushTime + myPopTime).toFixed(2)} | ${(fpqPushTime + fpqPopTime).toFixed(2)} | ${(tqPushTime + tqPopTime).toFixed(2)} | ${sortTime.toFixed(2)}* |`);
});

console.log('\n* Array.sort is one-time sort, not queue operations.');
