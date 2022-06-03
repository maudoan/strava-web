(function(){
    'use strict';
    angular.module('erpApp')
        .controller('UserDetailController',UserDetailController);

    UserDetailController.$inject = ['$rootScope','$scope','$state','$stateParams','User',
        'Role','AlertService','ErrorHandle','$translate','variables',
        '$timeout', 'ComboBoxController', 'Principal'];
    function UserDetailController($rootScope,$scope, $state, $stateParams, User,
                                  Role, AlertService, ErrorHandle, $translate, variables,
                                  $timeout, ComboBoxController, Principal) {
        var vm = this;
        $scope.isCurrentUser = false;

        var statusStyle = {
            true: "uk-text-success uk-text-bold",
            false: "uk-text-danger uk-text-bold"
        };
        $scope.isAdmin = false;
        if(Principal.hasAnyAuthority(["ROLE_SYSTEM_ADMIN"])){
            $scope.isAdmin = true;
        }

        $scope.user = {};
        User.getUserById($stateParams.userId).then(function (data) {
            $scope.user = data;
            $scope.status = "Inactive"
            $scope.active = $scope.user.active
            if ($scope.active) {
                $scope.status = "Active"
            }
            $scope.activeClass = statusStyle[$scope.active]

            // get current user
            User.current().then(function (data) {
                if(data.id == $stateParams.userId){
                    $scope.isCurrentUser = true;
                }
            });
        });

        $scope.CbxActivate = {
            activateService:User.activate,
            deactivateService:User.deactivate
        }

        $scope.deleteUser = function () {
            UIkit.modal.confirm($translate.instant("global.actionConfirm.delete"), function () {
                User.deleteOne($scope.user.id).then(function(data){
                    $state.go('users');
                }).catch(function(data){
                    //AlertService.error('admin.messages.errorDeleteUser');
                    ErrorHandle.handleError(data)
                })
            }, {
                labels: {
                    'Ok': $translate.instant("global.button.delete"),
                    'Cancel': $translate.instant("global.button.cancel")
                }
            });
        }

        $("#user-input-form-file").change(function(e) {
            var file = $('#user-input-form-file')[0].files[0];
            if(file != undefined && file != null) {
                $timeout(function () {
                    UIkit.modal.confirm($translate.instant("inventory.messages.changeAvatar"), function () {
                        User.uploadAvatar($stateParams.userId, file).then(function (data) {
                            location.reload();
                        }).catch(function (data) {
                            ErrorHandle.handleError(data);
                        })
                    }, {
                        labels: {
                            'Ok': "OK",
                            'Cancel': $translate.instant($scope.button.cancel)
                        }
                    });

                });
            }

        });

        $scope.deleteUserAvatar = function () {
            UIkit.modal.confirm($translate.instant("global.messages.deleteAvatar"), function () {
                User.deleteAvatar($stateParams.userId).then(function (data) {
                    location.reload();
                }).catch(function (data) {
                    ErrorHandle.handleError(data);
                })
            }, {
                labels: {
                    'Ok': "OK",
                    'Cancel': $translate.instant($scope.button.cancel)
                }
            });

        }

        /*$scope.changePass = function () {
            $("body").css({ 'padding-right': 0 });
            $('#changePassForm').parsley();
            var $form = $('#changePassForm');
            if(!$scope.changePassForm.$valid) return;
            if(!ComboBoxController.checkIsValidForm($form)) return;

            var user = {
                id: $scope.user.id,
                password: $scope.currentPassword,
                newPassword: $scope.newPassword,
                confirmPassword: $scope.confirmPassword
            }
            User.changePassword(user).then(function () {
                AlertService.success('admin.messages.changePasswordSuccess');
                $scope.resetPasswordForm();

                $timeout(function () {
                    angular.element("#btnCancel").trigger("click");
                });
            }).catch(function(data){
            	//console.log(data.data);
            	if(data.data.errorKey = 'error.userAndPermission.currentPasswordInvalid')
            		$scope.errorCurrentPass = true;
            	else ErrorHandle.handleOneError(data);
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
        // ==============================
        var $formValidate = $('#changePassForm');
        $formValidate.parsley({
            'excluded': 'input[type=button], input[type=submit], input[type=reset], input[type=hidden], .selectize-input > input'
        }).on('form:validated',function() {
            $scope.$apply();
        }).on('field:validated',function(parsleyField) {
            if($(parsleyField.$element).hasClass('md-input')) {
                $scope.$apply();
            }
        });*/
    }

})();