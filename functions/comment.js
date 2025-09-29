const http = require('http');
const Waline = require('@waline/vercel');
const serverless = require('serverless-http');

const app = Waline({
  env: 'edgeone',
  async postSave(comment) {
    // do what ever you want after save comment
    console.log('Comment saved:', comment);
  },
});

// EdgeOne Pages 边缘函数入口
exports.handler = async (event, context) => {
  const { request } = event;
  const { method, url, headers, body } = request;
  
  // 创建 HTTP 请求对象
  const req = {
    method,
    url,
    headers,
    body: body ? JSON.parse(body) : null
  };
  
  // 创建响应对象
  const res = {
    statusCode: 200,
    headers: {},
    body: ''
  };
  
  try {
    // 使用 serverless-http 处理请求
    const handler = serverless(http.createServer(app));
    const result = await handler(req, res);
    
    return {
      statusCode: res.statusCode,
      headers: res.headers,
      body: JSON.stringify(result)
    };
  } catch (error) {
    console.error('Error handling request:', error);
    return {
      statusCode: 500,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ error: 'Internal Server Error' })
    };
  }
};