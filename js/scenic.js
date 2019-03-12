var jQuery = $ || {};
(function (window, $, undefined) {
    $(document).ready(function () {
        var param, dataTpl, subnavigationParam, scenicListParam, currPages = 1, firstFalg = true;
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
            "cooperation": {
                "PageIndex": 0,
                "PageSize": 0
            },
            "friendlink": {
                "PageIndex": 1,
                "PageSize": 30
            }
        };
        scenicListParam = {
            "categoryid": "",
            "PageIndex": 1,
            "PageSize": 6
        };
        subnavigationParam = {
            "navid":""
        }
        subnavigationParam.navid = window.location.search.split('&')[1].split('=')[1];
        //初始数据
        var getData = function () {
            var url = "gethomedata";
            $.ajax({
                type: "POST",
                data: param,
                dataType: 'json',
                url: contentUrl + url,
                async: false,
                crossDomain: true == !(document.all),
                success: function (data, type) {
                    console.log(data);
                    if (data.data) {
                        dataTpl = data.data;
                    }
                }
            })
        }
        //导航数据
        var navData = function (data) {
            var html = '<li> <a href="/index.html">首页</a></li> ',
                url = '',
                isActive = '',
                className = '';
            data && data.length > 0 && $.each(data, function (index, item) {
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
        //二级导航
        var subnavigationData = function (data) {
            var url = "getsubnavigation";
            console.log(subnavigationParam);
            $.ajax({
                type: "POST",
                data: subnavigationParam,
                dataType: 'json',
                url: contentUrl + url,
                crossDomain: true == !(document.all),
                success: function (data, type) {
                    console.log(data);
                    var html = '',active;
                    data && data.length > 0 && $.each(data, function (index, item) {
                        active = '';
                        if (index == 0) {
                            active = 'active';
                            scenicListParam.categoryid = item.Id;
                        }
                        html += '<li class=' + active + ' cursor" data-categoryid="' + item.Id + '">' + item.Name + '</li>';
                    });
                    $('.scenicTag').html(html);
                    scenicListData();
                    searchEvents();
                }
            })
        }
        //大美高平
        var scenicListData = function () {
            console.log(333);
            var url = "getstorylist";
            console.log(scenicListParam);
            $.ajax({
                type: "POST",
                data: scenicListParam,
                dataType: 'json',
                url: articleUrl + url,
                crossDomain: true == !(document.all),
                success: function (data, type) {
                    console.log(data);
                    var url = '', html = '',active;
                    data.data.lst_viewarticlelist && data.data.lst_viewarticlelist.length > 0 && $.each(data.data.lst_viewarticlelist, function (index, item) {
                        active = '';
                        if (index % 5 == 0) {
                           active = 'active';
                        }   
                        url = '/details.html?Id=' + item.Id;
                        html += `<li class="`+ active +`">
                                <a href="`+ url + `">
                                    <img data-lazy-src="`+ item.CoverPhoto + `" class="scenicListImg" src="` + item.CoverPhoto + `" data-comp="true" style="visibility: visible;">
                                    <span class="scenicListName">`+ item.Title + `</span>
                                    <span class="scenicListAddress">`+ item.Description + `</span>
                                </a>
                            </li>`;
                    });
                    $('.scenicList>ul').html(html);

                    /*页码*/
                    if (firstFalg) {
                        page(Math.ceil(data.data.totalcount / 6));
                        firstFalg = false;
                    } else {
                        $("#pageBar").whjPaging("setPage", currPages, Math.ceil(data.data.totalcount / 6));
                    }
                }
            })
        }
        //搜索事件
        var searchEvents = function () {
            $(".scenicTag li").click(function () {
                $(".scenicTag li").removeClass('active');
                $(this).addClass('active');
                var categoryid = $(this).attr('data-categoryid');
                scenicListParam.categoryid = categoryid;
                scenicListParam.PageIndex = 1;
                currPages = 1;
                console.log(1111);
                scenicListData();
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
                    scenicListParam.PageIndex = currPage;
                    currPages = currPage;
                    scenicListData();
                }
            });
        };
        //友情链接
        var friendlyLinkData = function (data) {
            var html = '';
            data && data.length > 0 && $.each(data, function (index, item) {
                html += '<li><a href="' + item.Url + '">' + item.Name + '</a></li>'
            });
            $('.friendLinkList').html(html);
        }
        $.when(getData()).done(function () {
            navData(dataTpl.Lst_navigation);
            subnavigationData();
            //companyClassificationData(dataTpl.Lst_companyclassification);
            //companyListData();
            friendlyLinkData(dataTpl.Lst_friendshiplink.data);
        });
    })

})(window, jQuery);
