export async function getTime() {
  const now = new Date();

  return {
    success: true,
    data: {
      timestamp: now.getTime(),
      iso: now.toISOString(),
      local: now.toLocaleString("zh-CN", {
        timeZone: "Asia/Shanghai"
      }),
      date: now.toLocaleDateString("zh-CN", {
        timeZone: "Asia/Shanghai"
      }),
      time: now.toLocaleTimeString("zh-CN", {
        timeZone: "Asia/Shanghai"
      }),
      weekday: now.toLocaleDateString("zh-CN", {
        weekday: "long",
        timeZone: "Asia/Shanghai"
      })
    },
    error: null
  };
}