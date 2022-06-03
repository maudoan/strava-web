(function () {
    'use strict';

    angular
        .module('erpApp')
        .factory('ErrorHandle', ErrorHandle);

    ErrorHandle.$inject = ['AlertModalService', '$translate', '$timeout', '$state'];

    function ErrorHandle(AlertModalService,$translate, $timeout) {
        var service = {
            handleError: handleError,
            handleErrors:handleErrors,
            handleOneError: handleOneError
        };

        return service;

        function handleError(data) {
            var response = data.data;
            if(response != null) {
                var entity = response.entityName;
                var errorKey = response.errorKey;
                var title = response.title;
                if(title == null || title =="Internal Server Error"){
                    title = "Có lỗi xảy ra, vui lòng liện hệ quản trị viên";
                }
                if(title === "Forbidden") {
                    title =  $translate.instant('error.common.accessDenied');
                }
                if(entity != null && errorKey != null) {
                    AlertModalService.handleOneError(errorKey);
                } else {
                    AlertModalService.handleOneError(title);
                }
            } else {
                AlertModalService.handleOneError("Có lỗi xảy ra, vui lòng liện hệ quản trị viên");
            }

        }

        function handleOneError(data) {
            var response = data.data;
            if(response != null) {
                var entity = response.entityName;
                var errorKey = response.errorKey;
                var title = response.title;
                if(title == null || title =="Internal Server Error"){
                    title = "Có lỗi xảy ra, vui lòng liện hệ quản trị viên";
                }
                if(title === "Forbidden") {
                    title =  $translate.instant('error.common.accessDenied');
                }
                if(entity != null && errorKey != null) {
                    AlertModalService.handleOneError(errorKey);
                } else {
                    AlertModalService.handleOneError(title);
                    $timeout(function () {
                        let path = location.origin;
                        location.replace(path + '/#/dashboard');
                        location.reload();
                    },1500);
                }
            } else {
                AlertModalService.handleOneError("Có lỗi xảy ra, vui lòng liện hệ quản trị viên");
            }
        }

        function handleErrors(data) {
            var msgs = []
            for (var i=0; i< data.length; i++){
                var response = data[i]
                if(response != null) {
                    var entity = response.entityName;
                    var errorKey = response.errorKey;
                    var title = response.title;
                    if(title == null){
                        title = "error.common.referenceError";
                        if (msgs.indexOf(title) == -1){
                            msgs.push(title)
                        }
                    }
                    if(entity != null && errorKey != null) {
                        var msg = "error." + entity + "." + errorKey
                        if (msgs.indexOf(msg) == -1){
                            msgs.push(msg)
                        }
                    }
                }
            }
            var msg_show =''
            for (var i=0;i<msgs.length; i++){
                var msg_t = $translate.instant(msgs[i])
                msg_show +=msg_t +'\n'
            }
            AlertModalService.error(msg_show);
        }
    }
})();
