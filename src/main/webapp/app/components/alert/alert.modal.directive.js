(function() {
    'use strict';
    var modalAlert = {
        template: '<div class="uk-modal" id="alertModal">' +
            '<div class="uk-modal-dialog uk-modal-dialog-small">' +
            '<a id="alertCloseBtn" class="uk-modal-close uk-close" ng-click="remove()" ></a>' +
            '<ul ng-repeat="alert in $ctrl.alerts" style="margin-top: 10px !important;">' +
            '<li class="{{alert.msgClass}}" ng-bind-html="alert.msg"></li>' +
            '</ul>' +
            '</div>' +
            '</div>' +

            '<button ng-show="false" id="alertBtn" class="uk-button" data-uk-modal="{target:\'#alertModal\'}"></button>',

        controller: modalAlertController
    };
    angular
        .module('erpApp')
        .component('modalAlert', modalAlert);

    modalAlertController.$inject = ['$scope', 'AlertModalService','$rootScope'];

    function modalAlertController($scope, AlertModalService,$rootScope) {
        var vm = this;
        vm.alerts = AlertModalService.get();
        $scope.$on('$destroy', function () {
            vm.alerts = [];
        });

        $scope.remove = function () {
            AlertModalService.closeAllAlert();
        }

    }
})();


