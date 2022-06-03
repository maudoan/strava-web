(function() {
    'use strict';

    angular
        .module('erpApp')
        .factory('ProcedureLog', ProcedureLog);

    ProcedureLog.$inject = ['$http', 'HOST_GW'];

    function ProcedureLog ($http, HOST_GW) {
        return {
            current : current,
            getAll: getAll,
            create: create,
            getOne: getOne,
            getFull: getFull,
            getPageFull: getPageFull,
            getPage: getPage,
            update: update,
            deleteOne: deleteOne,
            deleteMany: deleteMany,
            activate:activate,
            deactivate:deactivate,
            findByPhaseId: findByPhaseId,
            addMaterial: addMaterial,
            modifyMaterial: modifyMaterial,
            deleteMaterial: deleteMaterial
        };

        function current() {
            return $http.get(HOST_GW + '/api/procedureLogs/current').then(function(response) {
                return response.data;
            });
        }

        function getAll() {
            return $http.get(HOST_GW + '/api/procedureLogs').then(function(response) {
                return response.data;
            });
        }

        function create(procedureLog) {
            return $http.post(HOST_GW + '/api/procedureLogs', procedureLog).then(function(response) {
                return response.data;
            });
        }

        function getPage(params) {
            return $http.get(HOST_GW + '/api/procedureLogs/search?' + params).then(function (response) {
                return response;
            });
        }

        function update(procedureLog) {
            return $http.put(HOST_GW + '/api/procedureLogs/' + procedureLog.id, procedureLog).then(function(response) {
                return response.data;
            });
        }

        function deleteOne(id) {
            return $http.delete(HOST_GW + '/api/procedureLogs/' + id).then(function(response) {
                return response.data;
            });
        }

        function deleteMany(ids) {
            return $http.post(HOST_GW + '/api/procedureLogs/batch-delete', ids).then(function(response) {
                return response.data;
            });
        }

        function activate(id) {
            return $http.get(HOST_GW + '/api/procedureLogs/activate?id=' + id).then(function(response) {
                return response.data;
            });
        }

        function deactivate(id) {
            return $http.get(HOST_GW + '/api/procedureLogs/deactivate?id=' +id).then(function(response) {
                return response.data;
            });
        }

        function getOne(id){
            return $http.get(HOST_GW + '/api/procedureLogs/' + id).then(function(response) {
                return response.data;
            });
        }

        function getFull(id) {
            return $http.get(HOST_GW + '/api/procedureLogs/get-full/' + id).then(function(response) {
                return response.data;
            });
        }

        function getPageFull(params) {
            return $http.get(HOST_GW + '/api/procedureLogs/search-full?' + params).then(function (response) {
                return response;
            });
        }

        function findByPhaseId(id) {
            return $http.get(HOST_GW + '/api/procedureLogs/phase/' + id).then(function(response) {
                return response.data;
            });
        }

        function addMaterial(td) {
            return $http.post(HOST_GW + '/api/procedureLogs/add-material',td).then(function(response) {
                return response.data;
            });
        }

        function modifyMaterial(td) {
            return $http.post(HOST_GW + '/api/procedureLogs/modify-material',td).then(function(response) {
                return response.data;
            });
        }

        function deleteMaterial(td) {
            return $http.post(HOST_GW + '/api/procedureLogs/delete-material',td).then(function(response) {
                return response.data;
            });
        }
    }
})();
