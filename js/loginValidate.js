// var roadPath = 'http://192.168.1.81:8084'; // 田振
// var roadPath = 'http://192.168.1.80:8084'; // 张伟
// var roadPath = 'http://192.168.1.107:8084' //李念哲
// var roadPath = 'http://192.168.1.51:8084'; // 李家峰
// var roadPath = 'http://192.168.1.53:8084'; /// 皮雪平
// var roadPath = 'http://192.168.1.56:8089';
// var noLoghin = 'http://192.168.1.80:8084';
// var roadPath = 'http://192.168.1.78:8084';  //刘今
// var roadPath = 'http://192.168.1.248:8089';
// var roadPath = 'http://192.168.1.238:8084';
var roadPath = 'http://192.168.10.254:8010/hcplatform';

$(function () {
    layui.use('form', function(){});
    $('#loginBtn').click(function () {
        layui.use('layer', function(){
            var layer = layui.layer;
            layer.open({
                type: 2,
                title: ' ',
                // closeBtn: 2,
                skin: 'layui-layer-login', //样式类名
                shadeClose: true,
                shade: 0.2,
                area: ['560px', '530px'],
                content: 'login.html?type=login', //iframe的url
                fixed:false,
                top:10
                // success:function (layero, index) {
                //     var iframe = window['layui-layer-iframe' + index];
                //     console.log(iframe);
                //     iframe.childFun('我是父布局传到子布局的值')
                // }
            });
        });
    });

    //账号设置
    $('#setting').click(function () {
        window.location.href = 'personalData.html'
    });
    //退出系统
    $('#logout').click(function () {
        layui.use('layer', function () {
            var index = layer.confirm('确定退出？', {
                title: '提示',
                skin: 'layui-layer-login layui-layer-logout',
                btn: ['确定','取消'], //按钮
                fixed:false,
                top:10
            }, function(){
                getAjax('/login/exit',{clientIp: returnCitySN["cip"]},function (resultMsg) {
                    localStorage.removeItem('authTokenTreat');
                    // localStorage.setItem('phone', '');
                    localStorage.removeItem('name');
                    localStorage.removeItem('sfzh');
                    localStorage.removeItem('custormerUrl');
                    localStorage.removeItem('name2');
                    localStorage.removeItem('sfzh2');
                    localStorage.removeItem('custormerUrl2');
                    localStorage.removeItem('bankCardTypeName');
                    localStorage.removeItem('bankCardNumber');
                    localStorage.removeItem('userId');
                    localStorage.removeItem('jmid');
                    localStorage.removeItem('oldDf');
                    layer.close(index);
                    // 刷新父页面
                    parent.location.reload();
                });
            })
        });
    })
})
//封装过期控制代码
function set(key,value){
    var curTime = new Date().getTime();
    localStorage.setItem(key,JSON.stringify({data:value,time:curTime}));
}
function get(key,exp){
    var data = localStorage.getItem(key);
    if(data){
        var dataObj = JSON.parse(data);
        if (new Date().getTime() - dataObj.time>exp) {
            console.log('信息已过期');
            localStorage.setItem('authTokenTreat','')
        }else{
            var dataObjDatatoJson = dataObj.data
            return dataObjDatatoJson;
        }
    }
}

//设置cookie
function setCookie(cname, cvalue, exdays) {
    var d = new Date();
    d.setTime(d.getTime() + (exdays * 60 * 60 * 1000));
    var expires = "expires=" + d.toUTCString();
    document.cookie = cname + "=" + cvalue + ";path=/;" + expires;
}

//获取cookie
function getCookie(cname) {
    var name = cname + "=";
    var ca = document.cookie.split(';');
    for (var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') c = c.substring(1);
        if (c.indexOf(name) != -1) return c.substring(name.length, c.length);
    }
    return "";
}
//清除cookie  
function clearCookie(name) {
    setCookie(name, "", -1);
}

//操作cookie
function optionCookie(authorToke){
	if(authorToke != null && authorToke != '' && authorToke != undefined){
		clearCookie("author");
	    setCookie("author", authorToke, '1');
	}
}

