# 实验 1：Claude Code 安装与初始配置

## 🎯 实验目标

通过本实验，您将学会：
- 在本地环境中安装 Claude Code
- 完成初始配置和认证
- 验证安装的正确性
- 熟悉基本的命令行操作

## 📋 前置条件

### 环境要求
- **操作系统**: Windows 10+, macOS 10.15+, 或 Linux
- **Node.js**: 版本 18.0 或更高
- **网络**: 稳定的互联网连接
- **账户**: Claude.ai 账户或 Anthropic Console 账户

### 准备工作
1. 确保您有管理员权限（用于全局安装 npm 包）
2. 准备一个用于测试的项目目录
3. 确保终端能够访问互联网

## 🔨 实验步骤

### 步骤 1：环境检查

首先验证您的 Node.js 环境：

```bash
# 检查 Node.js 版本
node --version
# 应该显示 v18.x.x 或更高版本

# 检查 npm 版本
npm --version
# 确保 npm 正常工作
```

**预期输出示例：**
```
$ node --version
v18.17.0
$ npm --version
9.8.1
```

### 步骤 2：安装 Claude Code

执行全局安装命令：

```bash
# 安装 Claude Code
npm install -g @anthropic-ai/claude-code

# 验证安装
claude --version
```

**故障排除：**
- 如果遇到权限错误，在 macOS/Linux 上使用 `sudo`
- 在 Windows 上以管理员身份运行命令提示符
- 如果安装失败，检查网络连接和 npm 配置

### 步骤 3：创建测试项目

创建一个简单的测试项目：

```bash
# 创建项目目录
mkdir claude-code-test
cd claude-code-test

# 初始化项目
npm init -y

# 创建一个简单的 JavaScript 文件
echo 'console.log("Hello Claude Code!");' > index.js
```

### 步骤 4：首次启动 Claude Code

在项目目录中启动 Claude Code：

```bash
# 启动 Claude Code
claude
```

**首次启动流程：**
1. 系统将提示您进行认证
2. 按照屏幕指示在浏览器中登录
3. 完成认证后返回终端
4. 等待 Claude Code 初始化完成

### 步骤 5：基本功能测试

一旦认证成功，尝试以下基本操作：

```bash
# 在 Claude Code 交互模式中
claude> 查看当前项目的文件列表

# 让 Claude Code 分析项目
claude> 分析这个项目的结构并给出建议

# 尝试代码生成
claude> 创建一个简单的 package.json 脚本用于运行 index.js
```

### 步骤 6：验证功能

确认以下功能正常工作：

1. **文件读取**: Claude Code 能够读取和理解项目文件
2. **代码生成**: 能够根据描述生成代码
3. **项目理解**: 能够分析项目结构
4. **命令执行**: 能够运行终端命令（如果需要）

## ✅ 验收标准

完成本实验后，您应该能够：

- [ ] 成功安装 Claude Code 并验证版本
- [ ] 完成认证流程
- [ ] 在项目目录中启动 Claude Code
- [ ] 与 Claude Code 进行基本交互
- [ ] 让 Claude Code 分析简单的项目结构
- [ ] 使用 Claude Code 生成简单的代码

## 🔧 常见问题

### Q1: npm 安装失败怎么办？

**A:** 常见解决方案：
```bash
# 清理 npm 缓存
npm cache clean --force

# 检查 npm 配置
npm config list

# 使用不同的 registry
npm config set registry https://registry.npmjs.org/
```

### Q2: 认证失败如何解决？

**A:** 检查以下项目：
- 网络连接是否正常
- 浏览器是否阻止弹出窗口
- Claude.ai 账户是否有效
- 是否需要企业代理配置

### Q3: Claude Code 启动后无响应？

**A:** 尝试以下步骤：
```bash
# 检查进程
ps aux | grep claude

# 强制退出并重启
killall claude
claude
```

### Q4: 权限问题怎么处理？

**A:** 根据操作系统：
```bash
# macOS/Linux
sudo npm install -g @anthropic-ai/claude-code

# Windows (以管理员身份运行)
npm install -g @anthropic-ai/claude-code
```

## 📚 扩展练习

如果您完成了基本步骤，可以尝试：

1. **配置文件探索**: 查找 Claude Code 的配置文件位置
2. **命令行参数**: 尝试使用不同的 Claude Code 命令行选项
3. **项目类型测试**: 在不同类型的项目中测试 Claude Code
4. **网络配置**: 如果在企业环境中，配置代理设置

## 🎉 完成标志

当您能够在终端中看到 Claude Code 的欢迎信息，并成功与其进行交互时，恭喜您完成了第一个实验！

下一步，我们将在实验 2 中学习 Claude Code 的核心功能和实际应用。