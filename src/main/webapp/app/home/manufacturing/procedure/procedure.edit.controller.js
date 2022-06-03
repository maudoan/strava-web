(function () {
    'use strict';
    angular.module('erpApp')
        .controller('ProcedureEditController', ProcedureEditController);

    ProcedureEditController.$inject = ['$rootScope', '$scope', '$state', '$http',
        'AlertService', '$translate', 'TableController', 'ComboBoxController', 'AlertModalService'];

    function ProcedureEditController($rootScope, $scope, $state, $http,
                                  AlertService, $translate, TableController, ComboBoxController, AlertModalService) {
        var vm = this;
        $scope.ComboBox = {};
    }
})();
