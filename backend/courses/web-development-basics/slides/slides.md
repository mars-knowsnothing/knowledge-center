---
layout: title-slide
theme: minimal
background: "linear-gradient(135deg, #74b9ff 0%, #0984e3 100%)"
---

# Web Development Fundamentals

## Build Your First Modern Websites

Master the essential technologies that power the modern web: HTML, CSS, and JavaScript

### 🌐 Start your journey into web development

---
layout: section
theme: minimal
---

# Course Overview

---
layout: three-column
theme: minimal
---

# What We'll Learn

## 🏗️ Structure with HTML
- **Document Structure** - Semantic HTML elements
- **Content Organization** - Headers, paragraphs, lists
- **Forms & Input** - User interaction elements

## 🎨 Style with CSS
- **Visual Design** - Colors, fonts, and layouts
- **Responsive Design** - Mobile-first approach
- **CSS Grid & Flexbox** - Modern layout techniques

## ⚡ Interact with JavaScript
- **Programming Basics** - Variables, functions, loops
- **DOM Manipulation** - Dynamic content updates
- **Event Handling** - User interaction responses

---
layout: section
theme: minimal
---

# HTML Fundamentals

---
layout: default
theme: minimal
---

# HTML: The Foundation of Web Pages

HTML (HyperText Markup Language) provides the structure and semantic meaning to web content.

## Core Concepts:
- **Elements** - Building blocks of web pages
- **Tags** - Markup that defines elements  
- **Attributes** - Additional information about elements
- **Document Structure** - Hierarchical organization

## Basic HTML Document Structure:

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>My First Web Page</title>
</head>
<body>
    <header>
        <h1>Welcome to Web Development</h1>
    </header>
    
    <main>
        <p>This is my first HTML page with proper structure!</p>
    </main>
    
    <footer>
        <p>&copy; 2024 My Website</p>
    </footer>
</body>
</html>
```

---

# Semantic HTML Elements

Using meaningful HTML elements improves accessibility and SEO.

## Document Structure Elements:

```html
<html>
  <head>
    <!-- Metadata and resources -->
    <meta charset="UTF-8">
    <title>Page Title</title>
    <link rel="stylesheet" href="styles.css">
  </head>
  
  <body>
    <!-- Page header -->
    <header>
      <nav>
        <ul>
          <li><a href="#home">Home</a></li>
          <li><a href="#about">About</a></li>
          <li><a href="#contact">Contact</a></li>
        </ul>
      </nav>
    </header>
    
    <!-- Main content area -->
    <main>
      <section id="home">
        <h1>Welcome to Our Site</h1>
        <article>
          <h2>Latest News</h2>
          <p>Here's what's happening...</p>
        </article>
      </section>
      
      <aside>
        <h3>Quick Links</h3>
        <!-- Sidebar content -->
      </aside>
    </main>
    
    <!-- Page footer -->
    <footer>
      <p>Contact us: info@example.com</p>
    </footer>
  </body>
</html>
```

**Key Semantic Elements:**
- `<header>`, `<nav>`, `<main>`, `<section>`, `<article>`, `<aside>`, `<footer>`
- `<h1>` through `<h6>` for headings hierarchy
- `<p>`, `<ul>`, `<ol>`, `<li>` for content organization

---
layout: section
theme: minimal
---

# CSS Styling

---
layout: two-column
theme: minimal
---

# CSS: Making Websites Beautiful

CSS (Cascading Style Sheets) controls the visual presentation of HTML elements.

## CSS Syntax Structure:
```css
selector {
    property: value;
    property: value;
}
```

## Selectors Types:
- **Element**: `h1 { }`
- **Class**: `.my-class { }`  
- **ID**: `#my-id { }`
- **Attribute**: `[type="text"] { }`
- **Pseudo-class**: `:hover { }`

::right::

## Practical CSS Example:

```css
/* Global styles */
* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}

body {
    font-family: 'Arial', sans-serif;
    line-height: 1.6;
    color: #333;
}

/* Header styles */
header {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    padding: 2rem 0;
    text-align: center;
}

/* Navigation */
nav ul {
    list-style: none;
    display: flex;
    justify-content: center;
    gap: 2rem;
}

nav a {
    color: white;
    text-decoration: none;
    font-weight: 500;
    transition: opacity 0.3s ease;
}

nav a:hover {
    opacity: 0.8;
}

/* Main content */
.container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 1rem;
}

/* Responsive design */
@media (max-width: 768px) {
    nav ul {
        flex-direction: column;
        gap: 1rem;
    }
}
```

