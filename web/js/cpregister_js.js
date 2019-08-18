
$('#register').click(function () {
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
            url:"http://127.0.0.1:8888/api/cpregister",
            type:"GET",
            dataType:"json",
            success:function (data) {
                if(data!=null){
                    block_num=data["last_irreversible_block_num"];
                    step2();
                }else {
                    show(0);
                }
            },
            error:function () {
                show(0);
            }
        });
    }
});
