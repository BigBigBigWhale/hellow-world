/**
 * Created by 15755 on 2018/5/6.
 */
var defaultOption = {
    url: '',
    type: 'GET',
    data: {},
    dataType: 'json',
};
var ErrorCode = {
    SUCCESS: 0,
    SYSTEM_REDIRECT: 302,
    SYSTEM_ERROR: 9901,
    FIELD_EXIST: 10006,
};

module.exports = function (opts) {
    var ajaxOption = $.extend({}, defaultOption, opts);
    if (ajaxOption.type.toUpperCase() == 'POST') {
        // 如果是POST提交，自动附带csrf token
        ajaxOption.data[$("[name=csrf-param]").attr("content")] = $("[name=csrf-token]").attr("content");
    }

    var dtd = $.Deferred();
    $.ajax(ajaxOption).done(function (data) {
        if (data.state == ErrorCode.SYSTEM_REDIRECT) {
            // 服务器要求跳转
            if (data.message) {
                alert(data.message);
            }
            window.location.href = data.data;
        } else if (data.state !== ErrorCode.SUCCESS) {
            // 有错误
            dtd.reject(data, data.message, data);
        } else {
            dtd.resolve(data.data);
        }
    }).fail(function(xhr, msg, e) {
        console.log(e);
        if(xhr.readyState == 4) {
            alert('请求超时')
        }
        dtd.reject(e, msg, xhr);
    });

    return dtd.promise();
};