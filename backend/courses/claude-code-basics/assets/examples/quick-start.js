#!/usr/bin/env node

/**
 * Claude Code 快速开始示例
 * 演示基本的 Claude Code 命令行使用方法
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// 颜色输出工具
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m'
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

// 检查 Claude Code 是否已安装
function checkClaudeInstallation() {
  try {
    const version = execSync('claude --version', { encoding: 'utf8' });
    log(`✅ Claude Code 已安装: ${version.trim()}`, 'green');
    return true;
  } catch (error) {
    log('❌ Claude Code 未安装或不在 PATH 中', 'red');
    log('请运行: npm install -g @anthropic-ai/claude-code', 'yellow');
    return false;
  }
}

// 检查 Node.js 版本
function checkNodeVersion() {
  const version = process.version;
  const majorVersion = parseInt(version.slice(1).split('.')[0]);
  
  if (majorVersion >= 18) {
    log(`✅ Node.js 版本符合要求: ${version}`, 'green');
    return true;
  } else {
    log(`❌ Node.js 版本过低: ${version}，需要 18+`, 'red');
    return false;
  }
}

// 创建示例项目
function createExampleProject() {
  const projectName = 'claude-code-example';
  const projectPath = path.join(process.cwd(), projectName);
  
  if (fs.existsSync(projectPath)) {
    log(`📁 项目目录已存在: ${projectPath}`, 'yellow');
    return projectPath;
  }
  
  log(`📁 创建项目目录: ${projectName}`, 'blue');
  fs.mkdirSync(projectPath, { recursive: true });
  
  // 创建 package.json
  const packageJson = {
    name: projectName,
    version: '1.0.0',
    description: 'Claude Code 示例项目',
    main: 'index.js',
    scripts: {
      start: 'node index.js',
      dev: 'node --watch index.js'
    },
    keywords: ['claude-code', 'ai', 'example'],
    author: 'Claude Code 教程'
  };
  
  fs.writeFileSync(
    path.join(projectPath, 'package.json'),
    JSON.stringify(packageJson, null, 2)
  );
  
  // 创建示例代码文件
  const indexJs = `// Claude Code 示例项目
console.log('🤖 欢迎使用 Claude Code！');

// 这是一个简单的待办事项管理器
class TodoManager {
  constructor() {
    this.todos = [];
  }
  
  addTodo(task) {
    const todo = {
      id: Date.now(),
      task,
      completed: false,
      createdAt: new Date()
    };
    this.todos.push(todo);
    console.log(\`✅ 添加任务: \${task}\`);
  }
  
  completeTodo(id) {
    const todo = this.todos.find(t => t.id === id);
    if (todo) {
      todo.completed = true;
      console.log(\`🎉 完成任务: \${todo.task}\`);
    }
  }
  
  listTodos() {
    console.log('📝 当前任务列表:');
    this.todos.forEach(todo => {
      const status = todo.completed ? '✅' : '⏳';
      console.log(\`  \${status} \${todo.task}\`);
    });
  }
}

// 使用示例
const todoManager = new TodoManager();
todoManager.addTodo('学习 Claude Code 基础功能');
todoManager.addTodo('完成实验练习');
todoManager.addTodo('探索高级特性');
todoManager.listTodos();

// 提示用户如何使用 Claude Code
console.log('\\n🚀 现在您可以在此项目中使用 Claude Code：');
console.log('1. 在终端中运行: claude');
console.log('2. 尝试说: "帮我优化这个 TodoManager 类"');
console.log('3. 或者说: "为这个项目添加测试用例"');
`;
  
  fs.writeFileSync(path.join(projectPath, 'index.js'), indexJs);
  
  // 创建 README
  const readme = `# Claude Code 示例项目

这是一个用于学习 Claude Code 的示例项目。

## 快速开始

\`\`\`bash
# 运行项目
npm start

# 在项目中启动 Claude Code
claude
\`\`\`

## 试试这些 Claude Code 命令

1. **代码优化**
   \`\`\`
   claude> 优化 TodoManager 类，添加错误处理和数据验证
   \`\`\`

2. **添加功能**
   \`\`\`
   claude> 为 TodoManager 添加优先级和截止日期功能
   \`\`\`

3. **生成测试**
   \`\`\`
   claude> 为这个项目创建完整的测试套件
   \`\`\`

4. **文档生成**
   \`\`\`
   claude> 为所有代码生成 JSDoc 文档
   \`\`\`

## 学习资源

- [Claude Code 官方文档](https://docs.anthropic.com/en/docs/claude-code/overview)
- [课程实验指南](../labs/)
`;
  
  fs.writeFileSync(path.join(projectPath, 'README.md'), readme);
  
  log(`✅ 示例项目创建完成: ${projectPath}`, 'green');
  return projectPath;
}

// 主要执行逻辑
function main() {
  log('🤖 Claude Code 快速开始检查', 'bright');
  log('=' * 50, 'cyan');
  
  // 检查环境
  const nodeOk = checkNodeVersion();
  const claudeOk = checkClaudeInstallation();
  
  if (!nodeOk || !claudeOk) {
    log('\\n❌ 环境检查失败，请先解决上述问题', 'red');
    process.exit(1);
  }
  
  // 创建示例项目
  log('\\n📁 创建示例项目...', 'blue');
  const projectPath = createExampleProject();
  
  // 提供下一步指导
  log('\\n🎉 环境准备完成！', 'green');
  log('\\n📚 下一步操作:', 'bright');
  log(\`1. cd \${path.basename(projectPath)}\`, 'cyan');
  log('2. npm start  # 运行示例代码', 'cyan');
  log('3. claude     # 启动 Claude Code', 'cyan');
  log('\\n💡 提示: 在 Claude Code 中尝试说 "帮我改进这个代码"', 'yellow');
  
  log('\\n🚀 开始您的 Claude Code 学习之旅吧！', 'magenta');
}

// 如果直接运行此脚本
if (require.main === module) {
  main();
}

module.exports = {
  checkClaudeInstallation,
  checkNodeVersion,
  createExampleProject
};