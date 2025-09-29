# Waline 评论系统 - 腾讯云 EdgeOne Pages 部署指南

## 项目概述

这是一个适配腾讯云 EdgeOne Pages 的 Waline 评论系统项目。

## 文件结构

```
├── functions/
│   └── comment.js          # EdgeOne 边缘函数
├── api/
│   └── comment.js          # 备用 API 函数
├── netlify/
│   └── functions/
│       └── comment.js      # 原始 Netlify 函数
├── edgeone.json           # EdgeOne 配置文件
├── package.json           # 项目依赖
└── README-EdgeOne.md      # 部署说明
```

## 部署到腾讯云 EdgeOne Pages

### 1. 准备工作

1. 注册腾讯云账号
2. 开通 EdgeOne 服务
3. 完成域名 ICP 备案（如果使用国内节点）

### 2. 部署步骤

#### 方法一：通过腾讯云控制台

1. 登录 [腾讯云 EdgeOne 控制台](https://console.cloud.tencent.com/edgeone)
2. 选择 "EdgeOne Pages"
3. 点击 "新建站点"
4. 连接 GitHub 仓库或上传代码包
5. 配置构建设置：
   - 构建命令：`npm install`
   - 输出目录：`/`
   - 函数目录：`functions/`

#### 方法二：通过 CLI 工具

```bash
# 安装 EdgeOne CLI
npm install -g @tencent/edgeone-cli

# 登录
edgeone login

# 部署
edgeone deploy
```

### 3. 环境变量配置

在 EdgeOne Pages 控制台中配置以下环境变量：

```bash
# 数据库配置（可选）
WALINE_DB_TYPE=sqlite
WALINE_DB_PATH=/tmp/waline.db

# 安全配置
WALINE_SECURE_DOMAINS=yourdomain.com
```

### 4. 域名配置

1. 在 EdgeOne 控制台添加自定义域名
2. 配置 DNS 解析
3. 启用 HTTPS（自动）

### 5. 函数路由配置

EdgeOne Pages 会自动识别 `functions/` 目录下的函数，并创建对应的 API 路由：

- `/api/comment` → `functions/comment.js`

## 使用说明

### 前端集成

在你的静态网站中集成 Waline：

```html
<!-- 引入 Waline -->
<script src="https://unpkg.com/@waline/client@v2/dist/waline.js"></script>

<!-- 初始化 Waline -->
<script>
  Waline.init({
    el: '#waline',
    serverURL: 'https://your-edgeone-domain.com/api/comment',
    // 其他配置...
  });
</script>
```

### API 端点

- **评论 API**: `https://your-domain.com/api/comment`
- **管理 API**: `https://your-domain.com/api/comment/admin`

## 优势特性

- 🌐 **全球边缘加速**：基于腾讯云全球节点
- 🔒 **安全防护**：内置 DDoS 防护和 Web 安全
- ⚡ **边缘计算**：函数在边缘节点执行，响应更快
- 💰 **成本优化**：按使用量计费
- 🇨🇳 **国内优化**：国内访问速度优秀

## 注意事项

1. **ICP 备案**：使用国内节点需要完成域名备案
2. **函数限制**：单个函数执行时间不超过 30 秒
3. **存储限制**：临时存储空间有限，建议使用外部数据库
4. **并发限制**：注意函数的并发执行限制

## 故障排除

### 常见问题

1. **404 错误**：检查函数路径和路由配置
2. **超时错误**：优化函数逻辑，减少执行时间
3. **数据库连接失败**：检查数据库配置和网络连接

### 日志查看

在 EdgeOne 控制台的 "函数日志" 中查看详细的执行日志。

## 技术支持

- [腾讯云 EdgeOne 文档](https://cloud.tencent.com/document/product/1552)
- [Waline 官方文档](https://waline.js.org/)
- [mGod](https://www.meng.me)
