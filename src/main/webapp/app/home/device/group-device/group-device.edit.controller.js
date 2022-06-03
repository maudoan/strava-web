(function () {
    'use strict';
    angular.module('erpApp')
        .controller('GroupDeviceEditController', GroupDeviceEditController);

    GroupDeviceEditController.$inject = ['$rootScope', '$scope', '$state','$stateParams','$timeout', '$translate',
        'ErrorHandle', 'TableController', 'ComboBoxController', 'AlertModalService',
        'Device','Area','GroupDevice', 'AutomaticControl'];

    function GroupDeviceEditController($rootScope, $scope, $state,$stateParams,$timeout, $translate,
                                       ErrorHandle, TableController, ComboBoxController, AlertModalService,
                                       Device, Area, GroupDevice, AutomaticControl) {
        $scope.ComboBox = {};
        $scope.isExistsValue = false;
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
        $scope.groupDevice = {};
        $scope.devices = {};
        $scope.selectedCbb = {
            area: null
        };
        $scope.oldData = {
            tenantId: null,
            areaId: null,
            gatewayId: null
        };

        // area combobox
        var areaCbb = {
            id: 'areaCbb',
            url: '/api/areas',
            originParams: '',
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
            placeholder: 'Chọn gateway',
            orderBy: 'id,asc'
        };
        ComboBoxController.init($scope, gatewayCbb);

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
            defaultSort:"created",          //sap xep mac dinh theo cot nao
            sortType: "desc",                //kieu sap xep
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
                if($scope.oldData.areaId == $scope.groupDevice.areaId) return;
                $scope.oldData.areaId = $scope.groupDevice.areaId;

                var areaId = $scope.groupDevice.areaId ? $scope.groupDevice.areaId : 0;
                if(!areaId){
                    $scope.areaIds = [];
                    refreshGatewayCbb();
                    return;
                }

                // get child area
                Area.getChild(areaId).then(function (res) {
                    $scope.areaIds = res.data;
                    refreshGatewayCbb();
                }).catch(function (err) {
                    console.log(err);
                });
            });
        };

        $scope.gatewayChange = function(){
            $timeout(function () {
                if($scope.oldData.gatewayId == $scope.groupDevice.gatewayId) return;
                $scope.oldData.gatewayId = $scope.groupDevice.gatewayId;

                tableConfig.customParams = "tenantId==" + $scope.groupDevice.tenantId + ";type==1;category!=1;gatewayId==" + ($scope.groupDevice.gatewayId ? $scope.groupDevice.gatewayId : 0);
                TableController.reloadPage(tableConfig.tableId);
            });
        };

        function refreshGatewayCbb(){
            var areaIds = $scope.areaIds && $scope.areaIds.length > 0 ? $scope.areaIds : 0;
            gatewayCbb.resetScroll = true;
            gatewayCbb.options = [""];
            gatewayCbb.originParams = "tenantId==" + $scope.groupDevice.tenantId + ";type==2;areaId=in=(" + areaIds.toString() + ")";
            ComboBoxController.init($scope, gatewayCbb);
        }

        // ===========================================
        GroupDevice.getFull($stateParams.groupDeviceId).then(function (data) {
            $scope.groupDevice = data;
            $scope.oldData.tenantId = data.tenantId;
            $scope.oldData.areaId = data.areaId;
            $scope.oldData.gatewayId = data.gatewayId;

            areaCbb.originParams = "tenantId==" + $scope.groupDevice.tenantId;
            areaCbb.options = [data.area];
            ComboBoxController.init($scope, areaCbb);

            Area.getChild(data.areaId).then(function (res) {
                gatewayCbb.originParams = "tenantId==" + $scope.groupDevice.tenantId + ";type==2;areaId=in=(" + res.data.toString() + ")";
                gatewayCbb.options = [data.gateway];
                ComboBoxController.init($scope, gatewayCbb);
            });

            $scope.TABLES[tableConfig.tableId].customParams = "tenantId==" + $scope.groupDevice.tenantId + ";type==1;category!=1;gatewayId==" + $scope.groupDevice.gatewayId;
            TableController.reloadPage(tableConfig.tableId);

            // check xem da co dktdk chua
            AutomaticControl.getPageSimple("query=tenantId==" + $scope.groupDevice.tenantId + ";groupDeviceId==" + $scope.groupDevice.id + "&page=0&size=1").then(function (res) {
                if(res.data && res.data.length > 0) $scope.isExistsValue = true;
            })
        });

        // ==============================================
        // đánh checkbox cho table
        $scope.$watch('devices', function () {
            $scope.TABLES['devices'].param_check_list = $scope.groupDevice.deviceIds ? $scope.groupDevice.deviceIds : [];
        });

        // ================= SUBMIT ======================
        $scope.btnDisable = false;
        $scope.submit = function(isClose) {
            if($scope.btnDisable) return;
            var $form = $("#group_device_form");
            $('#group_device_form').parsley();
            if(!$scope.group_device_form.$valid) return;
            if(!ComboBoxController.checkIsValidForm($form)) return;

            $scope.groupDevice.deviceIds = $scope.TABLES['devices'].param_check_list;
            $scope.btnDisable = true;
            $scope.blockUI();
            updateGroupDevice(isClose);
        }

        function updateGroupDevice(isClose){
            GroupDevice.update($scope.groupDevice).then(function(data){
                if($scope.blockModal != null) $scope.blockModal.hide();

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
