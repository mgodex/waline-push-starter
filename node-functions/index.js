// EdgeOne Pages Node Functions - Waline 评论系统
// 尝试直接使用 Vercel 的部署方式

const Waline = require('@waline/vercel');

// 创建 Waline 应用实例，完全按照 Vercel 的方式
const waline = Waline({
  env: 'edgeone',
  async postSave(comment) {
    console.log('Comment saved:', comment);
  },
});

// EdgeOne Pages Node Functions 入口点
// 使用官方文档要求的 export default function onRequest(context) 格式
export default function onRequest(context) {
  return new Promise(async (resolve, reject) => {
    try {
      // 将 EdgeOne 的请求格式转换为 Vercel 格式
      const { request } = context;
      
      // 创建 Vercel 风格的 req 对象
      const req = {
        method: request.method,
        url: request.url,
        headers: Object.fromEntries(request.headers.entries()),
        body: null
      };
      
      // 获取请求体
      if (request.method !== 'GET' && request.method !== 'HEAD') {
        try {
          req.body = await request.text();
        } catch (e) {
          // 忽略获取 body 的错误
        }
      }
      
      // 创建 Vercel 风格的 res 对象
      const res = {
        statusCode: 200,
        headers: {},
        body: '',
        setHeader: function(name, value) {
          this.headers[name] = value;
        },
        end: function(data) {
          this.body = data || '';
        },
        write: function(data) {
          this.body += data;
        }
      };
      
      // 直接调用 Vercel 风格的 Waline 函数
      await waline(req, res);
      
      // 返回 EdgeOne 格式的响应
      resolve(new Response(res.body, {
        status: res.statusCode,
        headers: res.headers
      }));
      
    } catch (error) {
      console.error('Error handling request:', error);
      resolve(new Response(JSON.stringify({ 
        code: 500, 
        message: 'Internal Server Error',
        error: error.message
      }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      }));
    }
  });
}
