// EdgeOne Pages Node Functions - Waline 评论系统
// 使用官方文档要求的格式

const Waline = require('@waline/vercel');

// 创建 Waline 应用实例
const waline = Waline({
  env: 'edgeone',
  async postSave(comment) {
    // do what ever you want after save comment
    console.log('Comment saved:', comment);
  },
});

// EdgeOne Pages Node Functions 入口点
// 使用官方文档要求的 export default function onRequest(context) 格式
export default function onRequest(context) {
  return new Promise(async (resolve, reject) => {
    try {
      // 直接调用 Waline 处理请求
      const result = await waline(context.request, context);
      resolve(result);
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
