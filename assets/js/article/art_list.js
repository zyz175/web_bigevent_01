$(function () {
    //定义事件过滤器
    template.defaults.imports.dateFormat = function (dtStr) {
        var dt = new Date(dtStr)

        var y = dt.getFullYear()
        var m = padZero(dt.getMonth() + 1)
        var d = padZero(dt.getDate())

        var hh = padZero(dt.getHours())
        var mm = padZero(dt.getMinutes())
        var ss = padZero(dt.getSeconds())

        return y + '-' + m + '-' + d + ' ' + hh + ':' + mm + ':' + ss
    }
    //在个位数左侧填充0
    function padZero(n) {
        return n > 9 ? n : '0' + n
    }
    //定义提交参数
    var q = {
        pagenum: 1,//页码值
        pagesize: 2,//每页显示多少条数据
        cate_id: "",//文章分类得ID
        state: "",//文章得状态，可选值有：已发布，草稿
    }
    //初始化文章列表
    initTable()
    function initTable() {
        $.ajax({
            method: 'get',
            url: '/my/article/list',
            data: q,
            success: function (res) {
                var str = template('tpl-table', res)
                $('tbody').html(str)
                //分页
                renderPage(res.total)
            }
        })
    }
    //初始化分类
    var form = layui.form
    initCate()
    function initCate() {
        $.ajax({
            method: 'GET',
            url: '/my/article/cates',
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg(res.message)
                }
                //赋值，渲染form
                var htmlStr = template('tpl-cate', res)
                $('[name=cate_id]').html(htmlStr)
                form.render()
            }
        })
    }
    //筛选功能
    $("#form-search").on('submit', function (e) {
        e.preventDefault()
        //获取
        var state = $('[name=state]').val()
        var cate_id = $('[name=cate_id]').val()
        //赋值
        q.state = state
        q.cate_id = cate_id
        //初始化文章列表
        initTable()
    })
    //分页
    var laypage = layui.laypage;
    function renderPage(total) {
        //执行一个laypage实例
        laypage.render({
            elem: 'pageBox', //注意，这里的 test1 是 ID，不用加 # 号
            count: total,//数据总数，从服务端得到
            limit: q.pagesize,//每页几条
            curr: q.pagenum,//第几页

            //分页模块设置，显示哪些子模块
            layout: ['count', 'limit', 'prev', 'page', 'next', 'skip'],
            limits: [2, 3, 5, 10],

            //触发jump：分页初始化的时候，页码改变的时候
            jump: function (obj, first) {
                //obj:所有参数所在的对象，first:是否是第一次初始化分页

                q.pagenum = obj.curr
                q.pagesize = obj.limit
                //判断，不是第一次初始化分页，才能重新调用初始化文章列表
                if (!first) {
                    initTable()
                }
            }
        });
    }
    //删除
    var layer = layui.layer
    $('tbody').on('click', function () {
        var Id = $(this).attr('data-id')
        //显示对话框
        layer.confirm('是否确认删除?', { icon: 3, title: '提示' }, function (index) {
            //do something
            $.ajax({
                method: 'GET',
                url: '/my/article/delete',
                success: function (res) {
                    if (res.status !== 0) {
                        return layer.msg(res.message)
                    }

                    layer.msg('恭喜您，文章删除成功')
                    $('.btn-delete').length == 1 && q.pagenum > 1 ? 1 : q.pagenum - 1
                    //更新成功，重新渲染
                    initTable()

                }
            })
            layer.close(index);
        });

    })
})