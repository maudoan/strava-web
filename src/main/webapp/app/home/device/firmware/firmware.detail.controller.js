(function () {
    'use strict';
    angular.module('erpApp')
        .controller('FirmwareDetailController', FirmwareDetailController);

    FirmwareDetailController.$inject = ['$rootScope', '$scope', '$state', '$http','$stateParams','$timeout',
        'AlertService', '$translate', 'TableController', 'ComboBoxController', 'AlertModalService',
        'DeviceModel', 'DeviceType', 'Firmware', 'Provider', '$window', 'HOST_GW','Policy', 'AesCrypt'];

    function FirmwareDetailController($rootScope, $scope, $state, $http,$stateParams,$timeout,
                                         AlertService, $translate, TableController, ComboBoxController,
                                      AlertModalService, DeviceModel, DeviceType, Firmware, Provider, $window, HOST_GW,Policy, AesCrypt) {
        $scope.blockModal = null;
        $scope.blockUI = function () {
            if($scope.blockModal != null) $scope.blockModal.hide();
            $scope.blockModal = null;
            $scope.blockModal = UIkit.modal.blockUI('<div class=\'uk-text-center\'>Đang xử lý ...<br/><img class=\'uk-margin-top\' src=\'assets/img/spinners/spinner_success.gif\' alt=\'\'>');
        };
        $scope.firmware = {};
        $scope.urlFirmware = null;
        Firmware.getOne($stateParams.firmwareId).then(function (firmware) {
            if(!firmware.filePath) {
                $scope.urlFirmware = HOST_GW + "/attachment/firmwares/" + firmware.fileName;
            }
            firmware.size = Math.round(firmware.size / 1024 / 1024);
            $scope.firmware = firmware;
            if($scope.firmware.created){
	    		var d = new Date($scope.firmware.created),
	    	    dformat = [String(d.getDate()).padStart(2, '0'),
	    	    		   String(d.getMonth()+1).padStart(2, '0'),
	    	               d.getFullYear()].join('-')+' '+
	    	              [d.getHours(),
	    	               d.getMinutes(),
	    	               d.getSeconds()].join(':');
	            $scope.createdString = dformat;
	        }else $scope.createdString ="";
            if($scope.firmware.username != null && $scope.firmware.username != "") {
                $scope.firmware.username = AesCrypt.decrypt($scope.firmware.username);
            }
            if($scope.firmware.password != null && $scope.firmware.password != "") {
                $scope.firmware.password = AesCrypt.decrypt($scope.firmware.password);
            }
        });

        $scope.editFirmwares = function () {
        	var params = "query=fromVersion=='*,"+$stateParams.firmwareId+",*',versioning=="+$stateParams.firmwareId+",exceptVersion=='*"+$stateParams.firmwareId+"*'";
            Policy.checkUsedPolicy(params).then(function (response) {
            	var policies = response.data;
            	if(policies != null && policies.length > 0){
            		AlertService.error("error.firmware.alreadyUsedInPolicyCannotEdit");
            	}else{
                    //$scope.blockUI();
                    $state.go('firmwares-edit',{firmwareId: $stateParams.firmwareId});
            	}
            });
        }
    }
})();
