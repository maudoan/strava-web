(function () {
    'use strict';
    angular.module('erpApp')
        .controller('DeviceModelCreateController', DeviceModelCreateController);

    DeviceModelCreateController.$inject = ['$rootScope', '$scope', '$state', '$http', '$timeout', '$window',
        'AlertService', '$translate', 'TableController', 'Common', 'AlertModalService', 'DeviceModel', 'DeviceType', 'ErrorHandle', 'ComboBoxController','FileService'];

    function DeviceModelCreateController($rootScope, $scope, $state, $http, $timeout, $window,
                                 AlertService, $translate, TableController, Common, AlertModalService, DeviceModel, DeviceType, ErrorHandle, ComboBoxController,FileService) {
        $scope.blockModal = null;
        $scope.blockUI = function () {
            if($scope.blockModal != null) $scope.blockModal.hide();
            $scope.blockModal = null;
            $scope.blockModal = UIkit.modal.blockUI('<div class=\'uk-text-center\'>Đang xử lý ...<br/><img class=\'uk-margin-top\' src=\'assets/img/spinners/spinner_success.gif\' alt=\'\'>');
        };

        $scope.ComboBox = {};
        $scope.deviceModel = {
        };

        var deviceTypeComboBox = {
            id: 'deviceTypeCbb',
            url: '/api/device-types',
            originParams: null,
            valueField: 'id',
            labelField: 'name',
            searchField: 'name',
            table: null,
            column: null,
            maxItems: 1,
            ngModel: [],
            options: [],
            placeholder: null,
            orderBy: 'name,asc'
        };
        ComboBoxController.init($scope, deviceTypeComboBox);

        var providerComboBox = {
            id: 'providerCbb',
            url: '/api/providers',
            originParams: null,
            valueField: 'id',
            labelField: 'name',
            searchField: 'name',
            table: null,
            column: null,
            maxItems: 1,
            ngModel: [],
            options: [],
            placeholder: null,
            orderBy: 'name,asc'
        };
        ComboBoxController.init($scope, providerComboBox);

        $scope.submit = function(isClose) {
            if($scope.btnDisable) return;
            var $form = $("#device_model_form");
            $('#device_model_form').parsley();
            if(!$scope.device_model_form.$valid) return;
            if(!Common.checkIsValidForm($form)) return;
            if (!ComboBoxController.checkIsValidForm($form)) return;
            $scope.btnDisable = true;
            $scope.blockUI();
            // upload Avatar first
            var file = $("#user-input-form-file")[0].files[0];
            if(file && file != null){
            	FileService.uploadFile(file,1).then(function (data) {
                    $scope.deviceModel.avatar = data.data.fileName;
                    createDeviceModel(isClose);
                }).catch(function (data) {
                    if($scope.blockModal != null) $scope.blockModal.hide();
                    ErrorHandle.handleOneError(data);
                    $scope.btnDisable = false;
                });
            } else{
                // if dont have file: update immedimately
            	createDeviceModel(isClose);
            }
        };
        
        $scope.deleteAvatar = function () {
            UIkit.modal.confirm($translate.instant("global.messages.deleteAvatar"), function () {
                // xóa image dã chọn trong input
                $('#user-input-form-file').val("");
                $scope.deviceModel.avatar = "";
                $scope.user.userAvatarBase64 = "";
            }, {
                labels: {
                    'Ok': $translate.instant("global.button.ok"),
                    'Cancel': $translate.instant("global.button.cancel")
                }
            });
        }

        function createDeviceModel(isClose){
        	console.log($scope.deviceModel);
            DeviceModel.create($scope.deviceModel).then(function(data){
                if($scope.blockModal != null) $scope.blockModal.hide();
                AlertModalService.popup("success.msg.create");
                $timeout(function () {
                    isClose ? $state.go('device-models'): $state.go('device-models-detail',{deviceModelId: data.id});
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
        var $formValidate = $('#device_model_form');
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
