import request from '@/utils/request'

// 获取权限列表
export function getPermissionList (params) {
  return request({
    url: '/sys/permission',
    params
  })
}
// 新增权限
/**
 * 新增权限
 * @param {*} data
 * enVisible	string	非必须 是否启用  0 不启用  1 启用
    name	string	非必须 权限点名称
    code	string	非必须 权限点标识(开发权限控制会使用)
    description	string	非必须 权限点描述
    type	number	非必须 权限类型  1-页面访问   2-页面下功能
    pid	string	非必须 权限点父节点ID('0'表示页面权限   |  '1172702828368498688' 表示页面下功能权限)
 * @returns Promise
 */
export function addPermission (data) {
  return request({
    url: '/sys/permission',
    method: 'post',
    data
  })
}

// 更新权限
export function updatePermission (data) {
  return request({
    url: `/sys/permission/${data.id}`,
    method: 'put',
    data
  })
}

// 删除权限 id:权限点ID
export function delPermission (id) {
  return request({
    url: `/sys/permission/${id}`,
    method: 'delete'
  })
}

// 获取权限详情 id:权限点ID
export function getPermissionDetail (id) {
  return request({
    url: `/sys/permission/${id}`
  })
}
