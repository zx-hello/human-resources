const getters = {
  sidebar: state => state.app.sidebar,
  device: state => state.app.device,
  // 登陆后的token
  token: state => state.user.token,
  // 登陆人的头像
  avatar: state => state.user.userInfo.staffPhoto,
  // 登陆人的用户名
  name: state => state.user.userInfo.username,
  // 登陆人的部门
  deptName: state => state.user.userInfo.departmentName,
  // 手机号
  mobile: state => state.user.userInfo.mobile,
  // 工号
  workNumber: state => state.user.userInfo.workNumber
}
export default getters
