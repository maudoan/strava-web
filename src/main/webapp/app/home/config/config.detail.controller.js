(function () {
    'use strict';
    angular.module('erpApp')
        .controller('ConfigDetailController', ConfigDetailController);

    ConfigDetailController.$inject = ['$rootScope', '$scope', '$state', '$stateParams','$timeout',
        'AlertService', '$translate','Common', 'AlertModalService', 'Config'];

    function ConfigDetailController($rootScope, $scope, $state, $stateParams, $timeout,
                                         AlertService, $translate, Common, AlertModalService, Config) {
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

        $scope.config = {};
        Config.getOne($stateParams.configId).then(function (data) {
            $scope.config = data;
        });
    }
})();
