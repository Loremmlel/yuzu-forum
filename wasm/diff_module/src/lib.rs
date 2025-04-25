use wasm_bindgen::prelude::*;

#[wasm_bindgen]
pub fn compute_diff(str1: &str, str2: &str) -> String {
    let str1_chars: Vec<char> = str1.chars().collect();
    let str2_chars: Vec<char> = str2.chars().collect();
    let m = str1_chars.len();
    let n = str2_chars.len();

    // 创建DP表格
    let mut dp = vec![vec![0; n + 1]; m + 1];

    for i in 1..=m {
        for j in 1..=n {
            if str1_chars[i - 1] == str2_chars[j - 1] {
                dp[i][j] = dp[i - 1][j - 1] + 1;
            } else {
                dp[i][j] = std::cmp::max(dp[i - 1][j], dp[i][j - 1]);
            }
        }
    }

    let mut lcs = String::new();
    let mut i = m;
    let mut j = n;

    while i > 0 && j > 0 {
        if str1_chars[i - 1] == str2_chars[j - 1] {
            lcs.insert(0, str1_chars[i - 1]);
            i -= 1;
            j -= 1;
        } else if dp[i - 1][j] > dp[i][j - 1] {
            i -= 1;
        } else {
            j -= 1;
        }
    }

    let lcs_chars: Vec<char> = lcs.chars().collect();
    let mut diff = String::new();
    let mut idx1 = 0;
    let mut idx2 = 0;

    for &lcs_char in lcs_chars.iter() {
        while idx1 < m && str1_chars[idx1] != lcs_char {
            diff.push_str(&format!("<b>{}</b>", str1_chars[idx1]));
            idx1 += 1;
        }

        while idx2 < n && str2_chars[idx2]!= lcs_char {
            diff.push_str(&format!("<strong>{}</strong>", str2_chars[idx2]));
            idx2 += 1;
        }

        diff.push(lcs_char);
        idx1 += 1;
        idx2 += 1;
    }

    while idx1 < m {
        diff.push_str(&format!("<b>{}</b>", str1_chars[idx1]));
        idx1 += 1;
    }
    while idx2 < n {
        diff.push_str(&format!("<strong>{}</strong>", str2_chars[idx2]));
        idx2 += 1;
    }
    diff
}