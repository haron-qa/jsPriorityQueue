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
    let currentIdx = this._size;
    this._heap[this._size] = item;
    this._size += 1;

    // Sift up inline for performance
    let parentIdx;
    let parent;
    while (currentIdx > 0) {
      parentIdx = (currentIdx - 1) >>> 1;
      parent = this._heap[parentIdx];
      if (!this._comparator(item, parent)) {
        break;
      }
      this._heap[currentIdx] = parent;
      currentIdx = parentIdx;
    }
    this._heap[currentIdx] = item;

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
   * Internal method to restore heap property downward.
   * @param {number} idx - Starting index
   */
  _siftDown(idx) {
    const size = this._size;
    const halfLength = this._size >>> 1;
    const currentItem = this._heap[idx];
    let bestChildIdx;
    let rightChildIdx;
    let bestChild;

    while (idx < halfLength) {
      bestChildIdx = (idx << 1) + 1;
      rightChildIdx = bestChildIdx + 1;
      bestChild = this._heap[bestChildIdx];

      if (rightChildIdx < size) {
        if (this._comparator(this._heap[rightChildIdx], bestChild)) {
          bestChildIdx = rightChildIdx;
          bestChild = this._heap[rightChildIdx];
        }
      }

      if (!this._comparator(bestChild, currentItem)) {
        break;
      }

      this._heap[idx] = bestChild;
      idx = bestChildIdx;
    }
    this._heap[idx] = currentItem;
  }
}
