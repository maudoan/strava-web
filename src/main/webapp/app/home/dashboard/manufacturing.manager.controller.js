(function(){
    'use strict';
    angular.module('erpApp')
        .controller('ManufacturingManagerController', ManufacturingManagerController);

    ManufacturingManagerController.$inject = ['$rootScope','$scope','$state','$stateParams', 'AlertService','$translate','variables', 'apiData', '$http', 'ErrorHandle', '$window', 'Dashboard'];
    function ManufacturingManagerController($rootScope,$scope, $state,$stateParams, AlertService, $translate, variables, apiData, $http, ErrorHandle, $window, Dashboard) {
        $scope.goToMaterial = function () {
            $state.go("procedureLogs");
        }
        $scope.goToOrder = function () {
            $state.go("procedures");
        }
        $scope.goToTransfer = function () {
            $state.go("seasons");
        }
    }

})();