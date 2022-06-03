(function() {
    'use strict';

    angular
        .module('erpApp')
        .provider('AlertModalService', AlertModalService);

    function AlertModalService () {
        this.toast = false;
        /*jshint validthis: true */
        this.$get = getService;

        this.showAsToast = function(isToast) {
            this.toast = isToast;
        };

        getService.$inject = ['$timeout', '$sce', '$translate','$rootScope'];

        function getService ($timeout, $sce,$translate,$rootScope) {
            $rootScope.$on('$stateChangeSuccess', function () {
                closeAlert(0,alerts)
            });
            var toast = this.toast,
                alertId = 0, // unique id for each alert. Starts from 0.
                alerts = [],
                timeout = 10000000; // default timeout

            return {
                factory: factory,
                isToast: isToast,
                add: addAlert,
                closeAlert: closeAlert,
                closeAlertByIndex: closeAlertByIndex,
                clear: clear,
                get: get,
                success: success,
                error: error,
                info: info,
                warning : warning,
                closeAllAlert:closeAllAlert,
                closeModal:closeModal,
                popup:popup,
                handleOneError: handleOneError
            };

            function closeAllAlert(){
                closeAlert(0,alerts)
            }

            function isToast() {
                return toast;
            }

            function clear() {
                alerts = [];
            }

            function get() {
                return alerts;
            }

            function showModal(){
                $timeout(function () {angular.element("#alertBtn").trigger("click");});
            }

            function closeModal(){
                this.closeAlert(0,alerts);
                $timeout(function () {angular.element("#alertCloseBtn").trigger("click");});
                $('.uk-modal-page, .uk-modal-page body').css({'overflow-y':'scroll'});
            }

            function popup(msg,time){
                this.closeAlert(0,alerts);
                this.success(msg);
                if(!angular.isDefined(time) || time == null){time = 1000;}
                $('.uk-modal-page, .uk-modal-page body').css({'overflow-y':'scroll'});
                $timeout(function () {
                    angular.element("#alertCloseBtn").trigger("click");
                    $('.uk-modal-page, .uk-modal-page body').css({'overflow-y':'scroll'});
                    },time);
            }

            function success(msg, params, position) {
                showModal();
                return this.add({
                    type: 'success',
                    msg: msg,
                    params: params,
                    timeout: timeout,
                    toast: toast,
                    position: position,
                    msgClass:"uk-notify-message uk-notify-message-success"
                });
            }

            function error(msg, params, position) {
                showModal();
                return this.add({
                    type: 'danger',
                    msg: msg,
                    params: params,
                    timeout: timeout,
                    toast: toast,
                    position: position,
                    msgClass:"uk-notify-message uk-notify-message-danger"
                });
            }

            function handleOneError(msg, params, position) {
                showModal();
                this.closeAlert(0,alerts);

                return this.add({
                    type: 'danger',
                    msg: msg,
                    params: params,
                    timeout: timeout,
                    toast: toast,
                    position: position,
                    msgClass:"uk-notify-message uk-notify-message-danger"
                });
            }

            function warning(msg, params, position) {
                showModal();
                return this.add({
                    type: 'warning',
                    msg: msg,
                    params: params,
                    timeout: timeout,
                    toast: toast,
                    position: position,
                    msgClass:"uk-notify-message uk-notify-message-warning"
                });
            }

            function info(msg, params, position) {
                showModal();
                return this.add({
                    type: 'info',
                    msg: msg,
                    params: params,
                    timeout: timeout,
                    toast: toast,
                    position: position,
                    msgClass:"uk-notify-message uk-notify-message-info"
                });
            }

            function factory(alertOptions) {
                var alert = {
                    type: alertOptions.type,
                    msg: $sce.trustAsHtml(alertOptions.msg),
                    id: alertOptions.alertId,
                    timeout: alertOptions.timeout,
                    toast: alertOptions.toast,
                    position: alertOptions.position ? alertOptions.position : 'top right',
                    scoped: alertOptions.scoped,
                    msgClass:alertOptions.msgClass,
                    close: function (alerts) {
                        return closeAlert(this.id, alerts);
                    }
                };
                if(!alert.scoped) {
                    alerts.push(alert);
                }
                $('.uk-modal-dialog-replace').remove();
                return alert;
            }

            function addAlert(alertOptions, extAlerts) {
                alertOptions.alertId = alertId++;
                alertOptions.msg = $translate.instant(alertOptions.msg, alertOptions.params);
                var that = this;
                var alert = this.factory(alertOptions);
                return alert;
            }

            function closeAlert(id, extAlerts) {
                var thisAlerts = extAlerts ? extAlerts : alerts;
                return closeAlertByIndex(thisAlerts.map(function(e) { return e.id; }).indexOf(id), thisAlerts);
            }

            function closeAlertByIndex(index, thisAlerts) {
                $timeout(function () {
                    $('.uk-modal-page').css({'overflow-y': 'scroll'});
                    $('.uk-modal-page body').css({ 'overflow-y': 'unset', 'padding-right': 0});
                }, 100);
                return thisAlerts.splice(index, 1);
            }
        }
    }
})();
