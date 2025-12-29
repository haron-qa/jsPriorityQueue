/**
 * A generic Priority Queue implementation using a Binary Heap.
 * default: MinHeap (numbers)
 */
export default class PriorityQueue {
  /**
   * @param {function(any, any): boolean} [comparator] - Function that defines the sort order.
   * Returns a boolean:
   *  - true if a should come before b (a has higher priority)
   *  - false otherwise
   * Default is a MinHeap for numbers ((a, b) => a < b).
   */
  constructor(comparator = (a, b) => a < b) {
    this._heap = [];
    this._size = 0;
    this._comparator = comparator;
  }

  /**
   * Returns the number of items in the queue.
   * Time Complexity: O(1)
   * @returns {number}
   */
  size() {
    return this._size;
  }

  /**
   * Checks if the queue is empty.
   * Time Complexity: O(1)
   * @returns {boolean}
   */
  isEmpty() {
    return this._size === 0;
  }

  /**
   * View the highest priority item without removing it.
   * Time Complexity: O(1)
   * @returns {any}
   */
  peek() {
    return this._size === 0 ? undefined : this._heap[0];
  }

  /**
   * Add a new item to the queue.
   * Time Complexity: O(log n)
   * @param {any} item
   * @returns {number} new size of the queue
   */
  push(item) {
    const { _heap, _comparator } = this;
    let currentIdx = this._size;
    _heap[this._size] = item;
    this._size += 1;

    // Sift up inline for performance
    let parentIdx;
    let parent;
    while (currentIdx > 0) {
      parentIdx = (currentIdx - 1) >>> 1;
      parent = _heap[parentIdx];
      if (!_comparator(item, parent)) {
        break;
      }
      _heap[currentIdx] = parent;
      currentIdx = parentIdx;
    }
    _heap[currentIdx] = item;

    return this._size;
  }

  /**
   * Remove and return the highest priority item.
   * Time Complexity: O(log n)
   * @returns {any}
   */
  pop() {
    if (this._size === 0) return undefined;

    const top = this._heap[0];
    if (this._size > 1) {
      this._heap[0] = this._heap[--this._size];
      this._siftDown(0);
    } else {
      this._size -= 1;
    }
    return top;
  }

  /**
   * Replace the heap content with provided array and heapify it.
   * More efficient than pushing items one by one.
   * Time Complexity: O(n)
   * @param {Array} arr - Array of items to heapify
   */
  heapify(arr) {
    this._heap = arr;
    this._size = arr.length;

    // Build heap from bottom up - start from last parent node
    for (let i = (this._size >>> 1) - 1; i >= 0; i--) {
      this._siftDown(i);
    }
  }

  /**
   * Internal method to restore heap property downward.
   * @param {number} idx - Starting index
   */
  _siftDown(idx) {
    const { _heap, _comparator, _size } = this;
    const halfLength = _size >>> 1;
    const currentItem = _heap[idx];
    let bestChildIdx;
    let rightChildIdx;
    let bestChild;

    while (idx < halfLength) {
      bestChildIdx = (idx << 1) + 1;
      rightChildIdx = bestChildIdx + 1;
      bestChild = _heap[bestChildIdx];

      if (rightChildIdx < _size) {
        if (_comparator(_heap[rightChildIdx], bestChild)) {
          bestChildIdx = rightChildIdx;
          bestChild = _heap[rightChildIdx];
        }
      }

      if (!_comparator(bestChild, currentItem)) {
        break;
      }

      _heap[idx] = bestChild;
      idx = bestChildIdx;
    }
    _heap[idx] = currentItem;
  }
}
