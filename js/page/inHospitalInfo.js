$(function () {
    layui.use(['form','laydate', 'table', 'laypage', 'layer','element'], function() {
        var $ = layui.jquery
            ,element = layui.element; //Tab的切换功能，切换事件监听等，需要依赖element模块
        var laydate = layui.laydate;
        var form = layui.form;
        var table = layui.table;
        var laypage = layui.laypage
            ,layer = layui.layer;
        var sfzh = localStorage.getItem("sfzh")
        // 住院记录分页
        var hosPage = {
            elem: 'getPage'
            , count: 100
            , layout: ['prev', 'next']
            , limit: 10  //得到每页显示的条数
            , curr: 1 //得到当前页，以便向服务端请求对应页的数据。
        };
        // 住院记录
        var jsonParam = {
            // sfzh: '53222319541020154',
            sfzh: localStorage.getItem("sfzh"),
            pageNo: 1,
            pageSize: 10
        }
        var jzId = '' //右侧接种记录显示id
        var arId = '' //入院登记码
        var orgCode = '' //机构编码
        $(".health_list").on("click","li",function () {
            $(this).find(".serialNum").removeClass("a_gray").addClass("green")
            $(this).siblings().find(".serialNum").removeClass("green").addClass("a_gray")
            jzId = $(this).attr("ids")
            arId = $(this).attr("arIds")
            orgCode = $(this).attr("orgCodes")
            getDetails(jzId)
            getBasyDetails()
            getZyMxDetails(jzId)
            getZyzdDetails(jzId)
           getYz(jzId)
        })
        getList()
        function getList() {
            getAjax('/region/hospital/getHospitalPage', jsonParam, function (resultMsg) {
                hosPage.count = resultMsg.data.count;
                laypage.render(hosPage);
                var html =''
                if(resultMsg.data.list.length == 0 || resultMsg.data.list == undefined){
                    html += '<li>暂无数据</li>'
                }else{
                    $.each(resultMsg.data.list, function (i, item) {
                        item.num = jsonParam.pageNo*(resultMsg.data.list.length - i)
                        if(item.num < 10){
                            item.num = '0'+item.num
                        }
                        html+='<li class="tit_mar clearfix" ids="'+item.id+'" arIds="'+item.arId+'" orgCodes="'+item.orgCode+'">' +
                            '<span class="bg_green font_d health_num fl">'+item.num+'</span>' +
                            '<div class="data_plan fl">' +
                            '<div class="a_gray font_e serialNum fontNum">'+item.orgName+'</div>' +
                            '<div class="font_s l_gray fontNum">入院时间：'+item.admissionDate+'</div>' +
                            '</div>' +
                            '</li>'
                    })
                    jzId = resultMsg.data.list[0].id
                    arId = resultMsg.data.list[0].arId
                    orgCode = resultMsg.data.list[0].orgCode
                }
                $(".health_list").html(html)
                $(".health_list li").eq(0).find(".serialNum").removeClass("a_gray").addClass("green");
                getDetails(jzId)
                getBasyDetails()
                getZyMxDetails(jzId)
                getZyzdDetails(jzId)
               getYz(jzId)
            })
        }
        hosPage.jump = function (obj) {
            jsonParam.pageSize = obj.limit;
            jsonParam.pageNo = obj.curr;
            getAjax('/region/hospital/getHospitalPage', jsonParam, function (resultMsg) {
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
                            '<div class="a_gray font_e serialNum fontNum">'+item.orgName+'</div>' +
                            '<div class="font_s l_gray fontNum">入院时间：'+item.admissionDate+'</div>' +
                            '</div>' +
                            '</li>'
                    })
                    jzId = resultMsg.data.list[0].id
                    arId = resultMsg.data.list[0].arId
                    orgCode = resultMsg.data.list[0].orgCode
                }
                $(".health_list").html(html)
                $(".health_list li").eq(0).find(".serialNum").removeClass("a_gray").addClass("green");
                getDetails(jzId)
                getBasyDetails()
                getZyMxDetails(jzId)
                getZyzdDetails(jzId)
               getYz(jzId)
            })
        };

        //  登记信息
        function getDetails(id) {
            var jsonParams = {
                id : id
            }
            getAjax('/region/hospital/getHospitalDetail', jsonParams, function (resultMsg) {
                for (var i = 0;i < $('.djInfo li').length; i++) {
                    var ids = $('.djInfo li').eq(i).find('div').eq(1).attr('id');
                    if(resultMsg.data){
                        if(resultMsg.data[ids] != "" && resultMsg.data[ids]){
                            $('#' + ids).html(resultMsg.data[ids])
                        }else{
                            $('#' + ids).html("暂无数据")
                        }
                    }else{
                        $('#' + ids).html("暂无数据")
                    }
                }
            })
        }

        //  病案首页
        function getBasyDetails() {
            var jsonParams = {
                arId : arId , //入院登记码
                orgCode : orgCode  //机构编码
            }
            // var jsonParams = {
            //     arId : "11358" , //入院登记码
            //     orgCode : "1001"  //机构编码
            // }
            getAjax('/region/hospital/getHospitalBasy', jsonParams, function (resultMsg) {
                for (var i = 0;i < $('.basyInfo li').length; i++) {
                    var ids = $('.basyInfo li').eq(i).find('div').eq(1).attr('id');
                    if(resultMsg.data){
                        if(resultMsg.data[ids] != "" && resultMsg.data[ids]){
                            $('#' + ids).html(resultMsg.data[ids])
                        }else{
                            $('#' + ids).html("暂无数据")
                        }
                        $('#orgName1').html(resultMsg.data.orgName == ''?'暂无数据':resultMsg.data.orgName)
                    }else{
                        $('#' + ids).html("暂无数据")
                    }
                }

                // 科别
                var tablekb = {
                    elem: '#kbTable',
                    cellMinWidth: 80,
                    even: true,
                    cols: [[
                        {field:'depCode', title: '科别代码',minWidth:100}
                        ,{field:'depName', title: '科别名称',minWidth:100}
                        ,{field:'depType', title: '科别类型',minWidth:100}
                        ,{field:'ward', title: '病房',minWidth:100}
                        ,{field:'createTime', title: '创建时间',minWidth:100}
                    ]],
                    data: []
                };
                if(resultMsg.data){
                    if(resultMsg.data.emr_ich_department){
                        tablekb.data = resultMsg.data.emr_ich_department;
                    }
                }
                // if(resultMsg.data.emr_ich_department){
                //     tablekb.data = resultMsg.data.emr_ich_department;
                // }
                table.render(tablekb);

                // 住院费用
                var tablezyfy = {
                    elem: '#zyfyTable',
                    cellMinWidth: 80,
                    even: true,
                    cols: [[
                        {field:'chargeAmount', title: '住院费用金额',minWidth:100}
                        ,{field:'chargeType', title: '住院费用分类',minWidth:100}
                        ,{field:'chargeTypeCode', title: '住院费用分类代码',minWidth:100}
                        ,{field:'createTime', title: '创建时间',minWidth:100}
                    ]],
                    data: []
                };
                if(resultMsg.data) {
                    if (resultMsg.data.emr_ich_charge) {
                        tablezyfy.data = resultMsg.data.emr_ich_charge;
                    }
                }
                table.render(tablezyfy);

                // 医生信息
                var tableysxx = {
                    elem: '#ysxxTable',
                    cellMinWidth: 80,
                    even: true,
                    cols: [[
                        {field:'doctorName', title: '医生姓名',minWidth:100}
                        ,{field:'doctorRole', title: '医生角色',minWidth:100}
                        ,{field:'createTime', title: '创建时间',minWidth:100}
                    ]],
                    data: []
                };
                if(resultMsg.data){
                    if(resultMsg.data.emr_ich_doctor){
                        tableysxx.data = resultMsg.data.emr_ich_doctor;
                    }
                }
                table.render(tableysxx);
                //
                // // 地址
                // var tabledz = {
                //     elem: '#dzTable',
                //     cellMinWidth: 80,
                //     even: true,
                //     cols: [[
                //         {field:'addr', title: '地址',minWidth:100}
                //         ,{field:'cantCode', title: '行政区划编码',minWidth:100}
                //         ,{field:'postalCode', title: '邮政编码',minWidth:100}
                //     ]],
                //     data: []
                // };
                // if(resultMsg.data){
                //     if(resultMsg.data.emr_ich_addr){
                //         tabledz.data = resultMsg.data.emr_ich_addr;
                //     }
                // }
                // table.render(tabledz);

                // 手术
                var tabless = {
                    elem: '#ssTable',
                    cellMinWidth: 80,
                    even: true,
                    cols: [[
                        {field:'operationDate', title: '手术/操作日期',minWidth:100}
                        ,{field:'operationCode', title: '手术/操作代码',minWidth:100}
                        ,{field:'operationName', title: '手术/操作名称',minWidth:100}
                        ,{field:'operationGrade', title: '手术级别',minWidth:100}
                        ,{field:'anaesthesia', title: '麻醉-方法',minWidth:100}
                        ,{field:'healingGrade', title: '切口愈合等级',minWidth:100}
                    ]],
                    data: []
                };
                if(resultMsg.data){
                    if(resultMsg.data.emr_ich_operation){
                        tabless.data = resultMsg.data.emr_ich_operation;
                    }
                }
                table.render(tabless);

                // 手术操作医师
                var tablessczys = {
                    elem: '#ssczysTable',
                    cellMinWidth: 80,
                    even: true,
                    cols: [[
                        {field:'doctorCode', title: '医生代码',minWidth:100}
                        ,{field:'doctorName', title: '医生姓名',minWidth:100}
                        ,{field:'doctorRole', title: '医生角色',minWidth:100}
                        ,{field:'doctorRoleCode', title: '医生角色代码',minWidth:100}
                    ]],
                    data: []
                };
                if(resultMsg.data){
                    if(resultMsg.data.emr_ich_operation_doctor){
                        tablessczys.data = resultMsg.data.emr_ich_operation_doctor;
                    }
                }
                table.render(tablessczys);

                // 电话
                var tabledh = {
                    elem: '#dhTable',
                    cellMinWidth: 80,
                    even: true,
                    cols: [[
                        {field:'linman', title: '联系人姓名',minWidth:100}
                        ,{field:'linkmanRelation', title: '联系人关系',minWidth:100}
                        ,{field:'telphone', title: '联系电话',minWidth:100}
                        ,{field:'createTime', title: '创建时间',minWidth:100}
                    ]],
                    data: []
                };
                if(resultMsg.data){
                    if(resultMsg.data.emr_ich_tel){
                        tabledh.data = resultMsg.data.emr_ich_tel;
                    }
                }
                table.render(tabledh);

                // 诊断
                var tablezd = {
                    elem: '#zdTable',
                    cellMinWidth: 80,
                    even: true,
                    cols: [[
                        {field:'disease', title: '疾病名称',minWidth:100}
                        ,{field:'diagnosisType', title: '疾病诊断类型',minWidth:100}
                        ,{field:'admissionCondition', title: '入院病情',minWidth:100}
                        ,{field:'diagnosisDate', title: '确诊时间',minWidth:100}
                        ,{field:'createTime', title: '创建时间',minWidth:100}
                    ]],
                    data: []
                };
                if(resultMsg.data){
                    if(resultMsg.data.emr_ich_diagnosis){
                        tablezd.data = resultMsg.data.emr_ich_diagnosis;
                    }
                }
                table.render(tablezd);

                // 过敏药物
                var tablegmyw = {
                    elem: '#gmywTable',
                    cellMinWidth: 80,
                    even: true,
                    cols: [[
                        {field:'medicine', title: '过敏药物名称',minWidth:100}
                        ,{field:'createTime', title: '创建时间',minWidth:100}
                    ]],
                    data: []
                };
                if(resultMsg.data){
                    if(resultMsg.data.emr_ich_allergies){
                        tablegmyw.data = resultMsg.data.emr_ich_allergies;
                    }
                }
                table.render(tablegmyw);
            })
        }
        $(".inHosInfo").on('click','.listInfo',function () {
            $(this).find('.zymxInfo').toggle()
            $(this).find(".iconfont").toggleClass("iconRotate")
        })

        //  住院明细
        function getZyMxDetails(id) {
            var jsonParams = {
                zyId : id
            }
            getAjax('/region/hospital/getHospitalCostList', jsonParams, function (resultMsg) {
               var html=''
               if(resultMsg.data.length>0){
                  var attr = resultMsg.data[0].hospitalOutMingXiList;
                  if(attr.length == 0){
                     html+='<li style="text-align: center;padding: 20px 0;">暂无数据</li>'
                  }else{
                     $.each(attr, function (i, item) {
                        var ketarr = ['drugName', 'drugCode', 'issueDate', 'itemType' ,'itemName', 'id','diagnosisTime','itemCode','itemValue','itemUnit','minValue','maxValue'];
                        for (var r = 0; r < ketarr.length; r++) {
                           if (item[ketarr[r]] == undefined) {
                              item[ketarr[r]] = '暂无数据';
                           }
                        }
                        html+='<li class="font_l listInfo">' +
                           '<div class="">' +
                           '<div class="flag">' +
                           '明' +
                           '</div>' +
                           '<div class="getinfo">' +
                           '<div class="">项目名称&nbsp;'+item.drugName+'</div>' +
                           '<div class="gray font_s">项目类别&nbsp;'+item.drugCode+'</div>' +
                           ' </div>' +
                           ' <div class="dateShow">' +
                           '<span class="gray font_s">'+item.issueDate+'</span>' +
                           '<i class="iconfont icon-youjiantou gray font_s"></i>' +
                           '</div>' +
                           '</div>' +
                           ' <ul class="infoUl consUl zymxInfo">' +
                           '<li class="consLi">' +
                           '<div class="cons-label">项目名称</div>' +
                           '<div class="cons-txt">'+item.drugName+'</div>' +
                           '</li>' +
                           '<li class="consLi">' +
                           '<div class="cons-label">项目类别</div>' +
                           '<div class="cons-txt">'+item.drugCode+'</div>' +
                           '</li>' +
                           '<li class="consLi">' +
                           '<div class="cons-label">项目分类</div>' +
                           '<div class="cons-txt">'+item.drugClassCode+'</div>' +
                           '</li>' +
                           '<li class="consLi">' +
                           '<div class="cons-label">规格</div>' +
                           '<div class="cons-txt">'+item.spec+'</div>' +
                           '</li>' +
                           '<li class="consLi">' +
                           '<div class="cons-label">单位</div>' +
                           '<div class="cons-txt">'+item.unit+'</div>' +
                           '</li>' +
                           '<li class="consLi">' +
                           '<div class="cons-label">数量</div>' +
                           '<div class="cons-txt">'+item.quantity+'</div>' +
                           '</li>' +
                           '<li class="consLi">' +
                           '<div class="cons-label">日期</div>' +
                           '<div class="cons-txt">'+item.issueDate+'</div>' +
                           '</li>' +
                           '</ul>'
                     })
                  }
               }else{
                  html+='<li style="text-align: center;padding: 20px 0;">暂无数据</li>'
               }
               $(".inHosInfo").html(html)
            })
        }

        //  住院诊断
        function getZyzdDetails(id) {
            var jsonParams = {
                zyId : id
            }
            getAjax('/region/hospital/getHospitalZDList', jsonParams, function (resultMsg) {
                var tablezyzl = {
                    elem: '#zyzzTable',
                    cellMinWidth: 80,
                    even: true,
                    cols: [[
                        {field:'diseaseName', title: '诊断名称',minWidth:100}
                        ,{field:'diagnosisTime', title: '诊断日期',minWidth:100}
                    ]],
                    data: []
                };
                if(resultMsg.data){
                    tablezyzl.data = resultMsg.data;
                }
                table.render(tablezyzl);
            })
        }

        //住院医嘱
       function getYz(id){
          var jsonParams = {
             zyId : id
          }
          getAjax('/region/hospital/getHospitalOrderList', jsonParams, function (resultMsg) {
             var html = ''
             var attr= resultMsg.data
             console.log(attr)
             if(attr){
                if(attr.length == 0){
                   html+='<li style="text-align: center;padding: 20px 0;">暂无数据</li>'
                }else {
                   $.each(attr, function (i, item) {
                      html+='<li class="tit_mar clearfix" ids="'+item.id+'">' +
                         '<span class="bg_green font_d health_num fl">'+item.orderType.substring(0, 1)+'</span>' +
                         '<div class="data_plan fl">' +
                         '<div class="a_gray font_e serialNum fontNum">'+item.depName+'<span class="font_s l_gray" style="margin-left: 10px">'+item.effectiveTime+'</span></div>' +
                         '<div class="font_s l_gray fontNum">住院号：'+item.admissionNum+'</div>' +
                         '</div>' +
                         '</li>'
                   })
                }
             }
             $(".yzlist").html(html)
          })
       }
       $(".yzlist").on("click","li",function () {
          $(this).find(".serialNum").removeClass("a_gray").addClass("green")
          $(this).siblings().find(".serialNum").removeClass("green").addClass("a_gray")
          layer.open({
             type:1,
             title: false,
             skin: 'my-layui-layer', //样式类名
             area: ['70%', '600px'],
             closeBtn: 0,
             content: $('#yzBox'),
             btn: ['关闭'],
             btn1: function (index) {
                layer.close(index);
             },
          });
          var id = $(this).attr('ids')
          getYzDetail(id)
       })
       function getYzDetail(id){
           var jsonParams={
              id: id
           }
          getAjax('/region/hospital/getHospitalOrderDetail', jsonParams, function (resultMsg) {
             $("#nameyz").text(resultMsg.data.name);
             $("#inpatientTimesyz").text(resultMsg.data.inpatientTimes);
             $("#admissionNumyz").text(resultMsg.data.admissionNum);
             $("#depNameyz").text(resultMsg.data.depName);
             $("#wardyz").text(resultMsg.data.ward);
             $("#sickbedNum").text(resultMsg.data.sickbedNum);
             var tablezyyz = {
                elem: '#cqyzTable',
                cellMinWidth: 80,
                even: true,
                cols: [[
                   {field: 'drugName', title: '药物名称/项目名称', minWidth: 250, fixed: 'left'}
                   , {field: 'prescribeDate', title: '下嘱日期', minWidth: 130}
                   , {field: 'userQuantity', title: '领用数量', minWidth: 100}
                   , {field: 'drugFrequency', title: '执行频率', minWidth: 100}
                   , {field: 'drugQuantity', title: '用药数量', minWidth: 100}
                   , {field: 'quantity', title: '数量', minWidth: 100}
                   , {field: 'spec', title: '规格', minWidth: 100}
                   , {field: 'orderDosage', title: '医嘱用量', minWidth: 100}
                   , {field: 'executeDate', title: '执行日期', minWidth: 130}
                   , {field: 'stopDate', title: '停嘱日期', minWidth: 130}
                   , {field: 'stage', title: '状态', minWidth: 100}
                   , {field: 'cancelTime', title: '取消时间', minWidth: 130}
                   , {field: 'cancelReason', title: '取消原因', minWidth: 140}
                   , {field: 'doctorName', title: '取消医生姓名', minWidth: 130}
                ]],
                data: []
             };
             if (resultMsg.data.oiList) {
                tablezyyz.data = resultMsg.data.oiList;
             }
             table.render(tablezyyz);
             var str = []
             resultMsg.data.oiDoctorList.forEach(function (item,index) {
                str.push(item.doctorName);
             });
             $("#yzys").text(str.join(','))
             var str2 =[]
             resultMsg.data.oiDepList.forEach(function (item,index) {
                str2.push(item.depName)
             });
             $("#yzks").text(str2.join(','))
          })
       }
    })
})