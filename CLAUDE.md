# Knowledge Center - Slide Edit System

## 项目概览

Knowledge Center 是一个交互式培训课程管理系统，支持课程创建、幻灯片编辑、实验管理和资源管理。

## 最新更新 (2025-09-11)

### Slide Edit Module 重构完成

成功完成了slide edit模块的彻底重构，实现了基于UUID的临时文件编辑系统。

#### 主要功能特性

1. **UUID临时文件系统**
   - 用户编辑时创建 `<slide-name>-<uuid>.md` 临时文件
   - 编辑期间对原文件无影响，实现非破坏性编辑
   - 支持自动保存到临时文件

2. **发布工作流**
   - 点击"Publish"按钮将临时文件内容提交到原文件
   - 发布后自动清理临时文件并创建新的编辑会话
   - 支持放弃更改功能

3. **增强的编辑体验**
   - 主界面为markdown编辑器，配色对比明显
   - 预览模式功能完整，与course present页面一致
   - 实时显示幻灯片数量和编辑状态

4. **主题渲染修复**
   - 统一前后端的markdown解析逻辑
   - 正确处理YAML frontmatter和主题设置
   - 修复主题在编辑过程中丢失的问题

#### 技术实现

**Frontend (React/Next.js)**
- `parseSlides()` 函数镜像后端逻辑，确保渲染一致性
- 使用 `useRef` 避免React closure问题
- 防抖自动保存，避免竞态条件

**Backend (FastAPI)**
- 新增临时文件API端点：
  - `POST /api/slides/temp` - 创建临时文件
  - `PUT /api/slides/temp/{id}` - 更新临时文件
  - `POST /api/slides/temp/{id}/commit` - 提交到原文件
  - `DELETE /api/slides/temp/{id}` - 删除临时文件

**关键文件**
- `/frontend/src/app/courses/[courseId]/slides/[filename]/edit/page.tsx` - 主编辑页面
- `/backend/src/backend/main.py` - 后端API实现
- `/frontend/src/lib/api.ts` - 前端API客户端

#### 修复的问题

1. **主题渲染问题** - 修复编辑模式下主题丢失
2. **404错误** - 修复保存后重新编辑的错误
3. **自动保存冲突** - 修复发布时的竞态条件
4. **路由清理** - 删除过时组件和路由
5. **发布逻辑** - 确保更改正确保存到原文件

#### 环境优化

**启动脚本 v2.3.0**
- 智能依赖管理，只在需要时更新包
- 自动清理构建缓存确保最新效果
- 1小时以上的临时文件清理

**包管理规范**
- 前端使用 yarn
- 后端使用 uv (Python)
- 清理冲突的配置文件

## 开发指南

### 启动服务

```bash
./start_all_services.sh
```

### 运行测试

```bash
# 前端测试
cd frontend && npm run test

# 后端测试  
cd backend && python -m pytest
```

### 手动启动服务

```bash
# 后端
cd backend && python -m uvicorn src.backend.main:app --reload --host 0.0.0.0 --port 8000

# 前端
cd frontend && npm run dev
```

## API文档

访问 http://localhost:8000/docs 查看完整的API文档。

## 架构

```
knowledge-center/
├── frontend/          # Next.js React应用
│   ├── src/app/       # App Router页面
│   ├── src/components/ # 可复用组件
│   └── src/lib/       # 工具和API客户端
├── backend/           # FastAPI应用
│   ├── src/backend/   # 主应用代码
│   └── courses/       # 课程数据存储
└── start_all_services.sh # 一键启动脚本
```

## 贡献指南

1. 所有更改都应经过测试
2. 遵循现有代码规范
3. 更新相关文档
4. 确保不破坏现有功能

## 已知问题

无当前已知问题。编辑和发布功能已完全正常工作。

---

最后更新: 2025-09-11
更新人: Claude Code Assistant