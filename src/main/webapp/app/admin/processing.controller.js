(function(){
    'use strict';
    angular.module('erpApp')
        .controller('ProcessingController',ProcessingController);

    ProcessingController.$inject = ['$rootScope','$scope','$state','$timeout','User', 'Role', 'AlertService','$translate','variables', 'TableMultiple', 'TranslateCommonUI','ErrorHandle', '$window','BaseProcessing','ImportResult','Transfer'];
    function ProcessingController($rootScope,$scope, $state,$timeout, User, Role, AlertService,$translate, variables, TableMultiple, TranslateCommonUI, ErrorHandle, $window,BaseProcessing,ImportResult,Transfer) {
        var vm = this;

        TranslateCommonUI.init($scope);
        $scope.pageTitle = "admin.menu.users";

        $scope.user = {};

        $scope.transferNumber ="transferNumber"
        $scope.urlTransfer = "/api/transfers/"

        /*User.getAll().then(function(data) {
            $scope.users = data;
        })*/

        var fields =     ["id",     "reference","processing","log" ];
        var fieldsType = ["Number", "Text",  "Number",      "Text"];
        var loadFunction = BaseProcessing.getPage;

        var newTableIds = {
            idTable: "table_processing",
            model: "processing",
            param_allow_show_tooltip : "true",
            tree_query: "",
            firstLoad: false,
            param_current_page: 0,
            param_page_size: 0,
            param_total_result: 0,
            param_page_total: 0,
            param_sort_field: "",
            param_sort_type: "asc",
            param_sort_list: [],
            param_filter_list: [],
            param_check_list: [],
            selectize_page_options: [],
            selectize_page_config: {
                plugins: {
                    'tooltip': ''
                },
                create: false,
                maxItems: 1
            },
            selectize_pageNum_options: ["5", "10", "25", "50"],
            selectize_pageNum_config: {
                plugins: {
                    'tooltip': ''
                },
                create: false,
                maxItems: 1
            },
            loadFunction: loadFunction,
            param_fields: fields,
            param_fields_type: fieldsType,
            handleAfterReload: null,
            handleAfterReloadParams: null,
            deleteCallback: null,
            customParams: "processing!=100",
            pager_id: "table_processing_pager",
            selectize_page_id: "processing_selectize_page",
            selectize_pageNum_id: "processing_selectize_pageNum"
        }

        TableMultiple.initTableIds($scope, newTableIds);
        TableMultiple.sortDefault(newTableIds.idTable);
        TableMultiple.reloadPage(newTableIds.idTable);



        var fields2 =     ["id",     "object_id","file_name","status",'handled' ];
        var fieldsType2 = ["Number", "Number",  "Text",      "Text","Text"];
        var loadFunction2 = ImportResult.getPage;

        var newTableIds2 = {
            idTable: "table_import",
            model: "import",
            param_allow_show_tooltip : "true",
            tree_query: "",
            firstLoad: false,
            param_current_page: 0,
            param_page_size: 0,
            param_total_result: 0,
            param_page_total: 0,
            param_sort_field: "",
            param_sort_type: "asc",
            param_sort_list: [],
            param_filter_list: [],
            param_check_list: [],
            selectize_page_options: [],
            selectize_page_config: {
                plugins: {
                    'tooltip': ''
                },
                create: false,
                maxItems: 1
            },
            selectize_pageNum_options: ["5", "10", "25", "50"],
            selectize_pageNum_config: {
                plugins: {
                    'tooltip': ''
                },
                create: false,
                maxItems: 1
            },
            loadFunction: loadFunction2,
            param_fields: fields2,
            param_fields_type: fieldsType2,
            handleAfterReload: null,
            handleAfterReloadParams: null,
            deleteCallback: null,
            customParams: "status!='done';status!='error'",
            pager_id: "table_import_pager",
            selectize_page_id: "import_selectize_page",
            selectize_pageNum_id: "import_selectize_pageNum"
        }

        TableMultiple.initTableIds($scope, newTableIds2);
        TableMultiple.sortDefault(newTableIds2.idTable);
        TableMultiple.reloadPage(newTableIds2.idTable);

        $scope.finishProcess = function finishProcess(id,reference){
            $scope.reference = reference;
            $scope.processingId = id;
            $timeout(function(){
                angular.element("#openProcessingModal").trigger("click");
            })
        }

        $scope.completeProcessing = function completeProcessing(){
            BaseProcessing.finishProcess($scope.processingId).then(function (data) {
                AlertService.success('success.msg.update');
                TableMultiple.reloadPage(newTableIds.idTable);
            }).catch(function(data){
                ErrorHandle.handleError(data)
            })
        }

        $scope.finishImport = function finishProcess(id){
            $scope.importId = id;
            Transfer.getOne(id).then(function (data) {
                $scope.transfer = data;
                $scope.reference = $scope.transfer.transferNumber;
                $timeout(function(){
                    angular.element("#openImportModal").trigger("click");
                })
            })

        }

        $scope.completeImport = function completeProcessing(){
            ImportResult.finishProcess($scope.importId).then(function (data) {
                AlertService.success('success.msg.update');
                TableMultiple.reloadPage(newTableIds2.idTable);
            }).catch(function(data){
                ErrorHandle.handleError(data)
            })
        }

    }

})();