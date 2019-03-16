var jQuery = $ || {};
(function(window, $, undefined) {
	$(document).ready(function() {
        // 获取当前页面url的id值
        function UrlSearch() {
            var name, value;
            var str = location.href; //获取到整个地址
            var num = str.indexOf("wd");
            str = str.substr(num + 3); //取得num+1后所有参数，这里的num+1是下标 str.substr(start [, length ]
            // console.log(decodeURI(str))
            if(decodeURI(str).length > 20){
                $("#companyClassifySearchInput").val()
            }else{
                $("#companyClassifySearchInput").val(decodeURI(str))
            }

        }
        UrlSearch();

        var param, dataTpl, companyListParam,currPages = 1,firstFalg = true;
	    param = {
		  "companyclassification": {
		    "PageIndex": 1,
		    "PageSize": 30
		  },
		  "revenco": {
		    "PageIndex": 0,
		    "PageSize": 0
		  },
		  "companynews": {
		    "PageIndex": 0,
		    "PageSize": 0
		  },
		  "policies": {
		    "PageIndex": 0,
		    "PageSize": 0
		  },
		  "notices": {
		    "PageIndex": 0,
		    "PageSize": 0
		  },
		  "travel": {
		    "PageIndex": 0,
		    "PageSize": 0
		  },
		  "friendlink": {
		    "PageIndex": 1,
		    "PageSize": 30
		  }
        };
        companyListParam = {
            "Keyword": "",
            "Type": 0,
            "PageIndex": 1,
            "PageSize": 6
        };
        companyListParam.Type = Number(window.location.search.split('&')[1].split('=')[1]);
        if (companyListParam.Type == 1) {
            $(".companyClassifyTag li").removeClass('active');
            $(".companyClassifyTag li:eq(1)").addClass('active');
        }
       
        //初始数据
        var getData = function(){
        	var url = "gethomedata";
			$.ajax({
				type: "POST",
				data: param,
				dataType: 'json',
				url: contentUrl + url,
				async : false,
				crossDomain: true == !(document.all),
				success: function(data, type) {
					// console.log(data);
					if (data.data) {
						dataTpl = data.data;
					}
				}
			})
        }
        //导航数据
        var navData = function(data){
        	var html='<li> <a href="/index.html">首页</a></li> ',
	        	url = '',
	        	isActive = '',
	        	className = '';
			data && data.length > 0 && $.each(data, function(index, item) {
                switch (item.Name) {
                    case '企业名录':
                        url = '/company.html?title=' + item.Name + '&type=0';
                        break;
                    case '政策法规':
                        url = '/policy.html?title=' + item.Name + '&id=' + item.Id;
                        break;
                    case '通知公告':
                        url = '/policy.html?title=' + item.Name + '&id=' + item.Id;
                        break;
                    case "立信企业":
                        url = '/company.html?title=' + item.Name + '&type=1';
                        break;
                    case '企业商城':
                        url = '';
                        break;
                    case "大美高平":
                        url = '/scenic.html?title=' + item.Name + '&id=' + item.Id;
                        break;
                    default:
                        break;
                }
				isActive = item.Name == '首页' ? 'active' : '';
				//拼接dom;
				html += '<li class="' + isActive + '">/ <a href="' + url + '">' + item.Name + '</a></li> ';
			});
			$('.nav').html(html);	
        }
        //企业分类
        var companyClassificationData = function(data){
            var url = '',html = '';
			data && data.length > 0 && $.each(data, function(index, item) {
                html += '<li  data-id="' + item.DataDictionaryDetailId +'"><a href="javascript:;">' + item.FullName + '</a></li>';
			});
            $('.companyList').html(html);
        }
        //立信企业
        var companyListData = function(){
            var url = "list";
            $.ajax({
                type: "POST",
                data: companyListParam,
                dataType: 'json',
                url: companyUrl + url,
                crossDomain: true == !(document.all),
                success: function (data, type) {
                    // console.log(data);
                        var html = '',active = '';
                    data.Lst_vcompanylib && data.Lst_vcompanylib.length > 0 && $.each(data.Lst_vcompanylib, function (index, item) {
                        if (item.Type == 1) {
                            active = 'company_iconActive';
                        }
                            html += `<li class="companyClassifyList">
                                  <a href="/enterprise.html?companyId=`+ item.CompanyId +`">
                                    <div class="container_page companyClassifyDetail">
                                      <span class="company_icon `+ active +`"></span>
                                      <div class="company_introduce">
                                        <h3>`+ item.FullName +`</h3>
                                        <span class="clickNum">点击量：`+ item.ClickRate +`</span>
                                        <div class="company_introduceCon">
                                          企业简介：`+ item.Description +`
                                        </div>
                                        <div class="container company_label">
                                          <span class="food_label">食品</span>
                                          <span class="drinks_label">饮料</span>
                                          <span class="IPO_label">上市</span>
                                        </div>
                                      </div>
                                    </div>
                                  </a>
                                </li>`;
                        });
                    $('.companyClassifyBox>ul').html(html);

                    /*页码*/
                    if (firstFalg) {
                        page(Math.ceil(data.Count / 6));
                        firstFalg = false;
                    } else {
                        $("#pageBar").whjPaging("setPage", currPages, Math.ceil(data.Count / 6));
                    }
                    searchEvents();
                }
            })
        }
        //搜索事件
        var searchEvents = function () {
            $(".companyList li").click(function () {
                var id = $(this).attr('data-id');

            })
            $(".companyClassifyTag li").click(function () {
                $(".companyClassifyTag li").removeClass('active');
                $(this).addClass('active');
                var type = $(this).attr('data-type');
                companyListData();
            })
            $("#companyClassifySearchSubmit").click(function () {
                var value = $("#companyClassifySearchInput").val().trim();
                if (value && value != undefined) {
                    companyListParam.Keyword = value;
                    companyListParam.PageIndex = 1;
                    currPages = 1;
                    companyListData();
                }
            })
        }
        //分页逻辑
        var page = function (i) {
            $('#pageBar').whjPaging({
                totalPage: i,
                showPageNum: 4,
                isShowFL: true,//首末页面
                isShowPageSizeOpt: false,
                isShowSkip: false,
                isShowRefresh: false,
                isShowTotalPage: false,
                isResetPage: true,
                callBack: function (currPage, pageSize) {
                    companyListParam.PageIndex = currPage;
                    currPages = currPage;
                    companyListData();
                }
            });
        };
        //友情链接
        var friendlyLinkData = function(data){
            var html = '';
			data && data.length > 0 && $.each(data, function(index, item) {
				html +='<li><a href="'+item.Url+'">'+item.Name+'</a></li>'
			});
			$('.friendLink').html(html);
        }
		$.when(getData()).done(function(){
           navData(dataTpl.Lst_navigation);
           companyClassificationData(dataTpl.Lst_companyclassification);
            companyListData();
           // friendlyLinkData(dataTpl.Lst_friendshiplink.data);
		});
    })

})(window, jQuery);

