// 简化的Waline测试函数
export default async function onRequest(context) {
  try {
    // 动态导入Waline应用
    const { default: Application } = await import('@waline/vercel');
    
    // 创建Waline应用实例（不依赖外部数据库）
    const app = Application({
      plugins: [],
      async postSave(comment) {
        console.log('Comment saved:', comment);
      },
    });
    
    // 创建简单的请求/响应对象
    const mockReq = {
      method: context.request.method,
      url: context.request.url,
      headers: {},
      body: context.request.method !== 'GET' ? await context.request.text() : undefined,
    };
    
    const mockRes = {
      statusCode: 200,
      headers: {},
      setHeader: function(name, value) {
        this.headers[name] = value;
      },
      end: function(data) {
        this.body = data;
      },
      json: function(obj) {
        this.setHeader('Content-Type', 'application/json');
        this.end(JSON.stringify(obj));
      }
    };
    
    // 调用Waline应用
    await app(mockReq, mockRes);
    
    // 返回响应
    return new Response(mockRes.body || 'Waline test response', {
      status: mockRes.statusCode,
      headers: mockRes.headers
    });
    
  } catch (error) {
    console.error('Waline test error:', error);
    return new Response(JSON.stringify({
      error: 'Waline test failed',
      message: error.message,
      stack: error.stack
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}
