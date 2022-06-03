(function(){
    'use strict';
    angular.module('erpApp')
        .controller('ServiceCustomerDetailController',ServiceCustomerDetailController);

    ServiceCustomerDetailController.$inject = ['$rootScope', '$scope', '$state', '$stateParams', 'User',
        'AlertService', 'ErrorHandle', '$translate', 'HOST_GW',
        'ServicePayment', 'ServiceDevice', 'ServiceBill', 'TableController', '$timeout'];
    function ServiceCustomerDetailController($rootScope, $scope, $state, $stateParams, User,
                                             AlertService, ErrorHandle, $translate, HOST_GW,
                                             ServicePayment, ServiceDevice, ServiceBill, TableController, $timeout) {
        $scope.HOST_GW = HOST_GW;
        $scope.blockModal = null;
        $scope.blockUI = function () {
            if($scope.blockModal != null)
                $scope.blockModal.hide();
            $scope.blockModal = null;
            $scope.blockModal = UIkit.modal.blockUI('<div class=\'uk-text-center\'>Đang xử lý ...<br/><img class=\'uk-margin-top\' src=\'assets/img/spinners/ajax-loader.gif\' alt=\'\'>');
        };

        $scope.user = {};
        User.getUserById($stateParams.userId).then(function (data) {
            $scope.user = data;
        });

        $scope.autoExtendFields = [
            { value: 1, title: "Có"},
            { value: 0, title: "Không"}
        ];

        $scope.stateFields = [
            { value: 1, title: $translate.instant('global.common.active')},
            { value: 0, title: $translate.instant('global.common.archived')}
        ];

        // table service payments
        // khai bao cac column va kieu du lieu
        var columns = {
            'id':'Number',
            'name':'Text',
            "type":'Number',
            'startTime':'DateTime',
            'endTime':'DateTime',
            'autoExtend':'Number',
            'active':'Number'
        };

        // khai bao cau hinh cho bang
        var customParams = "userId==" + $stateParams.userId;
        var tableConfig = {
            tableId: "servicePayments",               //table Id
            model: "servicePayments",                 //model
            defaultSort:"created",          //sap xep mac dinh theo cot nao
            sortType: "desc",                //kieu sap xep
            loadFunction: ServicePayment.getPage,     //api load du lieu
            columns: columns,               //bao gom cac cot nao
            handleAfterReload: null,        //xu ly sau khi load du lieu
            handleAfterReloadParams: null,  //tham so cho xu ly sau khi load
            deleteCallback: null,           //delete callback
            customParams: customParams,               //dieu kien loc ban dau
            pager_id: "table_payment_pager",   //phan trang
            page_id: "payment_selectize_page", //phan trang
            page_number_id: "payment_selectize_pageNum",   //phan trang
            page_size_option: ["5", "10", "25", "50"]   //lua chon size cua 1 page
        };

        TableController.initTable($scope, tableConfig);     //khoi tao table
        TableController.sortDefault(tableConfig.tableId);   //set gia tri sap xep mac dinh
        TableController.reloadPage(tableConfig.tableId);    //load du lieu cho table

        // device table
        // khai bao cac column va kieu du lieu
        var columnsDevice = {
            'id':'Number',
            'name':'Text',
            "deviceCode":'Text',
            'deviceUid':'Text',
            'deviceModelName':'Text',
            'deviceModelCode':'Text',
            'active':'Number'
        };

        // khai bao cau hinh cho bang
        var tableConfigDevice = {
            tableId: "serviceDevices",               //table Id
            model: "serviceDevices",                 //model
            defaultSort:"created",          //sap xep mac dinh theo cot nao
            sortType: "desc",                //kieu sap xep
            loadFunction: ServiceDevice.getPage,     //api load du lieu
            columns: columnsDevice,               //bao gom cac cot nao
            handleAfterReload: null,        //xu ly sau khi load du lieu
            handleAfterReloadParams: null,  //tham so cho xu ly sau khi load
            deleteCallback: null,           //delete callback
            customParams: customParams,               //dieu kien loc ban dau
            pager_id: "table_device_pager",   //phan trang
            page_id: "device_selectize_page", //phan trang
            page_number_id: "device_selectize_pageNum",   //phan trang
            page_size_option: ["5", "10", "25", "50"]   //lua chon size cua 1 page
        };

        TableController.initTable($scope, tableConfigDevice);     //khoi tao table
        TableController.sortDefault(tableConfigDevice.tableId);   //set gia tri sap xep mac dinh
        //TableController.reloadPage(tableConfigDevice.tableId);    //load du lieu cho table

        // bill table
        $scope.methodValues = [
            { value: 0, title: 'VNPT PAY'}
        ];

        $scope.statusValues = [
            { value: 1, title: $translate.instant('global.messages.success')},
            { value: 0, title: $translate.instant('global.messages.failed')}
        ];
        // khai bao cac column va kieu du lieu
        var columnsBill = {
            'id':'Number',
            'billNumber':'Text',
            'datePayment':'DateTime',
            'price':'Number',
            'paymentMethod':'Number',
            'active':'Number'
        };

        // khai bao cau hinh cho bang
        var tableConfigBill = {
            tableId: "serviceBills",               //table Id
            model: "serviceBills",                 //model
            defaultSort:"created",          //sap xep mac dinh theo cot nao
            sortType: "desc",                //kieu sap xep
            loadFunction: ServiceBill.getPage,     //api load du lieu
            columns: columnsBill,               //bao gom cac cot nao
            handleAfterReload: null,        //xu ly sau khi load du lieu
            handleAfterReloadParams: null,  //tham so cho xu ly sau khi load
            deleteCallback: null,           //delete callback
            customParams: customParams,               //dieu kien loc ban dau
            pager_id: "table_bill_pager",   //phan trang
            page_id: "bill_selectize_page", //phan trang
            page_number_id: "bill_selectize_pageNum",   //phan trang
            page_size_option: ["5", "10", "25", "50"]   //lua chon size cua 1 page
        };

        TableController.initTable($scope, tableConfigBill);     //khoi tao table
        TableController.sortDefault(tableConfigBill.tableId);   //set gia tri sap xep mac dinh
        //TableController.reloadPage(tableConfigBill.tableId);    //load du lieu cho table

        // function - table payment
        $scope.onShowDevices = function (paymentId) {
            $scope.blockUI();
            tableConfigDevice.customParams = "servicePaymentId==" + paymentId;
            TableController.reloadPage(tableConfigDevice.tableId);

            $timeout(function () {
                if($scope.blockModal != null) $scope.blockModal.hide();
                UIkit.modal("#device_modal", { bgclose:false }).show();
            }, 1000);
        };

        $scope.onShowBills = function (paymentId) {
            $scope.blockUI();

            tableConfigBill.customParams = "servicePaymentId==" + paymentId;
            TableController.reloadPage(tableConfigBill.tableId);

            $timeout(function () {
                if($scope.blockModal != null) $scope.blockModal.hide();
                UIkit.modal("#bill_modal", { bgclose:false }).show();
            }, 1000);
        }
    }

})();