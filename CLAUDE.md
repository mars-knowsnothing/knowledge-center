# Knowledge Center - 培训课程管理系统

## 项目概览

Knowledge Center 是一个现代化的交互式培训课程管理系统，支持课程创建、幻灯片编辑、实验管理和资源管理。

## 最新更新 (2025-09-11)

### 重大功能增强 - 文件上传与课程管理优化

#### 新增功能特性

1. **文件上传系统**
   - **Labs上传**: 支持上传markdown格式的实验文件
   - **Slides上传**: 支持上传markdown格式的幻灯片文件
   - **文件验证**: 自动验证文件格式，只允许.md文件
   - **重复处理**: 自动重命名重复文件，避免覆盖

2. **现代化UI组件**
   - **确认弹窗**: 基于Headless UI的现代化确认对话框
   - **通知系统**: Toast风格的成功/错误/警告通知
   - **响应式设计**: 适配不同屏幕尺寸的布局
   - **统一按钮**: 所有上传按钮宽度对齐，视觉一致

3. **课程管理增强**
   - **Present按钮**: 直接进入演示模式（自动选择第一个slides文件）
   - **Manage按钮**: 进入课程管理界面（原View Course功能）
   - **删除功能**: 完整删除课程及所有相关内容
   - **自动刷新**: 操作完成后自动更新界面

4. **用户体验改进**
   - **操作反馈**: 所有操作都有明确的成功/失败反馈
   - **防误操作**: 删除操作需要二次确认
   - **加载状态**: 上传过程中显示加载状态
   - **错误处理**: 友好的错误提示和处理

#### 技术实现

**Backend API扩展**
- `POST /api/courses/{course_name}/labs/upload` - 上传Lab文件
- `POST /api/courses/{course_name}/slides/upload` - 上传Slides文件
- `DELETE /api/courses/{course_id}` - 删除整个课程（已存在）

**Frontend组件架构**
```
src/components/
├── ConfirmModal.tsx      # 现代化确认弹窗
├── Notification.tsx      # Toast通知组件
├── Layout.tsx           # 布局组件
└── CourseForm.tsx       # 课程创建表单
```

**核心页面更新**
- `/app/courses/page.tsx` - 课程卡片界面，新增删除和Present功能
- `/app/courses/[courseId]/page.tsx` - 课程管理界面，新增上传功能
- `/app/courses/[courseId]/slides/page.tsx` - 自动演示重定向

#### API端点总览

**课程管理**
- `GET /api/courses` - 获取所有课程
- `POST /api/courses` - 创建新课程
- `PUT /api/courses/{course_id}` - 更新课程信息
- `DELETE /api/courses/{course_id}` - 删除课程及所有内容

**文件上传**
- `POST /api/courses/{course_name}/labs/upload` - 上传Lab文件
- `POST /api/courses/{course_name}/slides/upload` - 上传Slides文件
- `POST /api/courses/{course_name}/assets/upload` - 上传资源文件

**幻灯片管理**
- `GET /api/slides/courses/{course_name}` - 获取课程所有slides文件
- `POST /api/slides/temp` - 创建临时编辑文件
- `PUT /api/slides/temp/{id}` - 更新临时文件
- `POST /api/slides/temp/{id}/commit` - 提交到原文件

### Slide Edit Module（之前完成）

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

## 开发指南

### 环境依赖

**Frontend**
- Node.js 18+
- Yarn (包管理器)
- Next.js 15
- React 19
- Headless UI (现代化组件)
- Tailwind CSS (样式框架)

**Backend**
- Python 3.8+
- FastAPI (Web框架)
- uvicorn (ASGI服务器)
- aiofiles (异步文件操作)

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
├── frontend/              # Next.js React应用
│   ├── src/app/           # App Router页面
│   ├── src/components/    # 可复用组件
│   │   ├── ConfirmModal.tsx    # 确认弹窗
│   │   ├── Notification.tsx    # 通知组件
│   │   └── Layout.tsx          # 布局组件
│   └── src/lib/           # 工具和API客户端
├── backend/               # FastAPI应用
│   ├── src/backend/       # 主应用代码
│   └── courses/           # 课程数据存储
│       ├── {course-id}/   # 课程目录
│       │   ├── slides/    # 幻灯片文件
│       │   ├── labs/      # 实验文件
│       │   ├── assets/    # 资源文件
│       │   └── config.json # 课程配置
│       └── temp_slides/   # 临时编辑文件
└── start_all_services.sh  # 一键启动脚本
```

## 使用指南

### 课程管理
1. **创建课程**: 点击"Create Course"按钮
2. **演示课程**: 点击"Present"按钮直接进入演示模式
3. **管理课程**: 点击"Manage"按钮进入管理界面
4. **删除课程**: 点击垃圾桶图标，确认后删除

### 文件上传
1. **上传Slides**: 在课程管理页面点击"+ Upload Slides"
2. **上传Labs**: 在课程管理页面点击"+ Upload Labs" 
3. **上传Assets**: 在课程管理页面点击"+ Upload Assets"
4. **文件要求**: Slides和Labs只接受.md文件，Assets接受所有格式

### 编辑功能
1. **编辑Slides**: 在课程管理页面点击slides的"Edit"按钮
2. **实时预览**: 编辑器支持实时预览功能
3. **自动保存**: 编辑过程中自动保存到临时文件
4. **发布更改**: 点击"Publish"提交到原文件

## 贡献指南

1. 所有更改都应经过测试
2. 遵循现有代码规范
3. 更新相关文档
4. 确保不破坏现有功能
5. 新增组件应使用TypeScript
6. UI组件应支持无障碍访问

## 已知问题

无当前已知问题。所有核心功能已完全正常工作。

---

最后更新: 2025-09-11
更新人: Claude Code Assistant