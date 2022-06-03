(function() {
    'use strict';

    angular
        .module('erpApp')
        .factory('ServicePayment', ServicePayment);

    ServicePayment.$inject = ['$http','HOST_GW'];

    function ServicePayment ($http,HOST_GW) {
        var service = {
            getAll: getAll,
            create: create,
            change: change,
            deactivate: deactivate,
            getPage: getPage,
            getOne: getOne,
            customSearch: customSearch
        };

        return service;
        function getAll() {
            return $http.get(HOST_GW + '/api/service-payments/search?query=&page=0&size=10000').then(function (response) {
                return response.data;
            });
        }

        function create(ot) {
            return $http.post(HOST_GW + '/api/service-payments',ot).then(function(response) {
                return response.data;
            });
        }

        function change(ot) {
            return $http.post(HOST_GW + '/api/service-payments/changes',ot).then(function(response) {
                return response.data;
            });
        }

        function deactivate(id) {
            return $http.get(HOST_GW + '/api/service-payments/deactivate?id=' + id).then(function(response) {
                return response.data;
            });
        }

        function getOne(id) {
            return $http.get(HOST_GW + '/api/service-payments/' +id).then(function (response) {
                return response.data;
            });
        }

        function getPage(params) {
            return $http.get(HOST_GW + '/api/service-payments/search?' + params).then(function (response) {
                return response;
            });
        }

        function customSearch(params, searchInfo) {
            return $http.post(HOST_GW + '/api/service-payments/custom-search?' + params, searchInfo).then(function (response) {
                return response;
            });
        }
    }
})();
