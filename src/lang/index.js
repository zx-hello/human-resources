/**
 * 初始化i18n国际化插件
 * 系统文字的翻译
 * 1.若使用了组件库，需要单独翻译组件库里组件文字的多语言
 * 2.系统自己组件内的自定义内容的翻译
 * 翻译实现步骤：
 * 1.要翻译的文字--->提供对应语种的翻译结果--->语言包(中文+英文两个语言包)
 * 2.将语言包传入翻译插件实例中
 *
 * 核心原理：读取不同语种的语言包实现不同语言的网站
 *
 * 语言包如何去定义：
 * 1.数据结构是一个对象
 * 2.在对象中可以按照模块或页面去划分翻译的属性{login: {}, navbar: {}}
 * 3.在对应模块或页面的属性下使用一个新对象放置翻译结果{login: {title: Title}}
 */
import Vue from 'vue' // 引入Vue
import VueI18n from 'vue-i18n' // 引入国际化的插件包

// 引入element英文包
import elementEN from 'element-ui/lib/locale/lang/en'
// 引入element中文包(简体+繁体)
import elementZH from 'element-ui/lib/locale/lang/zh-CN'

// 导入自定义的语言包
import SelfZH from './language/zh'
import SelfEN from './language/en'
import Cookies from 'js-cookie'

// 1.全局注册国际化包
Vue.use(VueI18n)

// 2.初始化实例 创建国际化插件的实例
const i18n = new VueI18n({
  // 指定message中支持的语言包，zh表示中文，en表示英文
  locale: Cookies.get('hr-lang') || 'en',
  // 接收支持的语言包
  messages: {
    // 英文包
    en: {
      ...elementEN, // element英文语言包
      ...SelfEN // 自定义英文包
    },
    zh: {
      ...elementZH, // element中文语言包
      ...SelfZH // 自定义中文包
    }
  }
})

// 3.导出多语实例
export default i18n
