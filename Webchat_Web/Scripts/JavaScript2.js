define("biz_common/moment.js", [], function (t, e, n) {
    function s(t, e) {
        return function (n) {
            return c(t.call(this, n), e);
        };
    }
    function r(t) {
        return function (e) {
            return this.lang().ordinal(t.call(this, e));
        };
    }
    function a() { }
    function i(t) {
        u(this, t);
    }
    function o(t) {
        var e = this._data = {}, n = t.years || t.year || t.y || 0, s = t.months || t.month || t.M || 0, r = t.weeks || t.week || t.w || 0, a = t.days || t.day || t.d || 0, i = t.hours || t.hour || t.h || 0, o = t.minutes || t.minute || t.m || 0, u = t.seconds || t.second || t.s || 0, c = t.milliseconds || t.millisecond || t.ms || 0;
        this._milliseconds = c + 1e3 * u + 6e4 * o + 36e5 * i, this._days = a + 7 * r, this._months = s + 12 * n, e.milliseconds = c % 1e3,
        u += d(c / 1e3), e.seconds = u % 60, o += d(u / 60), e.minutes = o % 60, i += d(o / 60), e.hours = i % 24, a += d(i / 24),
        a += 7 * r, e.days = a % 30, s += d(a / 30), e.months = s % 12, n += d(s / 12), e.years = n;
    }
    function u(t, e) {
        for (var n in e) e.hasOwnProperty(n) && (t[n] = e[n]);
        return t;
    }
    function d(t) {
        return 0 > t ? Math.ceil(t) : Math.floor(t);
    }
    function c(t, e) {
        for (var n = t + ""; n.length < e;) n = "0" + n;
        return n;
    }
    function h(t, e, n) {
        var s, r = e._milliseconds, a = e._days, i = e._months;
        r && t._d.setTime(+t + r * n), a && t.date(t.date() + a * n), i && (s = t.date(), t.date(1).month(t.month() + i * n).date(Math.min(s, t.daysInMonth())));
    }
    function f(t) {
        return "[object Array]" === Object.prototype.toString.call(t);
    }
    function l(t, e) {
        var n, s = Math.min(t.length, e.length), r = Math.abs(t.length - e.length), a = 0;
        for (n = 0; s > n; n++) ~~t[n] !== ~~e[n] && a++;
        return a + r;
    }
    function _(t, e) {
        return e.abbr = t, A[t] || (A[t] = new a), A[t].set(e), A[t];
    }
    function m(e) {
        return e ? (!A[e] && Z && t("./lang/" + e), A[e]) : C.fn._lang;
    }
    function M(t) {
        return t.match(/\[.*\]/) ? t.replace(/^\[|\]$/g, "") : t.replace(/\\/g, "");
    }
    function y(t) {
        var e, n, s = t.match(E);
        for (e = 0, n = s.length; n > e; e++) s[e] = ie[s[e]] ? ie[s[e]] : M(s[e]);
        return function (r) {
            var a = "";
            for (e = 0; n > e; e++) a += "function" == typeof s[e].call ? s[e].call(r, t) : s[e];
            return a;
        };
    }
    function Y(t, e) {
        function n(e) {
            return t.lang().longDateFormat(e) || e;
        }
        for (var s = 5; s-- && J.test(e) ;) e = e.replace(J, n);
        return se[e] || (se[e] = y(e)), se[e](t);
    }
    function D(t) {
        switch (t) {
            case "DDDD":
                return $;

            case "YYYY":
                return I;

            case "YYYYY":
                return X;

            case "S":
            case "SS":
            case "SSS":
            case "DDD":
                return N;

            case "MMM":
            case "MMMM":
            case "dd":
            case "ddd":
            case "dddd":
            case "a":
            case "A":
                return j;

            case "X":
                return G;

            case "Z":
            case "ZZ":
                return R;

            case "T":
                return B;

            case "MM":
            case "DD":
            case "YY":
            case "HH":
            case "hh":
            case "mm":
            case "ss":
            case "M":
            case "D":
            case "d":
            case "H":
            case "h":
            case "m":
            case "s":
                return V;

            default:
                return new RegExp(t.replace("\\", ""));
        }
    }
    function p(t, e, n) {
        var s, r = n._a;
        switch (t) {
            case "M":
            case "MM":
                r[1] = null == e ? 0 : ~~e - 1;
                break;

            case "MMM":
            case "MMMM":
                s = m(n._l).monthsParse(e), null != s ? r[1] = s : n._isValid = !1;
                break;

            case "D":
            case "DD":
            case "DDD":
            case "DDDD":
                null != e && (r[2] = ~~e);
                break;

            case "YY":
                r[0] = ~~e + (~~e > 68 ? 1900 : 2e3);
                break;

            case "YYYY":
            case "YYYYY":
                r[0] = ~~e;
                break;

            case "a":
            case "A":
                n._isPm = "pm" === (e + "").toLowerCase();
                break;

            case "H":
            case "HH":
            case "h":
            case "hh":
                r[3] = ~~e;
                break;

            case "m":
            case "mm":
                r[4] = ~~e;
                break;

            case "s":
            case "ss":
                r[5] = ~~e;
                break;

            case "S":
            case "SS":
            case "SSS":
                r[6] = ~~(1e3 * ("0." + e));
                break;

            case "X":
                n._d = new Date(1e3 * parseFloat(e));
                break;

            case "Z":
            case "ZZ":
                n._useUTC = !0, s = (e + "").match(te), s && s[1] && (n._tzh = ~~s[1]), s && s[2] && (n._tzm = ~~s[2]),
                s && "+" === s[0] && (n._tzh = -n._tzh, n._tzm = -n._tzm);
        }
        null == e && (n._isValid = !1);
    }
    function g(t) {
        var e, n, s = [];
        if (!t._d) {
            for (e = 0; 7 > e; e++) t._a[e] = s[e] = null == t._a[e] ? 2 === e ? 1 : 0 : t._a[e];
            s[3] += t._tzh || 0, s[4] += t._tzm || 0, n = new Date(0), t._useUTC ? (n.setUTCFullYear(s[0], s[1], s[2]),
            n.setUTCHours(s[3], s[4], s[5], s[6])) : (n.setFullYear(s[0], s[1], s[2]), n.setHours(s[3], s[4], s[5], s[6])),
            t._d = n;
        }
    }
    function w(t) {
        var e, n, s = t._f.match(E), r = t._i;
        for (t._a = [], e = 0; e < s.length; e++) n = (D(s[e]).exec(r) || [])[0], n && (r = r.slice(r.indexOf(n) + n.length)),
        ie[s[e]] && p(s[e], n, t);
        t._isPm && t._a[3] < 12 && (t._a[3] += 12), t._isPm === !1 && 12 === t._a[3] && (t._a[3] = 0), g(t);
    }
    function T(t) {
        for (var e, n, s, r, a = 99; t._f.length;) {
            if (e = u({}, t), e._f = t._f.pop(), w(e), n = new i(e), n.isValid()) {
                s = n;
                break;
            }
            r = l(e._a, n.toArray()), a > r && (a = r, s = n);
        }
        u(t, s);
    }
    function k(t) {
        var e, n = t._i;
        if (q.exec(n)) {
            for (t._f = "YYYY-MM-DDT", e = 0; 4 > e; e++) if (Q[e][1].exec(n)) {
                t._f += Q[e][0];
                break;
            }
            R.exec(n) && (t._f += " Z"), w(t);
        } else t._d = new Date(n);
    }
    function v(t) {
        var e = t._i, n = P.exec(e);
        void 0 === e ? t._d = new Date : n ? t._d = new Date(+n[1]) : "string" == typeof e ? k(t) : f(e) ? (t._a = e.slice(0),
        g(t)) : t._d = new Date(e instanceof Date ? +e : e);
    }
    function S(t, e, n, s, r) {
        return r.relativeTime(e || 1, !!n, t, s);
    }
    function L(t, e, n) {
        var s = U(Math.abs(t) / 1e3), r = U(s / 60), a = U(r / 60), i = U(a / 24), o = U(i / 365), u = 45 > s && ["s", s] || 1 === r && ["m"] || 45 > r && ["mm", r] || 1 === a && ["h"] || 22 > a && ["hh", a] || 1 === i && ["d"] || 25 >= i && ["dd", i] || 45 >= i && ["M"] || 345 > i && ["MM", U(i / 30)] || 1 === o && ["y"] || ["yy", o];
        return u[2] = e, u[3] = t > 0, u[4] = n, S.apply({}, u);
    }
    function b(t, e, n) {
        var s = n - e, r = n - t.day();
        return r > s && (r -= 7), s - 7 > r && (r += 7), Math.ceil(C(t).add("d", r).dayOfYear() / 7);
    }
    function F(t) {
        var e = t._i, n = t._f;
        return null === e || "" === e ? null : ("string" == typeof e && (t._i = e = m().preparse(e)), C.isMoment(e) ? (t = u({}, e),
        t._d = new Date(+e._d)) : n ? f(n) ? T(t) : w(t) : v(t), new i(t));
    }
    function H(t, e) {
        C.fn[t] = C.fn[t + "s"] = function (t) {
            var n = this._isUTC ? "UTC" : "";
            return null != t ? (this._d["set" + n + e](t), this) : this._d["get" + n + e]();
        };
    }
    function O(t) {
        C.duration.fn[t] = function () {
            return this._data[t];
        };
    }
    function z(t, e) {
        C.duration.fn["as" + t] = function () {
            return +this / e;
        };
    }
    for (var C, W, x = "2.0.0", U = Math.round, A = {}, Z = "undefined" != typeof n && n.exports, P = /^\/?Date\((\-?\d+)/i, E = /(\[[^\[]*\])|(\\)?(Mo|MM?M?M?|Do|DDDo|DD?D?D?|ddd?d?|do?|w[o|w]?|W[o|W]?|YYYYY|YYYY|YY|a|A|hh?|HH?|mm?|ss?|SS?S?|X|zz?|ZZ?|.)/g, J = /(\[[^\[]*\])|(\\)?(LT|LL?L?L?|l{1,4})/g, V = /\d\d?/, N = /\d{1,3}/, $ = /\d{3}/, I = /\d{1,4}/, X = /[+\-]?\d{1,6}/, j = /[0-9]*[a-z\u00A0-\u05FF\u0700-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]+|[\u0600-\u06FF]+\s*?[\u0600-\u06FF]+/i, R = /Z|[\+\-]\d\d:?\d\d/i, B = /T/i, G = /[\+\-]?\d+(\.\d{1,3})?/, q = /^\s*\d{4}-\d\d-\d\d((T| )(\d\d(:\d\d(:\d\d(\.\d\d?\d?)?)?)?)?([\+\-]\d\d:?\d\d)?)?/, K = "YYYY-MM-DDTHH:mm:ssZ", Q = [["HH:mm:ss.S", /(T| )\d\d:\d\d:\d\d\.\d{1,3}/], ["HH:mm:ss", /(T| )\d\d:\d\d:\d\d/], ["HH:mm", /(T| )\d\d:\d\d/], ["HH", /(T| )\d\d/]], te = /([\+\-]|\d\d)/gi, ee = "Month|Date|Hours|Minutes|Seconds|Milliseconds".split("|"), ne = {
        Milliseconds: 1,
        Seconds: 1e3,
        Minutes: 6e4,
        Hours: 36e5,
        Days: 864e5,
        Months: 2592e6,
        Years: 31536e6
    }, se = {}, re = "DDD w W M D d".split(" "), ae = "M D H h m s w W".split(" "), ie = {
        M: function () {
    return this.month() + 1;
    },
        MMM: function (t) {
    return this.lang().monthsShort(this, t);
    },
        MMMM: function (t) {
    return this.lang().months(this, t);
    },
        D: function () {
    return this.date();
    },
        DDD: function () {
    return this.dayOfYear();
    },
        d: function () {
    return this.day();
    },
        dd: function (t) {
    return this.lang().weekdaysMin(this, t);
    },
        ddd: function (t) {
    return this.lang().weekdaysShort(this, t);
    },
        dddd: function (t) {
    return this.lang().weekdays(this, t);
    },
        w: function () {
    return this.week();
    },
        W: function () {
    return this.isoWeek();
    },
        YY: function () {
    return c(this.year() % 100, 2);
    },
        YYYY: function () {
    return c(this.year(), 4);
    },
        YYYYY: function () {
    return c(this.year(), 5);
    },
        a: function () {
    return this.lang().meridiem(this.hours(), this.minutes(), !0);
    },
        A: function () {
    return this.lang().meridiem(this.hours(), this.minutes(), !1);
    },
        H: function () {
    return this.hours();
    },
        h: function () {
    return this.hours() % 12 || 12;
    },
        m: function () {
    return this.minutes();
    },
        s: function () {
    return this.seconds();
    },
        S: function () {
    return ~~(this.milliseconds() / 100);
    },
        SS: function () {
    return c(~~(this.milliseconds() / 10), 2);
    },
        SSS: function () {
    return c(this.milliseconds(), 3);
    },
        Z: function () {
    var t = -this.zone(), e = "+";
    return 0 > t && (t = -t, e = "-"), e + c(~~(t / 60), 2) + ":" + c(~~t % 60, 2);
    },
        ZZ: function () {
    var t = -this.zone(), e = "+";
    return 0 > t && (t = -t, e = "-"), e + c(~~(10 * t / 6), 4);
    },
        X: function () {
    return this.unix();
    }
    }; re.length;) W = re.pop(), ie[W + "o"] = r(ie[W]);
    for (; ae.length;) W = ae.pop(), ie[W + W] = s(ie[W], 2);
    for (ie.DDDD = s(ie.DDD, 3), a.prototype = {
        set: function (t) {
    var e, n;
    for (n in t) e = t[n], "function" == typeof e ? this[n] = e : this["_" + n] = e;
    },
        _months: "January_February_March_April_May_June_July_August_September_October_November_December".split("_"),
        months: function (t) {
    return this._months[t.month()];
    },
        _monthsShort: "Jan_Feb_Mar_Apr_May_Jun_Jul_Aug_Sep_Oct_Nov_Dec".split("_"),
        monthsShort: function (t) {
    return this._monthsShort[t.month()];
    },
        monthsParse: function (t) {
    var e, n, s;
    for (this._monthsParse || (this._monthsParse = []), e = 0; 12 > e; e++) if (this._monthsParse[e] || (n = C([2e3, e]),
    s = "^" + this.months(n, "") + "|^" + this.monthsShort(n, ""), this._monthsParse[e] = new RegExp(s.replace(".", ""), "i")),
    this._monthsParse[e].test(t)) return e;
    },
        _weekdays: "Sunday_Monday_Tuesday_Wednesday_Thursday_Friday_Saturday".split("_"),
        weekdays: function (t) {
    return this._weekdays[t.day()];
    },
        _weekdaysShort: "Sun_Mon_Tue_Wed_Thu_Fri_Sat".split("_"),
        weekdaysShort: function (t) {
    return this._weekdaysShort[t.day()];
    },
        _weekdaysMin: "Su_Mo_Tu_We_Th_Fr_Sa".split("_"),
        weekdaysMin: function (t) {
    return this._weekdaysMin[t.day()];
    },
        _longDateFormat: {
        LT: "h:mm A",
        L: "MM/DD/YYYY",
        LL: "MMMM D YYYY",
        LLL: "MMMM D YYYY LT",
        LLLL: "dddd, MMMM D YYYY LT"
    },
        longDateFormat: function (t) {
    var e = this._longDateFormat[t];
    return !e && this._longDateFormat[t.toUpperCase()] && (e = this._longDateFormat[t.toUpperCase()].replace(/MMMM|MM|DD|dddd/g, function (t) {
    return t.slice(1);
    }), this._longDateFormat[t] = e), e;
    },
        meridiem: function (t, e, n) {
    return t > 11 ? n ? "pm" : "PM" : n ? "am" : "AM";
    },
        _calendar: {
        sameDay: "[Today at] LT",
        nextDay: "[Tomorrow at] LT",
        nextWeek: "dddd [at] LT",
        lastDay: "[Yesterday at] LT",
        lastWeek: "[last] dddd [at] LT",
        sameElse: "L"
    },
        calendar: function (t, e) {
    var n = this._calendar[t];
    return "function" == typeof n ? n.apply(e) : n;
    },
        _relativeTime: {
        future: "in %s",
        past: "%s ago",
        s: "a few seconds",
        m: "a minute",
        mm: "%d minutes",
        h: "an hour",
        hh: "%d hours",
        d: "a day",
        dd: "%d days",
        M: "a month",
        MM: "%d months",
        y: "a year",
        yy: "%d years"
    },
        relativeTime: function (t, e, n, s) {
    var r = this._relativeTime[n];
    return "function" == typeof r ? r(t, e, n, s) : r.replace(/%d/i, t);
    },
        pastFuture: function (t, e) {
    var n = this._relativeTime[t > 0 ? "future" : "past"];
    return "function" == typeof n ? n(e) : n.replace(/%s/i, e);
    },
        ordinal: function (t) {
    return this._ordinal.replace("%d", t);
    },
        _ordinal: "%d",
        preparse: function (t) {
    return t;
    },
        postformat: function (t) {
    return t;
    },
        week: function (t) {
    return b(t, this._week.dow, this._week.doy);
    },
        _week: {
        dow: 0,
        doy: 6
    }
    }, C = function (t, e, n) {
    return F({
        _i: t,
        _f: e,
        _l: n,
        _isUTC: !1
    });
    }, C.utc = function (t, e, n) {
    return F({
        _useUTC: !0,
        _isUTC: !0,
        _l: n,
        _i: t,
        _f: e
    });
    }, C.unix = function (t) {
    return C(1e3 * t);
    }, C.duration = function (t, e) {
    var n, s = C.isDuration(t), r = "number" == typeof t, a = s ? t._data : r ? {} : t;
    return r && (e ? a[e] = t : a.milliseconds = t), n = new o(a), s && t.hasOwnProperty("_lang") && (n._lang = t._lang),
    n;
    }, C.version = x, C.defaultFormat = K, C.lang = function (t, e) {
    return t ? (e ? _(t, e) : A[t] || m(t), void (C.duration.fn._lang = C.fn._lang = m(t))) : C.fn._lang._abbr;
    }, C.langData = function (t) {
    return t && t._lang && t._lang._abbr && (t = t._lang._abbr), m(t);
    }, C.isMoment = function (t) {
    return t instanceof i;
    }, C.isDuration = function (t) {
    return t instanceof o;
    }, C.fn = i.prototype = {
        clone: function () {
    return C(this);
    },
        valueOf: function () {
    return +this._d;
    },
        unix: function () {
    return Math.floor(+this._d / 1e3);
    },
        toString: function () {
    return this.format("ddd MMM DD YYYY HH:mm:ss [GMT]ZZ");
    },
        toDate: function () {
    return this._d;
    },
        toJSON: function () {
    return C.utc(this).format("YYYY-MM-DD[T]HH:mm:ss.SSS[Z]");
    },
        toArray: function () {
    var t = this;
    return [t.year(), t.month(), t.date(), t.hours(), t.minutes(), t.seconds(), t.milliseconds()];
    },
        isValid: function () {
    return null == this._isValid && (this._isValid = this._a ? !l(this._a, (this._isUTC ? C.utc(this._a) : C(this._a)).toArray()) : !isNaN(this._d.getTime())),
    !!this._isValid;
    },
        utc: function () {
    return this._isUTC = !0, this;
    },
        local: function () {
    return this._isUTC = !1, this;
    },
        format: function (t) {
    var e = Y(this, t || C.defaultFormat);
    return this.lang().postformat(e);
    },
        add: function (t, e) {
    var n;
    return n = "string" == typeof t ? C.duration(+e, t) : C.duration(t, e), h(this, n, 1), this;
    },
        subtract: function (t, e) {
    var n;
    return n = "string" == typeof t ? C.duration(+e, t) : C.duration(t, e), h(this, n, -1), this;
    },
        diff: function (t, e, n) {
    var s, r, a = this._isUTC ? C(t).utc() : C(t).local(), i = 6e4 * (this.zone() - a.zone());
    return e && (e = e.replace(/s$/, "")), "year" === e || "month" === e ? (s = 432e5 * (this.daysInMonth() + a.daysInMonth()),
    r = 12 * (this.year() - a.year()) + (this.month() - a.month()), r += (this - C(this).startOf("month") - (a - C(a).startOf("month"))) / s,
    "year" === e && (r /= 12)) : (s = this - a - i, r = "second" === e ? s / 1e3 : "minute" === e ? s / 6e4 : "hour" === e ? s / 36e5 : "day" === e ? s / 864e5 : "week" === e ? s / 6048e5 : s),
    n ? r : d(r);
    },
        from: function (t, e) {
    return C.duration(this.diff(t)).lang(this.lang()._abbr).humanize(!e);
    },
        fromNow: function (t) {
    return this.from(C(), t);
    },
        calendar: function () {
    var t = this.diff(C().startOf("day"), "days", !0), e = -6 > t ? "sameElse" : -1 > t ? "lastWeek" : 0 > t ? "lastDay" : 1 > t ? "sameDay" : 2 > t ? "nextDay" : 7 > t ? "nextWeek" : "sameElse";
    return this.format(this.lang().calendar(e, this));
    },
        isLeapYear: function () {
    var t = this.year();
    return t % 4 === 0 && t % 100 !== 0 || t % 400 === 0;
    },
        isDST: function () {
    return this.zone() < C([this.year()]).zone() || this.zone() < C([this.year(), 5]).zone();
    },
        day: function (t) {
    var e = this._isUTC ? this._d.getUTCDay() : this._d.getDay();
    return null == t ? e : this.add({
        d: t - e
    });
    },
        startOf: function (t) {
    switch (t = t.replace(/s$/, "")) {
    case "year":
    this.month(0);

    case "month":
    this.date(1);

    case "week":
    case "day":
    this.hours(0);

    case "hour":
    this.minutes(0);

    case "minute":
    this.seconds(0);

    case "second":
    this.milliseconds(0);
    }
    return "week" === t && this.day(0), this;
    },
        endOf: function (t) {
    return this.startOf(t).add(t.replace(/s?$/, "s"), 1).subtract("ms", 1);
    },
        isAfter: function (t, e) {
    return e = "undefined" != typeof e ? e : "millisecond", +this.clone().startOf(e) > +C(t).startOf(e);
    },
        isBefore: function (t, e) {
    return e = "undefined" != typeof e ? e : "millisecond", +this.clone().startOf(e) < +C(t).startOf(e);
    },
        isSame: function (t, e) {
    return e = "undefined" != typeof e ? e : "millisecond", +this.clone().startOf(e) === +C(t).startOf(e);
    },
        zone: function () {
    return this._isUTC ? 0 : this._d.getTimezoneOffset();
    },
        daysInMonth: function () {
    return C.utc([this.year(), this.month() + 1, 0]).date();
    },
        dayOfYear: function (t) {
    var e = U((C(this).startOf("day") - C(this).startOf("year")) / 864e5) + 1;
    return null == t ? e : this.add("d", t - e);
    },
        isoWeek: function (t) {
    var e = b(this, 1, 4);
    return null == t ? e : this.add("d", 7 * (t - e));
    },
        week: function (t) {
    var e = this.lang().week(this);
    return null == t ? e : this.add("d", 7 * (t - e));
    },
        lang: function (t) {
    return void 0 === t ? this._lang : (this._lang = m(t), this);
    }
    }, W = 0; W < ee.length; W++) H(ee[W].toLowerCase().replace(/s$/, ""), ee[W]);
    H("year", "FullYear"), C.fn.days = C.fn.day, C.fn.weeks = C.fn.week, C.fn.isoWeeks = C.fn.isoWeek,
    C.duration.fn = o.prototype = {
        weeks: function () {
            return d(this.days() / 7);
        },
        valueOf: function () {
            return this._milliseconds + 864e5 * this._days + 2592e6 * this._months;
        },
        humanize: function (t) {
            var e = +this, n = L(e, !t, this.lang());
            return t && (n = this.lang().pastFuture(e, n)), this.lang().postformat(n);
        },
        lang: C.fn.lang
    };
    for (W in ne) ne.hasOwnProperty(W) && (z(W, ne[W]), O(W.toLowerCase()));
    return z("Weeks", 6048e5), C.lang("zh-cn", {
        months: "一月_二月_三月_四月_五月_六月_七月_八月_九月_十月_十一月_十二月".split("_"),
        monthsShort: "1月_2月_3月_4月_5月_6月_7月_8月_9月_10月_11月_12月".split("_"),
        weekdays: "星期日_星期一_星期二_星期三_星期四_星期五_星期六".split("_"),
        weekdaysShort: "周日_周一_周二_周三_周四_周五_周六".split("_"),
        weekdaysMin: "日_一_二_三_四_五_六".split("_"),
        longDateFormat: {
            LT: "Ah点mm",
            L: "YYYY年MMMD日",
            LL: "YYYY年MMMD日",
            LLL: "YYYY年MMMD日LT",
            LLLL: "YYYY年MMMD日ddddLT",
            l: "YYYY年MMMD日",
            ll: "YYYY年MMMD日",
            lll: "YYYY年MMMD日LT",
            llll: "YYYY年MMMD日ddddLT"
        },
        meridiem: function (t, e) {
            return 9 > t ? "早上" : 11 > t && 30 > e ? "上午" : 13 > t && 30 > e ? "中午" : 18 > t ? "下午" : "晚上";
        },
        calendar: {
            sameDay: "[今天]LT",
            nextDay: "[明天]LT",
            nextWeek: "[下]ddddLT",
            lastDay: "[昨天]LT",
            lastWeek: "[上]ddddLT",
            sameElse: "L"
        },
        ordinal: function (t, e) {
            switch (e) {
                case "d":
                case "D":
                case "DDD":
                    return t + "日";

                case "M":
                    return t + "月";

                case "w":
                case "W":
                    return t + "周";

                default:
                    return t;
            }
        },
        relativeTime: {
            future: "%s内",
            past: "%s前",
            s: "几秒",
            m: "1分钟",
            mm: "%d分钟",
            h: "1小时",
            hh: "%d小时",
            d: "1天",
            dd: "%d天",
            M: "1个月",
            MM: "%d个月",
            y: "1年",
            yy: "%d年"
        }
    }), C;
}); define("safe/safe_check.js", ["common/wx/Tips.js", "common/wx/popup.js", "common/wx/Cgi.js", "safe/Scan.js", "safe/Mobile.js", "biz_web/ui/checkbox.js", "common/wx/Step.js", "safe/tpl/safe_check.html.js"], function (e, s, t) {
    "use strict";
    var i = e("common/wx/Tips.js"), n = (e("common/wx/popup.js"), e("common/wx/Cgi.js")), o = e("safe/Scan.js"), a = e("safe/Mobile.js"), c = (e("biz_web/ui/checkbox.js"),
    e("common/wx/Step.js")), r = e("safe/tpl/safe_check.html.js");
    t.exports = {
        _types: {
            send: '_"(群发)"'
        },
        check: function (e, s, t) {
            t = t || {}, t.onClose && t.onClose(), "undefined" == typeof t.autoClose && (t.autoClose = !0);
            var i = !0;
            switch (e.source) {
                case "msgs":
                    i = 2 == (2 & e.protect_status);
                    break;

                case "cburl":
                    i = 4 == (4 & e.protect_status);
                    break;

                case "appkey":
                    i = !0;
                    break;

                case "showas":
                    i = !0;
                    break;

                case "unbindopen":
                    i = !0;
                    break;

                default:
                    i = !1;
            }
            if (i) {
                var n, a, c = {
                    scaner: null,
                    destroy: function () {
                        c.scaner && c.scaner.destroy();
                    }
                }, d = $(r).find(t && t.checkdom ? t.checkdom : ".js_wxcheck");
                return t.dialog && t.dialogdom ? (n = t.dialog, a = t.dialogdom, a.html(d)) : a = d.popup({
                    title: "微信验证",
                    width: 860,
                    onShow: function () {
                        n = this, $(this.$dialogWrp.get(0)).css({
                            "margin-top": -227
                        });
                    },
                    close: function () {
                        c && c.destroy(), t && t.onClose && t.onClose(), this.remove();
                    }
                }), c.scaner = new o({
                    container: a,
                    type: "check",
                    source: e.source,
                    msgid: e.msgid,
                    distinguish: e.distinguish,
                    default_initdom: e.default_initdom,
                    mustAdmin: e.mustAdmin,
                    wx_name: "wx.pass" == e.wx_alias ? "" : e.wx_alias,
                    onconfirm: function () {
                        var i = {
                            code: this.code
                        }, o = function () {
                            t.autoClose && n.remove(), e.unadmin_url ? location.href = e.unadmin_url : location.reload();
                        };
                        this.isadmin && !this.issubadmin || !this.distinguish ? (i.type = 1, t.autoClose && n.remove()) : (i.type = this.issubadmin ? 2 : -1,
                        "msgs" == e.source && 2 == i.type ? t.autoClose && n.remove() : (this.container.find(".js_wxchecks").html((t && t.unadmin_html ? t.unadmin_html : '<div class="page_msg large simple default"><div class="inner group"><span class="msg_icon_wrp"><i class="icon_msg_primary waiting"></i></span><div class="msg_content"><h4>已发送操作申请</h4><p>请等待管理员(%s)验证操作申请，验证通过后操作将立即进行。此申请在30分钟后过期，请尽快联系管理员验证。</p></div></div><div class="tool_bar border"><a href="javascript:;" class="btn btn_primary js_unadminsend">我知道了</a></div></div>').sprintf(this.opt.wx_name)),
                        this.container.find(".js_wxchecks").find(".js_unadminsend").on("click", o), this.container.find(".pop_closed").on("click", o),
                        n.resetPosition()), t && t.notadminCallback && t.notadminCallback()), "function" == typeof s && s(i);
                    }
                }), n.resetPosition(), c;
            }
            return "function" == typeof s && s("wx.pass"), null;
        },
        off_protect_tip: function (e, s) {
            s && s.onClose && s.onClose();
            $(r).find(s.dom ? s.dom : ".js_off_protect").popup({
                title: "开启微信保护",
                width: 860,
                close: function () {
                    this.remove();
                },
                buttons: [{
                    text: "开始",
                    click: function () {
                        this.remove(), "function" == typeof e && e();
                    },
                    type: "primary"
                }, {
                    text: "取消",
                    click: function () {
                        s && s.onClose && s.onClose(), this.remove();
                    },
                    type: "default"
                }]
            });
        },
        no_helper_tip: function (e, s) {
            s && s.onClose && s.onClose();
            $(r).find(s.dom ? s.dom : ".js_no_helper").popup({
                title: "开启微信保护",
                width: 860,
                close: function () {
                    this.remove();
                },
                buttons: [{
                    text: "开始",
                    click: function () {
                        this.remove(), "function" == typeof e && e();
                    },
                    type: "primary"
                }, {
                    text: "取消",
                    click: function () {
                        s && s.onClose && s.onClose(), this.remove();
                    },
                    type: "default"
                }]
            });
        },
        bind: function (e, s, t, d) {
            function l() {
                var i = w.find(".js_step3");
                i.show(), m = new o({
                    container: i,
                    type: e,
                    source: s.source,
                    code: s.code,
                    auth: s.auth,
                    dom_init: '<div class="status tips"><p>请使用微信扫描二维码进行验证</p></div>',
                    onconfirm: function () {
                        h.remove(), "function" == typeof t && t({
                            data: this,
                            wx_name: "wx.pass"
                        });
                    }
                });
            }
            function f() {
                var e = w.find(".js_step3"), i = e.find(".js_forget"), n = "/misc/rebindverify?action=mail_get&safeaction=wx_mail_get&t=setting/safe-rebind";
                i.find("a").attr("href", wx.url(n + ("ticket" == s.auth ? "&auth=ticket" : ""))), i.show(),
                e.show(), m = new o({
                    container: e,
                    type: _,
                    source: s.source,
                    code: s.code,
                    auth: s.auth,
                    wx_name: "wx.pass" == s.wx_alias ? "" : s.wx_alias,
                    onconfirm: function () {
                        h.remove(), "function" == typeof t && t({
                            data: this,
                            wx_name: "wx.pass"
                        });
                    }
                });
            }
            !s && (s = {}), !d && (d = {});
            var _;
            switch (e) {
                case "bind_showas":
                    _ = "change_protect_showas";
                    break;

                case "bind_masssend":
                    _ = "change_protect_masssend";
                    break;

                case "bind_login":
                    _ = "change_protect_login";
                    break;

                default:
                    _ = "bind";
            }
            d && d.onClose && d.onClose();
            var m, u, h, p = s && s.wx_alias ? !0 : !1, b = "click", w = $(r).find(".js_bind").popup({
                className: "dialog_process",
                title: "bind" == e ? "绑定公众号安全管理员" : "开启微信保护",
                width: 960,
                onShow: function () {
                    h = this, $(this.$dialogWrp.get(0)).css({
                        "margin-top": -227
                    });
                },
                close: function () {
                    d && d.onClose && d.onClose(), m && m.destroy(), this.remove();
                }
            });
            n.post({
                url: wx.url("/misc/safeassistant?action=checkwx_report") + (s.auth ? "&auth=ticket" : ""),
                mask: !1
            }, $.noop), u = new c({
                container: w.find(".js_process"),
                selected: 1,
                names: ["1 选择验证方式", "2 账号验证", p ? "3 开启微信保护" : "3 绑定微信号"]
            }), w.find(".js_step1_num").text(s && s.mobile ? s.mobile : ""), w.find(".js_step1_email").text(s && s.bind_mail ? s.bind_mail : ""),
            s && "1" == s.third_status && w.find(".js_option").show(), w.find(".frm_radio").checkbox({
                multi: !1,
                onChanged: function (e) {
                    w.find(".js_step1_next").data("type", e.val());
                }
            }), w.find(".js_step1_next").data("type", "1").on(b, function () {
                var e = $(this).data("type");
                if (!("1" != e || s && s.mobile)) return void i.err("手机号为空，请选择其他验证方式");
                if (!("2" != e || s && s.bind_mail)) return void i.err("邮箱为空，请选择其他验证方式");
                if (u.setStep(2), w.find(".js_step1").hide(), "1" == e) {
                    var t = w.find(".js_setp2_mobile");
                    t.find(".js_mobile_forget").attr("href", wx.url("/misc/rebindverify?action=mail_get&safeaction=mobile_mail_get&t=setting/safe-rebind" + ("ticket" == s.auth ? "&auth=ticket" : ""))),
                    t.show(), t.find(".js_oldsend").click();
                } else if ("2" == e) {
                    var t = w.find(".js_step2_mail");
                    t.show(), t.find(".js_resend_mail").click();
                } else w.find(".js_step2_name").show();
            }), w.find(".js_step1_cancel").on(b, function () {
                h.remove();
            }), w.find(".js_step2_prev").on(b, function () {
                $(this).parent().parent().hide(), u.setStep(1), w.find(".js_step1").show();
            }), s && s.mobile && new a({
                container: w.find(".js_setp2_mobile"),
                mobile_num: s.mobile,
                old_submit: ".js_step2_mobilecheck",
                auth: s.auth,
                old_callback: function (e) {
                    w.find(".js_step2_mobilecheck").html("下一步").removeClass("btn_loading").attr("disabled", !1);
                    var t = e.err_code;
                    0 == t ? (w.find(".js_setp2_mobile").hide(), u.setStep(3), s.wx_alias ? f() : l()) : i.err("验证失败");
                },
                old_checkparam: function (e) {
                    s.code = e, s.source = "mobile";
                    var t = {
                        code_num: e
                    };
                    return s.auth && (t.auth = s.auth), t;
                },
                before_check: function () {
                    return $(this).attr("disabled") ? !1 : ($(this).html("验证中<i></i>").addClass("btn_loading").attr("disabled", !0),
                    !0);
                }
            }), w.find(".js_resend_mail").on(b, function () {
                n.post({
                    url: wx.url("/misc/rebindverify?action=send_safe_code"),
                    mask: !1
                }, function (e) {
                    if (!e && !e.base_resp) return void i.err("邮件发送失败");
                    switch (+e.base_resp.ret) {
                        case 0:
                            i.suc("邮件发送成功");
                            break;

                        default:
                            i.err("邮件发送失败");
                    }
                });
            }), w.find(".js_step2_namecheck").on(b, function () {
                var e = w.find(".js_cardname"), t = w.find(".js_cardid"), o = e.val().trim(), a = t.val().trim();
                if (!o) return i.err("请输入身份证姓名"), !1;
                if (!a) return i.err("请输入身份证号码"), !1;
                $(this).html("验证中<i></i>").addClass("btn_loading").attr("disabled", !0);
                var c = {
                    card_name: o,
                    card_id: a
                };
                s.auth && (c.auth = s.auth), n.post({
                    url: wx.url("/misc/safeassistant?action=check_id"),
                    data: c,
                    mask: !1
                }, function (e) {
                    if (w.find(".js_step2_namecheck").html("下一步").removeClass("btn_loading").attr("disabled", !1),
                    !e && !e.check_flag && !e.code) return void i.err("验证失败");
                    switch (+e.check_flag) {
                        case 1:
                            s.code = e.code, s.source = "id", w.find(".js_step2_name").hide(), u.setStep(3), s.wx_alias ? f() : l();
                            break;

                        case -5:
                        case 200005:
                            i.err("请1分钟后重新尝试");
                            break;

                        default:
                            i.err("验证失败");
                    }
                });
            }), w.find(".js_step2_mailcheck").on(b, function () {
                var e = w.find(".js_email_code").val().trim();
                if (!e) return i.err("请输入邮件验证码"), !1;
                $(this).html("验证中<i></i>").addClass("btn_loading").attr("disabled", !0);
                var t = {
                    safecode: e
                };
                s.auth && (t.auth = s.auth), n.post({
                    url: wx.url("/misc/safeassistant?action=check_safecode"),
                    data: t,
                    mask: !1
                }, function (e) {
                    if (w.find(".js_step2_mailcheck").html("下一步").removeClass("btn_loading").attr("disabled", !1),
                    !e && !e.check_flag && !e.code) return void i.err("验证失败");
                    switch (+e.check_flag) {
                        case 1:
                            s.code = e.code, s.source = "safecode", w.find(".js_step2_mail").hide(), u.setStep(3), s.wx_alias ? f() : l();
                            break;

                        default:
                            i.err("验证失败");
                    }
                });
            });
        }
    };
}); define("common/wx/Step.js", ["widget/processor_bar.css", "tpl/step.html.js"], function (e, t, n) {
    try {
        var r = +(new Date);
        "use strict";
        var i = wx.T, s = e("widget/processor_bar.css"), o = e("tpl/step.html.js"), u = {
            selected: 1
        }, a = function () {
            var e = navigator.userAgent.toLowerCase(), t = /(msie) ([\w.]+)/.exec(e) || [], n = t[1] || "";
            return n == "msie";
        };
        function f(e) {
            this.opts = $.extend(!0, {}, u, e), this.init();
        }
        f.prototype.init = function () {
            var e = this.opts, t = e.names.length, n = parseInt(e.selected, 10), r = [], s, u;
            n = n < 0 ? 0 : n > t ? t : n;
            for (s = 0; s < t; s++) u = f.getClass(s + 1, n), r.push({
                name: e.names[s],
                cls: u
            });
            this.$dom = $(i(o, {
                stepArr: r,
                length: t
            })).appendTo(e.container), a() && this.$dom.addClass("ie");
        }, f.prototype.setStep = f.prototype.go = function (e) {
            var t = this.$dom.find("li.step"), n = t.length;
            return e = e < 0 ? 0 : e > n ? n : e, t.each(function (t, r) {
                var i = f.getClass(t + 1, e);
                t + 1 == n ? r.className = "no_extra " + "step grid_item size1of%s %s".sprintf(n, i) : r.className = "step grid_item size1of%s %s".sprintf(n, i);
            }), this;
        }, f.getClass = function (e, t) {
            var n;
            return e < t - 1 ? n = "pprev" : e === t - 1 ? n = "prev" : e === t ? n = "current" : e === t + 1 ? n = "next" : e > t + 1 && (n = "nnext"), n;
        }, n.exports = f;
    } catch (l) {
        wx.jslog({
            src: "common/wx/Step.js"
        }, l);
    }
}); define("safe/Scan.js", ["widget/qrcode_scan.css", "common/wx/Tips.js", "common/wx/Cgi.js"], function (t) {
    "use strict";
    function e(t) {
        t = $.extend(!0, {}, n, t);
        var e = {
            OK: 0,
            ERR_SYS: -1,
            ERR_ARGS: -2,
            ERR_APP_BLOCK: -10,
            UUID_SCANNING: 401,
            UUID_EXPIRED: 402,
            UUID_CANCELED: 403,
            UUID_SCANED: 404,
            UUID_CONFIRM: 405,
            UUID_INIT: 406,
            UUID_REQUEST: 407,
            UUID_ERROR: 500
        }, s = {
            init: '<div class="status tips"><p>请用管理员微信(%s)扫描以上二维码进行验证</p></div>'.sprintf(t.wx_name),
            multi_init: '<div class="status tips"><p>扫码后，请联系管理员(%s)进行验证</p></div>'.sprintf(t.wx_name),
            suc: '<div class="status"><i class="icon_qrcode_scan succ"></i><div class="status_txt"><h4>扫描成功</h4><p>请在微信上点击确认即可</p></div></div>',
            adm: '<div class="status"><i class="icon_qrcode_scan warn"></i><div class="status_txt"><h4>检测到非管理员已扫描</h4><p>请联系管理员使用管理员微信重新扫描验证，或关闭窗口</p></div></div>',
            cannel: '<div class="status"><i class="icon_qrcode_scan warn"></i><div class="status_txt"><h4>您已取消此次操作</h4><p>您可以重新扫描验证，或关闭窗口</p></div></div>',
            ok: '<div class="status"><i class="icon_qrcode_scan succ"></i><div class="status_txt"><h4>确认成功</h4></div></div>',
            request: "<h2>已发送操作申请，请耐心等待</h2><p>等待公众号助手%s审核您的申请，您也可主动联系ta，请ta通过您的申请</p>".sprintf(t.wx_name)
        }, a = this;
        a.container = "object" == typeof t.container ? t.container : $(t.container), a.status_container = "null" == t.status_container ? null : a.container.find(t.status_container),
        a.qrcode_container = a.container.find(t.qrcode_container), a.opt = t, a.opt.onshow && "function" == typeof a.opt.onshow ? a.opt.onshow.apply(a) : a.status_container && a.status_container.html(a.opt.dom_init ? a.opt.dom_init : a.opt.distinguish && !a.opt.default_initdom ? s.multi_init : s.init),
        a.timer = null, a.ctimer = null, a.json = {}, a.retcode = e.UUID_SCANNING, a.retcodes = {
            0: !0
        }, a.usedTimes = 0, a.uselessTimes = 0, a.repeatTimes = 0, a.firstChange = 0, a.speedy = 1, a.longWait = 0;
        var c = function (t) {
            var e = t > 20 ? t - 20 : 0, i = t > 10 ? e > 0 ? 10 : t - 10 : 0, o = i > 0 ? 10 : t;
            return 4 * e + 2 * i + o;
        }, r = function (t) {
            var e = 20;
            return t >= 40 ? e = 11 : t >= 30 ? e = 10 : t >= 20 ? e = 9 : t >= 16 ? e = 8 : t >= 12 ? e = 7 : t >= 10 ? e = 6 : t >= 7 ? e = 5 : t >= 4 && (e = 4),
            e;
        }, d = function () { }, u = function () {
            var t = [];
            t.push("&1=" + 100 * a.usedTimes), t.push("&2=" + 100 * a.uselessTimes), t.push("&3=" + 100 * a.firstChange);
            var e = c(a.firstChange), o = r(e);
            o > 0 && t.push("&" + o + "=" + 100 * e), 0 == a.longWait && t.push("&19=1000"), setTimeout(function () {
                a.opt.onconfirm && "function" == typeof a.opt.onconfirm ? a.opt.onconfirm.apply(a) : i.suc("已确认成功");
            }, 150);
        }, p = function () {
            a.timer && window.clearInterval(a.timer), a.timer = setInterval(m, a.opt.timeout * a.speedy),
            a.ctimer && window.clearInterval(a.ctimer), a.ctimer = setInterval(l, a.opt.checktimeout * a.speedy);
        }, m = function () {
            a.opt.uuid ? o.post({
                url: wx.url("/safe/safeuuid?timespam=" + (new Date).getTime()),
                data: {
                    uuid: a.opt.uuid,
                    action: "json",
                    type: "json"
                },
                mask: !1
            }, function (t) {
                a.json = t;
                var e = t && t.errcode ? +t.errcode : 0;
                if (a.retcode == e) {
                    a.uselessTimes++, a.repeatTimes++;
                    var i = !1;
                    a.repeatTimes >= 20 && 4 != a.speedy ? (a.speedy = 4, i = !0) : a.repeatTimes >= 10 && 2 != a.speedy && (a.speedy = 2,
                    i = !0), i && p();
                } else a.retcode = e, a.usedTimes++, 0 == a.firstChange && a.repeatTimes > 0 && (a.firstChange = a.repeatTimes),
                a.repeatTimes = 0, a.speedy = 1, p();
            }) : (a.timer && window.clearInterval(a.timer), a.ctimer && window.clearInterval(a.ctimer),
            _());
        }, l = function () {
            if (a.json && a.json.errcode == e.UUID_SCANED && 602 == +a.json.check_status && (a.retcode = e.UUID_CONFIRM),
            !a.retcodes[a.retcode]) {
                a.retcodes[a.retcode] = !0;
                var t = function () {
                    var e = {
                        action: "get_uuid",
                        uuid: a.opt.uuid
                    };
                    a.opt.auth && (e.auth = a.opt.auth), o.post({
                        url: wx.url("/misc/safeassistant"),
                        data: e,
                        mask: !1
                    }, {
                        done: function (t) {
                            t && 0 == t.isadmin ? (a.isadmin = !1, a.distinguish = !0) : (a.issubadmin = !(1 == t.isadmin), a.isadmin = !0,
                            a.distinguish = !0), u();
                        },
                        fail: function () {
                            setTimeout(t, 300);
                        }
                    });
                };
                switch (a.retcode) {
                    case e.UUID_ERROR:
                        return a.timer && window.clearInterval(a.timer), a.ctimer && window.clearInterval(a.ctimer),
                        void _();

                    case e.UUID_EXPIRED:
                        return a.timer && window.clearInterval(a.timer), a.ctimer && window.clearInterval(a.ctimer),
                        void _();

                    case e.UUID_SCANED:
                        a.retcodes[e.UUID_CANCELED] = !1, a.opt.onscaned && "function" == typeof a.opt.onscaned ? a.opt.onscaned.apply(a) : a.status_container && a.status_container.html(s.suc);
                        break;

                    case e.UUID_CANCELED:
                        a.retcodes[e.UUID_SCANED] = !1, a.opt.oncancel && "function" == typeof a.opt.oncancel ? a.opt.oncancel.apply(a) : a.status_container && a.status_container.html(s.cannel);
                        break;

                    case e.UUID_CONFIRM:
                        a.timer && window.clearInterval(a.timer), a.ctimer && window.clearInterval(a.ctimer),
                        a.json.code && (a.code = a.json.code), a.opt.auto_msgid && (a.msgid = a.opt.msgid), a.opt.distinguish ? setTimeout(t, 0) : (a.status_container && a.status_container.html(s.ok),
                        u());
                        break;

                    case e.UUID_REQUEST:
                        a.json.code && (a.code = a.json.code), a.timer && window.clearInterval(a.timer), a.ctimer && window.clearInterval(a.ctimer),
                        a.container.html(s.request), a.opt.onrequest && "function" == typeof a.opt.onrequest ? a.opt.onrequest.apply(a) : i.suc("已申请成功");
                }
            }
        }, _ = function () {
            function t() {
                var t = {
                    state: "0",
                    login_type: "safe_center",
                    f: "json",
                    type: a.opt.uuid_type || "json",
                    ticket: a.opt.ticket
                };
                a.opt.getUuidExtra && "object" == typeof a.opt.getUuidExtra && (t = $.extend(!0, {}, a.opt.getUuidExtra, t)),
                a.opt.kicked_openid && (t.kicked_openid = a.opt.kicked_openid), a.opt.kicked_pttype && (t.kicked_pttype = a.opt.kicked_pttype),
                o.post({
                    url: wx.url("/safe/safeqrconnect"),
                    data: t,
                    mask: !1
                }, function (t) {
                    if (t && t.uuid) {
                        a.opt.uuid = t.uuid;
                        var e = "/safe/safeqrcode?ticket=%s&uuid=%s&action=%s".sprintf(a.opt.ticket, a.opt.uuid, a.opt.type);
                        a.opt.expire_time_type && (e = e + "&expire_time_type=" + a.opt.expire_time_type), a.opt.code && (e = e + "&code=" + a.opt.code),
                        a.opt.source && (e = e + "&type=" + a.opt.source), a.opt.auth && (e = e + "&auth=" + a.opt.auth),
                        a.opt.msgid && (e = e + "&msgid=" + a.opt.msgid), a.opt.second_openid && (e = e + "&second_openid=" + a.opt.second_openid),
                        a.opt.scene && (e = e + "&scene=" + a.opt.scene), a.qrcode_container.attr("src", e), a.opt.onloadedimg && "function" == typeof a.opt.onloadedimg && a.opt.onloadedimg.apply(a),
                        p(), a.json = {}, a.retcode = 0, a.retcodes = {
                            0: !0
                        };
                    }
                });
            }
            if (a.opt.ticket) t(); else {
                var e = {
                    action: "get_ticket"
                };
                a.opt.auth && (e.auth = a.opt.auth), o.post({
                    url: wx.url("/misc/safeassistant"),
                    data: e,
                    mask: !1
                }, {
                    done: function (e) {
                        e && e.base_resp && e.ticket && 0 == e.base_resp.ret ? (a.opt.ticket = e.ticket, a.opt.auto_msgid && e.operation_seq && (a.opt.msgid = e.operation_seq),
                        t()) : setTimeout(function () {
                            _();
                        }, 1e3);
                    },
                    fail: function () {
                        setTimeout(function () {
                            _();
                        }, 1e3);
                    }
                });
            }
        };
        _(!0), setInterval(d, 3e5);
    }
    t("widget/qrcode_scan.css");
    var i = t("common/wx/Tips.js"), o = t("common/wx/Cgi.js"), n = {
        wx_name: "",
        container: "",
        type: "",
        ticket: "",
        source: "",
        second_openid: "",
        code: "",
        msgid: "",
        auto_msgid: !1,
        auth: "",
        uuid_type: "",
        status_container: ".js_status",
        qrcode_container: ".js_qrcode",
        timeout: 1e3,
        checktimeout: 1200,
        onshow: null,
        onscaned: null,
        oncancel: null,
        onconfirm: null,
        onrequest: null,
        onloadedimg: null,
        dom_init: "",
        distinguish: !1,
        default_initdom: !1,
        getUuidExtra: null,
        mustAdmin: !1
    };
    return e.prototype = {
        destroy: function () {
            return this.timer && window.clearInterval(this.timer), this.ctimer && window.clearInterval(this.ctimer),
            this;
        }
    }, e;
}); define("user/validate_wx.js", ["common/wx/Cgi.js", "safe/Scan.js", "common/wx/Step.js", "safe/safe_check.js", "common/wx/Tips.js", "biz_common/moment.js"], function (s) {
    "use strict";
    var e = wx.cgiData, t = s("common/wx/Cgi.js"), i = s("safe/Scan.js"), a = (s("common/wx/Step.js"),
    s("safe/safe_check.js")), n = s("common/wx/Tips.js"), c = s("biz_common/moment.js");
    !function () {
        function s(s) {
            if (0 == s.base_resp.ret) {
                if (window.location.href.indexOf("toUrl=ad") > -1) {
                    var t = s.redirect_url.match(/token=(\d*)/);
                    t && t[1] && (s.redirect_url = "/promotion/advertiser_index?lang=zh_CN&token=" + t[1] + "&aSource=" + (e.aSource || ""));
                }
                location.href = s.redirect_url;
            }
        }
        function o(s) {
            var e = new RegExp("(^|&)" + s + "=([^&]*)(&|$)", "i"), t = window.location.search.substr(1).match(e);
            return null !== t ? decodeURIComponent(t[2]) : null;
        }
        var r = {
            mobile: e.mobile,
            wx_alias: e.bindalias,
            wx_protect: +e.wx_protect,
            protect_status: +e.protect_status,
            auth: "ticket",
            direct_login_before_time: +e.direct_login_before_time
        };
        if (r.wx_alias) if (1 != r.wx_protect) $(".js_off_protect1").show().find(".js_btn").on("click", function () {
            a.bind("bind_login", r, function (i) {
                n.suc("微信保护开启成功");
                var a = i.data.msgid, c = i.data.code;
                t.post({
                    url: "/cgi-bin/securewxverify",
                    data: {
                        code: c,
                        account: e.account,
                        operation_seq: a
                    },
                    mask: !1
                }, function (e) {
                    switch (+e.base_resp.ret) {
                        case 0:
                            s(e);
                            break;

                        case 11004:
                            n.err("验证错误");
                            break;

                        default:
                            t.handleRet(e, {
                                id: 64462,
                                key: 86,
                                url: "/cgi-bin/securewxverify",
                                msg: "系统繁忙，请稍后再试"
                            });
                    }
                });
            }, {
                title: "开启微信保护"
            });
        }); else {
            "" != e.protect_status && 0 == (1 & r.protect_status) ? ($(".js_wording").text("由于当前账号存在盗号风险，系统已自动为你开启登录保护，请使用微信扫描以下二维码进行登录。"),
            $(".js_icon").addClass("warn")) : ($(".js_wording").text("为保障帐号安全，请用微信扫码验证身份"), $(".js_icon").addClass("dn")),
            $(".js_step3").show();
            var u = {
                init: '<div class="status tips"><p>管理员与运营者微信号：可直接扫码登录</p><p>其他微信号：扫码后需管理员(%s)验证登录</p></div>'.sprintf(r.wx_alias),
                suc: '<div class="status"><i class="icon_qrcode_scan succ"></i><div class="status_txt"><h4>扫描成功</h4><p>请在微信上进行后续操作</p></div></div>',
                adm: '<div class="status"><i class="icon_qrcode_scan warn"></i><div class="status_txt"><h4>检测到非管理员已扫描</h4><p>请联系管理员使用管理员微信重新扫描验证，或关闭窗口</p></div></div>',
                cannel: '<div class="status"><i class="icon_qrcode_scan warn"></i><div class="status_txt"><h4>登录操作被拒绝</h4><p>您可以重新扫描验证，或关闭窗口</p></div></div>',
                ok: '<div class="status"><i class="icon_qrcode_scan succ"></i><div class="status_txt"><h4>确认成功</h4></div></div>',
                expired: '<div class="status"><i class="icon_qrcode_scan warn"></i><div class="status_txt"><h4>二维码已过期</h4><p>您可以<a href="javascript:" class="js_reload_qrcode">刷新二维码</a>重新扫描验证，或关闭窗口</p></div></div>'
            }, l = $(".js_status");
            if ("1" == o("bind_app_type") && (u.init = '<div class="status tips"><p>请使用管理员微信号(%s)扫码验证后登录。</p></div>'.sprintf(e.bindalias)),
            "1" == o("grey")) !function () {
                function s() {
                    t.get({
                        url: wx.url("/cgi-bin/loginqrcode?action=ask"),
                        mask: !1,
                        timeout: 5e3,
                        error: function () {
                            setTimeout(s, a(e++));
                        },
                        success: o
                    });
                }
                var e = 1, i = !0, a = function (s) {
                    return 3 >= s ? 1500 : s > 3 && 30 > s ? 1e3 : s > 30 && 50 > s ? 1500 : 2e3;
                }, c = function () {
                    t.post({
                        url: wx.url("/cgi-bin/bizlogin?action=login"),
                        data: {},
                        mask: !1
                    }, function (s) {
                        if (s && s.redirect_url) {
                            if (window.location.href.indexOf("toUrl=ad") > -1) {
                                var e = s.redirect_url.match(/token=(\d*)/);
                                e && e[1] && (s.redirect_url = "/promotion/advertiser_index?lang=zh_CN&token=" + e[1] + "&aSource=" + (window.aSource || ""));
                            }
                            var t = new Image;
                            t.src = "/misc/jslog?id=98&content=scanLoginSuccess&level=error", location.href = s.redirect_url;
                        } else {
                            n.err("系统繁忙，请稍后再试");
                            var t = new Image;
                            t.src = "/misc/jslog?id=97&content=scanLoginError&level=error";
                        }
                    });
                }, o = function (o) {
                    if ((void 0 == o.status || void 0 == o.user_category) && o.base_resp && 1 != o.base_resp.ret) return void n.err("系统繁忙，请稍后再试");
                    if (1 == o.status) if (1 == o.user_category) {
                        $(".js_scan").hide(), $(".js_tips").hide(), $(".js_request").show().find(".js_request_alias").text(r.wx_alias);
                        var d = 1, _ = null, f = function () {
                            _ = setTimeout(m, a(d++)), console.log("inlTimes:" + d), console.log("pollTime:" + a(d));
                        }, m = function g() {
                            return t.get({
                                url: wx.url("/cgi-bin/loginauth?action=ask"),
                                mask: !1,
                                timeout: 5e3,
                                error: function () {
                                    f();
                                },
                                success: function (s) {
                                    if (1 == s.status) c(); else if (2 == s.status) $(".js_authIcon").removeClass("waiting").addClass("error"),
                                    $(".js_authTitle").text("管理员已拒绝你的操作申请"), $(".js_authTips").html('你可以<a href="https://mp.weixin.qq.com/">回到首页</a>'); else if (3 == s.status) $(".js_authIcon").removeClass("waiting").addClass("info"),
                                    $(".js_authTitle").text("操作申请已过期"), $(".js_authTips").html('你可以<a href="https://mp.weixin.qq.com/">回到首页</a>重新扫码，并在30分钟内联系管理员验证登录。'); else if (4 == s.status) f(); else if (0 == s.status) f(); else if (s.status && 0 != s.status) {
                                        n.err("系统繁忙，请稍后再试");
                                        var e = new Image;
                                        e.src = "/misc/jslog?id=103&content=scanAskError&level=error";
                                    }
                                }
                            }), g;
                        }();
                    } else l.html(u.ok), c(); else if (2 == o.status) l.html(u.cannel); else if (3 == o.status) l.html(u.expired),
                    $(".js_reload_qrcode").on("click", function () {
                        preloadQrCode();
                    }); else if (4 == o.status) l.html(u.suc), setTimeout(s, a(e++)); else if (0 == o.status) setTimeout(s, a(e++)); else if (o.status && 0 != o.status) {
                        n.err("系统繁忙，请稍后再试");
                        var p = new Image;
                        p.src = "/misc/jslog?id=102&content=scanAskError&level=error";
                    }
                    if (o.base_resp && 1 == o.base_resp.ret || 1 != o.status && i) {
                        i = !1;
                        var h = new Image;
                        h.src = "/cgi-bin/loginqrcode?action=getqrcode&param=4300&rd=" + Math.floor(1e3 * Math.random()),
                        h.onload = function () {
                            $(".js_qrcode").replaceWith($(h).addClass($(".js_qrcode").attr("class"))), l.html(u.init),
                            s();
                        };
                    }
                };
                return s;
            }()(); else {
                new i({
                    container: ".js_scan",
                    type: "check",
                    source: "login",
                    auto_msgid: !0,
                    distinguish: !0,
                    dom_init: '<div class="status tips"><p>管理员与运营者微信号：可直接扫码登录<br>其他微信号：扫码后需管理员(%s)验证登录</p></div>'.sprintf(e.bindalias),
                    auth: "ticket",
                    wx_name: e.bindalias,
                    onloadedimg: function () {
                        var i = this;
                        r.direct_login_before_time > Date.parse(new Date) / 1e3 && ($("#js_can_not_scan").show().find("#js_not_scan_date").text(c.unix(r.direct_login_before_time).format("YYYY年MM月DD日")),
                        $("#js_login").on("click", function () {
                            t.post({
                                url: "/cgi-bin/securewxverify",
                                data: {
                                    code: i.opt.uuid,
                                    account: e.account,
                                    operation_seq: i.opt.msgid,
                                    direct_login: 1
                                },
                                mask: !1
                            }, function (e) {
                                switch (+e.base_resp.ret) {
                                    case 0:
                                        s(e);
                                        break;

                                    case 11004:
                                        n.err("验证错误");
                                        break;

                                    default:
                                        t.handleRet(e, {
                                            id: 64462,
                                            key: 86,
                                            url: "/cgi-bin/securewxverify",
                                            msg: "系统繁忙，请稍后再试"
                                        });
                                }
                            });
                        }));
                    },
                    onconfirm: function () {
                        var i = this.msgid, a = this.code, c = function () {
                            t.post({
                                url: "/cgi-bin/securewxverify",
                                data: {
                                    code: a,
                                    account: e.account,
                                    operation_seq: i
                                },
                                mask: !1
                            }, function (e) {
                                switch (+e.base_resp.ret) {
                                    case 0:
                                        s(e);
                                        break;

                                    case 11004:
                                        n.err("验证错误");
                                        break;

                                    default:
                                        t.handleRet(e, {
                                            id: 64462,
                                            key: 86,
                                            url: "/cgi-bin/securewxverify",
                                            msg: "系统繁忙，请稍后再试"
                                        });
                                }
                            });
                        };
                        if (!this.isadmin && this.distinguish) {
                            $(".js_scan").hide(), $(".js_tips").hide(), $(".js_request").show().find(".js_request_alias").text(e.bindalias);
                            var o = null, r = function () {
                                t.post({
                                    url: wx.url("/misc/safeassistant?action=admin_action"),
                                    data: {
                                        type: "1",
                                        msgid: i,
                                        auth: "ticket"
                                    },
                                    mask: !1
                                }, {
                                    done: function (s) {
                                        s && 1 == s.status ? (o && window.clearTimeout(o), n.suc("确认成功"), c()) : o = setTimeout(r, 1e3);
                                    },
                                    fail: function () {
                                        o = setTimeout(r, 1e3);
                                    }
                                });
                            };
                            o = setTimeout(r, 1e3);
                        } else c();
                    }
                });
            }
        } else $(".js_no_helper1").show().find(".js_btn").on("click", function () {
            a.bind("bind_login", r, function (i) {
                n.suc("微信保护开启成功");
                var a = i.data.msgid, c = i.data.code;
                t.post({
                    url: "/cgi-bin/securewxverify",
                    data: {
                        code: c,
                        account: e.account,
                        operation_seq: a
                    },
                    mask: !1
                }, function (e) {
                    switch (+e.base_resp.ret) {
                        case 0:
                            s(e);
                            break;

                        case 11004:
                            n.err("验证错误");
                            break;

                        default:
                            t.handleRet(e, {
                                id: 64462,
                                key: 86,
                                url: "/cgi-bin/securewxverify",
                                msg: "系统繁忙，请稍后再试"
                            });
                    }
                });
            }, {
                title: "绑定管理员微信号"
            });
        });
    }();
});