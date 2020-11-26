$(function () {
    getUserInfo()
    //退出按钮
    $('#btnLogout').on('click',function(){
        layui.layer.confirm('是否确认退出?', { icon: 3, title: '提示' }, function (index) {
            //清空本地token
            localStorage.removeItem('token')
            //页面跳转
            location.href="/login.html"
            //关闭询问器
            layer.close(index);
        });
    })
})
//获取用户信息(封装到入口函数外面)
//原因后面其他页面要用
function getUserInfo() {
    //发送ajax
    $.ajax({
        url: '/my/userinfo',
        // headers: {
        //     //重新登陆，因为token过期事件12小时
        //     Authorization: localStorage.getItem("token") || ''
        // },
        success: function (res) {
            // console.log(res);
            if (res.status !== 0) {
                return layui.layer.msg(res.message)
            }
            //请求成功，渲染用户头像信息
            rederAvatar(res.data)
        }
    })
}
//封装用户头像渲染函数
function rederAvatar(user) {
    //用户名 (昵称优先，没有就用username)
    var name = user.nickname || user.username
    $('#welcome').html('欢迎&nbsp;&nbsp' + name)
    //用户头像
    if (user.user_pic !== null) {
        //有头像
        $('.layui-nav-img').show().attr('src', user.user_pic)
        $('.text-avatar').hide()
    } else {
        //没有头像
        $('.layui-nav-img').hide()
        var text = name[0].toUpperCase()
        $('.text-avatar').show().html(text)
    }
}