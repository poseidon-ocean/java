$(function(){

/*状态切换*/
var timer = null;
$("#lt_tbody").on("click",".tmui-status",function(){
	var $this = $(this);
	var opid = $this.data("opid");
	var status = $this.data("status");
	var mark = (status==0 ? 1 : 0 );
	clearTimeout(timer);
	timer = setTimeout(function(){
		loading("数据执行中，请稍后...");
		$.ajax({
			type:"post",
			url:basePath+"/json/stat/update",
			data:{"stat.id":opid,"stat.status":mark},
			success:function(data){
				 $this.data("status",mark).toggleClass((mark==0?"red green":"green red"))
				 .text((mark==0?"未发布":"发布"));
				 loading("操作成功...",4);
			}
		});
	},200);
});


/*分页初始化*/
lt_initPage($("#lt_tbody").data("itemcount"));
/*敲击键盘搜索*/
$(document).keydown(function(e){
	if(e.keyCode == 13){
		$("#tzui_search").trigger("click");
		}
	});
});

/*分页初始化*/
var pageNo = 0;
var pageSize = 10; 
function lt_initPage(itemCount){
	$("#page").tzPage(itemCount, {
	num_edge_entries : 1, //边缘页数
	num_display_entries :2, //主体页数
	num_edge_entries:2,
	current_page:0,
	showGo:true,
	showSelect:true,
	items_per_page : pageSize, //每页显示X项
	prev_text : "前一页",
	next_text : "后一页",
		callback : function(pageNo,psize){
			lt_loadingTemplate(pageNo,psize);
		}
	});
};

/*搜索*/
function lt_search(obj){
	lt_loadingTemplate(pageNo,pageSize,function(itemcount){
		lt_initPage(itemcount);
	});
};

/*模板加载*/
var timer = null;
function lt_loadingTemplate(pno,psize,callback){
	clearTimeout(timer);
	timer = setTimeout(function(){
	var keyword = $("#keyword").val();
	$.ajax({
		type:"post",
		data:{"page.firstResult":(pno*psize),"page.maxResults":psize,"params.keyword":keyword},
		url:basePath+"/admin/stat/listTemplate",
		success:function(data){
			$("#lt_tbody").html(data);//等元素加载到页面里面,已经真是存在才能够绑定事件.一定是要你的元素在你的dom节点上存在了才能绑定事件
			$(".tzui-tips").tzTip();
			lt_keywordHighlighter(keyword);//关键字高亮
			if(callback){
				var itemcount = $("#tz_tbody").find("tr").eq(0).data("itemcount");
					callback(itemcount);
				}
			}
		});
	},200);
};


//高亮
function lt_keywordHighlighter(keyword){
	$("#lt_tbody").find(".tzui-key").each(function(){
	var text = $(this).text();
	var regex = new RegExp(keyword,"ig");
	var rtext = text.replace(regex,"<span style='color:red'>"+keyword+"</span>");
		 $(this).html(rtext);
	});
};

//删除
function lt_delete(obj){
	$.tzConfirm({title:"删除提示",stat:"您确定删除吗?",callback:function(ok){
	if(ok){
		var opid = $(obj).data("opid");
		$.tzAjax.request({model:"json/stat",method:"delete",callback:function(data){
			if(data.result=="success"){
				loading("删除成功!",4);
				$("#tz-items-"+opid).remove();
			}else{
				loading("删除失败!",4);
			}
		}},{"stat.id":opid});
		}
	}});
};