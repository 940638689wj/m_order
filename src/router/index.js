import Vue from 'vue'
import Router from 'vue-router'
Vue.use(Router)

import mOrderIndex from '@/components/order/index'
import mOrderList from '@/components/order/list'
import mOrderDetail from '@/components/order/detail'
import mOrderReview from '@/components/order/review'
import mOrderReturnIndex from '@/components/order/return/index'
import mOrderReturnSubmit from '@/components/order/return/submit'
import mOrderReturnList from '@/components/order/return/list'
import mOrderReturnDetail from '@/components/order/return/detail'
import mOrderReturnLogistics from '@/components/order/return/logistics'

export default new Router({routes: [
  {
    // 微信端-个人中心-我的订单
    path: '/m/account/order',
    // component: resolve => require(['@/components/order/index'], resolve),
    component: mOrderIndex,
    children: [
      {
        // 订单列表
        path: 'list/:orderTypeCd/:listType',
        name: 'mOrderList',
        // component: resolve => require(['@/components/order/list'], resolve)
        component: mOrderList
      },
      {
        // 订单详情
        path: 'detail/:orderId',
        name: 'mOrderDetail',
        // component: resolve => require(['@/components/order/detail'], resolve)
        component: mOrderDetail
      },
      {
        // 评论
        path: 'review/:orderId',
        name: 'mOrderReview',
        // component: resolve => require(['@/components/order/review'], resolve)
        component: mOrderReview
      },
      {
        // 退款
        path: 'return',
        name: 'mOrderReturnIndex',
        // component: resolve => require(['@/components/order/return/index'], resolve),
        component: mOrderReturnIndex,
        children: [
          {
            // 退款订单列表
            path: 'list',
            name: 'mOrderReturnList',
            // component: resolve => require(['@/components/order/return/list'], resolve)
            component: mOrderReturnList
          },
          {
            // 退款表单
            path: 'submit/:orderId/:orderItemId',
            name: 'mOrderReturnSubmit',
            // component: resolve => require(['@/components/order/return/submit'], resolve)
            component: mOrderReturnSubmit
          },
          {
            // 退款流程状态的详情（非订单详情）
            path: 'detail/:orderId/:orderItemId',
            name: 'mOrderReturnDetail',
            // component: resolve => require(['@/components/order/return/detail'], resolve)
            component: mOrderReturnDetail
          },
          {
            // 退货填写物流信息
            path: 'logistics/:orderId/:orderItemId',
            name: 'mOrderReturnLogistics',
            // component: resolve => require(['@/components/order/return/logistics'], resolve)
            component: mOrderReturnLogistics
          }
        ]
      }
    ]
  }
]
})
