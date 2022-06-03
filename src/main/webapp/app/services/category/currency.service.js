(function() {
    'use strict';

    angular
        .module('erpApp')
        .factory('Currency', Currency);

    Currency.$inject = ['$http', 'HOST_GW'];

    function Currency ($http, HOST_GW) {
        var service = {
            current : current,
            getAll: getAll,
            create: create,
            getOne: getOne,
            getPage: getPage,
            update: update,
            deleteOne: deleteOne,
            deleteMany: deleteMany,
            activate:activate,
            deactivate:deactivate
        };

        return service;

        function current() {
            return $http.get(HOST_GW + '/api/currencies/current').then(function(response) {
                return response.data;
            });
        }

        function getAll() {
            return $http.get(HOST_GW + '/api/currencies').then(function(response) {
                return response.data;
            });
        }

        function create(unitType) {
            return $http.post(HOST_GW + '/api/currencies', unitType).then(function(response) {
                return response.data;
            });
        }

        function getPage(params) {
            return $http.get(HOST_GW + '/api/currencies/search?' + params).then(function (response) {
                return response;
            });
        }

        function update(unitType) {
            return $http.put(HOST_GW + '/api/currencies/' + unitType.id, unitType).then(function(response) {
                return response.data;
            });
        }

        function deleteOne(id) {
            return $http.delete(HOST_GW + '/api/currencies/' + id).then(function(response) {
                return response.data;
            });
        }

        function deleteMany(ids) {
            return $http.post(HOST_GW + '/api/currencies/batch-delete', ids).then(function(response) {
                return response.data;
            });
        }

        function activate(id) {
            return $http.get(HOST_GW + '/api/currencies/activate?id=' + id).then(function(response) {
                return response.data;
            });
        }

        function deactivate(id) {
            return $http.get(HOST_GW + '/api/currencies/deactivate?id=' +id).then(function(response) {
                return response.data;
            });
        }

        function getOne(id){
            return $http.get(HOST_GW + '/api/currencies/' + id).then(function(response) {
                return response.data;
            });
        }
    }
})();
