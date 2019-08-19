$("#main").ready(function () {
    $.ajax({
        url:"http://127.0.0.1:3000/api/list",
        type:"GET",
        dataType:"json",
        success:function (data) {
        	res = JSON.parse(data.data);
        	for (let i of res) {
        		htmlStr = '<div class="col-sm-3 layout-box">';
        		htmlStr += '<a>';
        		htmlStr +=  '<img src="' + i.data + '" alt="">';
        		htmlStr += '</a>';
        		htmlStr += '<p>'+ i.owner +'<br>'+ "ID：" + i.id +'</p>';
        		$("#main").after(htmlStr);
        	}
        },
        error:function () {
        }
    });
   
});
