(function() {
    'use strict';

    angular
        .module('erpApp')
        .factory('DeviceModel', DeviceModel);

    DeviceModel.$inject = ['$http','HOST_GW'];

    function DeviceModel ($http,HOST_GW) {
        var service = {
            getAll: getAll,
            create: create,
            getPage: getPage,
            getFullInfo: getFullInfo,
            getOne: getOne,
            update: update,
            deleteRecord: deleteRecord,
            deleteOne: deleteOne,
            searchFull: searchFull
        };

        return service;
        function getAll() {
            return $http.get(HOST_GW + '/api/device-models/search?query=&page=0&size=10000').then(function (response) {
                return response.data;
            });
        }

        function create(ot) {
            return $http.post(HOST_GW + '/api/device-models',ot).then(function(response) {
                return response.data;
            });
        }

        function getOne(id) {
            return $http.get(HOST_GW + '/api/device-models/' +id).then(function (response) {
                return response.data;
            });
        }

        function getFullInfo(id) {
            return $http.get(HOST_GW + '/api/device-models/' +id + '/get-full-info').then(function (response) {
                return response.data;
            });
        }

        function getPage(params) {
            return $http.get(HOST_GW + '/api/device-models/search?' + params).then(function (response) {
                return response;
            });
        }

        function update(ot) {
            return $http.put(HOST_GW + '/api/device-models/' + ot.id, ot).then(function(response) {
                return response.data;
            });
        }

        function deleteRecord(ids) {
            return $http.post(HOST_GW + '/api/device-models/batch-delete', ids).then(function(response) {
                return response.data;
            });
        }

        function deleteOne(id){
            return $http.delete(HOST_GW + '/api/device-models/'+ id).then(function(response) {
                return response.data;
            });
        }

        function searchFull(params) {
            return $http.get(HOST_GW + '/api/device-models/search-full?' + params).then(function (response) {
                return response;
            });
        }
    }
})();
