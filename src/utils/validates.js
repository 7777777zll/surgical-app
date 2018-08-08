export function validatePhone (rule, value, callback) {
  if (value && !(/^1[3|4|5|8][0-9]\d{4,8}$/.test(value))) {
    return callback(new Error('不是完整的11位手机号或者正确的手机号前七位'))
  } else {
    return callback()
  }
}
