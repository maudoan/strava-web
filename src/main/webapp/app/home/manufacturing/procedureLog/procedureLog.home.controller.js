(function () {
    'use strict';
    angular.module('erpApp')
        .controller('ProcedureLogController', ProcedureLogController);

    ProcedureLogController.$inject = ['$rootScope', '$scope', '$state', '$stateParams', '$translate',
        'AlertService', 'TableController', 'ComboBoxController', 'AlertModalService', 'ErrorHandle', 'ProcedureLog', '$window', 'Season'];

    function ProcedureLogController($rootScope, $scope, $state, $stateParams, $translate,
                                  AlertService, TableController, ComboBoxController, AlertModalService, ErrorHandle, ProcedureLog, $window, Season) {
        var tenantId = $window.localStorage.getItem("farmId") ? $window.localStorage.getItem("farmId") : 0;
        $scope.ComboBox = {};

        // khai bao cac column va kieu du lieu
        var columns = {
            "id": "Long",
            "executeDate": "DateTime",
            "areaId": "Number",
            "seasonId": "Number",
            "tenantId": "Number",
            "productId": "Number",
            "userId": "Number",
            "description":"Text",
            "seasonCode":"Text"
        };

        // khai bao cau hinh cho bang
        var tableConfig = {
            tableId: "procedureLogs",               //table Id
            model: "procedureLogs",                 //model
            defaultSort:"created",          //sap xep mac dinh theo cot nao
            sortType: "desc",                //kieu sap xep
            loadFunction: ProcedureLog.getPageFull,     //api load du lieu
            columns: columns,               //bao gom cac cot nao
            handleAfterReload: null,        //xu ly sau khi load du lieu
            handleAfterReloadParams: null,  //tham so cho xu ly sau khi load
            deleteCallback: null,           //delete callback
            customParams: "tenantId==" + tenantId,               //dieu kien loc ban dau
            pager_id: "table_procedureLog_pager",   //phan trang
            page_id: "procedureLog_selectize_page", //phan trang
            page_number_id: "procedureLog_selectize_pageNum",   //phan trang
            page_size_option: ["5", "10", "25", "50"]   //lua chon size cua 1 page
        };

        TableController.initTable($scope, tableConfig);     //khoi tao table
        TableController.sortDefault(tableConfig.tableId);   //set gia tri sap xep mac dinh
        // TableController.reloadPage(tableConfig.tableId);    //load du lieu cho table

        //============== CBB ==============
        var farmCbb = {
            id: 'farmCbb',
            url: '/api/tenants',
            originParams: 'active==1',
            valueField: 'id',
            labelField: 'name',
            searchField: 'name',
            table: $scope.TABLES['procedureLogs'],
            column: 'tenantId',
            maxItems: 1,
            ngModel: [],
            options: [],
            placeholder: $translate.instant("global.placeholder.choose")
        };
        ComboBoxController.init($scope, farmCbb);

        var areaCbb = {
            id: 'areaCbb',
            url: '/api/areas',
            originParams: '',
            valueField: 'id',
            labelField: 'name',
            searchField: 'name',
            table: $scope.TABLES['procedureLogs'],
            column: 'areaId',
            maxItems: 1,
            ngModel: [],
            options: [],
            placeholder: $translate.instant("global.placeholder.choose")
        };
        ComboBoxController.init($scope, areaCbb);

        var seasonCbb = {
            id: 'seasonCbb',
            url: '/api/seasons',
            originParams: '',
            valueField: 'id',
            labelField: 'name',
            searchField: 'name',
            table: $scope.TABLES['procedureLogs'],
            column: 'seasonId',
            maxItems: 1,
            ngModel: [],
            options: [],
            placeholder: $translate.instant("global.placeholder.choose")
        };
        ComboBoxController.init($scope, seasonCbb);

        var productCbb = {
            id: 'productCbb',
            url: '/api/products',
            originParams: '',
            valueField: 'id',
            labelField: 'name',
            searchField: 'name',
            table: $scope.TABLES['procedureLogs'],
            column: 'productId',
            maxItems: 1,
            ngModel: [],
            options: [],
            placeholder: $translate.instant("global.placeholder.choose")
        };
        ComboBoxController.init($scope, productCbb);

        var ownerCbb = {
            id: 'ownerCbb',
            url: '/api/users',
            replaceUrl: '/search-user-in-tenant?id=' + tenantId + "&query=",
            originParams: '',
            valueField: 'id',
            labelField: 'fullName',
            searchField: 'fullName',
            table: $scope.TABLES['procedureLogs'],
            column: 'userId',
            maxItems: 1,
            ngModel: [],
            options: [],
            placeholder: $translate.instant("global.placeholder.choose")
        };
        ComboBoxController.init($scope, ownerCbb);
        // ==============================

        // k phải đi từ trang season
        if(!$stateParams.seasonId){
            TableController.reloadPage(tableConfig.tableId);
        } else{
            Season.getOne($stateParams.seasonId).then(function (season) {
                seasonCbb.ngModel = season.id;
                seasonCbb.options = [season];
                ComboBoxController.init($scope, seasonCbb);


                tableConfig.customParams = "seasonId==" + season.id;
                TableController.reloadPage(tableConfig.tableId);
            });
        }

        // ham xoa mac dinh
        $scope.defaultDelete = function () {
            TableController.defaultDelete(tableConfig.tableId, ProcedureLog.deleteMany, "ProcedureLog");
        };

        $scope.deleteOne = function(id){
            UIkit.modal.confirm($translate.instant("global.actionConfirm.delete"), function () {
                ProcedureLog.deleteOne(id).then(function () {
                    AlertService.success("success.msg.delete");
                    TableController.reloadPage(tableConfig.tableId);
                }).catch(function(err){
                    ErrorHandle.handleError(err);
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
