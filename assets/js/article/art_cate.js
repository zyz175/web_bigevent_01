$(function () {
    //调用
    iniArtCateList()
    //获取文章分类列表
    function iniArtCateList() {
        $.ajax({
            method: 'GET',
            url: '/my/article/cates',
            success: function (res){
               console.log(res);
               var str=template('tpl-art-cate', res);
               $("tbody").html(str)
            }
        })
    }
    //显示添加文章分类列表
     var layer=layui.layer
     $('#btnAdd').on('click',function(){
         indexAdd= layer.open({
             type:1,
             area:['500px','250px'],
             title: '添加文章分类',
             content:$('#dialog-add').html()
         })
     })
     //提交文章分类添加(事件委托)
     var indexAdd=null
    $('body').on('submit','#form-add',function(e){
        e.preventDefault()
        $.ajax({
            method:'POST',
            url:'/my/article/addcates',
            data:$(this).serialize(),
            success:function(res){
                if(res.status!==0){
                    return layer.msg(res.message)
                }
                //添加成功重新渲染页面数据
                iniArtCateList()
                layer.msg('恭喜您，文章类别添加成功')
                layer.close(indexAdd)
            }
        })
    })
    // 通过代理的形式，为 btn-edit 按钮绑定点击事件
    var indexEdit = null
    var form=layui.form
    $('tbody').on('click', '.btn-edit', function () {
        // 弹出一个修改文章分类信息的层
        indexEdit = layer.open({
            type: 1,
            area: ['500px', '250px'],
            title: '修改文章分类',
            content: $('#dialog-edit').html()
        })
        //获取Id发送ajax获取数据，渲染到页面
        var Id=$(this).attr('data-id')
        $.ajax({
            method:'GET',
            url:'/my/article/cates/'+Id,
            success:function(res){
                form.val('form-edit',res.data)
            }
        })
   })
    //为修改分类表单绑定submit
    $('body').on('submit', '#form-edit', function (e) {
        e.preventDefault()
        $.ajax({
            method: 'POST',
            url: '/my/article/updatecate',
            data: $(this).serialize(),
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg(res.message)
                }
                //添加成功重新渲染页面数据
                iniArtCateList()
                layer.msg('恭喜您，文章类别更新成功')
                layer.close(indexEdit)
            }
        })
    })
    //删除
    $('tbody').on('click','.btn-delete',function(){
        var Id=$(this).attr('data-id')
        //显示对话框
        layer.confirm('是否确认删除?',{icon: 3,title:'提示'},
        function(index){
            $.ajax({
                method:'GET',
                url:'/my/article/deletecate/'+Id,
                success:function(res){
                    if(res.status!==0){
                        return layer.msg(res.message)
                    }
                    //重新渲染
                    iniArtCateList()
                    layer.msg('恭喜您，文章类别删除成功')
                    layer.close(index)
                }
            })
        }
        )
    })
})
