<template>
	<div id="page">
        <header class="mui-bar mui-bar-nav">
            <router-link :to="{name: 'mOrderDetail', params: {orderId: orderHeaderDTO.orderId}}" class="mui-icon mui-icon-left-nav"></router-link>
            <h1 class="mui-title">申请退换货</h1>
            <a class="mui-icon"></a>
        </header>

        <div class="mui-content">
            <div class="prompt-order">
              *此退款仅针对商品金额，若有疑问请联系客服<br>
              <span v-if="form.applyTypeCd == 2">*物流单号及物流公司填写后若是已申请通过则无法修改</span>
            </div>
            <div class="borderbox">
                <div class="return">
                    <h3>申请类型</h3>
                    <ul class="return-type">
                        <li :class="{selected: form.applyTypeCd == 1}" @click="form.applyTypeCd = (!form.id ? 1 : form.applyTypeCd)">退款</li>
                        <li v-if="isDelivery" :class="{selected: form.applyTypeCd == 2}" @click="form.applyTypeCd = (!form.id ? 2 : form.applyTypeCd)">退货</li>
                        <li v-else class="disabled">退款退货</li>
                    </ul>
                </div>
            </div>

            <div class="borderbox">
                <div class="return">
                    <h3>是否收到货</h3>
                    <div class="whether">
                        <p><label><input type="radio" name="rdo_addr" v-model="form.isReceiveGood" value="0" checked="checked" :disabled="form.id && form.isReceiveGood == 1">否</label></p>
                        <p><label><input type="radio" name="rdo_addr" v-model="form.isReceiveGood" value="1" :disabled="!isDelivery || (form.id && form.isReceiveGood == 0)">是</label></p>
                    </div>
                </div>
            </div>

            <div class="borderbox">
                <div class="return">
                    <h3>退货地址：{{logistics.orderReturnAddress}}</h3>
                </div>
            </div>

            <template v-if="form.applyTypeCd == 2">
            <div class="borderbox">
                <div class="loginform">
                    <ul>
                        <li>
                            <div class="hd">物流公司：</div>
                            <div class="bd">
                                <div class="info">
                                    <div class="input-wrap">
                                      <input v-model="form.returnExpressName" type="text" placeholder="">
                                    </div>
                                </div>
                            </div>
                        </li>
                    </ul>
                </div>
            </div>

            <div class="borderbox">
                <div class="loginform">
                    <ul>
                        <li>
                            <div class="hd">物流单号：</div>
                            <div class="bd">
                                <div class="info">
                                    <div class="input-wrap">
                                      <input v-model="form.returnExpressNum" type="text" placeholder="">
                                    </div>
                                </div>
                            </div>
                        </li>
                    </ul>
                </div>
            </div>
            </template>

            <div class="borderbox">
                <div class="loginform">
                    <ul>
                        <li>
                            <div class="hd">退款金额：</div>
                            <div class="bd">
                                <div class="info">
                                    <div class="input-wrap">
                                      <input v-model="form.returnAmt" v-if="isDelivery" type="number" placeholder="请输入金额" :disabled="form.id">
                                      <template v-if="!isDelivery">{{maxReturnAmt}}</template>
                                      元
                                      <span v-if="orderItem.payScoreAmt">(消耗积分{{orderItem.payScoreAmt}})</span>
                                      <span v-if="orderItem.payXmairCardAmt">(消耗白鹭卡积分{{orderItem.payXmairCardAmt}})</span>
                                    </div>
                                    <a class="orange" v-if="isDelivery">最多￥{{maxReturnAmt}}</a>
                                </div>
                            </div>
                        </li>
                    </ul>
                </div>
            </div>

            <div class="borderbox">
                <div class="loginform mt0">
                    <ul>
                        <li>
                            <div class="hd">退款原因：</div>
                            <div class="bd">
                                <div class="info gender">
                                    <div class="input-wrap">
                                        <select v-model="form.applyReasonCd" :disabled="form.id">
                                            <option v-for="orderReturnReason in orderReturnReasonList" :value="orderReturnReason.codeId">{{orderReturnReason.codeCnName}}</option>
                                        </select>
                                    </div>
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
                        <textarea v-model="form.reasonDetailDesc" placeholder="请写下您的退款原因，以便我们更好的为您处理退款。" :disabled="form.id"></textarea>
                    </div>
                    <!-- 上传图片组件 -->
                    <uploadImg @updatePicUrl="updatePicUrl" v-if="!form.id"/>
                    <!-- {{orderReturnImgUrlList}} -->
                    <div class="uploadimg">
                      <ul>
                        <li v-for="orderReturnImgUrl in orderReturnImgUrlList">
                            <div class="pic"><img :src="orderReturnImgUrl.returnImgUrl"></div>
                        </li>
                        <li></li>
                      </ul>
                    </div>
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
// import router from '@/router'
import mui from 'mui'

