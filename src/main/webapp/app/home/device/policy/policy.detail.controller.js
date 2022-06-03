(function () {
    'use strict';
    angular.module('erpApp')
        .controller('PolicyDetailController', PolicyDetailController);

    PolicyDetailController.$inject = ['$rootScope', '$scope', '$state', '$http','$stateParams','$timeout',
        'AlertService', '$translate', 'TableController', 'ComboBoxController', 'AlertModalService',
        'DeviceModel', 'DeviceType', 'Policy', 'Provider', '$window', 'HOST_GW'];

    function PolicyDetailController($rootScope, $scope, $state, $http,$stateParams,$timeout,
                                         AlertService, $translate, TableController, ComboBoxController,
                                      AlertModalService, DeviceModel, DeviceType, Policy, Provider, $window, HOST_GW) {
        $scope.blockModal = null;
        $scope.blockUI = function () {
            if($scope.blockModal != null) $scope.blockModal.hide();
            $scope.blockModal = null;
            $scope.blockModal = UIkit.modal.blockUI('<div class=\'uk-text-center\'>Đang xử lý ...<br/><img class=\'uk-margin-top\' src=\'assets/img/spinners/spinner_success.gif\' alt=\'\'>');
        };
        $scope.policy = {};
        $scope.CbxActivate = {
            activateService:Policy.activate,
            deactivateService:Policy.deactivate
        }
        Policy.getOne($stateParams.id).then(function (policy) {
        	$scope.policy = policy;
        	if($scope.policy.created){
        		var d = new Date($scope.policy.created),
        	    dformat = [String(d.getDate()).padStart(2, '0'),
        	    		   String(d.getMonth()+1).padStart(2, '0'),
        	               d.getFullYear()].join('-')+' '+
        	              [d.getHours(),
        	               d.getMinutes(),
        	               d.getSeconds()].join(':');
                $scope.createdString = dformat;
            }else $scope.createdString ="";
        	if($scope.policy.fromVersionName == null || $scope.policy.fromVersionName == '' 
        		|| $scope.policy.fromVersionName == undefined) $scope.policy.fromVersionName = 'All';
        });
        
        $scope.policyEdit = function(id){
        	Policy.getOne(id).then(function (policy) {
        		if(policy.active != 2) {
        			AlertModalService.error("error.policy.cannotEdit");
        			$scope.policy = policy;
        		}else $state.go('policy-edit',{id: id});
        	});
        }
    }
})();
