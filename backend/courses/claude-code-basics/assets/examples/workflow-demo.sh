#!/bin/bash

# Claude Code 工作流演示脚本
# 展示 Claude Code 在实际开发中的完整工作流程

set -e  # 遇到错误就退出

# 颜色定义
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

# 日志函数
log_info() {
    echo -e "${CYAN}[INFO]${NC} $1"
}

log_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

log_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

log_step() {
    echo -e "${PURPLE}[STEP]${NC} $1"
}

# 检查依赖
check_dependencies() {
    log_step "检查必要的依赖..."
    
    # 检查 Claude Code
    if ! command -v claude &> /dev/null; then
        log_error "Claude Code 未安装"
        log_info "请运行: npm install -g @anthropic-ai/claude-code"
        exit 1
    fi
    
    # 检查 Git
    if ! command -v git &> /dev/null; then
        log_error "Git 未安装"
        exit 1
    fi
    
    # 检查 Node.js
    if ! command -v node &> /dev/null; then
        log_error "Node.js 未安装"
        exit 1
    fi
    
    log_success "所有依赖都已安装"
}

# 创建演示项目
create_demo_project() {
    log_step "创建演示项目..."
    
    PROJECT_NAME="claude-workflow-demo"
    
    if [ -d "$PROJECT_NAME" ]; then
        log_warning "项目目录已存在，将清理重建"
        rm -rf "$PROJECT_NAME"
    fi
    
    mkdir "$PROJECT_NAME"
    cd "$PROJECT_NAME"
    
    # 初始化 Git
    git init
    git config user.name "Claude Code Demo"
    git config user.email "demo@claude-code.com"
    
    # 创建基础文件
    cat > package.json << 'EOF'
{
  "name": "claude-workflow-demo",
  "version": "1.0.0",
  "description": "Claude Code 工作流演示项目",
  "main": "src/index.js",
  "scripts": {
    "start": "node src/index.js",
    "test": "jest",
    "lint": "eslint src/",
    "format": "prettier --write src/"
  },
  "devDependencies": {
    "jest": "^29.0.0",
    "eslint": "^8.0.0",
    "prettier": "^3.0.0"
  }
}
EOF
    
    mkdir -p src tests docs
    
    # 创建初始代码文件
    cat > src/index.js << 'EOF'
// 简单的计算器类 - 故意包含一些可以改进的地方
class Calculator {
    constructor() {
        this.history = [];
    }
    
    add(a, b) {
        const result = a + b;
        this.history.push(`${a} + ${b} = ${result}`);
        return result;
    }
    
    subtract(a, b) {
        const result = a - b;
        this.history.push(`${a} - ${b} = ${result}`);
        return result;
    }
    
    // 这个方法有 bug
    divide(a, b) {
        const result = a / b;  // 没有检查除零
        this.history.push(`${a} / ${b} = ${result}`);
        return result;
    }
    
    getHistory() {
        return this.history;
    }
}

const calc = new Calculator();
console.log(calc.add(5, 3));
console.log(calc.subtract(10, 4));
console.log(calc.divide(8, 2));
EOF
    
    # 创建 README
    cat > README.md << 'EOF'
# Claude Code 工作流演示

这个项目演示了如何在实际开发中使用 Claude Code。

## 当前状态

- 简单的计算器类
- 包含一些可以改进的地方
- 缺少测试和文档

## 使用 Claude Code 改进

参考工作流脚本中的步骤。
EOF
    
    git add .
    git commit -m "初始项目创建"
    
    log_success "演示项目创建完成"
}

# 演示 Claude Code 工作流
demonstrate_claude_workflow() {
    log_step "开始 Claude Code 工作流演示..."
    
    # 创建 Claude Code 命令文件
    cat > claude_commands.txt << 'EOF'
# Claude Code 演示命令序列

# 1. 项目分析
分析这个项目的代码结构，识别可以改进的地方

# 2. 代码审查
审查 src/index.js，找出潜在的 bug 和改进点

# 3. 修复 bug
修复 Calculator 类中的除零错误

# 4. 添加功能
为 Calculator 类添加乘法和幂运算功能

# 5. 生成测试
为 Calculator 类创建完整的测试套件

# 6. 改进文档
生成详细的 README 和 API 文档

# 7. 代码格式化
添加 ESLint 和 Prettier 配置

# 8. 性能优化
优化代码性能和内存使用
EOF
    
    log_info "Claude Code 命令序列已创建在 claude_commands.txt"
    log_info "你可以逐一在 Claude Code 中执行这些命令"
    
    # 创建交互式演示脚本
    cat > interactive_demo.sh << 'EOF'
#!/bin/bash

echo "🤖 Claude Code 交互式演示"
echo "=========================="
echo ""
echo "请在另一个终端中运行 'claude' 启动 Claude Code"
echo "然后逐一执行以下命令："
echo ""

commands=(
    "分析这个项目的代码结构，识别可以改进的地方"
    "审查 src/index.js，找出潜在的 bug 和改进点"
    "修复 Calculator 类中的除零错误"
    "为 Calculator 类添加乘法和幂运算功能"
    "为 Calculator 类创建完整的测试套件"
    "生成详细的 README 和 API 文档"
    "添加 ESLint 和 Prettier 配置文件"
    "优化代码性能和内存使用"
)

for i in "${!commands[@]}"; do
    echo "步骤 $((i+1)): ${commands[i]}"
    echo "按回车键继续到下一步..."
    read
    echo ""
done

echo "🎉 演示完成！"
EOF
    
    chmod +x interactive_demo.sh
    
    log_success "交互式演示脚本创建完成"
}

