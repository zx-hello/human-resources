/**
 * Created by PanJiaChen on 16/11/18.
 */

/**
 * Parse the time to string
 * @param {(Object|string|number)} time
 * @param {string} cFormat
 * @returns {string | null}
 */
export function parseTime (time, cFormat) {
  if (arguments.length === 0 || !time) {
    return null
  }
  const format = cFormat || '{y}-{m}-{d} {h}:{i}:{s}'
  let date
  if (typeof time === 'object') {
    date = time
  } else {
    if ((typeof time === 'string')) {
      if ((/^[0-9]+$/.test(time))) {
        // support "1548221490638"
        time = parseInt(time)
      } else {
        // support safari
        // https://stackoverflow.com/questions/4310953/invalid-date-in-safari
        time = time.replace(new RegExp(/-/gm), '/')
      }
    }

    if ((typeof time === 'number') && (time.toString().length === 10)) {
      time = time * 1000
    }
    date = new Date(time)
  }
  const formatObj = {
    y: date.getFullYear(),
    m: date.getMonth() + 1,
    d: date.getDate(),
    h: date.getHours(),
    i: date.getMinutes(),
    s: date.getSeconds(),
    a: date.getDay()
  }
  const time_str = format.replace(/{([ymdhisa])+}/g, (result, key) => {
    const value = formatObj[key]
    // Note: getDay() returns 0 on Sunday
    if (key === 'a') { return ['日', '一', '二', '三', '四', '五', '六'][value] }
    return value.toString().padStart(2, '0')
  })
  return time_str
}

/**
 * @param {number} time
 * @param {string} option
 * @returns {string}
 */
export function formatTime (time, option) {
  if (('' + time).length === 10) {
    time = parseInt(time) * 1000
  } else {
    time = +time
  }
  const d = new Date(time)
  const now = Date.now()

  const diff = (now - d) / 1000

  if (diff < 30) {
    return '刚刚'
  } else if (diff < 3600) {
    // less 1 hour
    return Math.ceil(diff / 60) + '分钟前'
  } else if (diff < 3600 * 24) {
    return Math.ceil(diff / 3600) + '小时前'
  } else if (diff < 3600 * 24 * 2) {
    return '1天前'
  }
  if (option) {
    return parseTime(time, option)
  } else {
    return (
      d.getMonth() +
      1 +
      '月' +
      d.getDate() +
      '日' +
      d.getHours() +
      '时' +
      d.getMinutes() +
      '分'
    )
  }
}

/**
 * @param {string} url
 * @returns {Object}
 */
export function param2Obj (url) {
  const search = decodeURIComponent(url.split('?')[1]).replace(/\+/g, ' ')
  if (!search) {
    return {}
  }
  const obj = {}
  const searchArr = search.split('&')
  searchArr.forEach(v => {
    const index = v.indexOf('=')
    if (index !== -1) {
      const name = v.substring(0, index)
      const val = v.substring(index + 1, v.length)
      obj[name] = val
    }
  })
  return obj
}

/**
 *
 * @param {*} list 没有父子结构关系的部门数据
 * @returns {Array} 返回部门的树形结构数据
 *
 * treeData：树形结构的数据(父子嵌套关系)
 * 如何处理树形结构：找规律=> 父子部门的关系
 * 规律：pid 父部门：空
 *           子部门：有=父部门的id
 * 步骤：1.声明一个空数组=> 存储处理的数据
 *       2.根据规律去生成关系数据=> 父子映射关系=>对象
 *       3.根据关系数据遍历list查找父部门
 *       4.返回处理完的树形结构
 */
// 树形结构的数据
export function formatTreeData (list) {
  // 最终要产出的数组
  const treeData = []
  // 处理逻辑
  // 父子映射关系=> 所有项都使用对象存储起来=》{id: 部门数据}
  const maps = {}
  list.forEach(dept => { maps[dept.id] = dept })
  // console.log(maps)
  // 根据关系数据遍历list查找父部门
  list.forEach(dept => {
    // 遍历所有部门数据=>找父部门
    // 排除公司
    if (parseInt(dept.pid) === -1) return
    const parent = maps[dept.pid]
    // 如果存在则表示dept不是最顶层的数据=>pid为父节点ID
    if (parent) {
      // 说明当前dept是个 子部门
      if (!parent.children) {
        // 第一次初始化添加
        parent.children = []
      }
      parent.children.push(dept)
    } else {
      // 如果不存在 则是顶层部门
      treeData.push(dept)
    }
  })
  // 返回出去
  // console.log(treeData)
  return treeData
}