---

# Modern CSS Layout Techniques

## Flexbox for One-Dimensional Layouts:

```css
.flex-container {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 1rem;
}

.flex-item {
    flex: 1; /* Grow to fill available space */
}

/* Responsive flex direction */
@media (max-width: 768px) {
    .flex-container {
        flex-direction: column;
    }
}
```

## CSS Grid for Two-Dimensional Layouts:

```css
.grid-container {
    display: grid;
    grid-template-columns: 1fr 2fr 1fr;
    grid-template-rows: auto 1fr auto;
    grid-template-areas: 
        "header header header"
        "sidebar main aside"
        "footer footer footer";
    min-height: 100vh;
    gap: 1rem;
}

.header { grid-area: header; }
.sidebar { grid-area: sidebar; }
.main { grid-area: main; }
.aside { grid-area: aside; }
.footer { grid-area: footer; }

/* Responsive grid */
@media (max-width: 768px) {
    .grid-container {
        grid-template-columns: 1fr;
        grid-template-areas: 
            "header"
            "main"
            "sidebar"
            "aside"
            "footer";
    }
}
```

---
layout: section
theme: minimal
---

# JavaScript Programming

---
layout: default
theme: minimal
---

# JavaScript: Bringing Websites to Life

JavaScript adds interactivity, dynamic behavior, and modern functionality to web pages.

## Modern JavaScript Fundamentals:

```javascript
// Variables and Constants
let userName = "John Doe";           // Can be reassigned
const API_URL = "https://api.example.com";  // Cannot be reassigned
var oldStyle = "avoid var";         // Function-scoped (avoid)

// Modern Function Syntax
function traditionalFunction(name) {
    return `Hello, ${name}!`;
}

// Arrow functions (preferred for most cases)
const greetUser = (name) => `Hello, ${name}!`;

// Functions with multiple parameters
const calculateArea = (width, height) => width * height;

// Functions with default parameters
const createUser = (name, role = 'user') => ({
    name,
    role,
    createdAt: new Date().toISOString()
});

// Usage examples
console.log(greetUser("Alice"));                    // "Hello, Alice!"
console.log(calculateArea(10, 5));                 // 50
console.log(createUser("Bob"));                    // {name: "Bob", role: "user", createdAt: "..."}
console.log(createUser("Admin", "administrator")); // {name: "Admin", role: "administrator", createdAt: "..."}
```

**Key JavaScript Concepts:**
- **Variables**: `let`, `const` for block scope
- **Functions**: Arrow functions for clean syntax
- **Template Literals**: String interpolation with backticks
- **Destructuring**: Extract values from objects/arrays
- **Default Parameters**: Fallback values for function arguments

---

# DOM Manipulation and Events

Interact with HTML elements dynamically using the Document Object Model (DOM).

## Selecting and Modifying Elements:

```javascript
// Selecting elements
const title = document.getElementById('main-title');
const buttons = document.querySelectorAll('.btn');
const firstButton = document.querySelector('.btn');

// Modifying content
title.textContent = 'Welcome to JavaScript!';
title.innerHTML = '<strong>Welcome to JavaScript!</strong>';

// Modifying styles
title.style.color = '#007bff';
title.style.fontSize = '2rem';

// Adding/removing CSS classes
title.classList.add('highlight');
title.classList.remove('old-style');
title.classList.toggle('active');

// Modifying attributes
const image = document.querySelector('img');
image.setAttribute('src', 'new-image.jpg');
image.setAttribute('alt', 'Description of new image');
```

## Event Handling:

