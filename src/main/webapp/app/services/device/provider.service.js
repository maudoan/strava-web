(function() {
    'use strict';

    angular
        .module('erpApp')
        .factory('Provider', Provider);

    Provider.$inject = ['$http','HOST_GW'];

    function Provider ($http,HOST_GW) {
        var service = {
            getAll: getAll,
            create: create,
            getPage: getPage,
            getFullInfo: getFullInfo,
            getOne: getOne,
            update: update,
            deleteRecord: deleteRecord,
            deleteOne: deleteOne
        };

        return service;
        function getAll() {
            return $http.get(HOST_GW + '/api/providers/search?query=&page=0&size=10000').then(function (response) {
                return response.data;
            });
        }

        function create(ot) {
            return $http.post(HOST_GW + '/api/providers',ot).then(function(response) {
                return response.data;
            });
        }

        function getOne(id) {
            return $http.get(HOST_GW + '/api/providers/' +id).then(function (response) {
                return response.data;
            });
        }

        function getFullInfo(id) {
            return $http.get(HOST_GW + '/api/providers/' +id + '/get-full-info').then(function (response) {
                return response.data;
            });
        }

        function getPage(params) {
            return $http.get(HOST_GW + '/api/providers/search?' + params).then(function (response) {
                return response;
            });
        }

        function update(ot) {
            return $http.put(HOST_GW + '/api/providers/' + ot.id, ot).then(function(response) {
                return response.data;
            });
        }

        function deleteRecord(ids) {
            return $http.post(HOST_GW + '/api/providers/batch-delete', ids).then(function(response) {
                return response.data;
            });
        }

        function deleteOne(id){
            return $http.delete(HOST_GW + '/api/providers/'+ id).then(function(response) {
                return response.data;
            });
        }
    }
})();
