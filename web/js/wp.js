var QMT_RESTFUL_URL = 'http://localhost:8080/';
var QMT_USER_ID = "CA309603";

var manageSys = manageSys || {};
manageSys.utils = (function () {
    function _alertMsg(sTitle, sMsg, sBtnTxt, sType, fCall) {
        var windom = $('#global_alert_win');
        windom.css('padding', '10px');
        var _win = $('#global_alert_win').data('kendoWindow');
        var btnYes = $('.yes', '#global_alert_win');
        var btnNo = $('.no', '#global_alert_win');
        var winMsg = $('p', '#global_alert_win');
        var callArguments = arguments;
        windom.find('button').off().remove();
        btnNo.text('Cancel');

        if (!_win) {
            $("#global_alert_win").kendoWindow({
                width: 600,
                minHeight: 60,
                draggable: false,
                resizable: false,
                modal: true,
                actions: ["Close"]
            });
            _win = $('#global_alert_win').data('kendoWindow');
            $($("#global_alert_win_wnd_title").next().find("span.k-i-close")).attr("id", "global_alert_win_close_icon_span");
            $($("#global_alert_win").find("span.btn.yes")).attr("id", "global_alert_win_yes_btn_span");
        }
        btnYes.unbind();
        btnYes.bind({
            click: function () {
                callArguments[callArguments.length - 1](true);
                _win.close();
            }
        });
        btnNo.unbind();
        btnNo.bind({
            click: function () {
                callArguments[callArguments.length - 1](false);
                _win.close();
            }
        });

        if (arguments.length == 3) {
            btnNo.hide();
            btnYes.text('OK').show();
            if (sBtnTxt instanceof Array && sBtnTxt.length > 1) {
                btnYes.hide();
                var button, bdata, cur;
                for (var i = 0, l = sBtnTxt.length; i < l; i++) {
                    cur = $.extend({
                        'name': 'Ok',
                        'class': 'btn no',
                        'css': {},
                        action: function () {
                        }
                    }, sBtnTxt[i]);
                    button = $('<button type="button" class="tempbutton" style="min-width: 30px; margin:0 10px; border: 0;"></button>');
                    button.addClass(cur['class']).css(cur.css);
                    button.data('bdata', cur);
                    button.text(cur.name);
                    button.click(function (e) {
                        bdata = $(this).data('bdata');
                        if (typeof bdata.action == 'function') {
                            bdata.action(e);
                        }
                        _win.close();
                    });
                    windom.append(button);
                }
            }
        } else {
            btnNo.show();
            btnYes.text(sBtnTxt);
        }
        _win.center();
        _win.title(sTitle);
        if(sMsg){
            winMsg.html(sMsg);
        }
        else
            winMsg.text(sMsg);
        _win.center();
        _win.open();
    }

    return {
        alertMsg: _alertMsg,
    };
})();

manageSys.getBrowser = (function () {
    var fBrowserRedirect = function () {
        var sUserAgent = navigator.userAgent.toLowerCase();
        var bIsIpad = sUserAgent.match(/ipad/i) == "ipad";
        var bIsChrome = sUserAgent.match(/chrome/i) == "chrome";
        var bIsSafari = sUserAgent.match(/safari/i) == "safari";
        var bIsFirefox = sUserAgent.match(/firefox/i) == "firefox";
        var bIsIE6 = sUserAgent.match(/MSIE\s+6.0/i) == "msie 6.0";
        var bIsIE7 = sUserAgent.match(/MSIE\s+7.0/i) == "msie 7.0";
        var bIsIE8 = sUserAgent.match(/MSIE\s+8.0/i) == "msie 8.0";
        var bIsIE9 = sUserAgent.match(/MSIE\s+9.0/i) == "msie 9.0";
        var bIsIE10 = sUserAgent.match(/MSIE\s+10.0/i) == "msie 10.0";
        var bIsIE11 = sUserAgent.match(/Trident\/7.0/i) == "trident/7.0";
        var useragent = '';
        if (bIsIpad) {
            return 'ipad';
        } else if (bIsChrome) {
            return 'chrome';
        } else if (bIsFirefox) {
            return 'firefox';
        } else if (bIsIE6) {
            return 'IE 6';
        } else if (bIsIE7) {
            return 'IE 7';
        } else if (bIsIE8) {
            return 'IE 8';
        }else if (bIsIE9) {
            return 'IE 9';
        } else if (bIsIE10) {
            return 'ie10';
        } else if (bIsIE11) {
            return 'ie11';
        }else if (bIsSafari) {
            if (sUserAgent.match(/mac\s+os/i)) {
                return 'safari_mac'
            } else {
                return 'safari_windows'
            }
        }
        return useragent
    };
    var ub = fBrowserRedirect();

    return function () {
        return ub;
    }
})();
/*customer_add*/
manageSys.validsession=(function(){
        var validsession_check = function() {
           var _datasource_usersession = new kendo.data.DataSource({
               transport: {
                   read: {
                       dataType: "json",
                       url: QMT_RESTFUL_URL + "QMT/GetValidUserSession"
                   }
               },
               schema: {
                   data: function (response) {
                       return [response]
                   }
               }
           });
            _datasource_usersession.read().then(function () {
               if (_datasource_usersession.data()[0].ResponseCode == 'WP2008') {
                   window.location = '/SessionOut.aspx';
               }
           });
       };
       var ath = validsession_check();
       return function(){
            return ath
       }
});

manageSys.sessioncreation = (function () {
    var validsession_creation = function () {
        var usersessioncreation = new kendo.data.DataSource({
            transport: {
                read: {
                    dataType: "json",
                    url: QMT_RESTFUL_URL + "/QMT/GetUserSession"
                }
            },
            schema: {
                data: function (response) {
                    return [response]
                }
            },
        });
        usersessioncreation.read().then(function () {
        });
    };
    var cs = validsession_creation();
    return function () {
        return cs
    }
});

/*customer_add_end*/