# Markdown 完全指南

Markdown 是一种**轻量级标记语言**，让你可以使用易读易写的纯文本格式编写文档，然后转换成结构化的HTML。

## 📝 基础语法

### 标题 (Headers)

Markdown支持六级标题：

```markdown
# 一级标题
## 二级标题  
### 三级标题
#### 四级标题
##### 五级标题
###### 六级标题
```

### 文本格式

- **粗体文本**：使用 `**文本**` 或 `__文本__`
- *斜体文本*：使用 `*文本*` 或 `_文本_`
- ***粗斜体***：使用 `***文本***`
- ~~删除线~~：使用 `~~文本~~`
- `内联代码`：使用反引号包围

### 列表

#### 无序列表

- 项目 1
- 项目 2  
  - 子项目 2.1
  - 子项目 2.2
- 项目 3

#### 有序列表

1. 第一项
2. 第二项
   1. 子项目 2.1
   2. 子项目 2.2
3. 第三项

### 链接和图片

#### 链接
- [内联链接](https://example.com)
- [带标题的链接](https://example.com "这是标题")

#### 图片
```markdown
![替代文本](image.jpg "可选标题")
```

## 💻 代码块

### 内联代码
使用单个反引号：`console.log("Hello World")`

### 代码块
使用三个反引号并指定语言：

```javascript
function greet(name) {
  console.log(`Hello, ${name}!`);
}

greet("Markdown");
```

```python
def fibonacci(n):
    if n <= 1:
        return n
    return fibonacci(n-1) + fibonacci(n-2)

print(fibonacci(10))
```

```bash
# 安装依赖
npm install

# 启动开发服务器
npm run dev

# 构建项目
npm run build
```

## 📊 表格

| 功能 | Markdown | HTML | 备注 |
|------|----------|------|------|
| 标题 | `# 标题` | `<h1>标题</h1>` | 支持1-6级 |
| 粗体 | `**粗体**` | `<strong>粗体</strong>` | 强调文本 |
| 斜体 | `*斜体*` | `<em>斜体</em>` | 倾斜文本 |
| 链接 | `[文本](URL)` | `<a href="URL">文本</a>` | 外部链接 |

## 📌 引用

> 这是一个引用块。
> 
> 可以跨越多行，并且支持其他Markdown语法。
> 
> > 这是嵌套引用。

## ✅ 任务列表

- [x] 学习基础Markdown语法
- [x] 掌握代码块用法
- [ ] 实践高级功能
- [ ] 编写技术文档
- [ ] 分享给团队成员

## 🔗 高级功能

### 分割线

---

### 脚注

这是一个有脚注的文本[^1]。

另一个脚注[^note]。

### HTML支持

Markdown中可以直接使用HTML标签：

<div style="background: #f0f8ff; padding: 1rem; border-radius: 8px; border-left: 4px solid #0066cc;">
  <strong>💡 提示：</strong> 这是一个使用HTML样式的提示框。
</div>

### 键盘按键

按 <kbd>Ctrl</kbd> + <kbd>C</kbd> 复制文本。

## 📋 最佳实践

### 1. 文档结构
- 使用有意义的标题层次
- 保持一致的格式风格
- 添加目录导航

### 2. 代码规范
```markdown
# 好的做法
## 使用有描述性的标题

# 避免的做法  
## 标题1
## 标题2
```

### 3. 表格对齐
```markdown
| 左对齐 | 居中对齐 | 右对齐 |
|:-------|:--------:|-------:|
| 左     |    中    |     右 |
```

## 🛠️ 工具推荐

### 编辑器
- **Visual Studio Code** + Markdown预览插件
- **Typora** - 所见即所得编辑器
- **Mark Text** - 实时预览编辑器

### 在线工具
- [Markdown Live Preview](https://markdownlivepreview.com/)
- [Dillinger](https://dillinger.io/)
- [StackEdit](https://stackedit.io/)

## 🎯 总结

Markdown的强大之处在于：

1. **简单易学** - 语法直观，学习成本低
2. **广泛支持** - GitHub、Reddit、Stack Overflow等平台都支持
3. **格式一致** - 纯文本格式，版本控制友好  
4. **高效写作** - 专注内容，不被格式分心
5. **良好兼容** - 可转换为HTML、PDF等多种格式

开始你的Markdown写作之旅吧！ 🚀

---

[^1]: 这是第一个脚注的内容。
[^note]: 这是命名脚注的内容，可以包含**格式化文本**。