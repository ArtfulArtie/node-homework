# Node.js Fundamentals

## What is Node.js?
Node.js is an environment that allows JavaScript to run outside of a web browser. It uses a V8 JavaScript engine and gives the user tools for building server-side applications, APIs, and command-line programs.
## How does Node.js differ from running JavaScript in the browser?
JavaScript is most often used to make web pages interactive. JavaScript can also be used for things like DOM and window objects. Node.js runs JavaScript outside the browser and provides access to the file system, operating system information, and server-related features. Node.js uses global instead of the browser's window object.

## What is the V8 engine, and how does Node use it?
V8 is the JavaScript engine developed by Google that executes JavaScript code. Aside from running JavaScript outside of the browser V* also allows additional APIs that allow programs to work with files, the operating system, and network connections.

## What are some key use cases for Node.js?
Node.js is commonly used to build web servers, REST APIs, command-line tools, real-time applications such as chat apps, and applications that process many asynchronous operations.

## Explain the difference between CommonJS and ES Modules. Give a code example of each.

**CommonJS (default in Node.js):**
```js
const path = require('path');

module.exports = path;
```

**ES Modules (supported in modern Node.js):**
```js
import path from 'node:path';

export default path;
``` 