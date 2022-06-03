(function () {
    'use strict';
    angular.module('erpApp')
        .controller('AreaEditController', AreaEditController);

    AreaEditController.$inject = ['$rootScope', '$scope', '$state','$stateParams', '$http', '$timeout', '$window',
        'AlertService', '$translate', 'TableController', 'Common', 'AlertModalService', 'Area', 'ErrorHandle', 'ComboBoxController'];

    function AreaEditController($rootScope, $scope, $state,$stateParams, $http, $timeout, $window,
                                 AlertService, $translate, TableController, Common, AlertModalService, Area, ErrorHandle, ComboBoxController) {
        $scope.blockModal = null;
        $scope.blockUI = function () {
            if($scope.blockModal != null) $scope.blockModal.hide();
            $scope.blockModal = null;
            $scope.blockModal = UIkit.modal.blockUI('<div class=\'uk-text-center\'>Đang xử lý ...<br/><img class=\'uk-margin-top\' src=\'assets/img/spinners/spinner_success.gif\' alt=\'\'>');
        };

        $scope.userAreaIds = $rootScope.currentUser.areaIds;
        if(!$scope.userAreaIds.includes(parseInt($stateParams.areaId)) && !$scope.userAreaIds.includes(1)) {
            $state.go('error.403');
        }

        $scope.ComboBox = {};

        var areaCbx = {
            id: 'area',
            url: '/api/areas',
            originParams: "id!="+ $stateParams.areaId,
            valueField: 'id',
            labelField: 'prefixName',
            searchField: 'name',
            table: null,
            column: null,
            maxItems: 1,
            ngModel: [],
            options: [],
            placeholder: null,
            orderBy: 'name,asc'
        };
        ComboBoxController.init($scope, areaCbx);
        Area.getPage("query=id!=" + $stateParams.areaId).then(function (response) {
            $scope.areas = response.data;
            Area.getOne($stateParams.areaId).then(function (data) {
                $scope.area = data;
                areaCbx.options = $scope.areas;
                areaCbx.options.push($scope.area.parentArea);
                ComboBoxController.init($scope, areaCbx);
            });
        })


        $scope.submit = function(isClose){
            if($scope.btnDisable) return;
            var $form = $("#area_model_form");
            $('#area_model_form').parsley();
            if(!$scope.area_model_form.$valid) return;
            if(!Common.checkIsValidForm($form)) return;
            if (!ComboBoxController.checkIsValidForm($form)) return;
            $scope.btnDisable = true;
            $scope.blockUI();
            Area.update($scope.area).then(function (data) {
                if($scope.blockModal != null) $scope.blockModal.hide();
                AlertModalService.popup("success.msg.update");
                $timeout(function () {
                    isClose ? $state.go('areas'): $state.go('areas-detail',{areaId: data.id});
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
        var $formValidate = $('#area_model_form');
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
