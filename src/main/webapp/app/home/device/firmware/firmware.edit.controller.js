(function () {
    'use strict';
    angular.module('erpApp')
        .controller('FirmwareEditController', FirmwareEditController);

    FirmwareEditController.$inject = ['$rootScope', '$scope', '$state', '$http','$stateParams','$timeout','$window', 'ComboBoxController',
        'AlertService', '$translate', 'TableController', 'Common', 'AlertModalService', 'DeviceModel', 'DeviceType',
        'ErrorHandle', 'FileService', 'Firmware', 'Provider','Policy', 'AesCrypt'];

    function FirmwareEditController($rootScope, $scope, $state, $http,$stateParams,$timeout,$window, ComboBoxController,
            AlertService, $translate, TableController, Common, AlertModalService, DeviceModel, DeviceType,
            ErrorHandle,FileService, Firmware, Provider,Policy, AesCrypt) {
        $scope.blockModal = null;
        $scope.blockUI = function () {
            if($scope.blockModal != null) $scope.blockModal.hide();
            $scope.blockModal = null;
            $scope.blockModal = UIkit.modal.blockUI('<div class=\'uk-text-center\'>Đang xử lý ...<br/><img class=\'uk-margin-top\' src=\'assets/img/spinners/spinner_success.gif\' alt=\'\'>');
        };
        $scope.ComboBox = {};
        $scope.firmware = {};
        var oldFilePath = null;

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

        var deviceModelComboBox = {
            id: 'deviceModelCbb',
            url: '/api/device-models',
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
        ComboBoxController.init($scope, deviceModelComboBox);

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

        $scope.changeDeviceModelCbb = function() {
            DeviceModel.getOne($scope.firmware.deviceModelId).then(function (deviceModel) {
                $scope.firmware.deviceModelCode = deviceModel.code;
                $scope.firmware.deviceModelName = deviceModel.name;
            });
        };

        $scope.chooseFile = function() {
            $scope.firmware.filePath = 0;
            //$("#fileName").show();
            $("#btnImport").addClass("md-btn-primary");
            $("#btnImport").removeClass("hideElement");
        };

        $scope.chooseUrlFile = function() {
            $scope.firmware.filePath = 1;
            //$("#fileName").hide();
            $("#btnImport").addClass("hideElement");
            $("#btnImport").removeClass("md-btn-primary");
        };

        $scope.updateDeviceModelCbb = function() {
            var deviceModelId = $scope.firmware.deviceTypeId;
            var providerId = $scope.firmware.providerId;
            if(deviceModelId != null && providerId != null) {
                deviceModelComboBox.options = [""];
                deviceModelComboBox.resetScroll = true;
                deviceModelComboBox.originParams = 'deviceTypeId==' + deviceModelId + ';providerId==' + providerId;
                ComboBoxController.init($scope, deviceModelComboBox);
            }
        };

        $('input[name=form-file]').change(function() {
            $("#fileName").text($("#form-file")[0].files[0].name);
        });

        Firmware.getOne($stateParams.firmwareId).then(function (data) {
        	console.log(data);
            oldFilePath = data.filePath;
            //data.size = (data.size / 1024 / 1024);
            $scope.firmware = data;
            if($scope.firmware.filePath){
            	$scope.firmware.sizeMb = Math.round($scope.firmware.size / 1024 / 1024);
            	$scope.firmware.urlUpdate = $scope.firmware.url;
            }
            if(!data.filePath && data.fileName) {
                $("#fileName").text(data.fileName);
                $("#btnImport").addClass("md-btn-primary");
                $("#btnImport").removeClass("hideElement");
            }
            if($scope.firmware.username != null && $scope.firmware.username != "") {
                $scope.firmware.username = AesCrypt.decrypt($scope.firmware.username);
            }
            if($scope.firmware.password != null && $scope.firmware.password != "") {
                $scope.firmware.password = AesCrypt.decrypt($scope.firmware.password);
            }
            deviceTypeComboBox.options = [data.deviceType];
            providerComboBox.options = [data.provider];
            ComboBoxController.init($scope, deviceTypeComboBox);
            ComboBoxController.init($scope, providerComboBox);

            $timeout(function () {
                deviceModelComboBox.options = [{id: data.deviceModelId,name: data.deviceModelName}];
                ComboBoxController.init($scope, deviceModelComboBox);
            }, 100);
        });

        $scope.submit = function(isClose) {
            if($scope.btnDisable) return;
            var $form = $("#firmware_form");
            $('#firmware_form').parsley();
            if(!$scope.firmware_form.$valid) return;
            if(!Common.checkIsValidForm($form)) return;
            if (!ComboBoxController.checkIsValidForm($form)) return;
            var params = "query=fromVersion=='*,"+$stateParams.firmwareId+",*',versioning=="+$stateParams.firmwareId+",exceptVersion=='*"+$stateParams.firmwareId+"*'";
            Policy.checkUsedPolicy(params).then(function (response) {
                var policies = response.data;
                if(policies != null && policies.length > 0){
                    AlertService.error("error.firmware.alreadyUsedInPolicyCannotEdit");
                }else{
                    $scope.blockUI();
                    processSubmit(isClose);
                }
            });
        };

        function processSubmit(isClose){
            var file = $("#form-file")[0].files[0];
            console.log(oldFilePath);
            console.log(file);
            if(!$scope.firmware.filePath){
            	// change file fw
            	if(oldFilePath || (!oldFilePath && file && file.name != $scope.firmware.fileName)){
            		if(!file) {
                        AlertService.error("error.messages.chooseFile");
                        return;
                    }

                    var fileName = file.name;
                    // check file zip, rar, img
                    if (fileName.substr(-4) !== '.zip' && fileName.substr(-4) !== '.rar' && fileName.substr(-4) !== '.img' && fileName.substr(-3) !== '.gz') {
                        AlertService.error("admin.messages.errorTypeUpload");
                        return;
                    }

                    // file lớn hơn 1GB
                    if (file.size > 1024 * 1024 * 1024) {
                        AlertService.error('error.messages.errorMaximumFirmware');
                        return;
                    }

                    FileService.uploadFile(file, 2).then(function (resp) {
                        $scope.blockModal.hide();
                        if (resp.data.fileName) {
                            $scope.firmware.fileName = resp.data.fileName;
                            $scope.firmware.size = file.size;
                            $scope.firmware.url = $scope.hostGW + "/api/files/download?fileName=" + $scope.firmware.fileName + "&type=2";
                            $scope.firmware.username = null;
                            $scope.firmware.password = null;
                            $scope.btnDisable = true;
                            updateFirmware(isClose);
                        } else {
                            AlertModalService.handleOneError(resp.data.errorMessage);
                        }
                    }).catch(function (data) {
                        $scope.blockModal.hide();
                        ErrorHandle.handleError(data);
                        $("#form-file").val('');
                    });
            	}else{
            		updateFirmware(isClose);
            	}
            }else {
                if ($scope.firmware.sizeMb > 1024) {
                    AlertService.error('error.messages.errorMaximumFirmware');
                    return;
                }
                $scope.firmware.fileName  = $scope.firmware.url = $scope.firmware.urlUpdate;
                $scope.firmware.size = ($scope.firmware.sizeMb * 1024 * 1024);
                $scope.btnDisable = true;
                updateFirmware(isClose);
            }
        }

        function updateFirmware(isClose) {
            Firmware.update($scope.firmware).then(function(data){
                if($scope.blockModal != null) $scope.blockModal.hide();
                AlertModalService.popup("success.msg.update");
                $timeout(function () {
                    isClose ? $state.go('firmwares'): $state.go('firmwares-detail',{firmwareId: data.id});
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
        var $formValidate = $('#firmware_form');
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
