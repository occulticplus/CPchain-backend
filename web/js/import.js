$("#input").click(function (e){//点击导入按钮，使files触发点击事件，然后完成读取文件的操作。
    $("#file_input").click();
});

var result = document.getElementById("result");
var input = document.getElementById("file_input");

if(typeof FileReader === 'undefined'){
    result.innerHTML = "抱歉，你的浏览器不支持 FileReader";
    input.setAttribute('disabled','disabled');
}else{
    input.addEventListener('change',readFile,false);
}


function readFile(){
    var file = this.files[0];
    if(!/image\/\w+/.test(file.type)){
        alert("请确保文件为图像类型");
        return false;
    }
    var reader = new FileReader();
    reader.readAsDataURL(file);

    reader.onload = function(e){
        //alert(3333)
        alert(this.result);
        var base64Str = this.result;
        result.innerHTML = '<img src="'+base64Str+'" alt=""/>'
        // document.getElementById("base64").value = base64Str;
    }
}