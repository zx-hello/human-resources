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

// 获取当前登陆人信息 跨域请求
export function getUserInfo () {
  return request({
    url: '/sys/profile',
    method: 'post'
  })
}

export function getInfo (token) {
  return request({
    url: '/vue-admin-template/user/info',
    method: 'get',
    params: { token }
  })
}

export function logout () {
  return request({
    url: '/vue-admin-template/user/logout',
    method: 'post'
  })
}
