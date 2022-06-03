(function () {
    'use strict';
    angular.module('erpApp')
        .controller('ProcedureCreateController', ProcedureCreateController);

    ProcedureCreateController.$inject = ['$rootScope', '$scope', '$state', '$http',
        'AlertService', '$translate', 'TableController', 'ComboBoxController', 'AlertModalService'];

    function ProcedureCreateController($rootScope, $scope, $state, $http,
                            AlertService, $translate, TableController, ComboBoxController, AlertModalService) {
        var vm = this;
        $scope.ComboBox = {};

    }
})();
