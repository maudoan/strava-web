(function () {
    'use strict';
    angular.module('erpApp')
        .controller('DataPackageCreateController', DataPackageCreateController);

    DataPackageCreateController.$inject = ['$rootScope', '$scope', '$state', '$http','$timeout','$window',
        'AlertService', '$translate', 'TableController', 'ComboBoxController','Common', 'AlertModalService', 'DataPackage','ErrorHandle'];

    function DataPackageCreateController($rootScope, $scope, $state, $http,$timeout,$window,
                                  AlertService, $translate, TableController, ComboBoxController, Common, AlertModalService, DataPackage,ErrorHandle) {
        $scope.blockModal = null;
        $scope.blockUI = function () {
            if($scope.blockModal != null) $scope.blockModal.hide();
            $scope.blockModal = null;
            $scope.blockModal = UIkit.modal.blockUI('<div class=\'uk-text-center\'>Đang xử lý ...<br/><img class=\'uk-margin-top\' src=\'assets/img/spinners/spinner_success.gif\' alt=\'\'>');
        };
        $scope.dataPackage = {
        	"autoExtend": 1,
        	"type": 1,
        	"numberOfDevice":null,
        	"active":0,
        	"periodType":0,
        	"storageTimeType":0,
        	"capacityUnit":2,
            "resolution": "SD"
        };
        $scope.ComboBox = {};
        
        var kindOfTime = [
        	{ id: 0, name: $translate.instant('package.kindOfTime.day')},
            { id: 1, name: $translate.instant('package.kindOfTime.month')},
            { id: 2, name: $translate.instant('package.kindOfTime.year')}
        ];

        var kindOfTimeCbb = {
            id: 'kindOfTimeCbb',
            url: '',
            originParams: '',
            valueField: 'id',
            labelField: 'name',
            searchField: 'name',
            table: null,
            column: null,
            maxItems: 1,
            ngModel: [],
            options: kindOfTime,
            placeholder: $translate.instant("global.placeholder.choose")
        };
        ComboBoxController.init($scope, kindOfTimeCbb);
        
        var  capacityUnit= [
        	{ id: 0, name: 'KB'},
            { id: 1, name: 'MB'},
            { id: 2, name: 'GB'},
            { id: 3, name: 'TB'},
            { id: 4, name: 'PB'},
            { id: 5, name: 'EB'}
        ];

        var capacityUnitCbb = {
            id: 'capacityUnitCbb',
            url: '',
            originParams: '',
            valueField: 'id',
            labelField: 'name',
            searchField: 'name',
            table: null,
            column: null,
            maxItems: 1,
            ngModel: [],
            options: capacityUnit,
            placeholder: $translate.instant("global.placeholder.choose")
        };
        ComboBoxController.init($scope, capacityUnitCbb);

        var  resolutionUnit = [
            {name: 'FHD'},
            {name: 'SD'}
        ];

        var resolutionUnitCbb = {
            id: 'resolutionUnitCbb',
            url: '',
            originParams: '',
            valueField: 'name',
            labelField: 'name',
            searchField: 'name',
            table: null,
            column: null,
            maxItems: 1,
            ngModel: [],
            options: resolutionUnit,
            placeholder: null
        };
        ComboBoxController.init($scope, resolutionUnitCbb);
        
        $scope.changeAutoExtend = function (value) {
            if (value == 0) {
                $scope.dataPackage.autoExtend = 0;
            } else {
                $scope.dataPackage.autoExtend = 1;
            }
        }
        
        $scope.changeType = function (value) {
            if (value == 0) {
                $scope.dataPackage.numberOfDevice = 1;
            } else {
                $scope.dataPackage.numberOfDevice = null;
            }
        }
        
        $scope.submit = function(isClose) {
            if($scope.btnDisable) return;
            var $form = $("#data_package_form");
            $('#data_package_form').parsley();
            if(!$scope.data_package_form.$valid) return;
            if(!Common.checkIsValidForm($form)) return;
            $scope.btnDisable = true;
            $scope.blockUI();
            createDataPackage(isClose);
        };

        function createDataPackage(isClose){
            DataPackage.create($scope.dataPackage).then(function(data){
                if($scope.blockModal != null) $scope.blockModal.hide();
                AlertModalService.popup("success.msg.create");
                $timeout(function () {
                    isClose ? $state.go('packages'): $state.go('packages-detail',{packageId: data.id});
                },1100);
                if($scope.blockModal != null) $scope.blockModal.hide();
                $scope.btnDisable = false;
            }).catch(function(data){
                if($scope.blockModal != null) $scope.blockModal.hide();
                ErrorHandle.handleOneError(data);
                $scope.btnDisable = false;
            });
        }

        // ======================================
        var $formValidate = $('#data_package_form');
        $formValidate.parsley({
            'excluded': 'input[type=button], input[type=submit], input[type=reset], input[type=hidden], .selectize-input > input'
        }).on('form:validated',function() {
            $scope.$apply();
        }).on('field:validated',function(parsleyField) {
            if($(parsleyField.$element).hasClass('md-input')) {
                $scope.$apply();
            }
        });
    }
})();
