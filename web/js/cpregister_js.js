
$('#register').click(function () {
    var reg_num =/^\d+(\.\d{1,2})?$/;
    var base64=document.getElementById("base64").value.trim();
    if (base64==""){
        alert("请选择图片！");
    }
    else {
        $.ajax({
            url:"http://127.0.0.1:3000/api/mark",
            type:"POST",
            data: {
                base: base64
            },
            dataType:"json",
        
            success: data => {
              if (data.status === 200) {
                $('#pid').html("您的ID为：" + JSON.parse(data.data).id);
                show(1);
              } else if (data.status === 500) {
                $('#error').html(data.message);
                show(0);
              } else {
                $('#error').html("系统错误");
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
