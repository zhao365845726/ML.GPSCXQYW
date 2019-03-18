
var jQuery = $ || {};
(function (window, $, undefined) {
    $(document).ready(function () {
        var param, dataTpl, scenicListParam,navId;
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
        scenicListParam = {
            "categoryid": "5d5b3833-9894-433b-98c9-5da4e2a01437",
            "PageIndex": 1,
            "PageSize": 12
        };
        navId = window.location.search.split('&')[1].split('=')[1];

        //初始数据
        var getData = function () {
            var url = "gethomedata";
            $.ajax({
                type: "POST",
                data: param,
                dataType: 'json',
                url: contentUrl + url,
                async: false,
                crossDomain: true === !(document.all),
                success: function (data, type) {
                    // console.log(data);
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
                isActive = item.Name === '首页' ? 'active' : '';
                //拼接dom;
                html += '<li class="' + isActive + '">/ <a href="' + url + '">' + item.Name + '</a></li> ';
            });
            $('.nav').html(html);
        };

        //大美高平
        var scenicListData = function () {
            var url = "getstorylist";
            $.ajax({
                type: "POST",
                data: scenicListParam,
                dataType: 'json',
                url: articleUrl + url,
                crossDomain: true === !(document.all),
                success: function (data, type) {
                    console.log(data)
                    var url = '', html = '';
                    data.data.lst_viewarticlelist && data.data.lst_viewarticlelist.length > 0 && $.each(data.data.lst_viewarticlelist, function (index, item) {
                        url = '/details.html?Id=' + item.Id;
                        html += `<li class="active">
                                <a href="`+ url + `">
                                    <img data-lazy-src="`+ item.CoverPhoto+ `" class="scenicListImg" src="`+item.CoverPhoto+`" data-comp="true" style="visibility: visible;">
                                    <span class="scenicListName">`+ item.Title + `</span>
                                    <span class="scenicListLevel">`+ item.Description + `</span>
                                  
                                </a>
                            </li>`;
                    });
                    $('.scenicList>ul').html(html);
                // <span class="scenicListAddress">`+ item.Description + `</span>
                    /*页码*/
                    page(Math.ceil(data.data.totalcount / 6));
                }
            })
        }
        //分页逻辑
        var page = function (i) {
            $('#pageBar').whjPaging({
                totalPage: i,
                showPageNum: 0,
                isShowFL: false,//首末页面
                isShowPageSizeOpt: false,
                isShowSkip: false,
                isShowRefresh: false,
                isShowTotalPage: false,
                isResetPage: true,
                callBack: function (currPage, pageSize) {
                    scenicListParam.PageIndex = currPage;
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
            $('.friendLink').html(html);
        }
        $.when(getData()).done(function () {
            navData(dataTpl.Lst_navigation);
            //companyClassificationData(dataTpl.Lst_companyclassification);
            scenicListData();
            // friendlyLinkData(dataTpl.Lst_friendshiplink.data);
        });
    })

})(window, jQuery);

