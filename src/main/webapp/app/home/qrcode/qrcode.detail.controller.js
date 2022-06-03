(function() {
    'use strict';
    angular.module('erpApp')
        .controller('QrCodeDetailController', QrCodeDetailController);

    QrCodeDetailController.$inject = ['$rootScope', '$scope', '$state', '$stateParams', '$http', 'ErrorHandle', 'QRCode',
        'ComboBoxController', 'AlertService', 'Printer'];

    function QrCodeDetailController($rootScope, $scope, $state, $stateParams, $http, ErrorHandle, QRCode, ComboBoxController,
                                    AlertService, Printer) {
        $scope.qrCode = {};
        QRCode.getFull($stateParams.qrCodeId).then(function (data) {
            $scope.qrCode = data;
        }).catch(function (data) {
            ErrorHandle.handleOneError(data);
        });

        var $formValidate = $('#print_amount_form');
        $formValidate.parsley({
            'excluded': 'input[type=button], input[type=submit], input[type=reset], input[type=hidden], .selectize-input > input'
        }).on('form:validated',function() {
            $scope.$apply();
        }).on('field:validated',function(parsleyField) {
            if($(parsleyField.$element).hasClass('md-input')) {
                $scope.$apply();
            }
        });

        $scope.blockUI = function () {
            if($scope.blockModal != null)
                $scope.blockModal.hide();
            $scope.blockModal = null;
            $scope.blockModal = UIkit.modal.blockUI('<div class=\'uk-text-center\'>Please Wait...<br/><img class=\'uk-margin-top\' src=\'assets/img/spinners/spinner_success.gif\' alt=\'\'>');
        };

        var qrCodeId = null;
        var modal = UIkit.modal("#print_modal");
        $scope.printStamp = function(id) {
            $("#print_amount_form").trigger("reset");
            $(".parsley-errors-list").remove();
            $("#print_amount_form input").removeClass("md-input-danger");
            $scope.printAmount = 1;
            qrCodeId = id;
            modal.show();
        };

        $scope.submit = function() {
            var $form = $("#print_amount_form");
            $form.parsley();
            if(!$scope.print_amount_form.$valid) return;
            if(!ComboBoxController.checkIsValidForm($form)) return;
            $scope.printAmount = parseInt($scope.printAmount);
            $scope.blockUI();

            Printer.print($scope, qrCodeId, null, modal);
        };
    }
})();