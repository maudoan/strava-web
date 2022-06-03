(function(){
    'use strict';
    angular.module('erpApp')
        .controller('PrivilegeHomeController',PrivilegeHomeController);

    PrivilegeHomeController.$inject = ['$rootScope','$scope','$state','Privilege','AlertService', 'ErrorHandle', '$translate','TableController'];
    function PrivilegeHomeController($rootScope,$scope, $state, Privilege, AlertService, ErrorHandle, $translate,TableController) {
        var vm = this;
        // khai bao cac column va kieu du lieu
        var columns = {
            'id':'Number',
            'displayName':'Text',
            'description':'Text',
            'created':'DateTime',
            'createdBy':'Text',
            'updated':'DateTime',
            'updatedBy':'Text'
        }

        // khai bao cau hinh cho bang
        var tableConfig = {
            tableId: "privileges",               //table Id
            model: "privileges",                 //model
            defaultSort:"created",          //sap xep mac dinh theo cot nao
            sortType: "desc",                //kieu sap xep
            loadFunction: Privilege.getPage,     //api load du lieu
            columns: columns,               //bao gom cac cot nao
            handleAfterReload: null,        //xu ly sau khi load du lieu
            handleAfterReloadParams: null,  //tham so cho xu ly sau khi load
            deleteCallback: null,           //delete callback
            customParams: "",               //dieu kien loc ban dau
            pager_id: "privileges_pager",   //phan trang
            page_id: "privilege_selectize_page", //phan trang
            page_number_id: "privilege_selectize_pageNum",   //phan trang
            page_size_option: ["5", "10", "25", "50"]   //lua chon size cua 1 page
        }

        TableController.initTable($scope, tableConfig);     //khoi tao table
        TableController.sortDefault(tableConfig.tableId);   //set gia tri sap xep mac dinh
        TableController.reloadPage(tableConfig.tableId);    //load du lieu cho table
    }

})();