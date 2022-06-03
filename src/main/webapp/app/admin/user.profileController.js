(function(){
    'use strict';
    angular.module('erpApp')
        .controller('UserProfileCtrl',UserProfileCtrl);

    UserProfileCtrl.$inject = ['$rootScope','$scope','$state','User', 'Role', 'AlertService','$translate','variables','$localStorage','ErrorHandle', '$window','$http','$timeout', 'ComboBoxController', 'HOST_GW'];
    function UserProfileCtrl($rootScope, $scope, $state, User, Role, AlertService, $translate, variables,$localStorage, ErrorHandle, $window, $http, $timeout, ComboBoxController, HOST_GW) {
        $scope.user = {};
        $scope.user.oldAvatar = "";
        $scope.invalidConfirmPass = false;
        $scope.required_msg = $translate.instant('admin.messages.required')
        $scope.confirmPassword_msg = $translate.instant('admin.messages.confirmPassword')
        $scope.passwordLength = $translate.instant('admin.messages.passwordLength')

        getUser();
        function getUser() {
            $http.defaults.headers.common['Authorization'] = 'Bearer ' + $localStorage.authenticationToken;
            return $http.get(HOST_GW + '/api/users/current').then(function (response) {
                $scope.user = response.data;
                $scope.user.oldAvatar = $scope.user.userAvatar;
                $rootScope.currentUser = response.data;
            })
        }

        $scope.btnDisable = false;
        $scope.changePass = function () {
            if($scope.btnDisable) return;

            var $form = $("#changePassForm");
            $('#changePassForm').parsley();
            if(!$scope.changePassForm.$valid) return;
            if(!ComboBoxController.checkIsValidForm($form)) return;

            var user = {
                id: $scope.user.id,
                password: $scope.currentPassword,
                newPassword: $scope.newPassword,
                confirmPassword: $scope.confirmPassword
            };

            $scope.btnDisable = true;
            User.changePassword(user).then(function () {
                $scope.resetPasswordForm();
                AlertService.success('admin.messages.changePasswordSuccess');
                $timeout(function () {
                    angular.element("#btnCancel").trigger("click");
                    $scope.btnDisable = false;
                });
            }).catch(function(data){
            	//console.log(data.data);
            	if(data.data.errorKey = 'error.userAndPermission.currentPasswordInvalid')
            		$scope.errorCurrentPass = true;
            	else ErrorHandle.handleOneError(data);
                $scope.btnDisable = false;
            })

        }
        
        $scope.onChangeCurrentPass = function (){
        	$scope.errorCurrentPass = false;
        }
        
        $scope.resetPasswordForm = function () {
            $scope.currentPassword = null;
            $scope.newPassword = null;
            $scope.confirmPassword = null;

            $("#changePassForm").parsley().reset();
        }


        // var $formValidate = $('#form_createuser');
        // $formValidate.parsley({
        //     'excluded': 'input[type=button], input[type=submit], input[type=reset], input[type=hidden], .selectize-input > input'
        // }).on('form:validated',function() {
        //     $scope.$apply();
        // }).on('field:validated',function(parsleyField) {
        //     if($(parsleyField.$element).hasClass('md-input')) {
        //         $scope.$apply();
        //     }
        // });

        function updateUser(){
            User.update($scope.user).then(function(data){
                $state.go('user-profile',{userId: $scope.user.id });
            })
            .catch(function(data){
                AlertService.error('admin.messages.errorUpdateUser');
            })
        }

        $scope.CbxActivate = {
            activateService:User.activate,
            deactivateService:User.deactivate
        }

        $scope.deleteUserAvatar = function () {
            UIkit.modal.confirm($translate.instant("global.messages.deleteAvatar"), function () {
                // xóa image dã chọn trong input
                $('#user-input-form-file').val("");
                $scope.user.userAvatar = "";
                $scope.user.userAvatarBase64 = "";
            }, {
                labels: {
                    'Ok': $translate.instant("global.button.ok"),
                    'Cancel': $translate.instant("global.button.cancel")
                }
            });
        }
    }

})();
