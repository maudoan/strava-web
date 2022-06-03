(function(){
    'use strict';
    angular.module('erpApp')
        .controller('InfrastructureManagerController', InfrastructureManagerController);

    InfrastructureManagerController.$inject = ['$rootScope','$scope','$state','$stateParams', 'AlertService','$translate','variables', 'apiData', '$http', 'ErrorHandle', '$window', 'Dashboard'];
    function InfrastructureManagerController($rootScope,$scope, $state,$stateParams, AlertService, $translate, variables, apiData, $http, ErrorHandle, $window, Dashboard) {
        $scope.goToMaterial = function () {
            $state.go("farms");
        }
        $scope.goToOrder = function () {
            $state.go("areas");
        }
        $scope.goToTransfer = function () {
            $state.go("products");
        }
    }

})();