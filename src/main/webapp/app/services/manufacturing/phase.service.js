(function() {
    'use strict';

    angular
        .module('erpApp')
        .factory('Phase', Phase);

    Phase.$inject = ['$http', 'HOST_GW'];

    function Phase ($http, HOST_GW) {
        return {
            current : current,
            getAll: getAll,
            create: create,
            getOne: getOne,
            getFullInfomation: getFullInfomation,
            getPageFullInformation: getPageFullInformation,
            getLastestNotChecked: getLastestNotChecked,
            getPage: getPage,
            update: update,
            deleteOne: deleteOne,
            deleteMany: deleteMany,
            activate:activate,
            deactivate:deactivate,
            getLastestChecked: getLastestChecked
        };

        function current() {
            return $http.get(HOST_GW + '/api/phases/current').then(function(response) {
                return response.data;
            });
        }

        function getAll() {
            return $http.get(HOST_GW + '/api/phases').then(function(response) {
                return response.data;
            });
        }

        function create(unitType) {
            return $http.post(HOST_GW + '/api/phases', unitType).then(function(response) {
                return response.data;
            });
        }

        function getPage(params) {
            return $http.get(HOST_GW + '/api/phases/search?' + params).then(function (response) {
                return response;
            });
        }

        function update(unitType) {
            return $http.put(HOST_GW + '/api/phases/' + unitType.id, unitType).then(function(response) {
                return response.data;
            });
        }

        function deleteOne(id) {
            return $http.delete(HOST_GW + '/api/phases/' + id).then(function(response) {
                return response.data;
            });
        }

        function deleteMany(ids) {
            return $http.post(HOST_GW + '/api/phases/batch-delete', ids).then(function(response) {
                return response.data;
            });
        }

        function activate(id) {
            return $http.get(HOST_GW + '/api/phases/activate?id=' + id).then(function(response) {
                return response.data;
            });
        }

        function deactivate(id) {
            return $http.get(HOST_GW + '/api/phases/deactivate?id=' +id).then(function(response) {
                return response.data;
            });
        }

        function getOne(id){
            return $http.get(HOST_GW + '/api/phases/' + id).then(function(response) {
                return response.data;
            });
        }

        function getFullInfomation(id) {
            return $http.get(HOST_GW + '/api/phases/get-full-information/' + id).then(function(response) {
                return response.data;
            });
        }

        function getPageFullInformation(params) {
            return $http.get(HOST_GW + '/api/phases/search-full-information?' + params).then(function (response) {
                return response;
            });
        }

        function getLastestNotChecked(seasonId) {
            return $http.get(HOST_GW + '/api/phases/lastestNotChecked?seasonId=' + seasonId).then(function(response) {
                return response.data;
            });
        }

        function getLastestChecked(seasonId) {
            return $http.get(HOST_GW + '/api/phases/lastestChecked?seasonId=' + seasonId).then(function(response) {
                return response.data;
            });
        }
    }
})();
