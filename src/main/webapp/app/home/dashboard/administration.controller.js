(function(){
    'use strict';
    angular.module('erpApp')
        .controller('AdministrationController', AdministrationController);

    AdministrationController.$inject = ['$rootScope','$scope','$state','$stateParams', 'AlertService','$translate','variables', 'apiData', '$http', 'ErrorHandle', '$window', 'Dashboard'];
    function AdministrationController($rootScope,$scope, $state,$stateParams, AlertService, $translate, variables, apiData, $http, ErrorHandle, $window, Dashboard) {
        $scope.goToUser = function () {
            $state.go("users");
        }
        $scope.goToRole = function () {
            $state.go("roles");
        }
        $scope.goToPrivilege = function () {
            $state.go("privileges");
        }
        $scope.goToNotification = function () {
            $state.go("notification-setting");
        }
        $scope.goToLog = function () {
            $state.go("logs-view");
        }
        $scope.goToOrganization = function () {
            $state.go("organizations");
        };
    }

})();