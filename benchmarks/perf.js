import PriorityQueue from '../src/PriorityQueue.js';

function timeIt(label, fn) {
    const start = process.hrtime();
    fn();
    const [seconds, nanoseconds] = process.hrtime(start);
    const ms = seconds * 1000 + nanoseconds / 1e6;
    console.log(`${label}: ${ms.toFixed(2)}ms`);
    return ms;
}

const N_VALUES = [10000, 100000, 1000000];

console.log('--- PriorityQueue Performance Benchmark ---');

N_VALUES.forEach(n => {
    console.log(`\n[N = ${n}]`);

    // Test PriorityQueue Push
    const pq = new PriorityQueue();
    const input = Array.from({ length: n }, () => Math.random());

    timeIt('PriorityQueue.push()', () => {
        for (let num of input) {
            pq.push(num);
        }
    });

    // Test PriorityQueue Pop
    timeIt('PriorityQueue.pop() ', () => {
        while (!pq.isEmpty()) {
            pq.pop();
        }
    });

    // Comparison: Array Push + Sort (Naive approach)
    // We simulate "pushing" by adding to array, but to get PQ behavior we sort each time (extremely slow)
    // or sort once at the end. 
    // For a fair "batch" comparison, we compare sorting the whole array once (O(N log N)) 
    // vs N * push (O(N log N)).
    const arr = [...input];
    timeIt('Array.sort()        ', () => {
        arr.sort((a, b) => a - b);
    });

});
