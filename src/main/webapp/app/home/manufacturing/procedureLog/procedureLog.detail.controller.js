(function () {
    'use strict';
    angular.module('erpApp')
        .controller('ProcedureLogDetailController', ProcedureLogDetailController);

    ProcedureLogDetailController.$inject = ['$rootScope', '$scope', '$stateParams',
        'AlertService', '$translate', 'TableController', 'ComboBoxController', 'AlertModalService', 'ErrorHandle', 'ProcedureLog', 'Season'];

    function ProcedureLogDetailController($rootScope, $scope, $stateParams,
                                          AlertService, $translate, TableController, ComboBoxController, AlertModalService, ErrorHandle, ProcedureLog, Season) {
        $scope.procedureLog = {};
        $scope.season = null;
        ProcedureLog.getFull($stateParams.procedureLogId).then(function(data){
            $scope.procedureLog = data;

            Season.getOne(data.seasonId).then(function (season) {
                $scope.season = season;
            });
        }).catch(function (err) {
            ErrorHandle.handleError(err);
        });
    }
})();
