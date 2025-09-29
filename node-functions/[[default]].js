// 使用动态导入来兼容CommonJS模块
const { default: Application } = await import('@waline/vercel');

const app = Application({
  plugins: [],
  async postSave(comment) {
    // do what ever you want after comment saved
  },
});

// 导出应用实例，按照EdgeOne Pages Node Functions的要求
export default app;
