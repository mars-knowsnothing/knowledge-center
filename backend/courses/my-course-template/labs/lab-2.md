# Lab 2: Intermediate Implementation - Building on Fundamentals

## Lab Objectives
Building on Lab 1 knowledge, you will:
- Implement intermediate-level features
- Work with data structures and algorithms
- Practice debugging and testing techniques
- Create reusable components

## Prerequisites
- **Completed**: Lab 1 successfully
- **Knowledge**: Understanding of basic concepts
- **Skills**: Comfortable with basic operations
- **Reading**: Modules 1-2 slides completed

## Lab Environment
- **Estimated Time**: 45-60 minutes
- **Difficulty Level**: Intermediate
- **Tools Required**: Same as Lab 1 plus debugging tools

## Instructions

### Part A: Data Processing (20 minutes)

#### Step 1: Data Structures
Create a more complex data handling system:

```javascript
// data-handler.js
class DataProcessor {
  constructor() {
    this.data = [];
    this.filters = [];
  }
  
  addData(item) {
    this.data.push({
      id: Date.now(),
      content: item,
      timestamp: new Date()
    });
  }
  
  processData() {
    return this.data
      .filter(item => this.applyFilters(item))
      .map(item => this.transformItem(item));
  }
  
  applyFilters(item) {
    // Implement filtering logic
    return true; // Placeholder
  }
  
  transformItem(item) {
    // Implement transformation logic
    return {
      ...item,
      processed: true
    };
  }
}
```

#### Step 2: Configuration Management
Create a configuration system:

```json
{
  "app": {
    "name": "Lab 2 Project",
    "version": "1.1.0",
    "debug": true
  },
  "processing": {
    "batchSize": 10,
    "timeout": 5000,
    "retryAttempts": 3
  },
  "features": {
    "enableLogging": true,
    "enableCache": false,
    "enableMetrics": true
  }
}
```

### Part B: Error Handling and Testing (15 minutes)

#### Step 3: Robust Error Handling
```javascript
// error-handler.js
class ErrorHandler {
  static handle(error, context = '') {
    console.error(`[${context}] Error occurred:`, error.message);
    
    // Log to file or service in production
    this.logError(error, context);
    
    // Return user-friendly message
    return this.getUserMessage(error);
  }
  
  static logError(error, context) {
    const logEntry = {
      timestamp: new Date().toISOString(),
      context,
      message: error.message,
      stack: error.stack
    };
    // Implementation depends on your logging system
    console.log('LOG:', logEntry);
  }
  
  static getUserMessage(error) {
    const friendlyMessages = {
      'ValidationError': 'Please check your input and try again.',
      'NetworkError': 'Connection problem. Please try again later.',
      'AuthError': 'Please log in to continue.'
    };
    
    return friendlyMessages[error.constructor.name] || 
           'Something went wrong. Please try again.';
  }
}
```

#### Step 4: Basic Testing
```javascript
// test-suite.js
function runTests() {
  console.log('Running Lab 2 Tests...');
  
  // Test 1: Data Processing
  testDataProcessing();
  
  // Test 2: Error Handling
  testErrorHandling();
  
  // Test 3: Configuration
  testConfiguration();
  
  console.log('All tests completed!');
}

function testDataProcessing() {
  const processor = new DataProcessor();
  processor.addData('test item');
  
  const result = processor.processData();
  assert(result.length > 0, 'Data processing should return results');
  assert(result[0].processed === true, 'Items should be marked as processed');
  
  console.log('✅ Data processing tests passed');
}

function assert(condition, message) {
  if (!condition) {
    throw new Error(`Test failed: ${message}`);
  }
}
```

### Part C: Integration and Deployment (20 minutes)

#### Step 5: Putting It All Together
```javascript
// main.js
const processor = new DataProcessor();
const config = require('./config.json');

async function main() {
  try {
    console.log(`Starting ${config.app.name} v${config.app.version}`);
    
    // Process sample data
    const sampleData = ['item1', 'item2', 'item3'];
    sampleData.forEach(item => processor.addData(item));
    
    const results = processor.processData();
    console.log('Processing results:', results);
    
    // Run tests if in debug mode
    if (config.app.debug) {
      runTests();
    }
    
  } catch (error) {
    const userMessage = ErrorHandler.handle(error, 'main');
    console.log('User message:', userMessage);
  }
}

main();
```

## Tasks and Deliverables

### Required Tasks:
1. **Implementation**: Complete all code sections
2. **Testing**: Run tests and fix any issues
3. **Configuration**: Customize config for your use case
4. **Documentation**: Comment your code thoroughly

### Deliverables:
- [ ] Working data processor with tests
- [ ] Error handling implementation
- [ ] Configuration system
- [ ] Test results screenshot
- [ ] Code with comprehensive comments

## Advanced Challenges

### Challenge 1: Performance Optimization
- Implement caching for processed data
- Add batch processing for large datasets
- Measure and improve performance metrics

### Challenge 2: Additional Features
- Add data validation before processing
- Implement different output formats (JSON, CSV, XML)
- Create a simple CLI interface

### Challenge 3: Integration
- Connect to a real data source (API, database, file)
- Add data persistence
- Implement real-time processing

## Troubleshooting Guide

### Common Issues:
1. **Import/Export Problems**: Check module syntax
2. **Async/Await Issues**: Ensure proper error handling
3. **Configuration Loading**: Verify file paths and JSON syntax
4. **Test Failures**: Check assertions and expected values

### Debugging Tips:
- Use console.log strategically
- Check browser developer tools
- Verify data types and structures
- Test individual functions in isolation

## Assessment Criteria
Your lab will be evaluated on:
- **Functionality** (40%): Does the code work correctly?
- **Code Quality** (30%): Is the code clean and well-structured?
- **Error Handling** (20%): Are errors handled gracefully?
- **Testing** (10%): Are tests comprehensive and passing?

## Next Steps
- Complete reflection questions below
- Review instructor feedback
- Prepare for Lab 3 (Advanced Project)
- Practice concepts with additional exercises

## Reflection Questions
1. What was the most challenging part of this lab?
2. How did error handling improve your code's reliability?
3. What would you do differently if starting over?
4. How do you plan to use these concepts in future projects?

## Resources and References
- [Advanced Documentation](https://example.com/advanced-docs)
- [Testing Best Practices](https://example.com/testing)
- [Error Handling Patterns](https://example.com/error-handling)
- [Performance Guide](https://example.com/performance)

---

**Great job reaching the intermediate level! You're building solid foundational skills.**