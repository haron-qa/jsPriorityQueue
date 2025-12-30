/**
 * Comparator function that returns true if 'a' has higher priority than 'b'.
 */
export type Comparator<T> = (a: T, b: T) => boolean;

export default class PriorityQueue<T> {
    /**
     * Creates a new PriorityQueue.
     * @param comparator Function that defines the sort order. Returns true if a should come before b. Default is MinHeap for numbers ((a, b) => a < b).
     */
    constructor(comparator?: Comparator<T>);

    /**
     * Returns the number of items in the queue.
     */
    size(): number;

    /**
     * Checks if the queue is empty.
     */
    isEmpty(): boolean;

    /**
     * View the highest priority item without removing it.
     */
    peek(): T | undefined;

    /**
     * Add a new item to the queue.
     * @param item The item to add.
     * @returns The new size of the queue.
     */
    push(item: T): number;

    /**
     * Remove and return the highest priority item.
     * @returns The removed item, or undefined if the queue is empty.
     */
    pop(): T | undefined;

    /**
     * Replace the heap content with provided array and heapify it.
     * More efficient than pushing items one by one.
     * Time Complexity: O(n)
     * @param arr Array of items to heapify.
     */
    heapify(arr: T[]): void;
}
