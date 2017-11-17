/**
 * 格式化时间函数，create by chentongta。
 *
 * @param  Number  value    [时间戳，number类型，以毫秒为单位]
 * @param  String  format   [格式化的结构，常见填'YYYY/MM/DD hh:mm:ss+S'，最多可精确到毫秒级别]
 * @return String           [参照format的格式化结果]
 */

let formatTime = function (value, format) {
    // for example => new Date(null) or new Date('') or new Date(0) or or new Date(undefined)
    if (!value) return '';
    // for example => new Date('2011年12月') or new Date('adsdf')
    if (Number.isNaN(+value)) return value;

    var date = new Date(value);
    // Can't parse to a invalid Date object. for example => new Date(149077400686412312313)
    if (Number.isNaN(date.getTime())) {
        return value;
    }

    var o = {
        'M+': date.getMonth() + 1, // month
        'D+': date.getDate(), // day
        'h+': date.getHours(), // hour
        'm+': date.getMinutes(), // minute
        's+': date.getSeconds(), // second
        'S': date.getMilliseconds() // millisecond
    };

    if (/(Y+)/.test(format)) {
        format = format.replace(RegExp.$1,
            date.getFullYear().toString().substr(4 - RegExp.$1.length));
    }

    for (var k in o) {
        if (new RegExp('(' + k + ')').test(format)) {
            format = format.replace(RegExp.$1,
                RegExp.$1.length === 1 ? o[k] : ('00' + o[k]).substr(('' + o[k]).length));
        }
    }
    return format;
};

export default {
    install (Vue, pluginOptions = {}) {
        Vue.formatTime = Vue.prototype.$formatTime = formatTime;
        Vue.filter('formatTime', function (value, format) {
            if (!format) {
                return value;
            }
            return formatTime(value, format);
        });
    }
};
