<template>
	<div id="page">
        <header class="mui-bar mui-bar-nav">
            <a class="mui-icon mui-icon-left-nav" href="javaScript:history.back(-1)"></a>
            <h1 class="mui-title">填写退货物流信息</h1>
            <a class="mui-icon"></a>
        </header>

        <div class="mui-content">
            <div class="borderbox">
                <div class="loginform mt0">
                    <ul>
                        <li>
                            <div class="hd">退货地址</div>
                            <div class="bd">
                                <div class="returnadd">{{logistics.orderReturnAddress}}</div>
                            </div>
                        </li>
                        <li>
                            <div class="hd">邮编</div>
                            <div class="bd">
                                <div class="returnadd">{{logistics.orderReturnPostcode}}</div>
                            </div>
                        </li>
                        <li>
                            <div class="hd">收件人</div>
                            <div class="bd">
                                <div class="returnadd">{{logistics.orderReturnName}}</div>
                            </div>
                        </li>
                        <li>
                            <div class="hd">联系电话</div>
                            <div class="bd">
                                <div class="returnadd">{{logistics.orderReturnPhone}}</div>
                            </div>
                        </li>
                        <li>
                            <div class="hd">物流公司<i>*</i></div>
                            <div class="bd">
                                <div class="info">
                                    <div class="input-wrap"><input type="text" v-model="form.returnExpressName"></div>
                                </div>
                            </div>
                        </li>
                        <li>
                            <div class="hd">快递单号<i>*</i></div>
                            <div class="bd">
                                <div class="info">
                                    <div class="input-wrap"><input type="text" v-model="form.returnExpressNum"></div>
                                </div>
                            </div>
                        </li>
                    </ul>
                </div>
            </div>
            <div class="borderbox">
                <div class="return">
                    <h3 class="border">备注</h3>
                    <div class="instructions">
                        <textarea placeholder="请写下您的备注" v-model="form.returnExpressRemark"></textarea>
                    </div>
                </div>
            </div>
        </div>
        <div class="mui-content-padded mt30 align-center">
            <button type="button" class="mui-btn mui-btn-primary mui-btn-block mb20" @click="submit">提交退货信息</button>
        </div>
    </div>
</template>

<script>
import mui from 'mui'
import router from '@/router'

export default {
  name: 'logistics',
  data () {
    return {
      orderId: this.$route.params.orderId,
      logistics: {},
      form: {
        orderItemId: this.$route.params.orderItemId,
        returnExpressName: '',
        returnExpressNum: '',
        returnExpressRemark: ''
      }
    }
  },
  methods: {
    // 提交退货物流
    submit () {
      if (!this.form.returnExpressName) {
        mui.toast('物流公司不能为空')
        return false
      }
      if (!this.form.returnExpressNum) {
        mui.toast('快递单号不能为空')
        return false
      }
      this.$http.post('/orderHeader/submitLogistics', this.form, {emulateJSON: true}).then(
        res => {
          if (res.body) {
            mui.toast('提交成功！')
            router.push({name: 'mOrderDetail', params: {orderId: this.orderId}})
          } else {
            mui.toast('提交失败，请稍后重试！')
          }
        }
      )
    }
  },
  created () {
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
