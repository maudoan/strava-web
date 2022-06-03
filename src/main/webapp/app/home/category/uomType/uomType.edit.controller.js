(function () {
    'use strict';
    angular.module('erpApp')
        .controller('UomTypeEditController', UomTypeEditController);

    UomTypeEditController.$inject = ['$rootScope', '$scope', '$state','$timeout',
        '$stateParams', 'UomType', 'Organization', 'AlertService','AlertModalService',
        '$translate', 'ErrorHandle', 'ComboBoxController','HOST_GW'];

    function UomTypeEditController($rootScope, $scope, $state,$timeout,
                                   $stateParams, UomType, Organization, AlertService,
                                   AlertModalService, $translate, ErrorHandle,
                                   ComboBoxController,HOST_GW) {
        var vm = this;
        $scope.ComboBox = {};
        $scope.required_msg = $translate.instant('admin.messages.required');
        $scope.maxLength255 = $translate.instant("global.messages.maxLength255");
        $scope.maxLength1000 = $translate.instant("global.messages.maxLength1000");

        $scope.uomType = {
            type: 0
        };
        $scope.blockModal;
        $scope.blockUI = function () {
            if($scope.blockModal != null) $scope.blockModal.hide();
            $scope.blockModal = null;
            $scope.blockModal = UIkit.modal.blockUI('<div class=\'uk-text-center\'>Please Wait...<br/><img class=\'uk-margin-top\' src=\'assets/img/spinners/spinner_success.gif\' alt=\'\'>');
        };

        UomType.getOne($stateParams.uomTypeId).then(function (data) {
            $scope.uomType = data;
            $scope.ComboBox['uomType-organizationId'].options = [data.organization];
            $scope.organization = data.organization;
        });

        // gồm 7 options: Diện tích, chiều dài, nhiệt độ, thời gian, thể tích, khối lượng, khác
        $scope.typeOptions = [
            {id: 1, name: $translate.instant('global.common.acerage')},
            {id: 2, name: $translate.instant('global.common.length')},
            {id: 3, name: $translate.instant('global.common.temperature')},
            {id: 4, name: $translate.instant('global.common.time')},
            {id: 5, name: $translate.instant('global.common.volume')},
            {id: 6, name: $translate.instant('global.common.weigh')},
            {id: 7, name: $translate.instant('global.common.packing')},
            {id: 0, name: $translate.instant('global.common.other')}
        ];

        var organizationComboBox = {
            id:'uomType-organizationId',
            url:HOST_GW+'/api/tenants',
            originParams:'active==1',
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

        $scope.btnDisable = false;
        $scope.submit = function (isClose) {
            if($scope.btnDisable) return;
            $('#form_createuomType').parsley();
            // if(!$scope.uomType.organizationId) {
            //     AlertService.error("Doanh nghiêp không được bỏ trống");
            //     return;
            // }

            if($scope.uomType.type == null) {
                AlertService.error("Loại đơn vị không được bỏ trống");
                return;
            }

            if (!$scope.form_createuomType.$valid) return;
            var $form = $("#form_createuomType");
            if(!ComboBoxController.checkIsValidForm($form)) return;

            $scope.blockUI();
            $scope.btnDisable = true;
            UomType.update($scope.uomType).then(function (data) {
                $scope.blockModal.hide();
                AlertModalService.popup("success.msg.update");
                $timeout(function () {
                    isClose?$state.go('uomTypes'):$state.go('uomTypes-detail',{uomTypeId: data.id});
                },1100);
            }).catch(function (data) {
                $scope.btnDisable = false;
                $scope.blockModal.hide();
                ErrorHandle.handleError(data);
            });

        };

        if (angular.element('#form_createuomType').length) {
            $scope.selectize_types_config = {
                plugins: {
                },
                maxItems: 1,
                valueField: 'id',
                labelField: 'name',
                searchField: 'name',
                placeholder: $translate.instant("global.placeholder.choose"),
                create: false,
                render: {
                    option: function(options, escape) {
                        return  '<div class="option" >' +
                            '<span class="title">' + escape(options.name) + '</span>' +
                            '</div>';
                    },
                    item: function(options, escape) {
                        return '<div class="item">' + escape(options.name) + '</div>';
                    }
                }
            };

            var $formValidate = $('#form_createuomType');
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