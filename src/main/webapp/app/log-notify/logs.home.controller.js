(function(){
    'use strict';
    angular.module('erpApp')
        .controller('LogsHomeController', LogsHomeController);

    LogsHomeController.$inject = [
        '$rootScope',
        '$scope',
        '$state',
        'AlertService',
        '$translate',
        'apiData',
        '$http',
        'ErrorHandle',
        '$window',
        'HistoryService'];
    function LogsHomeController($rootScope, $scope, $state, AlertService, $translate, apiData, $http, ErrorHandle, $window,HistoryService) {

        console.log("WELCOME TO LOGS!");

        /*      $scope.objectType = [
                  {
                      'transfer':'transfer'
                  }

              ]*/
        $scope.totalLog = [];
        $scope.page = 0;
        getByObjectType();
        function getByObjectType() {
            return $http.get(HOST_GW + '/api/audit-logs/search?query=objectType==Transfer,objectType==Inventory&page='+ $scope.page + '&size=10&sort=id,desc' ).then(function (response) {
                $scope.logs = response.data;
                $scope.page += 1;
                $scope.totalLog.push($scope.logs);
            })
        }
        $scope.showMore = function () {
            getByObjectType();
        }
    }

})();