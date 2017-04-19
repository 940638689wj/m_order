<template>
<div>
  <el-upload
    action="/common/staticAsset/upload/user/"
    list-type="picture-card"
    :on-preview="showDetail"
    :before-upload="numLimit"
    :on-success='success'
    :on-remove='remove'
    >
    <i class="el-icon-plus"></i>
  </el-upload>
  <!-- 大图弹框 -->
  <el-dialog v-model="dialogVisible" size="large">
    <img width="100%" :src="dialogImageUrl" alt="">
  </el-dialog>
  <div class="uploadimg">
    <ul><li class="info">上传图片,最多可以上传5张</li></ul>
  </div>
</div>
</template>

<script>
export default {
  name: 'uploadimg',
  props: ['index'],
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
    // 限制上传数量
    numLimit () {
      if (this.fileList.length <= 5) {
        return true
      }
      window.mui.toast('图片不能超过5张')
      return false
    },
    // 上传成功
    success (response, file, fList) {
      this.fileList = fList
      this.emitPicUrlList()
    },
    // 移除图片
    remove (file, fList) {
      this.fileList = fList
      this.emitPicUrlList()
    },
    // 实时反馈图片url数组
    emitPicUrlList () {
      let picUrlList = []
      for (let file of this.fileList) {
        picUrlList.push(file.response.assetUrl)
      }
      this.$emit('updatePicUrl', picUrlList, this.index)
    }
  },
  created () {
  }
}

</script>

<style scoped>
</style>
