(function() {
    'use strict';

    angular
        .module('erpApp')
        .factory('AutomaticSchedule', AutomaticSchedule);

    AutomaticSchedule.$inject = ['$http','HOST_GW'];

    function AutomaticSchedule ($http,HOST_GW) {
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
            deactivate:deactivate
        };

        return service;

        function getAll() {
            return $http.get(HOST_GW + '/api/automatic-schedules/search?query=&page=0&size=10000').then(function (response) {
                return response.data;
            });
        }

        function create(ot) {
            return $http.post(HOST_GW + '/api/automatic-schedules',ot).then(function(response) {
                return response.data;
            });
        }

        function getOne(id) {
            return $http.get(HOST_GW + '/api/automatic-schedules/' +id).then(function (response) {
                return response.data;
            });
        }

        function getFull(id) {
            return $http.get(HOST_GW + '/api/automatic-schedules/get-full/' +id).then(function (response) {
                return response.data;
            });
        }

        function getPage(params) {
            return $http.get(HOST_GW + '/api/automatic-schedules/search?' + params).then(function (response) {
                return response;
            });
        }

        function update(ot) {
            return $http.put(HOST_GW + '/api/automatic-schedules/' + ot.id, ot).then(function(response) {
                return response.data;
            });
        }

        function deleteRecord(ids) {
            return $http.post(HOST_GW + '/api/automatic-schedules/batch-delete', ids).then(function(response) {
                return response.data;
            });
        }

        function deleteOne(id){
            return $http.delete(HOST_GW + '/api/automatic-schedules/'+ id).then(function(response) {
                return response.data;
            });
        }

        function activate(id) {
            return $http.get(HOST_GW + '/api/automatic-schedules/activate?id=' + id).then(function(response) {
                return response.data;
            });
        }

        function deactivate(id) {
            return $http.get(HOST_GW + '/api/automatic-schedules/deactivate?id=' +id).then(function(response) {
                return response.data;
            });
        }
    }
})();
