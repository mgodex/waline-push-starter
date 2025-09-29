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
      // 添加调试信息
      console.log('Context type:', typeof context);
      console.log('Context keys:', Object.keys(context));
      
      // 将 EdgeOne 的请求格式转换为 Vercel 格式
      const { request } = context;
      
      console.log('Request type:', typeof request);
      console.log('Request keys:', Object.keys(request));
      console.log('Request headers type:', typeof request.headers);
      
      // 安全地处理 headers
      let headers = {};
      if (request.headers) {
        if (typeof request.headers.entries === 'function') {
          // 标准 Headers 对象
          headers = Object.fromEntries(request.headers.entries());
        } else if (typeof request.headers === 'object') {
          // 普通对象
          headers = request.headers;
        }
      }
      
      // 创建 Vercel 风格的 req 对象
      const req = {
        method: request.method || 'GET',
        url: request.url || '/api/comment',
        headers: headers,
        body: null
      };
      
      console.log('Created req object:', JSON.stringify(req, null, 2));
      
      // 获取请求体
      if (request.method !== 'GET' && request.method !== 'HEAD') {
        try {
          req.body = await request.text();
        } catch (e) {
          console.error('Body parsing error:', e.message);
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
      
      console.log('Calling Waline...');
      // 直接调用 Vercel 风格的 Waline 函数
      await waline(req, res);
      console.log('Waline completed. Status:', res.statusCode, 'Body length:', res.body.length);
      
      // 返回 EdgeOne 格式的响应
      resolve(new Response(res.body, {
        status: res.statusCode,
        headers: res.headers
      }));
      
    } catch (error) {
      console.error('Error handling request:', error);
      console.error('Error stack:', error.stack);
      resolve(new Response(JSON.stringify({ 
        code: 500, 
        message: 'Internal Server Error',
        error: error.message,
        stack: error.stack
      }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      }));
    }
  });
}
