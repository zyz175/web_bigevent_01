$(function(){
    //点击去注册按钮，隐藏登录区域，显示注册区域
    $('#link_reg').on('click',function(){
        $('.login-box').hide()
        $('.reg-box').show()
    })
    //点击去登录按钮，隐藏注册区域，显示登录区域
    $('#link_login').on('click',function(){
        $('.login-box').show()
        $('.reg-box').hide()
    })
    //自定义校验
    var form=layui.form
    var layer=layui.layer
    // alert(form)
    form.verify({
        pwd: [
            /^[\S]{6,12}$/
            , '密码必须6到12位，且不能出现空格'
        ] ,
        //确认密码校验规则
        repwd:function(value){
            //value代表确认密码的值
            //获取密码的值
            var pwd = $(".reg-box input[name=password]").val()
          if(value !== pwd){
              //返回错误信息
              return  "两次输入密码不一致"
          }
        }
    })
    //注册功能
    $('#form_reg').on('submit',function(e){
        //阻止表单提交
        e.preventDefault()
        //发送ajax
        $.ajax({
            method:'POST',
            url:'/api/reguser',
            data:{
                username:$('.reg-box [name=username]').val(),
                password:$('.reg-box [name=password]').val(),
            },
            success: function(res){
                //返回判断状态
                if(res.status!=0){
                    return layer.msg(res.message, { icon: 5}); 
                }
                layer.msg('恭喜您，注册成功', { icon: 6 }); 
                //页面跳转
                $('#link_login').click()
                //清空注册页面
                $('#form_reg')[0].reset()
            }
        })
    })
    //登录功能
    $('#form_login').submit(function(e){
        //阻止表单提交
        e.preventDefault()
        //发送ajax
        $.ajax({
            method:'POST',
            url:'/api/login',
            data:$(this).serialize(),
            success:function(res){
                //检验返回状态
                if(res.status !==0){
                    return layer.msg(res.message)
                }
                //提示信息 保存token,跳转页面
                layer.msg("恭喜您，登录成功")
                //保存token
                localStorage.setItem('token',res.token)
                //跳转
                location.href='/index.html'
            }
        })
    })
})
