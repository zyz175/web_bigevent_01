$(function(){
    var layer=layui.layer
    var form=layui.form
    initCate()
    //富文本编辑器
    initEditor()
    //定义加载文章分类方法
    function initCate(){
        $.ajax({
            method:'GET',
            url:'/my/article/cates',
            success:function(res){
                console.log(res);
                if(res.status!==0){
                    return layer.msg(res.message)
                }
                //调用模板，渲染分类下拉
                var htmlStr =template('tpl-cate',res)
                $('[name=cate_id]').html(htmlStr)
                form.render()
            }
        })
    }
    // 1. 初始化图片裁剪器
    var $image = $('#image')

    // 2. 裁剪选项
    var options = {
        aspectRatio: 400 / 280,
        preview: '.img-preview'
    }

    // 3. 初始化裁剪区域
    $image.cropper(options)
    //点击按钮，选择图片
    $('#btnChooseImage').on('click',function(){
        $('#coverFile').click()
    })
    //设置图片
    $('#coverFile').change(function(e){
        //拿到用户选择的文件
        var file=e.target.files[0]
        //非空校验
        if(file==undefined){
            return
        }
        // 根据文件，创建对应的 URL 地址
        var newImgURL = URL.createObjectURL(file)
        // 为裁剪区域重新设置图片
        $image
            .cropper('destroy') // 销毁旧的裁剪区域
            .attr('src', newImgURL) // 重新设置图片路径
            .cropper(options) // 重新初始化裁剪区域
    })
    //设置状态
    var state='已发布'
    $('#btnSave2').on('click',function(){
        state='草稿'
    })
    //添加文章
    $('#form-pub').on('submit',function(e){
        e.preventDefault()
        //创建FormData,收集数据
        var fd=new FormData(this)
        //放入状态
        fd.append('state' ,state)
        //放入图片
        $image
            .cropper('getCroppedCanvas', {
                // 创建一个 Canvas 画布
                width: 400,
                height: 280
            })
            .toBlob(function (blob) {
                // 将 Canvas 画布上的内容，转化为文件对象
                // 得到文件对象后，进行后续的操作
                // 5. 将文件对象，存储到 fd 中
                fd.append('cover_img', blob)
                //发起ajax请求
                publishArticle(fd)
        })
  })
  //封装添加文章的方法
  function publishArticle(fd){
    $.ajax({
        method:'POST',
        url:'/my/article/add',
        data:fd,
        //FormData类型数据ajax提交，需要设置两个false
        contentType:false,
        processData:false,
        success:function(res){
            if(res.status!==0){
                return layer.msg(res.message)
            }
            layer.msg('恭喜您，发布文章成功')
            // //跳转
            // location.href="/article/art_list.html"
            setInterval(function(){
                window.parent.document.getElementById("art_list").click()
            },1500)
        }
    })
  }
})