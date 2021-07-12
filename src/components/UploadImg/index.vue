<template>
  <div>
    <!-- action 后台上传图片的接口地址
         :show-file-list="false" 是否显示上传完的图片
         :on-success="handleAvatarSuccess" 上传成功后 会执行
         :before-upload="beforeAvatarUpload" 上传之前执行
         :http-request="upload" 自定义上传(自己发请求上传)==> 不走action地址了，同时也不会执行:on-success="handleAvatarSuccess"
    -->
    <el-upload
      class="avatar-uploader"
      action="#"
      :show-file-list="false"
      :before-upload="beforeAvatarUpload"
      :http-request="uploadSelf"
    >
      <!-- 若显示成功，就显示成功上传的图片 -->
      <img v-if="src" :src="src" class="avatar" />
      <!-- 默认显示图标 -->
      <i v-else class="el-icon-plus avatar-uploader-icon"></i>
      <!-- 进度条组件 -->
      <el-progress
        v-if="showProgress"
        type="circle"
        :percentage="percentage"
        class="progress"
      />
    </el-upload>
  </div>
</template>

<script>
// 导入cos的SDK调用 sdk包方法合集==>工具库
import COS from 'cos-js-sdk-v5'
// 初始化cos==>提供上传图片方法
const cos = new COS({
  SecretId: 'AKIDc4HDsFLBl46sMaXDcka9RRAetsa1C5h2', // 身份识别ID
  SecretKey: '4sOdcLnysWtzo68tNaXDbiZ9RSCfrmQo' // 身份秘钥
})
export default {
  name: 'UploadImg',
  props: {
    // 由父组件传递过来的地址
    src: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
      // // 上传成功图片的地址(服务器返回的)
      // imageUrl: '',
      // 上传的进度 (0~100)
      percentage: 0,
      // 控制进度条是否显示
      showProgress: false
    }
  },
  methods: {
    // // 上传成功回调==> 可以获取后台返回的图片地址
    // handleAvatarSuccess (res, file) {
    //   this.imageUrl = URL.createObjectURL(file.raw)
    // },
    // 上传之前的校验 校验图片的格式和大小
    beforeAvatarUpload (file) {
      const isJPG = file.type === 'image/jpeg'
      const isLt2M = file.size / 1024 / 1024 < 2

      if (!isJPG) {
        this.$message.error('上传头像图片只能是 JPG 格式!')
      }
      if (!isLt2M) {
        this.$message.error('上传头像图片大小不能超过 2MB!')
      }
      return isJPG && isLt2M
    },
    // 自定义上传
    // 获取图片的file对象需要结构
    uploadSelf ({ file }) {
      // console.log(file)
      // 开始上传-->显示进度条
      this.showProgress = true
      // 调用cos方法==>执行上传操作
      // putObject 方法参数：1.上传文件基本参数 2.回调函数==>获取上传成功的图片地址
      cos.putObject({
        Bucket: 'human-resource-avatar-1306499279', /* 存储桶名字 hrsass-1255477649 */
        Region: 'ap-beijing', /* 存储桶所在地域，必须字段 ap-beijing */
        Key: file.name, /* 文件名 文件的唯一标识 */
        StorageClass: 'STANDARD', // 上传模式, 标准模式
        Body: file, // 上传文件对象
        // 上传的进度信息 progressData
        onProgress: (progressData) => {
          // 存储上传进度  * 100 ---> 转成百分制
          this.percentage = progressData.percent * 100
          // console.log(JSON.stringify(progressData))
        }
      }, (err, data) => {
        // 注：回调函数必须使用箭头函数-->避免this拿不到
        // 获取上传成功地址
        console.log(err || data)
        // 上传成功之后
        if (data.statusCode === 200) {
          setTimeout(() => {
            // 进度条隐藏
            this.showProgress = false
            // 进度条进程归零
            this.percentage = 0
            // 回显图片
            // this.src = `https://${data.Location}`
            this.$emit('update:src', `https://${data.Location}`)
          }, 800)
        }
      })
    }
  }
}
</script>

<style lang="scss">
.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.avatar-uploader .el-upload:hover {
  border-color: #409eff;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  line-height: 178px;
  text-align: center;
}
.avatar {
  width: 178px;
  height: 178px;
  display: block;
}
.progress {
  position: absolute;
  display: flex;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: #fff;
}
</style>
