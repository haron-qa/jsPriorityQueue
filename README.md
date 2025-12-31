# jsPriorityQueue

A high-performance generic Priority Queue implementation for JavaScript and TypeScript using a Binary Heap.

This project was developed for educational purposes to analyze and understand the state of priority queue implementations in JavaScript. I found the ecosystem mature and well-established.  

### Integration Considerations:
- If you require extreme performance and can work within its integer-only constraints, **Heapify** is the optimal choice.
- **FlatQueue** is an excellent option for managing objects where a custom comparator is not strictly required.
- **FastPriorityQueue** remains slightly faster for pure numeric data.
- **TinyQueue** offers a smaller codebase, which means smaller bundle size.
- **heap-js** is more feature-rich for advanced heap manipulations.

`jsPriorityQueue` is for general-purpose applications that need a balance of performance and the flexibility of custom comparators.

[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![NPM Version](https://img.shields.io/badge/npm-1.0.0-cb3837.svg)](package.json)

## Table of Contents

- [Features](#features)
- [Installation](#installation)
- [Usage](#usage)
  - [Basic Usage (Min-Heap)](#basic-usage-min-heap)
  - [Advanced Usage (Max-Heap with Objects)](#advanced-usage-max-heap-with-objects)
  - [O(n) Heapify](#on-heapify)
- [API Documentation](#api-documentation)
- [Performance Comparison](#performance-comparison)
- [License](#license)

## Features

- **🚀 High Performance**: Built with performance in mind, competitive with top-tier libraries like `FastPriorityQueue`.
- **🛠️ Generic Support**: Handles any data type—numbers, strings, or complex objects—with a custom comparator.
- **⚡ Efficient Operations**: O(log n) `push`/`pop`, O(1) `peek`, and O(n) `heapify`.
- **📦 Zero Dependencies**: Lightweight and easy to integrate.
- **TypeScript Support**: Full type definitions included out of the box.

## Installation

```bash
npm install js-priority-queue
```

## Usage

### Basic Usage (Min-Heap)

By default, the queue acts as a Min-Heap for numbers.

```javascript
import PriorityQueue from 'js-priority-queue';

const pq = new PriorityQueue();
pq.push(10);
pq.push(5);
pq.push(20);

console.log(pq.peek()); // 5
console.log(pq.pop());  // 5
console.log(pq.size()); // 2
```

### Advanced Usage (Max-Heap with Objects)

Use a custom comparator to manage complex objects. The comparator should return `true` if the first element has higher priority than the second.

```javascript
const maxHeap = new PriorityQueue((a, b) => a.priority > b.priority);

maxHeap.push({ task: 'low', priority: 1 });
maxHeap.push({ task: 'high', priority: 10 });
maxHeap.push({ task: 'medium', priority: 5 });

console.log(maxHeap.pop()); // { task: 'high', priority: 10 }
```

### O(n) Heapify

Construct a heap from an existing array efficiently.

```javascript
const items = [4, 1, 3, 2, 16, 9, 10, 14, 8, 7];
const pq = new PriorityQueue();
pq.heapify(items);

console.log(pq.pop()); // 1
```

## API Documentation

### `new PriorityQueue(comparator?)`
Creates a new priority queue.
- `comparator`: (Optional) A function `(a, b) => boolean`. Returns `true` if `a` should come before `b`.

### `.push(item)`
Adds an item to the queue. Returns the new size.
- **Time Complexity**: O(log n)

### `.pop()`
Removes and returns the item with the highest priority.
- **Time Complexity**: O(log n)

### `.peek()`
Returns the item with the highest priority without removing it.
- **Time Complexity**: O(1)

### `.size()`
Returns the number of items in the queue.
- **Time Complexity**: O(1)

### `.isEmpty()`
Returns `true` if the queue is empty.
- **Time Complexity**: O(1)

### `.heapify(array)`
Replaces the queue content with the provided array and builds a heap in place.
- **Time Complexity**: O(n)

## Performance Comparison

Benchmarks performed on 1,000,000 random numbers (Total time for Push + Pop ops in ms):

| Library | Push + Pop (1M) | Type | Best For |
|---|---|---|---|
| **jsPriorityQueue** | **114.81ms** | Binary Heap | **General use, high performance** |
| `FastPriorityQueue` | 112.08ms | Binary Heap | High performance, specific focus on numbers |
| `TinyQueue` | 126.66ms | Binary Heap | Small code size, minimal API |
| `heap-js` | 134.15ms | Binary Heap | Feature-rich API (extract, replace, etc.) |
| `FlatQueue` | 129.66ms | Binary Heap | Optimized for complex object handling |
| `Heapify` | 6.44ms | Integer Heap | **Extreme performance for integers/indexes** |

## License

MIT
