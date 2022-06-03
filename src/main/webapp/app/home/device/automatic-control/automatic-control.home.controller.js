(function () {
    'use strict';
    angular.module('erpApp').controller('AutomaticController', AutomaticController);

    AutomaticController.$inject = ['$rootScope', '$scope', '$state', 'ErrorHandle',
        'AlertService', '$translate', 'TableController', 'ComboBoxController', 'AlertModalService', 'AutomaticControl', '$window'];

    function AutomaticController($rootScope, $scope, $state, ErrorHandle,
                                  AlertService, $translate, TableController, ComboBoxController, AlertModalService, AutomaticControl, $window) {
        $scope.tenantId = $window.localStorage.getItem("farmId") ? $window.localStorage.getItem("farmId") : 0;
        $scope.ComboBox = {};

        // khai bao cac column va kieu du lieu
        var columns = {
            'id':'Number',
            'serial':'Text',
            'name':'Text',
            'code':'Text',
            'type':'Number',
            'tenantId':'Number',
            'areaId':'Number',
            'typeFarm':'Number',
            'gw':'Text',
            'state':'Number',
            'gatewayId':'Number',
            'groupDeviceId': 'Number',
            'productName': 'Text',
            'seasonName': 'Text',
            'areaName': 'Text'
        };

        // khai bao cau hinh cho bang
        var tableConfig = {
            tableId: "automaticControls",               //table Id
            model: "automaticControls",                 //model
            defaultSort:"created",          //sap xep mac dinh theo cot nao
            sortType: "desc",                //kieu sap xep
            loadFunction: AutomaticControl.getPage,     //api load du lieu
            columns: columns,               //bao gom cac cot nao
            handleAfterReload: null,        //xu ly sau khi load du lieu
            handleAfterReloadParams: null,  //tham so cho xu ly sau khi load
            deleteCallback: null,           //delete callback
            customParams: "tenantId==" + $scope.tenantId,               //dieu kien loc ban dau
            pager_id: "table_device_pager",   //phan trang
            page_id: "device_selectize_page", //phan trang
            page_number_id: "device_selectize_pageNum",   //phan trang
            page_size_option: ["5", "10", "25", "50"]   //lua chon size cua 1 page
        };

        TableController.initTable($scope, tableConfig);     //khoi tao table
        TableController.sortDefault(tableConfig.tableId);   //set gia tri sap xep mac dinh
        TableController.reloadPage(tableConfig.tableId);    //load du lieu cho table

        $scope.typeFields = [
            { value: 0, title: 'Chưa kích hoạt'},
            { value: 1, title: 'Kích hoạt'}
        ];

        $scope.typeOptions = [
            '',
            'Trộn dinh dưỡng theo EC và pH',
            'Trộn dinh dưỡng theo EC',
            'Trộn dinh dưỡng theo định lượng',
            'Trộn dinh dưỡng theo định lượng và pH',
            'Bơm dinh dưỡng cho giá thể/đất',
            'Bơm dinh dưỡng cho thuỷ canh',
            'Quạt gió',
            'Cắt nắng',
            'Chiếu sáng'
        ];

        var typeOptions = [
            { id: 1, name: 'Trộn dinh dưỡng theo EC và pH'},
            { id: 2, name: 'Trộn dinh dưỡng theo EC'},
            { id: 3, name: 'Trộn dinh dưỡng theo định lượng'},
            { id: 4, name: 'Trộn dinh dưỡng theo định lượng và pH'},
            { id: 5, name: 'Bơm dinh dưỡng cho giá thể/đất'},
            { id: 6, name: 'Bơm dinh dưỡng cho thuỷ canh'},
            { id: 7, name: 'Quạt gió'},
            { id: 8, name: 'Cắt nắng'},
            { id: 9, name: 'Chiếu sáng'}
        ];
        // type combobox
        var typeCbb = {
            id: 'typeCbb',
            url: '',
            originParams: '',
            valueField: 'id',
            labelField: 'name',
            searchField: 'name',
            table: $scope.TABLES['automaticControls'],
            column: 'type',
            maxItems: 1,
            ngModel: [],
            options: typeOptions,
            placeholder: 'Chọn chế độ'
        };
        ComboBoxController.init($scope, typeCbb);

        // ham xoa mac dinh
        $scope.defaultDelete = function () {
            TableController.defaultDelete(tableConfig.tableId, AutomaticControl.deleteRecord);
        };

        $scope.deleteOne = function(id){
            UIkit.modal.confirm($translate.instant("global.actionConfirm.delete"), function () {
                AutomaticControl.deleteOne(id).then(function () {
                    AlertService.success("success.msg.delete");
                    TableController.reloadPage(tableConfig.tableId);
                }).catch(function(data){
                    ErrorHandle.handleOneError(data);
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