```javascript
// Click events
const submitButton = document.getElementById('submit-btn');
submitButton.addEventListener('click', function(event) {
    event.preventDefault(); // Prevent default form submission
    
    const formData = new FormData(document.getElementById('myForm'));
    console.log('Form submitted!', Object.fromEntries(formData));
});

// Modern event handling with arrow functions
const toggleButton = document.querySelector('.toggle-btn');
toggleButton.addEventListener('click', (e) => {
    const menu = document.querySelector('.mobile-menu');
    menu.classList.toggle('show');
});

// Form validation example
const emailInput = document.getElementById('email');
emailInput.addEventListener('input', (e) => {
    const email = e.target.value;
    const isValid = email.includes('@') && email.includes('.');
    
    if (isValid) {
        e.target.classList.remove('error');
        e.target.classList.add('valid');
    } else {
        e.target.classList.remove('valid');
        e.target.classList.add('error');
    }
});
```

---

# Practical JavaScript Examples

## Dynamic Content Loading:

```javascript
// Fetch data from an API
async function loadUserData() {
    try {
        const response = await fetch('https://jsonplaceholder.typicode.com/users');
        const users = await response.json();
        
        displayUsers(users);
    } catch (error) {
        console.error('Error loading users:', error);
        showErrorMessage('Failed to load user data');
    }
}

// Display users in the DOM
function displayUsers(users) {
    const container = document.getElementById('users-container');
    
    const userCards = users.map(user => `
        <div class="user-card">
            <h3>${user.name}</h3>
            <p>Email: ${user.email}</p>
            <p>Website: ${user.website}</p>
        </div>
    `).join('');
    
    container.innerHTML = userCards;
}

// Interactive counter example
class Counter {
    constructor(element) {
        this.element = element;
        this.count = 0;
        this.render();
        this.bindEvents();
    }
    
    render() {
        this.element.innerHTML = `
            <div class="counter">
                <button class="btn-decrease">-</button>
                <span class="count">${this.count}</span>
                <button class="btn-increase">+</button>
                <button class="btn-reset">Reset</button>
            </div>
        `;
    }
    
    bindEvents() {
        this.element.querySelector('.btn-increase').addEventListener('click', () => {
            this.count++;
            this.updateDisplay();
        });
        
        this.element.querySelector('.btn-decrease').addEventListener('click', () => {
            this.count--;
            this.updateDisplay();
        });
        
        this.element.querySelector('.btn-reset').addEventListener('click', () => {
            this.count = 0;
            this.updateDisplay();
        });
    }
    
    updateDisplay() {
        this.element.querySelector('.count').textContent = this.count;
    }
}

// Initialize counter
document.addEventListener('DOMContentLoaded', () => {
    const counterElement = document.getElementById('counter-app');
    new Counter(counterElement);
});
```

---
layout: section
theme: minimal
---

# Building Your First Website

---
layout: image-text
theme: minimal
---

# Putting It All Together

Let's create a complete, responsive website using HTML, CSS, and JavaScript.

## Project Structure:
```
my-website/
├── index.html
├── styles.css
├── script.js
└── assets/
    └── images/
```

## HTML Structure (index.html):
```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>My Personal Website</title>
    <link rel="stylesheet" href="styles.css">
</head>
<body>
    <header class="header">
        <nav class="navbar">
            <div class="nav-brand">My Website</div>
            <button class="nav-toggle" aria-label="Toggle navigation">☰</button>
            <ul class="nav-menu">
                <li><a href="#home">Home</a></li>
                <li><a href="#about">About</a></li>
                <li><a href="#projects">Projects</a></li>
                <li><a href="#contact">Contact</a></li>
            </ul>
        </nav>
    </header>
    
    <main>
        <section id="home" class="hero">
            <h1>Welcome to My Website</h1>
            <p>I'm a web developer passionate about creating amazing experiences.</p>
            <button class="cta-button">Get In Touch</button>
        </section>
        
        <!-- More sections... -->
    </main>
    
    <script src="script.js"></script>
</body>
</html>
```

::right::

## CSS Styling (styles.css):
```css
/* Reset and base styles */
* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}

body {
    font-family: 'Arial', sans-serif;
    line-height: 1.6;
    color: #333;
}

/* Header and Navigation */
.header {
    background: #fff;
    box-shadow: 0 2px 10px rgba(0,0,0,0.1);
    position: fixed;
    width: 100%;
    top: 0;
    z-index: 1000;
}

.navbar {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 1rem 5%;
    max-width: 1200px;
    margin: 0 auto;
}

.nav-menu {
    display: flex;
    list-style: none;
    gap: 2rem;
}

.nav-menu a {
    text-decoration: none;
    color: #333;
    font-weight: 500;
    transition: color 0.3s ease;
}

.nav-menu a:hover {
    color: #007bff;
}

/* Hero section */
.hero {
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    text-align: center;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
}

.hero h1 {
    font-size: 3rem;
    margin-bottom: 1rem;
}

.cta-button {
    background: #007bff;
    color: white;
    padding: 1rem 2rem;
    border: none;
    border-radius: 5px;
    font-size: 1.1rem;
    cursor: pointer;
    transition: background 0.3s ease;
}

.cta-button:hover {
    background: #0056b3;
}
```