// var authorCookie = localStorage.getItem('authTokenTreat');
var authorCookie = get('authTokenTreat','43200000')
console.log(authorCookie)
if(!authorCookie){
   singleLogin()
   function singleLogin() {
      var ip = returnCitySN["cip"]
      getAjax('/main/singleLogin', {clientIp: ip}, function (resultMsg) {
         console.log(resultMsg)
         if (resultMsg.retCode == 0) {
            if(resultMsg.data){
               var authToken = encrypt('benefit' + ',' + resultMsg.data.username + ',' + resultMsg.data.token + ',2');
               set('authTokenTreat',authToken)
               var authorCookie = get('authTokenTreat','43200000')
               console.log(authorCookie)
               window.location.reload();
            }
         }
      })
   }
}else{
   console.log(222)
}

// 公共ajax
function getAjax (url, jsonParam, success, fail) {
   layui.use([ 'layer'], function() {
      var loading = layui.layer.load();
      // jsonParam.authToken = localStorage.getItem('authTokenTreat');
      // console.log(jsonParam)
      $.ajax({
         url: roadPath + url,
         type: 'POST',
         dataType: 'json',
         // jsonp: "callback",//服务端用于接收
         contentType: 'application/json',
         async: false,
         data: JSON.stringify(jsonParam),
         beforeSend: function (XMLHttpRequest) {
            XMLHttpRequest.setRequestHeader("authToken", authorCookie);
            // layui.use('layer', function () {
            //     index = layer.load(1, {
            //         shade: [0.1,'#fff'] //0.1透明度的白色背景
            //     });
            // });
         },
         success: function (resultMsg) {
            if (resultMsg.retCode == 1003) {
               layui.layer.closeAll()
               $(".showLoading").css("opacity", '1')
               // 登录状态失效, 重新授权

               // 跳转登录页
               // parent.location.href = '../login.html';
               // denglu()
               //
               // return false;
            } else if (resultMsg.retCode == 0) {
               success && success(resultMsg);
               return false;
            }
            // else if (resultMsg.retCode == 10002) {
            //     fail && fail(resultMsg);
            // return false;
            // }
            else {
               fail && fail(resultMsg);
               layer.msg(resultMsg.retMsg)
               // layer.open({
               //     id: 'login',
               //     type: 1,
               //     title: '提示',
               //     skin: 'my-layui-layer', //样式类名
               //     area: ['360px', '180px'],
               //     shadeClose: true,
               //     shade: 0.2,
               //     content: '<div style="padding: 20px;">' + resultMsg.retMsg + '</div>', //iframe的url
               //     btn: ['关闭']
               // });
               return false;
            }
         },
         error: function (error, a, b) { // 请求失败处理
            console.log(error);
            console.log(a);
            console.log(b);
            // fail && fail(resultMsg.msg);
            // alert('后台走丢了');
         }
      });
      layui.layer.close(loading)
   })
}
// ajax上传文件流
function imgAjax (url, jsonParam, success, fail) {
    $.ajax({
        url: roadPath + url,
        type: 'POST',
        contentType: false,
        processData: false,
        data: jsonParam,
        beforeSend: function (XMLHttpRequest) {
            XMLHttpRequest.setRequestHeader("authToken", authorCookie);
        },
        success: function (resultMsg) {
            success && success(resultMsg);
        },
        error: function (error) { // 请求失败处理
            fail && fail(resultMsg.msg);
        }
    });
}
function getObjectURL (value) {
    if (value) {
        var url = null ;
        if (window.createObjectURL !== undefined) { // basic
            url = window.createObjectURL(value) ;
        } else if (window.URL!=undefined) { // mozilla(firefox)
            url = window.URL.createObjectURL(value) ;
        } else if (window.webkitURL!=undefined) { // webkit or chrome
            url = window.webkitURL.createObjectURL(value) ;
        }
        return url;
    }
}
// 地址栏取值
function GetQueryString(name) {
    var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)");
    var r = window.location.search.substr(1).match(reg);
    if(r!=null)return  unescape(r[2]); return null;
}
// input[type='file']监听函数
function PreviewImage(imgFile, bgdiv, leixing){
    //传递的参数：input当前对象
    //图片容器
    //图片宽度
    //图片高度（宽高不传：默认200x200）
    var base64 = new Base64(imgFile, $('.img-list'), 200, 200);
    // 定义方法
    var pattern = /(\.*.jpg$)|(\.*.png$)|(\.*.jpeg$)|(\.*.gif$)|(\.*.bmp$)/;
    if(!pattern.test(base64.imgFile.value)) {
        alert("请上传jpg/jpeg/png/gif/bmp格式的照片！");
        this.imgFile.focus();
    }
    if(document.all){
        //兼容IE
        ieBase64(base64.imgFile.value, $('.img-list'), 200, 200, bgdiv, leixing);
    }else{
        //兼容主流浏览器
        // console.log(base64.imgFile.files[0]);
        mainBase64(base64.imgFile.files[0], $('.img-list'), 200, 200, bgdiv, leixing);
    }
}

