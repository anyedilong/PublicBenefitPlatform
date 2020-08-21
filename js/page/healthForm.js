$(function () {
    layui.use(['form','laydate', 'table', 'laypage', 'layer'], function() {
       // layui.layer.load();
        var laydate = layui.laydate;
        var form = layui.form;
        var table = layui.table;
        var laypage = layui.laypage
            ,layer = layui.layer;
        $("#getList").click(function () {
            $(".getDetail").hide()
            $(".getDetailHref").hide()
            $(".getVs").show()
        })
        // 体检记录分页
        var hosPage = {
            elem: 'getPage'
            , count: 100
            , layout: ['prev', 'next']
            , limit: 10  //得到每页显示的条数
            , curr: 1 //得到当前页，以便向服务端请求对应页的数据。
            ,jump: function(obj){}
        };
        // 体检记录
        var jsonParam = {
            // sfzh: '110101190603073055',
           jmId: localStorage.getItem("jmid"),
            pageNo: 1,
           pageSize:10,
        }
        var tjId = '' //右侧体检记录显示id
        var tjRq = '' //右侧体检记录日期
        var scTjId = '' //右侧体检记录上次id
        $(".health_list").on("click","li",function () {
            $(this).find(".serialNum").removeClass("a_gray").addClass("green")
            $(this).siblings().find(".serialNum").removeClass("green").addClass("a_gray")
            $(".getVs").show()
            $(".getDetail").hide()
            tjId = $(this).attr("ids")
            scTjId = $(this).next().attr("ids")
            tjRq = $(this).find(".jcrq").text()
            getHealthDetails(tjId,tjRq)
        })
        getHealthList()
        function getHealthList() {
            getAjax('/health/check/getCheckPage', jsonParam, function (resultMsg) {
               // layui.layer.closeAll()
               $(".showLoading").css("opacity",'1')
                hosPage.count = resultMsg.data.count;
                laypage.render(hosPage);
                var html =''
                // if(resultMsg.data.list.length == 0 || resultMsg.data.list == undefined){
                //     html += '<li>暂无数据</li>'
                // }else{
                    $.each(resultMsg.data.list, function (i, item) {
                        item.num = jsonParam.pageNo*(resultMsg.data.list.length - i)
                        if(item.num < 10){
                            item.num = '0'+item.num
                        }
                        html+=' <li class="myFlex tit_mar" ids="'+item.id+'">' +
                            '<span class="bg_lightgreen font_d health_num">'+item.num+'</span>' +
                            '<div class="data_plan">' +
                            '<div class="a_gray font_e serialNum ">'+item.tjbh+'</div>' +
                            '<div class="font_s l_gray ">体检日期：<span class="jcrq">'+item.jcrq+'</span></div>' +
                            '</div>' +
                            '</li>'
                    })
                    tjId = resultMsg.data.list[0].id
                    tjRq = resultMsg.data.list[0].jcrq
                     if(resultMsg.data.list){
                        if(resultMsg.data.list.length>1){
                           scTjId = resultMsg.data.list[1].id
                        }else{
                           scTjId = ''
                        }
                     }
                    getHealthDetails(tjId,tjRq)
                // }
                $(".health_list").html(html)
                $(".health_list li").eq(0).find(".serialNum").removeClass("a_gray").addClass("green");
            })
        }
        hosPage.jump = function (obj) {
            jsonParam.pageSize = obj.limit;
            jsonParam.pageNo = obj.curr;
            getAjax('/health/check/getCheckPage', jsonParam, function (resultMsg) {
                var html =''
                // if(resultMsg.data.list.length == 0 || resultMsg.data.list == undefined){
                //     html += '<li>暂无数据</li>'
                // }else{
                    $.each(resultMsg.data.list, function (i, item) {
                        item.num = jsonParam.pageNo*(resultMsg.data.list.length - i)
                        if(item.num < 10){
                            item.num = '0'+item.num
                        }
                        html+=' <li class="myFlex tit_mar" ids="'+item.id+'">' +
                            '<span class="bg_lightgreen font_d health_num">'+item.num+'</span>' +
                            '<div class="data_plan">' +
                            '<div class="a_gray font_e serialNum">'+item.tjbh+'</div>' +
                            '<div class="font_s l_gray ">体检日期：<span class="jcrq">'+item.jcrq+'</span></div>' +
                            '</div>' +
                            '</li>'
                    })
                    tjId = resultMsg.data.list[0].id
                    tjRq = resultMsg.data.list[0].jcrq
                     if(resultMsg.data.list){
                        if(resultMsg.data.list.length>1){
                           scTjId = resultMsg.data.list[1].id
                        }else{
                           scTjId = ''
                        }
                     }
                    getHealthDetails(tjId,tjRq)
                // }
                $(".health_list").html(html)
                $(".health_list li").eq(0).find(".serialNum").removeClass("a_gray").addClass("green");
            })
        };

        // 体检数据对比
        function getHealthDetails(id,rq) {
           // layui.layer.load();
            var jsonParams = {
                // sfzh: '110101190603073055',
                sfzh: localStorage.getItem("sfzh"),
                jcrq : rq
            };
            getAjax('/health/check/hmjktjlb', jsonParams, function (resultMsg) {
               // layui.layer.closeAll()
               $(".showLoading").css("opacity",'1')
                var item = resultMsg.data;
               if(resultMsg.data.tjdw == ''){
                  resultMsg.data.tjdw = '--'
               }
                $(".orgName").text(resultMsg.data.tjdw)
                var html ='';
                html+='评估日期：'+item.jcrq+' <span class="green mar">体检编号：'+item.tjbh+'</span>责任医生：'+item.ys+'';
                $(".tj_title").html(html);
                $(".orgName").text(item.orgName);

               var newList = resultMsg.data.newly;
               var oldList = resultMsg.data.old;
               // 左侧血压
               $(".zcxyb").text(newList.zcxy);
               $(".zcxys").text(oldList.zcxy);
               let index1 = newList.zcxy.lastIndexOf("/");
               let str = newList.zcxy.substring(0,index1);
               let str2 =''
               if(oldList.zcxy){
                  let index2 = oldList.zcxy.lastIndexOf("/");
                  str2 = oldList.zcxy.substring(0,index2);
               }else{
                  $(".old").hide()
               }
               if(Number(str) > Number(str2) && str2!==''){
                  $(".zcxyb_line").removeClass('green_line').addClass('orange_line')
               }else if(Number(str2) > Number(str)){
                  $(".zcxys_line").removeClass('green_line').addClass('orange_line')
               }else
               // if(Number(str2) === Number(str))
               {
                  $(".zcxyb_line").removeClass('orange_line').addClass('green_line')
                  $(".zcxys_line").removeClass('orange_line').addClass('green_line')
               }
               // 右侧血压
               $(".ycxyb").text(newList.ycxy);
               $(".ycxys").text(oldList.ycxy);
               let index3 = newList.ycxy.lastIndexOf("/");
               let str3 = newList.ycxy.substring(0,index3);
               let str4 =''
               if(oldList.zcxy){
                  let index4 = oldList.ycxy.lastIndexOf("/");
                  str4 = oldList.ycxy.substring(0,index4);
               }
               if(Number(str3) > Number(str4) && str4!==''){
                  $(".ycxyb_line").removeClass('green_line').addClass('orange_line')
               }else if(Number(str4) > Number(str3)){
                  $(".ycxys_line").removeClass('green_line').addClass('orange_line')
               }else
               // if(Number(str4) === Number(str3))
               {
                  $(".ycxyb_line").removeClass('orange_line').addClass('green_line')
                  $(".ycxys_line").removeClass('orange_line').addClass('green_line')
               }
               // 血糖
               $(".xtzb").text(newList.xtz);
               $(".xtzs").text(oldList.xtz);
               if(Number(newList.xtz) > Number(oldList.xtz)){
                  $(".xtb_line").removeClass('green_line').addClass('orange_line')
               }else if(Number(newList.xtz) < Number(oldList.xtz)){
                  $(".xts_line").removeClass('green_line').addClass('orange_line')
               }else
               // if(Number(newList.xtz) === Number(oldList.xtz))
               {
                  $(".xtb_line").removeClass('orange_line').addClass('green_line')
                  $(".xts_line").removeClass('orange_line').addClass('green_line')
               }
               // 心率
               $(".xlb").text(newList.xl);
               $(".xls").text(oldList.xl);
               if(Number(newList.xl) > Number(oldList.xl)){
                  $(".xlb_line").removeClass('green_line').addClass('orange_line')
               }else if(Number(newList.xl) < Number(oldList.xl)){
                  $(".xls_line").removeClass('green_line').addClass('orange_line')
               }else
               // if(Number(newList.xl) === Number(oldList.xl))
               {
                  $(".xlb_line").removeClass('orange_line').addClass('green_line')
                  $(".xls_line").removeClass('orange_line').addClass('green_line')
               }
               // 体质指数
               $(".bmib").text(newList.bmi);
               $(".bmis").text(oldList.bmi);
               if(Number(newList.bmi) > Number(oldList.bmi)){
                  $(".bmib_line").removeClass('green_line').addClass('orange_line')
               }else if(Number(newList.bmi) < Number(oldList.bmi)){
                  $(".bmis_line").removeClass('green_line').addClass('orange_line')
               }else
               // if(Number(newList.bmi) === Number(oldList.bmi))
               {
                  $(".bmib_line").removeClass('orange_line').addClass('green_line')
                  $(".bmis_line").removeClass('orange_line').addClass('green_line')
               }
               //健康评估
               $(".jkpjb").text(newList.jkpj);
               $(".jkpjs").text(oldList.jkpj);
               if(newList.jkpj === "异常") {
                  $(".jkpjb_line").removeClass('green_line').addClass('orange_line')
               }else{
                  $(".jkpjb_line").removeClass('orange_line').addClass('green_line')
               }
               if(oldList.jkpj === "异常") {
                  $(".jkpjs_line").removeClass('green_line').addClass('orange_line')
               }else{
                  $(".jkpjs_line").removeClass('orange_line').addClass('green_line')
               }
               //1、戒烟2、健康饮酒 3、饮食 4、锻炼 5、减体重 6、建议接种疫苗 7、其他
               let text = item.jkzd.substr(-4);
               let text1 ='';
               let text2 = item.jkzd.substr(0,item.jkzd.length-4);
               let attr = item.wxkz.split(",");
               attr.forEach((items, index)=> {
                  if(items.indexOf("戒烟") > -1){
                     text1 = text1 + "吸烟，请戒烟；"
                  }
                  if(items.indexOf("健康饮酒") > -1){
                     text1 = text1 + "饮酒，请保持健康饮酒；"
                  }
                  if(items.indexOf("饮食") > -1){
                     text1 = text1 + "不合理饮食，请保持合理饮食；"
                  }
                  if(items.indexOf("锻炼") > -1){
                     text1 = text1 + "不锻炼身体，请保持锻炼身体；"
                  }
                  if(items.indexOf("减体重") > -1){
                     // text1 = text1 + "超重，请减体重至KG；"
                     text1 = text1 + "超重，请减体重至"+item.mbtz+"KG；"
                  }
                  if(items.indexOf("建议接种疫苗") > -1){
                     text1 = text1 + "您缺少疫苗防护，建议您接种疫苗；"+item.jzym
                  }
                  if(items.indexOf("其他") > -1){
                     text1 = text1 + item.qtms
                  }
               });
               $(".zd_content").text(text2 + '影响您的健康因素是：'+ text1 + text+'。')
            })
        }

        // 本次
        $("#thisTime").click(function () {
            $(".getDetail").show()
            $(".getVs").hide()
            getDetails(tjId)
           getShfsDetails(tjId)
           getZqgnDetails(tjId)
           getCtDetails(tjId)
           getFzjcDetails(tjId)
           getZywtDetails(tjId)
           getZyzlDetails(tjId)
           getYyqkDetails(tjId)
           getYfjzsDetails(tjId)
           getJkpjDetails(tjId)
        })
        // 上次
        $("#lastTime").click(function () {
            if(scTjId){
               getDetails(scTjId)
               getShfsDetails(scTjId)
               getZqgnDetails(scTjId)
               getCtDetails(scTjId)
               getFzjcDetails(scTjId)
               getZywtDetails(scTjId)
               getZyzlDetails(scTjId)
               getYyqkDetails(scTjId)
               getYfjzsDetails(scTjId)
               getJkpjDetails(scTjId)
               $(".getDetail").show()
               $(".getVs").hide()
            }else{
               layer.msg("没有更早记录")
            }
        })
        $(".leftTab").on("click","li",function () {
            $(this).addClass("bg_green").siblings().removeClass("bg_green")
        })
        // 体检数据详情
         //基本信息
        function getDetails(id) {
           // layui.layer.load();
           var jsonParamc = {
              tjId: id,
            }
            getAjax('/health/check/getCheckDetail', jsonParamc, function (resultMsg) {
               // console.log(resultMsg.data)
               // layui.layer.closeAll()
               $(".showLoading").css("opacity",'1')
               for (var i = 0;i < $('.info_ybzz li').length; i++) {
                   var ids = $('.info_ybzz li').eq(i).find('div').eq(1).attr('id');
                   if(resultMsg.data.ybzzb !== undefined){
                       if(resultMsg.data.ybzzb[ids] != "" && resultMsg.data.ybzzb[ids]){
                           $('#' + ids).html(resultMsg.data.ybzzb[ids])
                       }else{
                           $('#' + ids).html("暂无数据")
                       }
                   }else{
                       $('#' + ids).html("暂无数据")
                   }
               }
               $("#zzText").html(resultMsg.data.zzText)
               $("#qtzz").html(resultMsg.data.qt)

               for (var i = 0;i < $('.info_jbxx li').length; i++) {
                  var ids = $('.info_jbxx li').eq(i).find('div').eq(1).attr('id');
                  if(resultMsg.data.ybzzb !== undefined){
                     if(resultMsg.data.ybzzb[ids] != "" && resultMsg.data.ybzzb[ids]){
                        $('#' + ids).html(resultMsg.data.ybzzb[ids])
                     }else{
                        $('#' + ids).html("暂无数据")
                     }
                  }else{
                     $('#' + ids).html("暂无数据")
                  }
                  $("#zcxy").text(resultMsg.data.ybzzb.zcxy)
                  $("#zgd").text(resultMsg.data.ybzzb.zgd)
                  $("#ycxy").text(resultMsg.data.ybzzb.ycxy)
                  $("#ygd").text(resultMsg.data.ybzzb.ygd)
               }

               //  //生活方式
               //  for (var i = 0; i < $('.info_shfs .sffs_id').length; i++) {
               //      var ids = $('.info_shfs .sffs_id').eq(i).find('.sffs_s').attr('id');
               //      if(resultMsg.data.shfs !== undefined) {
               //          if (resultMsg.data.shfs[ids] != "" && resultMsg.data.shfs[ids]) {
               //              $('#' + ids).html(resultMsg.data.shfs[ids])
               //          } else {
               //              $('#' + ids).html("暂无数据")
               //          }
               //      }else{
               //          // console.log("生活方式暂无数据")
               //          // console.log($('#' + ids))
               //          $('#' + ids).html("暂无数据")
               //      }
               //  }
               //
               //  // 脏器功能
               //  for (var i = 0; i < $('.info_zqgn .zqgn_id').length; i++) {
               //      var ids = $('.info_zqgn .zqgn_id').eq(i).find('.zqgn_s').attr('id');
               //      if(resultMsg.data.zytzZqgn !== undefined) {
               //          if (resultMsg.data.zytzZqgn[ids] != "" && resultMsg.data.zytzZqgn[ids]) {
               //              $('#' + ids).html(resultMsg.data.zytzZqgn[ids])
               //          } else {
               //              $('#' + ids).html("暂无数据")
               //          }
               //      }else{
               //          $('#' + ids).html("暂无数据")
               //      }
               //  }
               //
               //  // 查体
               //  for (var i = 0;i < $('.info_ct .ct_id').length; i++) {
               //      var ids = $('.info_ct .ct_id').eq(i).find('.ct_s').attr('id');
               //      if(resultMsg.data.chati !== undefined){
               //         var xlz = resultMsg.data.chati.xl
               //          if(resultMsg.data.chati[ids] != "" && resultMsg.data.chati[ids]){
               //              $('#' + ids).html(resultMsg.data.chati[ids])
               //          }else{
               //              $('#' + ids).html("暂无数据")
               //          }
               //          if(xlz){
               //             $('#xlz').html(xlz)
               //          }else{
               //             $('#xlz').html("暂无数据")
               //          }
               //      }else{
               //          $('#' + ids).html("暂无数据")
               //      }
               //  }
               //  // 辅助检查
               //  for (var i = 0;i < $('.info_fzjc .fzjc_id').length; i++) {
               //      var ids = $('.info_fzjc .fzjc_id').eq(i).find('.fzjc_s').attr('id');
               //      if(resultMsg.data.fzjc!== undefined){
               //          if(resultMsg.data.fzjc[ids] != "" && resultMsg.data.fzjc[ids]){
               //              $('#' + ids).html(resultMsg.data.fzjc[ids])
               //          }else{
               //              $('#' + ids).html("暂无数据")
               //          }
               //      }else{
               //          $('#' + ids).html("暂无数据")
               //      }
               //  }
               //  // 主要问题
               //  for (var i = 0;i < $('.info_zywt .zywt_s').length; i++) {
               //      var ids = $('.info_zywt .zywt_s').eq(i).attr('id');
               //      if(resultMsg.data.jkwt !==undefined){
               //         var zgjycmsz = resultMsg.data.jkwt.zgjycms
               //          if(resultMsg.data.jkwt[ids] != "" && resultMsg.data.jkwt[ids]){
               //              $('#' + ids).html(resultMsg.data.jkwt[ids])
               //          }else{
               //              $('#' + ids).html("暂无数据")
               //          }
               //         if(zgjycmsz){
               //            $('#zgjycmsz').html(zgjycmsz)
               //         }else{
               //            $('#zgjycmsz').html("暂无数据")
               //         }
               //      }else{
               //          $('#' + ids).html("暂无数据")
               //      }
               //  }
               //  // 住院治疗情况
               //  var tablezyzl = {
               //      elem: '#zysTable',
               //      cellMinWidth: 80,
               //      even: true,
               //      cols: [[
               //          {field:'zysj', title: '入院日期',minWidth:100}
               //          ,{field:'cyrq', title: '出院日期',minWidth:100}
               //          ,{field:'zyyy', title: '原因',minWidth:100}
               //          ,{field:'yymc', title: '医疗机构及科室名称',minWidth:100}
               //          ,{field:'fbcs', title: '病案号',minWidth:100}
               //      ]],
               //      data: []
               //  };
               //  if(resultMsg.data.zyzlYyqk.zysArry){
               //     tablezyzl.data = resultMsg.data.zyzlYyqk.zysArry;
               //  }
               // table.render(tablezyzl);
               //  // 用药情况
               //  var tableyyqk = {
               //      elem: '#yyqkTable',
               //      cellMinWidth: 80,
               //      even: true,
               //      cols: [[
               //          {field:'ywmc', title: '药物名称',minWidth:100}
               //          ,{field:'synl', title: '用法',minWidth:100}
               //          ,{field:'yl', title: '用量',minWidth:100}
               //          ,{field:'kssj', title: '用药时间',minWidth:100}
               //          ,{field:'ywycx', title: '用药服从性',minWidth:100}
               //      ]],
               //      data: []
               //  };
               //  if(resultMsg.data.zyzlYyqk.yjjlbArry){
               //     tableyyqk.data = resultMsg.data.zyzlYyqk.yjjlbArry;
               //  }
               // table.render(tableyyqk);
               //  // 预防接种史
               //  var tablejzs = {
               //      elem: '#yfjzsTable',
               //      cellMinWidth: 80,
               //      even: true,
               //      cols: [[
               //          {field:'ypmc', title: '疫苗名称',minWidth:100}
               //          ,{field:'jzymrq', title: '接种疫苗日期',minWidth:100}
               //          ,{field:'jzs', title: '接种机构',minWidth:200}
               //      ]],
               //      data: []
               //  };
               //  if(resultMsg.data.jkpjJkzd.jzsArray){
               //     tablejzs.data = resultMsg.data.jkpjJkzd.jzsArray;
               //  }
               // table.render(tablejzs);
               //  // for (var key in resultMsg.data.ybzz) {
               //  //     if(resultMsg.data.ybzz[key] != "" && resultMsg.data.ybzz[key]){
               //  //         $('#' + key).html(resultMsg.data.ybzz[key])
               //  //     }else{
               //  //         $('#' + key).html("暂无数据")
               //  //     }
               //  // }
            })
        }

         //生活方式
       function getShfsDetails(id) {
          // layui.layer.load();
          var jsonParamc = {
             tjId: id,
          }
          getAjax('/health/check/getShfsDetail', jsonParamc, function (resultMsg) {
             // console.log(resultMsg.data)
             // layui.layer.closeAll()
             $(".showLoading").css("opacity",'1')
              for (var i = 0; i < $('.info_shfs .sffs_id').length; i++) {
                  var ids = $('.info_shfs .sffs_id').eq(i).find('.sffs_s').attr('id');
                  if(resultMsg.data !== undefined) {
                      if (resultMsg.data[ids] != "" && resultMsg.data[ids]) {
                          $('#' + ids).html(resultMsg.data[ids])
                      } else {
                          $('#' + ids).html("暂无数据")
                      }
                  }else{
                      // console.log("生活方式暂无数据")
                      // console.log($('#' + ids))
                      $('#' + ids).html("暂无数据")
                  }
              }
              console.log(resultMsg.data.fcfhcsms)
              $("#fcfhcsms").text(resultMsg.data.fcfhcsms)
              $("#fsxwzfhcsms").text(resultMsg.data.fsxwzfhcsms)
              $("#wlysfhcs").text(resultMsg.data.wlysfhcs)
              $("#hxwzfhcsms").text(resultMsg.data.hxwzfhcsms)
          })
       }

       // 脏器功能
       function getZqgnDetails(id) {
          // layui.layer.load();
          var jsonParamc = {
             tjId: id,
          }
          getAjax('/health/check/getZqgnbDetail', jsonParamc, function (resultMsg) {
             // console.log(resultMsg.data)
             // layui.layer.closeAll()
             $(".showLoading").css("opacity",'1')
              for (var i = 0; i < $('.info_zqgn .zqgn_id').length; i++) {
                  var ids = $('.info_zqgn .zqgn_id').eq(i).find('.zqgn_s').attr('id');
                  if(resultMsg.data !== undefined) {
                      if (resultMsg.data[ids] != "" && resultMsg.data[ids]) {
                          $('#' + ids).html(resultMsg.data[ids])
                      } else {
                          $('#' + ids).html("暂无数据")
                      }
                  }else{
                      $('#' + ids).html("暂无数据")
                  }
              }

             // if(resultMsg.data.qtpfycms == undefined || resultMsg.data.qtpfycms == ''){
             //    $(".qtgmycms").hide()
             // }
             // if(resultMsg.data.qtlbjycms == undefined || resultMsg.data.qtlbjycms == ''){
             //    $(".qtlbjycms").hide()
             // }
             // if(resultMsg.data.hxyms == undefined || resultMsg.data.hxyms == ''){
             //    $(".hxyms").hide()
             // }
             // if(resultMsg.data.lyns == undefined || resultMsg.data.lyns == ''){
             //    $(".lyns").hide()
             // }
             // if(resultMsg.data.gmycms == undefined || resultMsg.data.gmycms == ''){
             //    $(".gmycms").hide()
             // }
             // if(resultMsg.data.rxycms == undefined || resultMsg.data.rxycms == ''){
             //    $(".rxycms").hide()
             // }
          })
       }

       // 查体
       function getCtDetails(id) {
          // layui.layer.load();
          var jsonParamc = {
             tjId: id,
          }
          getAjax('/health/check/getJkjcDetail', jsonParamc, function (resultMsg) {
             // layui.layer.closeAll()
             $(".showLoading").css("opacity",'1')
              for (var i = 0;i < $('.info_ct .ct_id').length; i++) {
                  var ids = $('.info_ct .ct_id').eq(i).find('.ct_s').attr('id');
                  if(resultMsg.data !== undefined){
                     var xlz = resultMsg.data.xl
                      if(resultMsg.data[ids] != "" && resultMsg.data[ids]){
                          $('#' + ids).html(resultMsg.data[ids])
                      }else{
                          $('#' + ids).html("暂无数据")
                      }
                      if(xlz){
                         $('#xlz').html(xlz)
                      }else{
                         $('#xlz').html("暂无数据")
                      }
                  }else{
                      $('#' + ids).html("暂无数据")
                  }
              }
          })
          var list = ['yandycms','qtpfycms','qtgmycms','qtlbjycms','hxyms','lyns','gmycms','rxycms','wyycms','ydycms','zgjycms','gtycms','fjycms']
          for(var r = 0;r < list.length; r++){
             if($('#'+list[r]).html() === "暂无数据"){
                $('.'+list[r]).hide()
             }
          }
       }

        // 辅助检查
       function getFzjcDetails(id) {
          // layui.layer.load();
          var jsonParamc = {
             tjId: id,
          }
          getAjax('/health/check/getXzjcjlbDetail', jsonParamc, function (resultMsg) {
             // layui.layer.closeAll()
             $(".showLoading").css("opacity",'1')
              for (var i = 0;i < $('.info_fzjc .fzjc_id').length; i++) {
                  var ids = $('.info_fzjc .fzjc_id').eq(i).find('.fzjc_s').attr('id');
                  if(resultMsg.data!== undefined){
                      if(resultMsg.data[ids] != "" && resultMsg.data[ids]){
                          $('#' + ids).html(resultMsg.data[ids])
                      }else{
                          $('#' + ids).html("暂无数据")
                      }
                  }else{
                      $('#' + ids).html("暂无数据")
                  }
              }
              var list = ['xdtms','xbxgms','fbbcms','qtbcms','zgjycmsz']
             for(var r = 0;r < list.length; r++){
                if($('#'+list[r]).html() === "暂无数据"){
                   $('.'+list[r]).hide()
                }
             }
          })
       }

        // 主要问题
       function getZywtDetails(id) {
          // layui.layer.load();
          var jsonParamc = {
             tjId: id,
          }
          getAjax('/health/check/getJkwtbDetail', jsonParamc, function (resultMsg) {
             // console.log(resultMsg.data)
             // layui.layer.closeAll()
             $(".showLoading").css("opacity",'1')
              for (var i = 0;i < $('.info_zywt .zywt_s').length; i++) {
                  var ids = $('.info_zywt .zywt_s').eq(i).attr('id');
                  if(resultMsg.data !==undefined){
                     var zgjycmsz = resultMsg.data.zgjycms
                      if(resultMsg.data[ids] != "" && resultMsg.data[ids]){
                          $('#' + ids).html(resultMsg.data[ids])
                      }else{
                          $('#' + ids).html("暂无数据")
                      }
                     if(zgjycmsz){
                        $('#zgjycmsz').html(zgjycmsz)
                     }else{
                        $('#zgjycmsz').html("暂无数据")
                     }
                  }else{
                      $('#' + ids).html("暂无数据")
                  }
              }
             var list = ['qtnxgjb','qtszjb','qtxzjb','qtxgjb','qtybjb','qtsjxtjb']
             for(var r = 0;r < list.length; r++){
                if($('#'+list[r]).html() === "暂无数据"){
                   $('.'+list[r]).hide()
                }
             }
          })
       }

        // 住院治疗情况
       function getZyzlDetails(id) {
          // layui.layer.load();
          var jsonParamc = {
             tjId: id,
          }
          getAjax('/health/check/getZysList', jsonParamc, function (resultMsg) {
             // layui.layer.closeAll()
             $(".showLoading").css("opacity",'1')
              var tablezyzl = {
                  elem: '#zysTable',
                  cellMinWidth: 80,
                  even: true,
                  cols: [[
                      {field:'zysj', title: '入院日期',minWidth:100}
                      ,{field:'cyrq', title: '出院日期',minWidth:100}
                      ,{field:'zyyy', title: '原因',minWidth:100}
                      ,{field:'yymc', title: '医疗机构及科室名称',minWidth:100}
                      ,{field:'fbcs', title: '病案号',minWidth:100}
                  ]],
                  data: []
              };
              if(resultMsg.data){
                 tablezyzl.data = resultMsg.data;
              }
             table.render(tablezyzl);
          })
       }

        // 用药情况
       function getYyqkDetails(id) {
          // layui.layer.load();
          var jsonParamc = {
             tjId: id,
          }
          getAjax('/health/check/getYjjlbList', jsonParamc, function (resultMsg) {
             // layui.layer.closeAll()
             $(".showLoading").css("opacity",'1')
              var tableyyqk = {
                  elem: '#yyqkTable',
                  cellMinWidth: 80,
                  even: true,
                  cols: [[
                      {field:'ywmc', title: '药物名称',minWidth:100}
                      ,{field:'synl', title: '用法',minWidth:100}
                      ,{field:'yl', title: '用量',minWidth:100}
                      ,{field:'kssj', title: '用药时间',minWidth:100}
                      ,{field:'ywycxText', title: '用药服从性',minWidth:100}
                  ]],
                  data: []
              };
              if(resultMsg.data){
                 tableyyqk.data = resultMsg.data;
              }
             table.render(tableyyqk);
          })
       }

       // 预防接种史
       function getYfjzsDetails(id) {
          // layui.layer.load();
          var jsonParamc = {
             tjId: id,
          }
          getAjax('/health/check/getJzsList', jsonParamc, function (resultMsg) {
             // console.log(resultMsg.data)
             // layui.layer.closeAll()
             $(".showLoading").css("opacity",'1')
              var tablejzs = {
                  elem: '#yfjzsTable',
                  cellMinWidth: 80,
                  even: true,
                  cols: [[
                      {field:'ypmc', title: '疫苗名称',minWidth:100}
                      ,{field:'jzymrq', title: '接种疫苗日期',minWidth:100}
                      ,{field:'jzs', title: '接种机构',minWidth:200}
                  ]],
                  data: []
              };
              if(resultMsg.data){
                 tablejzs.data = resultMsg.data;
              }
             table.render(tablejzs);
              // for (var key in resultMsg.data.ybzz) {
              //     if(resultMsg.data.ybzz[key] != "" && resultMsg.data.ybzz[key]){
              //         $('#' + key).html(resultMsg.data.ybzz[key])
              //     }else{
              //         $('#' + key).html("暂无数据")
              //     }
              // }
          })
       }

       // 健康评价
       function getJkpjDetails(id){
          // layui.layer.load();
          var jsonParamc = {
             tjId: id,
          }
          getAjax('/health/check/getPgzdjlbDetail', jsonParamc, function (resultMsg) {
             console.log(resultMsg.data)
             // layui.layer.closeAll()
             $(".showLoading").css("opacity",'1')
             $("#sfzcText").text(resultMsg.data.sfzcText)
             $("#jiankangpingjia tbody").html("");
             var yichangArr = ['yc1', 'yc2', 'yc3', 'yc4'];
             for (var j = 0; j < yichangArr.length; j++) {
                if (resultMsg.data[yichangArr[j]] != '无数据') {
                   $('#jiankangpingjia tbody').append('<tr>' +
                      '<td>异常' + (j + 1) + '</td>' +
                      '<td>' + resultMsg.data[yichangArr[j]] + '</td></tr>');
                }
             }
             // var tablejzs = {
             //    elem: '#jkpjTable',
             //    cellMinWidth: 80,
             //    even: true,
             //    cols: [[
             //       {field:'ypmc', title: '异常',minWidth:100}
             //       ,{field:'jzymrq', title: '内容',minWidth:100}
             //    ]],
             //    data: []
             // };
             // if(resultMsg.data){
             //    tablejzs.data = resultMsg.data;
             // }
             // table.render(tablejzs);
             // for (var key in resultMsg.data.ybzz) {
             //     if(resultMsg.data.ybzz[key] != "" && resultMsg.data.ybzz[key]){
             //         $('#' + key).html(resultMsg.data.ybzz[key])
             //     }else{
             //         $('#' + key).html("暂无数据")
             //     }
             // }
          })
       }
    })
})