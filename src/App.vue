<template>
  <div id="app" v-cloak>
    <router-view></router-view>
  </div>
</template>

<script>
import 'n-zepto'
import '../static/mobile/js/mobile.js'

export default {
  name: 'app'
}
</script>

<style>
#app{
	height: 100%;
}
[v-cloak]{
  display: none;
}
/*微信端*/
@import '/static/mobile/css/mui.css';
@import '/static/mobile/css/global.css';
@import '/static/mobile/css/mobile.css';
</style>
