# 腾讯云EdgeOne Pages部署Waline指南

## 重要说明

根据[腾讯云EdgeOne Pages官方文档](https://edgeone.cloud.tencent.com/pages/document/184787642236784640)，EdgeOne Pages支持Node Functions，可以运行Node.js应用。

## 部署步骤

### 1. 项目结构
```
waline-push-starter/
├── node-functions/
│   └── [[default]].js    # Waline应用入口
├── package.json          # 依赖配置
└── robots.txt           # 静态文件
```

### 2. 环境变量配置
在EdgeOne Pages控制台设置以下环境变量：
- `LEAN_ID`: 你的LeanCloud应用ID
- `LEAN_KEY`: 你的LeanCloud应用Key  
- `LEAN_MASTER_KEY`: 你的LeanCloud主密钥

### 3. 部署配置
- 框架类型：选择"全栈"或"后端"
- 构建命令：`npm install`
- 输出目录：`./`

### 4. 访问路径
部署成功后，Waline将在根路径 `/` 下运行。

## 技术说明

- 使用`[[default]].js`作为入口文件，处理所有路由
- 按照EdgeOne Pages Node Functions的要求导出应用实例
- 支持Express/Koa等框架，无需启动HTTP Server

## 参考文档
- [EdgeOne Pages Node Functions文档](https://edgeone.cloud.tencent.com/pages/document/184787642236784640)
- [Express模板示例](https://express-template.edgeone.run)
