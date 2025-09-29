// 简单的测试函数
export default async function onRequest(context) {
  return new Response(JSON.stringify({
    message: 'Node Functions is working!',
    url: context.request.url,
    method: context.request.method,
    timestamp: new Date().toISOString()
  }), {
    status: 200,
    headers: {
      'Content-Type': 'application/json'
    }
  });
}
