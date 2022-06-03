(function () {
    'use strict';
    angular.module('erpApp').controller('AlarmConfigController', AlarmConfigController);
    AlarmConfigController.$inject = ['$rootScope', '$scope', '$state', '$http', '$translate', 'TableController', 'ComboBoxController', 'AlertModalService', 'AlarmConfig'];
    function AlarmConfigController($rootScope, $scope, $state, $http, $translate, TableController, ComboBoxController, AlertModalService, AlarmConfig) {
        var vm = this;
        $scope.ComboBox = {};
        
         // khai bao cac column va kieu du lieu
        var columns = {
            'name': 'Text',
            'areaId': 'Number',
            'content': 'Text',
            'method': 'Text',
            'active': 'Number'
        };
        
        // khai bao cau hinh cho bang
        var tableConfig = {
            tableId: "alarmConfig",               //table Id
            model: "alarmConfigs",                 //model
            defaultSort: "created",          //sap xep mac dinh theo cot nao
            sortType: "desc",                //kieu sap xep
            loadFunction: AlarmConfig.getPageFull,     //api load du lieu
            columns: columns,               //bao gom cac cot nao
            handleAfterReload: null,        //xu ly sau khi load du lieu
            handleAfterReloadParams: null,  //tham so cho xu ly sau khi load
            deleteCallback: null,           //delete callback
            customParams: "",               //dieu kien loc ban dau
            pager_id: "table_alarmConfig_pager",   //phan trang
            page_id: "alarmConfig_selectize_page", //phan trang
            page_number_id: "alarmConfig_selectize_pageNum",   //phan trang
            page_size_option: ["5", "10", "25", "50"]   //lua chon size cua 1 page
        };
        
        TableController.initTable($scope, tableConfig);     //khoi tao table
        TableController.sortDefault(tableConfig.tableId);   //set gia tri sap xep mac dinh
        TableController.reloadPage(tableConfig.tableId);    //load du lieu cho table
        
        
        var areaCbb = {
            id: 'areaCbb',
            url: '/api/areas',
            originParams: '',
            valueField: 'id',
            labelField: 'name',
            searchField: 'name',
            table: $scope.TABLES['alarmConfig'],
            column: 'areaId',
            maxItems: 1,
            ngModel: [],
            options: [],
            placeholder: $translate.instant("global.placeholder.choose")
        };
        ComboBoxController.init($scope, areaCbb);
        
        var methodCbb = {
            id: 'methodCbb',
            url: '',
            originParams: '',
            valueField: 'id',
            labelField: 'name',
            searchField: 'name',
            table: null,
            column: 'type',
            maxItems: 1,
            ngModel: [],
            options: [
                {id: 1, name: 'Email'},
                {id: 2, name: 'Onsite'}
            ],
            placeholder: $translate.instant("global.placeholder.choose")
        };
        ComboBoxController.init($scope, methodCbb);
        
        
        
        var statusCbb = {
            id: 'statusCbb',
            url: '',
            originParams: '',
            valueField: 'id',
            labelField: 'name',
            searchField: 'name',
            table: $scope.TABLES['alarmConfig'],
            column: 'active',
            maxItems: 1,
            ngModel: [],
            options: [
                {id: 1, name: 'Kích hoạt'},
                {id: 2, name: 'Ngừng kích hoạt'}
            ],
            placeholder: $translate.instant("global.placeholder.choose")
        };
        ComboBoxController.init($scope, statusCbb);
        
        
        $scope.defaultDelete = function () {
            TableController.defaultDelete(tableConfig.tableId,AlarmConfig.deleteMany);
        }
        
        $scope.deleteOne = function(id){
            UIkit.modal.confirm($translate.instant("global.actionConfirm.delete"), function () {
                AlarmConfig.deleteOne(id).then(function () {
                    TableController.reloadPage(tableConfig.tableId);
                }).catch(function(data){
                        ErrorHandle.handleError(data);
                    })
            }, {
                labels: {
                    'Ok': $translate.instant("global.button.delete"),
                    'Cancel': $translate.instant("global.button.cancel")
                }
            });

        };
        
        $scope.changeMethodCbb = function(method){
            if(method == 1){
                console.log("Email");
                tableConfig.customParams = "methodSms==" + 1;
                
            }else if(method == 2){
                console.log("Onsite");
                tableConfig.customParams = "methodOnsite==" + 1;
            }
            TableController.reloadPage(tableConfig.tableId);
        };
        
    }
})();
