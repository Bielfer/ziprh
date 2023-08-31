export const generateIntegerArray = (min: number, max: number) => {
  const len = max - min + 1;
  const arr = new Array<number>(len);

  for (let i = 0; i < len; i += 1) {
    arr[i] = min + i;
  }

  return arr;
};

export const arrayExistsAndHasItems = (arr?: any[] | null) =>
  !!arr && arr.length > 0;
