var jQuery = $ || {};
(function(window, $, undefined) {
	$(document).ready(function() {
		var param,dataTpl;
	    param = {
		  "companyclassification": {
		    "PageIndex": 1,
		    "PageSize": 10
		  },
		  "revenco": {
		    "PageIndex": 1,
		    "PageSize": 10
		  },
		  "companynews": {
		    "PageIndex": 1,
		    "PageSize": 5
		  },
		  "policies": {
		    "PageIndex": 1,
		    "PageSize": 5
		  },
		  "notices": {
		    "PageIndex": 1,
		    "PageSize": 5
		  },
		  "travel": {
		    "PageIndex": 1,
		    "PageSize": 6
           },
          "cooperation": {
            "PageIndex": 1,
            "PageSize": 12
          },
		  "friendlink": {
		    "PageIndex": 1,
		    "PageSize": 20
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
					console.log(data);
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
					default :
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
				url = '/company.html?type=0';
				html +='<li class="ellipsis"><a href="'+url+'">'+item.FullName+'</a></li>';
			});
			$('.companyClassification').html(html);
        }
        //立信企业
        var revencoData = function(data){
            var url = '',html = '';
			data && data.length > 0 && $.each(data, function(index, item) {
				url = '/enterprise.html?companyId='+item.CompanyId;
				html +='<li class="ellipsis"><a href="'+url+'">'+item.FullName+'</a></li>';
			});
			$('.revenco').html(html);
        }
        //新闻公告
        var noticesData = function(type,data){
            var url = '',html = '';
			data && data.length > 0 && $.each(data, function(index, item) {
				url = '/details.html?Id='+item.Id;
				html +='<li class="ellipsis"><a href="'+url+'">'+item.Title+'</a></li>'
			});
			switch(type){
				case 0: //企业动态
				  $('.newsList:eq('+type+')').html(html);
				  break;
				case 1: //规章制度
				  $('.newsList:eq('+type+')').html(html);
				  break;
				case 2: //通知公告
				  $('.newsList:eq('+type+')').html(html);
				  break;    
			}
        }
        //大美高平
        var swiperData = function(data){
        	var url = '',html = '';
			data && data.length > 0 && $.each(data, function(index, item) {
				url = '/details.html?Id='+item.Id;
				html +='<div class="swiper-slide"><a href="'+url+'"><img src="'+item.CoverPhoto+'"></a></div>';
			});
			$('.swiper-wrapper').html(html);
			swiperAnimation();
        }
        var swiperAnimation = function(){
        	var certifySwiper = new Swiper('.swiper-container', {
			    watchSlidesProgress: true,
			    slidesPerView: 'auto',
			    centeredSlides: true,
			    loop: true,
			    loopedSlides: 5,
			    autoplay: true,
			    navigation: {
			      nextEl: '.swiper-button-next',
			      prevEl: '.swiper-button-prev',
			    },
			    pagination: {
			      el: '.swiper-pagination',
			      clickable :true,
			    },
			    on: {
			      progress: function(progress) {
			        for (i = 0; i < this.slides.length; i++) {
			          var slide = this.slides.eq(i);
			          var slideProgress = this.slides[i].progress;
			          modify = 1;
			          if (Math.abs(slideProgress) > 1) {
			            modify = (Math.abs(slideProgress) - 1) * 0.3 + 1;
			          }
			          translate = slideProgress * modify * 260 + 'px';
			          scale = 1 - Math.abs(slideProgress) / 5;
			          zIndex = 999 - Math.abs(Math.round(10 * slideProgress));
			          slide.transform('translateX(' + translate + ') scale(' + scale + ')');
			          slide.css('zIndex', zIndex);
			          slide.css('opacity', 1);
			          if (Math.abs(slideProgress) > 3) {
			            slide.css('opacity', 0);
			          }
			        }
			      },
			      setTransition: function(transition) {
			        for (var i = 0; i < this.slides.length; i++) {
			          var slide = this.slides.eq(i)
			          slide.transition(transition);
			        }

			      }
			    }
			})
        }
        //合作伙伴
        var cooperationData = function (data) {
            var html = '';
            data && data.length > 0 && $.each(data, function (index, item) {
                html += '<li><a href="' + item.LinkUrl + '"><img data-lazy-src="' + item.Cover+'"></a></li>'
            });
            $('.friendLink').html(html);
        }
        //友情链接
        var friendlyLinkData = function(data){
            var html = '';
			data && data.length > 0 && $.each(data, function(index, item) {
				html +='<li><a href="'+item.Url+'">'+item.Name+'</a></li>'
			});
            $('.friendLinkList').html(html);
        }
		$.when(getData()).done(function(){
            console.log(dataTpl);
           navData(dataTpl.Lst_navigation);
           companyClassificationData(dataTpl.Lst_companyclassification);
           revencoData(dataTpl.Lst_companyericsson);
           noticesData(0,dataTpl.Lst_companynews);
           noticesData(1,dataTpl.Lst_policies);
           noticesData(2,dataTpl.Lst_notices);
            swiperData(dataTpl.Lst_travel);
            cooperationData(dataTpl.Lst_cooperation.data);
           friendlyLinkData(dataTpl.Lst_friendshiplink.data);
		});
    })

})(window, jQuery);
