export const memoryUsageStr = () => {
  const mem = process.memoryUsage();
  const memStr = Object.keys(mem)
    .map(
      (key) => `${key} ${Math.round((mem[key] / 1024 / 1024) * 100) / 100} MB`
    )
    .join("\n\t");
  return `pid: ${process.pid}, title: ${process.title}\n\t${memStr}`;
};
