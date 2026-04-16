class PriorityQueue {
  constructor() {
    this.heap = [];
  }

  // Insert a new complaint into the heap
  insert(complaint) {
    this.heap.push(complaint);
    this.bubbleUp(this.heap.length - 1);
  }

  // Move the newly added element up to its correct position
  bubbleUp(index) {
    while (index > 0) {
      let parentIndex = Math.floor((index - 1) / 2);
      
      // Compare based on the 'priority' field (3 is higher than 1)
      if (this.heap[parentIndex].priority >= this.heap[index].priority) break;
      
      // Swap if the current complaint has a higher priority than its parent
      [this.heap[parentIndex], this.heap[index]] = [this.heap[index], this.heap[parentIndex]];
      index = parentIndex;
    }
  }

  // Remove and return the complaint with the highest priority
  extractMax() {
    if (this.heap.length === 0) return null;
    if (this.heap.length === 1) return this.heap.pop();

    const max = this.heap[0];
    this.heap[0] = this.heap.pop(); // Replace root with the last element
    this.sinkDown(0);
    return max;
  }

  // Move the root element down to its correct position
  sinkDown(index) {
    let maxIndex = index;
    const length = this.heap.length;

    while (true) {
      let leftChildIndex = 2 * index + 1;
      let rightChildIndex = 2 * index + 2;

      if (leftChildIndex < length && this.heap[leftChildIndex].priority > this.heap[maxIndex].priority) {
        maxIndex = leftChildIndex;
      }
      if (rightChildIndex < length && this.heap[rightChildIndex].priority > this.heap[maxIndex].priority) {
        maxIndex = rightChildIndex;
      }

      if (maxIndex !== index) {
        // Swap
        [this.heap[index], this.heap[maxIndex]] = [this.heap[maxIndex], this.heap[index]];
        index = maxIndex;
      } else {
        break;
      }
    }
  }
}

module.exports = PriorityQueue;