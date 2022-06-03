(function () {
    'use strict';
    angular.module('erpApp')
        .controller('FirmwareCreateController', FirmwareCreateController);

    FirmwareCreateController.$inject = ['$rootScope', '$scope', '$state', '$http', '$timeout', '$window',
        'AlertService', '$translate', 'TableController', 'Common', 'AlertModalService', 'DeviceModel',
        'DeviceType', 'ErrorHandle', 'ComboBoxController','FileService', 'Firmware'];

    function FirmwareCreateController($rootScope, $scope, $state, $http, $timeout, $window,
         AlertService, $translate, TableController, Common, AlertModalService, DeviceModel, DeviceType, ErrorHandle,
                                      ComboBoxController,FileService, Firmware) {
        $scope.blockModal = null;
        $scope.blockUI = function () {
            if($scope.blockModal != null) $scope.blockModal.hide();
            $scope.blockModal = null;
            $scope.blockModal = UIkit.modal.blockUI('<div class=\'uk-text-center\'>Đang xử lý ...<br/><img class=\'uk-margin-top\' src=\'assets/img/spinners/spinner_success.gif\' alt=\'\'>');
        };
        $scope.ComboBox = {};
        $scope.firmware = {
        	providerId:1
        };
        $scope.firmware.filePath = 1;

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

        $scope.submit = function(isClose) {
            if($scope.btnDisable) return;
            var $form = $("#firmware_form");
            $('#firmware_form').parsley();
            if(!$scope.firmware_form.$valid) return;
            if(!Common.checkIsValidForm($form)) return;
            if (!ComboBoxController.checkIsValidForm($form)) return;
            $scope.blockUI();
            processSubmit(isClose);
        };

        $('input[name=form-file]').change(function() {
        	var file = $("#form-file")[0].files[0];
        	if(file == undefined || file == null || file == '') $("#fileName").text("");
        	else $("#fileName").text($("#form-file")[0].files[0].name);
        });

        function processSubmit(isClose){
            if(!$scope.firmware.filePath) {
                var file = $("#form-file")[0].files[0];

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

                // file lớn hơn 1024 MB
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
                        $scope.btnDisable = true;
                        createFirmware(isClose);
                    } else {
                        AlertModalService.handleOneError(resp.data.errorMessage);
                    }
                }).catch(function (data) {
                    $scope.blockModal.hide();
                    ErrorHandle.handleError(data);
                    $("#form-file").val('');
                });
            } else {
                // file lớn hơn 1024 MB
                if ($scope.firmware.sizeMb > 1024) {
                    AlertService.error('error.messages.errorMaximumFirmware');
                    return;
                }
                $scope.firmware.size = ($scope.firmware.sizeMb * 1024 * 1024);
                $scope.firmware.url = $scope.firmware.fileName;
                $scope.btnDisable = true;
                createFirmware(isClose);
            }
        }

        function createFirmware(isClose) {
            Firmware.create($scope.firmware).then(function(data){
                if($scope.blockModal != null) $scope.blockModal.hide();
                AlertModalService.popup("success.msg.create");
                $timeout(function () {
                    isClose ? $state.go('firmwares'): $state.go('firmwares-detail',{firmwareId: data.id});
                },1100);
                if($scope.blockModal != null) $scope.blockModal.hide();
                $scope.btnDisable = false;
            }).catch(function(data){
                if($scope.blockModal != null) $scope.blockModal.hide();
                ErrorHandle.handleOneError(data);
                if($scope.firmware.fileName != null || $scope.firmware.fileName != "") {
                    FileService.deleteFileUpload($scope.firmware.fileName, 2);
                }
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
