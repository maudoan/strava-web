(function() {
    'use strict';

    angular
        .module('erpApp')
        .factory('Season', Season);

    Season.$inject = ['$http', 'HOST_GW'];

    function Season ($http, HOST_GW) {
        return {
            current : current,
            getAll: getAll,
            create: create,
            getOne: getOne,
            getFull: getFull,
            getPage: getPage,
            getPageFull: getPageFull,
            update: update,
            deleteOne: deleteOne,
            deleteMany: deleteMany,
            activate:activate,
            deactivate:deactivate,
            finish: finish,
            getInformationByCond: getInformationByCond
        };

        function current() {
            return $http.get(HOST_GW + '/api/seasons/current').then(function(response) {
                return response.data;
            });
        }

        function getAll() {
            return $http.get(HOST_GW + '/api/seasons').then(function(response) {
                return response.data;
            });
        }

        function create(unitType) {
            return $http.post(HOST_GW + '/api/seasons', unitType).then(function(response) {
                return response.data;
            });
        }

        function getPage(params) {
            return $http.get(HOST_GW + '/api/seasons/search?' + params).then(function (response) {
                return response;
            });
        }

        function getPageFull(params) {
            return $http.get(HOST_GW + '/api/seasons/search-full?' + params).then(function (response) {
                return response;
            });
        }

        function update(unitType) {
            return $http.put(HOST_GW + '/api/seasons/' + unitType.id, unitType).then(function(response) {
                return response.data;
            });
        }

        function deleteOne(id) {
            return $http.delete(HOST_GW + '/api/seasons/' + id).then(function(response) {
                return response.data;
            });
        }

        function deleteMany(ids) {
            return $http.post(HOST_GW + '/api/seasons/batch-delete', ids).then(function(response) {
                return response.data;
            });
        }

        function activate(id) {
            return $http.get(HOST_GW + '/api/seasons/activate?id=' + id).then(function(response) {
                return response.data;
            });
        }

        function deactivate(id) {
            return $http.get(HOST_GW + '/api/seasons/deactivate?id=' +id).then(function(response) {
                return response.data;
            });
        }

        function getOne(id){
            return $http.get(HOST_GW + '/api/seasons/' + id).then(function(response) {
                return response.data;
            });
        }

        function getFull(id) {
            return $http.get(HOST_GW + '/api/seasons/get-full/' + id).then(function(response) {
                return response.data;
            });
        }

        function finish(id, season) {
            return $http.post(HOST_GW + '/api/seasons/finish/' + id, season).then(function(response) {
                return response.data;
            });
        }

        function getInformationByCond(organizationId, productInfoIds) {
            return $http.get(HOST_GW + '/api/seasons/get-season-by-procedureInfo?organizationId=' + organizationId + '&productInfoIds=' + '[' + productInfoIds.toString() + ']').then(function (response) {
                return response.data;
            });
        }
    }
})();
