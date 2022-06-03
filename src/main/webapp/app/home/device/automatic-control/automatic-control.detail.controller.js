(function () {
    'use strict';
    angular.module('erpApp')
        .controller('AutomaticDetailController', AutomaticDetailController);

    AutomaticDetailController.$inject = ['$rootScope', '$scope', '$state', '$http','$stateParams',
        'AlertService', '$translate', 'TableController', 'ComboBoxController', 'AlertModalService',
        'AutomaticControl', 'AutomaticSchedule', '$timeout', '$filter', 'ErrorHandle'];

    function AutomaticDetailController($rootScope, $scope, $state, $http,$stateParams,
                                  AlertService, $translate, TableController, ComboBoxController, AlertModalService,
                                       AutomaticControl, AutomaticSchedule, $timeout, $filter, ErrorHandle) {
        $scope.ComboBox = {};
        $scope.blockModal = null;
        $scope.blockUI = function () {
            if($scope.blockModal != null) $scope.blockModal.hide();
            $scope.blockModal = null;
            $scope.blockModal = UIkit.modal.blockUI('<div class=\'uk-text-center\'>Đang xử lý ...<br/><img class=\'uk-margin-top\' src=\'assets/img/spinners/spinner_success.gif\' alt=\'\'>');
        };

        $scope.messages = {
            required: $translate.instant("global.messages.required"),
            maxLength255: $translate.instant("global.messages.maxLength255"),
            float2_1:$translate.instant("global.messages.float2_1"),
            number_msg: $translate.instant("global.messages.number_msg"),
            min_msg: $translate.instant("global.messages.min_msg")
        };

        var typeOptions = [
            { id: 1, name: 'Trộn dinh dưỡng theo EC và pH'},
            { id: 2, name: 'Trộn dinh dưỡng theo EC'},
            { id: 3, name: 'Trộn dinh dưỡng theo định lượng'},
            { id: 4, name: 'Trộn dinh dưỡng theo định lượng và pH'},
            { id: 5, name: 'Bơm dinh dưỡng cho giá thể/đất'},
            { id: 6, name: 'Bơm dinh dưỡng cho thuỷ canh'},
            { id: 7, name: 'Quạt gió'},
            { id: 8, name: 'Cắt nắng'},
            { id: 9, name: 'Chiếu sáng'}
        ];

        // lịch bơm
        var pumpCbb = {
            id: 'pumpCbb',
            url: '',
            originParams: '',
            valueField: 'id',
            labelField: 'name',
            searchField: 'name',
            table: null,
            column: null,
            maxItems: 1,
            ngModel: [],
            options: [],
            placeholder: 'Chọn lịch bơm'
        };
        ComboBoxController.init($scope, pumpCbb);

        // khai bao cac column va kieu du lieu
        var columns = {
            'id':'Number',
            'serial':'Text',
            'name':'Text',
            'code':'Text',
            'type':'Text',
            'tenantId':'Number',
            'areaId':'Number',
            'typeFarm':'Number',
            'gw':'Text',
            'state':'Text',
            'gatewayId':'Number'
        };

        // khai bao cau hinh cho bang
        var tableConfig = {
            tableId: "automaticSchedules",               //table Id
            model: "automaticSchedules",                 //model
            defaultSort:"timeSchedule",          //sap xep mac dinh theo cot nao
            sortType: "asc",                //kieu sap xep
            loadFunction: AutomaticSchedule.getPage,     //api load du lieu
            columns: columns,               //bao gom cac cot nao
            handleAfterReload: null,        //xu ly sau khi load du lieu
            handleAfterReloadParams: null,  //tham so cho xu ly sau khi load
            deleteCallback: null,           //delete callback
            customParams: "",               //dieu kien loc ban dau
            pager_id: "table_device_pager",   //phan trang
            page_id: "device_selectize_page", //phan trang
            page_number_id: "device_selectize_pageNum",   //phan trang
            page_size_option: ["5", "10", "25", "50"]   //lua chon size cua 1 page
        };

        TableController.initTable($scope, tableConfig);     //khoi tao table
        TableController.sortDefault(tableConfig.tableId);   //set gia tri sap xep mac dinh
        // TableController.reloadPage(tableConfig.tableId);    //load du lieu cho table

        // ==================================
        function reloadCalendar(){
            $scope.dataWaterDay = [];
            var calendar = $("#calendar");
            var kendoCalendar = calendar.data("kendoCalendar");
            if(kendoCalendar) kendoCalendar.destroy();
            calendar.empty();

            calendar.kendoCalendar({
                min: $scope.autoControl.startTime ? new Date($scope.autoControl.startTime) : undefined,
                max: $scope.autoControl.endTime ? new Date($scope.autoControl.endTime) : undefined,
                footer: false
            });
        }

        function refreshCalendar(calendar){
            var elements = calendar.element.find("tbody").find("a");
            elements.each(function () {
                var value = $(this).data('value');
                if($scope.dataWaterDay.includes(value)){
                    $(this).attr("title", "Cấp nước");
                    $(this).parent().addClass("waterFill");
                } else{
                    $(this).attr("title", "Trộn phân");
                    $(this).parent().removeClass("waterFill");
                }
            });
        }

        $scope.getType = function(type){
            var txt = "";
            for(var i = 0; i < typeOptions.length; i++){
                if(typeOptions[i].id === type){
                    txt = typeOptions[i].name;
                    break;
                }
            }

            return txt;
        };

        function calculatorWaterDays (data){
            if(data.waterDays && data.waterDays.length > 0){
                for(var i = 0; i < data.waterDays.length; i++){
                    var date = new Date(data.waterDays[i]);
                    $scope.dataWaterDay.push(date.getFullYear() + "/" + date.getMonth() + "/" + date.getDate());
                }
            }
        }

        // ===========================================
        AutomaticControl.getFull($stateParams.automaticControlId).then(function (data) {
            $scope.autoControl = data;
            $scope.TABLES[tableConfig.tableId].customParams = "type==" + data.type+ ";automaticControlId==" + data.id;
            TableController.reloadPage(tableConfig.tableId);

            $timeout(function () {
                $("#typePump1").prop('disabled', true).prop('checked', !data.typePump).iCheck( 'update');
                $("#typePump2").prop('disabled', true).prop('checked', data.typePump).iCheck( 'update');

                reloadCalendar();
                calculatorWaterDays(data);

                // append ngay tuoi nuoc
                $timeout(function () {
                    refreshCalendar($("#calendar").data("kendoCalendar"));
                }, 500);
            });

            if(!data.waterLevel) $scope.autoControl.waterLevel = 'Vơi';
            else $scope.autoControl.waterLevel = 'Đầy';
        });

        $scope.activate = function (id){
            $scope.blockUI();
            AutomaticControl.activate(id).then(function () {
                TableController.reloadPage(tableConfig.tableId);
                if($scope.blockModal != null) $scope.blockModal.hide();
                $scope.autoControl.state = 1;
            }).catch(function (err) {
                if($scope.blockModal != null) $scope.blockModal.hide();
                ErrorHandle.handleOneError(err);
            });
        };

        $scope.deactivate = function (id){
            $scope.blockUI();
            AutomaticControl.deactivate(id).then(function () {
                TableController.reloadPage(tableConfig.tableId);
                if($scope.blockModal != null) $scope.blockModal.hide();
                $scope.autoControl.state = 0;
            }).catch(function (err) {
                if($scope.blockModal != null) $scope.blockModal.hide();
                ErrorHandle.handleOneError(err);
            });
        };

        $scope.scheduleActivate = function (id, index) {
            $scope.blockUI();
            AutomaticSchedule.activate(id).then(function () {
                $scope.automaticSchedules[index].state = 1;
                if($scope.blockModal != null) $scope.blockModal.hide();
            });
        };

        $scope.scheduleDeactivate = function (id, index) {
            $scope.blockUI();
            AutomaticSchedule.deactivate(id).then(function () {
                $scope.automaticSchedules[index].state = 0;
                if($scope.blockModal != null) $scope.blockModal.hide();
            });
        };

        $scope.showCalendar = false;
        $scope.displayCalendar = function () {
            $scope.showCalendar = !$scope.showCalendar;
        }
    }
})();
