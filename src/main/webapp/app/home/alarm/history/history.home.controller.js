(function () {
    'use strict';
    angular.module('erpApp')
        .controller('AlarmHistoryHomeController', AlarmHistoryHomeController);

    AlarmHistoryHomeController.$inject = ['$rootScope', '$scope', '$state', '$http',
        'AlertService', '$translate', 'TableController', 'ComboBoxController', 'AlertModalService', 'AlarmHistory', '$window'];

    function AlarmHistoryHomeController($rootScope, $scope, $state, $http,
                            AlertService, $translate, TableController, ComboBoxController, AlertModalService, AlarmHistory, $window) {
        var vm = this;
        // khai bao cac column va kieu du lieu
        var columns = {
            'id':'Number',            
            'created':'DateTime',
            'alarmName':'Text',
            'areaName':'Text',
            'content':'Text',            
            'currentValue':'Number'
        };
//        $scope.tenantId = "";
//        $scope.farmChange = function(){            
//            console.log($scope.ComboBox['farmCbb'].options[0]);
//            tableConfig.customParams = "farmId==" + $scope.tenantId;
//            TableController.reloadPage(tableConfig.tableId);    //load du lieu cho table
//        }
        
        var tenantId = $window.localStorage.getItem("farmId");
        var tenantName = $window.localStorage.getItem("farmName");

        // khai bao cau hinh cho bang
        var tableConfig = {
            tableId: "alarms",               //table Id
            model: "alarms",                 //model
            defaultSort:"created",          //sap xep mac dinh theo cot nao
            sortType: "desc",                //kieu sap xep
            loadFunction: AlarmHistory.getPage,     //api load du lieu
            columns: columns,               //bao gom cac cot nao
            handleAfterReload: null,        //xu ly sau khi load du lieu
            handleAfterReloadParams: null,  //tham so cho xu ly sau khi load
            deleteCallback: null,           //delete callback
            customParams: "farmId==" + tenantId,               //dieu kien loc ban dau
            pager_id: "alarms_pager_id",   //phan trang
            page_id: "alarms_selectize_page", //phan trang
            page_number_id: "alarms_selectize_pageNum",   //phan trang
            page_size_option: ["5", "10", "25", "50"]   //lua chon size cua 1 page
        };

        TableController.initTable($scope, tableConfig);     //khoi tao table
        TableController.sortDefault(tableConfig.tableId);   //set gia tri sap xep mac dinh
        TableController.reloadPage(tableConfig.tableId);    //load du lieu cho table
        $scope.ComboBox = {};

        // ham xoa mac dinh
//        $scope.defaultDelete = function () {
//            TableController.defaultDelete(tableConfig.tableId, AlarmHistory.deleteMany);
//        }
        



//        var farmCbb = {
//            id:'farmCbb',
//            url:'/api/tenants',
//            originParams:'type==2',
//            valueField:'id',
//            labelField:'name',
//            orderBy: 'name,asc',
//            searchField:'name',
//            table: $scope.TABLES['alarms'],
//            column: 'tenantId',
//            maxItems:1,
//            ngModel:[],
//            options: [],
//            placeholder:$translate.instant("global.placeholder.search")
//        };
//        ComboBoxController.init($scope, farmCbb);
        
//        var firstLoad = false;
//        $scope.$watch('$scope.ComboBox["farmCbb"].options', function(newValue, oldValue) {
//            console.log("watching");
//            console.log($scope.ComboBox["farmCbb"].options);
//            if($scope.ComboBox["farmCbb"].options !== null && $scope.ComboBox["farmCbb"].options.length > 0){
//                if(!firstLoad){
//                    $scope.tenantId = $scope.ComboBox["farmCbb"].options[0].id;
//                    firstLoad = true;
//                }
//            };
//        }, true);
    }


})();
