# 腾讯云EdgeOne Pages部署Waline指南

## 重要说明

根据[腾讯云EdgeOne Pages官方文档](https://edgeone.cloud.tencent.com/pages/document/184787642236784640)，EdgeOne Pages支持Node Functions，可以运行Node.js应用。

## 部署步骤

### 1. 项目结构
```
waline-push-starter/
├── node-functions/
│   ├── [[default]].js    # Waline应用入口（推荐）
│   └── index.js          # 或者使用index.js
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
- 使用ES模块格式，通过动态导入兼容CommonJS模块
- 支持Express/Koa等框架，无需启动HTTP Server

## 常见问题

### 404错误
如果部署后仍然404，检查：
1. 确保使用ES模块格式（`import/export`）
2. 使用动态导入兼容CommonJS模块：`const { default: Application } = await import('@waline/vercel')`
3. 确保环境变量已正确设置

### Top-level await错误
如果出现"top-level await is not available"错误：
- EdgeOne Pages运行在Node.js 14环境，不支持top-level await
- 使用函数包装来避免top-level await：
```javascript
export default async function onRequest(context) {
  const { default: Application } = await import('@waline/vercel');
  const app = Application({...});
  return await app(context.request, context);
}
```

### Node Functions未识别
如果出现"No node functions found"错误：
- 确保文件名正确：使用`[[default]].js`或`index.js`
- 确保使用`onRequest`函数名而不是`handler`
- 检查文件是否在`node-functions`目录下

### 502 Internal Server Error
如果出现"this.res.setHeader is not a function"错误：
- 这是因为Waline期望Express风格的请求/响应对象
- 需要创建适配器来转换EdgeOne Pages的请求/响应格式
- 代码中已经包含了完整的适配器实现

## 参考文档
- [EdgeOne Pages Node Functions文档](https://edgeone.cloud.tencent.com/pages/document/184787642236784640)
- [Express模板示例](https://express-template.edgeone.run)
