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
                // console.log(this[name])
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
                    "PageSize": 18
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
                    // console.log(data);
                    var html = '', url='';
                    $(".page1_tag_title").text(data.data.Introduction.Title)
                    $(".pageArticleCon p").text(data.data.Introduction.Description)
                    for(var i = 0; i < data.data.Lst_companyPatentResults.length; i ++){
                        $(".enterpriseProduct img").eq(i).attr("src",data.data.Lst_companyPatentResults[i].ResourceUrl);

                        // $(".achievement img").eq(i).attr()

                    }
                    for(var i = 0; i < data.data.Lst_companyQualificationCertificate.length; i ++){
                        $(".qualification img").eq(i).attr("src",data.data.Lst_companyQualificationCertificate[i].ResourceUrl)
                    }
                    for(var i =0 ;i < data.data.Lst_companyNews.length; i ++){
                        url = '/details.html?Id=' + data.data.Lst_companyNews[i].Id;
                        html += '<li class=ellipsis><a href='+url+'>'+data.data.Lst_companyNews[i].Title+'</a></li>'
                    }
                    $(".companyNews").html(html)
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

        //企业产品xiangqing
        $(".enterpriseProduct li").on("click","img",function () {
            $.ajax({
                type: "POST",
                data: getarticledetail,
                dataType: 'json',
                url: "http://api.gpscxqyw.com/api/company/getarticledetail",
                success: function (data) {
                    // console.log(data.data);
                    var len = data.data.Lst_companyPatentResults.length;
                    var arrPic = new Array(); //定义一个数组
                    for (var i = 0; i < len; i++) {

                        arrPic[i] = data.data.Lst_companyPatentResults[i].ResourceUrl; //将所有img路径存储到数组中
                        console.log(arrPic[i])
                    };
                    $("body").append("<div class=\"mask-layer\">" +
                        "   <div class=\"mask-layer-black\"></div>" +
                        "   <div class=\"mask-layer-container\">" +
                        "       <div class=\"mask-layer-container-operate\">" +
                        "           <button class=\"mask-prev btn-default-styles\" style=\"float: left\">上一张</button>" +
                        "           <button class=\"mask-close btn-default-styles\">关闭</button>" +
                        "           <button class=\"mask-next btn-default-styles\" style=\"float: right\">下一张</button>" +
                        "       </div>" +
                        "       <div class=\"mask-layer-imgbox auto-img-center\"></div>" +
                        "   </div>" +
                        "</div>"
                    );
                    var img_index = $(".enterpriseProduct img").index(this);//获取点击的索引值
                    var num = img_index;
                    function showImg() {
                        $(".mask-layer-imgbox").append("<p><img src=\"\"></p>");
                        $(".mask-layer-imgbox img").prop("src", arrPic[num+1]); //给弹出框的Img赋值
                        var $div_img = $(".mask-layer-imgbox p");
                        $div_img.bind("mousedown", function (event) {
                            event.preventDefault && event.preventDefault();
                            var offset_x = $(this)[0].offsetLeft;
                            var offset_y = $(this)[0].offsetTop;
                            var mouse_x = event.pageX;
                            var mouse_y = event.pageY;
                            $(".mask-layer-imgbox").bind("mousemove", function (ev) {
                                var _x = ev.pageX - mouse_x;
                                var _y = ev.pageY - mouse_y;
                                var now_x = (offset_x + _x ) + "px";
                                var now_y = (offset_y + _y ) + "px";
                                $div_img.css({
                                    top: now_y,
                                    left: now_x
                                });
                            });
                        });
                        $(".mask-layer-imgbox").bind("mouseup", function () {
                            $(this).unbind("mousemove");
                        });

                        $(".mask-close").click(function () {
                            $(".mask-layer").remove();
                        });
                        $(".mask-layer-black").click(function () {
                            $(".mask-layer").remove();
                        });
                    }
                    showImg();
                    //下一张
                    $(".mask-next").on("click", function () {
                        $(".mask-layer-imgbox p img").remove();
                        num++;
                        if (num === len) {
                            num = 0;
                        }
                        showImg();
                    });
                    //上一张
                    $(".mask-prev").on("click", function () {
                        $(".mask-layer-imgbox p img").remove();
                        num--;
                        if (num === -1) {
                            num = len - 1;
                        }
                        showImg();
                    });

                }
            })
        })
    });

})(window, jQuery);
