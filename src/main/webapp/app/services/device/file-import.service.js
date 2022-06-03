(function() {
    'use strict';

    angular
        .module('erpApp')
        .factory('FileImport', FileImport);

    FileImport.$inject = ['$http','HOST_GW'];

    function FileImport ($http,HOST_GW) {
        var service = {
            create: create,
            getPage: getPage,
            getFull: getFull,
            getOne: getOne,
            update:update,
            deleteRecord:deleteRecord,
            deleteOne:deleteOne,
            activate:activate,
            deactivate:deactivate,
            searchFull: searchFull
        };

        return service;

        function create(ot) {
            return $http.post(HOST_GW + '/api/file-imports',ot).then(function(response) {
                return response.data;
            });
        }

        function getOne(id) {
            return $http.get(HOST_GW + '/api/file-imports/' +id).then(function (response) {
                return response.data;
            });
        }

        function getFull(id) {
            return $http.get(HOST_GW + '/api/file-imports/get-full/' +id).then(function (response) {
                return response.data;
            });
        }

        function getPage(params) {
            return $http.get(HOST_GW + '/api/file-imports/search?' + params).then(function (response) {
                return response;
            });
        }

        function update(ot) {
            return $http.put(HOST_GW + '/api/file-imports/' + ot.id, ot).then(function(response) {
                return response.data;
            });
        }

        function deleteRecord(ids) {
            return $http.post(HOST_GW + '/api/file-imports/batch-delete', ids).then(function(response) {
                return response.data;
            });
        }

        function deleteOne(id){
            return $http.delete(HOST_GW + '/api/file-imports/'+ id).then(function(response) {
                return response.data;
            });
        }

        function activate(id) {
            return $http.get(HOST_GW + '/api/file-imports/activate?id=' + id).then(function(response) {
                return response.data;
            });
        }

        function deactivate(id) {
            return $http.get(HOST_GW + '/api/file-imports/deactivate?id=' +id).then(function(response) {
                return response.data;
            });
        }

        function searchFull(params) {
            return $http.get(HOST_GW + '/api/file-imports/search-full?' + params).then(function (response) {
                return response;
            });
        }
    }
})();
