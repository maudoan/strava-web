(function(){
    'use strict';
    angular.module('erpApp')
        .controller('PrivilegeDetailController',PrivilegeDetailController);

    PrivilegeDetailController.$inject = ['$rootScope','$scope','$state','$stateParams','Privilege','AlertService','$translate'];
    function PrivilegeDetailController($rootScope,$scope, $state, $stateParams, Privilege, AlertService,$translate) {
        var vm = this;

        $scope.privilege = {};
        Privilege.getOne($stateParams.privilegeName).then(function (data) {
            $scope.privilege = data;
        })
    }

})();