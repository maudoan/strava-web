(function() {
    'use strict';

    angular
        .module('erpApp')
        .factory('NoteService', NoteService);

    NoteService.$inject = ['$http'];

    function NoteService ($http) {
        var service = {
            getAll: getAll,
            create: create,
            getPage: getPage,
            getOne: getOne,
            update:update,
            deleteRecord:deleteRecord,
            deleteOne:deleteOne,
            activate:activate,
            deactivate:deactivate,
            getAuditLog:getAuditLog
        };

        return service;

        function getAll() {
            return $http.get(HOST_GW + '/api/notes').then(function(response) {
                return response.data;
            });
        }

        function create(ot,files) {
            ot.hasAttachment = false;
            if(angular.isDefined(files) && files !=null && files.length > 0){
                ot.hasAttachment = true;
            }
            return $http.post(HOST_GW + '/api/notes',ot).then(function(response) {
                var note = response.data;
                if(angular.isDefined(files) && files !=null && files.length > 0){
                    var fd = new FormData();
                    for(var i=0; i< files.length; i ++){
                        fd.append("file", files[i]);
                    }
                    var url = '/api/notes/attach?id='+note.id;
                    return $http.post(url, fd, {
                        transformRequest: angular.identity,
                        headers: {'Content-Type': undefined}
                    }).then(function(noteResponse) {
                        return noteResponse.data;
                    });
                } else {
                    return note;
                }
            });
        }

        function getOne(id) {
            return $http.get(HOST_GW + '/api/notes/' +id).then(function (response) {
                return response.data;
            });
        }

        function getPage(params) {
            return $http.get(HOST_GW + '/api/notes/search?' + params).then(function (response) {
                return response;
            });
        }

        function update(ot) {
            return $http.put(HOST_GW + '/api/notes/' + ot.id, ot).then(function(response) {
                return response.data;
            });
        }

        function deleteRecord(ids) {
            return $http.post(HOST_GW + '/api/notes/batch-delete', ids).then(function(response) {
                return response.data;
            });
        }

        function deleteOne(id){
            return $http.delete(HOST_GW + '/api/notes/'+ id).then(function(response) {
                return response.data;
            });
        }

        function activate(ids) {
            return $http.post(HOST_GW + '/api/notes/activate', ids).then(function(response) {
                return response.data;
            });
        }

        function deactivate(ids) {
            return $http.post(HOST_GW + '/api/notes/deactivate', ids).then(function(response) {
                return response.data;
            });
        }

        function getAuditLog(params) {
            return $http.get(HOST_GW + '/api/audit-logs/search?' + params).then(function (response) {
                return response;
            });
        }
    }
})();
