(function() {
    'use strict';

    angular
        .module('erpApp')
        .factory('Uom', Uom);

    Uom.$inject = ['$http','HOST_GW'];

    function Uom ($http,HOST_GW) {
        var service = {
            current : current,
            getAll: getAll,
            create: create,
            getOne: getOne,
            getPage: getPage,
            getPageFull: getPageFull,
            update: update,
            deleteOne: deleteOne,
            deleteMany: deleteMany,
            activate:activate,
            deactivate:deactivate,
            importExcel: importExcel,
            searchFullInformation: searchFullInformation,
            getFullInformation: getFullInformation
        };

        return service;

        function current() {

            return $http.get(HOST_GW+'/api/uoms/current').then(function(response) {
                return response.data;
            });
        }

        function getAll() {
            return $http.get(HOST_GW+'/api/uoms').then(function(response) {
                return response.data;
            });
        }

        function create(unitType) {
            return $http.post(HOST_GW+'/api/uoms', unitType).then(function(response) {
                return response.data;
            });
        }

        function getPage(params) {
            return $http.get(HOST_GW+'/api/uoms/search?' + params).then(function (response) {
                return response;
            });
        }

        function getPageFull(params) {
            return $http.get(HOST_GW + '/api/uoms/search-full?' + params).then(function (response) {
                return response;
            });
        }

        function update(unitType) {
            return $http.put(HOST_GW+'/api/uoms/' + unitType.id, unitType).then(function(response) {
                return response.data;
            });
        }

        function deleteOne(id) {
            return $http.delete(HOST_GW+'/api/uoms/' + id).then(function(response) {
                return response.data;
            });
        }

        function deleteMany(ids) {
            return $http.post(HOST_GW+'/api/uoms/batch-delete', ids).then(function(response) {
                return response.data;
            });
        }

        function activate(id) {
            return $http.get(HOST_GW+'/api/uoms/activate?id=' + id).then(function(response) {
                return response.data;
            });
        }

        function deactivate(id) {
            return $http.get(HOST_GW+'/api/uoms/deactivate?id=' +id).then(function(response) {
                return response.data;
            });
        }

        function getOne(id){
            return $http.get(HOST_GW+'/api/uoms/' + id).then(function(response) {
                return response.data;
            });
        }

        function importExcel(file, model, organizationId) {
            var fd = new FormData();
            fd.append('file', file);
            fd.append('model', model);
            fd.append('organizationId', organizationId);

            return $http.post(HOST_GW+'/api/uoms/upload', fd,{
                transformRequest: angular.identity,
                headers: {'Content-Type': undefined}
            }).then(function(response) {
                return response.data;
            });
        }

        function searchFullInformation(params) {
            return $http.get(HOST_GW+'/api/uoms/search-full-information?' + params).then(function (response) {
                return response;
            });
        }

        function getFullInformation(id){
            return $http.get(HOST_GW+'/api/uoms/get-full-information/' + id).then(function(response) {
                return response.data;
            });
        }
    }
})();
