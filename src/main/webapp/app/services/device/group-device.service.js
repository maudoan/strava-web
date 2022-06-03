(function() {
    'use strict';

    angular
        .module('erpApp')
        .factory('GroupDevice', GroupDevice);

    GroupDevice.$inject = ['$http','HOST_GW'];

    function GroupDevice ($http,HOST_GW) {
        var service = {
            getAll: getAll,
            create: create,
            getPage: getPage,
            getFull: getFull,
            searchFull: searchFull,
            getOne: getOne,
            update:update,
            deleteRecord:deleteRecord,
            deleteOne:deleteOne,
            activate:activate,
            deactivate:deactivate
        };

        return service;

        function getAll() {
            return $http.get(HOST_GW + '/api/group-devices/search?query=&page=0&size=10000').then(function (response) {
                return response.data;
            });
        }

        function create(ot) {
            return $http.post(HOST_GW + '/api/group-devices',ot).then(function(response) {
                return response.data;
            });
        }

        function getOne(id) {
            return $http.get(HOST_GW + '/api/group-devices/' +id).then(function (response) {
                return response.data;
            });
        }

        function getFull(id) {
            return $http.get(HOST_GW + '/api/group-devices/get-full/' + id).then(function (response) {
                return response.data;
            });
        }

        function getPage(params) {
            return $http.get(HOST_GW + '/api/group-devices/search?' + params).then(function (response) {
                return response;
            });
        }

        function searchFull(params) {
            return $http.get(HOST_GW + '/api/group-devices/search-full?' + params).then(function (response) {
                return response;
            });
        }

        function update(ot) {
            return $http.put(HOST_GW + '/api/group-devices/' + ot.id, ot).then(function(response) {
                return response.data;
            });
        }

        function deleteRecord(ids) {
            return $http.post(HOST_GW + '/api/group-devices/batch-delete', ids).then(function(response) {
                return response.data;
            });
        }

        function deleteOne(id){
            return $http.delete(HOST_GW + '/api/group-devices/'+ id).then(function(response) {
                return response.data;
            });
        }

        function activate(id) {
            return $http.get(HOST_GW + '/api/group-devices/activate?id=' + id).then(function(response) {
                return response.data;
            });
        }

        function deactivate(id) {
            return $http.get(HOST_GW + '/api/group-devices/deactivate?id=' +id).then(function(response) {
                return response.data;
            });
        }
    }
})();
