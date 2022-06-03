(function() {
    'use strict';

    angular
        .module('erpApp')
        .factory('Area', Area);

    Area.$inject = ['$http','HOST_GW'];

    function Area ($http,HOST_GW) {
        var service = {
            getAll: getAll,
            create: create,
            getPage: getPage,
            getTree: getTree,
            getFullInfo: getFullInfo,
            getOne: getOne,
            update: update,
            deleteRecord: deleteRecord,
            deleteOne: deleteOne,
            searchFull: searchFull,
            importExcel: importExcel
        };

        return service;
        function getAll() {
            return $http.get(HOST_GW + '/api/areas/search?query=&page=0&size=10000').then(function (response) {
                return response.data;
            });
        }

        function create(ot) {
            return $http.post(HOST_GW + '/api/areas',ot).then(function(response) {
                return response.data;
            });
        }

        function getOne(id) {
            return $http.get(HOST_GW + '/api/areas/' +id).then(function (response) {
                return response.data;
            });
        }

        function getFullInfo(id) {
            return $http.get(HOST_GW + '/api/areas/' +id + '/get-full-info').then(function (response) {
                return response.data;
            });
        }

        function getPage(params) {
            return $http.get(HOST_GW + '/api/areas/search?' + params).then(function (response) {
                return response;
            });
        }

        function getTree(ot) {
            return $http.post(HOST_GW + '/api/areas/tree', ot).then(function (response) {
                return response;
            });
        }

        function update(ot) {
            return $http.put(HOST_GW + '/api/areas/' + ot.id, ot).then(function(response) {
                return response.data;
            });
        }

        function deleteRecord(ids) {
            return $http.post(HOST_GW + '/api/areas/batch-delete', ids).then(function(response) {
                return response.data;
            });
        }

        function deleteOne(id){
            return $http.delete(HOST_GW + '/api/areas/'+ id).then(function(response) {
                return response.data;
            });
        }

        function searchFull(params) {
            return $http.get(HOST_GW + '/api/areas/search-full?' + params).then(function (response) {
                return response;
            });
        }

        function importExcel(file) {
            var fd = new FormData();
            fd.append('file', file);
            return $http.post(HOST_GW+'/api/areas/import', fd,{
                transformRequest: angular.identity,
                headers: {'Content-Type': undefined}
            }).then(function(response) {
                return response;
            });
        }
    }
})();


