import PriorityQueue from '../src/PriorityQueue.js';
import FastPriorityQueue from 'fastpriorityqueue';
import TinyQueue from 'tinyqueue';
import HeapJs from 'heap-js';
const { Heap } = HeapJs;
import FlatQueue from 'flatqueue';
import HeapifyPkg from 'heapify';
const { MinQueue } = HeapifyPkg;

function timeIt(label, fn) {
    const start = process.hrtime();
    fn();
    const [seconds, nanoseconds] = process.hrtime(start);
    const ms = seconds * 1000 + nanoseconds / 1e6;
    return ms;
}

const N_VALUES = [10_000, 100_000, 1_000_000];

console.log('| Metric | N | PriorityQueue | FastPriorityQueue | TinyQueue | heap-js | FlatQueue | Heapify | Array.sort |');
console.log('|---|---|---|---|---|---|---|---|---|');

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
    const fpq = new FastPriorityQueue();
    const fpqPushTime = timeIt('FPQ Push', () => {
        for (let num of input) fpq.add(num);
    });
    const fpqPopTime = timeIt('FPQ Pop', () => {
        while (!fpq.isEmpty()) fpq.poll();
    });

    // --- TinyQueue ---
    const tq = new TinyQueue();
    const tqPushTime = timeIt('TinyQueue Push', () => {
        for (let num of input) tq.push(num);
    });
    const tqPopTime = timeIt('TinyQueue Pop', () => {
        while (tq.length > 0) tq.pop();
    });

    // --- heap-js ---
    const heapJs = new Heap();
    const heapJsPushTime = timeIt('heap-js Push', () => {
        for (let num of input) heapJs.push(num);
    });
    const heapJsPopTime = timeIt('heap-js Pop', () => {
        while (heapJs.length > 0) heapJs.pop();
    });

    // --- FlatQueue ---
    const fq = new FlatQueue(n);
    const fqPushTime = timeIt('FlatQueue Push', () => {
        for (let num of input) fq.push(num, num); // value, priority
    });
    const fqPopTime = timeIt('FlatQueue Pop', () => {
        while (fq.length > 0) fq.pop();
    });

    // --- Heapify ---
    const heapify = new MinQueue(n);
    const heapifyPushTime = timeIt('Heapify Push', () => {
        for (let i = 0; i < input.length; i++) heapify.push(i, input[i]); // key, priority

    });
    const heapifyPopTime = timeIt('Heapify Pop', () => {
        while (heapify.size > 0) heapify.pop();
    });

    // --- Array.sort ---
    const arr = [...input];
    const sortTime = timeIt('Array Sort', () => {
        arr.sort((a, b) => a - b);
    });

    // Output rows
    console.log(`| Push | ${n} | ${myPushTime.toFixed(2)} | ${fpqPushTime.toFixed(2)} | ${tqPushTime.toFixed(2)} | ${heapJsPushTime.toFixed(2)} | ${fqPushTime.toFixed(2)} | ${heapifyPushTime.toFixed(2)} | - |`);
    console.log(`| Pop  | ${n} | ${myPopTime.toFixed(2)} | ${fpqPopTime.toFixed(2)} | ${tqPopTime.toFixed(2)} | ${heapJsPopTime.toFixed(2)} | ${fqPopTime.toFixed(2)} | ${heapifyPopTime.toFixed(2)} | - |`);
    console.log(`| Total| ${n} | ${(myPushTime + myPopTime).toFixed(2)} | ${(fpqPushTime + fpqPopTime).toFixed(2)} | ${(tqPushTime + tqPopTime).toFixed(2)} | ${(heapJsPushTime + heapJsPopTime).toFixed(2)} | ${(fqPushTime + fqPopTime).toFixed(2)} | ${(heapifyPushTime + heapifyPopTime).toFixed(2)} | ${sortTime.toFixed(2)}* |`);
});

console.log('\n* Array.sort is one-time sort, not queue operations.');
