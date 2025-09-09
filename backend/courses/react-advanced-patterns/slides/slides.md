---
layout: title-slide
theme: tech
background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
---

# Advanced React Patterns

## Master Modern React Development

Building flexible, performant, and maintainable React applications with advanced architectural patterns

### 🚀 Transform your React skills to the next level

---
layout: section
theme: tech
---

# Course Overview

---
layout: three-column
theme: tech
---

# What We'll Master

## 🏗️ Architecture Patterns
- **Compound Components** - Flexible, composable APIs
- **Render Props** - Logic sharing between components  
- **Higher-Order Components** - Component enhancement patterns

## ⚡ Performance Patterns
- **Custom Hooks** - Reusable stateful logic
- **Context API** - Efficient global state management
- **Memoization** - React.memo and useMemo techniques

## 🎯 Best Practices
- **Code Organization** - Scalable project structure
- **Type Safety** - TypeScript integration
- **Testing Strategies** - Component testing approaches

---
layout: section
theme: tech
---

# Compound Components Pattern

---
layout: default
theme: tech
---

# Building Flexible Component APIs

The compound component pattern allows you to create components with flexible, declarative APIs similar to native HTML elements.

## Core Concept
```jsx
// Instead of prop drilling...
<Toggle 
  showOn={true}
  showOff={true} 
  onText="ON"
  offText="OFF"
  buttonText="Toggle"
/>

// Use compound components
<Toggle>
  <Toggle.On>The switch is ON</Toggle.On>
  <Toggle.Off>The switch is OFF</Toggle.Off>
  <Toggle.Button>Toggle Switch</Toggle.Button>
</Toggle>
```

**Key Benefits:**
- 🔧 **Flexibility** - Users compose exactly what they need
- 🎨 **Customization** - Easy styling and behavior modification  
- 📚 **Intuitive API** - Familiar HTML-like structure

---

# Implementation Deep Dive

## Complete Toggle Component

```jsx
import React, { useState, createContext, useContext } from 'react';

// 1. Create context for state sharing
const ToggleContext = createContext();

function Toggle({ children, onToggle, defaultOn = false }) {
  const [on, setOn] = useState(defaultOn);
  
  const toggle = () => {
    setOn(!on);
    onToggle?.(on);
  };

  const contextValue = { on, toggle };
  
  return (
    <ToggleContext.Provider value={contextValue}>
      <div className="toggle-container">
        {children}
      </div>
    </ToggleContext.Provider>
  );
}

// 2. Custom hook for consuming context
function useToggle() {
  const context = useContext(ToggleContext);
  if (!context) {
    throw new Error('Toggle compound components must be used within <Toggle>');
  }
  return context;
}

// 3. Compound component definitions
Toggle.On = function ToggleOn({ children }) {
  const { on } = useToggle();
  return on ? children : null;
};

Toggle.Off = function ToggleOff({ children }) {
  const { on } = useToggle();
  return on ? null : children;
};

Toggle.Button = function ToggleButton({ children, ...props }) {
  const { on, toggle } = useToggle();
  return (
    <button 
      onClick={toggle} 
      className={`toggle-btn ${on ? 'active' : 'inactive'}`}
      {...props}
    >
      {children}
    </button>
  );
};

export default Toggle;
```

---
layout: section
theme: tech
---

# Render Props Pattern

---
layout: two-column
theme: tech
---

# Sharing Logic with Render Props

The render props pattern enables you to share stateful logic between components using a function as a prop.

## Traditional Approach Problems:
- **Logic Duplication** across components
- **Tight Coupling** between logic and UI
- **Hard to Test** mixed concerns

::right::

## Render Props Solution:
```jsx
// Reusable logic component
<DataFetcher url="/api/users">
  {({ data, loading, error }) => (
    <div>
      {loading && <Spinner />}
      {error && <Error message={error} />}
      {data && <UserList users={data} />}
    </div>
  )}
</DataFetcher>

// Same logic, different UI
<DataFetcher url="/api/posts">
  {({ data, loading }) => loading 
    ? <LoadingCard /> 
    : <PostGrid posts={data} />
  }
</DataFetcher>
```

---

# Advanced Mouse Tracker Example

```jsx
class MouseTracker extends React.Component {
  state = { x: 0, y: 0 };

  handleMouseMove = (event) => {
    this.setState({
      x: event.clientX,
      y: event.clientY
    });
  }

  render() {
    return (
      <div 
        style={{ height: '100vh' }} 
        onMouseMove={this.handleMouseMove}
      >
        {this.props.children(this.state)}
      </div>
    );
  }
}

// Usage Examples:
function App() {
  return (
    <MouseTracker>
      {({ x, y }) => (
        <div>
          <h1>Move your mouse around!</h1>
          <p>Current position: ({x}, {y})</p>
          
          {/* Position-based styling */}
          <div 
            style={{
              position: 'absolute',
              left: x - 10,
              top: y - 10,
              width: 20,
              height: 20,
              background: `hsl(${x % 360}, 70%, 50%)`,
              borderRadius: '50%',
              pointerEvents: 'none'
            }}
          />
        </div>
      )}
    </MouseTracker>
  );
}
```

