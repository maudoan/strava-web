(function () {
    'use strict';
    angular.module('erpApp').controller('FirmwaresController', FirmwaresController);

    FirmwaresController.$inject = ['$rootScope', '$scope', '$state', '$http','$timeout',
        'AlertService', '$translate', 'TableController', 'ComboBoxController', 'AlertModalService',
        'ErrorHandle', 'Firmware', 'DeviceModel', 'DeviceType', 'Provider', '$window'];

    function FirmwaresController($rootScope, $scope, $state, $http,$timeout,
                                   AlertService, $translate, TableController, ComboBoxController, AlertModalService,
                                   ErrorHandle, Firmware, DeviceModel, DeviceType, Provider, $window) {
        // khai bao cac column va kieu du lieu
    	$scope.Math = window.Math;
        var columns = {
            'id':'Number',
            'firmwareVersion':'Text',
            'deviceModelCode':'Text',
            'deviceModelName':'Text',
            'deviceTypeId':'Number',
            'providerId':'Number',
            'created':'DateTime',
            'size':'Number'
        };

        $scope.ComboBox = {};

        // khai bao cau hinh cho bang
        var tableConfig = {
            tableId: "firmwares",               //table Id
            model: "firmwares",                 //model
            defaultSort:"created",          //sap xep mac dinh theo cot nao
            sortType: "desc",                //kieu sap xep
            loadFunction: Firmware.getPage,     //api load du lieu
            columns: columns,               //bao gom cac cot nao
            handleAfterReload: null,        //xu ly sau khi load du lieu
            handleAfterReloadParams: null,  //tham so cho xu ly sau khi load
            deleteCallback: null,           //delete callback
            customParams: "",               //dieu kien loc ban dau
            pager_id: "table_firmware_pager",   //phan trang
            page_id: "firmware_selectize_page", //phan trang
            page_number_id: "firmware_selectize_pageNum",   //phan trang
            page_size_option: ["5", "10", "25", "50"]   //lua chon size cua 1 page
        };

        TableController.initTable($scope, tableConfig);     //khoi tao table
        TableController.sortDefault(tableConfig.tableId);   //set gia tri sap xep mac dinh
        TableController.reloadPage(tableConfig.tableId);    //load du lieu cho table
        
        var deviceTypeComboBox = {
                id: 'deviceTypeCbb',
                url: '/api/device-types',
                originParams: '',
                valueField: 'id',
                labelField: 'name',
                searchField: 'name',
                table: $scope.TABLES['firmwares'],
                column: 'deviceTypeId',
                maxItems: 1,
                ngModel: [],
                options: [],
                placeholder: $translate.instant('device.placeholder.type'),
                orderBy: 'id,asc'
            };
        ComboBoxController.init($scope, deviceTypeComboBox);
        
        var providerComboBox = {
                id: 'providerCbb',
                url: '/api/providers',
                originParams: null,
                valueField: 'id',
                labelField: 'name',
                searchField: 'name',
                table: $scope.TABLES['firmwares'],
                column: 'providerId',
                maxItems: 1,
                ngModel: [],
                options: [],
                placeholder: $translate.instant('device.placeholder.provider'),
                orderBy: 'name,asc'
            };
        ComboBoxController.init($scope, providerComboBox);
        // ham xoa mac dinh
        $scope.defaultDelete = function () {
            TableController.defaultDelete(tableConfig.tableId, Firmware.deleteRecord);
        };

        $scope.deleteOne = function(id){
            UIkit.modal.confirm($translate.instant("global.actionConfirm.delete"), function () {
                Firmware.deleteOne(id).then(function () {
                    AlertModalService.popup("success.msg.delete");
                    TableController.reloadPage(tableConfig.tableId);
                }).catch(function(err){
                    ErrorHandle.handleOneError(err);
                })
            }, {
                labels: {
                    'Ok': $translate.instant("global.button.delete"),
                    'Cancel': $translate.instant("global.button.cancel")
                }
            });
        }
    }
})();
