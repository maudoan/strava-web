(function() {
    'use strict';

    angular
        .module('erpApp')
        .factory('Device', Device);

    Device.$inject = ['$http','HOST_GW'];

    function Device ($http,HOST_GW) {
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
            control:control,
            switchMode:switchMode,
            getGwInArea:getGwInArea,
            refresh:refresh,
            searchFull: searchFull
        };

        return service;
        function refresh(deviceId) {
            return $http.get(HOST_GW + '/api/devices/refresh?id='+deviceId).then(function(response) {
                return response.data;
            });
        }
        function getGwInArea(areaId) {
            return $http.get(HOST_GW + '/api/devices/get-gw-in-area?areaId='+areaId).then(function(response) {
                return response.data;
            });
        }
        function switchMode(groupId,mode) {
            return $http.get(HOST_GW + '/api/devices/switch-mode?groupId='+groupId+"&mode="+mode).then(function(response) {
                return response.data;
            });
        }

        function control(code,state) {
            return $http.get(HOST_GW + '/api/devices/control?code='+code+"&state="+state).then(function(response) {
                return response.data;
            });
        }

        function getAll() {
            return $http.get(HOST_GW + '/api/devices/search?query=&page=0&size=10000').then(function (response) {
                return response.data;
            });
        }

        function create(ot) {
            return $http.post(HOST_GW + '/api/devices',ot).then(function(response) {
                return response.data;
            });
        }

        function getOne(id) {
            return $http.get(HOST_GW + '/api/devices/' +id).then(function (response) {
                return response.data;
            });
        }

        function getFull(id) {
            return $http.get(HOST_GW + '/api/devices/get-full/' +id).then(function (response) {
                return response.data;
            });
        }

        function getPage(params) {
            return $http.get(HOST_GW + '/api/devices/search?' + params).then(function (response) {
                return response;
            });
        }

        function update(ot) {
            return $http.put(HOST_GW + '/api/devices/' + ot.id, ot).then(function(response) {
                return response.data;
            });
        }

        function deleteRecord(ids) {
            return $http.post(HOST_GW + '/api/devices/batch-delete', ids).then(function(response) {
                return response.data;
            });
        }

        function deleteOne(id){
            return $http.delete(HOST_GW + '/api/devices/'+ id).then(function(response) {
                return response.data;
            });
        }

        function activate(id) {
            return $http.get(HOST_GW + '/api/devices/activate?id=' + id).then(function(response) {
                return response.data;
            });
        }

        function deactivate(id) {
            return $http.get(HOST_GW + '/api/devices/deactivate?id=' +id).then(function(response) {
                return response.data;
            });
        }

        function searchFull(params) {
            return $http.get(HOST_GW + '/api/devices/search-full?' + params).then(function (response) {
                return response;
            });
        }
    }
})();
