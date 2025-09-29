const Application = require('@waline/vercel');

const app = Application({
  plugins: [],
  async postSave(comment) {
    // do what ever you want after comment saved
  },
});

// 导出应用实例，按照EdgeOne Pages Node Functions的要求
export default app;
