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
            // Id=577071EB-0957-41AE-8D28-3949D03871C4
            // title=企业名录&type=0&wd=啊啊
            article = {
                "ArticleId": this[name]
            };


        }
        UrlSearch();

        var param, dataTpl, article;
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
        //文张内容
        var articleData = function(){

            $.ajax({
                type: "POST",
                data: article,
                dataType: 'json',
                url: "http://api.gpscxqyw.com/api/article/getarticledetail",
                crossDomain: true == !(document.all),
                success: function (data, type) {
                    // console.log(data);
                    var html1='',url1 = '',html2='',url2='';

                    $(".page1_tag_title1").text(data.data.CategoryName);
                    $(".detailsTitle").text(data.data.ArticleEntity.Title);
                    $(".detailsCon").html(unescape(data.data.ArticleEntity.Body));
                    $(".detailsTime").text('发表时间: '+data.data.ArticleEntity.CreateTime)
                    $(".detailsSource").text(data.data.ArticleEntity.Description)
                    // console.log(unescape(data.data.ArticleEntity.Body))
                    if(data.data.NextArticleId == null){
                        $(".pageNext span").html("null")

                    }else {
                        url1 = '/details.html?id=' + data.data.NextArticleId;
                        html1 = '<a href=' + url1 +'>'+data.data.NextArticleTitle + '</a>';

                        $(".pageNext span").html(html1);

                    if(data.data.PreviousArticleId == null){
                        $(".pagePrev span").html("null")
                    }else{
                        url2 = '/details.html?id=' + data.data.PreviousArticleId;
                        html2 = '<a href=' + url2 +'>'+data.data.PreviousArticleTitle + '</a>';
                        $(".pagePrev span").html(html2)
                    }
                    }



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
            articleData();
            friendlyLinkData(dataTpl.Lst_friendshiplink.data);
        });
    });

})(window, jQuery);
