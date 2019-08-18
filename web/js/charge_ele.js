var  block_num,timestamp,block_prefix,target,key,binargs;
$('#register').click(function () {
    var reg_num =/^\d+(\.\d{1,2})?$/;
    var name=document.getElementById("username").value.trim();
    var count=document.getElementById("count").value.trim();
    if (name==""){
        alert("请输入用户名！");
    }else if(!reg_num.test(count)){
        alert("请输入正确的电量！");
    }
  else {
        $.ajax({
            url:"http://101.132.130.56:8888/v1/chain/get_info",
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
