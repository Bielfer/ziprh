/* eslint @typescript-eslint/no-explicit-any:off */

export const tryCatch = async <T>(
  promise: Promise<T>
): Promise<[T | null, any]> => {
  try {
    return [await promise, null];
  } catch (error) {
    return [null, error];
  }
};
