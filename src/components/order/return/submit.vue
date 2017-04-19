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
                        <li :class="{selected: form.applyTypeCd == 1}" @click="form.applyTypeCd = 1">退款</li>
                        <li v-if="isDelivery" :class="{selected: form.applyTypeCd == 2}" @click="form.applyTypeCd = 2">退货</li>
                        <li v-else class="disabled">退款退货</li>
                    </ul>
                </div>
            </div>

            <div class="borderbox">
                <div class="return">
                    <h3>是否收到货</h3>
                    <div class="whether">
                        <p><label><input type="radio" name="rdo_addr" v-model="form.isReceiveGood" value="0" checked="checked">否</label></p>
                        <p><label><input type="radio" name="rdo_addr" v-model="form.isReceiveGood" value="1" :disabled="!isDelivery">是</label></p>
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
                                      <input v-model="form.returnAmt" v-if="isDelivery" type="number" placeholder="">
                                      <template v-if="!isDelivery">{{maxReturnAmt}}</template>
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
                        <textarea v-model="form.reasonDetailDesc" placeholder="请写下您的退款原因，以便我们更好的为您处理退款。"></textarea>
                    </div>
                    <!-- 上传图片组件 -->
                    <uploadImg @updatePicUrl="updatePicUrl"/>
                </div>
            </div>
        </div>

        <div class="mui-content-padded mt30 align-center">
            <button type="button" class="mui-btn mui-btn-primary mui-btn-block mb20" @click="submit">确定</button>
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
      // 退款提交表单
      form: {
        orderId: parseInt(this.$route.params.orderId),
        applyTypeCd: 1, // 退换类型 1：退款 2：退款退货
        isReceiveGood: 0, // 是否收到货 0：未收到 1：已收到
        returnAmt: '',
        reasonDetailDesc: '',  // 退款描述
        orderItemId: parseInt(this.$route.params.orderItemId),  // 退款商品的itemId
        picUrlList: []  // 图片url
      },
      maxReturnAmt: 0
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
    }
  },
  methods: {
    // 更新图片url列表
    updatePicUrl (picUrlList) {
      this.form.picUrlList = picUrlList
    },
    // 提交退款信息
    submit () {
      if (!this.form.returnAmt) {
        window.mui.toast('请输入退款金额')
        return false
      }
      console.log(this.form)
      console.log(JSON.stringify(this.form))
      this.$http.post('/orderHeader/returnOrderHeader', JSON.stringify(this.form), {
        emulateJSON: true
      }).then(
        res => {
          console.log(res)
        }
      )
    }
  },
  created () {
    // 获取订单详情
    this.$http.get('/orderHeader/orderHeaderDetail', {
      params: {
        orderId: this.form.orderId
      },
      emulateJSON: true
    }).then(
      res => {
        this.orderHeaderDTO = res.body.orderHeaderDTO
        // 计算退款金额
        if (this.orderHeaderDTO.orderItemList) {
          for (let orderItem of this.orderHeaderDTO.orderItemList) {
            if (orderItem.orderItemId === this.form.orderItemId) {
              this.maxReturnAmt = (orderItem.productTotal / this.orderHeaderDTO.orderProductAmt *
                (this.orderHeaderDTO.orderPayAmt + this.orderHeaderDTO.payBalance))
            }
          }
        }
        if (this.orderHeaderDTO.type === 2) {
          this.form.returnAmt = parseFloat(this.maxReturnAmt)
        }
      }
    )
  }
}
</script>                     

<style scoped>
</style>
