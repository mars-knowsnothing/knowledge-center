# CLAUDE.md — 个人网站开发规范（前后端分离）

> 技术栈：**前端** Next.js + Tailwind CSS（依赖管理：`yarn`） · **后端** FastAPI（依赖管理：`uv`）。  
> 统一启动：提供 `scripts/dev.sh`（macOS/Linux）与 `scripts/dev.ps1`（Windows）一键启动前后端，并在启动前自动检查并清理端口占用。  
> 默认首页：以**个人介绍**为主（见下文“待确认事项”）。其他功能与风格需向你确认后再实施。

---

## 1. 目录结构（建议）
```
.
├─ frontend/                 # Next.js + Tailwind 前端
│  ├─ app/                   # App Router（建议）
│  ├─ components/            # 复用组件（建议配 Storybook）
│  ├─ public/                # 静态资源
│  └─ package.json           # 使用 yarn 管理
├─ backend/                  # FastAPI 后端服务
│  ├─ app/
│  │  └─ main.py             # FastAPI 入口（示例见下文）
│  └─ requirements.txt 或 pyproject.toml（任选其一）
├─ scripts/
│  ├─ dev.sh                 # macOS/Linux 一键启动（含端口清理）
│  └─ dev.ps1                # Windows 一键启动（含端口清理）
└─ CLAUDE.md                 # 本文件
```

---

## 2. 环境要求
- Node.js ≥ 20（推荐）
- yarn（前端依赖管理）
- Python ≥ 3.10（推荐）
- `uv`（Python 依赖与运行器，https://github.com/astral-sh/uv）

---

## 3. 快速开始
### 前端（Next.js + Tailwind，使用 `yarn`）
```bash
cd frontend
yarn install
yarn dev --port 3000
```
> 生产：`yarn build && yarn start`

### 后端（FastAPI，使用 `uv`）
- 如果使用 `requirements.txt`
```bash
cd backend
uv venv .venv
source .venv/bin/activate
uv pip install -r requirements.txt
uv run uvicorn app.main:app --host 0.0.0.0 --port 8000
```
- 如果使用 `pyproject.toml`
```bash
cd backend
uv venv .venv
source .venv/bin/activate
uv sync
uv run uvicorn app.main:app --host 0.0.0.0 --port 8000
```

---

## 4. 统一启动脚本（含端口清理）
### macOS/Linux：`scripts/dev.sh`
- 功能：
  1) 检查并清理端口占用（默认前端 3000、后端 8000，可通过环境变量覆盖）；  
  2) 安装依赖（`yarn install` / `uv`）并并行启动前后端；  
  3) 捕获退出信号，优雅终止子进程。  
- 使用：
```bash
chmod +x scripts/dev.sh
FRONTEND_PORT=3000 BACKEND_PORT=8000 ./scripts/dev.sh
```

### Windows：`scripts/dev.ps1`
- 功能与参数同上，PowerShell 实现。  
- 使用（PowerShell）：
```powershell
$env:FRONTEND_PORT=3000; $env:BACKEND_PORT=8000; ./scripts/dev.ps1
```

> 若你的网络代理或国内源配置有定制需求，可在脚本中的“自定义区”调整。

---

## 5. 默认页面与交互约定
- **默认首页内容**（前端 `app/page.tsx`）：以**个人介绍**为主，建议包含：头像、姓名、职位/身份、所在城市、社交链接、技能栈关键词、近期项目/作品入口。  
- **待确认事项（由你确认后再开发）**：
  - 页面风格（极简 / 新拟物 / 霓虹赛博 / 杂志排版 / 暗色优先 / 亮色优先 等）。
  - 导航结构与附加页面：博客、项目集、简历下载、照片墙、留言/联系表单、RSS、i18n 等。
  - 数据来源：静态 Markdown / CMS（Notion、Sanity、Headless WP 等）/ JSON / 后端 API。
  - SEO：站点标题、副标题、描述、社交卡片图、OpenGraph、站点地图与 robots 设置。
  - 分析与观测：如 Plausible/Umami/GTM、Sentry 前端与后端、Lighthouse 与 CWV（Core Web Vitals）。

---

## 6. 前端约定（Next.js + Tailwind）
- 依赖管理：**必须使用 `yarn`**；提交前应 `yarn lint` 与 `yarn typecheck`。  
- UI：采用语义化 HTML 与 A11y 基线（至少满足主流程键盘可达、可见焦点、合理 aria）。  
- 样式：Tailwind 原子类 + 设计令牌（`:root { --brand: ... }`）；组件优先无状态/可组合；避免无意义客户端水合。  
- 环境变量：公开变量以 `NEXT_PUBLIC_` 前缀，私密变量仅服务端使用。

---

## 7. 后端约定（FastAPI + uv）
- 依赖管理：**必须使用 `uv`**；固定依赖（`requirements.txt` 或 `pyproject.toml` + `uv lock`）。  
- CORS：默认允许来自前端地址（开发时 `http://localhost:3000`），生产需收敛到具体域名。  
- 路由示例：
```python
# backend/app/main.py（示例）
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(title="Personal Site API", version="0.1.0")

origins = ["http://localhost:3000"]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/healthz")
def healthz():
    return {"ok": True}

@app.get("/profile")
def profile():
    return {
        "name": "Your Name",
        "title": "Your Title",
        "location": "City, Country",
        "links": {"github": "https://github.com/yourname"}
    }
```
- 运行：`uv run uvicorn app.main:app --host 0.0.0.0 --port 8000`

---

## 8. 交互流程（Claude 的工作方式）
1) 先产出“变更计划 + 影响评估 + 回滚方案”，我确认后再改代码。  
2) 代码变更同步更新测试/文档；前端组件尽量配 Storybook。  
3) PR 使用 Conventional Commits（如 `feat: add profile hero section`）。

---

## 9. 端口与环境
- 默认：前端 **3000**，后端 **8000**（可通过环境变量 `FRONTEND_PORT/BACKEND_PORT` 覆盖）。  
- `.env`：示例文件 `frontend/.env.example` 与 `backend/.env.example`（不提交真实 `.env`）。

---

## 10. 验收清单（初版）
- [ ] 首页展示个人介绍与社交链接
- [ ] 统一启动脚本可在 macOS/Linux/Windows 成功运行
- [ ] 基本 SEO 元数据 & OpenGraph
- [ ] 基础 A11y（键盘可达、焦点状态、alt 文本）
- [ ] 后端健康检查 `/healthz` 与 `/profile` 可正常返回

---

## 附：Next.js 首页（最小示例）
```tsx
// frontend/app/page.tsx（片段，仅作为结构参考）
export default function Home() {
  return (
    <main className="mx-auto max-w-3xl px-6 py-16 prose dark:prose-invert">
      <section className="mb-10">
        <h1 className="text-4xl font-bold">Your Name</h1>
        <p className="mt-2 text-neutral-600 dark:text-neutral-300">
          Your Title — short intro about yourself.
        </p>
      </section>
      <section className="space-y-2">
        <h2>Links</h2>
        <ul>
          <li><a href="https://github.com/yourname">GitHub</a></li>
          <li><a href="https://x.com/yourname">X/Twitter</a></li>
        </ul>
      </section>
    </main>
  );
}
```
