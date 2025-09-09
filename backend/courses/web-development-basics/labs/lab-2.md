# Web Development Basics - Lab 2: CSS Styling

## 实验目标
学会使用CSS为HTML页面添加样式，掌握基本的CSS选择器和属性。

## 实验环境
- HTML文件（基于Lab 1）
- CSS文件
- Web浏览器

## 实验步骤

### Step 1: 创建CSS文件
创建一个名为 `styles.css` 的文件：

```css
/* 重置默认样式 */
* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}

/* 全局样式 */
body {
    font-family: 'Arial', sans-serif;
    line-height: 1.6;
    color: #333;
    background-color: #f4f4f4;
}

/* 头部样式 */
header {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    padding: 2rem 0;
    text-align: center;
}

header h1 {
    font-size: 2.5rem;
    margin-bottom: 1rem;
}

/* 导航样式 */
nav ul {
    list-style: none;
    display: flex;
    justify-content: center;
    gap: 2rem;
}

nav a {
    color: white;
    text-decoration: none;
    font-weight: bold;
    transition: color 0.3s ease;
}

nav a:hover {
    color: #ffeb3b;
}
```

### Step 2: 链接CSS到HTML
在HTML文件的 `<head>` 部分添加CSS链接：

```html
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>我的第一个网页</title>
    <link rel="stylesheet" href="styles.css">
</head>
```

### Step 3: 添加更多CSS样式
继续在CSS文件中添加更多样式：

```css
/* 主要内容区域 */
main {
    max-width: 800px;
    margin: 2rem auto;
    padding: 0 1rem;
    background: white;
    border-radius: 10px;
    box-shadow: 0 5px 15px rgba(0,0,0,0.1);
}

section {
    padding: 2rem;
    border-bottom: 1px solid #eee;
}

section:last-child {
    border-bottom: none;
}

h2 {
    color: #667eea;
    margin-bottom: 1rem;
    font-size: 1.8rem;
}

/* 图片样式 */
img {
    border-radius: 50%;
    display: block;
    margin: 1rem auto;
    border: 3px solid #667eea;
}

/* 列表样式 */
ul li {
    margin: 0.5rem 0;
    padding-left: 1rem;
}

/* 页脚样式 */
footer {
    background: #333;
    color: white;
    text-align: center;
    padding: 1rem;
    margin-top: 2rem;
}
```

## 实验任务

### 必做任务
1. ✅ 创建外部CSS文件并链接到HTML
2. ✅ 设置全局样式（字体、颜色、背景）
3. ✅ 为不同区域设置特定样式
4. ✅ 实现响应式布局基础

### 扩展任务
1. 🔄 添加CSS动画效果
2. 🔄 实现暗色主题切换
3. 🔄 使用CSS Grid或Flexbox优化布局
4. 🔄 添加媒体查询适配移动设备

## CSS属性练习

### 颜色和背景
```css
.colorful-box {
    background: linear-gradient(45deg, #ff6b6b, #4ecdc4);
    color: white;
    padding: 20px;
    border-radius: 15px;
}
```

### 文字样式
```css
.text-styles {
    font-size: 1.2rem;
    font-weight: bold;
    text-align: center;
    text-shadow: 2px 2px 4px rgba(0,0,0,0.3);
    letter-spacing: 1px;
}
```

### 盒模型
```css
.box-model-demo {
    width: 300px;
    height: 200px;
    padding: 20px;
    margin: 10px auto;
    border: 2px solid #333;
    box-shadow: 0 4px 8px rgba(0,0,0,0.2);
}
```

## 验收标准
- [ ] CSS文件正确链接到HTML
- [ ] 页面样式美观，布局合理
- [ ] 颜色搭配和谐
- [ ] 响应式设计基本实现
- [ ] CSS代码结构清晰，注释完整

## 参考资料
- [MDN CSS教程](https://developer.mozilla.org/zh-CN/docs/Web/CSS)
- [CSS选择器参考](https://www.w3school.com.cn/cssref/css_selectors.asp)
- [Flexbox完全指南](https://css-tricks.com/snippets/css/a-guide-to-flexbox/)

## 提交要求
提交HTML和CSS文件，并撰写实验总结，说明学到的CSS概念和遇到的挑战。