function ieBase64(file, ele, width, height, bgdiv, leixing){
    var realPath, xmlHttp, xml_dom, tmpNode, imgBase64Data;
    realPath = file;//获取文件的真实本地路径.
    xmlHttp = new ActiveXObject("MSXML2.XMLHTTP");
    // debugger;
    xmlHttp.open("POST",realPath, false);
    xmlHttp.send("");
    xml_dom = new ActiveXObject("MSXML2.DOMDocument");
    tmpNode = xml_dom.createElement("tmpNode");
    tmpNode.dataType = "bin.base64";
    tmpNode.nodeTypedValue = xmlHttp.responseBody;
    imgBase64Data = "data:image/bmp;base64," + tmpNode.text.replace(/\n/g,"");
    getAjaxImg(imgBase64Data, bgdiv, leixing)
}
function mainBase64(file, ele, width, height, bgdiv, leixing){
    var fileReader;
    var urls;
    fileReader = new FileReader();
    fileReader.readAsDataURL(file);
    fileReader.onload = function () {
        urls = this.result;
        getAjaxImg(urls, bgdiv, leixing)
    }
}
var index;
function getAjaxImg(imgBase64Data, bgdiv, leixing) {
    $.ajax({
        type : "get",
        async: false,
        url : "http://192.168.10.254:8010/hcplatform//commontools/saveImage",
        //url : "http://192.168.1.81:8082/login/oauth",
        data:{"fileData":imgBase64Data},
        dataType : "jsonp",//数据类型为jsonp
        jsonp: "callback",//服务端用于接收callback调用的function名的参数
        beforeSend:function(){
            layui.use('layer', function () {
                index = layer.load(1, {
                    shade: [0.1,'#000'] //0.1透明度的白色背景
                });
            });
        },
        success : function(data){
            // var str = data.data;
            // var newStr = str.slice(0,5)+'//'+str.slice(5,str.length)
            // console.log(newStr)
            if (leixing == 'bg') {
                setTimeout(function () {
                    $(bgdiv).css('background-image', 'url("' + data.data + '")');
                    $(bgdiv).next('input').next('input').val(data.data);
                    layer.close(index);
                },1000);
            }else if(leixing == 'img'){
                setTimeout(function () {
                    // $(bgdiv).attr("src", data.data) ;
                    $(bgdiv).html('<img src="'+data.data+'" >');
                    layer.close(index);
                },1000);
            }
        },
        error:function(data){
            alert('fail');
        }
    });
}
// 删除数组元素
function delArr (arr, item) {
    $.each(arr, function (i, arrItem) {
        if (item == arrItem) {
            arr.splice(i, 1);
        }
    });
}

// 身份证号取年龄、生日、性别

function IdCard (UUserCard,num){
    if (num == 1) {
        //获取出生日期
        var birth = UUserCard.substring(6, 10) + '-' + UUserCard.substring(10, 12) + '-' + UUserCard.substring(12, 14);
        return birth;
    }
    if (num == 2) {
        //获取性别
        if (parseInt(UUserCard.substr(16, 1)) % 2 == 1) {
            return "男";
        } else {
            return "女";
        }
    }
    if (num == 3) {
        //获取年龄
        var myDate = new Date();
        var month = myDate.getMonth() + 1;
        var day = myDate.getDate();
        var age = myDate.getFullYear() - UUserCard.substring(6, 10) - 1;
        if (UUserCard.substring(10, 12) < month || UUserCard.substring(10, 12) == month && UUserCard.substring(12, 14) <= day) {
            age++;
        }
        return age;
    }
}
$(window.parent.document).find("#mainIframe").load(function () {
    var main = $(window.parent.document).find("#mainIframe");
    var thisheight = $(document).height() - 25;
    main.height(thisheight);
});

