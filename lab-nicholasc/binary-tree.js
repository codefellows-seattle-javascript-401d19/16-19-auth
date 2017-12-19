'use strict';

class TreeNode {
  constructor(value) {
    this.value = value;
    this.left = null;
    this.right = null;
  }
}

class BinaryTree {
  constructor() {
    this.root = null;
  }
  add(value) {
    if(this.root === null)
      return this.root = new TreeNode(value);
    this._add(this.root, value);
  }
  _add(node, value) {
    if(value < node.value) {
      if(!node.left)
        return node.left = new TreeNode(value);
      return this._add(node.left, value);
    }
    if(value > node.value){
      if(!node.right)
        return node.right = new TreeNode(value);
      return this._add(node.right, value);
    }
  }

  contains(value) {
    if(this.root === null)
      return false;
    return this._contains(this.root, value);
  }

  _contains(node, value) {
    if(!node)
      return false;
    if(node.value === value)
      return true;
    if(value < node.value)
      return this._contains(node.left, value);
    if(value > this.value)
      return this._contains(node.right, value);

  }
}
