
$('#check').click(function () {
    var reg_num =/^\d+(\.\d{1,2})?$/;
    var name=document.getElementById("username").value.trim();
    var base64=document.getElementById("base64").value.trim();
    if (name==""){
        alert("请输入用户名！");
    }else if(!reg_num.test(count)){
        alert("请输入正确的ID！");
    }
  else {
        $.ajax({
            url:"http://127.0.0.1:3000/api/mark",
            type:"POST",
            data: {
                name: name,
                base: base64
            },
            dataType:"json",
            /*
            success:function (data) {
                
                if(data!=null){
                    block_num=data["last_irreversible_block_num"];
                    step2();
                }else {
                    show(0);
                }
                
            },
            */
            success: data => {
              if (data.status === 200) {
                  alert("注册成功!您的图片的id号为: " + JSON.parse(data.data).id + ",请妥善保存!")
              } else if (data.status === 500) {
                  alert("错误: " + data.message)
              } else {
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
