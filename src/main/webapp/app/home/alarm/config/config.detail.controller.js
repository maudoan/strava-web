(function () {
    'use strict';
    angular.module('erpApp')
            .controller('AlarmConfigDetailController', AlarmConfigDetailController);

    AlarmConfigDetailController.$inject = ['$rootScope', '$scope', '$state', '$stateParams', '$http', '$timeout',
        'AlertService', '$translate', 'TableController', 'ComboBoxController', 'AlertModalService', 'AlarmConfig', 'ErrorHandle', '$window'];

    function AlarmConfigDetailController($rootScope, $scope, $state, $stateParams, $http, $timeout,
            AlertService, $translate, TableController, ComboBoxController, AlertModalService, AlarmConfig, ErrorHandle, $window) {

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

        //Thuoc gateway
        var gatewayCbb = {
            id: 'gatewayCbb',
            url: '/api/devices',
            originParams: 'type==2',
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
            $scope.alarmConfig.enable = "Bật";
            return;

        }).catch(function (data) {
            ErrorHandle.handleOneError(data);
        });
    }
})();
