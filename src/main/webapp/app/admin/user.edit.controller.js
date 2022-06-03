(function(){
    'use strict';
    angular.module('erpApp')
        .controller('UserEditController',UserEditController);

    UserEditController.$inject = ['$rootScope','$scope','$state','$stateParams','User', 'Role', 'AlertService','AlertModalService', 'ErrorHandle', '$translate','FileService','$timeout', 'ComboBoxController','Area'];
    function UserEditController($rootScope,$scope, $state, $stateParams, User, Role, AlertService,AlertModalService, ErrorHandle, $translate,FileService,$timeout, ComboBoxController,Area) {
        $scope.ComboBox = {};
        $scope.blockModal = null;
        $scope.blockUI = function () {
            if($scope.blockModal != null)
                $scope.blockModal.hide();
            $scope.blockModal = null;
            $scope.blockModal = UIkit.modal.blockUI('<div class=\'uk-text-center\'>Đang xử lý ...<br/><img class=\'uk-margin-top\' src=\'assets/img/spinners/spinner_success.gif\' alt=\'\'>');
        };
        $scope.forms_advanced = {
            selectize_roles: []
        };
        $scope.selectedCbb = {
            role: [],
            area:[]
        };

        $scope.user = {};
        $scope.user.oldAvatar = "";
        $scope.allRoles = {};

        var roleComboBox = {
            id:'roleId',
            url:'/api/roles',
            originParams:'', // chỉ lấy địa điểm
            valueField:'id',
            labelField:'name',
            searchField:'name',
            table: null,
            column: null,
            maxItems:null,
            ngModel:[],
            options:[],
            placeholder: "Chọn vai trò"
        };
        ComboBoxController.init($scope, roleComboBox);

        var areaComboBox = {
            id:'area',
            url:'/api/areas',
            originParams:'', // chỉ lấy địa điểm
            valueField:'id',
            labelField:'name',
            searchField:'name',
            table: null,
            column: null,
            maxItems:null,
            ngModel:[],
            options:[],
            placeholder: "Chọn khu vực"
        };
        ComboBoxController.init($scope, areaComboBox);
        $scope.allAreas =[];
        Area.getAll().then(function (data) {
            $scope.allAreas = data
            areaComboBox.options = data;
            console.log(areaComboBox.options)
            ComboBoxController.init($scope, areaComboBox);
        })
        $scope.$watch('user.areaIds', function (newVal) {
            if(newVal){
                if(newVal.includes("1")){
                    $scope.user.areaIds = [1];
                    areaComboBox.options = [{id:1,name:"Tất cả"}]
                    ComboBoxController.init($scope, areaComboBox);
                } else {
                    if($scope.allAreas.length > 0){
                        $scope.area_options = $scope.allAreas
                        areaComboBox.options = $scope.allAreas
                        ComboBoxController.init($scope, areaComboBox);
                    }
                }
            } else {
                if($scope.allAreas.length > 0){
                    areaComboBox.options = $scope.allAreas
                    ComboBoxController.init($scope, areaComboBox);
                }
            }

        }, true);

        // =========================================
        User.getUserById($stateParams.userId).then(function (data) {
            $scope.user = data;
            $scope.user.oldAvatar = data.userAvatar;
            for(var i = 0; i < $scope.user.roles.length; i++) {
                $scope.forms_advanced.selectize_roles.push($scope.user.roles[i].id);
            }

            roleComboBox.options = [data.roles];
            ComboBoxController.init($scope, roleComboBox);


            if($scope.user.areas){
                $scope.user.areaIds = []
                for(var i = 0; i < $scope.user.areas.length; i++) {
                    $scope.user.areaIds.push($scope.user.areas[i].id);
                }
            }
        });

        $scope.btnDisable = false;
        $scope.submit = function(isClose) {
            var $form = $("#form_createuser");
            $('#form_createuser').parsley();
            if(!$scope.form_createuser.$valid) return;
            if(!ComboBoxController.checkIsValidForm($form)) return;
            if($scope.btnDisable) return;

            $scope.btnDisable = true;
            $scope.blockUI();

            // delete old avatar
            if($scope.user.oldAvatar && (!$scope.user.userAvatar || $scope.user.userAvatar === "")){
                FileService.deleteFileUpload($scope.user.oldAvatar);
            }

            // upload Avatar first
            var file = $("#user-input-form-file")[0].files[0];
            if(file){
                FileService.uploadFile(file, 1).then(function (data) {
                	var elements = $('input[type=hidden]');
                	elements.remove();
                    $scope.user.userAvatar = data.data.fileName;
                    updateUser(isClose);
                }).catch(function (data) {
                	if($scope.blockModal != null) $scope.blockModal.hide();
                    ErrorHandle.handleOneError(data);
                    $scope.btnDisable = false;
                });
            } else{
                // if dont have file: update immedimately
                updateUser(isClose);
            }
        };

        function updateUser(isClose){
            $scope.user.roles = [];
            $scope.user.roles = $scope.selectedCbb.role;
            $scope.user.areas = $scope.selectedCbb.area;
            User.updateUserAdmin($scope.user).then(function(data){
            	if($scope.blockModal != null) $scope.blockModal.hide();
                AlertService.success("success.msg.update");
                $timeout(function () {
                    isClose?$state.go('users'):$state.go('users-detail',{userId: data.id});
                },1100);

            }).catch(function(data){
                if($scope.blockModal != null) $scope.blockModal.hide();
                ErrorHandle.handleOneError(data);
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
        };
        
        $scope.CbxActivate = {
            activateService:User.activate,
            deactivateService:User.deactivate
        };

        if ( angular.element('#form_createuser').length ) {
            var $formValidate = $('#form_createuser');
            $formValidate
                .parsley({
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