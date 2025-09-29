// 使用函数包装来避免top-level await
export default async function handler(context) {
  // 动态导入Waline应用
  const { default: Application } = await import('@waline/vercel');
  
  // 创建Waline应用实例
  const app = Application({
    plugins: [],
    async postSave(comment) {
      // do what ever you want after comment saved
    },
  });
  
  // 调用Waline应用处理请求
  return await app(context.request, context);
}
