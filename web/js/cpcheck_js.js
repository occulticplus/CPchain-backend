
$('#check').click(function () {
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
              if (data.status === 201) {
                //恢复成功
                  // ret = JSON.parse(data.data);
                  $('#res').html("该图片疑似侵权<br>已为您恢复原图");
                  $("#img").attr('src',"data:image/jpg;base64," + data.data.base64);
                  show(1);
              } else if (data.status === 304) {
                  //没有篡改
                  $('#res').html("该图片没有侵权");
                  show(1);
              }else if (data.status === 403){
                  alert("请登录！");
              } else {
                  //恢复失败
                  show(0);
              }
            },
            error: value => {
                alert("请求错误!");
                console.log(value);
            }
        });
    }
});
