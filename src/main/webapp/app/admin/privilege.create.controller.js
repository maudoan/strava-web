(function(){
    'use strict';
    angular.module('erpApp')
        .controller('PrivilegeCreateController',PrivilegeCreateController);

    PrivilegeCreateController.$inject = ['$rootScope','$scope','$state','Privilege','AlertService', 'ErrorHandle', '$translate'];
    function PrivilegeCreateController($rootScope,$scope, $state, Privilege, AlertService, ErrorHandle, $translate) {
        var vm = this;

        $scope.CbxCreatedBy ={
            url:'/api/users/search?query=',
            key:'email',
            attr:'email',
            prefix:'#/users/',
            suffix:'/detail'
        }

        $scope.privilege = {};
        $scope.submit = function() {
            $('#form_createprivilege').parsley();
            if($scope.form_createprivilege.$valid){
                Privilege.create($scope.privilege)
                    .then(function(){
                        $state.go('privileges');
                    })
                    .catch(function(){
                        AlertService.error('admin.messages.errorCreatePrivilege');
                    })
            }
        }

        if ( angular.element('#form_createprivilege').length ) {
            $scope.required_msg = $translate.instant('admin.messages.required')
            var $formValidate = $('#form_createprivilege');
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