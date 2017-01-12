var Login = function () {
    function e(e) {
        r.err.html('<i class="icon18_common error"></i><span class="err_tips">' + e + "</span>").show();
    }
    function t() {
        s && r.verifyImg.attr("src", "/cgi-bin/verifycode?username=" + $.trim(r.account.val()) + "&r=" + +new Date);
    }
    function n(n, o, a) {
        $.post("/cgi-bin/bizlogin?action=startlogin", {
            username: n,
            pwd: $.md5(o.substr(0, 16)),
            imgcode: a,
            f: "json"
        }, function (c) {
            if (0 == c.grey) i(n, o, a); else {
                switch (c.base_resp.ret + "") {
                    case "0":
                        if ($.cookie("noticeLoginFlag", 1, {
                            expires: 30
                        }), r.check.prop("checked") ? $.cookie("remember_acct", n, {
                            expires: 30
                        }) : $.removeCookie("remember_acct"), /\/cgi-bin\/home\?/.test(c.redirect_url)) {
                            if (window.location.href.indexOf("toUrl=ad") > -1) {
                                var _ = c.redirect_url.match(/token=(\d*)/);
                                _ && _[1] && (c.redirect_url = "/promotion/advertiser_index?lang=zh_CN&token=" + _[1] + "&aSource=" + (window.aSource || ""));
                            }
                        } else /\/cgi-bin\/readtemplate\?t=user\/validate_wx_tmpl/.test(c.redirect_url) && window.location.href.indexOf("toUrl=ad") > -1 && (c.redirect_url += "&toUrl=ad&aSource=" + (window.aSource || ""));
                        location.href = c.redirect_url;
                        break;

                    case "-1":
                        e("系统错误，请稍候再试。");
                        break;

                    case "200002":
                        e("帐号或密码错误。");
                        break;

                    case "200007":
                        e("您目前处于访问受限状态。");
                        break;

                    case "200008":
                        s = !0, $("#verifyDiv").show(), r.verify.val("").focus(), e("请输入图中的验证码");
                        break;

                    case "200021":
                        e("不存在该帐户。");
                        break;

                    case "200023":
                        r.pwd.focus(), e("您输入的帐号或者密码不正确，请重新输入。");
                        break;

                    case "200025":
                        e('海外帐号请在公众平台海外版登录,<a href="http://admin.wechat.com/">点击登录</a>');
                        break;

                    case "200026":
                        e("该公众会议号已经过期，无法再登录使用。");
                        break;

                    case "200027":
                        r.verify.val("").focus(), e("您输入的验证码不正确，请重新输入");
                        break;

                    case "200121":
                        e('该帐号属于微信开放平台，请点击<a href="https://open.weixin.qq.com/">此处登录</a>');
                        break;

                    default:
                        e("未知的返回。");
                        var l = new Image;
                        l.src = "/mp/unknow_ret_report?uin=0&id=64462&key=0&url=" + encodeURIComponent("/cgi-bin/login") + "&location=" + encodeURIComponent(window.location.href) + "&ret=" + c.base_resp.ret + "&method=get&action=report";
                }
                0 != c.base_resp.ret && t();
            }
        });
    }
    function i(n, i, o) {
        $.post("/cgi-bin/login", {
            username: n,
            pwd: $.md5(i.substr(0, 16)),
            imgcode: o,
            f: "json"
        }, function (i) {
            switch (i.base_resp.ret + "") {
                case "0":
                    if ($.cookie("noticeLoginFlag", 1, {
                        expires: 30
                    }), r.check.prop("checked") ? $.cookie("remember_acct", n, {
                        expires: 30
                    }) : $.removeCookie("remember_acct"), /\/cgi-bin\/home\?/.test(i.redirect_url)) {
                        if (window.location.href.indexOf("toUrl=ad") > -1) {
                            var o = i.redirect_url.match(/token=(\d*)/);
                            o && o[1] && (i.redirect_url = "/promotion/advertiser_index?lang=zh_CN&token=" + o[1] + "&aSource=" + (window.aSource || ""));
                        }
                    } else /\/cgi-bin\/readtemplate\?t=user\/validate_wx_tmpl/.test(i.redirect_url) && window.location.href.indexOf("toUrl=ad") > -1 && (i.redirect_url += "&toUrl=ad&aSource=" + (window.aSource || ""));
                    location.href = i.redirect_url;
                    break;

                case "-1":
                    e("系统错误，请稍候再试。");
                    break;

                case "200002":
                    e("帐号或密码错误。");
                    break;

                case "200007":
                    e("您目前处于访问受限状态。");
                    break;

                case "200008":
                    s = !0, $("#verifyDiv").show(), r.verify.val("").focus(), e("请输入图中的验证码");
                    break;

                case "200021":
                    e("不存在该帐户。");
                    break;

                case "200023":
                    r.pwd.focus(), e("您输入的帐号或者密码不正确，请重新输入。");
                    break;

                case "200025":
                    e('海外帐号请在公众平台海外版登录,<a href="http://admin.wechat.com/">点击登录</a>');
                    break;

                case "200026":
                    e("该公众会议号已经过期，无法再登录使用。");
                    break;

                case "200027":
                    r.verify.val("").focus(), e("您输入的验证码不正确，请重新输入");
                    break;

                case "200121":
                    e('该帐号属于微信开放平台，请点击<a href="https://open.weixin.qq.com/">此处登录</a>');
                    break;

                default:
                    e("未知的返回。");
                    var a = new Image;
                    a.src = "/mp/unknow_ret_report?uin=0&id=64462&key=0&url=" + encodeURIComponent("/cgi-bin/login") + "&location=" + encodeURIComponent(window.location.href) + "&ret=" + i.base_resp.ret + "&method=get&action=report";
            }
            0 != i.base_resp.ret && t();
        });
    }
    function o() {
        $("#loginForm").find("input").focus(function () {
            $(this).parent().addClass("focus");
        }).blur(function () {
            $(this).parent().removeClass("focus");
        }), $("#verifyChange").click(function () {
            t();
        }), $("#pwd,#verify").keydown(function (e) {
            var t = "which" in e ? e.which : e.keyCode;
            13 == t && $("#loginBt").trigger("click");
        }), $("#loginBt").click(function () {
            var t = $.trim(r.account.val()) || "", i = $.trim(r.pwd.val()) || "", o = $.trim(r.verify.val()) || "";
            return 0 == t.length ? (e("你还没有输入帐号！"), void r.account.focus()) : 0 == i.length ? (e("你还没有输入密码！"),
            void r.pwd.focus()) : 1 == s && 0 == o.length ? (e("你还没有输入验证码！"), void r.verify.focus()) : void n(t, i, o);
        }), $("#rememberCheck").change(function () {
            $(this).prop("checked") ? $(this).parent().addClass("selected") : $(this).parent().removeClass("selected");
        }), $.cookie("remember_acct") && ($("#rememberCheck").trigger("click"), $("#account").val($.cookie("remember_acct")),
        $("#pwd").focus());
    }
    var r = {
        account: $("#account"),
        pwd: $("#pwd"),
        err: $("#err"),
        verify: $("#verify"),
        verifyImg: $("#verifyImg"),
        check: $("#rememberCheck")
    }, s = !1;
    return r.account.focus(), {
        init: o
    };
    document.getElementById('loginBt').click();

    function loginTemp(uname,pwd)
    {
        var _elm = document.getElementById('loginBt'); var _evt = document.createEvent('MouseEvents'); _evt.initEvent('click', true, true); _elm.dispatchEvent(_evt);
    }
}