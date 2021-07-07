import request from '@/utils/request'
/**
 * @description: 获取角色列表
 * @param {*} params:{page 页码, pagesize 每页条数}
 * @return {*}
 */
export function getRoleList (params) {
  return request({
    url: '/sys/role',
    params
  })
}

/**
 * @description: 删除角色
 * @param {*} id 角色id
 * @return {*}
 */
export function deleteRole (id) {
  return request({
    url: `/sys/role/${id}`,
    method: 'delete'
  })
}

/**
 * @description: 新增角色
 * @param {*} data {name,description}
 * @return {*}
 */
export function addRole (data) {
  return request({
    url: '/sys/role',
    data,
    method: 'post'
  })
}

/**
 * @description: 获取角色详情
 * @param {*} id 角色id
 * @return {*}
 */
export function getRoleDetail (id) {
  return request({
    url: `/sys/role/${id}`
  })
}

/**
 * @description: 编辑角色
 * @param {*} data
 * @return {*}
 */
export function updateRole (data) {
  return request({
    url: `/sys/role/${data.id}`,
    data,
    method: 'put'
  })
}
