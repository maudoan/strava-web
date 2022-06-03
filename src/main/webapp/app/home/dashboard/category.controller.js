(function(){
    'use strict';
    angular.module('erpApp')
        .controller('CategoryController', CategoryController);

    CategoryController.$inject = ['$rootScope','$scope','$state','$stateParams', 'AlertService','$translate','variables', 'apiData', '$http', 'ErrorHandle', '$window', 'Dashboard'];
    function CategoryController($rootScope,$scope, $state,$stateParams, AlertService, $translate, variables, apiData, $http, ErrorHandle, $window, Dashboard) {
        $scope.goToGpc = function () {
            $state.go("gpc");
        }
        $scope.goToProduct = function () {
            $state.go("products");
        }
        $scope.goToLocation = function () {
            $state.go("locations");
        }
        $scope.goToCurrency = function () {
            $state.go("currency");
        }
        $scope.goToUomType = function () {
            $state.go("uomTypes");
        }
        $scope.goToUom = function () {
            $state.go("uoms");
        };
    }

})();