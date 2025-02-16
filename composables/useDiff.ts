/**
 * 生成两个字符串的差异对比结果，使用HTML标签标记差异部分
 *
 * 实现原理：基于最长公共子序列（LCS）算法，通过动态规划找出两个字符串的差异，
 * 使用\<b\>标签标记str1特有的字符，\<strong\>标记str2特有的字符
 *
 * @param str1 原始字符串
 * @param str2 对比字符串
 * @returns 返回带有HTML标签的差异字符串，其中：
 *          - \<b\>标签表示str1中存在但str2不存在的字符（删除部分）
 *          - \<strong\>标签表示str2中存在但str1不存在的字符（新增部分）
 */
export function useDiff(str1: string, str2: string): string {
    // 构建动态规划表格存储LCS长度
    // 表格尺寸为 (str1.length+1) x (str2.length+1)，初始化第一行/列为0
    // dp[i][j] 表示str1前i个字符和str2前j个字符的LCS长度
    const dp: number[][] = []
    for (let i = 0; i <= str1.length; i++) {
        dp[i] = []
        for (let j = 0; j <= str2.length; j++) {
            if (i === 0 || j === 0) {
                dp[i][j] = 0
            } else if (str1[i - 1] === str2[j - 1]) {
                dp[i][j] = dp[i - 1][j - 1] + 1
            } else {
                dp[i][j] = Math.max(dp[i - 1][j], dp[i][j - 1])
            }
        }
    }

    // 反向遍历DP表格重构LCS字符串
    // 从右下角开始，根据字符匹配情况和DP表值决定移动方向
    let lcs = ''
    let i = str1.length
    let j = str2.length
    while (i > 0 && j > 0) {
        if (str1[i - 1] === str2[j - 1]) {
            lcs = str1[i - 1] + lcs
            i--
            j--
        } else if (dp[i - 1][j] > dp[i][j - 1]) {
            i--
        } else {
            j--
        }
    }

    // 生成差异标记字符串
    // 同时遍历原始字符串和LCS，标记差异部分：
    // - 在str1中但不在LCS中的字符标记为删除（<b>）
    // - 在str2中但不在LCS中的字符标记为新增（<strong>）
    let diff = ''
    let idx1 = 0
    let idx2 = 0
    for (let k = 0; k < lcs.length; k++) {
        // 处理str1中LCS字符前的非公共字符
        while (str1[idx1] !== lcs[k]) {
            diff += `<b>${str1[idx1++]}</b>`
        }
        // 处理str2中LCS字符前的非公共字符
        while (str2[idx2] !== lcs[k]) {
            diff += `<strong>${str2[idx2++]}</strong>`
        }
        // 添加公共字符
        diff += lcs[k]
        idx1++
        idx2++
    }

    // 处理字符串末尾的剩余差异
    while (idx1 < str1.length) {
        diff += `<b>${str1[idx1++]}</b>`
    }
    while (idx2 < str2.length) {
        diff += `<strong>${str2[idx2++]}</strong>`
    }

    return diff.trim()
}
