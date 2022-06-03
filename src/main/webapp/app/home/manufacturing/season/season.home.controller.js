(function(){
    'use strict';
    angular.module('erpApp')
        .controller('SeasonController', SeasonController);

    SeasonController.$inject = ['$rootScope', '$scope', '$state', '$http', 'AlertService','$translate', 'TableController', 'ComboBoxController', 'Season', 'ErrorHandle'];
    function SeasonController($rootScope, $scope, $state, $http, AlertService, $translate, TableController, ComboBoxController, Season, ErrorHandle) {
        $scope.ComboBox = {};
        $scope.blockModal = null;
        $scope.blockUI = function () {
            if($scope.blockModal != null)
                $scope.blockModal.hide();
            $scope.blockModal = null;
            $scope.blockModal = UIkit.modal.blockUI('<div class=\'uk-text-center\'>Please Wait...<br/><img class=\'uk-margin-top\' src=\'assets/img/spinners/spinner_success.gif\' alt=\'\'>');
        };

        $scope.statusOptions = [
            { value: 0, title: $translate.instant("admin.season.pending") },
            { value: 1, title: $translate.instant("admin.season.processing") },
            { value: 2, title: $translate.instant("admin.season.finished") }
        ];

        // khai bao cac column va kieu du lieu
        var columns = {
            'id': 'Number',
            'name': 'Text',
            'code':'Text',
            'expectedBeginDate':'DateTime',
            'expectedFinishDate':'DateTime',
            'state':'Number',
            'farmId':'Number',
            'productId': 'Number'
        };

        var customParams = "tenantId == " + window.localStorage.getItem("farmId");
        // khai bao cau hinh cho bang
        var tableConfig = {
            tableId: "seasons",            //table Id
            model: "seasons",             //model
            defaultSort:"created",          //sap xep mac dinh theo cot nao
            sortType: "desc",                //kieu sap xep
            loadFunction: Season.getPageFull,     //api load du lieu
            columns: columns,               //bao gom cac cot nao
            handleAfterReload: null,        //xu ly sau khi load du lieu
            handleAfterReloadParams: null,  //tham so cho xu ly sau khi load
            deleteCallback: null,           //delete callback
            customParams: customParams,               //dieu kien loc ban dau
            pager_id: "table_season_pager",   //phan trang
            page_id: "season_selectize_page", //phan trang
            page_number_id: "season_selectize_pageNum",   //phan trang
            page_size_option: ["5", "10", "25", "50"]   //lua chon size cua 1 page
        };

        TableController.initTable($scope, tableConfig);     //khoi tao table
        TableController.sortDefault(tableConfig.tableId);   //set gia tri sap xep mac dinh
        TableController.reloadPage(tableConfig.tableId);    //load du lieu cho table

        var tenantComboBox = {
            id:'tenantId',
            url:'/api/tenants',
            originParams:'active==1', // chỉ lấy địa điểm
            valueField:'id',
            labelField:'name',
            searchField:'name',
            table: $scope.TABLES['seasons'],
            column: 'tenantId',
            maxItems:1,
            ngModel:[],
            options:[],
            placeholder: $translate.instant("global.placeholder.choose")
        };
        ComboBoxController.init($scope, tenantComboBox);

        var productCbb = {
            id:'productCbb',
            url:'/api/products',
            originParams:'', // chỉ lấy địa điểm
            valueField:'id',
            labelField:'name',
            searchField:'name',
            table: $scope.TABLES['seasons'],
            column: 'productId',
            maxItems:1,
            ngModel:[],
            options:[],
            placeholder: $translate.instant("global.placeholder.choose")
        };
        ComboBoxController.init($scope, productCbb);

        // ham xoa mac dinh
        $scope.defaultDelete = function () {
            TableController.defaultDelete(tableConfig.tableId, Season.deleteMany, "Season");
        };

        $scope.deleteOne = function(id){
            UIkit.modal.confirm($translate.instant("global.actionConfirm.delete"), function () {
                Season.deleteOne(id).then(function () {
                    AlertService.success("success.msg.delete");
                    TableController.reloadPage(tableConfig.tableId);
                }).catch(function(err){
                    ErrorHandle.handleOneError(err);
                })
            }, {
                labels: {
                    'Ok': $translate.instant("global.button.delete"),
                    'Cancel': $translate.instant("global.button.cancel2")
                }
            });
        }
    }
})();