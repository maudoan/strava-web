(function(){
    'use strict';
    angular.module('erpApp')
        .controller('UserProfileEditController',UserProfileEditController);

    UserProfileEditController.$inject = ['$rootScope','$scope','$state','$stateParams','User', 'Role', 'AlertService', 'ErrorHandle', '$translate','$timeout', 'ComboBoxController', 'FileService'];
    function UserProfileEditController($rootScope,$scope, $state, $stateParams, User, Role, AlertService, ErrorHandle, $translate,$timeout, ComboBoxController, FileService) {
        $scope.blockModal = null;
        $scope.blockUI = function () {
            if($scope.blockModal != null)
                $scope.blockModal.hide();
            $scope.blockModal = null;
            $scope.blockModal = UIkit.modal.blockUI('<div class=\'uk-text-center\'>Đang xử lý ...<br/><img class=\'uk-margin-top\' src=\'assets/img/spinners/spinner_success.gif\' alt=\'\'>');
        };
        $scope.user = {};
        $scope.user.oldAvatar = "";
        $scope.allRoles = {};
        $scope.CbxActivate = {
            activateService:User.activate,
            deactivateService:User.deactivate
        };
        User.current().then(function (data) {
            $scope.user = data;
            $scope.user.oldAvatar = data.userAvatar;
            $scope.user.createdDate = getDateString($scope.user.created);
            $scope.user.updatedDate = getDateString($scope.user.updated);
        });

        function getDateString(unix_timestamp) {
            var date = new Date(unix_timestamp);
            var year = date.getFullYear();
            var month = date.getMonth() + 1;
            var day = date.getDate();
            if(day < 10)
                day = "0" + day;
            if(month < 10)
                month = "0" + month;
            return day + "/" + month + "/" + year;
        }

        $scope.deleteUser = function () {
            UIkit.modal.confirm($translate.instant($scope.actionConfirm.delete), function () {
                User.deleteOne($scope.user.id).then(function(data){
                    $state.go('users');
                }).catch(function(data){
                    //AlertService.error('admin.messages.errorDeleteUser');
                    ErrorHandle.handleError(data)
                })
            }, {
                labels: {
                    'Ok': $translate.instant("global.button.ok"),
                    'Cancel': $translate.instant("global.button.cancel")
                }
            });
        }

        $scope.btnDisable = false;
        $scope.submit = function() {
            $('#form_createuser').parsley();
            var $form = $('#form_createuser');
            if(!$scope.form_createuser.$valid) return;
            if(!ComboBoxController.checkIsValidForm($form)) return;
            if($scope.btnDisable) return;
            
            $scope.btnDisable = true;
            $scope.blockUI();
            
            // delete old avatar
            if($scope.user.oldAvatar && (!$scope.user.userAvatar || $scope.user.userAvatar == "")){
                FileService.deleteFileUpload($scope.user.oldAvatar);
            }

            // upload Avatar first
            var file = $("#user-input-form-file")[0].files[0];
            if(file){
                FileService.uploadFile(file, 1).then(function (data) {
                    $scope.user.userAvatar = data.data.fileName;
                    updateUser();
                }).catch(function (data) {
                	if($scope.blockModal != null) $scope.blockModal.hide();
                    ErrorHandle.handleError(data);
                    $scope.btnDisable = false;
                });
            } else{
                // if dont have file: update immedimately
                updateUser();
            }
        };

        function updateUser(){
            User.update($scope.user).then(function(data){
                if($scope.blockModal != null) $scope.blockModal.hide();
                AlertService.success("success.msg.update");
                $timeout(function () {
                    $state.go('user-profile',{userId: $scope.user.id });
                },1000);
            })
            .catch(function(data){
                if($scope.blockModal != null) $scope.blockModal.hide();
                AlertService.error('admin.messages.errorUpdateUser');
                $scope.btnDisable = false;
            })
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

        if ( angular.element('#form_createuser').length ) {
            $scope.email_msg = $translate.instant('admin.messages.invalidEmail');
            $scope.required_msg = $translate.instant('admin.messages.required');
            $scope.phone = $translate.instant('global.messages.phone');
            $scope.email_msg = $translate.instant('admin.messages.invalidEmail');
            $scope.maxLength255 = $translate.instant('global.messages.maxLength255');
            $scope.phoneMaxLength = $translate.instant('global.messages.phoneMaxLength');
            $scope.phone = $translate.instant('global.messages.phone');

            var $formValidate = $('#form_createuser');
            $formValidate.parsley({
                    'excluded': 'input[type=button], input[type=submit], input[type=reset], input[type=hidden], .selectize-input > input'
                })
                .on('form:validated',function() {
                    $scope.$apply();
                })
                .on('field:validated',function(parsleyField) {
                    if($(parsleyField.$element).hasClass('md-input')) {
                        $scope.$apply();
                    }
                });
        }
    }

})();