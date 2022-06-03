(function () {
    'use strict';
    angular.module('erpApp')
        .controller('UomDetailController', UomDetailController);

    UomDetailController.$inject = ['$rootScope', '$scope', '$state', '$stateParams', 'Uom', 'UomType', 'Organization',
        'Principal', 'AlertService', '$translate', 'ErrorHandle', 'ComboBoxController','$timeout', 'Common'];

    function UomDetailController($rootScope, $scope, $state, $stateParams, Uom, UomType, Organization,
                                 Principal, AlertService, $translate, ErrorHandle, ComboBoxController, $timeout, Common) {
        $scope.ComboBox = {};
        $scope.uom = {
            type: 0
        };
        $scope.organization = $scope.uomType = $scope.baseUnit ={};
        $scope.isAdmin = false;

        Uom.getFullInformation($stateParams.uomId).then(function (data) {
            if(!data){
                AlertService.error("Không tìm thấy dữ liệu");
                return;
            }
            $scope.uom = data;
            $scope.uom.subName = Common.truncateString($scope.uom.name, 83);

            // var uomType = {
            //     id: $scope.uom.uomTypeId,
            //     name: $scope.uom.uomTypeName
            // }
            // $scope.ComboBox['uom-uomTypeId'].options = [uomType];
            // $scope.uomType = data.uomType;

            // $scope.ComboBox['uom-organizationId'].options = [data.organization];
            // $scope.organization = data.organization;

            // var uomBase = {
            //     id: $scope.uom.baseUnitId,
            //     name: $scope.uom.baseUnitName
            // }

            // $scope.ComboBox['uom-baseUnitId'].options = [uomBase];
            // $scope.baseUnit = data.baseUnit;
        });

        var uomTypeComboBox = {
            id:'uom-uomTypeId',
            url:'/api/uomTypes/search-full',
            originParams:'',
            valueField:'id',
            labelField:'name',
            searchField:'name',
            table: null,
            column: null,
            maxItems:1,
            ngModel:[],
            options:[],
            placeholder: $translate.instant("global.placeholder.choose")
        };
        ComboBoxController.init($scope, uomTypeComboBox);

        var organizationComboBox = {
            id:'uom-organizationId',
            url:'/api/organizations',
            originParams:'',
            valueField:'id',
            labelField:'name',
            searchField:'name',
            table: null,
            column: null,
            maxItems:1,
            ngModel:[],
            options:[],
            placeholder: $translate.instant("global.placeholder.choose")
        };
        ComboBoxController.init($scope, organizationComboBox);

        var uomComboBox = {
            id:'uom-baseUnitId',
            url:'/api/uoms',
            originParams:'type==1',
            valueField:'id',
            labelField:'name',
            searchField:'name',
            table: null,
            column: null,
            maxItems:1,
            ngModel:[],
            options:[],
            placeholder: $translate.instant("global.placeholder.choose")
        };
        ComboBoxController.init($scope, uomComboBox);
    }

})();