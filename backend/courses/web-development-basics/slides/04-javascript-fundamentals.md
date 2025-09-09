# JavaScript Fundamentals

JavaScript adds interactivity to web pages.

## Variables and Functions:
```javascript
// Variables
let message = "Hello, World!";
const PI = 3.14159;

// Functions
function greet(name) {
    return `Hello, ${name}!`;
}

// Modern arrow functions
const add = (a, b) => a + b;

console.log(greet("Developer"));
console.log(add(2, 3));
```

## DOM Manipulation:
```javascript
document.getElementById('button')
    .addEventListener('click', () => {
        alert('Button clicked!');
    });
```