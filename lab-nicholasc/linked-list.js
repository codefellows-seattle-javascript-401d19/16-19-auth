'use strict';

class ListNode {
  constructor(value, next) {
    this.value = value;
    this.next = next;
  }
}


class LinkedList {
  constructor(value, next) {
    this.root = null;
  }

  isEmpty() {
    return this.root === null;
  }
  toString() {
    this._toString(this.root);
  }
  _toString(node) {
    console.log(node.next);
    if(!node)
      return '';
    if(node.next === undefined)
      return;
    if(node.next !== undefined)
      return `${node.value} ${this._toString(node.next)}`;
  }
}
let ll = new LinkedList();
ll.root = new ListNode(1, new ListNode(2, new ListNode(3)));
console.log(ll.toString());
