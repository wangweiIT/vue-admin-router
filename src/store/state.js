export default {
    get UserToken() {
        debugger
        return localStorage.getItem('token')
    },
    set UserToken(value) {
        debugger
        localStorage.setItem('token', value)
    },
    /* 导航菜单是否折叠 */
    isSidebarNavCollapse: false,
    /* 面包屑导航列表 */
    crumbList: []
}