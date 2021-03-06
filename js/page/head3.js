document.writeln("<!--用来生成js文件-->");
document.writeln("<!DOCTYPE html>");
document.writeln("<html lang=\'en\'>");
document.writeln("<head>");
document.writeln("    <meta charset=\'utf-8\'>");
document.writeln("    <title>公众惠民平台</title>");
document.writeln("    <meta http-equiv=\'X-UA-Compatible\' content=\'IE=edge\'>");
document.writeln("    <meta name=\'viewport\' content=\'width=device-width, initial-scale=1\'>");
document.writeln("    <script src=\'../js/jquery-1.8.0.js\'></script>");
document.writeln("    <link rel=\'stylesheet\' href=\'../js/layui/css/layui.css\'>");
document.writeln("    <!-- 让IE8/9支持媒体查询，从而兼容栅格 -->");
document.writeln("    <!--[if lt IE 9]>");
document.writeln("    <script src=\'../js/html5shiv.min.js\'></script>");
document.writeln("    <script src=\'../js/respond.min.js\'></script>");
document.writeln("    <script src=\'../js/PIE/PIE.js\'></script>");
document.writeln("    <![endif]-->");
document.writeln("    <link rel=\'stylesheet\' href=\'../css/base.css\'>");
document.writeln("    <link rel=\'stylesheet\' href=\'../css/reset.css\'>");
document.writeln("    <link rel=\'stylesheet\' href=\'../css/page/head.css\'>");
document.writeln("    <script src=\'../js/layui/layui.js\'></script>");
document.writeln("    <script src=\'../js/page/public_head.js\'></script>");
document.writeln("    <link rel=\'stylesheet\' href=\'../icon/iconfont.css\'>");
// document.writeln("    <script src=\'../icon/iconfont.js\'></script>");
document.writeln("     <script src=\"http://pv.sohu.com/cityjson?ie=utf-8\"></script>");
document.writeln("    <script src=\'../js/loginValidate.js\'></script>");
document.writeln("    <style>");
document.writeln("        .headinp-inp, .headinp-inp input, .headinp-btn, .layui-layer-login.layui-layer {");
document.writeln("            behavior: url(../js/PIE/PIE.htc);");
document.writeln("            position: relative;");
document.writeln("        }");
document.writeln("    </style>");
document.writeln("</head>");
document.writeln("<body>");
document.writeln("    <div class=\'head-box\'>");
document.writeln("        <div class=\'head-bar layui-row\'>");
document.writeln("            <div class=\'body-container\'>");
document.writeln("                <div class=\'fl leftTop\'>欢迎访问马龙公众惠民平台</div>");
document.writeln("                <div class=\'fr\'>");
document.writeln("                    <div class=\'fl login-box weilogin\'>");
// document.writeln("                        请");
document.writeln("                        <span class=\'cursorP b_gray\' id=\'loginBtn\' style='margin-left: 30px;'>登录</span>");
// document.writeln("                        或");
document.writeln("                        <a href='register.html' class=\'cursorP b_gray\' id=\'registerBtn\' style='margin-left: 30px;'>注册</a>");
document.writeln("                    </div>");
document.writeln("                    <div class=\'fl login-box yilogin cursorP\'>");
document.writeln("                        <img src='../img/photo.png' style='width: 30px;height: 30px'>");
document.writeln("                        <span class=\'blue username\'>阿花</span>");
document.writeln("                        <i class=\"layui-icon\">&#xe625;</i>");
document.writeln("<div class=\'switch_box\'>");
document.writeln("            <ul class=\'login-ul login-customer\'>");
// document.writeln("                <li class=\'login-li\'>用户名</li>");
// document.writeln("                <li class=\'login-li\'>用户名</li>");
document.writeln("            </ul>");
// document.writeln("            <hr>");
document.writeln("            <ul class=\'login-ul\'>");
document.writeln("                <li class=\'login-li\' id='setting'>账号设置</li>");
document.writeln("                <li class=\'login-li\' id='logout'>退出</li>");
document.writeln("            </ul>");
document.writeln("        </div>");
document.writeln("                    </div>");
document.writeln("                </div>");
document.writeln("                <div class=\'fr about-box\'>");
document.writeln("                    <div><a href=\'aboutUs.html?tabs=1\' class='b_gray'>关于我们</a></div>");
document.writeln("                    <span>&nbsp;|&nbsp;</span>");
document.writeln("                    <div><a href=\'aboutUs.html?tabs=2\' class='b_gray'>联系我们</a></div>");
document.writeln("                    <span>&nbsp;|&nbsp;</span>");
document.writeln("                    <div><a href=\'aboutUs.html?tabs=3\' class='b_gray'>咨询投诉</a></div>");
document.writeln("                    <div class=\'clear\'></div>");
document.writeln("                </div>");
document.writeln("                <div class=\'clear\'></div>");
document.writeln("            </div>");
document.writeln("        </div>");
document.writeln("        <div class=\'head-tit layui-row\'>");
document.writeln("            <div class=\'headTit-inner body-container\'>");
document.writeln("                <div class=\'fl headTit-left\'>");
document.writeln("                    <div class=\'logo fl\'>");
document.writeln("                    <a href='index.html'>");
document.writeln("                        <img src=\'../img/logo.png\' id='logoImg' alt=\'\'>");
document.writeln("                    </a>");
document.writeln("                    </div>");
document.writeln("                    <div class=\'tit-txt fl\'>");
document.writeln("                        <div class=\'head-tit-bg\'>居民<span class='green' style='font-size: 30px'>健康</span>服务管理平台</div>");
document.writeln("                        <div class=\'head-tit-sm\'>Resident Health Service Management Platform</div>");
document.writeln("                    </div>");
document.writeln("                </div>");
document.writeln("                <div class=\'fl headTit-right layui-row\'>");
document.writeln("                    <div class=\'layui-row\'>");
document.writeln("<form class=\"layui-form\" action=\"\">");
document.writeln("                        <div class=\'headinp-box\'>");
document.writeln("                            <div class=\'headinp-inp\'>");
document.writeln("<div class=\'layui-row\' style='display: flex;'>");
document.writeln("    <div style='width: 110px;'>");
document.writeln("      <select name=\'interest\' lay-filter=\'aihao\' id='searchSel' style='width: 100px;'>");
document.writeln("        <option value=\'0\'>全部</option>");
document.writeln("        <option value=\'1\'>便民服务</option>");
document.writeln("        <option value=\'2\'>政策法规</option>");
document.writeln("        <option value=\'3\'>健康资讯</option>");
document.writeln("        <option value=\'4\'>办事指南</option>");
document.writeln("      </select>");
document.writeln("    </div>");
document.writeln("    <div style='flex: 1;'>");
document.writeln("        <input type=\'text\' name=\'phone\' autocomplete=\'off\' id='searchInp' class=\'layui-input\' style='padding-right: 10px;'>");
document.writeln("    </div>");
document.writeln("  </div>");
document.writeln("                            </div>");
document.writeln("                            <div class=\'headinp-btn layui-col-md2\' id=\'searchBtn\'>");
document.writeln("                            <span class=\"iconfont icon-sousuo\"></span>");
document.writeln("                                搜索");
document.writeln("                            </div>");
document.writeln("                        </div>");
document.writeln("    </form>");
document.writeln("                    </div>");
document.writeln("                </div>");
document.writeln("                <a href='index.html' class='fr a_gray' style='font-size: 24px;margin-top: 10px;'>网站首页</a>");
document.writeln("                <div class=\'clear\'></div>");
document.writeln("            </div>");
document.writeln("        </div>");
document.writeln("    </div>");
document.writeln("</body>");
document.writeln("</html>");