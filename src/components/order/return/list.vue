<template>
<div id="page">
    <header class="mui-bar mui-bar-nav">
        <a class="mui-icon mui-icon-left-nav" :href="backUrl"></a>
        <h1 class="mui-title">退换货订单</h1>
        <a class="mui-icon"></a>
    </header>
    <div class="mui-content">

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
                            <span>￥{{(orderHeader.orderTotalAmt - orderHeader.orderDiscountAmt).toFixed(2)}}</span>
                        </div>
                    </li>
                </ul>
            </div>
        </div>
        
    </div>
</div>
</template>

<script>
import Vue from 'vue'
import $ from 'n-zepto'
import '../../../../static/mobile/js/dropload.js'

import payDialog from '../components/payDialog'

export default {
  name: 'mOrderList',
  data () {
    return {
      orderHeaderDTOList: [], // 订单列表
      pageNo: 0,
      pageSize: 5,
      backUrl: '/m/account', // 回退按钮url前缀
      detailUrl: '/detail/' // 订单详情url前缀
    }
  },
  components: {
    payDialog
  },
  methods: {
    // 创建上拉刷新控件
    droploadList () {
      let obj = this
      $('.dropload-down').remove()
      Vue.nextTick(() => {
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
                orderTypeCd: 1,
                orderPropertyCd: 1
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
    setTimeout(this.droploadList, 100)
  }
}
</script>