---
layout: section
theme: tech
---

# Custom Hooks Revolution

---

# Extract Logic into Reusable Hooks

Custom hooks are the modern way to share stateful logic between components.

## Evolution of Logic Sharing:

```jsx
// ❌ Class component with mixed concerns
class Counter extends Component {
  state = { count: 0 }
  increment = () => this.setState(s => ({ count: s.count + 1 }))
  // ... render logic mixed with state logic
}

// ✅ Custom hook separates concerns
function useCounter(initialValue = 0, step = 1) {
  const [count, setCount] = useState(initialValue);
  
  const increment = useCallback(() => setCount(c => c + step), [step]);
  const decrement = useCallback(() => setCount(c => c - step), [step]);
  const reset = useCallback(() => setCount(initialValue), [initialValue]);
  const set = useCallback((value) => setCount(value), []);
  
  return { 
    count, 
    increment, 
    decrement, 
    reset, 
    set,
    isZero: count === 0,
    isNegative: count < 0
  };
}

// ✅ Clean component focused on rendering
function Counter() {
  const { count, increment, decrement, reset, isZero } = useCounter(0, 1);
  
  return (
    <div className="counter">
      <h2>Count: {count}</h2>
      <button onClick={increment}>+1</button>
      <button onClick={decrement}>-1</button>
      <button onClick={reset} disabled={isZero}>Reset</button>
    </div>
  );
}
```

---

# Advanced Custom Hooks

## Data Fetching Hook with Caching

```jsx
function useApi(url, options = {}) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  // Cache for preventing duplicate requests
  const cache = useRef(new Map());
  
  const fetchData = useCallback(async () => {
    // Check cache first
    if (cache.current.has(url)) {
      setData(cache.current.get(url));
      return;
    }
    
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch(url, options);
      if (!response.ok) throw new Error(response.statusText);
      
      const result = await response.json();
      
      // Cache the result
      cache.current.set(url, result);
      setData(result);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [url, options]);
  
  useEffect(() => {
    if (url) fetchData();
  }, [url, fetchData]);
  
  const refetch = useCallback(() => {
    cache.current.delete(url);
    fetchData();
  }, [url, fetchData]);
  
  return { data, loading, error, refetch };
}

// Usage
function UserProfile({ userId }) {
  const { data: user, loading, error, refetch } = useApi(`/api/users/${userId}`);
  
  if (loading) return <ProfileSkeleton />;
  if (error) return <ErrorMessage error={error} onRetry={refetch} />;
  
  return <UserCard user={user} />;
}
```

---
layout: section
theme: tech
---

# Context API Mastery

---
layout: image-text
theme: tech
---

# Global State Management Done Right

## Context API Best Practices

The Context API is perfect for sharing data that needs to be accessible by many components at different nesting levels.

### When to Use Context:
- **Theme/UI preferences** - Dark/light mode
- **Authentication state** - Current user data  
- **Language/i18n** - Locale settings
- **Global app settings** - Feature flags

### Performance Considerations:
- **Separate contexts** for different data types
- **Use multiple providers** to prevent unnecessary re-renders
- **Memoize context values** to avoid object recreation

::right::

## Advanced Theme Context Implementation

```jsx
// 1. Create strongly typed context
const ThemeContext = createContext({
  theme: 'light',
  colors: {},
  toggleTheme: () => {},
  setColor: () => {}
});

// 2. Theme configuration
const themes = {
  light: {
    background: '#ffffff',
    text: '#000000',
    primary: '#007bff',
    secondary: '#6c757d'
  },
  dark: {
    background: '#1a1a1a',
    text: '#ffffff', 
    primary: '#0d6efd',
    secondary: '#495057'
  }
};

// 3. Provider with optimized updates
function ThemeProvider({ children }) {
  const [theme, setTheme] = useState('light');
  const [customColors, setCustomColors] = useState({});
  
  const toggleTheme = useCallback(() => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  }, []);
  
  const setColor = useCallback((key, value) => {
    setCustomColors(prev => ({ ...prev, [key]: value }));
  }, []);
  
  // Memoize the context value
  const value = useMemo(() => ({
    theme,
    colors: { ...themes[theme], ...customColors },
    toggleTheme,
    setColor
  }), [theme, customColors, toggleTheme, setColor]);
  
  return (
    <ThemeContext.Provider value={value}>
      <div className={`theme-${theme}`}>
        {children}
      </div>
    </ThemeContext.Provider>
  );
}

// 4. Custom hook for consuming context
function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider');
  }
  return context;
}
```

