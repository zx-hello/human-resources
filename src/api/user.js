import request from '@/utils/request'

/**
 * @description: 登录
 * @param {*} data {modile 手机号, password 密码}
 * @return {*} axios请求对象
 */
export function login (data) {
  return request({
    url: '/sys/login',
    method: 'post',
    data
  })
}

/**
 * 获取当前登陆人信息
 * 根据token(是加密的，解密出来包含用户主要信息) 查询用户信息
 * @returns
 */
//  跨域请求
export function getUserInfo () {
  return request({
    url: '/sys/profile',
    method: 'post'
  })
}

/**
 * @description: 获取用户头像
 * @param {*} id 用户id
 * @return {*}
 */
export function getUserDetailById (id) {
  return request({
    url: `/sys/user/${id}`
  })
}

/**
 * @description: 保存员工信息
 * @param {*} data
 * @return {*}
 */
export function saveUserDetailById (data) {
  return request({
    url: `/sys/user/${data.id}`,
    method: 'put',
    data
  })
}
