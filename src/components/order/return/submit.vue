<template>
	<div id="page">
        <header class="mui-bar mui-bar-nav">
            <a class="mui-icon mui-icon-left-nav"></a>
            <h1 class="mui-title">申请退换货</h1>
            <a class="mui-icon"></a>
        </header>

        <div class="mui-content">

            <div class="borderbox">
                <div class="return">
                    <h3>申请类型</h3>
                    <ul class="return-type">
                        <li :class="{selected: returnType == 1}" @click="returnType = 1">退款</li>
                        <li v-if="isDelivery" :class="{selected: returnType == 2}" @click="returnType = 2">退货</li>
                        <li v-else class="disabled">退款退货</li>
                    </ul>
                </div>
            </div>

            <div class="borderbox">
                <div class="return">
                    <h3>是否收到货</h3>
                    <div class="whether">
                        <p><label><input type="radio" name="rdo_addr" v-model="isReceiveGood" value="0" checked="checked">否</label></p>
                        <p><label><input type="radio" name="rdo_addr" v-model="isReceiveGood" value="1" :disabled="!isDelivery">是</label></p>
                    </div>
                </div>
            </div>

            <div class="borderbox">
                <div class="loginform">
                    <ul>
                        <li>
                            <div class="hd">退款金额：</div>
                            <div class="bd">
                                <div class="info">
                                    <div class="input-wrap">
                                      <input v-if="isDelivery" type="number" placeholder="">
                                      <template v-if="!isDelivery">{{itemReturnAmt}}</template>
                                      元
                                    </div>
                                    <a class="orange" v-if="isDelivery">最多￥{{maxReturnAmt}}</a>
                                </div>
                            </div>
                        </li>
                    </ul>
                </div>
            </div>

            <div class="borderbox">
                <div class="return">
                    <h3 class="border">退款说明</h3>
                    <div class="instructions">
                        <textarea v-model="reasonDetailDesc" placeholder="请写下您的退款原因，以便我们更好的为您处理退款。"></textarea>
                    </div>
                    <!-- 上传图片组件 -->
                    <uploadImg @updatePicUrl="updatePicUrl"/>
                </div>
            </div>
        </div>

        <div class="mui-content-padded mt30 align-center">
            <button type="button" class="mui-btn mui-btn-primary mui-btn-block mb20">确定</button>
        </div>
    </div>
</template>

<script>
import uploadImg from '../components/uploadImg'

export default {
  name: 'submit',
  data () {
    return {
      orderHeaderDTO: {}, // 订单信息
      returnType: 1, // 退换类型 1：退款 2：退款退货
      isReceiveGood: 0, // 是否收到货 0：未收到 1：已收到
      reasonDetailDesc: '',  // 退款描述
      picUrlList: []  // 图片url
    }
  },
  components: {
    uploadImg
  },
  computed: {
    // 是否发货
    isDelivery () {
      if (this.orderHeaderDTO.type === 2) {
        return false
      }
      return true
    },
    // 需要退款金额
    itemReturnAmt () {
      let itemReturnAmt = 0
      let orderItemId = parseInt(this.$route.query.orderItemId)
      // 商品id存在则退换单个商品
      if (orderItemId) {
        for (let orderItem of this.orderHeaderDTO.orderItemList) {
          if (orderItem.orderItemId === orderItemId) {
            itemReturnAmt = orderItem.productTotal / this.orderHeaderDTO.orderProductAmt *
              (this.orderHeaderDTO.orderPayAmt + this.orderHeaderDTO.payBalance)
            itemReturnAmt = itemReturnAmt.toFixed(2)
          }
        }
      } else {
        // 商品id不存在则退整单
        itemReturnAmt = this.orderHeaderDTO.orderPayAmt + this.orderHeaderDTO.payBalance
      }
      return itemReturnAmt
    },
    // 已发货时 输入的退款金额上限
    maxReturnAmt () {
      return 1
    }
  },
  methods: {
    // 更新图片url列表
    updatePicUrl (pList) {
      this.picUrlList = pList
      // console.log(picUrlList)
    }
  },
  created () {
    this.$http.get('/orderHeader/orderHeaderDetail', {
      params: {
        orderId: this.$route.params.orderId
      },
      emulateJSON: true
    }).then(
      res => {
        this.orderHeaderDTO = res.body.orderHeaderDTO
      }
    )
  }
}
</script>

<style scoped>
</style>
