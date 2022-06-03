(function () {
    'use strict';
    angular.module('erpApp').controller('PolicyController', PolicyController);

    PolicyController.$inject = ['$rootScope', '$scope', '$state', '$http','$timeout',
        'AlertService', '$translate', 'TableController', 'ComboBoxController', 'AlertModalService',
        'ErrorHandle', 'Policy', 'DeviceModel', 'DeviceType', 'Provider', '$window', 'HOST_GW'];

    function PolicyController($rootScope, $scope, $state, $http,$timeout,
                                   AlertService, $translate, TableController, ComboBoxController, AlertModalService,
                                   ErrorHandle, Policy, DeviceModel, DeviceType, Provider, $window, HOST_GW) {
        // khai bao cac column va kieu du lieu
        var columns = {
            'id':'Number',
            'namePolicy':'Text',
            'modelCode':'Text',
            'deviceTypeId':'Number',
            'areaIds':'MultiNumber',
            'deviceModelName':'Text',
            'providerId':'Number',
            'fromVersionName':'Text',
            'versioningName':'Text',
            'exceptVersionName':'Text',
            'created':'DateTime'
        };

        $scope.ComboBox = {};

        $scope.input ={
            areaIds:[]
        }
        function getPage(params) {
            if($scope.input.areaIds == null) $scope.input.areaIds = []
            return $http.get(HOST_GW + '/api/policy/custom-search?areaIds=' + $scope.input.areaIds +"&" + params).then(function (response) {
                return response;
            });
        }

     // khai bao cau hinh cho bang
        var tableConfig = {
            tableId: "policy",               //table Id
            model: "policy",                 //model
            defaultSort:"created",          //sap xep mac dinh theo cot nao
            sortType: "desc",                //kieu sap xep
            loadFunction: getPage,     //api load du lieu
            columns: columns,               //bao gom cac cot nao
            handleAfterReload: null,        //xu ly sau khi load du lieu
            handleAfterReloadParams: null,  //tham so cho xu ly sau khi load
            deleteCallback: null,           //delete callback
            customParams: "",               //dieu kien loc ban dau
            pager_id: "table_policy_pager",   //phan trang
            page_id: "policy_selectize_page", //phan trang
            page_number_id: "policy_selectize_pageNum",   //phan trang
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
                table: $scope.TABLES['policy'],
                column: 'deviceTypeId',
                maxItems: 1,
                ngModel: [],
                options: [],
                placeholder: $translate.instant('device.placeholder.type'),
                orderBy: 'id,asc'
            };
        ComboBoxController.init($scope, deviceTypeComboBox);

        var areaComboBox = {
            id: 'areaCbb',
            url: '/api/areas',
            originParams: null,
            valueField: 'id',
            labelField: 'name',
            searchField: 'name',
            table: null,
            column: 'areaIds',
            maxItems: null,
            ngModel: [],
            options: [],
            orderBy: 'name,asc',
            placeholder: "Chọn khu vực"
        };
        ComboBoxController.init($scope, areaComboBox);

       /* var deviceModelComboBox = {
                id: 'deviceModelCbb',
                url: '/api/device-models',
                originParams: '',
                valueField: 'id',
                labelField: 'name',
                searchField: 'id',
                table: $scope.TABLES['policy'],
                column: 'deviceModel',
                maxItems: 1,
                ngModel: [],
                options: [],
                placeholder: $translate.instant('device.placeholder.deviceModel'),
                orderBy: 'id,asc'
            };
        ComboBoxController.init($scope, deviceModelComboBox);*/
        
        var providerComboBox = {
                id: 'providerCbb',
                url: '/api/providers',
                originParams: null,
                valueField: 'id',
                labelField: 'name',
                searchField: 'name',
                table: $scope.TABLES['policy'],
                column: 'providerId',
                maxItems: 1,
                ngModel: [],
                options: [],
                placeholder: $translate.instant('device.placeholder.provider'),
                orderBy: 'name,asc'
            };
        ComboBoxController.init($scope, providerComboBox);

        $scope.search = function(){
            TableController.reloadPage(tableConfig.tableId);
        }

        // ham xoa mac dinh
        $scope.defaultDelete = function () {
            TableController.defaultDelete(tableConfig.tableId, Policy.deleteRecord);
        };

        $scope.deleteOne = function(id){
            UIkit.modal.confirm($translate.instant("global.actionConfirm.delete"), function () {
            	Policy.deleteOne(id).then(function () {
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
        
        $scope.startPolicy = function(id){
        	UIkit.modal.confirm($translate.instant("device.policy.message.execute"), function () {
            	Policy.activate(id).then(function () {
                    AlertModalService.popup("device.policy.message.executeSuccess");
                    TableController.reloadPage(tableConfig.tableId);
                }).catch(function(err){
                    ErrorHandle.handleOneError(err);
                })
            }, {
                labels: {
                    'Ok': $translate.instant("global.tooltip.start"),
                    'Cancel': $translate.instant("global.button.cancel")
                }
            });
        }
        
        $scope.stopPolicy = function(id){
        	UIkit.modal.confirm($translate.instant("device.policy.message.stop"), function () {
            	Policy.deactivate(id).then(function () {
                    AlertModalService.popup("device.policy.message.stopSuccess");
                    TableController.reloadPage(tableConfig.tableId);
                }).catch(function(err){
                    ErrorHandle.handleOneError(err);
                })
            }, {
                labels: {
                    'Ok': $translate.instant("global.tooltip.stop"),
                    'Cancel': $translate.instant("global.button.cancel")
                }
            });
        }
    }
})();
