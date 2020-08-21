$(function () {
    var pageObj = {
        0: ['index.html'],
        1: ['policy.html','policyInfo.html'],
        2: ['healthNews.html','healthNewsDetails.html'],
        3: ['convenientService.html','residentBasicInfo.html','TCMHealthManage.html','oldPeopleSelf.html','doubleReferral.html','checkReport.html','followUpService.html',
            'inspectionReport.html','healthForm.html','contractProtocal.html','contractProtocalDetails.html','vaccination.html','vaccineReference.html','outpatientInformation.html',
        'contractSigning.html','inHospitalInfo.html'],
        4: ['guideList.html','guideDetails.html']
    };
    $('.headinp-tab li').eq(0).addClass('inp-liact');
    $('.headinp-tab li').click(function () {
        $('.headinp-tab li').removeClass('inp-liact');
        $(this).addClass('inp-liact');
    });
    $(document).ready(function () {
        layui.use('layer', function() {
        var urlArr = window.location.href.split('/');
        var urls = urlArr[urlArr.length - 1];
        var urlStr = '';
        for (var key in pageObj) {
            if (urls.indexOf('?') > -1) {
                urlStr = urls.substring(0, urls.indexOf('?'));
            } else {
                urlStr = urls;
            }
            if (pageObj[key].join(',').indexOf(urlStr) > -1) {
                $('.headTab-ul li').removeClass('tab-liact');
                $('.headTab-ul li').eq(key).addClass('tab-liact');
            }
        }
        //验证登录
        getuserInfo();
        function getuserInfo() {
            var urls = location.pathname.match('[^/]+(?!.*/)')[0];
            layui.use('layer', function() {
                var layer = layui.layer;
                $.ajax({
                    url: roadPath + '/sys/customer/getLoginInfo',
                    type: 'POST',
                    dataType: 'json',
                    // jsonp: "callback",//服务端用于接收
                    contentType: 'application/json',
                    async: false,
                    data: {},
                    beforeSend: function (XMLHttpRequest) {
                        XMLHttpRequest.setRequestHeader("authToken", parent.authorCookie);
                    },
                    success: function (resultMsg) {
                        if (resultMsg.retCode == 1003) {
                            if(isInArray(parent.loginArr,urls)){
                                if(localStorage.getItem('authTokenTreat')){
                                    $('.weilogin').show();
                                    $('.yilogin').hide();
                                    layer.confirm('您已登录超时，请重新登录！', {
                                        title: '提示',
                                        skin: 'layui-layer-login layui-layer-logout',
                                        btn: ['确定','取消'], //按钮
                                        fixed:false,
                                        top:10,
                                        cancel: function(index, layero){
                                            window.location.href = 'index.html'
                                        }
                                    }, function(index){
                                        layer.close(index);
                                        denglu()
                                    },function () {
                                        window.location.href = 'index.html'
                                    });
                                }else{
                                    window.location.href = 'index.html'
                                }
                            }else{
                                $('.weilogin').show();
                                $('.yilogin').hide();
                            }
                        } else
                        if (resultMsg.retCode == 0) {
                            $('.weilogin').hide();
                            $('.yilogin').show();
                            localStorage.setItem("sfzh2",resultMsg.data.sfzh);
                            localStorage.setItem("name2",resultMsg.data.name);
                            localStorage.setItem("custormerUrl2",resultMsg.data.custormerUrl);
                            localStorage.setItem("userId",resultMsg.data.id);
                            localStorage.setItem("bankCardTypeName",resultMsg.data.bankCardTypeName);
                            localStorage.setItem("bankCardNumber",resultMsg.data.bankCardNumber);
                            $('.yilogin .username').html(localStorage.getItem("name"));
                            $('#top_uname').html(localStorage.getItem("name2"));

                            var custormerUrl = localStorage.getItem('custormerUrl2');
                            if(custormerUrl != ''){
                                $('.rz_top .myFlex>img').attr('src',custormerUrl);
                                $('#uploadImgXiao').attr('src',custormerUrl);
                                $('#uploadImg').attr('src',custormerUrl);
                            }else{
                                $('.rz_top .myFlex>img').attr('src','../img/photo.png');
                                $('#uploadImgXiao').attr('src','../img/photo.png');
                                $('#uploadImg').attr('src','../img/photo.png');
                            }
                            var custormerUrl2 = localStorage.getItem('custormerUrl');
                            if(custormerUrl2 == 'null'){
                                custormerUrl2 = '';
                            }
                            if(custormerUrl2 != ''){
                                $('.yilogin>img').attr('src',custormerUrl)
                            }else{
                                $('.yilogin>img').attr('src','../img/photo.png')
                            }
                            //获取登录者的联系人
                            getLoginCutormerList();
                            //获取居民id
                            getJmid();
                            return false;
                        }else {
                            // layer.msg(resultMsg.retMsg);
                            if(isInArray(parent.loginArr,urls)){
                                window.location.href = 'index.html'
                            }
                            return false;
                        }
                    },
                    error: function (error,a,b) { // 请求失败处理
                        console.log(error);
                        console.log(a);
                        console.log(b);
                        // fail && fail(resultMsg.msg);
                        // alert('后台走丢了');
                    }
                });
            })
        }

        function getLoginCutormerList(){
            getAjax('/sys/customer/getLoginCutormerList',{},function (resultMsg) {
                var html = '';
                if(resultMsg.data.length == 0 || resultMsg.data.length == 1){
                    $('.login-customer').hide();
                }else{
                    $.each(resultMsg.data,function (i, item) {
                        if(item.sfzh == localStorage.getItem('sfzh')){
                            html += '<li class="login-li active" sfzhs="'+item.sfzh+'" phones="'+item.phone+'" names="'+item.name+'" custormerUrls="'+item.custormerUrl+'">'+item.name+'</li>'
                        }else{
                            html += '<li class="login-li" sfzhs="'+item.sfzh+'" phones="'+item.phone+'" names="'+item.name+'" custormerUrls="'+item.custormerUrl+'">'+item.name+'</li>'
                        }
                    });
                    $('.login-customer').html(html);
                    $('.login-customer').show();
                }
            });
        }

        $('.login-customer').on('click','li',function () {
            localStorage.setItem('sfzh',$(this).attr('sfzhs'));
            localStorage.setItem('name',$(this).attr('names'));
            localStorage.setItem('custormerUrl',$(this).attr('custormerUrls'));
            $(this).addClass('active').siblings().removeClass('active');
            if($(this).attr('sfzhs') == localStorage.getItem('sfzh2')){
                localStorage.setItem('custormerUrl',localStorage.getItem('custormerUrl2'));
            }else{
                localStorage.setItem('custormerUrl','');
            }
            //获取jmid
            getJmid();
            window.location.href='convenientService.html';
        })
        })
    });
    $('.headTab-ul li').click(function () {
        var index = $(this).index();
        $('.headTab-ul li').removeClass('tab-liact');
        $(this).addClass('tab-liact');
        window.location.href = pageObj[index][0];
    });
    $('#searchBtn').click(function () {
        var searchInputVal =  $('#searchInp').val().replace(/\s/g, '');
        var searchSelVal = $('#searchSel').val();
        if(searchInputVal){
            if(searchInputVal.length>15){
                layer.msg('搜索内容最多只能输入15个字符！', {
                    time: 1000
                });
            }else{
                localStorage.setItem('searchInputVal', searchInputVal);
                localStorage.setItem('searchSelVal', searchSelVal);
                window.location.href = 'popularSearch.html?searchType=' +
                    searchSelVal + '&searchVal=' + searchInputVal;
            }
        }
    });

    function getJmid(){
        getAjax('/health/archive/getArchiveDetailBySfzh', {sfzh: localStorage.getItem('sfzh')}, function (resultMsg) {
            if(resultMsg.data){
                localStorage.setItem('jmid',resultMsg.data.id)
            }else{
               localStorage.setItem('jmid','0')
            }
        })
    }
});