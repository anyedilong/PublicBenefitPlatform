$(function(){
   $("#name").text(localStorage.getItem('name'))
   layui.use(['laydate', 'laypage', 'layer', 'table'], function() {
      var laydate = layui.laydate;
      var table = layui.table;
      var laypage = layui.laypage
         ,layer = layui.layer;
      var hosPage = {
         elem: 'getPage'
         , count: 100
         , layout: ['prev', 'next']
         , limit: 10  //得到每页显示的条数
         , curr: 1 //得到当前页，以便向服务端请求对应页的数据。
         , jump: function (obj) {
         }
      };
      var myDate = new Date();
      $("#getDate").val(myDate.getFullYear())
      //年选择器
      // lay('#getDate').on('click', function(e) { //假设 test1 是一个按钮
      $("#getDate").click(function () {
         $(".iconJ").addClass("iconTrans")
      })
      laydate.render({
         elem: '#getDate',
         type: 'year',
         btns: ['now','confirm'],
         max: getNowFormatDate(),
         done: function (value, dates, edate) {
            $(".iconJ").removeClass("iconTrans");
            jsonParam.searchTime=value;
            getList();
         }
      });
      function getNowFormatDate() {
         var date = new Date();
         var seperator1 = "-";
         var seperator2 = ":";
         var month = date.getMonth() + 1;
         var strDate = date.getDate();
         if (month >= 1 && month <= 9) {
            month = "0" + month;
         }
         if (strDate >= 0 && strDate <= 9) {
            strDate = "0" + strDate;
         }
         var currentdate = date.getFullYear() + seperator1 + month + seperator1 + strDate
            + " " + date.getHours() + seperator2 + date.getMinutes()
            + seperator2 + date.getSeconds();
         return currentdate;
      }
      // 记录
      var jsonParam = {
         // sfzh: '370784201812244056',
         // sfzh: localStorage.getItem("sfzh"),
         jmid:localStorage.getItem('jmid'),
         pageNo: 1,
         pageSize :10,
         searchTime: $("#getDate").val()
      }
      $(".health_list").on("click","li",function () {
         $(this).find(".serialNum").removeClass("a_gray").addClass("green")
         $(this).siblings().find(".serialNum").removeClass("green").addClass("a_gray")
         getDetails($(this).attr("ids"),$(this).attr("stage"))
      })
      getList()
      function getList() {
         getAjax('/health/follow/getEtList', jsonParam, function (resultMsg) {
            hosPage.count = resultMsg.data.count;
            laypage.render(hosPage);
            var html = ''
            if(resultMsg.data){
               if (resultMsg.data.length == 0 || resultMsg.data == undefined) {
                  html += '<li>暂无数据</li>'
               } else {
                  $.each(resultMsg.data, function (i, item) {
                     item.num = jsonParam.pageNo * (resultMsg.data.length - i)
                     if (item.num < 10) {
                        item.num = '0' + item.num
                     }
                     html+='<li class="myFlex tit_mar" ids="'+item.id+'" stage="'+item.stage+'">' +
                        '<span class="bg_lightgreen font_d health_num">'+item.num+'</span>' +
                        '<div class="data_plan">';
                     if(item.stage === "0"){
                        html+='<div class="font_e serialNum">新生儿家庭访视记录表</div>' ;
                     }else if(item.stage === "1"){
                        item.name = '满月儿童'
                        html+='<div class="font_e serialNum">满月儿童健康检查记录表</div>' ;
                     }else if(item.stage === "2"){
                        item.name = '3月龄儿童'
                        html+='<div class="font_e serialNum">3月龄儿童健康检查记录表</div>' ;
                     }else if(item.stage === "3"){
                        item.name = '6月龄儿童'
                        html+='<div class="font_e serialNum">6月龄儿童健康检查记录表</div>' ;
                     }else if(item.stage === "4"){
                        item.name = '8月龄儿童'
                        html+='<div class="font_e serialNum">8月龄儿童健康检查记录表</div>' ;
                     }else if(item.stage === "5"){
                        item.name = '12月龄儿童'
                        html+='<div class="font_e serialNum">12月龄儿童健康检查记录表</div>' ;
                     }else if(item.stage === "6"){
                        item.name = '18月龄儿童'
                        html+='<div class="font_e serialNum">18月龄儿童健康检查记录表</div>' ;
                     }else if(item.stage === "7"){
                        item.name = '24月龄儿童'
                        html+='<div class="font_e serialNum">24月龄儿童健康检查记录表</div>' ;
                     }else if(item.stage === "8"){
                        item.name = '30月龄儿童'
                        html+='<div class="font_e serialNum">30月龄儿童健康检查记录表</div>' ;
                     }else if(item.stage === "9"){
                        item.name = '3岁儿童'
                        html+='<div class="font_e serialNum">3岁儿童健康检查记录表</div>' ;
                     }else if(item.stage === "10"){
                        item.name = '4岁儿童'
                        html+='<div class="font_e serialNum">4岁儿童健康检查记录表</div>' ;
                     }else if(item.stage === "11"){
                        item.name = '5岁儿童'
                        html+='<div class= font_e serialNum">5岁儿童健康检查记录表</div>' ;
                     }else if(item.stage === "12"){
                        item.name = '6岁儿童'
                        html+='<div class="font_e serialNum">6岁儿童健康检查记录表</div>' ;
                     }else if(item.stage === "13"){
                        item.name = '6月龄儿童中医药'
                        html+='<div class="font_e serialNum">6月龄儿童中医药</div>' ;
                     }else if(item.stage === "14"){
                        item.name = '12月龄儿童中医药'
                        html+='<div class="font_e serialNum">12月龄儿童中医药</div>' ;
                     }else if(item.stage === "15"){
                        item.name = '18月龄儿童中医药'
                        html+='<div class="font_e serialNum">18月龄儿童中医药</div>' ;
                     }else if(item.stage === "16"){
                        item.name = '24月龄儿童中医药'
                        html+='<div class="font_e serialNum">24月龄儿童中医药</div>' ;
                     }else if(item.stage === "17"){
                        item.name = '30月龄儿童中医药'
                        html+='<div class="font_e serialNum">30月龄儿童中医药</div>' ;
                     }else if(item.stage === "18"){
                        item.name = '36月龄儿童中医药'
                        html+='<div class="font_e serialNum">36月龄儿童中医药</div>' ;
                     }
                     // if(item.stage === '0'){
                     //    html+='<div class="green font_e serialNum">新生儿家庭访视记录表</div>' ;
                     // }else if(item.stage === '1' || item.stage === '2' || item.stage === '3' || item.stage === '4'){
                     //    html+='<div class="green font_e serialNum">1-8月龄儿童健康检查记录表</div>' ;
                     // }else if(item.stage === '5' || item.stage === '6' || item.stage === '7' || item.stage === '8'){
                     //    html+='<div class="green font_e serialNum">12-30月龄儿童健康检查记录表</div>' ;
                     // }else if(item.stage === '9' || item.stage === '10' || item.stage === '11' || item.stage === '12'){
                     //    html+='<div class="green font_e serialNum">3～6岁儿童健康检查记录表</div>' ;
                     // }else if(item.stage === '13' || item.stage === '14' || item.stage === '15' || item.stage === '16' || item.stage === '17' || item.stage === '18'){
                     //    html+='<div class="green font_e serialNum">中医药健康服务记录表</div>' ;
                     // }
                     html +='<div class="font_s l_gray">随访日期：'+item.sfrq+'</div>' +
                        '</div>' +
                        '</li>'
                  })
                  getDetails(resultMsg.data[0].id,resultMsg.data[0].stage)
               }
            }
            $(".health_list").html(html)
            $(".health_list li").eq(0).find(".serialNum").removeClass("a_gray").addClass("green");
         })
      }
      hosPage.jump = function (obj) {
         jsonParam.pageSize = obj.limit;
         jsonParam.pageNo = obj.curr;
         getAjax('/health/follow/getEtList', jsonParam, function (resultMsg) {
            var html =''
            if(resultMsg.data){
               if(resultMsg.data.length == 0 || resultMsg.data == undefined){
                  html += '<li>暂无数据</li>'
               }else{
                  $.each(resultMsg.data, function (i, item) {
                     item.num = jsonParam.pageNo*(resultMsg.data.length - i)
                     if(item.num < 10){
                        item.num = '0'+item.num
                     }
                     html+='<li class="myFlex tit_mar" ids="'+item.id+'" stage="'+item.stage+'">' +
                        '<span class="bg_lightgreen font_d health_num">'+item.num+'</span>' +
                        '<div class="data_plan">';
                     if(item.stage === "0"){
                        html+='<div class="font_e serialNum">新生儿家庭访视记录表</div>' ;
                     }else if(item.stage === "1"){
                        item.name = '满月儿童'
                        html+='<div class="font_e serialNum">满月儿童健康检查记录表</div>' ;
                     }else if(item.stage === "2"){
                        item.name = '3月龄儿童'
                        html+='<div class="font_e serialNum">3月龄儿童健康检查记录表</div>' ;
                     }else if(item.stage === "3"){
                        item.name = '6月龄儿童'
                        html+='<div class="font_e serialNum">6月龄儿童健康检查记录表</div>' ;
                     }else if(item.stage === "4"){
                        item.name = '8月龄儿童'
                        html+='<div class="font_e serialNum">8月龄儿童健康检查记录表</div>' ;
                     }else if(item.stage === "5"){
                        item.name = '12月龄儿童'
                        html+='<div class="font_e serialNum">12月龄儿童健康检查记录表</div>' ;
                     }else if(item.stage === "6"){
                        item.name = '18月龄儿童'
                        html+='<div class="font_e serialNum">18月龄儿童健康检查记录表</div>' ;
                     }else if(item.stage === "7"){
                        item.name = '24月龄儿童'
                        html+='<div class="font_e serialNum">24月龄儿童健康检查记录表</div>' ;
                     }else if(item.stage === "8"){
                        item.name = '30月龄儿童'
                        html+='<div class="font_e serialNum">30月龄儿童健康检查记录表</div>' ;
                     }else if(item.stage === "9"){
                        item.name = '3岁儿童'
                        html+='<div class="font_e serialNum">3岁儿童健康检查记录表</div>' ;
                     }else if(item.stage === "10"){
                        item.name = '4岁儿童'
                        html+='<div class="font_e serialNum">4岁儿童健康检查记录表</div>' ;
                     }else if(item.stage === "11"){
                        item.name = '5岁儿童'
                        html+='<div class= font_e serialNum">5岁儿童健康检查记录表</div>' ;
                     }else if(item.stage === "12"){
                        item.name = '6岁儿童'
                        html+='<div class="font_e serialNum">6岁儿童健康检查记录表</div>' ;
                     }else if(item.stage === "13"){
                        item.name = '6月龄儿童中医药'
                        html+='<div class="font_e serialNum">6月龄儿童中医药</div>' ;
                     }else if(item.stage === "14"){
                        item.name = '12月龄儿童中医药'
                        html+='<div class="font_e serialNum">12月龄儿童中医药</div>' ;
                     }else if(item.stage === "15"){
                        item.name = '18月龄儿童中医药'
                        html+='<div class="font_e serialNum">18月龄儿童中医药</div>' ;
                     }else if(item.stage === "16"){
                        item.name = '24月龄儿童中医药'
                        html+='<div class="font_e serialNum">24月龄儿童中医药</div>' ;
                     }else if(item.stage === "17"){
                        item.name = '30月龄儿童中医药'
                        html+='<div class="font_e serialNum">30月龄儿童中医药</div>' ;
                     }else if(item.stage === "18"){
                        item.name = '36月龄儿童中医药'
                        html+='<div class="font_e serialNum">36月龄儿童中医药</div>' ;
                     }
                     // if(item.stage === '0'){
                     //    html+='<div class="green font_e serialNum">新生儿家庭访视记录表</div>' ;
                     // }else if(item.stage === '1' || item.stage === '2' || item.stage === '3' || item.stage === '4'){
                     //    html+='<div class="green font_e serialNum">1-8月龄儿童健康检查记录表</div>' ;
                     // }else if(item.stage === '5' || item.stage === '6' || item.stage === '7' || item.stage === '8'){
                     //    html+='<div class="green font_e serialNum">12-30月龄儿童健康检查记录表</div>' ;
                     // }else if(item.stage === '9' || item.stage === '10' || item.stage === '11' || item.stage === '12'){
                     //    html+='<div class="green font_e serialNum">3～6岁儿童健康检查记录表</div>' ;
                     // }else if(item.stage === '13' || item.stage === '14' || item.stage === '15' || item.stage === '16'){
                     //    html+='<div class="green font_e serialNum">中医药健康服务记录表</div>' ;
                     // }
                     html +='<div class="font_s l_gray">随访日期：'+item.sfrq+'</div>' +
                        '</div>' +
                        '</li>'
                  })
                  getDetails(resultMsg.data[0].id,resultMsg.data[0].stage)
               }
            }
            $(".health_list").html(html)
            $(".health_list li").eq(0).find(".serialNum").removeClass("a_gray").addClass("green");
         })
      };
      function getDetails(id,stage) {
         var jsonParams = {
            id : id,
            stage:''
         }
         if(stage === '0'){
            $(".newborn").show().siblings().hide()
            // jsonParams.stage = '0'
            getAjax('/health/follow/getXse', jsonParams, function (resultMsg) {
               var item = resultMsg.data
               var html =''
               html+='<div class="top_title">新生儿家庭访视记录表</div>' +
                  '<div class="l_gray">随访日期：<span class="mar_r">'+item.bcsfrq+'</span>随访医生：'+item.sfysqm+'</div>'
               $(".top_box").html(html)
               for (var i = 0;i < $('.newborn .newbornSfz').length; i++) {
                  var ids = $('.newborn .newbornSfz').eq(i).attr('id');
                  if(resultMsg.data !== undefined){
                     if(resultMsg.data[ids] != "" && resultMsg.data[ids]){
                        $('#' + ids).html(resultMsg.data[ids])
                     }else{
                        $('#' + ids).html("暂无数据")
                     }
                  }else{
                     $('#' + ids).html("暂无数据")
                  }
               }
               // var tableobj = {
               //     elem: '#grtTable',
               //     cellMinWidth: 80,
               //     even: true,
               //     cols: [[
               //         {field:'ywmc', title: '药物名称',minWidth:100}
               //         ,{field:'ywjl', title: '单次剂量',minWidth:100}
               //         ,{field:'ywpc', title: '用药频次',minWidth:100}
               //     ]],
               //     data: []
               // };
               // tableobj.data = resultMsg.data.drugList;
               // table.render(tableobj);
            })
         }else if(stage === '1' || stage === '2' || stage === '3' || stage === '4'){
            $(".toEight").show().siblings().hide()
            // jsonParams.stage = '1'
            getAjax('/health/follow/getEt1', jsonParams, function (resultMsg) {
               var item = resultMsg.data
               var html =''
               if(item.sffs == undefined){
                  item.sffs = '无数据'
               }
               var name=""
               if(stage === "1"){
                  name = '满月儿童'
               }else if(stage === "2"){
                  name = '3月龄儿童'
               }else if(stage === "3"){
                  name = '6月龄儿童'
               }else if(stage === "4"){
                  name = '8月龄儿童'
               }
               html+='<div class="top_title">'+name+'健康检查记录表</div>' +
                   '<div class="l_gray">随访日期：<span class="mar_r">'+item.sfrq+'</span><span class="green mar_r">随访方式：'+item.sffs+'</span>随访医生：'+item.sfysqm+'</div>'
               $(".top_box").html(html)
               for (var i = 0;i < $('.toEight .toEightSfz').length; i++) {
                  var ids = $('.toEight .toEightSfz').eq(i).attr('id');
                  var ide = ids.substring(0, ids.length - 1)
                  if(resultMsg.data !== undefined){
                     if(resultMsg.data[ide] != "" && resultMsg.data[ide]){
                        $('#' + ids).html(resultMsg.data[ide])
                     }else{
                        $('#' + ids).html("暂无数据")
                     }
                  }else{
                     $('#' + ids).html("暂无数据")
                  }
               }
            })
         }else if(stage === '5' ||stage === '6' ||stage === '7' ||stage === '8'){
            $(".twelveToThirty").show().siblings().hide()
            // jsonParams.stage = '2'
            var names=""
            if(stage === "5"){
               names = '12月龄儿童'
            }else if(stage === "6"){
               names = '18月龄儿童'
            }else if(stage === "7"){
               names = '24月龄儿童'
            }else if(stage === "8"){
               names = '30月龄儿童'
            }
            getAjax('/health/follow/getEt3', jsonParams, function (resultMsg) {
               var item = resultMsg.data
               var html =''
               html+='<div class="top_title">'+names+'健康检查记录表</div>' +
                   '<div class="l_gray">随访日期：<span class="mar_r">'+item.sfrq+'</span>随访医生：'+item.sfysqm+'</div>'
               $(".top_box").html(html)
               for (var i = 0;i < $('.twelveToThirty .tSfz').length; i++) {
                  var ids = $('.twelveToThirty .tSfz').eq(i).attr('id');
                  var ide = ids.substring(0, ids.length - 1)
                  $('#' + ids).html("暂无数据")
                  if(resultMsg.data !== undefined){
                     if(resultMsg.data[ide] != "" && resultMsg.data[ide]){
                        $('#' + ids).html(resultMsg.data[ide])
                     }else{
                        $('#' + ids).html("暂无数据")
                     }
                  }else{
                     $('#' + ids).html("暂无数据")
                  }
                  // if(resultMsg.data !== undefined){
                  //    for(var key in resultMsg.data) {
                  //       var keyVal = resultMsg.data[key]
                  //       if(keyVal == ""){
                  //          keyVal = '暂无数据'
                  //       }
                  //       if(ids.indexOf(key) > -1){
                  //          $('#' + ids).html(keyVal)
                  //       }
                  //    }
                  // }
               }
            })
         }else if(stage === '9' ||stage === '10' ||stage === '11' ||stage === '12'){
            $(".threeToSix").show().siblings().hide()
            var name=""
            if(stage === "9"){
               name = '3岁儿童'
            }else if(stage === "10"){
               name = '4岁儿童'
            }else if(stage === "11"){
               name = '5岁儿童'
            }else if(stage === "12"){
               name = '6岁儿童'
            }
            // jsonParams.stage = '3'
            getAjax('/health/follow/getEt6', jsonParams, function (resultMsg) {
               var item = resultMsg.data
               var html =''
               if(item.sffs == undefined){
                  item.sffs = "无数据"
               }
               html+='<div class="top_title">'+name+'健康检查记录表</div>' +
                   '<div class="l_gray">随访日期：<span class="mar_r">'+item.sfrq+'</span><span class="green mar_r">随访方式：'+item.sffs+'</span>随访医生：'+item.sfysqm+'</div>'
               $(".top_box").html(html)
               for (var i = 0;i < $('.threeToSix .ttsSfz').length; i++) {
                  var ids = $('.threeToSix .ttsSfz').eq(i).attr('id');
                  var ide = ids.substring(0, ids.length - 1)
                  $('#' + ids).html("暂无数据")
                  if(resultMsg.data !== undefined){
                     if(resultMsg.data[ide] != "" && resultMsg.data[ide]){
                        $('#' + ids).html(resultMsg.data[ide])
                     }else{
                        $('#' + ids).html("暂无数据")
                     }
                  }else{
                     $('#' + ids).html("暂无数据")
                  }
               }
            })
         }else if(stage === '13' ||stage === '14' ||stage === '15' ||stage === '16' ||stage === '17' ||stage === '18'){
            $(".childTcm").show().siblings().hide()
            // jsonParams.stage = '3'
            var name = ""
            if(stage === "13"){
               name = '6月龄儿童中医药'
            }else if(stage === "14"){
               name = '12月龄儿童中医药'
            }else if(stage === "15"){
               name = '18月龄儿童中医药'
            }else if(stage === "16"){
               name = '24月龄儿童中医药'
            }else if(stage === "17"){
               name = '30月龄儿童中医药'
            }else if(stage === "18"){
               name = '36月龄儿童中医药'
            }
            var urls=""
            if(stage === '13' || stage === '14' || stage === '15'){
               urls = '/health/follow/getEt1Zyy'
            }else if(stage === '16' || stage === '17' || stage === '18'){
               urls = '/health/follow/getEt3Zyy'
            }
            getAjax(urls, jsonParams, function (resultMsg) {
               var item = resultMsg.data
               var html =''
               if(item.sffs == undefined){
                  item.sffs = "无数据"
               }
               html+='<div class="top_title">'+name+'</div>' +
                   '<div class="l_gray">随访日期：<span class="mar_r">'+item.sfrq+'</span>随访医生：'+item.sfys+'</div>'
               console.log(stage)
               $(".top_box").html(html)
               if(stage === '13' || stage === '14' || stage === '15'){
                  $("#zyyglfwName").text(item.zyyglfwName)
                  $("#zyyjkglfwName").hide()
                  $("#zyyglfwName").show()
                  $("#zyyglfwqt").text(item.zyyglfwqt)
                  $("#zyyjkglfwqt").hide()
                  $("#zyyglfwqt").show()
               }
               if(stage === '16' || stage === '17' || stage === '18'){
                  $("#zyyjkglfwName").text(item.zyyjkglfwName)
                  $("#zyyglfwName").show()
                  $("#zyyjkglfwName").hide()
                  $("#zyyjkglfwqt").text(item.zyyjkglfwqt)
                  $("#zyyglfwqt").hide()
                  $("#zyyjkglfwqt").show()
               }
               $("#xcsfrq4").text(item.xcsfrq)
            })
         }
      }
   })
})