(function() {
    'use strict';

    angular
        .module('erpApp')
        .factory('Policy', Policy);

    Policy.$inject = ['$http','HOST_GW'];

    function Policy ($http,HOST_GW) {
        var service = {
            getAll: getAll,
            create: create,
            getPage: getPage,
            getFullInfo: getFullInfo,
            getOne: getOne,
            update: update,
            deleteRecord: deleteRecord,
            deleteOne: deleteOne,
            searchFull:searchFull,
            activate:activate,
            deactivate:deactivate,
            getPolicyHistory:getPolicyHistory,
            checkUsedPolicy:checkUsedPolicy
        };

        return service;
        function getAll() {
            return $http.get(HOST_GW + '/api/policy/search?query=&page=0&size=10000').then(function (response) {
                return response.data;
            });
        }

        function create(ot) {
            return $http.post(HOST_GW + '/api/policy',ot).then(function(response) {
                return response.data;
            });
        }

        function getOne(id) {
            return $http.get(HOST_GW + '/api/policy/' +id).then(function (response) {
                return response.data;
            });
        }

        function getFullInfo(id) {
            return $http.get(HOST_GW + '/api/policy/' +id + '/get-full-info').then(function (response) {
                return response.data;
            });
        }

        function getPage(params) {
            return $http.get(HOST_GW + '/api/policy/search?' + params).then(function (response) {
                return response;
            });
        }

        function update(ot) {
            return $http.put(HOST_GW + '/api/policy/' + ot.id, ot).then(function(response) {
                return response.data;
            });
        }

        function deleteRecord(ids) {
            return $http.post(HOST_GW + '/api/policy/batch-delete', ids).then(function(response) {
                return response.data;
            });
        }

        function deleteOne(id){
            return $http.delete(HOST_GW + '/api/policy/'+ id).then(function(response) {
                return response.data;
            });
        }
        
        function activate(id) {
            return $http.get(HOST_GW + '/api/policy/activate?id=' + id).then(function(response) {
                return response.data;
            });
        }

        function deactivate(id) {
            return $http.get(HOST_GW + '/api/policy/deactivate?id=' +id).then(function(response) {
                return response.data;
            });
        }

        function searchFull(params) {
            return $http.get(HOST_GW + '/api/policy/search-full?' + params).then(function (response) {
                return response;
            });
        }
        
        function getPolicyHistory(params,input) {
            return $http.post(HOST_GW + '/api/policy/history?' + params,input).then(function (response) {
                return response;
            });
        }

        function checkUsedPolicy(params) {
            return $http.get(HOST_GW + '/api/policy/check-used-policy?' + params).then(function (response) {
                return response;
            });
        }

    }
})();
