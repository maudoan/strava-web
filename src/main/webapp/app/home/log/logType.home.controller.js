(function(){
    'use strict';
    angular.module('erpApp')
        .controller('LogTypeController', LogTypeController);

    LogTypeController.$inject = ['$rootScope','$scope','$state','$translate',
        '$http', 'ErrorHandle', '$window', 'TableController', 'LogType', 'AlertService', 'ComboBoxController', '$timeout', 'HOST_GW'];
    function LogTypeController($rootScope,$scope, $state, $translate,
                           $http, ErrorHandle, $window, TableController, LogType, AlertService, ComboBoxController, $timeout, HOST_GW) {
        $scope.ComboBox = {};
        $scope.log = {};
        $scope.blockModal = null;
        $scope.blockUI = function () {
            if($scope.blockModal != null)
                $scope.blockModal.hide();
            $scope.blockModal = null;
            $scope.blockModal = UIkit.modal.blockUI('<div class=\'uk-text-center\'>Please Wait...<br/><img class=\'uk-margin-top\' src=\'assets/img/spinners/spinner_success.gif\' alt=\'\'>');
        };

        // khai bao cac column va kieu du lieu
        var columns = {
            'id': 'Number',
            'type': 'Number',
            'action': 'Text',
            'actionEn': 'Text',
            'module': 'Text',
            'created': 'Datetime'
        };

        // khai bao cau hinh cho bang
        var tableConfig = {
            tableId: "logTypes",               //table Id
            model: "logTypes",                 //model
            defaultSort: "created",          //sap xep mac dinh theo cot nao
            sortType: "desc",                //kieu sap xep
            loadFunction: LogType.getPageFull,     //api load du lieu
            columns: columns,               //bao gom cac cot nao
            handleAfterReload: null,        //xu ly sau khi load du lieu
            handleAfterReloadParams: null,  //tham so cho xu ly sau khi load
            deleteCallback: null,           //delete callback
            customParams: "",               //dieu kien loc ban dau
            pager_id: "table_log_pager",   //phan trang
            page_id: "log_selectize_page", //phan trang
            page_number_id: "log_selectize_pageNum",   //phan trang
            page_size_option: ["5", "10", "25", "50"]   //lua chon size cua 1 page
        };

        TableController.initTable($scope, tableConfig);     //khoi tao table
        TableController.sortDefault(tableConfig.tableId);   //set gia tri sap xep mac dinh
        TableController.reloadPage(tableConfig.tableId);    //load du lieu cho table

        // ham xoa mac dinh
        $scope.defaultDelete = function () {
            TableController.defaultDelete(tableConfig.tableId, LogType.deleteMany);
        };
    }
})();