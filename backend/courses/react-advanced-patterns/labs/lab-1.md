# React Advanced Patterns - Lab 1: Custom Hooks

## 实验目标
学会创建和使用自定义React Hooks，提高代码复用性和组件逻辑的抽象能力。

## 实验环境
- React 18+
- TypeScript
- Node.js 18+
- 代码编辑器

## 实验步骤

### Step 1: 创建useCounter自定义Hook
创建一个管理计数器状态的自定义Hook：

```typescript
// hooks/useCounter.ts
import { useState, useCallback } from 'react';

interface UseCounterReturn {
  count: number;
  increment: () => void;
  decrement: () => void;
  reset: () => void;
  setCount: (value: number) => void;
}

export const useCounter = (initialValue: number = 0): UseCounterReturn => {
  const [count, setCount] = useState<number>(initialValue);

  const increment = useCallback(() => {
    setCount(prev => prev + 1);
  }, []);

  const decrement = useCallback(() => {
    setCount(prev => prev - 1);
  }, []);

  const reset = useCallback(() => {
    setCount(initialValue);
  }, [initialValue]);

  const setValue = useCallback((value: number) => {
    setCount(value);
  }, []);

  return {
    count,
    increment,
    decrement,
    reset,
    setCount: setValue
  };
};
```

### Step 2: 使用useCounter Hook
创建一个使用自定义Hook的组件：

```typescript
// components/CounterDemo.tsx
import React from 'react';
import { useCounter } from '../hooks/useCounter';

const CounterDemo: React.FC = () => {
  const { count, increment, decrement, reset, setCount } = useCounter(0);

  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4">Counter Demo</h2>
      
      <div className="text-center">
        <div className="text-4xl font-mono mb-6">{count}</div>
        
        <div className="space-x-2 mb-4">
          <button
            onClick={decrement}
            className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
          >
            -1
          </button>
          
          <button
            onClick={increment}
            className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
          >
            +1
          </button>
          
          <button
            onClick={reset}
            className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
          >
            Reset
          </button>
        </div>
        
        <input
          type="number"
          value={count}
          onChange={(e) => setCount(Number(e.target.value))}
          className="px-3 py-2 border border-gray-300 rounded"
        />
      </div>
    </div>
  );
};

export default CounterDemo;
```

### Step 3: 创建useLocalStorage Hook
实现一个与localStorage同步的Hook：

```typescript
// hooks/useLocalStorage.ts
import { useState, useEffect } from 'react';

export const useLocalStorage = <T>(
  key: string, 
  initialValue: T
): [T, (value: T | ((val: T) => T)) => void] => {
  // 获取初始值
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(`Error reading localStorage key "${key}":`, error);
      return initialValue;
    }
  });

  // 设置值的函数
  const setValue = (value: T | ((val: T) => T)) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      window.localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      console.error(`Error setting localStorage key "${key}":`, error);
    }
  };

  return [storedValue, setValue];
};
```

### Step 4: 创建useFetch数据获取Hook
实现一个通用的数据获取Hook：

```typescript
// hooks/useFetch.ts
import { useState, useEffect } from 'react';

interface UseFetchState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
}

export const useFetch = <T>(url: string): UseFetchState<T> => {
  const [state, setState] = useState<UseFetchState<T>>({
    data: null,
    loading: true,
    error: null,
  });

  useEffect(() => {
    const fetchData = async () => {
      setState(prev => ({ ...prev, loading: true, error: null }));

      try {
        const response = await fetch(url);
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data: T = await response.json();
        setState({ data, loading: false, error: null });
      } catch (error) {
        setState({
          data: null,
          loading: false,
          error: error instanceof Error ? error.message : 'An error occurred',
        });
      }
    };

    fetchData();
  }, [url]);

  return state;
};
```

## 实验任务

### 必做任务
1. ✅ 实现useCounter自定义Hook
2. ✅ 创建使用useCounter的组件
3. ✅ 实现useLocalStorage Hook
4. ✅ 实现useFetch数据获取Hook
5. ✅ 为所有Hook添加TypeScript类型定义

### 扩展任务
1. 🔄 创建useDebounce Hook
2. 🔄 实现useInterval Hook
3. 🔄 创建useToggle Hook
4. 🔄 实现usePrevious Hook
5. 🔄 添加Hook的单元测试

### 高级扩展
```typescript
// hooks/useDebounce.ts
export const useDebounce = <T>(value: T, delay: number): T => {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
};

// hooks/useToggle.ts
export const useToggle = (initialValue: boolean = false) => {
  const [value, setValue] = useState(initialValue);
  
  const toggle = useCallback(() => setValue(prev => !prev), []);
  const setTrue = useCallback(() => setValue(true), []);
  const setFalse = useCallback(() => setValue(false), []);
  
  return { value, toggle, setTrue, setFalse };
};
```

## 测试你的Hooks

### Hook测试示例
```typescript
// __tests__/useCounter.test.ts
import { renderHook, act } from '@testing-library/react';
import { useCounter } from '../hooks/useCounter';

describe('useCounter', () => {
  it('should initialize with default value', () => {
    const { result } = renderHook(() => useCounter());
    expect(result.current.count).toBe(0);
  });

  it('should increment count', () => {
    const { result } = renderHook(() => useCounter(0));
    
    act(() => {
      result.current.increment();
    });
    
    expect(result.current.count).toBe(1);
  });

  it('should decrement count', () => {
    const { result } = renderHook(() => useCounter(1));
    
    act(() => {
      result.current.decrement();
    });
    
    expect(result.current.count).toBe(0);
  });
});
```

## 验收标准
- [ ] 所有自定义Hook功能正确
- [ ] TypeScript类型定义完整
- [ ] Hook遵循React Hook规则
- [ ] 组件正确使用自定义Hook
- [ ] 代码具有良好的可读性和可维护性

## 参考资料
- [React Hooks官方文档](https://react.dev/reference/react)
- [自定义Hook指南](https://react.dev/learn/reusing-logic-with-custom-hooks)
- [Hook测试最佳实践](https://react-hooks-testing-library.com/)

## 提交要求
提交完整的Hook实现和使用示例，包括测试文件和实验总结报告。