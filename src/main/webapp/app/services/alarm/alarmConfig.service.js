(function() {
    'use strict';

    angular
        .module('erpApp')
        .factory('AlarmConfig', AlarmConfig);

    AlarmConfig.$inject = ['$http', 'HOST_GW'];

    function AlarmConfig ($http, HOST_GW) {
        var service = {
            getAll: getAll,
            create: create,
            getPage: getPage,
            getOne: getOne,
            getFull: getFull,
            getPageFull: getPageFull,
            update: update,
            deleteOne: deleteOne,
            deleteMany: deleteMany,
            //getPageFullInformation:getPageFullInformation
        };

        return service;

        function getAll() {
            return $http.get(HOST_GW + '/api/alarm-config/search?query=&size=1000').then(function(response) {
                return response.data;
            });
        }

        function create(role) {
            return $http.post(HOST_GW + '/api/alarm-config', role).then(function(response) {
                return response.data;
            });
        }

        function getPage(params) {
            return $http.get(HOST_GW + '/api/alarm-config/search?' + params).then(function (response) {
                return response;
            });
        }

        function getPageFull(params) {
            return $http.get(HOST_GW + '/api/alarm-config/search-full?' + params).then(function (response) {
                return response;
            });
        }

        /*function getPageFullInformation(params) {
            return $http.get(HOST_GW + '/api/alarm-config/search-full-information?' + params).then(function (response) {
                return response;
            });
        }*/

        function getOne(id) {
            return $http.get(HOST_GW + '/api/alarm-config/'+id).then(function(response) {
                return response.data;
            });
        }

        function getFull(id) {
            return $http.get(HOST_GW + '/api/alarm-config/get-full/'+id).then(function(response) {
                return response.data;
            });
        }

        function update(role) {
            return $http.put(HOST_GW + '/api/alarm-config/' + role.id, role).then(function(response) {
                return response.data;
            });
        }

        function deleteOne(id) {
            return $http.delete(HOST_GW + '/api/alarm-config/' + id).then(function(response) {
                return response.data;
            });
        }

        function deleteMany(ids) {
            return $http.post(HOST_GW + '/api/alarm-config/batch-delete', ids).then(function(response) {
                return response.data;
            });
        }

       

        
    }
})();
