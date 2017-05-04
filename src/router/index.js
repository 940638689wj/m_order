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

export default new Router({routes: [
  {
    // 微信端-个人中心-我的订单
    path: '/m/account/order',
    component: mOrderIndex,
    children: [
      {
        // 订单列表
        path: 'list/:listType',
        name: 'mOrderList',
        component: mOrderList
      },
      {
        // 订单详情
        path: 'detail/:orderId',
        name: 'mOrderDetail',
        component: mOrderDetail
      },
      {
        // 评论
        path: 'review/:orderId',
        name: 'mOrderReview',
        component: mOrderReview
      },
      {
        // 退款
        path: 'return',
        name: 'mOrderReturnIndex',
        component: mOrderReturnIndex,
        children: [
          {
            // 退款订单列表
            path: 'list',
            name: 'mOrderReturnList',
            component: mOrderReturnList
          },
          {
            // 退款表单
            path: 'submit/:orderId/:orderItemId',
            name: 'mOrderReturnSubmit',
            component: mOrderReturnSubmit
          },
          {
            // 退款流程状态的详情（非订单详情）
            path: 'detail/:orderItemId',
            name: 'mOrderReturnDetail',
            component: mOrderReturnDetail
          }
        ]
      }
    ]
  }
]
})
