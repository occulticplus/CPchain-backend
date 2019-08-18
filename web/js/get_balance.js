$('#query').click(function () {
    var name_block=document.getElementById("username");
    var name=name_block.value.trim();
    if (name==""){
        alert("请输入用户名！");
    }else {
        var name_ob=new Object();
        name_ob.scope=name;
        name_ob.code="inita";
        name_ob.table="account"
        name_ob.json="true";
        var json_ob=JSON.stringify(name_ob);
        $.ajax({
            url:"http://101.132.130.56:8888/v1/chain/get_table_rows",
            type:"POST",
            data:json_ob,
            dataType:"json",
            success:function (data) {
                if(data.rows[0]!=null){
                    var money=(data.rows[0].balance/100).toFixed(2);
                    var text=money+"元";
                    document.getElementById("money_balance").innerHTML=text;
                    name_ob.table="electaccount";
                    var json_ob2=JSON.stringify(name_ob);
                    $.ajax({
                        url:"http://101.132.130.56:8888/v1/chain/get_table_rows",
                        type:"POST",
                        data:json_ob2,
                        dataType:"json",
                        success:function (data) {
                            if(data.rows[0]!=null){
                                var ele=(data.rows[0].balance/100).toFixed(2);
                                var text2=ele+"kW·h";
                                document.getElementById("ele_balance").innerHTML=text2;
                            }else {
                                show(0);
                            }
                        },
                        error:function () {
                            show(0);
                        }
                    });
                }else{
                    show(0);
                }
            },
            error:function () {
                show(0);
            }
        });
    }
});