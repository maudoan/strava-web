(function(){
    'use strict';
    angular.module('erpApp')
        .controller('NotificationController', NotificationController);

    NotificationController.$inject = ['$rootScope','$scope','$state','$translate',
        '$http', 'ErrorHandle', '$window', 'TableController', 'Notification',
        'AlertService', 'ComboBoxController', '$timeout', '$document'];
    function NotificationController($rootScope,$scope, $state, $translate, 
                                    $http, ErrorHandle, $window, TableController, Notification, 
                                    AlertService, ComboBoxController, $timeout, $document) {
        $scope.ComboBox = {};
        $scope.notification = {};
        $scope.blockModal = null;
        $scope.blockUI = function () {
            if($scope.blockModal != null)
                $scope.blockModal.hide();
            $scope.blockModal = null;
            $scope.blockModal = UIkit.modal.blockUI('<div class=\'uk-text-center\'>Please Wait...<br/><img class=\'uk-margin-top\' src=\'assets/img/spinners/spinner_success.gif\' alt=\'\'>');
        };


        // khai bao cac column va kieu du lieu
        var columns = {
            'id': 'Number',
            'userId': 'Number',
            'type': 'Number',
            'contents': 'Text',
            'created': 'Datetime',
            'active': 'Number',
        };

        // khai bao cau hinh cho bang
        var tableConfig = {
            tableId: "notifications",               //table Id
            model: "notifications",                 //model
            defaultSort: "created",          //sap xep mac dinh theo cot nao
            sortType: "desc",                //kieu sap xep
            loadFunction: Notification.getPageFull,     //api load du lieu
            columns: columns,               //bao gom cac cot nao
            handleAfterReload: null,        //xu ly sau khi load du lieu
            handleAfterReloadParams: null,  //tham so cho xu ly sau khi load
            deleteCallback: null,           //delete callback
            customParams: "",               //dieu kien loc ban dau
            pager_id: "table_log_pager",   //phan trang
            page_id: "log_selectize_page", //phan trang
            page_number_id: "log_selectize_pageNum",   //phan trang
            page_size_option: ["5", "10", "25", "50"]   //lua chon size cua 1 page
        };

        TableController.initTable($scope, tableConfig);     //khoi tao table
        TableController.sortDefault(tableConfig.tableId);   //set gia tri sap xep mac dinh
        TableController.reloadPage(tableConfig.tableId);    //load du lieu cho table

        // CBB
        var fullNameCbb = {
            id: 'fullName',
            url: '/api/users',
            originParams: '',
            valueField: 'id',
            labelField: 'fullName',
            searchField: 'fullName',
            table: $scope.TABLES['notifications'],
            column: "userId",
            maxItems: 1,
            ngModel: [],
            options: [],
            placeholder: $translate.instant("global.placeholder.choose")
        };
        ComboBoxController.init($scope, fullNameCbb);

        var phoneCbb = {
            id: 'phone',
            url: '/api/users',
            originParams: '',
            valueField: 'id',
            labelField: 'phone',
            searchField: 'phone',
            table: null,
            column: null,
            maxItems: 1,
            ngModel: [],
            options: [],
            placeholder: $translate.instant("global.placeholder.choose")
        };
        ComboBoxController.init($scope, phoneCbb);

        var typeOptions = [
            { id: 0, value: $translate.instant("notification.type.updateFirmware") },
            { id: 1, value: $translate.instant("notification.type.motionDetect") }
        ];
        var typeCbb = {
            id: 'type',
            url: '',
            originParams: '',
            valueField: 'id',
            labelField: 'value',
            searchField: 'value',
            table: null,
            column: null,
            maxItems: 1,
            ngModel: [],
            options: typeOptions,
            placeholder: $translate.instant("global.placeholder.choose")
        };
        ComboBoxController.init($scope, typeCbb);

        // ================= FUNC =====================
        $scope.onSearch = function () {
            $scope.blockUI();
            var query = "";

            if($scope.notification.userId){
                query = convertQuery(query, "Number", "userId", $scope.notification.userId);
            }
            if($scope.notification.type){
                query = convertQuery(query, "Number", "type", $scope.notification.type);
            }
            if($scope.notification.contents){
                query = convertQuery(query, "Text", "contents", $scope.notification.note);
            }
            if($scope.notification.createdTmp){
                query = convertQuery(query, "DateTime", "created", $scope.notification.createdTmp);
            }

            tableConfig.customParams = query;
            TableController.reloadPage(tableConfig.tableId);    //load du lieu cho table

            $timeout(function () {
                if($scope.blockModal != null) $scope.blockModal.hide();
            }, 700);
        };

        function convertQuery(query, type, key, value){
            if(type === "Text"){
                query += key + '=="*' + value + '*";';
            } else if(type === "Number"){
                query += key + '==' + value + ';';
            } else if(type === "DateTime"){
                if (value == null) {
                    query += key + '==null';
                } else if (value.length > 0) {
                    var datetime = value.split("&");
                    query += key + '>=' + datetime[0] + ';' + key + '<=' + datetime[1] + ';';
                }
            }
            return query;
        }

        $scope.keyPress = function(keyEvent) {
            if(keyEvent.keyCode === 13) $scope.onSearch();
        };
    }
})();