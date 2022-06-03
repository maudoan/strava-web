

(function() {
    'use strict';

    angular
        .module('erpApp')
        .factory('Run', Run);

    Run.$inject = ['$http', 'HOST_GW'];

    function Run ($http, HOST_GW) {
        var service = {
            getRun: getRun,
            getStatistic: getStatistic,
        };

        return service;

        function getRun() {
            return $http.get(HOST_GW + '/api/v1/run').then(function (response) {
                return response;
            });
        }
        function getStatistic(fromDate,toDate) {
            return $http.get(HOST_GW + '/api/v1/statistic?fromDate='+fromDate+"&toDate="+toDate).then(function (response) {
                return response.data;
            });
        }

    }
})();
