(function () {
    'use strict';
    angular.module('erpApp')
        .controller('HistoryDetailController', HistoryDetailController);

    HistoryDetailController.$inject = ['$rootScope', '$scope', '$state', '$http','$stateParams',
        'AlertService', '$translate', 'TableController', 'ComboBoxController', 'AlertModalService', 'AlarmHistory'];

    function HistoryDetailController($rootScope, $scope, $state, $http,$stateParams,
                                  AlertService, $translate, TableController, ComboBoxController, AlertModalService, AlarmHistory) {
        var vm = this;
        $scope.ComboBox = {};
        $scope.alarm = {};
        $scope.blockModal;
        $scope.blockUI = function () {
            if ($scope.blockModal != null)
                $scope.blockModal.hide();
            $scope.blockModal = null;
            $scope.blockModal = UIkit.modal.blockUI('<div class=\'uk-text-center\'>Đang xử lý ...<br/><img class=\'uk-margin-top\' src=\'assets/img/spinners/spinner_success.gif\' alt=\'\'>');
        };
        $scope.blockUI();
        
        AlarmHistory.getOne($stateParams.alarmId).then(function (data) {
            $scope.alarm = data;
            if ($scope.blockModal != null) $scope.blockModal.hide();
        }).catch(function (error) {
            if ($scope.blockModal != null) $scope.blockModal.hide();
        });
    }
})();
