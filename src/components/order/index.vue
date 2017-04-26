<template>
  <router-view></router-view>
</template>

<script>
export default {
  name: 'mindex',
  created () {
    this.$http.get('/isLogin').then(
      res => {
        if (!res.body) {
          this.$http.get('/orderHeader/urlEncode', {
            params: {
              url: 'spa/#/m/account/order/list/0'
            }
          }).then(
            res => {
              window.location.href = '/m/login?successUrl=' + res.body
            }
            )
        }
      }
      )
  }
}
</script>
