(function() {
    'use strict';

    angular
        .module('erpApp')
        .controller('ResetPasswordController', ResetPasswordController);

    ResetPasswordController.$inject = ['$rootScope', '$state', '$timeout', 'Auth','$scope','$http','AlertService'];

    function ResetPasswordController ($rootScope, $state, $timeout, Auth, $scope, $http,AlertService) {
        var vm = this;
        vm.reset = reset;
        vm.newPassword = null;
        vm.confirmPassword = null;
        vm.email = null;
        $scope.validLink = false;
        
        var $formResetPassValidate = $('#form_ResetPass');
        $formResetPassValidate.parsley({
            'excluded': 'input[type=button], input[type=submit], input[type=reset], input[type=hidden], .selectize-input > input'
        }).on('form:validated',function() {
            $scope.$apply();
        }).on('field:validated',function(parsleyField) {
            if($(parsleyField.$element).hasClass('md-input')) {
                $scope.$apply();
            }
        });

        function getUrlVars() {
            var vars = {};
            var parts = window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi,
                function(m,key,value) {
                    vars[key] = value;
                });
            return vars;
        }

        var params = getUrlVars();
        if(!isEmpty(params.token) && !isEmpty(params.email) && !isEmpty(params.active)){
            $scope.validLink = true;
            vm.email = params.email;
        }

        function isEmpty(x){
            if(!angular.isDefined(x) || x == null || x==''){
                return true;
            } else {
                return false;
            }
        }
        $timeout(function (){angular.element('#email').focus();});

        function reset (event) {
            event.preventDefault();
            if(!isEmpty(params.token) && !isEmpty(params.email) && !isEmpty(params.active)){
                var resetPasswordVM ={
                    email: vm.email,
                    username: vm.email,
                    type: vm.type,
                    newPassword: vm.newPassword,
                    confirmPassword: vm.confirmPassword,
                    forgotPasswordToken: params.token
                }
                if(params.active == 0){ // quen mat khau
                    Auth.resetPassword(resetPasswordVM).then(function () {
                        $state.go('login');
                    }).catch(function () {
                        $scope.validLink = false;
                    });
                } else if(params.active == 1){   //active new user
                    Auth.activeNewUser(resetPasswordVM).then(function () {
                        $state.go('login');
                    }).catch(function () {
                        $scope.validLink = false;
                    });
                }

            } else {
                $scope.validLink = false;
            }
            
            // Auth.login({
            //     email: vm.email,
            //     password: vm.password,
            //     rememberMe: vm.rememberMe
            // }).then(function () {
            //     vm.authenticationError = false;
            //
            //     $state.go('dashboard', {from: 'login'});
            //
            //     // previousState was set in the authExpiredInterceptor before being redirected to login modal.
            //     // since login is successful, go to stored previousState and clear previousState
            //     if (Auth.getPreviousState()) {
            //         var previousState = Auth.getPreviousState();
            //         Auth.resetPreviousState();
            //         $state.go(previousState.name, previousState.params);
            //     }
            // }).catch(function () {
            //     vm.authenticationError = true;
            // });
        }
    }
})();
