(function() {
    'use strict';

    angular
        .module('erpApp')
        .factory('DeviceImport', DeviceImport);

    DeviceImport.$inject = ['$http','HOST_GW'];

    function DeviceImport ($http,HOST_GW) {
        var service = {
            getAll: getAll,
            create: create,
            getPage: getPage,
            getFull: getFull,
            getOne: getOne,
            update:update,
            deleteRecord:deleteRecord,
            deleteOne:deleteOne,
            activate:activate,
            deactivate:deactivate,
            searchFull: searchFull,
            importExcel: importExcel
        };

        return service;

        function getAll() {
            return $http.get(HOST_GW + '/api/device-imports/search?query=&page=0&size=10000').then(function (response) {
                return response.data;
            });
        }

        function create(ot) {
            return $http.post(HOST_GW + '/api/device-imports',ot).then(function(response) {
                return response.data;
            });
        }

        function getOne(id) {
            return $http.get(HOST_GW + '/api/device-imports/' +id).then(function (response) {
                return response.data;
            });
        }

        function getFull(id) {
            return $http.get(HOST_GW + '/api/device-imports/get-full/' +id).then(function (response) {
                return response.data;
            });
        }

        function getPage(params) {
            return $http.get(HOST_GW + '/api/device-imports/search?' + params).then(function (response) {
                return response;
            });
        }

        function update(ot) {
            return $http.put(HOST_GW + '/api/device-imports/' + ot.id, ot).then(function(response) {
                return response.data;
            });
        }

        function deleteRecord(ids) {
            return $http.post(HOST_GW + '/api/device-imports/batch-delete', ids).then(function(response) {
                return response.data;
            });
        }

        function deleteOne(id){
            return $http.delete(HOST_GW + '/api/device-imports/'+ id).then(function(response) {
                return response.data;
            });
        }

        function activate(id) {
            return $http.get(HOST_GW + '/api/device-imports/activate?id=' + id).then(function(response) {
                return response.data;
            });
        }

        function deactivate(id) {
            return $http.get(HOST_GW + '/api/device-imports/deactivate?id=' +id).then(function(response) {
                return response.data;
            });
        }

        function searchFull(params) {
            return $http.get(HOST_GW + '/api/device-imports/search-full?' + params).then(function (response) {
                return response;
            });
        }

        function importExcel(file) {
            var fd = new FormData();
            fd.append('file', file);
            return $http.post(HOST_GW+'/api/device-imports/import', fd,{
                transformRequest: angular.identity,
                headers: {'Content-Type': undefined}
            }).then(function(response) {
                return response.data;
            });
        }
    }
})();