# 创建最佳实践示例
create_best_practices() {
    log_step "创建最佳实践示例..."
    
    mkdir -p examples
    
    # 创建提示技巧示例
    cat > examples/prompt_examples.md << 'EOF'
# Claude Code 提示技巧示例

## 📝 有效的提示写法

### ✅ 好的提示
```
claude> 为这个 React 组件添加 TypeScript 类型定义，包括 props 接口和状态类型，确保类型安全
```

### ❌ 不好的提示
```
claude> 帮我修复代码
```

## 🎯 具体场景的提示示例

### 代码生成
```
claude> 创建一个用户认证中间件，支持 JWT token 验证，包含错误处理和日志记录
```

### 代码优化
```
claude> 优化这个数据库查询函数，减少 N+1 查询问题，并添加适当的索引建议
```

### 测试生成
```
claude> 为这个 API 端点创建完整的测试套件，包括单元测试、集成测试和边界条件测试
```

### 文档生成
```
claude> 为这个类生成 JSDoc 文档，包括参数说明、返回值类型和使用示例
```

## 🔧 调试和问题解决

### 错误诊断
```
claude> 应用启动时报错 "Cannot resolve module"，帮我诊断问题并提供解决方案
```

### 性能问题
```
claude> 这个页面加载很慢，帮我分析性能瓶颈并提供优化建议
```

## 📚 学习和探索

### 新技术学习
```
claude> 解释如何在这个 React 项目中集成 React Query，包括设置、基本用法和最佳实践
```

### 架构设计
```
claude> 为这个电商应用设计微服务架构，包括服务划分、数据流和部署策略
```
EOF
    
    # 创建工作流配置示例
    cat > examples/workflow_config.md << 'EOF'
# Claude Code 工作流配置

## 🔧 项目配置文件示例

### .claude.yml
```yaml
# Claude Code 项目配置
project:
  name: "my-awesome-project"
  description: "项目描述"
  
settings:
  auto_format: true
  include_tests: true
  code_style: "prettier"
  
ignore:
  - "node_modules/"
  - "dist/"
  - "*.log"
  - ".env"

preferences:
  framework: "react"
  language: "typescript"
  testing: "jest"
  styling: "tailwind"
```

### Git Hooks 集成
```bash
#!/bin/sh
# .git/hooks/pre-commit

# 运行 Claude Code 代码审查
claude review --staged --format=report

# 运行测试
npm test

# 代码格式化
npm run format
```

## 🚀 CI/CD 集成示例

### GitHub Actions
```yaml
name: Claude Code CI
on: [push, pull_request]

jobs:
  claude-review:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
      - name: Install Claude Code
        run: npm install -g @anthropic-ai/claude-code
      - name: Run Claude Review
        run: claude review --format=github-comment
        env:
          ANTHROPIC_API_KEY: ${{ secrets.ANTHROPIC_API_KEY }}
```
EOF
    
    log_success "最佳实践示例创建完成"
}

# 清理函数
cleanup() {
    log_step "清理临时文件..."
    # 这里可以添加清理逻辑
    log_success "清理完成"
}

# 主函数
main() {
    echo -e "${BLUE}"
    cat << 'EOF'
 ______ __                   __          ______              __        
/\  _  \\  \                 /\ \        /\  _  \            /\ \       
\ \ \L\ \\ \     __      __ \ \ \  __   \ \ \L\ \    ___    \_\ \   __ 
 \ \  __ \\ \   /'__`\  /'__`\\ \ \/\ \   \ \  __ \  / __`\  /'_` \ /'__`\
  \ \ \/\ \\ \ /\ \L\.\_/\ \L\ \\ \ \_\ \   \ \ \/\ \/\ \L\ \/\ \L\ \\  __/
   \ \_\ \_\\ \_\ \__/.\_\ \____/ \ \____/    \ \_\ \_\ \____/\ \___,_\\\____\
    \/_/\/_/ \/_/\/__/\/_/\/___/   \/___/      \/_/\/_/\/___/  \/__,_ /\/____/
                                                                              
EOF
    echo -e "${NC}"
    
    log_info "Claude Code 工作流演示脚本"
    log_info "版本: 1.0.0"
    echo ""
    
    # 检查依赖
    check_dependencies
    
    # 创建演示项目
    create_demo_project
    
    # 演示工作流
    demonstrate_claude_workflow
    
    # 创建最佳实践
    create_best_practices
    
    echo ""
    log_success "演示环境准备完成！"
    echo ""
    log_info "下一步操作："
    echo "  1. 运行 './interactive_demo.sh' 开始交互式演示"
    echo "  2. 或者运行 'claude' 手动体验"
    echo "  3. 参考 'examples/' 目录中的最佳实践"
    echo ""
    log_info "开始您的 Claude Code 学习之旅！"
}

# 信号处理
trap cleanup EXIT

# 执行主函数
main "$@"