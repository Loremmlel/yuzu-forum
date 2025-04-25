import { compute_diff } from "diff_module";

export function useDiffWasm(str1: string, str2: string): string {
  if (str1.length < 100 && str2.length < 100) {
    return useDiff(str1, str2)
  }

  try {
    return compute_diff(str1, str2)
  } catch (error) {
    console.error('WASM 计算失败，使用 JS 计算', error)
    return useDiff(str1, str2)
  }
}