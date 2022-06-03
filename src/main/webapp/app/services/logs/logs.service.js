(function () {
    'use strict';

    angular
        .module('erpApp')
        .factory('LogsService', LogsService);

    LogsService.$inject = ['$http','HOST_GW'];

    function LogsService($http, HOST_GW, $scope) {
        var service = {
            init: init,
            markAllAsRead: markAllAsRead,
//            markAllAsShowPopup: markAllAsShowPopup,
//            getAllByRecipient:getAllByRecipient,
            getByRecipient:getByRecipient,
            getByRecipientPaging:getByRecipientPaging,
            countNotRead:countNotRead,
            markAsRead:markAsRead,
            markAsUnRead:markAsUnRead,
//            markAsShowPopup:markAsShowPopup,
            hideNotification:hideNotification,
//            hideManyNotification:hideManyNotification,
            markAllAsShowDropdown: markAllAsShowDropdown
        };

        return service;

        function init(scope) {
            $scope = scope;
        }

        function markAllAsRead(userId) {
            return $http.get(HOST_GW + '/api/notifications/read-all?recipientId=' + userId).then(function (response) {
                return response;
            });
        }

//        function markAllAsShowPopup(userId) {
//            return $http.get(HOST_GW + '/api/notifications/show-popup-all?recipientId=' + userId).then(function (response) {
//                return response;
//            });
//        }
//
//        function getAllByRecipient(userId) {
//            return $http.get(HOST_GW + '/api/notifications/get-all-by-recipient?recipientId=' + userId).then(function (response) {
//                return response;
//            });
//        }

        function getByRecipient(userId) {
            return $http.get(HOST_GW + '/api/notifications/search?query=recipientId==' + userId + ';active==1&size=10&sort=created,desc').then(function (response) {
                return response;
            });
        }

        function getByRecipientPaging(userId, pageNum, pageSize) {
            return $http.get(HOST_GW + '/api/notifications/search?query=recipientId==' + userId + ';active==1&size=' + pageSize + '&page=' + pageNum + '&sort=created,desc').then(function (response) {
                return response;
            });
        }

        function countNotRead(userId) {
//            return $http.get(HOST_GW + '/api/notifications/count-not-read?recipientId=' + userId).then(function (response) {
//                return response;
//            });
        }

        function markAsRead(id) {
            return $http.post(HOST_GW + '/api/notifications/' + id+ '/read').then(function (response) {
                return response;
            });
        }

        function markAsUnRead(id) {
            return $http.post(HOST_GW + '/api/notifications/' + id+ '/unread').then(function (response) {
                return response;
            });
        }

//        function markAsShowPopup(id) {
//            return $http.post(HOST_GW + '/api/notifications/' + id+ '/showPopup').then(function (response) {
//                return response;
//            });
//        }

        function hideNotification(id) {
            return $http.post(HOST_GW + '/api/notifications/' + id+ '/hide').then(function (response) {
                return response;
            });
        }

//        function hideManyNotification(ids) {
//            return $http.post(HOST_GW + '/api/notifications/batch-hide', ids).then(function (response) {
//                return response;
//            });
//        }

        function markAllAsShowDropdown(userId) {
            return $http.post(HOST_GW + '/api/notifications/showDropdown?recipientId=' + userId).then(function (response) {
                return response;
            });
        }
    }
})();
