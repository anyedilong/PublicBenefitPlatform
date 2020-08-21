$(function () {
    getDate();
    function getDate() {
        var date = new Date();
        var month = date.getMonth();
        var day = date.getDate();
        month = month + 1;
        if (month < 10) month = "0" + month;
        if (day < 10) day = "0" + day;
        $('#n_month').html(month);
        $('#n_date').html(day);
    }
    // 联动下拉列表
    layui.use(['carousel','form','element'], function(){
        var form = layui.form;
        var carousel = layui.carousel;
        var element = layui.element;
        // 获取滚动消息
        function getNewsList(){
            getAjax('/system/front/getNewsPage',{status:'4'},function (resultMsg) {
                if(resultMsg.data.list.length != 0){
                    var dataList = resultMsg.data.list;
                    var str = '';
                    str += '<div carousel-item="">';
                    $.each(dataList,function (i, item) {
                        str += '    <a class="a_gray" href="systemInfoDet.html?id='+item.id+'">'+item.synopsis +'</a>';
                    });
                    str += '</div>';
                    $('#test1').html(str);
                    carousel.render({
                        elem: '#test1'
                        ,anim:'fade'
                        ,width:'80%'
                        ,height: '30px'
                        ,arrow:'none'
                        ,indicator:'none'
                    });
                }else{
                    $('.n_box').hide();
                }
            });
        }
        getNewsList();
        //获取政策法规列表
        function getPolicyList(){
            var jsonParam = {
                pageSize:'6',
                pageNo:'1',
                // status:'3'
            };
            getAjax('/sys/policy/getPolicyPage',jsonParam,function (resultMsg) {
                if(resultMsg.data.list.length == 0){
                    $('#zcfgList').html('<div style="padding: 10px 40px;">暂无数据</div>');
                    $('#viewZc').hide();
                }else{
                    var dataList = resultMsg.data.list;
                    var str = '';
                    $.each(dataList,function (i, item) {
                        if(item.policyTitle.length>20){
                            item.policyTitle = item.policyTitle.slice(0,20) + '...';
                        }
                        str += '<li>';
                        str += '    <a href="policyInfo.html?id='+item.id+'" class="a_gray">';
                        str += '        <span class="index_dian"></span>';
                        str += '        '+item.policyTitle+'';
                        str += '        <span class="fr l_gray">'+item.pubTime+'</span>';
                        str += '    </a>';
                        str += '</li>'
                    });
                    $('#zcfgList').html(str);
                }
            });
        }
        getPolicyList();
        //获取置顶政策法规
        function getZDPolicyList(){
            var jsonParam = {
                pageSize:'6',
                pageNo:'1',
                status:'4'
            };
            getAjax('/sys/policy/getPolicyPage',jsonParam,function (resultMsg) {
                if(resultMsg.data.list){
                    var dataList = resultMsg.data.list;
                    var str = '';
                    $.each(dataList,function (i, item) {
                        if(item.policyTitle.length>20){
                            item.policyTitle = item.policyTitle.slice(0,20) + '...';
                        }
                        str += '<img src="'+item.policyUrl+'" class="marginb_10" alt="暂无图片">\n' +
                            '                        <div class="zc_title marginb_10"><a href="policyInfo.html?id='+item.id+'" class="a_gray">'+item.policyTitle+'</a></div>'+
                            '                        <div class="zc_des gray" id="zcOneDes">'+item.pubTime+'</div>';

                    });
                    $('#zcfgzd').html(str);
                }
            });
        }
        getZDPolicyList();
        //获取健康资讯类别
        var zxId = '';
        function getHealthType(){
            getAjax('/lb/getNewsCategoryList',{},function (resultMsg) {
                if(resultMsg.data){
                    var dataList = resultMsg.data;
                    var str = '';
                    $.each(dataList,function (i, item) {
                        str += '<li id="'+item.id+'" status="'+item.status+'">'+item.name+'</li>';
                    });
                    $('#zxTab').html(str);
                    $('#zxTab li:first-child').addClass('active');
                    //获取健康资讯列表
                    zxId = $('#zxTab li:first-child').attr('id');
                    getHealthList(zxId);
                }
            });
        }
        function getHealthList(ids) {
            var jsonParam = {
                pageSize:'6',
                pageNo:'1',
                newsCatId:ids,
            };
            var str = '';
            getAjax('/lb/getNewsHealthPage',jsonParam,function (resultMsg) {
                if(resultMsg.data.list.length == 0){
                    $('#zxList').html('<div style="padding: 10px 40px;">暂无数据</div>');
                    $('#viewZx').hide();
                }else{
                    var dataList = resultMsg.data.list;
                    $.each(dataList,function (i, item) {
                        if(item.newsTitle.length>20){
                            item.newsTitle = item.newsTitle.slice(0,20) + '...';
                        }
                        str += '<li>';
                        str += '    <a href="healthNewsDetails.html?id='+item.id+'" class="a_gray">';
                        str += '        <span class="index_dian"></span>';
                        str += '        '+item.newsTitle+'';
                        str += '        <span class="fr l_gray">'+item.pubTime+'</span>';
                        str += '    </a>';
                        str += '</li>'
                    });
                    $('#zxList').html(str);
                    $('#viewZx').show();
                }
            });
        }
        getHealthType();
        //切换健康资讯
        $('#zxTab').on('click','li',function () {
            $(this).addClass('active').siblings().removeClass('active');
            var id = $(this).attr('id');
            getHealthList(id);
        });
        //获取置顶资讯
        getZDNews();
        function getZDNews(){
            getAjax('/lb/getNewsHealthPage',{status:6},function (resultMsg) {
                if(resultMsg.data){
                    var str2 = '';
                    $.each(resultMsg.data.list,function (i, item2) {
                        if(item2.newsTitle.length>20){
                            item2.newsTitle = item2.newsTitle.slice(0,20) + '...';
                        }
                        str2 += '<div>';
                        str2 += '    <img src="'+item2.newsUrl+'" class="marginb_10" alt="暂无图片">';
                        str2 += '    <div class="zc_title marginb_10 text_one"><a href="healthNewsDetails.html?id='+item2.id+'" class="a_gray">'+item2.newsTitle+'</a></div>';
                        str2 += '        <div class="zc_des gray">';
                        str2 += '        '+item2.pubTime+'';
                        str2 += '    </div>';
                        str2 += '</div>'
                    });
                    $('#zxCarousel').html(str2);
                    carousel.render({
                        elem: '#test3'
                        ,arrow:'none'
                        // ,interval: 1800
                        ,anim: 'fade'
                        ,width:'100%'
                        ,height: '380px'
                    });
                }
            });
        }
        //查看更多
        $('#viewZx').click(function () {
            var i = $('#zxTab li.active').index();
            window.location.href = 'healthNews.html?Indexes=' + i;
        });
        //获取办事指南列表
        getGuideType();
        function getGuideType() {
            getAjax('/guidecat/getGuideCategoryList',{},function (resultMsg) {
                if(resultMsg.data){
                    var str = '';
                    $.each(resultMsg.data,function (i, item) {
                        str += '<div class="layui-col-md4">'+
                                '<img src="'+item.imageUrl+'" class="zn_img">'+
                                '<div class="zn_news">';
                        var jsonParam = {
                            pageSize:'2',
                            pageNo:'1',
                            guideType:item.id
                        };
                        getAjax('/guide/getGuidePage',jsonParam,function (resultMsg) {
                            if(resultMsg.data.list){
                                $.each(resultMsg.data.list,function (i, item2) {
                                    str += '<p class="text_one" title="'+item2.title+'"><a href="guideList.html?orders='+item.id+'" class="a_gray">'+item2.title+'</a></p>';
                                });
                            }
                        });
                        str +='</div>'+
                            '</div>';
                    });
                    $('#guideList').html(str);
                }
            });
        }
        //获取友情链接
        function getLinkList(){
            getAjax('/sys/links/getLinksPage',{},function (resultMsg) {
                if(resultMsg.data.list){
                    var dataList = resultMsg.data.list;
                    var str = '';
                    $.each(dataList,function (i, item) {
                        str += '<div class=\'link-cord\'>';
                        str += '    <a href="'+item.linkUrl+'" target="_blank" class="b_gray">'+item.name+'</a>';
                        str += '</div>'
                    });
                    $('#linkurl').html(str);
                }
            });
        }
        getLinkList();
        // 获取平台信息
        function getPlatformInfo(){
            getAjax('/web/xq',{},function (resultMsg) {
                $('.leftTop').html(resultMsg.data.welcomeContent);
                $('#logoImg').attr('src',resultMsg.data.logo)
            });
        }
        getPlatformInfo();
        var jsonParam = {
            sfzh: localStorage.getItem("sfzh"),
            pageNo: 1,
            pageSize:'10'
        };
        $('#yygh1').click(function () {
            goAppointmentDoctor();
        });
        //体检表
        $('#tjb1').click(function () {
            verifyLogin(function () {
                jsonParam.jmId=localStorage.getItem("jmid");
                getAjax('/jktj/jktjList', jsonParam, function (resultMsg) {
                    if(resultMsg.data.list.length == 0){
                        layer.msg('您暂时没有健康体检数据！')
                    }else{
                        window.location.href = 'healthForm.html';
                    }
                })
            })
        });
        //检查报告
        $('#jcbg1').click(function () {
            verifyLogin(function () {
                getAjax('/region/outpatient/getJcList', jsonParam, function (resultMsg) {
                    if(resultMsg.data.list.length == 0){
                        layer.msg('您暂时没有检查报告数据！')
                    }else{
                        window.location.href = 'checkReport.html';
                    }
                })
            })
        });
        //检验报告
        $('#jybg1').click(function () {
            verifyLogin(function () {
                getAjax('/region/outpatient/getJyList', jsonParam, function (resultMsg) {
                    if(resultMsg.data.list.length == 0){
                        layer.msg('您暂时没有检验报告数据！')
                    }else{
                        window.location.href = 'inspectionReport.html';
                    }
                })
            })
        });
        //更多功能
        $('#gdgn1').click(function () {
            window.location.href = 'convenientService.html';
        });
        function encrypt (word){
            var key = CryptoJS.enc.Utf8.parse("BhZ+FDMne1+xfU7kIihiLHd-EtXwYiKE");
            var srcs = CryptoJS.enc.Utf8.parse(word);
            var encrypted = CryptoJS.AES.encrypt(srcs, key, {mode:CryptoJS.mode.ECB,padding: CryptoJS.pad.Pkcs7});
            return encrypted.toString();
        }
    });
});