(function() {
    'use strict';

    angular
        .module('erpApp')
        .factory('LogType', LogType);

    LogType.$inject = ['$http', 'HOST_GW'];

    function LogType ($http, HOST_GW) {
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
            return $http.get(HOST_GW+'/api/logTypes/get-full/' + id).then(function(response) {
                return response.data;
            });
        }

        function getAll() {
            return $http.get(HOST_GW+'/api/logTypes').then(function(response) {
                return response.data;
            });
        }

        function create(qrCode) {
            return $http.post(HOST_GW+'/api/logTypes', qrCode).then(function(response) {
                return response.data;
            });
        }

        function getPage(params) {
            return $http.get(HOST_GW+'/api/logTypes/search?' + params).then(function (response) {
                return response;
            });
        }

        function getPageFull(params) {
            return $http.get(HOST_GW + '/api/logTypes/search-full?' + params).then(function (response) {
                return response;
            });
        }

        function getPageSimple(params) {
            return $http.get(HOST_GW+'/api/logTypes/search-simple?' + params).then(function (response) {
                return response;
            });
        }

        function update(unitType) {
            return $http.put(HOST_GW+'/api/logTypes/' + unitType.id, unitType).then(function(response) {
                return response.data;
            });
        }

        function deleteOne(id) {
            return $http.delete(HOST_GW+'/api/logTypes/' + id).then(function(response) {
                return response.data;
            });
        }

        function deleteMany(ids) {
            return $http.post(HOST_GW+'/api/logTypes/batch-delete', ids).then(function(response) {
                return response.data;
            });
        }

        function getOne(id){
            return $http.get(HOST_GW+'/api/logTypes/' + id).then(function(response) {
                return response.data;
            });
        }

        function searchFullInformation(params) {
            return $http.get(HOST_GW+'/api/logTypes/search-full-information?' + params).then(function (response) {
                return response;
            });
        }

        function download(log) {
            return $http.post(HOST_GW+'/api/logTypes/download', log).then(function(response) {
                return response.data;
            });
        }
    }
})();
