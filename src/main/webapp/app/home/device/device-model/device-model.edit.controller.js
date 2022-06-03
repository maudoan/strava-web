(function () {
    'use strict';
    angular.module('erpApp')
        .controller('DeviceModelEditController', DeviceModelEditController);

    DeviceModelEditController.$inject = ['$rootScope', '$scope', '$state', '$http','$stateParams','$timeout','$window', 'ComboBoxController',
        'AlertService', '$translate', 'TableController', 'Common', 'AlertModalService', 'DeviceModel', 'DeviceType', 'ErrorHandle', 'FileService','Firmware'];

    function DeviceModelEditController($rootScope, $scope, $state, $http,$stateParams,$timeout,$window, ComboBoxController,
                                  AlertService, $translate, TableController, Common, AlertModalService, DeviceModel, DeviceType, ErrorHandle,FileService,Firmware) {
        $scope.blockModal = null;
        $scope.blockUI = function () {
            if($scope.blockModal != null) $scope.blockModal.hide();
            $scope.blockModal = null;
            $scope.blockModal = UIkit.modal.blockUI('<div class=\'uk-text-center\'>Đang xử lý ...<br/><img class=\'uk-margin-top\' src=\'assets/img/spinners/spinner_success.gif\' alt=\'\'>');
        };

        $scope.ComboBox = {};
        $scope.deviceModel = {};
        $scope.editting = false;
        $scope.edit = function(state){
            $scope.editting = state
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
        var params = "query=deviceModelId=="+$stateParams.deviceModelId;
        DeviceModel.getOne($stateParams.deviceModelId).then(function (data) {
            $scope.deviceModel = data;
            $scope.deviceModelOld={};
            Object.assign($scope.deviceModelOld, data);
            deviceTypeComboBox.options = [data.deviceType];
            providerComboBox.options = [data.provider];

            ComboBoxController.init($scope, deviceTypeComboBox);
            ComboBoxController.init($scope, providerComboBox);
            Firmware.getPage(params).then(function (data){
            	$scope.firmwares = data.data;
            })
        });

        $scope.btnDisable = false;
        $scope.submit = function(isClose) {
            if($scope.btnDisable) return;
            var $form = $("#device_model_form");
            $('#device_model_form').parsley();
            if(!$scope.device_model_form.$valid) return;
            if(!Common.checkIsValidForm($form)) return;
            Firmware.getPage(params).then(function (data){
            	$scope.firmwares = data.data;
            	if($scope.firmwares != null && $scope.firmwares.length >0 && ($scope.deviceModel.name != $scope.deviceModelOld.name
            			|| $scope.deviceModel.code != $scope.deviceModelOld.code || $scope.deviceModel.providerId != $scope.deviceModelOld.providerId
            			|| $scope.deviceModel.deviceTypeId != $scope.deviceModelOld.deviceTypeId)){
            		AlertModalService.error("error.deviceModel.errorEdit");
            	}else{
            		$scope.btnDisable = true;
                    $scope.blockUI();
                    // upload Avatar first
                    var file = $("#user-input-form-file")[0].files[0];
                    if(file){
                        FileService.uploadFile(file, 1).then(function (data) {
                            $scope.deviceModel.avatar = data.data.fileName;
                            updateDeviceModel(isClose);
                        }).catch(function (data) {
                            if($scope.blockModal != null) $scope.blockModal.hide();
                            ErrorHandle.handleOneError(data);
                            $scope.btnDisable = false;
                        });
                    } else{
                        // if dont have file: update immedimately
                    	updateDeviceModel(isClose);
                    }
            	}
            })
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
        
        function updateDeviceModel(isClose){
        	console.log($scope.deviceModel);
            DeviceModel.update($scope.deviceModel).then(function(data){
                if($scope.blockModal != null) $scope.blockModal.hide();
                AlertModalService.popup("success.msg.update");
                $timeout(function () {
                    isClose ? $state.go('device-models'): $state.go('device-models-detail',{deviceModelId: data.id});
                },1100);

            }).catch(function(data){
                if($scope.blockModal != null) $scope.blockModal.hide();
                ErrorHandle.handleOneError(data);
                $scope.btnDisable = false;
            });
        }

        // ===================================
        if(angular.element('#device_model_form').length){
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
    }
})();
