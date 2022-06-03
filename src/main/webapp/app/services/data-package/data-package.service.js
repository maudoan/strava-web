(function() {
    'use strict';

    angular
        .module('erpApp')
        .factory('DataPackage', DataPackage);

    DataPackage.$inject = ['$http','HOST_GW'];

    function DataPackage ($http,HOST_GW) {
        var service = {
            getAll: getAll,
            create: create,
            getPage: getPage,
            getFullInfo: getFullInfo,
            getOne: getOne,
            update:update,
            deleteRecord:deleteRecord,
            deleteOne:deleteOne,
            activate:activate,
            deactivate:deactivate,
            deactivateRecords:deactivateRecords
        };

        return service;
        function getAll() {
            return $http.get(HOST_GW + '/api/service-packages/search?query=&page=0&size=10000').then(function (response) {
                return response.data;
            });
        }

        function create(ot) {
            return $http.post(HOST_GW + '/api/service-packages',ot).then(function(response) {
                return response.data;
            });
        }

        function getOne(id) {
            return $http.get(HOST_GW + '/api/service-packages/' +id).then(function (response) {
                return response.data;
            });
        }

        function getFullInfo(id) {
            return $http.get(HOST_GW + '/api/service-packages/' +id + '/get-full-info').then(function (response) {
                return response.data;
            });
        }

        function getPage(params) {
            return $http.get(HOST_GW + '/api/service-packages/operator-search?' + params).then(function (response) {
                return response;
            });
        }

        function update(ot) {
            return $http.put(HOST_GW + '/api/service-packages/' + ot.id, ot).then(function(response) {
                return response.data;
            });
        }

        function deleteRecord(ids) {
            return $http.post(HOST_GW + '/api/service-packages/batch-delete', ids).then(function(response) {
                return response.data;
            });
        }

        function deleteOne(id){
            return $http.delete(HOST_GW + '/api/service-packages/'+ id).then(function(response) {
                return response.data;
            });
        }
        
        function activate(id) {
            return $http.get(HOST_GW +'/api/service-packages/activate?id=' + id).then(function(response) {
                return response.data;
            });
        }

        function deactivate(id) {
            return $http.get(HOST_GW +'/api/service-packages/deactivate?id=' + id).then(function(response) {
                return response.data;
            });
        }
        
        function deactivateRecords(ids) {
            return $http.post(HOST_GW + '/api/service-packages/batch-deactivate', ids).then(function(response) {
                return response.data;
            });
        }
    }
})();
