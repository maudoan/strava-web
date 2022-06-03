(function(){
    'use strict';
    angular.module('erpApp')
        .controller('UserCreateController',UserCreateController);

    UserCreateController.$inject = ['$rootScope','$scope','$state','User', 'Role', 'AlertService','AlertModalService','$translate','variables','ErrorHandle', '$window','Organization','$timeout', 'ComboBoxController','FileService','Area'];
    function UserCreateController($rootScope,$scope, $state, User, Role, AlertService, AlertModalService,$translate, variables, ErrorHandle, $window,Organization,$timeout, ComboBoxController,FileService,Area) {
        $scope.ComboBox = {};
        $scope.blockModal = null;
        $scope.blockUI = function () {
            if($scope.blockModal != null)
                $scope.blockModal.hide();
            $scope.blockModal = null;
            $scope.blockModal = UIkit.modal.blockUI('<div class=\'uk-text-center\'>Đang xử lý ...<br/><img class=\'uk-margin-top\' src=\'assets/img/spinners/spinner_success.gif\' alt=\'\'>');
        };
        $scope.user = {};
        $scope.forms_advanced = {
            selectize_roles: []
        };
        $scope.selectedCbb = {
            role: [],
            area:[]
        };
        $scope.active = $scope.user.active = 1;

        $("#table_user").css('min-height', $( window ).height() - 300);
        $("#table_user").css('max-height', $( window ).height() - 300);
        angular.element($window).bind('resize', function(){
            $("#table_user").css('min-height', $( window ).height() - 300);
            $("#table_user").css('max-height', $( window ).height() - 300);
        });

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
            for(let i=0; i<data.length; i++) {
                if(data[i].id == 0) {
                    delete data[i];
                    break;
                }
            }
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

        // get user default
        $scope.btnDisable = false;
        $scope.submit = function(isClose) {
            var $form = $("#form_createuser");
            $('#form_createuser').parsley();
            if(!$scope.form_createuser.$valid) return;
            if(!ComboBoxController.checkIsValidForm($form)) return;
            if($scope.btnDisable) return;
            $scope.btnDisable = true;

            $scope.blockUI();
            // upload Avatar first
            var file = $("#user-input-form-file")[0].files[0];
            if(file && file != null){
            	FileService.uploadFile(file,1).then(function (data) {
                    $scope.user.userAvatar = data.data.fileName;
                    createUser(isClose);
                }).catch(function (data) {
                    if($scope.blockModal != null) $scope.blockModal.hide();
                    ErrorHandle.handleOneError(data);
                    $scope.btnDisable = false;
                });
            } else{
                // if dont have file: update immedimately
                createUser(isClose);
            }
        };

        function createUser(isClose){
            $scope.user.roles = [];
            $scope.user.username = $scope.user.email;
            $scope.user.type = 0;
            $scope.user.roles = $scope.selectedCbb.role;
            $scope.user.areas = $scope.selectedCbb.area;
            $scope.user.langKey = $window.localStorage.getItem("lang");
            //console.log($scope.user);
            User.create($scope.user).then(function(data){
                if($scope.blockModal != null) $scope.blockModal.hide();
                AlertModalService.popup("success.msg.create");
                $timeout(function () {
                    isClose ? $state.go('users'): $state.go('users-detail',{userId: data.id});
                },1100);
            }).catch(function(data){
                if($scope.blockModal != null) $scope.blockModal.hide();
                ErrorHandle.handleOneError(data);
                $scope.btnDisable = false;
            });
        }

        
        if (angular.element('#form_createuser').length) {
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
        };
        
        $scope.deleteUserAvatar = function () {
            $scope.user.userAvatar = $scope.user.userAvatarBase64 = "";
            $("#user-input-form-file").val("");
        }
    }

})();