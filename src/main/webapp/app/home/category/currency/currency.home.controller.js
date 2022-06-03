(function(){
    'use strict';
    angular.module('erpApp')
        .controller('CurrencyHomeController', CurrencyHomeController);

    CurrencyHomeController.$inject = ['$rootScope', '$scope', '$state', 'Currency', '$http', 'AlertService','$translate', 'TableController', 'ComboBoxController', 'Principal', 'ErrorHandle'];
    function CurrencyHomeController($rootScope, $scope, $state, Currency, $http, AlertService, $translate, TableController, ComboBoxController, Principal, ErrorHandle) {
        var vm = this;
        $scope.ComboBox = {};
        $scope.isAdmin = false;
        $scope.organizationId = "";

        $scope.blockModal;
        $scope.blockUI = function () {
            if($scope.blockModal != null)
                $scope.blockModal.hide();
            $scope.blockModal = null;
            $scope.blockModal = UIkit.modal.blockUI('<div class=\'uk-text-center\'>Please Wait...<br/><img class=\'uk-margin-top\' src=\'assets/img/spinners/spinner_success.gif\' alt=\'\'>');
        };

        // check role SA
        Principal.hasAuthority("ROLE_SYSTEM_ADMIN").then(function(data){
            $scope.isAdmin = data;
        });

        // khai bao cac column va kieu du lieu
        var columns = {
            'id': 'Number',
            'name': 'Text',
            'code':'Text'
        };

        // khai bao cau hinh cho bang
        var tableConfig = {
            tableId: "uoms",            //table Id
            model: "uoms",             //model
            defaultSort:"created",          //sap xep mac dinh theo cot nao
            sortType: "desc",                //kieu sap xep
            loadFunction: Currency.getPage,     //api load du lieu
            columns: columns,               //bao gom cac cot nao
            handleAfterReload: null,        //xu ly sau khi load du lieu
            handleAfterReloadParams: null,  //tham so cho xu ly sau khi load
            deleteCallback: null,           //delete callback
            customParams: "",               //dieu kien loc ban dau
            pager_id: "table_uom_pager",   //phan trang
            page_id: "uom_selectize_page", //phan trang
            page_number_id: "uom_selectize_pageNum",   //phan trang
            page_size_option: ["5", "10", "25", "50"]   //lua chon size cua 1 page
        };

        TableController.initTable($scope, tableConfig);     //khoi tao table
        TableController.sortDefault(tableConfig.tableId);   //set gia tri sap xep mac dinh
        TableController.reloadPage(tableConfig.tableId);    //load du lieu cho table

        // ham xoa mac dinh
        $scope.defaultDelete = function () {
            TableController.defaultDelete(tableConfig.tableId, Uom.deleteMany);
        };
    }
})();