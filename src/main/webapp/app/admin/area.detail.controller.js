(function () {
    'use strict';
    angular.module('erpApp')
        .controller('AreaDetailController', AreaDetailController);

    AreaDetailController.$inject = ['$rootScope', '$scope', '$state','$stateParams', '$http', '$timeout', '$window', 'Principal',
        'AlertService', '$translate', 'TableController', 'Common', 'AlertModalService', 'Area', 'ErrorHandle', 'ComboBoxController'];

    function AreaDetailController($rootScope, $scope, $state,$stateParams, $http, $timeout, $window, Principal,
                                 AlertService, $translate, TableController, Common, AlertModalService, Area, ErrorHandle, ComboBoxController) {
        $scope.blockModal = null;
        $scope.blockUI = function () {
            if($scope.blockModal != null) $scope.blockModal.hide();
            $scope.blockModal = null;
            $scope.blockModal = UIkit.modal.blockUI('<div class=\'uk-text-center\'>Đang xử lý ...<br/><img class=\'uk-margin-top\' src=\'assets/img/spinners/spinner_success.gif\' alt=\'\'>');
        };
        $scope.isAdmin = false;
        if(Principal.hasAnyAuthority(["ROLE_SYSTEM_ADMIN"])) {
            $scope.isAdmin = true;
        }
        $scope.userAreaIds = $rootScope.currentUser.areaIds;
        if(!$scope.userAreaIds.includes(parseInt($stateParams.areaId)) && !$scope.userAreaIds.includes(1)) {
            $state.go('error.403');
        }

        Area.getOne($stateParams.areaId).then(function (response) {
            $scope.area = response;
        })
    }
})();
