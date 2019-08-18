$("#Inquire").click(function (e) {//点击导入按钮，使files触发点击事件，然后完成读取文件的操作。
    $("#changeMore").click();
});

function changeM() {
    var inputJ = $("#changeMore"),
        input = inputJ[0],
        Con = $("#ImgCon");

    inputJ.change(function (e) {
        var files = e.target.files,//拿到file数组
            thisSrc = '';//当前的地址

        for (var i = 0; i < files.length; i++) {
            thisSrc = URL.createObjectURL(files[i]);

            //文件加载成功后渲染
            $('<img>').attr('src', thisSrc).load(function () {
                Con.append(this);
                URL.revokeObjectURL(thisSrc);//释放内存
            });

        }
    });
}//
changeM();