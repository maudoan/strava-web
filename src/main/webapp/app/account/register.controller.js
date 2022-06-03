(function() {
    'use strict';

    angular
        .module('erpApp')
        .controller('RegisterController', RegisterController);

    RegisterController.$inject = ['$rootScope', '$state', '$timeout', 'User','$scope','$http','AlertService', '$translate', 'ComboBoxController','$window','JhiLanguageService', 'tmhDynamicLocale'];

    function RegisterController ($rootScope, $state, $timeout, User, $scope, $http, AlertService, $translate, ComboBoxController,$window,JhiLanguageService, tmhDynamicLocale) {
        var vm = this;

        // full màn hình
        $scope.$parent.primarySidebarOpen = false;
        // show register successfully
        $scope.successfully = false;
        
        $scope.blockModal;
        $scope.blockUI = function () {
            if($scope.blockModal != null)
                $scope.blockModal.hide();
            $scope.blockModal = null;
            $scope.blockModal = UIkit.modal.blockUI('<div class=\'uk-text-center\'>Đang xử lý ...<br/><img class=\'uk-margin-top\' src=\'assets/img/spinners/spinner_success.gif\' alt=\'\'>');
        };

        $scope.messages = {
            required: $translate.instant("global.messages.required"),
            maxLength255: $translate.instant("global.messages.maxLength255"),
            maxLength50: $translate.instant("global.messages.maxLength50"),
            maxLength20: $translate.instant("global.messages.maxLength20"),
            email: $translate.instant("global.messages.email"),
            codeMaxLength: $translate.instant("global.messages.codeMaxLength"),
            code_msg: $translate.instant("global.messages.code_msg"),
            phone_msg: $translate.instant("global.messages.phone")
        };
        
     // language switcher
        if($window.localStorage.getItem("lang") !=null){
            $scope.langSwitcherModel = $window.localStorage.getItem("lang")
        } else {
            $scope.langSwitcherModel = 'vn';
        }
        $scope.langSwitcherOptions = [
            {id: 2, title: 'Tiếng Việt', value: 'vn'},
            {id: 1, title: 'English', value: 'gb'}

        ];

        $scope.langSwitcherConfig = {
            maxItems: 1,
            render: {
                option: function(langData, escape) {
                    return  '<div class="option">' +
                        '<i class="item-icon flag-' + escape(langData.value).toUpperCase() + '"></i>' +
                        '<span>' + escape(langData.title) + '</span>' +
                        '</div>';
                },
                item: function(langData, escape) {
                    return '<div class="item">' +
                    			'<i class="item-icon flag-' + escape(langData.value).toUpperCase() + '"></i>' +
                    			'<span> ' + escape(langData.title) + '</span>' +
                    		'</div>';
                }
            },
            valueField: 'value',
            labelField: 'title',
            searchField: 'title',
            create: false,
            onInitialize: function(selectize) {
                $('#lang_switcher').next().children('.selectize-input').find('input').attr('readonly',true);
            },
            onChange: function(value) {
                var langKey = value==='gb' ? 'en' : (value==='vn'? 'vi' : 'en');
                $translate.use(langKey);
                tmhDynamicLocale.set(langKey);
                $window.localStorage.setItem("lang",value)
            }
        };
        $scope.$watch('langSwitcherModel', function() {
            var value = $scope.langSwitcherModel;
            var langKey = value==='gb' ? 'en' : (value==='vn'? 'vi' : 'en');
            $translate.use(langKey);
            tmhDynamicLocale.set(langKey);
        });

        $scope.user = {};
        $scope.submit = function () {
            $('#form_create_account').parsley();
            if(!$scope.form_create_account.$valid) return;
            var $form = $('#form_create_account');
            if(!ComboBoxController.checkIsValidForm($form)) return;

            $scope.user.active = 1;
            $scope.blockUI();
            $scope.user.langKey = $scope.langSwitcherConfig==='gb' ? 'en' : 'vn';
            User.register($scope.user).then(function(data){
                if ($scope.blockModal != null) $scope.blockModal.hide();
                $scope.successfully = true;
            }).catch(function(res){
                if ($scope.blockModal != null) $scope.blockModal.hide();
                if(res && res.data) {
                	if(res.data.errorKey === "error.userAndPermission.emailExists"){
                        AlertService.error($translate.instant(res.data.errorKey));
                	} else  {
                        AlertService.error($translate.instant("global.messages.error.register"));
                    }
                }
            });
        };

        if(angular.element('#form_create_account').length) {
            var $formValidate = $('#form_create_account');
            $formValidate.parsley({
                'excluded': 'input[type=button], input[type=submit], input[type=reset], input[type=hidden], .selectize-input > input'
            }).on('form:validated',function() {
                $scope.$apply();
            }).on('field:validated',function(parsleyField) {
                if($(parsleyField.$element).hasClass('md-input')) {
                    $scope.$apply();
                }
            });
        }
    }
})();
