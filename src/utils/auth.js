// 提供cookie操作的方法(简化)
import Cookies from 'js-cookie'

/**
 * 前端本地存储数据的方式
 * 1.localStoreage 大小：5M=>存储的数据一直存在
 *
 * 2.sessionStorage 大小：5M=>浏览器关闭，存储的数据就丢失了
 *
 * 3.cookie 大小：4KB=>可以设置过期时间
 */
// 存储cookie的key属性(名字)
const TokenKey = 'hr-admin-token-my'

// 从本地cookie根据key获取token
export function getToken () {
  return Cookies.get(TokenKey)
}

// 存储token
export function setToken (token) {
  return Cookies.set(TokenKey, token)
}

// 删除token
export function removeToken () {
  return Cookies.remove(TokenKey)
}
