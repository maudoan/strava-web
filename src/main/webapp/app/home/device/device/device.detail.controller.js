(function () {
    'use strict';
    angular.module('erpApp')
        .controller('DeviceDetailController', DeviceDetailController);

    DeviceDetailController.$inject = ['$rootScope', '$scope', '$state', '$http','$stateParams','$timeout',
        'AlertService', '$translate', 'TableController', 'ComboBoxController', 'AlertModalService', 'Device', '$window'];

    function DeviceDetailController($rootScope, $scope, $state, $http,$stateParams,$timeout,
                                  AlertService, $translate, TableController, ComboBoxController, AlertModalService, Device, $window) {
        $scope.blockModal = null;
        $scope.blockUI = function () {
            if($scope.blockModal != null) $scope.blockModal.hide();
            $scope.blockModal = null;
            $scope.blockModal = UIkit.modal.blockUI('<div class=\'uk-text-center\'>Đang xử lý ...<br/><img class=\'uk-margin-top\' src=\'assets/img/spinners/spinner_success.gif\' alt=\'\'>');
        };
        $scope.device = {};
        Device.getFull($stateParams.deviceId).then(function (data) {
            $scope.device = data;
            $scope.device.status = $translate.instant("device.field.status." + data.status);
        });

        $scope.categoryMap = {
            1:'Sensor Box',
            2: 'Bơm',
            3: 'Đèn',
            4: 'Quạt',
            5: 'Cắt nắng',
            6: 'Camera',
            7: 'Khác',
            8: 'Động co',
            9: 'Van',
            10: 'Sensor'
        };

        $scope.categoryOptions = [
            { id: 10, name: 'Sensor'},
            { id: 1, name: 'Sensor Box'},
            { id: 2, name: 'Bơm'},
            { id: 3, name: 'Đèn'},
            { id: 4, name: 'Quạt'},
            { id: 5, name: 'Cắt nắng'},
            { id: 6, name: 'Camera'},
            { id: 7, name: 'Khác'},
            { id: 8, name: 'Động cơ'},
            { id: 9, name: 'Van'}
        ];
    }
})();
