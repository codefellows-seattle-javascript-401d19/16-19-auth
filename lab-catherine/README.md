# Code Fellows: Seattle 401 JavaScript - 401d19

##  Lab 17 Authorization

### Author:
 Catherine Looper

### Motivation

In this project, I built a Binary Tree with three methods: A find method that uses in-order traversal. A toString method that uses pre-order traversal, and a toArray method that uses post-order traversal. 

### Big O

#### Time

This project uses O(n) in time where n is the nodes in the binary tree. The functions are recursive.

#### Space/Memory

This project uses O(n) in space/memory where n represents the nodes returned. 
 
Memory: relative to the height of the binary tree (the height of this binary tree is 2 (at one)) Every time you traverse you are creating a stack frame

### Build

#### .find Method

BinaryTree.prototype.find is a prototype method on the BinaryTree constructor that expects a parameter of 'value'. The value argument must be passed as a number or an error will be thrown. The method accepts a value and will find and return the first node containing that value. If the value is not found in the Binary Tree, then it will return null.

#### .toString Method

BinaryTree.prototype.toString is a prototype method on the BinaryTree constructor that does not expect parameters. The toString method will take the nodes from the Binary Tree and return the concatenated values separated by newlines in to a string. The Binary Tree must not be null in order to run this function.

#### .toArray Method

BinaryTree.prototype.toArray is a prototype method on the BinaryTree constructor that does not expect parameters. The toArray method will take the nodes from the Binary Tree and return an array containing all of the elements in the binary tree. The Binary Tree must not be null in order to run this function. 

#### Test Module

The test module has 3 tests for each of the methods on the BinaryTree constructor: .find, .toString, and .toArray.


### Limitations

To use this app - it is assumed that the user has familiarity with the tech and frameworks listed below. 

### Code Style

Standard JavaScript with ES6

### Tech/Framework used

* JavaScript / ES6
* Node.js
* Jest
* Eslint

### How to use?

* Step 1. Fork and Clone the Repository.
* Step 2. `npm install`.
* Step 3. to test the API, open a second terminal window and run the command `npm run test`.

### Credits

* Code Fellows / Vinicio Vladimir Sanchez Trejo for providing the demo code as reference.

### License

MIT © Catherine Looper