export const times = (() => {
  const times: string[] = [];

  for (let i = 0; i < 24; i++) {
    for (let j = 0; j < 4; j++) {
      times.push(`${i}:${15 * j === 0 ? "00" : 15 * j}`);
    }
  }

  return times;
})();
