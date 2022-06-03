(function () {
    'use strict';
    angular.module('erpApp')
        .controller('GroupDeviceDetailController', GroupDeviceDetailController);

    GroupDeviceDetailController.$inject = ['$rootScope', '$scope', '$state', '$http','$stateParams',
        'AlertService', '$translate', 'TableController', 'ComboBoxController', 'AlertModalService', 'GroupDevice', 'Device', 'AutomaticControl'];

    function GroupDeviceDetailController($rootScope, $scope, $state, $http,$stateParams,
                                  AlertService, $translate, TableController, ComboBoxController, AlertModalService, GroupDevice, Device, AutomaticControl) {
        $scope.ComboBox = {};
        $scope.blockModal = null;
        $scope.isExistsValue = false;
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

        $scope.typeOptions = ['Thủ công', 'Tự động', 'Đang cập nhật'];

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

        // ===========================================
        GroupDevice.getFull($stateParams.groupDeviceId).then(function (data) {
            $scope.groupDevice = data;
            $scope.TABLES[tableConfig.tableId].customParams = "tenantId==" + $scope.groupDevice.tenantId + ";type==1;category!=1;groupDeviceId==" + $scope.groupDevice.id + ";gatewayId==" + $scope.groupDevice.gatewayId;
            TableController.reloadPage(tableConfig.tableId);

            // check xem da co dktdk chua
            AutomaticControl.getPageSimple("query=tenantId==" + $scope.groupDevice.tenantId + ";groupDeviceId==" + $scope.groupDevice.id + "&page=0&size=1").then(function (res) {
                if(res.data && res.data.length > 0) $scope.isExistsValue = true;
            })
        });
    }
})();
