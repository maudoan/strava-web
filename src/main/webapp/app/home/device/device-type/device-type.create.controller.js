(function () {
    'use strict';
    angular.module('erpApp')
        .controller('DeviceTypeCreateController', DeviceTypeCreateController);

    DeviceTypeCreateController.$inject = ['$rootScope', '$scope', '$state', '$http','$timeout','$window',
        'AlertService', '$translate', 'TableController', 'Common', 'AlertModalService', 'DeviceType','ErrorHandle', 'FileService'];

    function DeviceTypeCreateController($rootScope, $scope, $state, $http,$timeout,$window,
                                  AlertService, $translate, TableController, Common, AlertModalService, DeviceType,ErrorHandle, FileService) {
        $scope.blockModal = null;
        $scope.blockUI = function () {
            if($scope.blockModal != null) $scope.blockModal.hide();
            $scope.blockModal = null;
            $scope.blockModal = UIkit.modal.blockUI('<div class=\'uk-text-center\'>Đang xử lý ...<br/><img class=\'uk-margin-top\' src=\'assets/img/spinners/spinner_success.gif\' alt=\'\'>');
        };

        $scope.deviceType = {};
        
        $scope.submit = function(isClose) {
            if($scope.btnDisable) return;
            var $form = $("#device_type_form");
            $('#device_type_form').parsley();
            if(!$scope.device_type_form.$valid) return;
            if(!Common.checkIsValidForm($form)) return;
            $scope.btnDisable = true;
            $scope.blockUI();

            // upload Avatar first
            var file = $("#user-input-form-file")[0].files[0];
            if(file){
                FileService.uploadFile(file, 1).then(function (data) {
                    $scope.deviceType.avatar = data.data.fileName;
                    createDeviceType(isClose);
                }).catch(function (data) {
                    if($scope.blockModal != null) $scope.blockModal.hide();
                    ErrorHandle.handleOneError(data);
                    $scope.btnDisable = false;
                });
            } else{
                // if dont have file: update immedimately
                createDeviceType(isClose);
            }
        };

        function createDeviceType(isClose){
            DeviceType.create($scope.deviceType).then(function(data){
                if($scope.blockModal != null) $scope.blockModal.hide();
                AlertModalService.popup("success.msg.create");
                $timeout(function () {
                    isClose ? $state.go('device-types'): $state.go('device-types-detail',{deviceTypeId: data.id});
                },1100);
                if($scope.blockModal != null) $scope.blockModal.hide();
                $scope.btnDisable = false;
            }).catch(function(data){
                if($scope.blockModal != null) $scope.blockModal.hide();
                ErrorHandle.handleOneError(data);
                $scope.btnDisable = false;
            });
        }

        $scope.deleteAvatar = function () {
            UIkit.modal.confirm($translate.instant("global.messages.deleteAvatar"), function () {
                // xóa image dã chọn trong input
                $('#user-input-form-file').val("");
                $scope.deviceType.avatar = "";
                $scope.user.userAvatarBase64 = "";
            }, {
                labels: {
                    'Ok': $translate.instant("global.button.ok"),
                    'Cancel': $translate.instant("global.button.cancel")
                }
            });
        };

        // ======================================
        var $formValidate = $('#device_type_form');
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
