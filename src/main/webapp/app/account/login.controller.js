(function() {
    'use strict';
    angular.module('erpApp')
        .controller('RunHomeController', RunHomeController);

    RunHomeController.$inject = ['$rootScope','$scope', '$state','$stateParams','$http','$timeout','apiData', 'Run',
        'AlertService','$translate', 'variables', 'ErrorHandle', '$window','TableController', 'HOST_GW'];
    function RunHomeController($rootScope,$scope, $state,$stateParams,$http,$timeout,apiData, Run,
                               AlertService,$translate, variables, ErrorHandle, $window,TableController, HOST_GW){

        var loadFunction = Run.getStatistic ;

        $scope.fromDate = "2021-03-29";
        $scope.toDate = "2021-12-30";

        $("#activeStartDatePicker").kendoDatePicker({
            format: "yyyy-MM-dd",
            change: function() {
                var value = this.value();
                if(value !=null){
                    $scope.fromDate = value.getTime();
                } else {
                    $scope.fromDate = null;
                }
            }
        });
        $("#activeEndDatePicker").kendoDatePicker({
            format: "yyyy-MM-dd",
            change: function() {
                var value = this.value();
                if(value !=null){
                    $scope.toDate = value.getTime()

                } else {
                    $scope.toDate = null;
                }
            }
        });

        function convertDate(inputLong) {
            var date = new Date(inputLong);
            return date.getFullYear() + "-" +
                ((date.getMonth() + 1)<10 ? '0': '') +(date.getMonth()+1)
                + "-" + ((date.getDate())<10 ? '0': '') +date.getDate();
        }

        $scope.loadData = function (){
            $http.get(HOST_GW + '/api/v1/statistic?fromDate='+convertDate($scope.fromDate)
                +"&toDate="+convertDate($scope.toDate)).then(function (response) {
                $scope.running = response.data;
            });
        }

        $scope.loadData();


        $scope.sortData = function (column) {
            if ($scope.sortColumn == column)
                $scope.reverse = !$scope.reverse;
            else
                $scope.reverse = false;
            $scope.sortColumn = column;
        }
        $scope.getSortClass = function (column) {
            if ($scope.sortColumn == column) {
                return $scope.reverse ? 'arrow-up' : 'arrow-down';
            }
            return '';
        }

        //khai bao cac column va kieu du lieu
        // var columns = {
        //     'fromDate': 'Date',
        //     'name':'Text',
        //     'distance':'Number',
        //     "pace":'long',
        //     'date':'DateTime',
        //     'runs':'long',
        //     'toDate':'Date'
        // };
        //
        // var tableConfig = {
        //     tableId: "running",               //table Id
        //     model: "running",                 //model
        //     loadFunction: loadFunction,     //api load du lieu
        //     columns: columns,               //bao gom cac cot nao
        //     handleAfterReload: null,        //xu ly sau khi load du lieu
        //     handleAfterReloadParams: null,  //tham so cho xu ly sau khi load
        //     deleteCallback: null,           //delete callback
        //     loading:false,
        //     customParams: null,               //dieu kien loc ban dau
        //     pager_id: "table_uom_pager",   //phan trang
        //     page_id: "uom_selectize_page", //phan trang
        //     page_number_id: "uom_selectize_pageNum",   //phan trang
        //     page_size_option: ["5", "10", "25", "50"]   //lua chon size cua 1 page
        // };
        //
        // TableController.initTable($scope, tableConfig);     //khoi tao table
        // TableController.sortDefault(tableConfig.tableId);   //set gia tri sap xep mac dinh
        // TableController.reloadPage(tableConfig.tableId);

    }
})();