export default {
  name: 'submit',
  data () {
    return {
      orderHeaderDTO: {}, // 订单信息
      orderReturnReasonList: [], // 退款原因列表
      orderItem: {},
      logistics: {}, // 退款地址信息
      orderReturnImgUrlList: [],
      // 退款提交表单
      form: {
        id: null,
        orderId: parseInt(this.$route.params.orderId),
        applyTypeCd: 1, // 退换类型 1：退款 2：退款退货
        isReceiveGood: 0, // 是否收到货 0：未收到 1：已收到
        returnExpressName: '',
        returnExpressNum: '',
        returnAmt: '',
        applyReasonCd: -1,
        reasonDetailDesc: '',  // 退款描述
        orderItemId: parseInt(this.$route.params.orderItemId),  // 退款商品的itemId
        picUrlList: []  // 图片url
      },
      maxReturnAmt: 0,
      isSubmit: false // 是否已提交
    }
  },
  components: {
    uploadImg
  },
  watch: {
    // 限制最大输入值
    'form.returnAmt': {
      handler (val) {
        if (parseFloat(val) > parseFloat(this.maxReturnAmt)) {
          this.form.returnAmt = this.maxReturnAmt
        }
      }
    }
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
      if (this.isSubmit) {
        return false
      }
      if (this.form.returnAmt == null || this.form.returnAmt === '') {
        mui.toast('请输入退款金额')
        return false
      }
      this.isSubmit = true
      this.$http.post('/orderHeader/returnOrderHeader', JSON.stringify(this.form), {
        emulateJSON: true
      }).then(
        res => {
          if (res.body.result === 'success') {
            mui.toast('提交成功')
            this.$router.replace({name: 'mOrderDetail', params: {orderId: this.orderHeaderDTO.orderId}})
          } else {
            mui.toast(res.body.message)
          }
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
        // 获取退款原因
        this.orderReturnReasonList = res.body.orderReturnReasonList
        // 默认选中第一个
        this.form.applyReasonCd = res.body.orderReturnReasonList[0].codeId
        // 计算退款金额
        if (this.form.orderItemId) {
          if (this.orderHeaderDTO.orderItemList) {
            for (let orderItem of this.orderHeaderDTO.orderItemList) {
              if (orderItem.orderItemId === this.form.orderItemId) {
                this.orderItem = orderItem
                this.maxReturnAmt = (orderItem.payCashAmt * orderItem.quantity).toFixed(2)
                // 若没有金额 设置金额为0
                if (!this.maxReturnAmt) {
                  this.maxReturnAmt = 0
                }
              }
            }
          }
        } else {
          // 全单退款
          this.maxReturnAmt = this.orderHeaderDTO.orderPayAmt + this.orderHeaderDTO.payBalance - this.orderHeaderDTO.orderExpressAmt
        }
        // 未发货的定死退款金额
        if (this.orderHeaderDTO.type === 2) {
          this.form.returnAmt = parseFloat(this.maxReturnAmt)
        }

        // 如果退款信息已存在，则当前操作为修改
        let orderReturnInfo
        let orderReturnInfoList = res.body.orderReturnInfoList
        if (!this.form.orderItemId && orderReturnInfoList.length === 1) {
          orderReturnInfo = orderReturnInfoList[0]
        }
        if (this.form.orderItemId) {
          for (let i = 0; i < orderReturnInfoList.length; i++) {
            if (this.form.orderItemId === orderReturnInfoList[i].orderItemId) {
              orderReturnInfo = orderReturnInfoList[i]
            }
          }
        }
        if (orderReturnInfo) {
          this.form.id = orderReturnInfo.id
          this.form.applyTypeCd = orderReturnInfo.applyTypeCd
          this.form.isReceiveGood = orderReturnInfo.isReceiveGood
          this.form.returnAmt = orderReturnInfo.returnAmt
          this.form.returnExpressName = orderReturnInfo.returnExpressName
          this.form.returnExpressNum = orderReturnInfo.returnExpressNum
          this.form.reasonDetailDesc = orderReturnInfo.reasonDetailDesc
          this.$http.get('/orderHeader/findReturnImgListByReturnId', {
            params: {
              orderReturnId: this.form.id
            }
          }).then(
          res => {
            this.orderReturnImgUrlList = res.body
          })
        }
      }
    )

    // 获取退货地址
    this.$http.get('/orderHeader/getLogistics').then(
    res => {
      this.logistics = res.body
    }
    )
  }
}
</script>                     

<style scoped>
</style>
