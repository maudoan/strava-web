(function(){
    'use strict';
    angular.module('erpApp')
        .controller('TraceManagerController', TraceManagerController);

    TraceManagerController.$inject = ['$rootScope','$scope','$state'];
    function TraceManagerController($rootScope,$scope, $state) {
        $scope.goToTraceInfo = function () {
            $state.go("trace-info");
        };
        $scope.goToTraceRequest = function () {
            $state.go("trace-requests");
        };
    }

})();