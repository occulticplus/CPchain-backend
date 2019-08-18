
$('#login').click(function () {
    var reg_num =/^\d+(\.\d{1,2})?$/;
    var uname=document.getElementById("name").value.trim();
    var uid=document.getElementById("id").value.trim();
    if (uname==""){
        alert("请输入用户名！");
    }else if(!reg_num.test(uid)){
        alert("请输入正确的版权编号！");
    }else {
        jsonData = {
            to: uname,
            id: uid
        };
        $.ajax({
            url:"http://127.0.0.1:3000/api/transaction",
            type:"POST",
            data:jsonData,
            dataType:"json",
            success:function (data) {
                show(1);
            },
            error:function () {
                show(0);
            }
        });
    }
});
