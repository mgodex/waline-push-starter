// 适配EdgeOne Pages Node Functions的请求/响应格式
export default async function onRequest(context) {
  // 添加调试信息
  console.log('Waline function called:', context.request.url, context.request.method);
  
  // 处理特殊路径
  const url = new URL(context.request.url);
  const pathname = url.pathname;
  
  if (pathname === '/test') {
    return new Response(JSON.stringify({
      message: 'Node Functions is working!',
      url: context.request.url,
      method: context.request.method,
      timestamp: new Date().toISOString()
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  }
  
  if (pathname === '/waline-test') {
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
  
  // 动态导入Waline应用
  const { default: Application } = await import('@waline/vercel');
  
  // 创建Waline应用实例
  const app = Application({
    plugins: [],
    async postSave(comment) {
      // do what ever you want after comment saved
    },
  });
  
  // 创建适配EdgeOne Pages的请求/响应对象
  const requestUrl = context.request.url;
  let url;
  
  try {
    // 尝试直接解析URL
    url = new URL(requestUrl);
  } catch (e) {
    // 如果不是完整URL，添加协议和域名
    url = new URL(requestUrl.startsWith('/') ? `https://example.com${requestUrl}` : `https://example.com/${requestUrl}`);
  }
  
  // 处理headers对象
  let headers = {};
  if (context.request.headers) {
    if (typeof context.request.headers.entries === 'function') {
      // 标准Headers对象
      headers = Object.fromEntries(context.request.headers.entries());
    } else if (typeof context.request.headers === 'object') {
      // 普通对象
      headers = context.request.headers;
    }
  }
  
  const mockReq = {
    method: context.request.method,
    url: url.pathname + url.search,
    headers: headers,
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
  
  // 返回EdgeOne Pages格式的响应
  return new Response(mockRes.body || '', {
    status: mockRes.statusCode,
    headers: mockRes.headers
  });
}