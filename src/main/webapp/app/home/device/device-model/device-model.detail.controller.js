(function () {
    'use strict';
    angular.module('erpApp')
        .controller('DeviceModelDetailController', DeviceModelDetailController);

    DeviceModelDetailController.$inject = ['$rootScope', '$scope', '$state', '$http','$stateParams','$timeout',
        'AlertService', '$translate', 'TableController', 'ComboBoxController', 'AlertModalService', 'DeviceModel', 'DeviceType', '$window'];

    function DeviceModelDetailController($rootScope, $scope, $state, $http,$stateParams,$timeout,
                                  AlertService, $translate, TableController, ComboBoxController, AlertModalService, DeviceModel, DeviceType, $window) {
        $scope.blockModal = null;
        $scope.blockUI = function () {
            if($scope.blockModal != null) $scope.blockModal.hide();
            $scope.blockModal = null;
            $scope.blockModal = UIkit.modal.blockUI('<div class=\'uk-text-center\'>Đang xử lý ...<br/><img class=\'uk-margin-top\' src=\'assets/img/spinners/spinner_success.gif\' alt=\'\'>');
        };
        $scope.deviceModel = {};

        DeviceModel.getOne($stateParams.deviceModelId).then(function (data) {
            $scope.deviceModel = data;
        })
    }
})();
