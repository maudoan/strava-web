(function() {
    'use strict';

    angular
        .module('erpApp')
        .factory('ProcedureInfo', ProcedureInfo);

    ProcedureInfo.$inject = ['$http'];

    function ProcedureInfo ($http) {
        return {
            current : current,
            getAll: getAll,
            create: create,
            getOne: getOne,
            getFullInfomation: getFullInfomation,
            getPageFullInformation: getPageFullInformation,
            getPage: getPage,
            update: update,
            deleteOne: deleteOne,
            deleteMany: deleteMany,
            activate:activate,
            deactivate:deactivate
        };

        function current() {
            return $http.get(HOST_GW + '/api/procedureInfos/current').then(function(response) {
                return response.data;
            });
        }

        function getAll() {
            return $http.get(HOST_GW + '/api/procedureInfos').then(function(response) {
                return response.data;
            });
        }

        function create(unitType) {
            return $http.post(HOST_GW + '/api/procedureInfos', unitType).then(function(response) {
                return response.data;
            });
        }

        function getPage(params) {
            return $http.get(HOST_GW + '/api/procedureInfos/search?' + params).then(function (response) {
                return response;
            });
        }

        function update(unitType) {
            return $http.put(HOST_GW + '/api/procedureInfos/' + unitType.id, unitType).then(function(response) {
                return response.data;
            });
        }

        function deleteOne(id) {
            return $http.delete(HOST_GW + '/api/procedureInfos/' + id).then(function(response) {
                return response.data;
            });
        }

        function deleteMany(ids) {
            return $http.post(HOST_GW + '/api/procedureInfos/batch-delete', ids).then(function(response) {
                return response.data;
            });
        }

        function activate(id) {
            return $http.get(HOST_GW + '/api/procedureInfos/activate?id=' + id).then(function(response) {
                return response.data;
            });
        }

        function deactivate(id) {
            return $http.get(HOST_GW + '/api/procedureInfos/deactivate?id=' +id).then(function(response) {
                return response.data;
            });
        }

        function getOne(id){
            return $http.get(HOST_GW + '/api/procedureInfos/' + id).then(function(response) {
                return response.data;
            });
        }

        function getFullInfomation(id) {
            return $http.get(HOST_GW + '/api/procedureInfos/get-full-information/' + id).then(function(response) {
                return response.data;
            });
        }

        function getPageFullInformation(params) {
            return $http.get(HOST_GW + '/api/procedureInfos/search-full-information?' + params).then(function (response) {
                return response;
            });
        }
    }
})();
