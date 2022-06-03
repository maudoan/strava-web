(function() {
    'use strict';

    angular
        .module('erpApp')
        .factory('User', User);

    User.$inject = ['$http', 'HOST_GW', '$localStorage'];

    function User ($http, HOST_GW, $localStorage) {
        var service = {
            current : current,
            create: create,
            getPage: getPage,
            getCustomerPage: getCustomerPage,
            getUserById: getUserById,
            update: update,
            updateUserAdmin: updateUserAdmin,
            deleteOne: deleteOne,
            deleteMany: deleteMany,
            activate:activate,
            deactivate:deactivate,
            activateCustomer:activateCustomer,
            deactivateCustomer:deactivateCustomer,
            uploadAvatar:uploadAvatar,
            importExcel: importExcel,
            deleteFileUpload: deleteFileUpload,
            deleteAvatar:deleteAvatar,
            changePassword:changePassword,
            getOne: getOne,
            checkTraceAdmin:checkTraceAdmin,
            register:register,
            forgotPassword:forgotPassword,
            getRoot:getRoot,
            getUserInTenant: getUserInTenant,
            sendTokenToServer: sendTokenToServer,
            getCustomer:getCustomer
        };

        return service;

        function getCustomer(params,input) {
            return $http.post(HOST_GW + '/api/users/customers?' + params,input).then(function (response) {
                return response;
            });
        }

        function current() {
            $http.defaults.headers.common['Authorization'] = 'Bearer ' + $localStorage.authenticationToken;
            return $http.get(HOST_GW + '/api/users/current').then(function(response) {
                return response.data;
            });
        }
        function getRoot() {
            return $http.get(HOST_GW + '/api/users/root').then(function(response) {
                return response.data;
            });
        }

        function create(user) {
            return $http.post(HOST_GW + '/api/users',user).then(function(response) {
                return response.data;
            });
        }

        function register(user) {
            return $http.post(HOST_GW + '/api/users/register',user).then(function(response) {
                return response.data;
            });
        }
        
        function forgotPassword(params) {
            return $http.post(HOST_GW + '/api/users/forgot-password/init', params).then(function (response) {
                return response;
            });
        }

        function getPage(params) {
            return $http.get(HOST_GW + '/api/users/search?' + params).then(function (response) {
                return response;
            });
        }

        function getCustomerPage(params) {
            return $http.get(HOST_GW + '/api/users/search-customer?' + params).then(function (response) {
                return response;
            });
        }

        function getUserInTenant(id) {
            return $http.get(HOST_GW + '/api/users/get-user-in-tenant/' + id).then(function (response) {
                return response.data;
            });
        }

        function getUserById(id) {
            return $http.get(HOST_GW + '/api/users/' + id).then(function(response) {
                return response.data;
            });
        }

        function update(user) {
            return $http.put(HOST_GW +'/api/users/' + user.id, user).then(function(response) {
                return response.data;
            });
        }

        function updateUserAdmin(user) {
            return $http.put(HOST_GW +'/api/users/update-user-admin/' + user.id, user).then(function(response) {
                return response.data;
            });
        }

        function deleteOne(id) {
            return $http.delete(HOST_GW +'/api/users/' + id).then(function(response) {
                return response.data;
            });
        }

        function deleteMany(ids) {
            return $http.post(HOST_GW +'/api/users/batch-delete', ids).then(function(response) {
                return response.data;
            });
        }

        function activate(id) {
            return $http.get(HOST_GW +'/api/users/activate?id=' + id).then(function(response) {
                return response.data;
            });
        }

        function deactivate(id) {
            return $http.get(HOST_GW +'/api/users/deactivate?id=' + id).then(function(response) {
                return response.data;
            });
        }

        function activateCustomer(id) {
            return $http.get(HOST_GW +'/api/users/activate-customer?id=' + id).then(function(response) {
                return response.data;
            });
        }

        function deactivateCustomer(id) {
            return $http.get(HOST_GW +'/api/users/deactivate-customer?id=' + id).then(function(response) {
                return response.data;
            });
        }

        function uploadAvatar(file, model) {
            var fd = new FormData();
            fd.append('file', file);
            fd.append('model', model);
            return $http.post(HOST_GW +'/api/upload/', fd,{
                transformRequest: angular.identity,
                headers: {'Content-Type': undefined}
            }).then(function(response) {
                return response;
            });
        }

        function importExcel(file) {
            var fd = new FormData();
            fd.append('file', file);
            return $http.post(HOST_GW+'/api/users/import', fd,{
                transformRequest: angular.identity,
                headers: {'Content-Type': undefined}
            }).then(function(response) {
                return response.data;
            });
        }

        function deleteAvatar(userId) {
            return $http.post(HOST_GW +'/api/users/'+ userId +'/deleteAvatar').then(function(response) {
                return response.data;
            });
        }

        function deleteFileUpload(fileName) {
            return $http.delete(HOST_GW +'/api/deleteFileUploaded?fileName=' + fileName).then(function(response) {
                return response.data;
            });
        }

        function changePassword(user) {
            return $http.post(HOST_GW +'/api/users/change-password',user).then(function(response) {
                return response.data;
            });
        }

        function getOne(id){
            return $http.get(HOST_GW +'/api/users/' + id).then(function(response) {
                return response.data;
            });
        }

        function checkTraceAdmin(organizationId){
            return $http.get(HOST_GW +'/api/users/check-trace-admin?organizationId=' + organizationId).then(function(response) {
                return response.data;
            });
        }

        function sendTokenToServer(tokenNotification) {
            return $http.post(HOST_GW +'/api/users/token-notification', tokenNotification).then(function(response) {
                return response.data;
            });
        }
    }
})();
