(function () {
    'use strict';
    angular.module('erpApp')
            .controller('AlarmConfigEditController', AlarmConfigEditController);

    AlarmConfigEditController.$inject = ['$rootScope', '$scope', '$state', '$stateParams', '$http', '$timeout',
        'AlertService', '$translate', 'TableController', 'ComboBoxController', 'AlertModalService', 'AlarmConfig', 'Device', 'ErrorHandle', '$window'];

    function AlarmConfigEditController($rootScope, $scope, $state, $stateParams, $http, $timeout,
            AlertService, $translate, TableController, ComboBoxController, AlertModalService, AlarmConfig, Device, ErrorHandle, $window) {

        var tenantId = $window.localStorage.getItem("farmId");
        var tenantName = $window.localStorage.getItem("farmName");

        $scope.hideValue = false;
        $scope.hideOperator = false;
        $scope.hideEnable = true;

        $scope.requiedValue = true;
        $scope.requiedOperator = true;

        $scope.hideMinMax = true;
        $scope.requiedMinMax = false;

        $scope.ComboBox = {};
        $scope.messages = {
            length7: $translate.instant("global.messages.length7"),
            required: $translate.instant("global.messages.required"),
            maxLength255: $translate.instant("global.messages.maxLength255"),
            maxLength256: $translate.instant("global.messages.maxLength256"),
            maxLength500: $translate.instant("global.messages.maxLength500"),
            number: $translate.instant("global.messages.number_msg"),
            phoneMaxLength: $translate.instant("global.messages.phoneMaxLength"),
            maxLength20: $translate.instant("global.messages.maxLength20"),
            email: $translate.instant("global.messages.email"),
            float12_3: $translate.instant("global.messages.float12_3"),
            float12_8: $translate.instant("global.messages.float12_8"),
            phone_msg: $translate.instant("global.messages.phone")
        };

        $scope.blockModal = null;

        $scope.blockUI = function () {
            if ($scope.blockModal != null)
                $scope.blockModal.hide();
            $scope.blockModal = null;
            $scope.blockModal = UIkit.modal.blockUI('<div class=\'uk-text-center\'>Đang xử lý ...<br/><img class=\'uk-margin-top\' src=\'assets/img/spinners/spinner_success.gif\' alt=\'\'>');
        };

        $scope.alarmConfig = {
            "active": 1,
            "tenantId": tenantId,
            "tenantName": tenantName,
            "enable": "Bật"
        };

        $scope.selectedCbb = {
            area: [],
            gateway: []
        };

        ///Khu vuc san xuat
        var areaCbb = {
            id: 'areaCbb',
            url: '/api/areas',
            originParams: 'tenantId == ' + tenantId,
            valueField: 'id',
            labelField: 'name',
            searchField: 'name',
            table: null,
            column: null,
            maxItems: 1,
            ngModel: [],
            options: [],
            placeholder: $translate.instant("global.placeholder.choose")
        };
        ComboBoxController.init($scope, areaCbb);

        $scope.gatewayOptions = [];
        //Thuoc gateway
        var gatewayCbb = {
            id: 'gatewayCbb',
            url: null,
            originParams: null,
            valueField: 'id',
            labelField: 'name',
            searchField: 'name',
            table: null,
            column: null,
            maxItems: 1,
            ngModel: [],
            options: $scope.gatewayOptions,
            placeholder: $translate.instant("global.placeholder.choose")
        };

        ComboBoxController.init($scope, gatewayCbb);

        ///gia tri canh bao
        var typeUnit = [
            {id: 1, name: "EC"},
            {id: 2, name: "PH"},
            {id: 3, name: "Nhiệt độ"},
            {id: 4, name: "Độ ẩm"},
            {id: 5, name: "Mực nước"},
            {id: 6, name: "Lưu lượng nước"},
            {id: 7, name: "Thiết bị hỏng"}

        ];

        var alarmUnitCbb = {
            id: 'alarmUnitCbb',
            url: '',
            originParams: '',
            valueField: 'id',
            labelField: 'name',
            searchField: 'name',
            table: null,
            column: null,
            maxItems: 1,
            ngModel: [],
            options: typeUnit,
            placeholder: $translate.instant("global.placeholder.choose")
        };
        ComboBoxController.init($scope, alarmUnitCbb);

        ////Toan tu
        var typeOperator = [
            {id: 1, name: "="},
            {id: 2, name: ">="},
            {id: 3, name: "<"},
            {id: 4, name: "<="},
            {id: 5, name: $translate.instant("alarm.operator.null")},
            {id: 6, name: $translate.instant("alarm.operator.OutOfRange")}
        ];


        var typeOperator2 = [
            {id: 7, name: "Đầy"},
            {id: 8, name: "Vơi"}
        ];


        var alarmOperatorCbb = {
            id: 'alarmOperatorCbb',
            url: '',
            originParams: '',
            valueField: 'id',
            labelField: 'name',
            searchField: 'name',
            table: null,
            column: null,
            maxItems: 1,
            ngModel: [],
            options: typeOperator,
            placeholder: $translate.instant("global.placeholder.choose")
        };
        ComboBoxController.init($scope, alarmOperatorCbb);

        $scope.changeUnit = function (value) {
            if (value == 7) {
                $scope.hideValue = true;
                $scope.hideOperator = true;
                $scope.hideEnable = false;

                $scope.alarmConfig.value = null;
                $scope.alarmConfig.operator = null;

                $scope.requiedValue = false;
                $scope.requiedOperator = false;


            } else {
                $scope.hideValue = false;
                $scope.hideOperator = false;
                $scope.hideEnable = true;

                $scope.requiedValue = true;
                $scope.requiedOperator = true;

                if (value == 5) {
                    alarmOperatorCbb.options = typeOperator2;
                    $scope.hideValue = true;
                    $scope.alarmConfig.value = null;
                    $scope.requiedValue = false;
                } else {
                    alarmOperatorCbb.options = typeOperator;
                    $scope.hideValue = false;
                    $scope.requiedValue = true;
                }
                ComboBoxController.init($scope, alarmOperatorCbb);
            }
        };

        $scope.changeOperator = function (value) {
            console.log(value);
            if ($scope.alarmConfig.unit != 7) {
                if (value == 5 || value == 6 || value == 7 || value == 8) {
                    $scope.hideValue = true;
                    $scope.alarmConfig.value = null;
                    $scope.requiedValue = false;

                    if (value == 6) {
                        $scope.hideMinMax = false;
                        $scope.requiedMinMax = true;
                    } else {
                        $scope.hideMinMax = true;
                        $scope.requiedMinMax = false;
                        $scope.alarmConfig.min = null;
                        $scope.alarmConfig.max = null;
                    }

                } else {
                    $scope.hideValue = false;
                    $scope.requiedValue = true;

                    $scope.hideMinMax = true;
                    $scope.requiedMinMax = false;
                    $scope.alarmConfig.min = null;
                    $scope.alarmConfig.max = null;
                }
            }
        };

        $scope.changeMinMax = function (min, max) {
            if (min >= max) {
                $scope.alarmConfig.min = 0;
            }
        };

        //Nhan canh bao tu thiet bi
        $scope.changeAlarmActivated = function (value) {
            if (value == 0) {
                $scope.alarmConfig.active = 0;
            } else {
                $scope.alarmConfig.active = 1;
            }
        }

        AlarmConfig.getFull($stateParams.configId).then(function (data) {
            $scope.alarmConfig = data;
            console.log("================");
            console.log(data);
            $scope.alarmConfig.enable = "Bật";
            $scope.alarmConfig.serial = data.serial;
            if (data.areaId) {
                areaCbb.options = [
                    {
                        "id": data.areaId,
                        "name": data.areaName
                    }
                ];

                gatewayCbb.originParams = "type==2;areaId==" + data.areaId;

                ComboBoxController.init($scope, areaCbb);


            }

            if (data.gatewayId) {
                gatewayCbb.options = [
                    {
                        "id": data.gatewayId,
                        "name": data.gatewayName,
                        "serial": data.serial
                    }
                ]
                ComboBoxController.init($scope, gatewayCbb);
                console.log(gatewayCbb.options);
            }

            return;

        }).catch(function (data) {
            ErrorHandle.handleOneError(data);
        });

        $scope.firstLoad = true;
        $scope.areaChange = function () {
            if (!$scope.firstLoad) {
                $timeout(function () {
                    if ($scope.alarmConfig.areaId) {
                        $scope.alarmConfig.areaName = $scope.selectedCbb.area[0].name;
                        $scope.alarmConfig.areaShortName = $scope.selectedCbb.area[0].shortName;

                        if (ComboBoxController.isEmpty($scope.selectedCbb.gateway[0]) || $scope.selectedCbb.gateway[0].area_id != $scope.alarmConfig.areaId) {
                            //$scope.alarmConfig.tenantId = $scope.selectedCbb.area[0].tenantId;
                            console.log("Vao day!!!");
                            //gatewayCbb.originParams = "type==2;areaId==" + $scope.alarmConfig.areaId;
                            //gatewayCbb.options = [""];
                            refreshGatewayCbb($scope.alarmConfig.areaId);
                        }
                    } else {
                        $scope.alarmConfig.areaName = null;
                    }
                    gatewayCbb.resetScroll = true;
                    gatewayCbb.options = $scope.gatewayOptions;

                    ComboBoxController.init($scope, gatewayCbb);
                    console.log("Change khu vuc san xuat areaId = " + $scope.alarmConfig.areaId);
                });
            } else {
                $scope.firstLoad = false;
            }
        };

        function getParameters(shortName, unit) {
            var param_1 = "";
            var param_2 = "";
            console.log(shortName);
            console.log(unit);
            switch (shortName) {
                case "TANK_1":
                case "TANK_2":
                    switch (unit) {
                        case "1": //EC
                            console.log("vao day");
                            param_1 = "EC_HIGH_ALARM";
                            param_2 = "EC_LOW_ALARM";
                            break;
                        case "2": // PH
                            param_1 = "PH_HIGH_ALARM";
                            param_2 = "PH_LOW_ALARM";
                            break;
                        case "3": // Nhiệt độ
                            param_1 = "TEMP_WATER_HIGH_ALARM";
                            param_2 = "TEMP_WATER_LOW_ALARM";
                            break;
                        case "5": // Mực nước
                            param_1 = "SPEED_WATER_LEVEL_ALARM_FLAG"; // Không phải gửi bản tin xuống thiết bị
                            break;
                        case "6": // Lưu lượng nước
                            param_1 = "SPEED_WATER_HIGH_ALARM";
                            param_2 = "SPEED_WATER_LOW_ALARM";
                            break;
                    }
                    break;
                case "AIR_1":
                case "AIR_2":
                    switch (unit) {
                        case "3":
                            param_1 = "TEMP_AIR_HIGH_ALARM";
                            param_2 = "TEMP_AIR_LOW_ALARM";
                            break;
                        case "4":
                            param_1 = "HUM_AIR_HIGH_ALARM";
                            param_2 = "HUM_AIR_LOW_ALARM";
                            break;
                        case "8":
                            param_1 = "LUX_HIGH_ALARM";
                            param_2 = "LUX_LOW_ALARM";
                            break;
                    }
                    break;
                case "SOIL_1":
                case "SOIL_2":
                    switch (unit) {
                        case "1":
                            param_1 = "EC_SOIL_HIGH_ALARM";
                            param_2 = "EC_SOIL_LOW_ALARM";
                            break;
                        case "3":
                            param_1 = "TEMP_SOIL_HIGH_ALARM";
                            param_2 = "TEMP_SOIL_LOW_ALARM";
                            break;
                        case "4":
                            param_1 = "HUM_SOIL_HIGH_ALARM";
                            param_2 = "HUM_SOIL_LOW_ALARM";
                            break;
                    }
                    break;
            }

            if (unit == "7") {
                param_1 = "ERROR";
                param_2 = "ERROR";
            }

            $scope.alarmConfig.paramHigh = param_1;
            $scope.alarmConfig.paramLow = param_2;

            console.log("param_1: " + param_1);
            console.log("param_2: " + param_2);

        }
        ;

        function refreshGatewayCbb(areaId) {
            if (areaId) {
                Device.getGwInArea(areaId).then(function (data) {
                    angular.forEach(data, function (value, key) {
                        var tmp = {
                            "id": value.id,
                            "name": value.name,
                            "serial": value.serial
                        }
                        $scope.gatewayOptions.push(tmp);
                    });
                })
            } else {
                $scope.gatewayOptions = [""];
            }
        }

        /*$scope.gatewayChange = function () {
            $timeout(function () {
                if ($scope.alarmConfig.areaId) {
                    if ($scope.alarmConfig.gatewayId) {
                        $scope.alarmConfig.gatewayName = $scope.selectedCbb.gateway[0].name;
                        $scope.alarmConfig.serial = $scope.selectedCbb.gateway[0].serial;
                    } else {
                        $scope.alarmConfig.gatewayName = null;
                    }
                }
            });
            console.log("Change gateway gatewayId = " + $scope.alarmConfig.gatewayId);
        };*/

        $scope.checkboxEmailOnsite = true;
        $scope.changeCheckbox = function (emailValue, onSiteValue) {
            if (emailValue == true || onSiteValue == true) {
                $scope.checkboxEmailOnsite = true;
            } else {
                $scope.checkboxEmailOnsite = false;
            }
        };

        /*validate create farm form*/
        if (angular.element('#form_edit_alarm_config').length) {
            var $formValidate = $('#form_edit_alarm_config');
            $formValidate.parsley({
                'excluded': 'input[type=button], input[type=submit], input[type=reset], input[type=hidden], .selectize-input > input'
            }).on('form:validated', function () {
                $scope.$apply();
            }).on('field:validated', function (parsleyField) {
                if ($(parsleyField.$element).hasClass('md-input')) {
                    $scope.$apply();
                }
            });
        }

        $scope.btnDisable = false;
        $scope.submit = function (isClose) {
            if ($scope.btnDisable) {
                return;
            }
            $('#form_edit_alarm_config').parsley();
            var $form = $('#form_edit_alarm_config');
            if (!$scope.form_edit_alarm_config.$valid) {
                return;
            }
            if (!ComboBoxController.checkIsValidForm($form)) {
                return;
            }
            $scope.blockUI();
            $scope.btnDisable = true;
            getParameters($scope.alarmConfig.areaShortName, $scope.alarmConfig.unit);
            updateAlarmConfig(isClose);
        };

        function updateAlarmConfig(isClose) {

            if ($scope.alarmConfig.areaId) {
                if ($scope.alarmConfig.gatewayId) {
                    $scope.alarmConfig.gatewayName = $scope.selectedCbb.gateway[0].name;
                    $scope.alarmConfig.serial = $scope.selectedCbb.gateway[0].serial;
                } else {
                    $scope.alarmConfig.gatewayName = null;
                }
            }
            
            if ($scope.checkboxEmailOnsite == false) {
                AlertModalService.handleOneError("Bạn chưa chọn phương thức cảnh báo");
                $scope.btnDisable = false;
            } else {
                AlarmConfig.update($scope.alarmConfig).then(function (data) {
                    if ($scope.blockModal != null)
                        $scope.blockModal.hide();
                    AlertModalService.popup("success.msg.update");
                    $timeout(function () {
                        isClose ? $state.go('alarm-config') : $state.go('alarm-config-detail', {configId: data.id});
                    }, 1100);
                }).catch(function (data) {
                    if ($scope.blockModal != null)
                        $scope.blockModal.hide();
                    ErrorHandle.handleOneError(data);
                    $scope.btnDisable = false;
                });
            }
        }
    }
})();