---

# JavaScript Interactivity (script.js):

```javascript
// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    
    // Mobile navigation toggle
    const navToggle = document.querySelector('.nav-toggle');
    const navMenu = document.querySelector('.nav-menu');
    
    navToggle.addEventListener('click', () => {
        navMenu.classList.toggle('active');
    });
    
    // Smooth scrolling for navigation links
    const navLinks = document.querySelectorAll('.nav-menu a[href^="#"]');
    
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            
            const targetId = link.getAttribute('href').substring(1);
            const targetSection = document.getElementById(targetId);
            
            if (targetSection) {
                targetSection.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
            
            // Close mobile menu after click
            navMenu.classList.remove('active');
        });
    });
    
    // Contact form handling
    const ctaButton = document.querySelector('.cta-button');
    
    ctaButton.addEventListener('click', () => {
        // Create and show a simple contact modal
        showContactModal();
    });
    
    function showContactModal() {
        // Create modal elements
        const modal = document.createElement('div');
        modal.className = 'modal';
        modal.innerHTML = `
            <div class="modal-content">
                <span class="close">&times;</span>
                <h2>Get In Touch</h2>
                <form id="contact-form">
                    <input type="text" placeholder="Your Name" required>
                    <input type="email" placeholder="Your Email" required>
                    <textarea placeholder="Your Message" required></textarea>
                    <button type="submit">Send Message</button>
                </form>
            </div>
        `;
        
        document.body.appendChild(modal);
        
        // Handle modal close
        const closeBtn = modal.querySelector('.close');
        closeBtn.addEventListener('click', () => {
            document.body.removeChild(modal);
        });
        
        // Handle form submission
        const form = modal.querySelector('#contact-form');
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            alert('Message sent! (This is a demo)');
            document.body.removeChild(modal);
        });
    }
    
    // Add scroll effect to header
    window.addEventListener('scroll', () => {
        const header = document.querySelector('.header');
        if (window.scrollY > 100) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });
});
```

---
layout: title-slide
theme: minimal
---

# 🎉 Congratulations!

## You've Learned Web Development Fundamentals

### What You Now Master:

- **🏗️ HTML Structure** - Semantic elements and document organization
- **🎨 CSS Styling** - Visual design, layouts, and responsiveness
- **⚡ JavaScript Programming** - Dynamic functionality and user interaction
- **🌐 Complete Websites** - Putting all technologies together

### **You're ready to build amazing websites!** 🚀

---
layout: section
theme: minimal
---

# Next Steps & Resources

---

# Continue Your Web Development Journey

## 🚀 **Advanced Topics to Explore:**
- **CSS Frameworks** - Bootstrap, Tailwind CSS
- **JavaScript Frameworks** - React, Vue.js, Angular
- **Backend Development** - Node.js, Python, PHP
- **Database Integration** - MySQL, MongoDB
- **Version Control** - Git and GitHub

## 🛠️ **Recommended Tools:**
- **Code Editors** - VS Code, WebStorm
- **Browser DevTools** - Chrome/Firefox developer tools
- **Design Tools** - Figma, Adobe XD
- **Hosting Platforms** - Netlify, Vercel, GitHub Pages

## 🎯 **Practice Projects:**
- Personal portfolio website
- Todo list application
- Weather app with API integration
- Blog website with dynamic content
- E-commerce product showcase

## 📚 **Learning Resources:**
- **MDN Web Docs** - Comprehensive web technology documentation
- **freeCodeCamp** - Interactive coding challenges
- **CSS-Tricks** - CSS techniques and best practices
- **JavaScript.info** - Modern JavaScript tutorials

### 💡 **Pro Tip:** Build projects to practice what you've learned. Start small and gradually add more features as you become more confident!