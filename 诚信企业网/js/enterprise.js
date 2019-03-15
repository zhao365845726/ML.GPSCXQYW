var jQuery = $ || {};
(function(window, $, undefined) {
    $(document).ready(function() {
        // 获取当前页面url的id值

        function UrlSearch() {
            var name, value;
            var str = location.href; //获取到整个地址
            var num = str.indexOf("?");
            str = str.substr(num + 1); //取得num+1后所有参数，这里的num+1是下标 str.substr(start [, length ]
            var arr = str.split("&"); //以&分割各个参数放到数组里
            for (var i = 0; i < arr.length; i++) {
                num = arr[i].indexOf("=");
                if (num > 0) {
                    name = arr[i].substring(0, num);
                    value = arr[i].substr(num + 1);
                    this[name] = value;
                }
            }
                console.log(this[name])
            getarticledetail = {
                "CompanyId": this[name],
                "CompanyNews": {
                    "PageIndex": 1,
                    "PageSize": 10
                },
                "CompanyVideo": {
                    "PageIndex": 1,
                    "PageSize": 10
                },
                "CompanyQualificationCertificate": {
                    "PageIndex": 1,
                    "PageSize": 10
                },
                "CompanyPatentResults": {
                    "PageIndex": 1,
                    "PageSize": 10
                },
                "CompanyProduct": {
                    "PageIndex": 1,
                    "PageSize": 10
                }
            };


        }
        UrlSearch();


        var param, dataTpl, getarticledetail;
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
        };
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
        };
        //企业内容
        var getarticledetailData = function(){

            $.ajax({
                type: "POST",
                data: getarticledetail,
                dataType: 'json',
                url: "http://api.gpscxqyw.com/api/company/getarticledetail",
                crossDomain: true == !(document.all),
                success: function (data, type) {
                    console.log(data);
                    var html = '';
                    $(".page1_tag_title").text(data.data.Introduction.Title)
                    $(".pageArticleCon p").text(data.data.Introduction.Description)
                    for(var i = 0; i < data.data.Lst_companyPatentResults.length; i ++){
                        $(".enterpriseProduct img").eq(i).attr("src",data.data.Lst_companyPatentResults[i].ResourceUrl)
                        $(".pageConRightList img").eq(i).attr("src",data.data.Lst_companyQualificationCertificate[i].ResourceUrl)
                    }

                    // data.Lst_vcompanylib && data.Lst_vcompanylib.length > 0 && $.each(data.Lst_vcompanylib, function (index, item) {
                    //
                    //     html += ``;
                    // });
                    // $('.companyClassifyBox>ul').html(html);

                }
            })
        };

        //友情链接
        var friendlyLinkData = function(data){
            var html = '';
            data && data.length > 0 && $.each(data, function(index, item) {
                html +='<li><a href="'+item.Url+'">'+item.Name+'</a></li>'
            });
            $('.friendLink').html(html);
        };


        $.when(getData()).done(function(){
            navData(dataTpl.Lst_navigation);
            // companyClassificationData(dataTpl.Lst_companyclassification);
            getarticledetailData();
            // friendlyLinkData(dataTpl.Lst_friendshiplink.data);
        });
    });

})(window, jQuery);
