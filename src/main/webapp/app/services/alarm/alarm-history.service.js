(function() {
    'use strict';

    angular
        .module('erpApp')
        .factory('AlarmHistory', AlarmHistory);

    AlarmHistory.$inject = ['$http','HOST_GW'];

    function AlarmHistory ($http,HOST_GW) {
        var service = {
            getAll: getAll,
            create: create,
            getPage: getPage,
            getFullInfo: getFullInfo,
            getOne: getOne,
            update:update,
            deleteRecord:deleteRecord,
            deleteOne:deleteOne           
        };

        return service;

        function getAll() {
            return $http.get(HOST_GW + '/api/alarms/search?query=&page=0&size=10000').then(function (response) {
                return response.data;
            });
        }

        function create(ot) {
            return $http.post(HOST_GW + '/api/alarms',ot).then(function(response) {
                console.log(response);
                return response.data;
            });
        }

        function getOne(id) {
            return $http.get(HOST_GW + '/api/alarms/' +id).then(function (response) {
                return response.data;
            });
        }

        function getFullInfo(id) {
            return $http.get(HOST_GW + '/api/alarms/' +id + '/get-full-info').then(function (response) {
                return response.data;
            });
        }

        function getPage(params) {
            return $http.get(HOST_GW + '/api/alarms/search?' + params).then(function (response) {
                return response;
            });
        }

        function update(ot) {
            console.log(ot);
            return $http.put(HOST_GW + '/api/alarms/' + ot.id, ot).then(function(response) {
                return response.data;
            });
        }

        function deleteRecord(ids) {
            return $http.post(HOST_GW + '/api/alarms/batch-delete', ids).then(function(response) {
                return response.data;
            });
        }

        function deleteOne(id){
            return $http.delete(HOST_GW + '/api/alarms/'+ id).then(function(response) {
                return response.data;
            });
        }
    }
})();
