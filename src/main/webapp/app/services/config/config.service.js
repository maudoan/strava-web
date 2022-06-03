(function() {
    'use strict';

    angular
        .module('erpApp')
        .factory('Config', Config);

    Config.$inject = ['$http', 'HOST_GW'];

    function Config ($http, HOST_GW) {
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
            return $http.get(HOST_GW+'/api/configs/get-full/' + id).then(function(response) {
                return response.data;
            });
        }

        function getAll() {
            return $http.get(HOST_GW+'/api/configs').then(function(response) {
                return response.data;
            });
        }

        function create(qrCode) {
            return $http.post(HOST_GW+'/api/configs', qrCode).then(function(response) {
                return response.data;
            });
        }

        function getPage(params) {
            return $http.get(HOST_GW+'/api/configs/search?' + params).then(function (response) {
                return response;
            });
        }

        function getPageFull(params) {
            return $http.get(HOST_GW + '/api/configs/search-full?' + params).then(function (response) {
                return response;
            });
        }

        function getPageSimple(params) {
            return $http.get(HOST_GW+'/api/configs/search-simple?' + params).then(function (response) {
                return response;
            });
        }

        function update(unitType) {
            return $http.put(HOST_GW+'/api/configs/' + unitType.id, unitType).then(function(response) {
                return response.data;
            });
        }

        function deleteOne(id) {
            return $http.delete(HOST_GW+'/api/configs/' + id).then(function(response) {
                return response.data;
            });
        }

        function deleteMany(ids) {
            return $http.post(HOST_GW+'/api/configs/batch-delete', ids).then(function(response) {
                return response.data;
            });
        }

        function getOne(id){
            return $http.get(HOST_GW+'/api/configs/' + id).then(function(response) {
                return response.data;
            });
        }

        function searchFullInformation(params) {
            return $http.get(HOST_GW+'/api/configs/search-full-information?' + params).then(function (response) {
                return response;
            });
        }

        function download(log) {
            return $http.post(HOST_GW+'/api/configs/download', log).then(function(response) {
                return response.data;
            });
        }
    }
})();