function denglu () {
    layui.use('layer', function(){
        var layer = layui.layer;
        layer.open({
            // id: 'other',
            type: 2,
            title: ' ',
            // closeBtn: 0,
            skin: 'layui-layer-login', //样式类名
            shadeClose: true,
            shade: 0.2,
            area: ['560px', '530px'],
            content: 'login.html?type=login', //iframe的url
            fixed:false,
            top:10
        });
    });
}
var loginArr=['residentBasicInfo.html','TCMHealthManage.html','oldPeopleSelf.html','doubleReferral.html','checkReport.html','followUpService.html',
    'inspectionReport.html','healthForm.html','contractProtocal.html','contractProtocalDetails.html','vaccination.html','vaccineReference.html','outpatientInformation.html',
    'contractSigning.html','inHospitalInfo.html','contractSigning.html','changePassword.html','personalData.html','personContacts.html'];
function isInArray(arr,value){
    for(var i = 0; i < arr.length; i++){
        if(value === arr[i]){
            return true;
        }
    }
    return false;
}

function encrypt(word){
    var key = CryptoJS.enc.Utf8.parse("BhZ+FDMne1+xfU7kIihiLHd-EtXwYiKE");
    var srcs = CryptoJS.enc.Utf8.parse(word);
    var encrypted = CryptoJS.AES.encrypt(srcs, key, {mode:CryptoJS.mode.ECB,padding: CryptoJS.pad.Pkcs7});
    return encrypted.toString();
}

//验证超时登录和单点登录
function verifyLogin (success, fail) {
    $.ajax({
        type: 'POST',
        dataType: "json",
        async: false,
        contentType: 'application/json',
        url: roadPath +  '/sys/customer/getLoginInfo',
        data: {},
        beforeSend: function (XMLHttpRequest) {
            XMLHttpRequest.setRequestHeader("authToken", authorCookie);
        },
        success: function (resultMsg) {
            if (resultMsg.retCode == 0) {
                success && success(resultMsg);
                return false;
            } else if (resultMsg.retCode == 1003) {
                if(localStorage.getItem('authTokenTreat')){
                    $('.weilogin').show();
                    $('.yilogin').hide();
                    layer.confirm('您已登录超时，请重新登录！', {
                        title: '提示',
                        skin: 'layui-layer-login layui-layer-logout',
                        btn: ['确定','取消'], //按钮
                        fixed:false,
                        top:10,
                    }, function(index){
                        layer.close(index);
                        denglu()
                    });
                }else{
                    denglu()
                }
            }else if(resultMsg.retCode == 1006){
                $('.weilogin').show();
                $('.yilogin').hide();
                layer.confirm('您的账号在另一地点登录，您已被迫下线', {
                    title: '提示',
                    skin: 'layui-layer-login layui-layer-logout',
                    btn: ['确定','取消'], //按钮
                    fixed:false,
                    top:10,
                }, function(index){
                    layer.close(index);
                    denglu()
                });
            }
        },
        error: function (XMLHttpRequest, textStatus, errorThrown) {
            console.log(XMLHttpRequest);
            console.log(textStatus);
            console.log(errorThrown);
            alert('加载资源失败');
        }
    });
}

//登录预约挂号网站
function goAppointmentDoctor() {
    $.ajax({
        type: 'POST',
        dataType: "json",
        async: false,
        contentType: 'application/json',
        url: roadPath +  '/sys/customer/getLoginInfo',
        data: {},
        beforeSend: function (XMLHttpRequest) {
            XMLHttpRequest.setRequestHeader("authToken", authorCookie);
        },
        success: function (resultMsg) {
            var _window=window;
            if (resultMsg.retCode == 0) {
                getAjax('/healthdoctor/appoint/oauth',{},function (resultMsg) {
                    var authToken = encrypt('appointment' + ',' + localStorage.getItem('phone') + ',' + resultMsg.data);
                    _window.open('http://192.168.10.254:8010/appointmentDoctor/page/index.html?token='+authToken+'&type=1','_blank');
                })
            } else{
                window.open('http://192.168.10.254:8010/appointmentDoctor/page/index.html','_blank')
            }
        },
        error: function (XMLHttpRequest, textStatus, errorThrown) {
            console.log(XMLHttpRequest);
            console.log(textStatus);
            console.log(errorThrown);
            alert('加载资源失败');
        }
    });
}