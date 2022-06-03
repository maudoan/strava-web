(function() {
    'use strict';

    angular
        .module('erpApp')
        .factory('NotificationService', NotificationService);

    NotificationService.$inject = ['$http'];

    function NotificationService ($http) {
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
            getOneByNoteId:getOneByNoteId,
            countAll: countAll,
            getLastRecord: getLastRecord,
            getAllByRecepientNotRead: getAllByRecepientNotRead,
            getAllByRecepientHide: getAllByRecepientHide
        };

        return service;

        function getAll() {
            return $http.get(HOST_GW + '/api/notifications').then(function(response) {
                return response.data;
            });
        }

        function create(ot) {
            return $http.post(HOST_GW + '/api/notifications',ot).then(function(response) {
                return response.data;
            });
        }

        function getOne(id) {
            return $http.get(HOST_GW + '/api/notifications/' +id).then(function (response) {
                return response.data;
            });
        }

        function getPage(params) {
            return $http.get(HOST_GW + '/api/notifications/search?' + params).then(function (response) {
                return response;
            });
        }

        function update(ot) {
            return $http.put(HOST_GW + '/api/notifications/' + ot.id, ot).then(function(response) {
                return response.data;
            });
        }

        function deleteRecord(ids) {
            return $http.post(HOST_GW + '/api/notifications/batch-delete', ids).then(function(response) {
                return response.data;
            });
        }

        function deleteOne(id){
            return $http.delete(HOST_GW + '/api/notifications/'+ id).then(function(response) {
                return response.data;
            });
        }

        function activate(id) {
            return $http.get(HOST_GW + '/api/notifications/activate?id=' + id).then(function(response) {
                return response.data;
            });
        }

        function deactivate(id) {
            return $http.get(HOST_GW + '/api/notifications/deactivate?id=' +id).then(function(response) {
                return response.data;
            });
        }

        function getOneByNoteId(noteId) {
            return $http.get(HOST_GW + '/api/notifications/get-by-note_id?noteId=' + noteId).then(function (response) {
                return response;
            });
        }
        
        function countAll() {
            return $http.get(HOST_GW + '/api/notifications/count-all').then(function (response) {
                return response;
            });
        }

        function getLastRecord() {
            return $http.get(HOST_GW + '/api/notifications/get-last-record').then(function (response) {
                return response;
            });
        }

        function getAllByRecepientNotRead(recepientId) {
            return $http.get(HOST_GW + '/api/notifications/get-by-recipient-not-read?recipientId=' + recepientId).then(function (response) {
                return response;
            });
        }

        function getAllByRecepientHide(recepientId) {
            return $http.get(HOST_GW + '/api/notifications/get-by-recipient-hide?recipientId=' + recepientId).then(function (response) {
                return response;
            });
        }
    }
})();
