(function(){
    'use strict';
    angular.module('erpApp')
        .controller('ServiceCustomerController',ServiceCustomerController);

    ServiceCustomerController.$inject = ['$rootScope','$scope','$state','$stateParams','User',
        'AlertService','$translate','ErrorHandle','TableController'];
    function ServiceCustomerController($rootScope,$scope, $state,$stateParams, User,
                                       AlertService,$translate, ErrorHandle,TableController) {
        var loadFunction = User.getPage;

        $scope.blockModal = null;
        $scope.blockUI = function () {
            if($scope.blockModal != null)
                $scope.blockModal.hide();
            $scope.blockModal = null;
            $scope.blockModal = UIkit.modal.blockUI('<div class=\'uk-text-center\'>Đang xử lý ...<br/><img class=\'uk-margin-top\' src=\'assets/img/spinners/spinner_success.gif\' alt=\'\'>');
        };

        $scope.stateFields = [
            { value: 0, title: $translate.instant('global.common.notRegister')},
            { value: 1, title: $translate.instant('global.common.active')},
            { value: 2, title: $translate.instant('global.common.archived')}
        ];

        // khai bao cac column va kieu du lieu
        var columns = {
            'id':'Number',
            'email':'Text',
            "type":'Number',
            'username':'Text',
            'phone':'Text',
            'fullName':'Text',
            'created':'DateTime',
            'createdBy':'Text',
            'updated':'DateTime',
            'updatedBy':'Text',
            'active':'Number',
            'firstRegister': 'DateTime',
            'state':'Number'
        };

        // khai bao cau hinh cho bang
        var customParams = "state!=null";
        var tableConfig = {
            tableId: "users",               //table Id
            model: "users",                 //model
            defaultSort:"created",          //sap xep mac dinh theo cot nao
            sortType: "desc",                //kieu sap xep
            loadFunction: loadFunction,     //api load du lieu
            columns: columns,               //bao gom cac cot nao
            handleAfterReload: null,        //xu ly sau khi load du lieu
            handleAfterReloadParams: null,  //tham so cho xu ly sau khi load
            deleteCallback: null,           //delete callback
            customParams: customParams,               //dieu kien loc ban dau
            pager_id: "table_user_pager",   //phan trang
            page_id: "user_selectize_page", //phan trang
            page_number_id: "user_selectize_pageNum",   //phan trang
            page_size_option: ["5", "10", "25", "50"]   //lua chon size cua 1 page
        };

        TableController.initTable($scope, tableConfig);     //khoi tao table
        TableController.sortDefault(tableConfig.tableId);   //set gia tri sap xep mac dinh
        TableController.reloadPage(tableConfig.tableId);    //load du lieu cho table
    }
})();