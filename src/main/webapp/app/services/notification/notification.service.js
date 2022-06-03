(function() {
    'use strict';

    angular
        .module('erpApp')
        .factory('Notification', Notification);

    Notification.$inject = ['$http', 'HOST_GW'];

    function Notification ($http, HOST_GW) {
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
            return $http.get(HOST_GW+'/api/notifications/get-full/' + id).then(function(response) {
                return response.data;
            });
        }

        function getAll() {
            return $http.get(HOST_GW+'/api/notifications').then(function(response) {
                return response.data;
            });
        }

        function create(qrCode) {
            return $http.post(HOST_GW+'/api/notifications', qrCode).then(function(response) {
                return response.data;
            });
        }

        function getPage(params) {
            return $http.get(HOST_GW+'/api/notifications/search?' + params).then(function (response) {
                return response;
            });
        }

        function getPageFull(params) {
            return $http.get(HOST_GW + '/api/notifications/search-full?' + params).then(function (response) {
                return response;
            });
        }

        function getPageSimple(params) {
            return $http.get(HOST_GW+'/api/notifications/search-simple?' + params).then(function (response) {
                return response;
            });
        }

        function update(unitType) {
            return $http.put(HOST_GW+'/api/notifications/' + unitType.id, unitType).then(function(response) {
                return response.data;
            });
        }

        function deleteOne(id) {
            return $http.delete(HOST_GW+'/api/notifications/' + id).then(function(response) {
                return response.data;
            });
        }

        function deleteMany(ids) {
            return $http.post(HOST_GW+'/api/notifications/batch-delete', ids).then(function(response) {
                return response.data;
            });
        }

        function getOne(id){
            return $http.get(HOST_GW+'/api/notifications/' + id).then(function(response) {
                return response.data;
            });
        }

        function searchFullInformation(params) {
            return $http.get(HOST_GW+'/api/notifications/search-full-information?' + params).then(function (response) {
                return response;
            });
        }

        function download(log) {
            return $http.post(HOST_GW+'/api/notifications/download', log).then(function(response) {
                return response.data;
            });
        }
    }
})();
