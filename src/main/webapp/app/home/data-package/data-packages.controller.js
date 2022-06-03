

(function () {
    'use strict';
    angular.module('erpApp').controller('DataPackagesController', DataPackagesController);

    DataPackagesController.$inject = ['$rootScope', '$scope', '$state', '$http','$timeout',
        'AlertService', '$translate', 'TableController', 'ComboBoxController', 'AlertModalService',
        'DataPackage', 'ErrorHandle', '$window'];

    function DataPackagesController($rootScope, $scope, $state, $http,$timeout,
                                  AlertService, $translate, TableController, ComboBoxController, AlertModalService,
                                  DataPackage, ErrorHandle, $window) {
    	$scope.ComboBox = {};
    	$scope.typeFields = [
            { value: 0, title: 'Single'},
            { value: 1, title: 'Bundle'}
        ];
    	$scope.kindOfTime = [
            { value: 0, title: $translate.instant('package.kindOfTime.day')},
            { value: 1, title: $translate.instant('package.kindOfTime.month')},
            { value: 2, title: $translate.instant('package.kindOfTime.year')}
        ];
    	$scope.autoExtendFields = [
            { value: 1, title: $translate.instant('package.autoExtend.yes')},
            { value: 0, title: $translate.instant('package.autoExtend.no')}
        ];
    	
    	$scope.stateFields = [
            { value: 0, title: $translate.instant('package.state.new')},
            { value: 1, title: $translate.instant('package.state.active')},
            { value: 2, title: $translate.instant('package.state.deactive')},
            { value: 3, title: $translate.instant('package.state.cacelled')}
        ];
    	// khai bao cac column va kieu du lieu
        var columns = {
            'id':'Number',
            'name':'Text',
            'price':'Number',
            'period':'Number',
            'numberOfDevice':'Number',
            'resolution':'Text',
            'storageTime':'Number',
            'autoExtend':'Number',
            'active':'Number',
        };

        // khai bao cau hinh cho bang
        var tableConfig = {
            tableId: "dataPackages",               //table Id
            model: "dataPackages",                 //model
            defaultSort:"created",          //sap xep mac dinh theo cot nao
            sortType: "desc",                //kieu sap xep
            loadFunction: DataPackage.getPage,     //api load du lieu
            columns: columns,               //bao gom cac cot nao
            handleAfterReload: null,        //xu ly sau khi load du lieu
            handleAfterReloadParams: null,  //tham so cho xu ly sau khi load
            deleteCallback: null,           //delete callback
            customParams: "",               //dieu kien loc ban dau
            pager_id: "table_data-package_pager",   //phan trang
            page_id: "data-package_selectize_page", //phan trang
            page_number_id: "data-package_selectize_pageNum",   //phan trang
            page_size_option: ["5", "10", "25", "50"]   //lua chon size cua 1 page
        };

        TableController.initTable($scope, tableConfig);     //khoi tao table
        TableController.sortDefault(tableConfig.tableId);   //set gia tri sap xep mac dinh
        TableController.reloadPage(tableConfig.tableId);    //load du lieu cho table
        
        $scope.defaultDeactivate = function(){
        	// Handle Deactive rows
        	TableController.defaultDeactive(tableConfig.tableId,DataPackage.deactivateRecords,"data-package");
        }
        
        // ham xoa mac dinh
        $scope.defaultDelete = function () {
            TableController.defaultDelete(tableConfig.tableId,DataPackage.deleteRecord,"data-package");
        }
    }
})();
