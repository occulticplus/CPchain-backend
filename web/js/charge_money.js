var  block_num,timestamp,block_prefix,target,key,binargs,name;
$('#login').click(function () {
    var reg_num =/^\d+(\.\d{1,2})?$/;
    var name=document.getElementById("username").value.trim();
    var count=document.getElementById("money_count").value.trim();
    if (name==""){
        alert("请输入用户名！");
    }else if(!reg_num.test(count)){
        alert("请输入正确的电量！");
    }
    else{
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
function step2() {
    var obj=new Object();
    obj.block_num_or_id=block_num;
    var jsonobj=JSON.stringify(obj);
    $.ajax({
        url:"http://101.132.130.56:8888/v1/chain/get_block",
        type:"POST",
        data:jsonobj,
        dataType:"json",
        success:function (data) {
            if(data!=null){
                timestamp=data["timestamp"];
                timestamp = timestamp+"Z";
                var time1 =+new Date(timestamp);
                var time = new Date(time1+=3600*1000*1);
                timestamp=time.toISOString().slice(0,19);
                block_prefix=data["ref_block_prefix"];
                step4();
            }else {
                show(0);
            }
        },
        error:function () {
            show(0);
        }
    });
}

function step4() {
    var name_ob=new Object();
    name_ob.account_name="inita";
    var json_ob=JSON.stringify(name_ob);
    $.ajax({
        url:"http://101.132.130.56:8888/v1/chain/get_account",
        type:"POST",
        data:json_ob,
        dataType:"json",
        success:function (data) {
            if(data!=null){
                key=data["permissions"][0].required_auth.keys[0].key;
                step5();
            }else {
                show(0);
            }
        },
        error:function () {
            show(0);
        }
    });
}
function step5() {
   name=document.getElementById("username").value.trim();
    var count=document.getElementById("money_count").value.trim()*100;
    var obj=new Object();
    obj.code="inita";
    obj.action="recharge";
    obj.args=new Object();
    obj.args.to=name;
    obj.args.amount=count;
    var json_ob=JSON.stringify(obj);
    $.ajax({
        url:"http://101.132.130.56:8888/v1/chain/abi_json_to_bin",
        type:"POST",
        data:json_ob,
        dataType:"json",
        success:function (data) {
            if(data!=null){
                binargs=data["binargs"];
                step6();
            }else {
                show(0);
            }
        },
        error:function () {
            show(0);
        }
    });
}
function step6() {
    var gather=[];
    gather[0]=new Object();
    gather[0].ref_block_num=block_num;
    gather[0].ref_block_prefix=block_prefix;
    gather[0].expiration=timestamp;
    gather[0].scope=[];
    if (name<"inita"){
        gather[0].scope[0]=name;
        gather[0].scope[1]="inita";
    }else {
        gather[0].scope[0]="inita";
        gather[0].scope[1]=name;
    }
    gather[0].read_scope=[];
    gather[0].messages=[];
    gather[0].messages[0]=new Object();
    gather[0].messages[0].code="inita";
    gather[0].messages[0].type="recharge";
    gather[0].messages[0].authorization=[];
    gather[0].messages[0].authorization[0]=new Object();
    gather[0].messages[0].authorization[0].account="inita";
    gather[0].messages[0].authorization[0].permission="active";
    gather[0].messages[0].data=binargs;
    gather[0].signatures=[];
    gather[1]=[];
    gather[1][0]=key;
    gather[2]="";
    var json_gather=JSON.stringify(gather);
    $.ajax({
        url:"http://101.132.130.56:8888/v1/wallet/sign_transaction",
        type:"POST",
        data:json_gather,
        dataType:"json",
        success:function (data) {
            if(data!=null){
                var signatures=data["signatures"][0];
                step7(signatures);
            }else {
                show(0);
            }
        },
        error:function () {
            show(0);
        }
    });
}
function step7(var_sign) {
    var name=document.getElementById("username").value.trim();
    var gather=new Object();
    gather.ref_block_num=block_num;
    gather.ref_block_prefix=block_prefix;
    gather.expiration=timestamp;
    gather.scope=[];
    if (name<"inita"){
        gather.scope[0]=name;
        gather.scope[1]="inita";
    }else {
        gather.scope[0]="inita";
        gather.scope[1]=name;
    }
    gather.read_scope=[];
    gather.messages=[];
    gather.messages[0]=new Object();
    gather.messages[0].code="inita";
    gather.messages[0].type="recharge";
    gather.messages[0].authorization=[];
    gather.messages[0].authorization[0]=new Object();
    gather.messages[0].authorization[0].account="inita";
    gather.messages[0].authorization[0].permission="active";
    gather.messages[0].data=binargs;
    gather.signatures=[];
    gather.signatures[0]=var_sign;
    var json_gather=JSON.stringify(gather);
    $.ajax({
        url:"http://101.132.130.56:8888/v1/chain/push_transaction",
        type:"POST",
        data:json_gather,
        dataType:"json",
        success:function (data) {
            if(data!=null){
               show(1);
            }else {
                show(0);
            }
        },
        error:function () {
            show(0);
        }
    });
}