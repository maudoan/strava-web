(function () {
    'use strict';
    angular.module('erpApp')
        .controller('LogTypeEditController', LogTypeEditController);

    LogTypeEditController.$inject = ['$rootScope', '$scope', '$state', '$stateParams',
        'AlertService', '$translate', '$timeout','Common', 'AlertModalService', 'LogType','ErrorHandle'];

    function LogTypeEditController($rootScope, $scope, $state, $stateParams,
                                         AlertService, $translate, $timeout, Common, AlertModalService, LogType,ErrorHandle) {
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

        $scope.submit = function(isClose) {
            if($scope.btnDisable) return;
            // validate form
            if(!Common.checkIsValidForm($formValidate)) return;

            $scope.btnDisable = true;
            $scope.blockUI();

            createLogType(isClose);
        };

        function createLogType(isClose){
            $scope.btnDisable = false;
            LogType.update($scope.logType).then(function(data){
                if($scope.blockModal != null) $scope.blockModal.hide();

                AlertModalService.popup("success.msg.create");
                $timeout(function () {
                    isClose ? $state.go('logTypes'): $state.go('logTypes-detail',{logTypeId: data.id});
                },1100);

                if($scope.blockModal != null) $scope.blockModal.hide();
                $scope.btnDisable = false;
            }).catch(function(data){
                if($scope.blockModal != null) $scope.blockModal.hide();
                ErrorHandle.handleOneError(data);

                $scope.btnDisable = false;
            });
        }

        // ======================================
        var $formValidate = $('#logType_form');
        $formValidate.parsley({
            'excluded': 'input[type=button], input[type=submit], input[type=reset], input[type=hidden], .selectize-input > input'
        }).on('form:validated',function() {
            $scope.$apply();
        }).on('field:validated',function(parsleyField) {
            if($(parsleyField.$element).hasClass('md-input')) {
                $scope.$apply();
            }
        });
    }
})();
