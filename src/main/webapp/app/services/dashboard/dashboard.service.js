(function() {
    'use strict';

    angular
        .module('erpApp')
        .factory('Dashboard', Dashboard);

    Dashboard.$inject = ['$http', 'HOST_GW'];

    function Dashboard ($http, HOST_GW) {
        var service = {
            getFinalProductAvailable: getFinalProductAvailable,
            getTransfersCount: getTransfersCount
        };

        return service;

        function getFinalProductAvailable() {
            return $http.get(HOST_GW + '/api/dashboard/final-product-available').then(function(response) {
                return response.data;
            });
        }

        function getTransfersCount(query) {
            return $http.get(HOST_GW + '/api/dashboard/transfers-count?' + query).then(function(response) {
                return response.data;
            });
        }
    }
})();
