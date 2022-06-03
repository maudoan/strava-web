(function () {
    'use strict';
    angular.module('erpApp')
        .controller('ProcedureController', ProcedureController);

    ProcedureController.$inject = ['$rootScope', '$scope', '$state', '$http',
        'AlertService', '$translate', 'TableController', 'ComboBoxController', 'AlertModalService', 'Farm'];

    function ProcedureController($rootScope, $scope, $state, $http,
                                  AlertService, $translate, TableController, ComboBoxController, AlertModalService, Farm) {
        var vm = this;
        $scope.ComboBox = {};

        // khai bao cac column va kieu du lieu
        var columns = {
            'id':'Number',
            'email':'Text',
            'name':'Text',
            'code':'Text',
            'owner':'Text',
            'phone':'Text',
            'acreage':'Number',
            'typeFarm':'Number',
            'location':'Text',
            'created':'DateTime',
            'createdBy':'Text',
            'updated':'DateTime',
            'updatedBy':'Text',
            'active':'Number'
        };

        // khai bao cau hinh cho bang
        var tableConfig = {
            tableId: "farms",               //table Id
            model: "farms",                 //model
            defaultSort:"created",          //sap xep mac dinh theo cot nao
            sortType: "desc",                //kieu sap xep
            loadFunction: Farm.getPage,     //api load du lieu
            columns: columns,               //bao gom cac cot nao
            handleAfterReload: null,        //xu ly sau khi load du lieu
            handleAfterReloadParams: null,  //tham so cho xu ly sau khi load
            deleteCallback: null,           //delete callback
            customParams: "",               //dieu kien loc ban dau
            pager_id: "table_farm_pager",   //phan trang
            page_id: "farm_selectize_page", //phan trang
            page_number_id: "farm_selectize_pageNum",   //phan trang
            page_size_option: ["5", "10", "25", "50"]   //lua chon size cua 1 page
        };

        TableController.initTable($scope, tableConfig);     //khoi tao table
        TableController.sortDefault(tableConfig.tableId);   //set gia tri sap xep mac dinh
        TableController.reloadPage(tableConfig.tableId);    //load du lieu cho table

        // ham xoa mac dinh
        $scope.defaultDelete = function () {
            TableController.defaultDelete(tableConfig.tableId,Farm.deleteMany);
        }

    }
})();
