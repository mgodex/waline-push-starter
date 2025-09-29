// EdgeOne Pages 函数 - Waline 评论系统
// 使用 Node.js 格式，因为 EdgeOne Pages 支持 Node.js 运行时

const Waline = require('@waline/vercel');

// 创建 Waline 应用实例
const waline = Waline({
  env: 'edgeone',
  async postSave(comment) {
    // do what ever you want after save comment
    console.log('Comment saved:', comment);
  },
});

// EdgeOne Pages 函数入口点
module.exports = async (event, context) => {
  try {
    // 直接调用 Waline 处理请求
    return await waline(event, context);
  } catch (error) {
    console.error('Error handling request:', error);
    return {
      statusCode: 500,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ error: 'Internal Server Error' })
    };
  }
};
