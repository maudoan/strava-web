(function() {
    'use strict';
    angular.module('erpApp')
        .controller('QrCodeEditController', QrCodeEditController);

    QrCodeEditController.$inject = ['$rootScope', '$scope', '$state', 'AlertModalService', '$translate', '$http', 'ErrorHandle', '$window',
        'ComboBoxController', '$timeout', 'Season', 'DateTimeValidation', 'QRCode', '$stateParams', '$filter'];

    function QrCodeEditController($rootScope, $scope, $state, AlertModalService, $translate, $http, ErrorHandle, $window,
                                  ComboBoxController, $timeout, Season, DateTimeValidation, QRCode, $stateParams, $filter) {
        var farmId = $window.localStorage.getItem("farmId");
        DateTimeValidation.init($scope);
        $scope.ComboBox = {};
        $scope.qrCode = {};

        $scope.blockModal;
        $scope.blockUI = function () {
            if($scope.blockModal != null) $scope.blockModal.hide();
            $scope.blockModal = null;
            $scope.blockModal = UIkit.modal.blockUI('<div class=\'uk-text-center\'>Đang xử lý ...<br/><img class=\'uk-margin-top\' src=\'assets/img/spinners/spinner_success.gif\' alt=\'\'>');
        };
        var $formValidate = $('#form_qrcode_update');
        $formValidate.parsley({
            'excluded': 'input[type=button], input[type=submit], input[type=reset], input[type=hidden], .selectize-input > input'
        }).on('form:validated',function() {
            $scope.$apply();
        }).on('field:validated',function(parsleyField) {
            if($(parsleyField.$element).hasClass('md-input')) {
                $scope.$apply();
            }
        });

        var areaComboBox = {
            id: 'area_combobox',
            url: '/api/areas',
            originParams: 'active==1;tenantId==' + farmId,
            valueField: 'id',
            labelField: 'name',
            searchField: 'name',
            table: null,
            column: null,
            maxItems: 1,
            ngModel: [],
            options: [],
            placeholder: $translate.instant("qrCode.placeholder.selectArea"),
            orderBy: 'name,asc'
        };
        ComboBoxController.init($scope, areaComboBox);

        var seasonComboBox = {
            id: 'season_combobox',
            url: '/api/seasons',
            originParams: '',
            valueField: 'id',
            labelField: 'name',
            searchField: 'name',
            table: null,
            column: null,
            maxItems: 1,
            ngModel: [],
            options: [],
            placeholder: $translate.instant("qrCode.placeholder.selectSeason"),
            orderBy: 'name,asc'
        };
        ComboBoxController.init($scope, seasonComboBox);

        var productComboBox = {
            id: 'product_combobox',
            url: '/api/products',
            originParams: '',
            valueField: 'id',
            labelField: 'name',
            searchField: 'name',
            table: null,
            column: null,
            maxItems: 1,
            ngModel: [],
            options: [],
            placeholder: $translate.instant("qrCode.placeholder.selectProduct"),
            orderBy: 'name,asc'
        };
        ComboBoxController.init($scope, productComboBox);

        function reloadDatepicker(id){
            var datePickerInit = $("#" + id);
            datePickerInit.on("blur", function () {
                DateTimeValidation.onBlurDate($(this), false);
            }).kendoDatePicker({
                format: "dd/MM/yyyy",
                change: function () {
                    $scope.qrCode.packagingDate = this.value() != null ? this.value().getTime() : null;
                }
            });
        }

        $timeout(function () {
            reloadDatepicker('packagingDate');
        });
        $scope.onChangeArea = function(isFirstLoad) {
            $scope.isFirstLoad = false;
            if(isFirstLoad) return;

            seasonComboBox.originParams = 'active==1;tenantId==' + farmId + ';areaId==' + $scope.qrCode.areaId;
            seasonComboBox.options = [""];
            seasonComboBox.resetScroll = true;
            ComboBoxController.init($scope, seasonComboBox);
        };

        $scope.onChangeSeason = function() {
            $timeout(function () {
                if($scope.qrCode.seasonId) {
                    Season.getOne($scope.qrCode.seasonId).then(function(season) {
                        $scope.seasonCode = season.code;
                        $scope.productName = season.productName;
                        $scope.qrCode.productId = season.productId;
                    });
                } else {
                    $scope.seasonCode = null;
                    $scope.productName = null;
                }
            });
        };

        QRCode.getFull($stateParams.qrCodeId).then(function (data) {
            $scope.qrCode = data;
            areaComboBox.options = [data.area];
            seasonComboBox.options = [data.season];
            productComboBox.options = [data.product];

            ComboBoxController.init($scope, areaComboBox);
            ComboBoxController.init($scope, seasonComboBox);
            ComboBoxController.init($scope, productComboBox);

            var datepicker = $("#packagingDate").data("kendoDatePicker");
            var date = $filter('date')($scope.qrCode.packagingDate, 'dd/MM/yyyy');
            datepicker.value(date);
            $scope.isFirstLoad = true;
        }).catch(function (data) {
            ErrorHandle.handleOneError(data);
        });

        $scope.btnDisable = false;
        $scope.submit = function(isClose) {
            $('#form_qrcode_update').parsley();
            if($scope.btnDisable) return;
            if (!$scope.form_qrcode_update.$valid) return;
            var $form = $('#form_qrcode_update');
            if (!ComboBoxController.checkIsValidForm($form)) return;
            $scope.btnDisable = true;

            $scope.blockUI();
            QRCode.update($scope.qrCode).then(function (data) {
                if ($scope.blockModal != null) $scope.blockModal.hide();
                AlertModalService.popup("success.msg.update");
                $timeout(function () {
                    isClose ? $state.go('qrCode') : $state.go('qrCode-detail', {qrCodeId: data.id});
                }, 1100);
            }).catch(function (error) {
                if ($scope.blockModal != null) $scope.blockModal.hide();
                ErrorHandle.handleOneError(error);
            });
        };
    }
})();