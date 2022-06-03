(function () {
    'use strict';
    angular.module('erpApp')
        .controller('TraceController', TraceController);

    TraceController.$inject = ['$rootScope', '$scope', '$state', '$stateParams', '$http', 'ErrorHandle', 'QRCode'];

    function TraceController($rootScope, $scope, $state, $stateParams, $http, ErrorHandle, QRCode) {
        $scope.qrCode = {};
        QRCode.getFull($stateParams.qrCodeId).then(function (data) {
            $scope.qrCode = data;
        }).catch(function (error) {
            ErrorHandle.handleOneError(error);
        });
    }
})();