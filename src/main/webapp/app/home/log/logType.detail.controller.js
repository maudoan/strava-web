(function () {
    'use strict';
    angular.module('erpApp')
        .controller('LogTypeDetailController', LogTypeDetailController);

    LogTypeDetailController.$inject = ['$rootScope', '$scope', '$state', '$stateParams','$timeout',
        'AlertService', '$translate','Common', 'AlertModalService', 'LogType'];

    function LogTypeDetailController($rootScope, $scope, $state, $stateParams, $timeout,
                                         AlertService, $translate, Common, AlertModalService, LogType) {
        $scope.blockModal = null;
        $scope.blockUI = function () {
            if($scope.blockModal != null) $scope.blockModal.hide();
            $scope.blockModal = null;
            $scope.blockModal = UIkit.modal.blockUI('<div class=\'uk-text-center\'>Đang xử lý ...<br/><img class=\'uk-margin-top\' src=\'assets/img/spinners/spinner_success.gif\' alt=\'\'>');
        };
        $scope.messages = {
            required: $translate.instant("global.messages.required"),
            maxLength255: $translate.instant("global.messages.maxLength255"),
        };

        $scope.logType = {};
        LogType.getOne($stateParams.logTypeId).then(function (data) {
            $scope.logType = data;
        });
    }
})();
