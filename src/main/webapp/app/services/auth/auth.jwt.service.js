(function() {
    'use strict';

    angular
        .module('erpApp')
        .factory('AuthServerProvider', AuthServerProvider);

    AuthServerProvider.$inject = ['$http', '$localStorage', '$sessionStorage', '$q', 'HOST_GW', 'AesCrypt'];

    function AuthServerProvider ($http, $localStorage, $sessionStorage, $q, HOST_GW, AesCrypt) {
        var service = {
            getToken: getToken,
            login: login,
            loginWithToken: loginWithToken,
            storeAuthenticationToken: storeAuthenticationToken,
            logout: logout
        };

        return service;

        function getToken () {
            return $localStorage.authenticationToken || $sessionStorage.authenticationToken;
        }

        function login (credentials) {

            var data = {
                'username': AesCrypt.encrypt(credentials.email),
                'password': AesCrypt.encrypt(credentials.password),
                'rememberMe': credentials.rememberMe,
                'type': credentials.type
            };
            return $http.post(HOST_GW + '/api/auth/token',data).then(authenticateSuccess);

            function authenticateSuccess (response) {
                var bearerToken = response.headers('Authorization');
                if (angular.isDefined(bearerToken) && bearerToken.slice(0, 7) === 'Bearer ') {
                    var jwt = bearerToken.slice(7, bearerToken.length);
                    service.storeAuthenticationToken(jwt, credentials.rememberMe);
                    return jwt;
                }
            }
        }

        function loginWithToken(jwt, rememberMe) {
            var deferred = $q.defer();

            if (angular.isDefined(jwt)) {
                this.storeAuthenticationToken(jwt, rememberMe);
                deferred.resolve(jwt);
            } else {
                deferred.reject();
            }

            return deferred.promise;
        }

        function storeAuthenticationToken(jwt, rememberMe) {
            if(rememberMe){
                $localStorage.authenticationToken = jwt;
            } else {
                $sessionStorage.authenticationToken = jwt;
            }
        }

        function logout () {
            $http.defaults.headers.common['Authorization'] = undefined;
            delete $localStorage.authenticationToken;
            delete $sessionStorage.authenticationToken;
        }
    }
})();
