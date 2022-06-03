(function () {
    'use strict';
    angular.module('erpApp')
        .controller('DataPackageDetailController', DataPackageDetailController);

    DataPackageDetailController.$inject = ['$rootScope', '$scope', '$state', '$http','$stateParams','$timeout',
        'AlertService', '$translate', 'TableController', 'ComboBoxController', 'AlertModalService', 'DataPackage', '$window'];

    function DataPackageDetailController($rootScope, $scope, $state, $http,$stateParams,$timeout,
                                  AlertService, $translate, TableController, ComboBoxController, AlertModalService, DataPackage, $window) {
        $scope.blockModal = null;
        $scope.blockUI = function () {
            if($scope.blockModal != null) $scope.blockModal.hide();
            $scope.blockModal = null;
            $scope.blockModal = UIkit.modal.blockUI('<div class=\'uk-text-center\'>Đang xử lý ...<br/><img class=\'uk-margin-top\' src=\'assets/img/spinners/spinner_success.gif\' alt=\'\'>');
        };
        $scope.capacityUnits= [
        	{ id: 0, name: 'KB'},
            { id: 1, name: 'MB'},
            { id: 2, name: 'GB'},
            { id: 3, name: 'TB'},
            { id: 4, name: 'PB'},
            { id: 5, name: 'EB'}
        ];
        $scope.dataPackage = {};
        $scope.CbxActivate = {
            activateService:DataPackage.activate,
            deactivateService:DataPackage.deactivate
        }
        $scope.reload =function (){
            DataPackage.getOne($stateParams.packageId).then(function (data) {
                $scope.dataPackage = data;
            })
        }

        $scope.reload();

        $scope.showRefresh = true;
        $scope.refresh = function(){
            $scope.blockUI();
            $scope.showRefresh = false;
            DataPackage.getOne($scope.dataPackage.id).then(function (data) {
                $scope.dataPackage = data;
            });
            $timeout(function () {
                $scope.showRefresh = true;
                if($scope.blockModal != null) $scope.blockModal.hide();
            },2000);
        }

        $scope.deleteOne = function (id) {
            UIkit.modal.confirm("Bạn có chắc muốn xóa?", function () {
                DataPackage.deleteOne(id).then(function () {
                    AlertService.success($translate.instant('global.success.delete'));
                    if($scope.dataPackage.active == 0) {
                        $timeout(function () {
                            $state.go('packages');
                        }, 1100);
                    } else {
                        $scope.dataPackage.active = 3;
                    }
                }).catch(function (error) {
                    ErrorHandle.handleError(error);
                });
            }, {
                labels: {
                    'Ok': $translate.instant("global.button.ok"),
                    'Cancel': $translate.instant("global.button.cancel")
                }
            });
        }
    }
})();
