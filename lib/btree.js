'use strict';

const DEFAULT_DEGREE = 6; // min degree of b-tree.
// All vertices except the root have [degree ... 2 * degree] child nodes
// And [degree - 1 ... 2 * degree - 1] + 1 "empty" elements

class Element {
  constructor(key, data, child = null) {
    this.key = key;
    this.data = data;
    this.child = child;
  }
}

const empty = child => new Element(undefined, undefined, child);

const splitNode = (parent, index) => {
  const node = parent[index].child;
  const len = node.length;
  const newLeftNode = node.splice(0, len / 2 - 1); // First half
  const mid = node.shift();
  newLeftNode.push(empty(mid.child));
  mid.child = newLeftNode;
  parent.splice(index, 0, mid);
  return parent;
};

const isLeaf = node => !node[0].child;

const binarySearch = (node, key) => {
  let start = 0;
  let end = node.length - 1;
  while (start <= end) {
    const i = (start + end) >> 1;
    const itemKey = node[i].key;
    if (key > itemKey) start = i + 1;
    else if (itemKey === undefined || key < itemKey) end = i - 1;
    else return [true, i];
  }
  return [false, start];
};

function* inorderTraversal(start, finish, currNode) {
  const startIndex = start === undefined ? 0 : binarySearch(currNode, start)[1];
  const finishIndex =
    finish === undefined
      ? currNode.length - 1
      : binarySearch(currNode, finish)[1];
  if (isLeaf(currNode)) {
    for (let currIndex = startIndex; currIndex < finishIndex; currIndex++) {
      yield currNode[currIndex].data;
    }
  } else {
    for (let currIndex = startIndex; currIndex < finishIndex; currIndex++) {
      const currElement = currNode[currIndex];
      yield* inorderTraversal(start, finish, currElement.child);
      yield currElement.data;
    }
    yield* inorderTraversal(start, finish, currNode[finishIndex].child);
  }
}

const joinNodes = (parent, firstNodeIndex, secondNodeIndex) => {
  const firstNode = parent[firstNodeIndex].child;
  const secondNode = parent[secondNodeIndex].child;
  const mid = parent.splice(firstNodeIndex, 1)[0];
  mid.child = firstNode.pop().child;
  secondNode.splice(0, 0, ...firstNode, mid);
  return secondNode;
};

const growChild = (parent, childIndex) => {
  const parentElement = parent[childIndex];
  const node = parentElement.child;
  const minDegree = node.length;
  if (childIndex > 0) {
    // If we have left neighbor
    const leftNeighbor = parent[childIndex - 1].child;
    if (leftNeighbor.length > minDegree) {
      const extractedElement = leftNeighbor.splice(
        leftNeighbor.length - 2,
        1
      )[0];
      const insertedElement = new Element(
        parent[childIndex - 1].key,
        parent[childIndex - 1].data,
        leftNeighbor[leftNeighbor.length - 1].child
      );
      leftNeighbor[leftNeighbor.length - 1].child = extractedElement.child;
      extractedElement.child = leftNeighbor;
      parent.splice(childIndex - 1, 1, extractedElement);
      node.unshift(insertedElement);
      return node;
    }
  }
  if (childIndex < parent.length - 1) {
    // If we have right neighbor
    // parent.length - 1 means that we now on the rightmost element
    const rightNeighbor = parent[childIndex + 1].child;
    if (rightNeighbor.length > minDegree) {
      const extractedElement = rightNeighbor.shift();
      const insertedElement = new Element(
        parentElement.key,
        parentElement.data,
        node[node.length - 1].child
      );
      node[node.length - 1].child = extractedElement.child;
      extractedElement.child = node;
      parent.splice(childIndex, 1, extractedElement);
      node.splice(node.length - 1, 0, insertedElement);
      return node;
    }
    return joinNodes(parent, childIndex, childIndex + 1);
  }
  return joinNodes(parent, childIndex - 1, childIndex);
};

// Get the minimal upper, or the maximum lover node for some given node
//   node - some given node
//   minDegree - value of bTree.minDegree for tree
//   upper - boolean: true - upperLimit, false - lowerLimit
// Result: upperLimit or lowerLimit node
const extractLimit = (node, minDegree, upper) => {
  let currNode = node;
  while (!isLeaf(currNode)) {
    const index = upper ? 0 : currNode.length - 1;
    let nextNode = currNode[index].child;
    if (nextNode.length === minDegree) {
      nextNode = growChild(currNode, index);
    }
    currNode = nextNode;
  }
  const index = upper ? 0 : currNode.length - 2;
  return currNode.splice(index, 1)[0];
};

const deleteElement = (node, elementIndex, minDegree) => {
  const element = node[elementIndex];
  const deletedData = element.data;
  const leftChild = element.child;
  const rightChild = node[elementIndex + 1].child;
  if (isLeaf(node)) {
    return node.splice(elementIndex, 1)[0].data;
  }
  if (leftChild.length > minDegree) {
    const lowerLimit = extractLimit(leftChild, minDegree, false);
    element.key = lowerLimit.key;
    element.data = lowerLimit.data;
  } else if (rightChild.length > minDegree) {
    const upperLimit = extractLimit(rightChild, minDegree, true);
    element.key = upperLimit.key;
    element.data = upperLimit.data;
  } else {
    joinNodes(node, elementIndex, elementIndex + 1);
    rightChild.splice(minDegree - 1, 1);
  }
  return deletedData;
};

class BTree {
  constructor(degree = DEFAULT_DEGREE) {
    this.root = [empty()];
    this.minDegree = degree;
  }

  get(key) {
    let currNode = this.root;
    while (currNode) {
      const [found, i] = binarySearch(currNode, key);
      if (found) {
        return currNode[i].data;
      }
      currNode = currNode[i].child;
    }
    return undefined;
  }

  set(key, data) {
    const newElement = new Element(key, data);
    if (this.root.length === 1) {
      this.root.unshift(newElement);
      return this;
    }
    if (this.root.length === this.minDegree * 2) {
      this.root = [empty(this.root)];
      splitNode(this.root, 0);
    }
    let currNode = this.root;
    while (true) {
      const [found, nextNodeIndex] = binarySearch(currNode, key);
      if (found) {
        currNode[nextNodeIndex].data = data;
        return this;
      }
      if (isLeaf(currNode)) {
        currNode.splice(nextNodeIndex, 0, newElement);
        return this;
      }
      let nextNode = currNode[nextNodeIndex].child;
      if (nextNode.length === this.minDegree * 2) {
        splitNode(currNode, nextNodeIndex);
        const element = currNode[nextNodeIndex];
        if (element.key === key) {
          element.data = data;
          return this;
        }
        if (element.key > key) {
          nextNode = element.child;
        }
      }
      currNode = nextNode;
    }
  }

  iterator(start, finish) {
    return inorderTraversal(start, finish, this.root);
  }

  remove(key) {
    let currNode = this.root;
    while (currNode) {
      const [found, index] = binarySearch(currNode, key);
      if (found) {
        const deletedData = deleteElement(currNode, index, this.minDegree);
        if (this.root.length === 1 && this.root[0].child) {
          this.root = this.root[0].child;
        }
        return deletedData;
      } else {
        let nextNode = currNode[index].child;
        if (nextNode && nextNode.length === this.minDegree) {
          nextNode = growChild(currNode, index);
        }
        currNode = nextNode;
      }
    }
    if (this.root.length === 1 && this.root[0].child) {
      this.root = this.root[0].child;
    }
    return undefined;
  }
}

module.exports = {
  BTree,
};
