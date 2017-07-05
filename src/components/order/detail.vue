<template>
<div id="page">
  <header class="mui-bar mui-bar-nav">
      <router-link :to="{name: 'mOrderList', params: {orderTypeCd:orderHeaderDTO.orderTypeCd, listType: 0}}" class="mui-icon mui-icon-left-nav"></router-link>
      <h1 class="mui-title">订单详情</h1>
      <a class="mui-icon"></a>
  </header>
  <div class="mui-content">
      <div class="tbviewlist categorylist">
          <ul>
              <li>
                  <a href="javascript:void(0)">
                      <div class="r orange" 
                      v-if="orderHeaderDTO.orderStatusCd == 5 && orderHeaderDTO.reviewStatusCd == 1">待评价
                      </div>
                      <div class="r orange" v-else>{{orderHeaderDTO.orderStatusName}}</div>
                      <div class="c">订单号：{{orderHeaderDTO.orderNumber}}</div>
                  </a>
              </li>
          </ul>
      </div>
      <div class="order-address orderdetail-address" v-if="orderReceiveInfo.orderDistrbuteTypeCd == 1">
          <span class="name">{{orderReceiveInfo.receiveName}}</span>
          <span class="phone">{{orderReceiveInfo.receiveTel}}</span>
          <address>{{orderReceiveInfo.receiveAddrCombo}}</address>
          <address>期望送达时间：{{orderHeaderDTO.expectSendTime}}</address>
      </div>
      <div class="order-address orderdetail-address orderdetail-since" v-else>
          <address>自提时间：{{orderReceiveInfo.requiredStartTime | time}} 至 {{orderReceiveInfo.requiredEndTime | time}}</address>
          <address>自提门店：{{orderHeaderDTO.storeName}}</address>
          <address>自提地址：{{orderHeaderDTO.detailAddress}}</address>
      </div>
      <div class="message"><p>买家留言：</p>
          <span>{{orderHeaderDTO.orderRemark ? orderHeaderDTO.orderRemark : "无"}}</span></div>
      <div class="borderbox mb0">
          <h3 class="title">商品清单</h3>
          <ul class="prd-list b-bottom">
              <li v-for="orderItem in orderHeaderDTO.orderItemList">
                  <div class="pic">
                      <img :src="orderItem.productPicUrl">
                  </div>
                  <div class="r">
                      <p class="name">{{orderItem.productName}}</p>
                      <p class="info">
                          <span class="num"><i class="small">X</i>{{orderItem.quantity}}</span>
                          <!-- <span class="specifications">规格：{{orderItem.skuKeyJsonStr}}</span> -->
                      </p>
                      <div class="price">
                          <div class="price-real">¥{{orderItem.salePrice}}</div>
                      </div>
                  </div>
                  <template v-if="!isUsePromotion && orderHeaderDTO.changePriceCount == 0">
                    <div class="aftersales" v-if="(orderHeaderDTO.type == 2 || orderHeaderDTO.type == 3) && !isAllowReturnAll && !orderItem.applyStatusCd">
                      <router-link :to="{name: 'mOrderReturnSubmit', params: {orderId: orderHeaderDTO.orderId, orderItemId: orderItem.orderItemId}}" class="orderdetailbtn" v-if="!orderItem.applyStatusCd">
                        退款/退货
                      </router-link>
                    </div>
                    <div class="aftersales" v-if="!isAllowReturnAll && orderItem.applyStatusCd == 1">
                      <router-link :to="{name: 'mOrderReturnSubmit', params: {orderId: orderHeaderDTO.orderId, orderItemId: orderItem.orderItemId}}" class="orderdetailbtn">
                        退款/退货状态：{{orderItem.applyStatusName}}
                      </router-link>
                    </div>
                    <div class="aftersales" v-if="!isAllowReturnAll && orderItem.applyStatusCd && orderItem.applyStatusCd != 1">
                      <router-link :to="{name: 'mOrderReturnDetail', params: {orderId: orderHeaderDTO.orderId, orderItemId: orderItem.orderItemId}}" class="orderdetailbtn">
                        退款/退货状态：{{orderItem.applyStatusName}}
                      </router-link>
                    </div>
                  </template>
              </li>
          </ul>
      </div>
      <div class="payment-info">
          <p><span class="fl gray">运费</span><span class="fr">¥{{orderHeaderDTO.orderExpressAmt}}</span></p>
          <p><span class="fl gray">合计</span><span class="fr">¥{{orderHeaderDTO.orderTotalAmt}}</span></p>
          <p><span class="fl gray">优惠金额</span><span class="fr">-¥{{orderHeaderDTO.orderDiscountAmt}}</span></p>
          <p><span class="fl gray">积分</span><span class="fr">-{{orderHeaderDTO.payScore ? orderHeaderDTO.payScore : 0}}</span>
          <p><span class="fl gray" v-if="orderHeaderDTO.orderTypeCd == 3">白鹭卡积分</span><span class="fr">-{{orderHeaderDTO.egretScore ? orderHeaderDTO.egretScore : 0}}</span>
          </p>
          <p><span class="fl gray">实付款</span><span class="fr orange">¥{{actualPayAmt}} {{orderHeaderDTO.changePriceCount > 0 ? '(调价后)' : ''}}</span>
          </p>
          <p><span class="fr orange">(含余额支付¥{{orderHeaderDTO.payBalance ? orderHeaderDTO.payBalance : 0}})</span>
          </p>
      </div>
      <div class="payment-info">
          <p><span class="fl gray">快递公司</span><span class="fr">{{orderHeaderDTO.expressName}}</span></p>
          <p><span class="fl gray">快递单号</span><span class="fr">{{orderHeaderDTO.orderExpressNum}}</span></p>
          <p><span class="fl gray">下单时间</span><span class="fr">{{orderHeaderDTO.createTime | time}}</span></p>
          <p><span class="fl gray">付款时间</span><span class="fr">{{orderHeaderDTO.orderPayTime ? orderHeaderDTO.orderPayTime : '' | time}}</span></p>
      </div>

      <div class="fbbwrap fbbwrap-total">
          <div class="ftbtnbar">
              <div class="content-wrap"></div>
              <div class="button-wrap bkno">
                  <div v-if="orderHeaderDTO.type == 1">
                      <a class="orderdetailbtn view" href="javascript:void(0)" @click="delOrder">删除订单</a>
                      <a class="orderdetailbtn view" href="javascript:void(0)" @click='cancelOrder'>取消订单</a>
                      <a class="orderdetailbtn" href="javascript:void(0)" @click="selectOrderId = orderHeaderDTO.orderId">付款</a>
                  </div>
                  <div v-if="orderHeaderDTO.type == 2 || orderHeaderDTO.type == 3">
                      <a class="orderdetailbtn" href="javascript:void(0)" @click="confirmReceive" v-if="orderHeaderDTO.type == 3">确认收货</a>
                      <router-link :to="{name: 'mOrderReturnSubmit', params: {orderId: orderHeaderDTO.orderId, orderItemId: 0}}" class="orderdetailbtn view" v-if="isAllowReturnAll">全单退款/退货</router-link>
                  </div>
                  <router-link :to="{name: 'mOrderReturnSubmit', params: {orderId: orderHeaderDTO.orderId, orderItemId: 0}}" class="orderdetailbtn view" v-if="returnAllStatus == 1">退款/退货状态：待审核</router-link>
                  <router-link :to="{name: 'mOrderReturnDetail', params: {orderId: orderHeaderDTO.orderId, orderItemId: 0}}" class="orderdetailbtn view" v-if="returnAllStatus == 2">退款/退货状态：审核通过</router-link>
                  <router-link :to="{name: 'mOrderReturnDetail', params: {orderId: orderHeaderDTO.orderId, orderItemId: 0}}" class="orderdetailbtn view" v-if="returnAllStatus == 3">退款/退货状态：审核失败</router-link>
                  <div v-if="orderHeaderDTO.type == 4">
                    <router-link :to="{name: 'mOrderReview', params: {orderId: orderHeaderDTO.orderId}}" class='orderdetailbtn'>
                      评价
                    </router-link>
                  </div>
                  <div v-if="orderHeaderDTO.type == 5 || orderHeaderDTO.type == 6">
                      <a class="orderdetailbtn view" href="javascript:void(0)" @click="delOrder">删除订单</a>
                  </div>
              </div>
          </div>
      </div>
  </div>
