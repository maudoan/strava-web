(function () {
    'use strict';
    angular.module('erpApp')
        .controller('GroupDeviceCreateController', GroupDeviceCreateController);

    GroupDeviceCreateController.$inject = ['$rootScope', '$scope', '$state', '$http','$timeout',
        'AlertService', '$translate', 'TableController', 'ComboBoxController', 'AlertModalService',
        'GroupDevice','ErrorHandle', 'Area', 'Device', '$window'];

    function GroupDeviceCreateController($rootScope, $scope, $state, $http,$timeout,
                                  AlertService, $translate, TableController, ComboBoxController, AlertModalService,
                                    GroupDevice, ErrorHandle, Area, Device, $window) {
        $scope.tenantId = $window.localStorage.getItem("farmId") ? $window.localStorage.getItem("farmId") : 0;
        $scope.tenantName = $window.localStorage.getItem("farmName") ? $window.localStorage.getItem("farmName") : '';

        $scope.ComboBox = {};
        $scope.blockModal = null;
        $scope.blockUI = function () {
            if($scope.blockModal != null) $scope.blockModal.hide();
            $scope.blockModal = null;
            $scope.blockModal = UIkit.modal.blockUI('<div class=\'uk-text-center\'>Đang xử lý ...<br/><img class=\'uk-margin-top\' src=\'assets/img/spinners/spinner_success.gif\' alt=\'\'>');
        };

        $scope.messages = {
            required: $translate.instant("global.messages.required"),
            maxLength255: $translate.instant("global.messages.maxLength255")
        };

        $scope.areaIds = [];
        $scope.selectedCbb = {
            area: null
        };

        $scope.groupDevice = {
            type: 0, //1 thu cong, 0 tu dong
            areaId: 0,
            gatewayId: 0,
            deviceIds: [],
            tenantId: $scope.tenantId
        };

        // area combobox
        var areaCbb = {
            id: 'areaCbb',
            url: '/api/areas',
            originParams: "tenantId==" + $scope.tenantId,
            valueField: 'id',
            labelField: 'name',
            searchField: 'name',
            table: null,
            column: null,
            maxItems: 1,
            ngModel: [],
            options: [],
            placeholder: 'Chọn khu vực',
            orderBy: 'name,asc'
        };
        ComboBoxController.init($scope, areaCbb);

        // gateway combobox
        // var gatewayCbb = {
        //     id: 'gatewayCbb',
        //     url: '/api/devices',
        //     originParams: 'type==2;tenantId==' + $scope.tenantId,
        //     valueField: 'id',
        //     labelField: 'name',
        //     searchField: 'name',
        //     table: null,
        //     column: null,
        //     maxItems: 1,
        //     ngModel: [],
        //     options: [],
        //     placeholder: 'Chọn gateway',
        //     orderBy: 'id,asc'
        // };
        // ComboBoxController.init($scope, gatewayCbb);
        $scope.selectize_gw_config = {
            plugins: {
                'remove_button': {
                    label     : ''
                }
            },
            maxItems: 1,
            valueField: 'id',
            labelField: 'name',
            searchField: 'name',
            create: false,
        };
        $scope.selectize_gw_options = [
        ]

        var typeOptions = [
            { id: 1, name: 'Thủ công'},
            { id: 0, name: 'Tự động'}
        ];
        // type combobox
        var typeCbb = {
            id: 'typeCbb',
            url: '',
            originParams: '',
            valueField: 'id',
            labelField: 'name',
            searchField: 'name',
            table: null,
            column: null,
            maxItems: 1,
            ngModel: [],
            options: typeOptions,
            placeholder: 'Chọn chế độ'
        };
        ComboBoxController.init($scope, typeCbb);

        // khai bao cac column va kieu du lieu
        var columns = {
            'id':'Number',
            'serial':'Text',
            'name':'Text',
            'code':'Text',
            'type':'Text',
            'tenantId':'Number',
            'areaId':'Number',
            'typeFarm':'Number',
            'gw':'Text',
            'state':'Text',
            'gatewayId':'Number'
        };

        // khai bao cau hinh cho bang
        var tableConfig = {
            tableId: "devices",               //table Id
            model: "devices",                 //model
            defaultSort:"autoManualLocal",          //sap xep mac dinh theo cot nao
            sortType: "asc",                //kieu sap xep
            loadFunction: Device.getPage,     //api load du lieu
            columns: columns,               //bao gom cac cot nao
            handleAfterReload: null,        //xu ly sau khi load du lieu
            handleAfterReloadParams: null,  //tham so cho xu ly sau khi load
            deleteCallback: null,           //delete callback
            customParams: "type==1;category!=1;gatewayId==" + $scope.groupDevice.gatewayId,               //dieu kien loc ban dau
            pager_id: "table_device_pager",   //phan trang
            page_id: "device_selectize_page", //phan trang
            page_number_id: "device_selectize_pageNum",   //phan trang
            page_size_option: ["5", "10", "25", "50"]   //lua chon size cua 1 page
        };

        TableController.initTable($scope, tableConfig);     //khoi tao table
        TableController.sortDefault(tableConfig.tableId);   //set gia tri sap xep mac dinh
        // TableController.reloadPage(tableConfig.tableId);    //load du lieu cho table

        // ==================== CBB EVENT ===================

        $scope.areaChange = function(){
            $timeout(function () {
                var areaId = $scope.groupDevice.areaId ? $scope.groupDevice.areaId : 0;
                if(!areaId){
                    $scope.areaIds = [];
                    return;
                }
                // get child area
                Area.getChild(areaId).then(function (res) {
                    $scope.areaIds = res.data;
                }).catch(function (err) {
                    console.log(err);
                });
                refreshGatewayCbb($scope.groupDevice.areaId);
            });
        };

        $scope.gatewayChange = function(){
            $timeout(function () {
                // chỉ lấy những device chưa thuộc group nào - và không phải là SensorBox
                tableConfig.customParams = "tenantId==" + $scope.tenantId + ";type==1;category!=1;groupDeviceId==null;gatewayId==" + ($scope.groupDevice.gatewayId ? $scope.groupDevice.gatewayId : 0);
                TableController.reloadPage(tableConfig.tableId);
            });
        };

        function refreshGatewayCbb(areaId){
            if(areaId){
                Device.getGwInArea(areaId).then(function (data) {
                    $scope.selectize_gw_options = data;
                })
            } else {
                $scope.selectize_gw_options = [];
            }
        }

        // ================= SUBMIT ======================
        $scope.btnDisable = false;
        $scope.submit = function(isClose) {
            if($scope.btnDisable) return;
            var $form = $("#group_device_form");
            $('#group_device_form').parsley();
            if(!$scope.group_device_form.$valid) return;
            if(!ComboBoxController.checkIsValidForm($form)) return;
            // list thiet bi
            $scope.groupDevice.deviceIds = $scope.TABLES['devices'].param_check_list;


            $scope.btnDisable = true;
            $scope.blockUI();
            createDevice(isClose);
        }
        function createDevice(isClose){
            GroupDevice.create($scope.groupDevice).then(function(data){
                if($scope.blockModal != null) $scope.blockModal.hide();
                // $scope.device = data;
                AlertModalService.popup("success.msg.create");
                $timeout(function () {
                    isClose ? $state.go('devices'): $state.go('group-device-detail',{groupDeviceId: data.id});
                },1100);
                $scope.btnDisable = false;
            }).catch(function(data){
                if($scope.blockModal != null) $scope.blockModal.hide();
                ErrorHandle.handleOneError(data);
                $scope.btnDisable = false;
            });
        }

        // ================ VALIDATE FORM INITIAL ============
        var $formValidate = $('#group_device_form');
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
