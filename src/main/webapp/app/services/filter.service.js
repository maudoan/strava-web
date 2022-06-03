(function() {
    'use strict';

    angular
        .module('erpApp')
        .factory('FilterService', FilterService);

    FilterService.$inject = ['$http'];

    function FilterService ($http) {
        var service = {
            getAll: getAll,
            create: create,
            getPage: getPage,
            getOne: getOne,
            update:update,
            deleteRecord:deleteRecord,
            deleteOne:deleteOne,
            activate:activate,
            deactivate:deactivate,
            countByNameAndModel: countByNameAndModel,
            findByNameAndModel: findByNameAndModel,
            getReference:getReference
        };

        return service;

        function getAll() {
            return $http.get(HOST_GW + '/api/filters').then(function(response) {
                return response.data;
            });
        }

        function create(ot) {
            return $http.post(HOST_GW + '/api/filters',ot).then(function(response) {
                return response.data;
            });
        }

        function getOne(id) {
            return $http.get(HOST_GW + '/api/filters/' +id).then(function (response) {
                return response.data;
            });
        }

        function getPage(params) {
            return $http.get(HOST_GW + '/api/filters/search?' + params).then(function (response) {
                return response;
            });
        }

        function update(ot) {
            return $http.put(HOST_GW + '/api/filters/' + ot.id, ot).then(function(response) {
                return response.data;
            });
        }

        function deleteRecord(ids) {
            return $http.post(HOST_GW + '/api/filters/batch-delete', ids).then(function(response) {
                return response.data;
            });
        }

        function deleteOne(id){
            return $http.delete(HOST_GW + '/api/filters/'+ id).then(function(response) {
                return response.data;
            });
        }

        function activate(ids) {
            return $http.post(HOST_GW + '/api/filters/activate', ids).then(function(response) {
                return response.data;
            });
        }

        function deactivate(ids) {
            return $http.post(HOST_GW + '/api/filters/deactivate', ids).then(function(response) {
                return response.data;
            });
        }

        function countByNameAndModel(name, model) {
            return $http.get(HOST_GW + '/api/filters/countByNameAndModel?name=' + name + '&model=' + model).then(function(response) {
                return response.data;
            });
        }

        function findByNameAndModel(name, model) {
            return $http.get(HOST_GW + '/api/filters/findByNameAndModel?name=' + name + '&model=' + model).then(function(response) {
                return response.data;
            });
        }

        function getReference() {
            return $http.get(HOST_GW + '/api/transfer-report/current').then(function (response) {
                return response.data.generatedSequence;
            });
        }
    }
})();
