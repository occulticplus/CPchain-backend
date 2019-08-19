
$('#check').click(function () {
    show(1);
    var reg_num =/^\d+(\.\d{1,2})?$/;
    var id=document.getElementById("id").value.trim();
    var base64=document.getElementById("base64").value.trim();
    if (base64==""){
        alert("请选择图片！");
    }else if(!reg_num.test(id)){
        alert("请输入正确的ID！");
    }
    else {
        $.ajax({
            url:"http://127.0.0.1:3000/api/recovery",
            type:"POST",
            data: {
                id: id,
                base: base64
            },
            dataType:"json",

            success: data => {
              if (data.status === 200) {
                //恢复成功
                  ret = JSON.parse(data.data);
                  ret.base64;
                  alert("注册成功!您的图片的id号为: " + JSON.parse(data.data).id + ",请妥善保存!")
              } else if (data.status === 304) {
                //没有篡改
                  alert("错误: " + data.message)
              }else if (data.status === 403){
                  alert("请登录！");
              } else {
                //恢复失败
                  alert("Something went wrong");
                  console.log("Unexpected Error: ");
                  console.log(data);
                  console.log(typeof(data) + ' ' + data.status);
              }
            },
            error: value => {
                alert("请求错误!");
                console.log(value);
            }
        });
    }
});
