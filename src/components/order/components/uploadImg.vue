<template>
<div>
  <el-upload
    action="/common/staticAsset/upload/user/"
    list-type="picture-card"
    :on-preview="showDetail"
    :before-upload="beforeUpload"
    :on-success='success'
    :on-error='error'
    :on-remove='remove'
    >
    <i class="el-icon-plus"></i>
  </el-upload>
  <!-- 大图弹框 -->
  <el-dialog v-model="dialogVisible" size="large">
    <img width="100%" :src="dialogImageUrl" alt="">
  </el-dialog>
  <div class="uploadimg">
    <ul><li class="info">上传图片,最多可以上传{{num}}张</li></ul>
  </div>
</div>
</template>

<script>
import mui from 'mui'
import Vue from 'vue'

export default {
  name: 'uploadimg',
  props: {
    index: {
      type: Number,
      default: 0
    },
    // 图片数量
    num: {
      type: Number,
      default: 5
    }
  },
  data () {
    return {
      dialogImageUrl: '',
      dialogVisible: false,
      fileList: []
    }
  },
  methods: {
    // 显示大图
    showDetail (file) {
      this.dialogImageUrl = file.url
      this.dialogVisible = true
    },
    // 限制上传格式和数量
    beforeUpload (file) {
      let type = file.type.substring(6).toLowerCase()
      if (!/^(jpg|png|gif|bmp|pcx|tiff|jpeg|tga|exif|fpx|svg)$/.test(type)) {
        mui.toast('图片格式错误')
        return false
      }
      // 防止上传未完成时再上传，导致超出数量限制
      document.getElementsByClassName('el-upload--picture-card')[0].style.display = 'none'
    },
    // 上传成功回调
    success (response, file, fileList) {
      this.fileList = fileList
      this.emitPicUrlList()
      // 五张图片时隐藏上传控件
      if (this.fileList.length !== this.num) {
        document.getElementsByClassName('el-upload--picture-card')[0].style.display = 'inline-block'
      }
    },
    // 上传失败回调
    error () {
      document.getElementsByClassName('el-upload--picture-card')[0].style.display = 'inline-block'
    },
    // 移除图片
    remove (file, fileList) {
      this.fileList = fileList
      this.emitPicUrlList()
      // 少于五张图片时显示上传控件
      Vue.nextTick(() => {
        if (this.fileList.length === (this.num - 1)) {
          document.getElementsByClassName('el-upload--picture-card')[0].style.display = 'inline-block'
        }
      })
    },
    // 实时反馈图片url数组
    emitPicUrlList () {
      let picUrlList = []
      for (let file of this.fileList) {
        picUrlList.push(file.response.assetUrl)
      }
      // 反馈 最新的url数组
      this.$emit('updatePicUrl', picUrlList, this.index)
    }
  },
  created () {
  }
}

</script>

<style scoped>
</style>
