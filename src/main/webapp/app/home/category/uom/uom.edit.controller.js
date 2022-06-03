(function () {
    'use strict';
    angular.module('erpApp')
        .controller('UomEditController', UomEditController);

    UomEditController.$inject = ['$rootScope', '$scope', '$state',
        '$stateParams', 'Uom', 'UomType', 'Organization', 'AlertService',
        'AlertModalService', '$translate', 'ErrorHandle', 'ComboBoxController',
        '$timeout'];

    function UomEditController($rootScope, $scope, $state,
                               $stateParams, Uom, UomType, Organization, AlertService,
                               AlertModalService, $translate, ErrorHandle, ComboBoxController,
                               $timeout) {
        $scope.ComboBox = {};
        $scope.uom = {
            type: 0,
            uomTypeId: null,
            baseUnitId: null
        };

        $scope.required_msg = $translate.instant('admin.messages.required');
        $scope.gln_msg = $translate.instant('global.messages.number_msg');
        $scope.maxLength20 = $translate.instant('global.messages.maxLength20');
        $scope.maxLength255 = $translate.instant('global.messages.maxLength255');
        $scope.maxLength1000 = $translate.instant('global.messages.maxLength1000');
        $scope.min_msg = $translate.instant('global.messages.min_msg');
        $scope.greaterThanZero = $translate.instant('global.messages.greaterThanZero');
        $scope.float12_6 = $translate.instant("global.messages.float12_6");

        $scope.isAdmin = false;

        $scope.blockModal = null;
        $scope.blockUI = function () {
            if($scope.blockModal != null) $scope.blockModal.hide();
            $scope.blockModal = null;
            $scope.blockModal = UIkit.modal.blockUI('<div class=\'uk-text-center\'>Please Wait...<br/><img class=\'uk-margin-top\' src=\'assets/img/spinners/spinner_success.gif\' alt=\'\'>');
        };

        Uom.getFullInformation($stateParams.uomId).then(function (data) {
            if(!data){
                AlertService.error("Không tìm thấy dữ liệu");
                return;
            }
            $scope.uom = data;

            if(data.uomType){
                uomTypeComboBox.options = [data.uomType];
                ComboBoxController.init($scope, uomTypeComboBox);
            }
            if(data.baseUnit){
                uomComboBox.options = [data.baseUnit];
                ComboBoxController.init($scope, uomComboBox);
            }
            // $timeout(function () {
            //     var uomType = {
            //         id: $scope.uom.uomTypeId,
            //         name: $scope.uom.uomTypeName
            //     }
            //     $scope.ComboBox['uom-uomTypeId'].options = [uomType];
            //     // console.log($scope.uom.uomTypeId)
            //     // console.log($scope.ComboBox['uom-uomTypeId'].options)
            //     $scope.uomType = data.uomType;
            //
            //     // $scope.ComboBox['uom-organizationId'].options = [data.organization];
            //     // $scope.organization = data.organization;
            //     var uomBase = {
            //         id: $scope.uom.baseUnitId,
            //         name: $scope.uom.baseUnitName
            //     }
            //     $scope.ComboBox['uom-baseUnitId'].options = [uomBase];
            //     $scope.baseUnit = data.baseUnit;
            // });
        });

        var customParams = "(tenantId == " + window.localStorage.getItem("farmId") + ";tenantId!=null, isDefault==1)";
        var uomTypeComboBox = {
            id:'uom-uomTypeId',
            url:'/api/uomTypes',
            originParams: customParams,
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

        $scope.btnDisable = false;
        $scope.submit = function (isClose) {
            if($scope.btnDisable) return;
            $('#form_createUom').parsley();
            var $form = $('#form_createUom');

            if (!$scope.form_createUom.$valid) return;
            if(!ComboBoxController.checkIsValidForm($form)) return;
            $scope.uom.acreage = parseFloat($scope.uom.conversionFactor);
            // if(!$scope.uom.organizationId){
            //     AlertService.error("Doanh nghiêp không được bỏ trống");
            //     return;
            // }

            $scope.blockUI();
            $scope.btnDisable = true;
            Uom.update($scope.uom).then(function (data) {
                $scope.blockModal.hide();
                AlertModalService.popup("success.msg.update");
                $timeout(function () {
                    isClose?$state.go('uoms'):$state.go('uoms-detail',{uomId: data.id});
                },1100);
                $scope.btnDisable = false;
            }).catch(function (data) {
                $scope.btnDisable = false;
                $scope.blockModal.hide();
                ErrorHandle.handleError(data);
            });
        };

        var firstLoadUomType = false;
        $scope.onChangeUomType = function () {
            var uomTypeId = $scope.uom.uomTypeId ? $scope.uom.uomTypeId : 0;
            if(!firstLoadUomType){
                firstLoadUomType = true;
                uomComboBox.originParams = 'type==1;uomTypeId==' + uomTypeId;
                return;
            }

            uomComboBox.options = [""];
            uomComboBox.originParams = 'type==1;uomTypeId==' + uomTypeId;
            uomComboBox.resetScroll = true;
            $scope.uom.baseUnitId = "";
            ComboBoxController.init($scope, uomComboBox);
        };

        $scope.onChangeIsBasisUnit = function () {
            if(!$scope.uom.type){
                $scope.uom.conversionFactor = null;
                return;
            }

            // là đơn vị cơ sở thì = 1 và không được sửa
            $scope.uom.conversionFactor = 1;

            var conversionFactor = angular.element("#conversionFactor");
            conversionFactor.removeClass("md-input-danger");
            conversionFactor.parent().find(".parsley-errors-list").remove()
        };

        if (angular.element('#form_createUom').length) {
            var $formValidate = $('#form_createUom');
            $formValidate
                .parsley({
                    'excluded': 'input[type=button], input[type=submit], input[type=reset], input[type=hidden], .selectize-input > input'
                })
                .on('form:validated', function () {
                    $scope.$apply();
                })
                .on('field:validated', function (parsleyField) {
                    if ($(parsleyField.$element).hasClass('md-input')) {
                        $scope.$apply();
                    }
                });
        }
    }

})();