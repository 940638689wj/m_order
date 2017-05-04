<template>
  <div id="page">
        <header class="mui-bar mui-bar-nav">
            <router-link :to="{name: 'mOrderDetail', params: {orderId: orderItem.orderId}}" class="mui-icon mui-icon-left-nav"></router-link>
            <h1 class="mui-title">申请退换货详情</h1>
            <a class="mui-icon"></a>
        </header>

        <div class="mui-content">
            <div class="borderbox">
                <h3 class="title">退款商品</h3>
                <ul class="prd-list b-bottom">
                    <li>
                        <div class="pic">
                            <img :src="orderItem.productPicUrl">
                        </div>
                        <div class="r">
                            <p class="name">{{orderItem.productName}}</p>
                            <div class="price">
                                <div class="price-real">¥<em>{{orderItem.salePrice}}</em></div>
                                <!-- <span class="price-origin">¥6.90</span> -->
                            </div>
                            <p class="info"><span class="num"><i class="small">X</i>{{orderItem.quantity}}</span><span class="specifications">{{orderItem.skuKeyJsonStr}}</span></p>
                        </div>
                    </li>
                </ul>
            </div>
            <div class="borderbox">
                <ul class="tbviewlist">
                    <li>
                        <div class="hd">退款类型：</div>
                        <div class="bd">{{orderReturnInfo.applyTypeName}}</div>
                    </li>
                    <li>
                        <div class="hd">退款金额：</div>
                        <div class="bd">{{orderReturnInfo.returnAmt}}</div>
                    </li>
                    <li>
                        <div class="hd">原因：</div>
                        <div class="bd">{{orderReturnInfo.applyReasonName}}</div>
                    </li>
                    <li>
                        <div class="hd">备注：</div>
                        <div class="bd">{{orderReturnInfo.reasonDetailDesc}}</div>
                    </li>
                    <li>
                        <div class="hd">当前状态：</div>
                        <div class="bd">{{orderReturnInfo.applyStatusName}}</div>
                    </li>
                </ul>
            </div>
        </div>
        <!-- <div class="mui-content-padded mt30 align-center">
            <button type="button" class="mui-btn mui-btn-primary mui-btn-block mb20" @click="cancelReturn">取消退款申请</button>
        </div> -->
    </div>
</template>

<script>
import mui from 'mui'
// import router from '@/router'

export default {
  name: '',
  data () {
    return {
      orderItemId: this.$route.params.orderItemId,
      orderItem: {},
      orderReturnInfo: {}
    }
  },
  methods: {
    // 取消退款申请
    cancelReturn () {
      mui.confirm('', '确认取消退款申请？', ['否', '是'], e => {
        console.log(e)
      })
    }
  },
  created () {
    this.$http.get('/orderHeader/getOrderReturnDetail', {
      params: {
        orderItemId: this.orderItemId
      }
    }).then(
    res => {
      this.orderItem = res.body.orderItem
      this.orderReturnInfo = res.body.orderReturnInfo
    }
    )
  }
}
</script>

<style scoped>
</style>
