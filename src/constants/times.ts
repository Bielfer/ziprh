export const times = (() => {
  const times: string[] = [];
  const interval = 5;

  for (let i = 0; i < 24; i++) {
    for (let j = 0; j < 60 / interval; j++) {
      times.push(
        `${i}:${
          interval * j === 0 ? "00" : interval * j === 5 ? "05" : interval * j
        }`
      );
    }
  }

  return times;
})();
