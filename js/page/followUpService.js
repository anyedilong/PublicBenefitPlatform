$(function () {
    var followIframe = document.getElementById('followIframe');
    $(".health_list").on("click","li",function () {
        $(this).find(".serialNum").removeClass("a_gray").addClass("green");
        $(this).siblings().find(".serialNum").removeClass("green").addClass("a_gray");
        $('#followIframe').attr('src','followUp/diabetes.html');
    });
    function setIframeHeight(iframe) {
        if (iframe) {
            var iframeWin = iframe.contentWindow || iframe.contentDocument.parentWindow;
            if (iframeWin.document.body) {
                iframe.height = iframeWin.document.documentElement.scrollHeight || iframeWin.document.body.scrollHeight;
            }
        }
    }
    window.onload = function () {
        setIframeHeight(followIframe);
    };
    $(window).resize(function(){
        setIframeHeight(followIframe);
    });
    layui.use(['laypage'], function() {
        var laypage = layui.laypage;

        // 精神障碍
        var getPage = {
            elem: 'getPage'
            , count: 50
            , layout: ['prev', 'next']
            , limit: 10  //得到每页显示的条数
            , curr: 1 //得到当前页，以便向服务端请求对应页的数据。
            , jump: function (obj) {}
        };
        getJszaList()
        function getJszaList() {
            getAjax('/bltsys/hmJsb/getJsbSfList', jsonParam, function (resultMsg) {
                getPage.count = resultMsg.data.count;
                laypage.render(getPage);
                var html =''
                if(resultMsg.data.list.length == 0 || resultMsg.data.list == undefined){
                    html += '<li>暂无数据</li>'
                }else{
                    $.each(resultMsg.data.list, function (i, item) {
                        item.num = jsonParam.pageNo*(resultMsg.data.list.length - i)
                        if(item.num < 10){
                            item.num = '0'+item.num
                        }
                        html+=' <li class="tit_mar clearfix" ids="'+item.id+'">' +
                            '<span class="bg_green font_d health_num fl">'+item.num+'</span>' +
                            '<div class="data_plan fl">' +
                            '<div class="a_gray font_e serialNum fontNum">'+item.tjbh+'</div>' +
                            '<div class="font_s l_gray fontNum">体检日期：<span class="jcrq">'+item.jcrq+'</span></div>' +
                            '</div>' +
                            '</li>'
                    })
                    tjId = resultMsg.data.list[0].id
                    tjRq = resultMsg.data.list[0].jcrq
                    scTjId = resultMsg.data.list[1].id
                }
                $(".health_list").html(html)
                $(".health_list li").eq(0).find(".serialNum").removeClass("a_gray").addClass("green");
            })
        }
        getPage.jump = function (obj) {
            jsonParam.pageSize = obj.limit;
            jsonParam.pageNo = obj.curr;
            getAjax('/jktj/jktjList', jsonParam, function (resultMsg) {
                var html =''
                if(resultMsg.data.list.length == 0 || resultMsg.data.list == undefined){
                    html += '<li>暂无数据</li>'
                }else{
                    $.each(resultMsg.data.list, function (i, item) {
                        item.num = jsonParam.pageNo*(resultMsg.data.list.length - i)
                        if(item.num < 10){
                            item.num = '0'+item.num
                        }
                        html+=' <li class="tit_mar clearfix">' +
                            '<span class="bg_green font_d health_num fl">'+item.num+'</span>' +
                            '<div class="data_plan fl">' +
                            '<div class="a_gray font_e serialNum fontNum">'+item.tjbh+'</div>' +
                            '<div class="font_s l_gray fontNum">体检日期：<span class="jcrq">'+item.jcrq+'</span></div>' +
                            '</div>' +
                            '</li>'
                    })
                    tjId = resultMsg.data.list[0].id
                    tjRq = resultMsg.data.list[0].jcrq
                    scTjId = resultMsg.data.list[1].id
                    getHealthDetails(tjId,tjRq)
                }
                $(".health_list").html(html)
                $(".health_list li").eq(0).find(".serialNum").removeClass("a_gray").addClass("green");
            })
        }
    })
})