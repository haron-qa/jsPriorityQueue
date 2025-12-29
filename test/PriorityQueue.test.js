import { describe, it, expect, beforeEach } from 'vitest';
import PriorityQueue from '../src/PriorityQueue.js';

describe('PriorityQueue', () => {
    describe('Default Behavior (MinHeap with numbers)', () => {
        let pq;
        beforeEach(() => {
            pq = new PriorityQueue();
        });

        it('starts empty', () => {
            expect(pq.size()).toBe(0);
            expect(pq.isEmpty()).toBe(true);
            expect(pq.peek()).toBeUndefined();
            expect(pq.pop()).toBeUndefined();
        });

        it('orders numbers correctly (MinHeap)', () => {
            pq.push(10);
            pq.push(5);
            pq.push(20);
            pq.push(1);

            expect(pq.size()).toBe(4);
            expect(pq.peek()).toBe(1); // Smallest

            expect(pq.pop()).toBe(1);
            expect(pq.pop()).toBe(5);
            expect(pq.pop()).toBe(10);
            expect(pq.pop()).toBe(20);

            expect(pq.isEmpty()).toBe(true);
        });

        it('handles duplicate values', () => {
            pq.push(10);
            pq.push(10);
            pq.push(5);

            expect(pq.pop()).toBe(5);
            expect(pq.pop()).toBe(10);
            expect(pq.pop()).toBe(10);
        });
    });

    describe('MaxHeap Behavior (Custom Comparator)', () => {
        it('orders numbers correctly (MaxHeap)', () => {
            const maxPQ = new PriorityQueue((a, b) => a > b);
            maxPQ.push(10);
            maxPQ.push(5);
            maxPQ.push(20);
            maxPQ.push(1);

            expect(maxPQ.peek()).toBe(20); // Largest

            expect(maxPQ.pop()).toBe(20);
            expect(maxPQ.pop()).toBe(10);
            expect(maxPQ.pop()).toBe(5);
            expect(maxPQ.pop()).toBe(1);
        });
    });

    describe('Complex Objects', () => {
        it('works with objects and custom comparator', () => {
            const tasks = new PriorityQueue((a, b) => a.priority < b.priority);

            tasks.push({ id: 'low', priority: 10 });
            tasks.push({ id: 'high', priority: 1 });
            tasks.push({ id: 'med', priority: 5 });

            expect(tasks.pop()).toEqual({ id: 'high', priority: 1 });
            expect(tasks.pop()).toEqual({ id: 'med', priority: 5 });
            expect(tasks.pop()).toEqual({ id: 'low', priority: 10 });
        });
    });

    describe('Mixed Operations', () => {
        it('maintains heap property after interleaved push/pop', () => {
            const pq = new PriorityQueue();
            pq.push(5);
            pq.push(10);
            expect(pq.pop()).toBe(5);

            pq.push(7);
            pq.push(3);
            expect(pq.pop()).toBe(3);
            expect(pq.pop()).toBe(7);
            expect(pq.pop()).toBe(10);
        });
    });

    describe('Large Dataset', () => {
        it('handles larger number of elements', () => {
            const pq = new PriorityQueue();
            const count = 1000;
            const input = [];
            for (let i = 0; i < count; i++) {
                const val = Math.floor(Math.random() * 10000);
                input.push(val);
                pq.push(val);
            }

            input.sort((a, b) => a - b);

            for (let i = 0; i < count; i++) {
                expect(pq.pop()).toBe(input[i]);
            }
        });
    });

    describe('heapify()', () => {
        it('builds heap from unsorted array', () => {
            const pq = new PriorityQueue();
            pq.heapify([5, 3, 8, 1, 9, 2]);

            expect(pq.size()).toBe(6);
            expect(pq.pop()).toBe(1);
            expect(pq.pop()).toBe(2);
            expect(pq.pop()).toBe(3);
            expect(pq.pop()).toBe(5);
            expect(pq.pop()).toBe(8);
            expect(pq.pop()).toBe(9);
        });

        it('handles empty array', () => {
            const pq = new PriorityQueue();
            pq.heapify([]);

            expect(pq.size()).toBe(0);
            expect(pq.isEmpty()).toBe(true);
            expect(pq.peek()).toBeUndefined();
            expect(pq.pop()).toBeUndefined();
        });

        it('handles single element', () => {
            const pq = new PriorityQueue();
            pq.heapify([42]);

            expect(pq.size()).toBe(1);
            expect(pq.peek()).toBe(42);
            expect(pq.pop()).toBe(42);
            expect(pq.isEmpty()).toBe(true);
        });

        it('works with MaxHeap comparator', () => {
            const pq = new PriorityQueue((a, b) => a > b);
            pq.heapify([5, 3, 8, 1, 9, 2]);

            expect(pq.pop()).toBe(9);
            expect(pq.pop()).toBe(8);
            expect(pq.pop()).toBe(5);
        });

        it('replaces existing heap content', () => {
            const pq = new PriorityQueue();
            pq.push(100);
            pq.push(200);

            pq.heapify([1, 2, 3]);

            expect(pq.size()).toBe(3);
            expect(pq.pop()).toBe(1);
        });
    });

    describe('Edge Cases', () => {
        it('handles single element push/pop', () => {
            const pq = new PriorityQueue();
            pq.push(42);

            expect(pq.size()).toBe(1);
            expect(pq.peek()).toBe(42);
            expect(pq.pop()).toBe(42);
            expect(pq.isEmpty()).toBe(true);
            expect(pq.pop()).toBeUndefined();
        });

        it('handles negative numbers', () => {
            const pq = new PriorityQueue();
            pq.push(-5);
            pq.push(0);
            pq.push(-10);
            pq.push(5);

            expect(pq.pop()).toBe(-10);
            expect(pq.pop()).toBe(-5);
            expect(pq.pop()).toBe(0);
            expect(pq.pop()).toBe(5);
        });

        it('push returns new size', () => {
            const pq = new PriorityQueue();
            expect(pq.push(1)).toBe(1);
            expect(pq.push(2)).toBe(2);
            expect(pq.push(3)).toBe(3);
        });

        it('peek does not modify queue', () => {
            const pq = new PriorityQueue();
            pq.push(5);
            pq.push(3);

            expect(pq.peek()).toBe(3);
            expect(pq.peek()).toBe(3);
            expect(pq.size()).toBe(2);
        });

        it('handles strings with custom comparator', () => {
            const pq = new PriorityQueue((a, b) => a.length < b.length);
            pq.push('aaa');
            pq.push('a');
            pq.push('aa');

            expect(pq.pop()).toBe('a');
            expect(pq.pop()).toBe('aa');
            expect(pq.pop()).toBe('aaa');
        });

        it('handles all equal elements', () => {
            const pq = new PriorityQueue();
            pq.push(5);
            pq.push(5);
            pq.push(5);

            expect(pq.pop()).toBe(5);
            expect(pq.pop()).toBe(5);
            expect(pq.pop()).toBe(5);
            expect(pq.isEmpty()).toBe(true);
        });

        it('handles already sorted array in heapify', () => {
            const pq = new PriorityQueue();
            pq.heapify([1, 2, 3, 4, 5]);

            expect(pq.pop()).toBe(1);
            expect(pq.pop()).toBe(2);
            expect(pq.pop()).toBe(3);
        });

        it('handles reverse sorted array in heapify', () => {
            const pq = new PriorityQueue();
            pq.heapify([5, 4, 3, 2, 1]);

            expect(pq.pop()).toBe(1);
            expect(pq.pop()).toBe(2);
            expect(pq.pop()).toBe(3);
        });
    });
})
