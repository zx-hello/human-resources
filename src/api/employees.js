import request from '@/utils/request'

/**
 * @description: 获取下拉选择部门负责人数据
 * @param {*}
 * @return {*}
 */
export function getEmployeeSimple () {
  return request({
    url: '/sys/user/simple'
  })
}
