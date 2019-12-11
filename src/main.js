import Vue from 'vue'
import App from '@/App'
import store from '@/store/index'
import router from '@/router/index'

import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import './styles/index.scss'

import axios from './config/httpConfig'
import * as globalFilter from './filters/filters'
import '@/icons'

Vue.prototype.$http = axios

for (var key in globalFilter) {
    Vue.filter(key, globalFilter[key])
}

Vue.use(ElementUI)

Vue.config.productionTip = false

router.beforeEach((to, from, next) => {
    debugger
    // 不存在token时候
    if (!store.state.UserToken) {
        // 如果匹配到的路由需要鉴权鉴权的（通常我们只会设置一级路由是否需要鉴权），则跳转到该页面去，主要to.marched的用法
        if (to.matched.length > 0 && !to.matched.some(record => record.meta.requiresAuth)) {
            next()
        } else {
            // 否则返回登录页
            next({ path: '/login' })
        }
    } else {
        // 存在token时， 如果权限的路由列表为空，这么做主要是考虑每次进行页面跳转的时候都
        // 是最新的权限列表
        if (!store.state.permission.permissionList) {
            // 就查询下，拉取下权限列表，拉取权限列表成功后进行跳转
            // 这里不用to.path是否在动态的权限列表中，如果不在，在路由测设置了404页面
            store.dispatch('permission/FETCH_PERMISSION').then(() => {
                next({ path: to.path })
            })
        } else {
            // 如果是查到了有当前权限的路由列表，且不是跳转到登录页
            if (to.path !== '/login') {
                // 则跳转
                next()
            } else {
                // 
                next(from.fullPath)
            }
        }
    }
})

router.afterEach((to, from, next) => {
    debugger
    var routerList = to.matched
        // 进入页面后，获取对应的子路由列表，生成面包屑
    store.commit('setCrumbList', routerList)
        // 设置当前激活的菜单项
    store.commit('permission/SET_CURRENT_MENU', to.name)
})

/* eslint-disable no-new */
new Vue({
    router,
    store,
    render: h => h(App)
}).$mount("#app")