---
layout: section
theme: tech
---

# Performance Optimization

---

# React Performance Patterns

## Preventing Unnecessary Re-renders

```jsx
// ❌ Component re-renders on every parent update
function ExpensiveList({ items, onItemClick }) {
  console.log('ExpensiveList rendered'); // This will log too often
  
  return (
    <ul>
      {items.map(item => (
        <li key={item.id} onClick={() => onItemClick(item)}>
          {/* Heavy computation or rendering */}
          {performExpensiveCalculation(item)}
        </li>
      ))}
    </ul>
  );
}

// ✅ Optimized with React.memo and useMemo
const OptimizedList = React.memo(function ExpensiveList({ items, onItemClick }) {
  console.log('OptimizedList rendered'); // Only when items or onItemClick changes
  
  // Memoize expensive computations
  const processedItems = useMemo(() => {
    return items.map(item => ({
      ...item,
      computed: performExpensiveCalculation(item)
    }));
  }, [items]);
  
  return (
    <ul>
      {processedItems.map(item => (
        <OptimizedListItem 
          key={item.id} 
          item={item}
          onClick={onItemClick}
        />
      ))}
    </ul>
  );
});

// ✅ Memoized list item component
const OptimizedListItem = React.memo(function ListItem({ item, onClick }) {
  const handleClick = useCallback(() => {
    onClick(item);
  }, [item, onClick]);
  
  return (
    <li onClick={handleClick}>
      {item.computed}
    </li>
  );
});
```

---

# Advanced Optimization Techniques

## Code Splitting with Suspense

```jsx
// Lazy load heavy components
const HeavyChart = lazy(() => import('./HeavyChart'));
const DataTable = lazy(() => import('./DataTable'));

function Dashboard({ activeTab }) {
  return (
    <div className="dashboard">
      <nav>
        <TabButton active={activeTab === 'chart'}>Chart</TabButton>
        <TabButton active={activeTab === 'table'}>Table</TabButton>
      </nav>
      
      <main>
        <Suspense fallback={<DashboardSkeleton />}>
          {activeTab === 'chart' && <HeavyChart />}
          {activeTab === 'table' && <DataTable />}
        </Suspense>
      </main>
    </div>
  );
}

// Virtual scrolling for large lists
function VirtualizedList({ items, itemHeight = 50 }) {
  const [scrollTop, setScrollTop] = useState(0);
  const containerHeight = 400;
  
  const visibleStart = Math.floor(scrollTop / itemHeight);
  const visibleEnd = Math.min(
    visibleStart + Math.ceil(containerHeight / itemHeight),
    items.length
  );
  
  const visibleItems = items.slice(visibleStart, visibleEnd);
  
  return (
    <div 
      style={{ height: containerHeight, overflow: 'auto' }}
      onScroll={(e) => setScrollTop(e.target.scrollTop)}
    >
      <div style={{ height: items.length * itemHeight, position: 'relative' }}>
        {visibleItems.map((item, index) => (
          <div
            key={item.id}
            style={{
              position: 'absolute',
              top: (visibleStart + index) * itemHeight,
              height: itemHeight,
              width: '100%'
            }}
          >
            {item.content}
          </div>
        ))}
      </div>
    </div>
  );
}
```

---
layout: title-slide
theme: tech
---

# 🎉 Mastery Achieved!

## You've Conquered Advanced React Patterns

### What You Now Know:

- **🏗️ Compound Components** - Building flexible, composable APIs
- **⚡ Render Props** - Sharing logic elegantly between components
- **🪝 Custom Hooks** - Creating reusable stateful logic
- **🌐 Context API** - Managing global state efficiently  
- **⚡ Performance** - Optimization techniques for production apps

### **Keep building amazing React applications!** 🚀

---
layout: section  
theme: tech
---

# Resources & Next Steps

---

# Continue Your React Journey

## 📚 **Advanced Topics to Explore:**
- **Server Components** - React 18+ features
- **Concurrent Rendering** - Suspense and transitions
- **State Machines** - XState integration patterns
- **Testing Strategies** - Jest, Testing Library, Playwright

## 🛠️ **Recommended Tools:**
- **TypeScript** - Type safety and better DX
- **React Developer Tools** - Debug performance issues
- **Storybook** - Component documentation
- **React Query** - Server state management

## 🎯 **Practice Projects:**
- Build a component library using compound components
- Create a theme system with Context API
- Implement virtual scrolling for large datasets
- Design render props for data fetching

### 💡 **Pro Tip:** These patterns work great together - combine compound components with custom hooks and context for maximum flexibility!