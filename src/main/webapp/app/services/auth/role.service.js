(function() {
    'use strict';

    angular
        .module('erpApp')
        .factory('Role', Role);

    Role.$inject = ['$http','HOST_GW'];

    function Role ($http,HOST_GW) {
        var service = {
            getAll: getAll,
            create: create,
            getPage: getPage,
            getOne: getOne,
            update: update,
            deleteOne: deleteOne,
            deleteMany: deleteMany,
            getFullInformation: getFullInformation
        };

        return service;

        function getAll() {
            return $http.get(HOST_GW + '/api/roles/search?query=&size=1000').then(function(response) {
                return response.data;
            });
        }

        function create(role) {
            return $http.post(HOST_GW + '/api/roles', role).then(function(response) {
                return response.data;
            });
        }

        function getPage(params) {
            return $http.get(HOST_GW + '/api/roles/search?' + params).then(function (response) {
                return response;
            });
        }

        function getOne(id) {
            return $http.get(HOST_GW + '/api/roles/'+id).then(function(response) {
                return response.data;
            });
        }

        function update(role) {
            return $http.put(HOST_GW + '/api/roles/' + role.id, role).then(function(response) {
                return response.data;
            });
        }

        function deleteOne(id) {
            return $http.delete(HOST_GW + '/api/roles/' + id).then(function(response) {
                return response.data;
            });
        }

        function deleteMany(ids) {
            return $http.post(HOST_GW + '/api/roles/batch-delete', ids).then(function(response) {
                return response.data;
            });
        }

        function getFullInformation(id) {
            return $http.get(HOST_GW + '/api/roles/get-full-information/'+id).then(function(response) {
                return response.data;
            });
        }
    }
})();
