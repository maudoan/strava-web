(function () {
    'use strict';

    angular
        .module('erpApp')
        .factory('Printer', Printer);

    Printer.$inject = ['TableController', 'QRCode', 'AlertService', 'ErrorHandle', 'HOST_TRACE'];
    function Printer(TableController, QRCode, AlertService, ErrorHandle, HOST_TRACE, $scope) {
        var service = {
            print: print
        };
        return service;

        function print(scope, id, tableId, modal) {
            $scope = scope;
            QRCode.getFull(id).then(function (resp) {
                $scope.qrCode = resp;
                let qrCodeInfo = [];
                for(let i=0; i<$scope.printAmount; i++) {
                    let qrCode = {
                        "id": i,
                        "url": HOST_TRACE+"/#/trace/"+resp.id,
                        "productName": resp.product.name
                    };
                    qrCodeInfo.push(qrCode);
                }
                QRCode.printers(qrCodeInfo).then(function () {
                    $scope.blockModal.hide();
                    modal.hide();
                    AlertService.success("success.msg.print_stamp");
                    $scope.qrCode.numberOfPrint = parseInt($scope.qrCode.numberOfPrint) + $scope.printAmount;
                    QRCode.update($scope.qrCode).then(function () {
                        if(tableId) {
                            TableController.reloadPage(tableId);
                        }
                    }).catch(function (error) {
                        ErrorHandle.handleOneError(error);
                    });
                }).catch(function (error) {
                    ErrorHandle.handleOneError(error);
                });
            }).catch(function (data) {
                $scope.blockModal.hide();
                ErrorHandle.handleOneError(data);
            });
        }
    }
})();