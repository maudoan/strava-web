(function() {
    'use strict';

    angular
        .module('erpApp')
        .factory('Log', Log);

    Log.$inject = ['$http', 'HOST_GW'];

    function Log ($http, HOST_GW) {
        return {
            getAll: getAll,
            create: create,
            getOne: getOne,
            getPage: getPage,
            getPageFull:getPageFull,
            getPageSimple: getPageSimple,
            update: update,
            deleteOne: deleteOne,
            deleteMany: deleteMany,
            searchFullInformation: searchFullInformation,
            getFull:getFull,
            download: download
        };

        function getFull(id){
            return $http.get(HOST_GW+'/api/logs/get-full/' + id).then(function(response) {
                return response.data;
            });
        }

        function getAll() {
            return $http.get(HOST_GW+'/api/logs').then(function(response) {
                return response.data;
            });
        }

        function create(qrCode) {
            return $http.post(HOST_GW+'/api/logs', qrCode).then(function(response) {
                return response.data;
            });
        }

        function getPage(params) {
            return $http.get(HOST_GW+'/api/logs/search?' + params).then(function (response) {
                return response;
            });
        }

        function getPageFull(params) {
            return $http.get(HOST_GW + '/api/logs/search-full?' + params).then(function (response) {
                return response;
            });
        }

        function getPageSimple(params) {
            return $http.get(HOST_GW+'/api/logs/search-simple?' + params).then(function (response) {
                return response;
            });
        }

        function update(unitType) {
            return $http.put(HOST_GW+'/api/logs/' + unitType.id, unitType).then(function(response) {
                return response.data;
            });
        }

        function deleteOne(id) {
            return $http.delete(HOST_GW+'/api/logs/' + id).then(function(response) {
                return response.data;
            });
        }

        function deleteMany(ids) {
            return $http.post(HOST_GW+'/api/logs/batch-delete', ids).then(function(response) {
                return response.data;
            });
        }

        function getOne(id){
            return $http.get(HOST_GW+'/api/logs/' + id).then(function(response) {
                return response.data;
            });
        }

        function searchFullInformation(params) {
            return $http.get(HOST_GW+'/api/logs/search-full-information?' + params).then(function (response) {
                return response;
            });
        }

        function download(log) {
            return $http.post(HOST_GW+'/api/logs/download', log).then(function(response) {
                return response.data;
            });
        }
    }
})();
