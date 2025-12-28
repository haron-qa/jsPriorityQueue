/**
 * A generic Priority Queue implementation using a Binary Heap.
 * default: MinHeap (numbers)
 */
export default class PriorityQueue {
  /**
   * @param {function(any, any): number} [comparator] - Function that defines the sort order.
   * Returns a straight value:
   *  - negative if a < b (a comes first)
   *  - positive if a > b (b comes first)
   *  - 0 if equal
   * Default is a MinHeap for numbers ((a, b) => a - b).
   */
  constructor(comparator = (a, b) => a - b) {
    this._heap = [];
    this._comparator = comparator;
  }

  /**
   * Returns the number of items in the queue.
   * Time Complexity: O(1)
   * @returns {number}
   */
  size() {
    return this._heap.length;
  }

  /**
   * Checks if the queue is empty.
   * Time Complexity: O(1)
   * @returns {boolean}
   */
  isEmpty() {
    return this.size() === 0;
  }

  /**
   * View the highest priority item without removing it.
   * Time Complexity: O(1)
   * @returns {any}
   */
  peek() {
    return this._heap.length === 0 ? undefined : this._heap[0];
  }

  /**
   * Add a new item to the queue.
   * Time Complexity: O(log n)
   * @param {any} item
   * @returns {number} new size of the queue
   */
  push(item) {
    this._heap.push(item);
    this._siftUp();
    return this.size();
  }

  /**
   * Remove and return the highest priority item.
   * Time Complexity: O(log n)
   * @returns {any}
   */
  pop() {
    const size = this.size();
    if (size === 0) return undefined;

    // Swap root with last element
    const root = this._heap[0];
    const tail = this._heap.pop();

    if (this.size() > 0) {
      this._heap[0] = tail;
      this._siftDown();
    }

    return root;
  }

  _siftUp() {
    let nodeIdx = this.size() - 1;
    const node = this._heap[nodeIdx];

    while (nodeIdx > 0) {
      const parentIdx = (nodeIdx - 1) >>> 1;
      const parent = this._heap[parentIdx];

      if (this._comparator(node, parent) < 0) {
        this._heap[nodeIdx] = parent;
        nodeIdx = parentIdx;
      } else {
        break;
      }
    }
    this._heap[nodeIdx] = node;
  }

  _siftDown() {
    let nodeIdx = 0;
    const length = this.size();
    const node = this._heap[0]; // The root being pushed down

    const halfLength = length >>> 1; // Optimization: only need to check nodes with children

    while (nodeIdx < halfLength) {
      const leftChildIdx = (nodeIdx << 1) + 1;
      const rightChildIdx = leftChildIdx + 1;
      let smallerChildIdx = leftChildIdx;
      let smallerChild = this._heap[leftChildIdx];

      if (rightChildIdx < length) {
        const rightChild = this._heap[rightChildIdx];
        if (this._comparator(rightChild, smallerChild) < 0) {
          smallerChildIdx = rightChildIdx;
          smallerChild = rightChild;
        }
      }

      // If the node is already smaller than the smallest child, we are done
      if (this._comparator(node, smallerChild) <= 0) {
        break;
      }

      this._heap[nodeIdx] = smallerChild;
      nodeIdx = smallerChildIdx;
    }

    this._heap[nodeIdx] = node;
  }

  _compare(a, b) {
    return this._comparator(a, b);
  }
}
