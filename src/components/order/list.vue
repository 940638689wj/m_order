<template>
<div id="page">
    <header class="mui-bar mui-bar-nav">
        <a class="mui-icon mui-icon-left-nav" :href="backUrl"></a>
        <h1 class="mui-title">我的订单</h1>
        <a class="mui-icon"></a>
    </header>
    <div class="mui-content">
        <div class="skutabbar skutabbar-order">
            <ul>
                <li v-for="(typeName,index) in typeNameList" :class="{selected: type == index}">
                  <a href="javascript:void(0)" @click="changeType(index)">{{typeName}}</a>
                </li>
            </ul>
        </div>

        <div class="financiallistWrap">
            <div class="order_list">
                <ul v-for="orderHeader in orderHeaderDTOList">
                    <li>
                        <div class="hd">
                            <span class="r"
                                  v-if="orderHeader.orderStatusCd == 5 && orderHeader.orderReviewStatusCd == 1">待评价</span>
                            <span class="r" v-else>{{orderHeader.orderStatusName}}</span>
                            <span class="l">{{orderHeader.orderNumber}}</span>
                        </div>
                        <router-link :to="{name: 'mOrderDetail', params: { orderId: orderHeader.orderId }}">
                            <div class="items" v-for="orderItem in orderHeader.orderItemList">
                                <div class="pic"><img :src="orderItem.productPicUrl"></div>
                                <h3>{{orderItem.productName}}</h3>
                                <p class="price">￥<em>{{orderItem.salePrice}}</em></p>
                                <p class="spec">数量：{{orderItem.quantity}}</p>
                            </div>
                        </router-link>
                        <div class="ft">
                            共{{orderHeader.productNum}}件商品，合计：
                            <span>￥{{(orderHeader.orderPayAmt + orderHeader.payBalance).toFixed(2)}}</span>
                        </div>
                    <!--待付款-->
                        <div class="cz" v-if="orderHeader.type == 1">
                            <a class="mui-btn mui-btn-outlined" @click="delOrder(orderHeader.orderId)">删除订单</a>
                            <a class="mui-btn mui-btn-outlined" @click="cancelOrder(orderHeader.orderId)">取消订单</a>
                            <a class="mui-btn mui-btn-danger mui-btn-outlined"
                               @click="selectOrderId = orderHeader.orderId">付款</a>
                        </div>
                    <!--待收货-->
                        <div class="cz" v-if="orderHeader.type == 3">
                            <a class="mui-btn mui-btn-danger mui-btn-outlined" @click="confirmReceive(orderHeader.orderId)" v-if="orderHeader.orderDistrbuteTypeCd == 1">确认收货</a>
                        </div>
                    <!--待评价-->
                        <div class="cz" v-if="orderHeader.type == 4">
                        <router-link :to="{name: 'mOrderReview', params: {orderId: orderHeader.orderId}}" class="mui-btn mui-btn-danger mui-btn-outlined">
                            评价
                        </router-link>
                        </div>
                    <!--已完成-->
                        <div class="cz" v-if="orderHeader.type == 5 || orderHeader.type == 6">
                            <a class="mui-btn mui-btn-outlined" @click="delOrder(orderHeader.orderId)">删除订单</a>
                        </div>
                    </li>
                </ul>
            </div>
        </div>
    </div>
    <!--支付弹窗-->
    <payDialog :order-id="selectOrderId" @hidedialog="selectOrderId = 0"/>
</div>
</template>

<script>
import $ from 'n-zepto'
import '../../../static/mobile/js/dropload.js'
import mui from 'mui'

import payDialog from './components/payDialog'

export default {
  name: 'mOrderList',
  data () {
    return {
      typeNameList: ['全部', '待付款', '待发货', '待收货', '待评价', '已完成', '已取消'],
      orderHeaderDTOList: [], // 订单列表
      pageNo: 0,
      pageSize: 5,
      backUrl: '/m/account', // 回退按钮url前缀
      detailUrl: '/detail/', // 订单详情url前缀
      orderTypeCd: this.$route.params.orderTypeCd, // 订单类型
      type: this.$route.params.listType, // 列表类型
      btnArray: ['否', '是'], // 确认框按钮组
      selectOrderId: 0 // 选中的订单id
    }
  },
  components: {
    payDialog
  },
  methods: {
    // 修改标签
    changeType (val) {
      if (this.type !== val) {
        this.type = val
        this.pageNo = 0
        this.orderHeaderDTOList = []
        this.droploadList()
      }
    },
    // 取消订单
    cancelOrder (orderId) {
      let obj = this
      mui.confirm('', '确认取消该订单？', this.btnArray, e => {
        if (e.index === 1) {
          obj.$http.post('/orderHeader/cancelOrderHeader', {orderId: orderId}, {emulateJSON: true}).then(
            res => {
              if (res.body.result === 'success') {
                obj.pageNo = 0
                obj.orderHeaderDTOList = []
                mui.toast('取消成功！')
                obj.droploadList()
              } else {
                mui.toast('取消失败，请稍后重试！')
              }
            }
          )
        }
      })
    },
    // 删除订单
    delOrder (orderId) {
      let obj = this
      mui.confirm('', '确认删除该订单？', this.btnArray, e => {
        if (e.index === 1) {
          obj.$http.post('/orderHeader/delOrderHeader', {orderId: orderId}, {emulateJSON: true}).then(
              res => {
                if (res.body.result === 'success') {
                  obj.pageNo = 0
                  obj.orderHeaderDTOList = []
                  mui.toast('删除成功！')
                  obj.droploadList()
                } else {
                  mui.toast('删除失败，请稍后重试！')
                }
              }
            )
        }
      })
    },
    // 确认收货
    confirmReceive (orderId) {
      let obj = this
      mui.confirm('', '确认收货？', this.btnArray, e => {
        if (e.index === 1) {
          obj.$http.post('/orderHeader/confirmReceive', {orderId: orderId}, {emulateJSON: true}).then(
              res => {
                if (res.body.result === 'success') {
                  obj.pageNo = 0
                  obj.orderHeaderDTOList = []
                  mui.toast('已确认收货！')
                  obj.droploadList()
                } else {
                  mui.toast(res.body.message)
                }
              }
            )
        }
      })
    },
    // 创建上拉刷新控件
    droploadList () {
      let obj = this
      $('.dropload-down').remove()
      this.$nextTick(() => {
        $('.financiallistWrap').dropload({
          scrollArea: window,
          domDown: {
            domClass: 'dropload-down',
            domRefresh: '<div class="dropload-refresh">↑上拉加载更多</div>',
            domLoad: '<div class="dropload-load"><span class="loading"></span>加载中...</div>',
            domNoData: '<div class="dropload-noData">暂无数据</div>'
          },
          loadDownFn (me) {
            obj.pageNo++
            // 拼接HTML
            obj.$http.get('/orderHeader/findListByLimit', {
              params: {
                pageNo: obj.pageNo,
                pageSize: obj.pageSize,
                orderTypeCd: obj.orderTypeCd,
                type: obj.type
              },
              emulateJSON: true
            }).then(
                res => {
                  if (res.body.result === 'true') {
                    obj.orderHeaderDTOList = obj.orderHeaderDTOList.concat(res.body.orderHeaderDTOList)
                  } else {
                    me.lock()
                    me.noData()
                  }
                  me.resetload()
                }
              )
          }
        })
      })
    }
  },
  created () {
    setTimeout(this.droploadList, 200)
  }
}
</script>
