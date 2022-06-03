(function(){
    'use strict';
    angular.module('erpApp')
        .controller('MonitoringManagerController', MonitoringManagerController);

    MonitoringManagerController.$inject = ['$rootScope', '$scope', '$state'];
    function MonitoringManagerController($rootScope, $scope, $state) {
        $scope.goToCamera = function () {
            $state.go("cameras");
        };
    }
})();