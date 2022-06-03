(function(){
    'use strict';
    angular.module('erpApp')
        .controller('QrCodeController', QrCodeController);

    QrCodeController.$inject = ['$rootScope','$scope','$state','$translate',
        '$http', 'ErrorHandle', '$window', 'TableController', 'QRCode', 'AlertService', 'ComboBoxController', 'Printer'];
    function QrCodeController($rootScope,$scope, $state, $translate,
                              $http, ErrorHandle, $window, TableController, QRCode, AlertService, ComboBoxController, Printer) {

        // khai bao cac column va kieu du lieu
        var columns = {
            'code': 'Text',
            "season": 'Text',
            "product": 'Text',
            "packaging_date": 'Text',
            "number_of_print": 'Number',
        };

        var customParams = "tenantId == " + window.localStorage.getItem("farmId");
        // khai bao cau hinh cho bang
        var tableConfig = {
            tableId: "qrCodes",               //table Id
            model: "qrCodes",                 //model
            defaultSort: "created",          //sap xep mac dinh theo cot nao
            sortType: "desc",                //kieu sap xep
            loadFunction: QRCode.getPageFull,     //api load du lieu
            columns: columns,               //bao gom cac cot nao
            handleAfterReload: null,        //xu ly sau khi load du lieu
            handleAfterReloadParams: null,  //tham so cho xu ly sau khi load
            deleteCallback: null,           //delete callback
            customParams: customParams,               //dieu kien loc ban dau
            pager_id: "table_qrcode_pager",   //phan trang
            page_id: "qrcode_selectize_page", //phan trang
            page_number_id: "qrcode_selectize_pageNum",   //phan trang
            page_size_option: ["5", "10", "25", "50"]   //lua chon size cua 1 page
        };

        TableController.initTable($scope, tableConfig);     //khoi tao table
        TableController.sortDefault(tableConfig.tableId);   //set gia tri sap xep mac dinh
        TableController.reloadPage(tableConfig.tableId);    //load du lieu cho table

        $scope.defaultDelete = function () {
            TableController.defaultDelete(tableConfig.tableId, QRCode.deleteMany);
        };

        $scope.deleteOne= function (id) {
            UIkit.modal.confirm($translate.instant("infrastructure.qrCode.deleteQRCode"), function () {
                QRCode.deleteOne(id).then(function (data) {
                    AlertService.success("success.msg.delete");
                    TableController.reloadPage(tableConfig.tableId);
                }).catch(function (error) {
                    TableController.highlightRowError(tableConfig.tableId, JSON.parse(error.data.params));
                    ErrorHandle.handleOneError(error);
                });
            }, {
                labels: {
                    'Ok': $translate.instant("global.button.ok"),
                    'Cancel': $translate.instant("global.button.cancel")
                }
            })
        };

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

        var qrCodeId = 0;
        var modal = UIkit.modal("#print_modal");
        $scope.printStamp = function(id) {
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

            Printer.print($scope, qrCodeId, tableConfig.tableId, modal);
        };
    }
})();