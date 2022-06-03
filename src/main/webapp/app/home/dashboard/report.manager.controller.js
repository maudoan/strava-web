(function(){
    'use strict';
    angular.module('erpApp')
        .controller('ReportManagerController', ReportManagerController);

    ReportManagerController.$inject = ['$rootScope','$scope','$state'];
    function ReportManagerController($rootScope,$scope, $state) {
        $scope.goToStockReport = function () {
            $state.go("stock-report");
        };

    }

})();