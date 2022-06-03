(function() {
    'use strict';

    angular
        .module('erpApp')
        .factory('AutomaticControl', AutomaticControl);

    AutomaticControl.$inject = ['$http','HOST_GW'];

    function AutomaticControl ($http,HOST_GW) {
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
            getPageSimple: getPageSimple
        };

        return service;

        function getAll() {
            return $http.get(HOST_GW + '/api/automatic-controls/search?query=&page=0&size=10000').then(function (response) {
                return response.data;
            });
        }

        function create(ot) {
            return $http.post(HOST_GW + '/api/automatic-controls',ot).then(function(response) {
                return response.data;
            });
        }

        function getOne(id) {
            return $http.get(HOST_GW + '/api/automatic-controls/' +id).then(function (response) {
                return response.data;
            });
        }

        function getFull(id) {
            return $http.get(HOST_GW + '/api/automatic-controls/get-full/' +id).then(function (response) {
                return response.data;
            });
        }

        function getPage(params) {
            return $http.get(HOST_GW + '/api/automatic-controls/search?' + params).then(function (response) {
                return response;
            });
        }

        function update(ot) {
            return $http.put(HOST_GW + '/api/automatic-controls/' + ot.id, ot).then(function(response) {
                return response.data;
            });
        }

        function deleteRecord(ids) {
            return $http.post(HOST_GW + '/api/automatic-controls/batch-delete', ids).then(function(response) {
                return response.data;
            });
        }

        function deleteOne(id){
            return $http.delete(HOST_GW + '/api/automatic-controls/'+ id).then(function(response) {
                return response.data;
            });
        }

        function activate(id) {
            return $http.get(HOST_GW + '/api/automatic-controls/activate?id=' + id).then(function(response) {
                return response.data;
            });
        }

        function deactivate(id) {
            return $http.get(HOST_GW + '/api/automatic-controls/deactivate?id=' +id).then(function(response) {
                return response.data;
            });
        }

        function getPageSimple(params) {
            return $http.get(HOST_GW + '/api/automatic-controls/search-simple?' + params).then(function (response) {
                return response;
            });
        }
    }
})();
