$("#Inquire").click(function (e) {//������밴ť��ʹfiles��������¼���Ȼ����ɶ�ȡ�ļ��Ĳ�����
    $("#changeMore").click();
});

function changeM() {
    var inputJ = $("#changeMore"),
        input = inputJ[0],
        Con = $("#ImgCon");

    inputJ.change(function (e) {
        var files = e.target.files,//�õ�file����
            thisSrc = '';//��ǰ�ĵ�ַ

        for (var i = 0; i < files.length; i++) {
            thisSrc = URL.createObjectURL(files[i]);

            //�ļ����سɹ�����Ⱦ
            $('<img>').attr('src', thisSrc).load(function () {
                Con.append(this);
                URL.revokeObjectURL(thisSrc);//�ͷ��ڴ�
            });

        }
    });
}//
changeM();