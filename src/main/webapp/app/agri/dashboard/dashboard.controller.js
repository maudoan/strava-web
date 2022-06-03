(function(){
    'use strict';
    angular.module('erpApp')
        .controller('DashboardController', DashboardController);

    DashboardController.$inject = ['$rootScope','$scope','$state', 'AlertService','$translate',
        '$http', 'ErrorHandle', '$window', 'Principal'];
    function DashboardController($rootScope,$scope, $state, AlertService, $translate,
                                 $http, ErrorHandle, $window, Principal) {
        // get data area
        $scope.tenantId = $window.localStorage.getItem("farmId");
        $scope.data = [];
        $scope.tab = 0;

        $scope.clickTab = function (tab) {
            $scope.tab = tab;
        };

        if($scope.tenantId != null && Principal.hasAnyAuthority(["ROLE_SYSTEM_ADMIN", "ROLE_SYSTEM_USER","ROLE_FARM_ADMIN", "Home_Page_View"])){
            Area.getAreasOverview($scope.tenantId).then(function (data) {
                // convert data
                $scope.data = data.data;
                // convertToList(data.data);
            });
        }

        function convertToList(data){
            if(!data || data.length < 1) return;

            for (var i = 0; i < data.length; i++){
                $scope.data.push(data[i]);
                if(data[i].children && data[i].children.length > 0) {
                    convertToList(data[i].children);
                }
            }
        }

        // ngay du kien
        $scope.getExpectedDay = function (item) {
            if(!item.season) return null;
            if(!item.season.expectedBeginDate || !item.season.expectedFinishDate) return null;

            var diffTime = Math.abs(item.season.expectedFinishDate - item.season.expectedBeginDate);
            return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        };

        $scope.getRealityDay = function (item) {
            if(!item.season) return null;
            if(!item.season.realityBeginDate) return null;
            var date = new Date();
            var dateTime = date.getTime();

            var diffTime = Math.abs(dateTime - item.season.realityBeginDate);
            return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        }
    }

})();