<!--支付弹窗-->
    <payDialog :order-id="selectOrderId" @hidedialog="selectOrderId = 0"/>
</div>
</template>

<script>
import payDialog from './components/payDialog'
import router from '@/router'
import mui from 'mui'

export default {
  name: 'mOrderDetail',
  data () {
    return {
      orderId: this.$route.params.orderId,
      orderHeaderDTO: {}, // 订单信息
      orderReturnInfoList: [], // 退款信息
      orderReceiveInfo: {}, // 收货人信息
      selectOrderId: 0,
      btnArray: ['否', '是'] // 确认框按钮组
    }
  },
  components: {
    payDialog
  },
  computed: {
    // 实付金额
    actualPayAmt () {
      return (this.orderHeaderDTO.orderPayAmt + this.orderHeaderDTO.payBalance).toFixed(2)
    },
    // 是否使用了优惠券
    isUsePromotion () {
      if (this.orderHeaderDTO.promotionDiscount !== null || this.orderHeaderDTO.redPacketDiscount !== null ||
        this.orderHeaderDTO.offDiscount !== null || this.orderHeaderDTO.cutDiscount !== null ||
        this.orderHeaderDTO.postDiscount !== null || this.orderHeaderDTO.packageDiscount !== null) {
        return true
      }
      return false
    },
    // 是否可以进行全单退款操作
    isAllowReturnAll () {
      if (this.isUsePromotion && this.orderHeaderDTO.changePriceCount === 0 && this.orderReturnInfoList.length === 0) {
        return true
      }
      return false
    },
    // 全单退款后 订单的退款状态
    returnAllStatus () {
      if (this.orderReturnInfoList.length === 1 && this.orderReturnInfoList[0].orderItemId == null) {
        return this.orderReturnInfoList[0].applyStatusCd
      }
    }
  },
  methods: {
    // 取消订单
    cancelOrder () {
      let obj = this
      mui.confirm('', '确认取消该订单？', this.btnArray, e => {
        if (e.index === 1) {
          obj.$http.post('/orderHeader/cancelOrderHeader', {
            orderId: obj.$route.params.orderId
          }, {emulateJSON: true}).then(
            res => {
              if (res && res.body.result === 'success') {
                mui.toast('取消成功！')
                obj.loadData()
              } else {
                mui.toast('取消失败，请稍后重试！')
              }
            }
          )
        }
      })
    },
    // 删除订单
    delOrder () {
      let obj = this
      mui.confirm('', '确认删除该订单？', this.btnArray, e => {
        if (e.index === 1) {
          obj.$http.post('/orderHeader/delOrderHeader', {
            orderId: obj.$route.params.orderId
          }, {emulateJSON: true}).then(
              res => {
                if (res && res.body.result === 'success') {
                  mui.toast('删除成功！')
                  router.replace({name: 'mOrderList', params: {orderTypeCd: obj.orderHeaderDTO.orderTypeCd, listType: obj.orderHeaderDTO.type}})
                } else {
                  mui.toast('删除失败，请稍后重试！')
                }
              }
            )
        }
      })
    },
    // 确认收货
    confirmReceive () {
      let obj = this
      mui.confirm('', '确认收货？', this.btnArray, e => {
        if (e.index === 1) {
          obj.$http.post('/orderHeader/confirmReceive', {
            orderId: obj.$route.params.orderId
          }, {emulateJSON: true}).then(
              res => {
                if (res && res.body.result === 'success') {
                  mui.toast('已确认收货！')
                  obj.loadData()
                } else {
                  mui.toast('操作失败，请稍后重试！')
                }
              }
            )
        }
      })
    },
    loadData () {
      // 加载订单数据
      this.$http.get('/orderHeader/orderHeaderDetail', {
        params: {
          orderId: this.orderId
        },
        emulateJSON: true
      }).then(
        res => {
          this.orderHeaderDTO = res.body.orderHeaderDTO
          this.orderReceiveInfo = res.body.orderReceiveInfo
          this.orderReturnInfoList = res.body.orderReturnInfoList
        }
      )
    }
  },
  created () {
    this.loadData()
  }
}
</script>

<style scoped>
</style>
