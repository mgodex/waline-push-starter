// 适配EdgeOne Pages Node Functions的请求/响应格式
export default async function onRequest(context) {
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
  const mockReq = {
    method: context.request.method,
    url: new URL(context.request.url).pathname + new URL(context.request.url).search,
    headers: Object.fromEntries(context.request.headers.entries()),
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
