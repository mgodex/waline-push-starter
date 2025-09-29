// 基于 Vercel 格式的 Waline 实现
// 尝试直接使用 Vercel 的部署方式

const Waline = require('@waline/vercel');

// 创建 Waline 应用实例，完全按照 Vercel 的方式
const waline = Waline({
  env: 'edgeone',
  async postSave(comment) {
    console.log('Comment saved:', comment);
  },
});

// 导出 Vercel 风格的函数
module.exports = waline;
