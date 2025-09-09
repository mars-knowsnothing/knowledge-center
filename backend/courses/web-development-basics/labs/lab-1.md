# Web Development Basics - Lab 1: HTML Fundamentals

## 实验目标
掌握HTML基本语法和结构，学会创建基本的网页。

## 实验环境
- 任意文本编辑器（推荐VS Code）
- Web浏览器（Chrome、Firefox等）

## 实验步骤

### Step 1: 创建基本HTML结构
创建一个名为 `index.html` 的文件，编写基本的HTML5文档结构：

```html
<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>我的第一个网页</title>
</head>
<body>
    <h1>欢迎来到Web开发世界</h1>
    <p>这是我的第一个HTML页面。</p>
</body>
</html>
```

### Step 2: 添加更多HTML元素
在body标签内添加更多元素：

```html
<body>
    <header>
        <h1>我的个人网站</h1>
        <nav>
            <ul>
                <li><a href="#about">关于我</a></li>
                <li><a href="#projects">项目</a></li>
                <li><a href="#contact">联系方式</a></li>
            </ul>
        </nav>
    </header>
    
    <main>
        <section id="about">
            <h2>关于我</h2>
            <p>我是一名正在学习Web开发的学生。</p>
            <img src="profile.jpg" alt="个人照片" width="200">
        </section>
        
        <section id="projects">
            <h2>我的项目</h2>
            <ul>
                <li>项目1：待定</li>
                <li>项目2：待定</li>
            </ul>
        </section>
    </main>
    
    <footer>
        <p>&copy; 2024 版权所有</p>
    </footer>
</body>
```

### Step 3: 验证和测试
1. 保存文件
2. 在浏览器中打开 `index.html`
3. 检查页面是否正确显示
4. 验证所有链接和元素是否正常工作

## 实验任务

### 必做任务
1. ✅ 创建包含所有基本HTML5元素的网页
2. ✅ 添加语义化标签（header、nav、main、section、footer）
3. ✅ 实现页面内锚点链接导航
4. ✅ 添加图片和列表元素

### 扩展任务
1. 🔄 添加表格展示个人技能
2. 🔄 创建一个简单的联系表单
3. 🔄 使用HTML5新元素（如article、aside）

## 验收标准
- [ ] HTML代码结构清晰，语义化标签使用正确
- [ ] 页面在浏览器中能正常显示
- [ ] 所有链接功能正常
- [ ] 代码格式规范，缩进一致

## 参考资料
- [MDN HTML教程](https://developer.mozilla.org/zh-CN/docs/Web/HTML)
- [W3School HTML教程](https://www.w3school.com.cn/html/)

## 提交要求
请提交完成的HTML文件，并在实验报告中说明遇到的问题和解决方案。