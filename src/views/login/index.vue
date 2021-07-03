<template>
  <div class="login-container">
    <el-form
      ref="loginForm"
      :model="loginForm"
      :rules="loginRules"
      class="login-form"
      auto-complete="on"
      label-position="left"
    >
      <!-- 表单title -->
      <div class="title-container">
        <h3 class="title">
          <img src="@/assets/common/login-logo.png" alt="" />
        </h3>
      </div>
      <!-- 表单项 -->
      <el-form-item prop="mobile">
        <!-- svg-container全局图标组件 -->
        <span class="svg-container">
          <svg-icon icon-class="user" />
        </span>
        <el-input
          ref="mobile"
          v-model="loginForm.mobile"
          placeholder="请输入手机号"
          name="mobile"
          type="text"
          tabindex="1"
          auto-complete="on"
        />
      </el-form-item>

      <el-form-item prop="password">
        <span class="svg-container">
          <svg-icon icon-class="password" />
        </span>
        <!--  给自定义组件绑定原生事件的时候，需要加上.native修饰符，当前事件才会生效
              原因：el-input不是html的元素
              .native修饰符起到事件穿透=>穿过自定义元素=>把事件应用到里面的html元素身上
         -->
        <el-input
          :key="passwordType"
          ref="password"
          v-model="loginForm.password"
          :type="passwordType"
          placeholder="Password"
          name="password"
          tabindex="2"
          auto-complete="on"
          @keyup.enter.native="handleLogin"
        />
        <span class="show-pwd" @click="showPwd">
          <svg-icon
            :icon-class="passwordType === 'password' ? 'eye' : 'eye-open'"
          />
        </span>
      </el-form-item>
      <!-- 提交 -->
      <el-button
        :loading="loading"
        type="primary"
        style="width: 100%; margin-bottom: 30px"
        @click.native.prevent="handleLogin"
      >
        Login
      </el-button>
      <!-- 提示 -->
      <div class="tips">
        <!-- 人资中台账号的提示 -->
        <span style="margin-right: 20px">账号: 13800000002</span>
        <span> 密码: 123456</span>
      </div>
    </el-form>
  </div>
</template>

<script>
// 导入可复用的校验方法
import { validMobile } from '@/utils/validate'
// 导入接口
// import { login } from '@/api/user'

export default {
  name: 'Login',
  data () {
    /**
     * value: 当前输入的手机号的值
     * callback 校验是否通过
     */
    const validateMobile = (rule, value, callback) => {
      if (!validMobile(value)) {
        // 错误提示
        callback(new Error('手机号格式不正确！'))
      } else {
        // 通过校验
        callback()
      }
    }

    return {
      // 表单的所有数据
      loginForm: {
        mobile: '', // 手机号
        password: '' // 密码
      },
      // 验证规则
      loginRules: {
        mobile: [{ required: true, trigger: 'blur', validator: validateMobile }],
        password: [
          { required: true, message: '密码为必填项！', trigger: 'blur' },
          { min: 6, max: 10, message: '密码长度为6~10位！', trigger: 'blur' }
        ]
      },
      // loading加载动画
      loading: false,
      passwordType: 'password',
      redirect: undefined
    }
  },
  watch: {
    $route: {
      handler: function (route) {
        this.redirect = route.query && route.query.redirect
      },
      immediate: true
    }
  },
  methods: {
    showPwd () {
      if (this.passwordType === 'password') {
        this.passwordType = ''
      } else {
        this.passwordType = 'password'
      }
      this.$nextTick(() => {
        this.$refs.password.focus()
      })
    },
    // 提交登录
    handleLogin () {
      // 表单的整体校验
      this.$refs.loginForm.validate(async valid => {
        if (valid) {
          // 成功 所有表单项校验通过
          // 提交开启loading提示
          try {
            this.loading = true
            // const res = await login(this.loginForm)
            // console.log(res)
            // // 存储token到vuex
            // this.$store.commit('user/updateToken', res)
            // 调用action
            // dispatch这个是异步方法，所以要保证等到token获取+存储才跳转
            await this.$store.dispatch('user/loginAction', this.loginForm)
            // 关闭loading加载效果
            // this.loading = false
            // 跳转到首页
            this.$router.replace('/')
          } catch (error) {
            console.log(error)
            // 关闭loading加载效果=>用户可以继续操作
            this.loading = false
          }
          // this.$store.dispatch('user/login', this.loginForm).then(() => {
          //   this.$router.push({ path: this.redirect || '/' })
          //   this.loading = false
          // }).catch(() => {
          //   this.loading = false
          // })
          // } else {
          //   console.log('error submit!!')
          //   return false
        }
      })
    }
  }
}
</script>

<style lang="scss">
// 全局的样式 为了避免覆盖子组件的样式使用/deep/
/* 修复input 背景不协调 和光标变色 */
/* Detail see https://github.com/PanJiaChen/vue-element-admin/pull/927 */

$bg: #283443;
$light_gray: #68b0fe;
$cursor: #fff;

@supports (-webkit-mask: none) and (not (cater-color: $cursor)) {
  .login-container .el-input input {
    color: $cursor;
  }
}

/* reset element-ui css */
.login-container {
  // ~@/path  这里使用@ 前一定要加上~，是固定用法，不然会报错
  background-image: url("~@/assets/common/mylogin.jpg"); // 设置背景图片
  background-position: center; // 将图片位置设置为充满整个屏幕
  .el-input {
    display: inline-block;
    height: 47px;
    width: 85%;

    input {
      background: transparent;
      border: 0px;
      -webkit-appearance: none;
      border-radius: 0px;
      padding: 12px 5px 12px 15px;
      color: $light_gray;
      height: 47px;
      caret-color: $cursor;

      &:-webkit-autofill {
        box-shadow: 0 0 0px 1000px $bg inset !important;
        -webkit-text-fill-color: $cursor !important;
      }
    }
  }

  .el-form-item {
    border: 1px solid rgba(255, 255, 255, 0.1);
    background: rgba(255, 255, 255, 0.7); // 输入登录表单的背景色
    border-radius: 5px;
    color: #454545;
  }
  /* reset element-ui css 表单校验 */
  .el-form-item__error {
    color: #fff;
  }
}
</style>

<style lang="scss" scoped>
// 当前页面的样式
$bg: #2d3a4b;
$dark_gray: #889aa4;
$light_gray: #eee;

.login-container {
  min-height: 100%;
  width: 100%;
  background-color: $bg;
  overflow: hidden;

  .login-form {
    position: relative;
    width: 520px;
    max-width: 100%;
    padding: 160px 35px 0;
    margin: 0 auto;
    overflow: hidden;
  }

  .tips {
    font-size: 14px;
    color: #fff;
    margin-bottom: 10px;

    span {
      &:first-of-type {
        margin-right: 16px;
      }
    }
  }

  .svg-container {
    padding: 6px 5px 6px 15px;
    color: $dark_gray;
    vertical-align: middle;
    width: 30px;
    display: inline-block;
  }

  .title-container {
    position: relative;

    .title {
      font-size: 26px;
      color: $light_gray;
      margin: 0px auto 40px auto;
      text-align: center;
      font-weight: bold;
    }
  }

  .show-pwd {
    position: absolute;
    right: 10px;
    top: 7px;
    font-size: 16px;
    color: $dark_gray;
    cursor: pointer;
    user-select: none;
  }
}
</style>
