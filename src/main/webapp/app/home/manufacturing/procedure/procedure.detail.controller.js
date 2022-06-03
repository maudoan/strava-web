(function () {
    'use strict';
    angular.module('erpApp')
        .controller('ProcedureDetailController', ProcedureDetailController);

    ProcedureDetailController.$inject = ['$rootScope', '$scope', '$state', '$http',
        'AlertService', '$translate', 'TableController', 'ComboBoxController', 'AlertModalService'];

    function ProcedureDetailController($rootScope, $scope, $state, $http,
                                  AlertService, $translate, TableController, ComboBoxController, AlertModalService) {
        var vm = this;
        $scope.ComboBox = {};
    }
})();
