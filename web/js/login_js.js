$("#login").click(function(){
    var walletName=document.getElementById("walletname");
    var txt = walletName.value.trim();
    var privateKey=document.getElementById("privatekey");
    var key=privateKey.value.trim();
    var jsonData=JSON.stringify({
        walletname: walletName,
        walletkey: privateKey
    });
    if(txt.length==0){
        alert("请输入信息！");
    }
    else{
        $.ajax({
            url:"http://127.0.0.1:3000/api/login",
            type:'POST',
            data:jsontxt,
            dataType: "json",
            success:function(data){
               
                window.location.href='index.html';

            },
            error:function(XMLHttpRequest, textStatus, errorThrown) {
                if(XMLHttpRequest.status==500){
                    alert("请输入正确的钱包名或私钥！");
                    walletName.value="";
                    walletName.focus();
                }

            }});
    }
});
