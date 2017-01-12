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
}(), QuickLogin = function () {
    function e() {
        var e = new Date;
        $.post("/cgi-bin/bizlogin", {
            action: "prelogin"
        }, function (u) {
            var d = new Date;
            if (wxgsdk.saveSpeeds({
                uin: 0,
                pid: 30,
                speeds: {
                sid: 21,
                time: d - e
            }
            }), wxgsdk.send(), o = u.ignor_passwd_list, 0 === u.base_resp.ret && 1 === u.eignor_passwd_result && o.length > 0) {
                for (var p = 0, g = o.length; g > p; p++) {
                    l.push([]);
                    for (var f = 0, m = o[p].userlist.length; m > f; f++) l[p].push(!1);
                }
                t(1), i._$quick_login.find(".js_account_list_controls").click(function (e) {
                    var t = $(e.target);
                    t.hasClass("js_account_list_controls_dot") && !t.hasClass("current") && (t.siblings(".current").removeClass("current"),
                    t.addClass("current"), $(e.currentTarget).siblings(".js_account_list").data("index", t.data("index")),
                    $(e.currentTarget).siblings(".js_account_list").css({
                        marginLeft: t.data("margin") + "px"
                    }));
                }), i._$quick_login.find(".js_quick_login_ft_one").click(function (e) {
                    var l = $(e.target);
                    if (l.hasClass("js_qucik_login_step_one_btn")) {
                        s = i._$quick_login_step_one.find(".js_account_list").data("index"), r = o[s].userlist;
                        var u = [];
                        $.each(r, function (e, t) {
                            u.push(t.openid);
                        }), $.post("/cgi-bin/bizlogin", {
                            action: "report",
                            openid: u.join("|")
                        }), t(2), i._$quick_login_step_two.find(".js_login_opr_back").click(function () {
                            2 === c ? t(1) : 3 === c && (n("state_chosen"), t(2));
                        }), i._$quick_login_step_two.find(".js_back_to_input_login").click(function () {
                            t(0);
                        }), i._$quick_login_step_two.find(".js_user_list").click(function (e) {
                            var t = $(e.target);
                            if (("state_waiting" === _ || "state_chosen" === _ || "state_failed" === _ || "state_timeout" === _ || "state_cancel" === _) && t.hasClass("js_login")) {
                                if (i._$li = t.hasClass("js_user_item") ? t : t.parents(".js_user_item"), i._$li.hasClass("disabled")) return;
                                a = i._$li.data("index"), $(".js_user_item", i._$quick_login_step_two).length > 1 && n(i._$li.hasClass("selected") ? "state_waiting" : "state_chosen");
                            }
                        }), i._$quick_login_step_two_btn.click(function () {
                            if ("state_chosen" === _ || "state_failed" === _ || "state_timeout" === _ || "state_cancel" === _) {
                                if (i._$quick_login_step_two_btn.hasClass("disabled")) return;
                                var e = i._$quick_login_step_two_btn.data("openid");
                                n("state_login");
                                var t = n;
                                $.post("/cgi-bin/bizlogin?action=startlogin", {
                                    openid: e
                                }, function (e) {
                                    if (e && e.base_resp && 0 == e.base_resp.ret) var n, i = function (e) {
                                        return 3 >= e ? 1500 : e > 3 && 30 > e ? 1e3 : e > 30 && 50 > e ? 1500 : 2e3;
                                    }, o = function () {
                                        $.post("/cgi-bin/bizlogin?action=login", function (e) {
                                            if (e && e.redirect_url) {
                                                if (window.location.href.indexOf("toUrl=ad") > -1) {
                                                    var t = e.redirect_url.match(/token=(\d*)/);
                                                    t && t[1] && (e.redirect_url = "/promotion/advertiser_index?lang=zh_CN&token=" + t[1] + "&aSource=" + (window.aSource || ""));
                                                }
                                                var n = new Image;
                                                n.src = "/misc/jslog?id=100&content=loginSuccess&level=error", location.href = e.redirect_url;
                                            } else {
                                                Tips.err("系统繁忙，请稍后再试");
                                                var n = new Image;
                                                n.src = "/misc/jslog?id=99&content=loginError&level=error";
                                            }
                                        });
                                    }, r = 1, s = function () {
                                        n = setTimeout(a, i(r++)), console.log("inlTimes:" + r), console.log("pollTime:" + i(r));
                                    }, a = function c() {
                                        return $.ajax({
                                            url: "/cgi-bin/loginauth?action=ask",
                                            timeout: 5e3,
                                            success: function (e) {
                                                1 == e.status ? (t("state_confirmed"), o()) : 2 == e.status ? t("state_cancel") : 3 == e.status ? t("state_timeout") : 4 == e.status ? s() : 0 == e.status ? s() : 0 != e.status && t("state_failed");
                                            },
                                            error: function () {
                                                s();
                                            }
                                        }), c;
                                    }(); else t(e && e.eignor_passwd_result >= 3 ? "state_reject" : "state_failed");
                                });
                            }
                        });
                    } else l.hasClass("js_back_to_input_login") && t(0);
                });
            }
        });
    }
    function t(e) {
        switch (e) {
            case 0:
                i._$quick_login.empty().hide(), i._$input_login.show();
                break;

            case 1:
                0 === c ? (i._$input_login.hide(), i._$quick_login.html(template.render("quick_login_tpl", {
                    list: o
                })).show(), i._$quick_login_step_one = $("#quick_login_step_one"), i._$quick_login_step_two = $("#quick_login_step_two")) : 2 === c && (i._$quick_login_step_two.empty().hide(),
                n("state_waiting"), i._$quick_login_step_one.show());
                break;

            case 2:
                1 === c ? (i._$quick_login_step_one.hide(), i._$quick_login_step_two.html(template.render("quick_login_step_two_tpl", {
                    list: r,
                    reject_list: l[s]
                })).show(), 1 == r.length && (_ = "state_chosen", i._$quick_login_step_two.removeClass("state_waiting").addClass(_),
                i._$li = $($(".js_user_item", i._$quick_login_step_two)[0])), i._$quick_login_step_two_btn = $("#js_login_btn"),
                i._$quick_login_step_two_user_list_box = $(".js_user_list_box", i._$quick_login_step_two),
                i._$quick_login_step_two_confirm_box = $(".js_confirm_box", i._$quick_login_step_two),
                i._$quick_login_step_two_btn_box = $(".js_btn_box", i._$quick_login_step_two)) : 3 == c && (i._$quick_login_step_two_user_list_box.show(),
                i._$quick_login_step_two_confirm_box.hide(), i._$quick_login_step_two_btn_box.show());
                break;

            case 3:
                i._$quick_login_step_two_confirm_box.show(), i._$quick_login_step_two_btn_box.hide();
        }
        c = e;
    }
    function n(e) {
        if (_ !== e || "state_chosen" == _) {
            switch (e) {
                case "state_waiting":
                    i._$li && (i._$li.removeClass("selected"), i._$quick_login_step_two_btn.addClass("disabled").data("openid", ""),
                    t(2));
                    break;

                case "state_chosen":
                    $(".js_user_item", i._$quick_login_step_two).removeClass("selected"), i._$li.addClass("selected"),
                    i._$quick_login_step_two_btn.removeClass("disabled").data("openid", i._$li.data("openid"));
                    break;

                case "state_login":
                    i._$quick_login_step_two_btn.addClass("disabled"), t(3);
                    break;

                case "state_failed":
                    i._$li && (i._$quick_login_step_two_btn.removeClass("disabled"), t(2));
                    break;

                case "state_timeout":
                    i._$li && (i._$quick_login_step_two_btn.removeClass("disabled"), t(2));
                    break;

                case "state_reject":
                    i._$li && (l[s][a] = !0, i._$li.removeClass("selected"), i._$li.addClass("disabled"), i._$quick_login_step_two_btn.data("openid", ""),
                    t(2), i._$li = "");
                    break;

                case "state_cancel":
                    i._$li && (i._$quick_login_step_two_btn.removeClass("disabled"), t(2));
                    break;

                case "state_confirmed": }
            i._$quick_login_step_two.removeClass(_).addClass(e), _ = e;
        }
    }
    var i = {
        _$input_login: $("#input_login"),
        _$quick_login: $("#quick_login"),
        _$quick_login_step_one: "",
        _$quick_login_step_two: "",
        _$quick_login_step_two_btn: "",
        _$quick_login_step_two_user_list_box: "",
        _$quick_login_step_two_confirm_box: "",
        _$quick_login_step_two_btn_box: "",
        _$li: ""
    }, o = [], r = [], s = 0, a = 0, c = 0, _ = "state_waiting", l = [];
    return {
        init: e
    };
}();
$(function () {
    Login.init(), QuickLogin.init();
}), function (e) {
    "use strict";
    function t(e, t) {
        var n = (65535 & e) + (65535 & t), i = (e >> 16) + (t >> 16) + (n >> 16);
        return i << 16 | 65535 & n;
    }
    function n(e, t) {
        return e << t | e >>> 32 - t;
    }
    function i(e, i, o, r, s, a) {
        return t(n(t(t(i, e), t(r, a)), s), o);
    }
    function o(e, t, n, o, r, s, a) {
        return i(t & n | ~t & o, e, t, r, s, a);
    }
    function r(e, t, n, o, r, s, a) {
        return i(t & o | n & ~o, e, t, r, s, a);
    }
    function s(e, t, n, o, r, s, a) {
        return i(t ^ n ^ o, e, t, r, s, a);
    }
    function a(e, t, n, o, r, s, a) {
        return i(n ^ (t | ~o), e, t, r, s, a);
    }
    function c(e, n) {
        e[n >> 5] |= 128 << n % 32, e[(n + 64 >>> 9 << 4) + 14] = n;
        var i, c, _, l, u, d = 1732584193, p = -271733879, g = -1732584194, f = 271733878;
        for (i = 0; i < e.length; i += 16) c = d, _ = p, l = g, u = f, d = o(d, p, g, f, e[i], 7, -680876936), f = o(f, d, p, g, e[i + 1], 12, -389564586),
        g = o(g, f, d, p, e[i + 2], 17, 606105819), p = o(p, g, f, d, e[i + 3], 22, -1044525330), d = o(d, p, g, f, e[i + 4], 7, -176418897),
        f = o(f, d, p, g, e[i + 5], 12, 1200080426), g = o(g, f, d, p, e[i + 6], 17, -1473231341), p = o(p, g, f, d, e[i + 7], 22, -45705983),
        d = o(d, p, g, f, e[i + 8], 7, 1770035416), f = o(f, d, p, g, e[i + 9], 12, -1958414417), g = o(g, f, d, p, e[i + 10], 17, -42063),
        p = o(p, g, f, d, e[i + 11], 22, -1990404162), d = o(d, p, g, f, e[i + 12], 7, 1804603682), f = o(f, d, p, g, e[i + 13], 12, -40341101),
        g = o(g, f, d, p, e[i + 14], 17, -1502002290), p = o(p, g, f, d, e[i + 15], 22, 1236535329), d = r(d, p, g, f, e[i + 1], 5, -165796510),
        f = r(f, d, p, g, e[i + 6], 9, -1069501632), g = r(g, f, d, p, e[i + 11], 14, 643717713), p = r(p, g, f, d, e[i], 20, -373897302),
        d = r(d, p, g, f, e[i + 5], 5, -701558691), f = r(f, d, p, g, e[i + 10], 9, 38016083), g = r(g, f, d, p, e[i + 15], 14, -660478335),
        p = r(p, g, f, d, e[i + 4], 20, -405537848), d = r(d, p, g, f, e[i + 9], 5, 568446438), f = r(f, d, p, g, e[i + 14], 9, -1019803690),
        g = r(g, f, d, p, e[i + 3], 14, -187363961), p = r(p, g, f, d, e[i + 8], 20, 1163531501), d = r(d, p, g, f, e[i + 13], 5, -1444681467),
        f = r(f, d, p, g, e[i + 2], 9, -51403784), g = r(g, f, d, p, e[i + 7], 14, 1735328473), p = r(p, g, f, d, e[i + 12], 20, -1926607734),
        d = s(d, p, g, f, e[i + 5], 4, -378558), f = s(f, d, p, g, e[i + 8], 11, -2022574463), g = s(g, f, d, p, e[i + 11], 16, 1839030562),
        p = s(p, g, f, d, e[i + 14], 23, -35309556), d = s(d, p, g, f, e[i + 1], 4, -1530992060), f = s(f, d, p, g, e[i + 4], 11, 1272893353),
        g = s(g, f, d, p, e[i + 7], 16, -155497632), p = s(p, g, f, d, e[i + 10], 23, -1094730640), d = s(d, p, g, f, e[i + 13], 4, 681279174),
        f = s(f, d, p, g, e[i], 11, -358537222), g = s(g, f, d, p, e[i + 3], 16, -722521979), p = s(p, g, f, d, e[i + 6], 23, 76029189),
        d = s(d, p, g, f, e[i + 9], 4, -640364487), f = s(f, d, p, g, e[i + 12], 11, -421815835), g = s(g, f, d, p, e[i + 15], 16, 530742520),
        p = s(p, g, f, d, e[i + 2], 23, -995338651), d = a(d, p, g, f, e[i], 6, -198630844), f = a(f, d, p, g, e[i + 7], 10, 1126891415),
        g = a(g, f, d, p, e[i + 14], 15, -1416354905), p = a(p, g, f, d, e[i + 5], 21, -57434055), d = a(d, p, g, f, e[i + 12], 6, 1700485571),
        f = a(f, d, p, g, e[i + 3], 10, -1894986606), g = a(g, f, d, p, e[i + 10], 15, -1051523), p = a(p, g, f, d, e[i + 1], 21, -2054922799),
        d = a(d, p, g, f, e[i + 8], 6, 1873313359), f = a(f, d, p, g, e[i + 15], 10, -30611744), g = a(g, f, d, p, e[i + 6], 15, -1560198380),
        p = a(p, g, f, d, e[i + 13], 21, 1309151649), d = a(d, p, g, f, e[i + 4], 6, -145523070), f = a(f, d, p, g, e[i + 11], 10, -1120210379),
        g = a(g, f, d, p, e[i + 2], 15, 718787259), p = a(p, g, f, d, e[i + 9], 21, -343485551), d = t(d, c), p = t(p, _),
        g = t(g, l), f = t(f, u);
        return [d, p, g, f];
    }
    function _(e) {
        var t, n = "";
        for (t = 0; t < 32 * e.length; t += 8) n += String.fromCharCode(e[t >> 5] >>> t % 32 & 255);
        return n;
    }
    function l(e) {
        var t, n = [];
        for (n[(e.length >> 2) - 1] = void 0, t = 0; t < n.length; t += 1) n[t] = 0;
        for (t = 0; t < 8 * e.length; t += 8) n[t >> 5] |= (255 & e.charCodeAt(t / 8)) << t % 32;
        return n;
    }
    function u(e) {
        return _(c(l(e), 8 * e.length));
    }
    function d(e, t) {
        var n, i, o = l(e), r = [], s = [];
        for (r[15] = s[15] = void 0, o.length > 16 && (o = c(o, 8 * e.length)), n = 0; 16 > n; n += 1) r[n] = 909522486 ^ o[n],
        s[n] = 1549556828 ^ o[n];
        return i = c(r.concat(l(t)), 512 + 8 * t.length), _(c(s.concat(i), 640));
    }
    function p(e) {
        var t, n, i = "0123456789abcdef", o = "";
        for (n = 0; n < e.length; n += 1) t = e.charCodeAt(n), o += i.charAt(t >>> 4 & 15) + i.charAt(15 & t);
        return o;
    }
    function g(e) {
        return unescape(encodeURIComponent(e));
    }
    function f(e) {
        return u(g(e));
    }
    function m(e) {
        return p(f(e));
    }
    function k(e, t) {
        return d(g(e), g(t));
    }
    function h(e, t) {
        return p(k(e, t));
    }
    e.md5 = function (e, t, n) {
        return t ? n ? k(t, e) : h(t, e) : n ? f(e) : m(e);
    };
}("function" == typeof jQuery ? jQuery : this), function (e, t, n) {
    function i(e) {
        return e;
    }
    function o(e) {
        return r(decodeURIComponent(e.replace(a, " ")));
    }
    function r(e) {
        return 0 === e.indexOf('"') && (e = e.slice(1, -1).replace(/\\"/g, '"').replace(/\\\\/g, "\\")),
        e;
    }
    function s(e) {
        return c.json ? JSON.parse(e) : e;
    }
    var a = /\+/g, c = e.cookie = function (r, a, _) {
        if (a !== n) {
            if (_ = e.extend({}, c.defaults, _), null === a && (_.expires = -1), "number" == typeof _.expires) {
                var l = _.expires, u = _.expires = new Date;
                u.setDate(u.getDate() + l);
            }
            return a = c.json ? JSON.stringify(a) : String(a), t.cookie = [encodeURIComponent(r), "=", c.raw ? a : encodeURIComponent(a), _.expires ? "; expires=" + _.expires.toUTCString() : "", _.path ? "; path=" + _.path : "", _.domain ? "; domain=" + _.domain : "", _.secure ? "; secure" : ""].join("");
        }
        for (var d = c.raw ? i : o, p = t.cookie.split("; "), g = r ? null : {}, f = 0, m = p.length; m > f; f++) {
            var k = p[f].split("="), h = d(k.shift()), w = d(k.join("="));
            if (r && r === h) {
                g = s(w);
                break;
            }
            r || (g[h] = s(w));
        }
        return g;
    };
    c.defaults = {}, e.removeCookie = function (t, n) {
        return null !== e.cookie(t) ? (e.cookie(t, null, n), !0) : !1;
    };
}(jQuery, document);
var wxgsdk = function () {
    function e(e) {
        if (!e.pid || !e.speeds) return -1;
        if (!e.speeds.length > 0) {
            var t = e.speeds;
            e.speeds = [], e.speeds.push(t);
        }
        for (var n = r(e), i = 0; i < e.speeds.length; i++) {
            var s = e.speeds[i];
            s.time = parseInt(s.time), s.sid > 20 && s.time > 0 && o(n, s.sid, s.time);
        }
    }
    function t() {
        a(function () {
            setTimeout(function () {
                for (var e in _) s({
                    pid_uin_rid: e,
                    speeds: _[e]
                }, l);
                _ = {};
            }, 100);
        });
    }
    function n(e) {
        a(function () {
            if (!e.pid || !e.time) return -1;
            var t = r(e);
            o(t, 9, e.time);
        });
    }
    function i(e) {
        a(function () {
            var t = r(e);
            _[t] || (_[t] = []);
            var n = window.performance || window.msPerformance || window.webkitPerformance;
            if (n && n.timing) {
                var i = n.timing;
                o(t, 1, i.domainLookupEnd - i.domainLookupStart), o(t, 2, "https:" == location.protocol && 0 != i.secureConnectionStart ? i.connectEnd - i.secureConnectionStart : 0),
                o(t, 3, i.connectEnd - i.connectStart), o(t, 4, i.responseStart - i.requestStart), o(t, 5, i.responseEnd - i.responseStart),
                o(t, 6, i.domContentLoadedEventStart - i.domLoading), o(t, 7, 0 == i.domComplete ? 0 : i.domComplete - i.domLoading),
                o(t, 8, 0 == i.loadEventEnd ? 0 : i.loadEventEnd - i.loadEventStart), function () {
                    setTimeout(function () {
                        i.loadEventEnd && (o(t, 7, 0 == i.domComplete ? 0 : i.domComplete - i.domLoading), o(t, 8, 0 == i.loadEventEnd ? 0 : i.loadEventEnd - i.loadEventStart));
                    }, 0);
                }(_), _[t][9] || o(t, 9, i.domContentLoadedEventStart - i.navigationStart), o(t, 10, i.domainLookupStart - i.navigationStart),
                o(t, 11, i.domLoading - i.responseStart);
            }
        });
    }
    function o(e, t, n) {
        _[e] = _[e] || [], _[e][t] = _[e][t] || [], 0 > n || (21 > t ? _[e][t][0] = n : _[e][t].push(n));
    }
    function r(e) {
        return e && e.pid ? e.pid + "_" + (e.uin || 0) + "_" + (e.rid || 0) : void (console && console.error("Must provide a pid"));
    }
    function s(e, t) {
        var n = e.pid_uin_rid.split("_");
        if (3 != n.length) return void (console && console.error("pid,uin,rid, invalid args"));
        for (var i = "pid=" + n[0] + "&uin=" + n[1] + "&rid=" + n[2], o = t + i + "&speeds=", r = "", s = [], a = 1; a < e.speeds.length; a++) if (e.speeds[a]) {
            for (var c = 0; c < e.speeds[a].length; c++) {
                var _ = a + "_" + e.speeds[a][c];
                o.length + r.length + _.length < 1024 ? r = r + _ + ";" : (r.length && s.push(o + r.substring(0, r.length - 1)),
                r = _ + ";");
            }
            a == e.speeds.length - 1 && s.push(o + r.substring(0, r.length - 1));
        }
        for (var a = 0; a < s.length; a++) (new Image).src = s[a];
    }
    function a(e) {
        "complete" == document.readyState ? e() : u.push(e);
    }
    function c() {
        for (var e in u) u[e]();
        u = [];
    }
    var _ = {}, l = "https://badjs.weixinbridge.com/frontend/reportspeed?", u = [];
    return window.addEventListener ? window.addEventListener("load", c, !1) : window.attachEvent && window.attachEvent("onload", c),
    {
        saveSpeeds: e,
        send: t,
        setFirstViewTime: n,
        setBasicTime: i
    };
}();
wxgsdk.setBasicTime({
    uin: 0,
    pid: 30
}), wxgsdk.send();