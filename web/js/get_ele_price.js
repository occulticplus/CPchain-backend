window.onload=function () {
    var name_ob=new Object();
    name_ob.scope="inita";
    name_ob.code="inita";
    name_ob.table="electaccount"
    name_ob.json="true";
    var json_ob=JSON.stringify(name_ob);
    $.ajax({
        url:"http://101.132.130.56:8888/v1/chain/get_table_rows",
        type:"POST",
        data:json_ob,
        dataType:"json",
        success:function (data) {
            var ele=(data.rows[0].balance/100).toFixed(2);
            if (ele<10){
                ele=10.00;
            }
            var ele_money=(20/ele).toFixed(2);
            document.getElementById("ele_price_num").innerHTML=ele_money;
        }
    });

}