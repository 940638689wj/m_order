<template>
<div id="page">
    <header class="mui-bar mui-bar-nav">
        <a class="mui-icon mui-icon-left-nav" href="javaScript:history.back(-1)"></a>
        <h1 class="mui-title">评论</h1>
        <a class="mui-icon"></a>
    </header>
    <div class="mui-content">
        <div v-for="(orderItem,index) in orderHeaderDTO.orderItemList">
            <div class="borderbox">
                <ul class="prd-list">
                    <li>
                        <div class="pic">
                            <img class="lazyload" :src="orderItem.productPicUrl"
                                 :data-src="orderItem.productPicUrl" alt=""/>
                        </div>
                        <h3>{{orderItem.productName}}</h3>
                        <p class="price mt18"><span
                                class="price-real">￥<em>{{orderItem.salePrice}}</em></span></p>
                    </li>
                </ul>
            </div>
            <div class="borderbox">
                <div class="return">
                    <h3 class="border">评分
                        <p class="mui-inline">
                            <span class="rateitScore"></span>
                        </p>
                    </h3>
                    <div class="instructions">
                        <textarea placeholder="请写下您的评价" v-model="reviewInfoList[index].reviewContent"></textarea>
                    </div>
                    <!-- 上传图片组件 -->
                    <uploadImg :index="index" @updatePicUrl="updatePicUrl"/>
                </div>
            </div>

            <div class="fbbwrap-total">
                <div class="ftbtnbar">
                    <div class="content-wrap">
                        <div class="content-wrap-in">
                        </div>
                    </div>
                    <div class="button-wrap">
                        <a class="button" @click="submitReview">发表</a>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>
</template>
<script>
import $ from 'n-zepto'
import '../../../static/mobile/js/rateit.js'
import router from '@/router'
import uploadImg from './components/uploadImg'
import mui from 'mui'

export default {
  name: 'mOrderReview',
  data () {
    return {
      orderHeaderDTO: {}, // 订单信息
      reviewInfoList: [] // 评价信息
    }
  },
  components: {
    uploadImg
  },
  methods: {
    // 保存图片url
    updatePicUrl (picUrlList, index) {
      this.reviewInfoList[index].productReviewPicInfos = []
      for (let picUrl of picUrlList) {
        this.reviewInfoList[index].productReviewPicInfos.push({
          picUrl
        })
      }
    },
    // 渲染render
    rateitRender () {
      let obj = this
      $('.rateitScore').rateit({max: 5, starwidth: 25, starheight: 20, readonly: false, step: 1})
      $('.rateitScore').bind('rated', (event, value) => {
        $.each($('.rateit-range'), (index, item) => (obj.reviewInfoList[index].productMatchScore = $(item).attr('aria-valuenow')))
      })
    },
    // 提交评论
    submitReview () {
      // 非空验证
      let flag = true
      for (let reviewInfo of this.reviewInfoList) {
        if (reviewInfo.productMatchScore === '0') {
          mui.toast('评分不能为空!')
          flag = false
          return false
        }
      }
      if (flag) {
        // 构造参数
        let params = {
          orderId: this.$route.params.orderId,
          productReviewList: this.reviewInfoList
        }
        // 保存评论
        this.$http.post('/orderHeader/saveReview', JSON.stringify(params), {
          emulateJSON: true
        }).then(
          res => {
            if (res.body.result === 'success') {
              let str = '评价成功'
              if (res.body.couponStr) {
                str += '，您已获得优惠券，请到我的优惠券查看'
              }
              mui.toast(str)
              if (!this.$route.query.successUrl) {
                router.replace({name: 'mOrderDetail', params: {orderId: this.$route.params.orderId}})
              } else {
                window.location.href = this.$route.query.successUrl
              }
            } else {
              mui.toast('不可重复评价')
            }
          })
      }
    }
  },
  created () {
    // 加载订单商品数据
    this.$http.get('/orderHeader/orderHeaderDetail', {
      params: {
        orderId: this.$route.params.orderId
      },
      emulateJSON: true
    }).then(
      res => {
        this.orderHeaderDTO = res.body.orderHeaderDTO
        // 生成对应长度的评论信息数组
        for (let orderItem of res.body.orderHeaderDTO.orderItemList) {
          this.reviewInfoList.push({productId: orderItem.productId,
            productMatchScore: '0',
            reviewContent: '',
            productReviewPicInfos: []
          })
        }
        window.setTimeout(this.rateitRender, 300)
      }
    )
  }
}
</script>

<style scoped>
</style>
