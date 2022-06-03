(function(){
    'use strict';
    angular.module('erpApp')
        .controller('DashboardController', DashboardController);

    DashboardController.$inject = ['$rootScope','$scope','$state', 'AlertService','$translate',
        '$http', 'ErrorHandle', '$window', 'Principal'];
    function DashboardController($rootScope,$scope, $state, AlertService, $translate,
                                 $http, ErrorHandle, $window, Principal) {
        $scope.data = [];
        $scope.tab = 0;

        $scope.clickTab = function (tab) {
            $scope.tab = tab;
        };

        if(Principal.hasAnyAuthority(["ROLE_SYSTEM_ADMIN", "Customer_View"])){
            $state.go('customers');
        }
    }

})();