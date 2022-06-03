(function () {
    'use strict';
    angular.module('erpApp')
        .controller('AutomaticEditController', AutomaticEditController);

    AutomaticEditController.$inject = ['$rootScope', '$scope', '$state', '$stateParams','$timeout',
        'AlertService', '$translate', 'TableController', 'ComboBoxController', 'AlertModalService',
        'ErrorHandle', 'Area', 'Device', 'Product', 'DateTimeValidation',
        '$filter', 'AutomaticControl', 'AutomaticSchedule', '$window'];

    function AutomaticEditController($rootScope, $scope, $state, $stateParams,$timeout,
                                       AlertService, $translate, TableController, ComboBoxController, AlertModalService,
                                       ErrorHandle, Area, Device, Product, DateTimeValidation,
                                     $filter, AutomaticControl, AutomaticSchedule, $window) {
        $scope.tenantId = $window.localStorage.getItem("farmId") ? $window.localStorage.getItem("farmId") : 0;
        $scope.ComboBox = {};
        DateTimeValidation.init($scope);
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
            min_msg: $translate.instant("global.messages.min_msg"),
            maxInteger3: $translate.instant("global.messages.maxInteger3"),
            greaterThanZero: $translate.instant("global.messages.greaterThanZero"),
            maxInteger2: $translate.instant("global.messages.maxInteger2")
        };

        function genDate(time) {
            return $filter('date')(time, 'dd/MM/yyyy');
        }

        function genTime(time) {
            return $filter('date')(time, 'HH:mm:ss');
        }

        $scope.oldData = {
            tenantId: null,
            areaId: null,
            seasonId: null,
            productId: null,
            groupDeviceId: null,
            type: null
        };

        $scope.areaIds = []; // list area ids trong là con của areaId hiện tại
        $scope.autoControl = {
            areaId: 0,
            gatewayId: 0,
            seasonId: 0,
            productId: 0,
            productName: null,
            seasonName: null,
            areaName: null,
            phaseId: 0,
            waterLevel: 1, // 0 vơi, 1 đầy
            dataWaterDay: [],
            waterDays: [],
            checkAndMixBefore: 0, // kiểm tra và vộn trước (phút)
            timeAeration: 0, // thoi gian suc khi truoc khi chay bom
            automaticSchedules: [], // gio bom
            typePump: false,
            timeInverter: 0,
            timePumpExecute: null,
            timePumpStop: null,
            timeAerationExecute: null,
            timeAerationStop: null,
            scheduleDeletes: []
        };

        $scope.cbbSelected = {
            product: null,
            season: null,
            area: null,
            groupDevice: null,
            gateway: null,
            farm: null
        };

        // tenant combobox
        var farmCbb = {
            id: 'farmCbb',
            url: '/api/tenants',
            originParams: '',
            valueField: 'id',
            labelField: 'name',
            searchField: 'name',
            table: null,
            column: null,
            maxItems: 1,
            ngModel: [],
            options: [],
            placeholder: 'Chọn trang trại',
            orderBy: 'name,asc'
        };
        ComboBoxController.init($scope, farmCbb);

        // area combobox
        var areaCbb = {
            id: 'areaCbb',
            url: '/api/areas',
            originParams: 'tenantId==0',
            valueField: 'id',
            labelField: 'name',
            searchField: 'name',
            table: null,
            column: null,
            maxItems: 1,
            ngModel: [],
            options: [],
            placeholder: 'Chọn khu vực',
            orderBy: 'name,asc'
        };
        ComboBoxController.init($scope, areaCbb);

        // area combobox
        var seasonCbb = {
            id: 'seasonCbb',
            url: '/api/seasons',
            originParams: 'areaId==0',
            valueField: 'id',
            labelField: 'name',
            searchField: 'name',
            table: null,
            column: null,
            maxItems: 1,
            ngModel: [],
            options: [],
            placeholder: 'Chọn đợt',
            orderBy: 'name,asc'
        };
        ComboBoxController.init($scope, seasonCbb);

        // phase combobox
        var phaseCbb = {
            id: 'phaseCbb',
            url: '/api/phases',
            originParams: 'seasonId==0',
            valueField: 'id',
            labelField: 'name',
            searchField: 'name',
            table: null,
            column: null,
            maxItems: 1,
            ngModel: [],
            options: [],
            placeholder: 'Chọn giai đoạn'
        };
        ComboBoxController.init($scope, phaseCbb);

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
        // type combobox
        var typeCbb = {
            id: 'typeCbb',
            url: '',
            originParams: '',
            valueField: 'id',
            labelField: 'name',
            searchField: 'name',
            table: null,
            column: null,
            maxItems: 1,
            ngModel: [],
            options: typeOptions,
            placeholder: 'Chọn chế độ'
        };
        ComboBoxController.init($scope, typeCbb);

        // phase combobox
        var groupDeviceCbb = {
            id: 'groupDeviceCbb',
            url: '/api/group-devices',
            replaceUrl: '/search?query=',
            originParams: '',
            valueField: 'id',
            labelField: 'name',
            searchField: 'name',
            table: null,
            column: null,
            maxItems: 1,
            ngModel: [],
            options: [],
            placeholder: 'Chọn thiết bị điều khiển'
        };
        ComboBoxController.init($scope, groupDeviceCbb);

        // lịch bơm
        var pumpCbb = {
            id: 'pumpCbb',
            url: '/api/automatic-controls',
            originParams: 'gatewayId==0',
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

        // lịch bơm
        var waterLevelOptions = [
            {id: 0, name: 'Vơi'},
            {id: 1, name: 'Đầy'}
        ];
        var waterLevelCbb = {
            id: 'waterLevelCbb',
            url: '',
            originParams: '',
            valueField: 'id',
            labelField: 'name',
            searchField: 'name',
            table: null,
            column: null,
            maxItems: 1,
            ngModel: [],
            options: waterLevelOptions,
            placeholder: 'Chọn mực nước'
        };
        ComboBoxController.init($scope, waterLevelCbb);

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
        // khai bao cau hinh cho bang
        var tableConfig = {
            tableId: "automaticSchedules",               //table Id
            model: "automaticSchedules",                 //model
            defaultSort:"timeSchedule",          //sap xep mac dinh theo cot nao
            sortType: "asc",            //kieu sap xep
            loadFunction: AutomaticSchedule.getPage,     //api load du lieu
            columns: columns,               //bao gom cac cot nao
            handleAfterReload: null,        //xu ly sau khi load du lieu
            handleAfterReloadParams: null,  //tham so cho xu ly sau khi load
            deleteCallback: null,           //delete callback
            customParams: "",               //dieu kien loc ban dau
            pager_id: "table_device_pager",   //phan trang
            page_id: "device_selectize_page", //phan trang
            page_number_id: "device_selectize_pageNum",   //phan trang
            page_size_option: ["50", "100", "250", "500"]   //lua chon size cua 1 page
        };

        TableController.initTable($scope, tableConfig);     //khoi tao table
        TableController.sortDefault(tableConfig.tableId);   //set gia tri sap xep mac dinh
        // TableController.reloadPage(tableConfig.tableId);    //load du lieu cho table

        // ==================================
        function onReloadDatepicker(){
            $("#startTime")
                .on("blur", function () {
                    DateTimeValidation.onBlurDate($(this), false);
                })
                .kendoDatePicker({
                    format: "dd/MM/yyyy",
                    change: function () {
                        $scope.autoControl.startTime = this.value() != null ? this.value().getTime() : null;
                        reloadCelander();
                    }
                });
            $("#endTime")
                .on("blur", function () {
                    DateTimeValidation.onBlurDate($(this), false);
                })
                .kendoDatePicker({
                    format: "dd/MM/yyyy",
                    change: function () {
                        $scope.autoControl.endTime = this.value() != null ? this.value().getTime() : null;
                        reloadCelander();
                    }
                });

            $("#timeTurnOn").on("blur", function () {
                DateTimeValidation.onBlurTime($(this), false);
            }).kendoTimePicker({
                format: "HH:mm:ss",
                change: function () {
                    $scope.autoControl.timeTurnOn = this.value() != null ? this.value().getTime() : null;
                }
            });

            $("#timeTurnOff").on("blur", function () {
                DateTimeValidation.onBlurTime($(this), false);
            }).kendoTimePicker({
                format: "HH:mm:ss",
                change: function () {
                    $scope.autoControl.timeTurnOff = this.value() != null ? this.value().getTime() : null;
                }
            });

            $("#startTimeCutSun").on("blur", function () {
                DateTimeValidation.onBlurTime($(this), false);
            }).kendoTimePicker({
                format: "HH:mm:ss",
                change: function () {
                    $scope.autoControl.timeTurnOn = this.value() != null ? this.value().getTime() : null;
                }
            });

            $("#endTimeCutSun").on("blur", function () {
                DateTimeValidation.onBlurTime($(this), false);
            }).kendoTimePicker({
                format: "HH:mm:ss",
                change: function () {
                    $scope.autoControl.timeTurnOff = this.value() != null ? this.value().getTime() : null;
                }
            });

            // $("#calendar").kendoCalendar({ footer: false });
        }

        // $timeout(function () {
        //     onReloadDatepicker();
        // }, 1000);

        // ==================== CBB EVENT ===================
        $scope.areaChange = function(){
            $timeout(function () {
                if($scope.oldData.areaId == $scope.autoControl.areaId) return;
                $scope.oldData.areaId = $scope.autoControl.areaId;

                var area = $scope.cbbSelected.area && $scope.cbbSelected.area[0] ? $scope.cbbSelected.area[0] : {};
                $scope.autoControl.areaName = area && area.name ? area.name : null;

                var areaId = $scope.autoControl.areaId ? $scope.autoControl.areaId : 0;
                if(!areaId){
                    $scope.areaIds = [];
                    refreshSeasonCbb();
                    refreshGroupDeviceCbb();
                    return;
                }

                // get child area
                Area.getChild(areaId).then(function (res) {
                    $scope.areaIds = res.data;
                    refreshSeasonCbb();
                    refreshGroupDeviceCbb();
                }).catch(function (err) {
                    console.log(err);
                });
            });
        };

        $scope.seasonChange = function(){
            $timeout(function () {
                if($scope.oldData.seasonId == $scope.autoControl.seasonId) return;
                $scope.oldData.seasonId = $scope.autoControl.seasonId;

                // get info product and kv sx
                var season = $scope.cbbSelected.season && $scope.cbbSelected.season[0] ? $scope.cbbSelected.season[0] : {};
                $scope.autoControl.seasonName = season && season.name ? season.name : null;

                var seasonId = $scope.autoControl.seasonId ? $scope.autoControl.seasonId : 0;
                // get product
                if(seasonId && season.productId){
                    Product.getOne(season.productId).then(function (product) {
                        $scope.cbbSelected.product = product;
                        $scope.autoControl.productId = product.id;
                        $scope.autoControl.productName = product.name;
                    }).catch(function (err) {
                        ErrorHandle.handleOneError(err);
                    });

                } else{
                    $scope.autoControl.productId = null;
                    $scope.autoControl.productName = null;
                    $scope.autoControl.product = null;
                }
                refreshPhaseCbb();
            });
        };

        $scope.groupDeviceChange = function () {
            $timeout(function () {
                if($scope.oldData.groupDeviceId == $scope.autoControl.groupDeviceId) return;
                $scope.oldData.groupDeviceId = $scope.autoControl.groupDeviceId;
                if($scope.cbbSelected.groupDevice && $scope.cbbSelected.groupDevice[0]){
                    var groupDevice = $scope.cbbSelected.groupDevice[0];
                    $scope.autoControl.gatewayId = groupDevice.gatewayId;
                    $scope.cbbSelected.gateway = groupDevice.gateway;

                    pumpCbb.resetScroll = true;
                    pumpCbb.options = [""];
                    pumpCbb.originParams = "tenantId==" + $scope.autoControl.tenantId + ";type==6;gatewayId==" + $scope.autoControl.gatewayId;
                    ComboBoxController.init($scope, pumpCbb);
                } else{
                    $scope.autoControl.gatewayId = null;
                    $scope.cbbSelected.gateway = null;
                    pumpCbb.originParams = "tenantId==" + $scope.autoControl.tenantId + ";gatewayId==0";
                    ComboBoxController.init($scope, pumpCbb);
                }
            })
        };

        $scope.onChangeType = function () {
            $timeout(function () {
                if($scope.oldData.type == $scope.autoControl.type) return;
                $scope.oldData.type = $scope.autoControl.type;

                groupDeviceCbb.options = [];
                ComboBoxController.init($scope, groupDeviceCbb);

                pumpCbb.options = [];
                ComboBoxController.init($scope, pumpCbb);

                $scope.autoControl.ecFrom = 0;
                $scope.autoControl.ecTo = 0;
                $scope.autoControl.phFrom = 0;
                $scope.autoControl.phTo = 0;
                $scope.autoControl.checkAndMixBefore = 0;
                $scope.autoControl.waterLevel = 1;
                $scope.autoControl.timeAeration = 0;
                $scope.autoControl.typePump = false;
                $scope.autoControl.timePumpExecute = 0;
                $scope.autoControl.timePumpStop = 0;
                $scope.autoControl.turnOffWhen = 0;
                $scope.autoControl.turnOnWhen = 0;
                $scope.autoControl.timeAerationExecute = 0;
                $scope.autoControl.timeAerationStop = 0;

                var timeTurnOn = $("#timeTurnOn").data("kendoTimePicker");
                timeTurnOn.value(null);
                timeTurnOn.trigger("change");

                var timeTurnOff = $("#timeTurnOff").data("kendoTimePicker");
                timeTurnOff.value(null);
                timeTurnOff.trigger("change");

                // reset lich tron
                reloadCelander();

                $timeout(function () {
                    $scope.invalidTimeEnd = false;
                    $scope.autoControl.automaticSchedules = [];
                    $scope.automaticSchedules = [];
                    resetFormSchedule(true);
                    resetFormSchedule(false);

                    $("#groupDeviceCbb").parsley().reset();
                });
            });
        };

        // Tự động gen ra nếu đã có điều khiển tự động của cùng đợt/giai đoạn tạo trước đó
        $scope.phaseChange = function () {
            $timeout(function () {
                if($scope.oldData.phaseId == $scope.autoControl.phaseId) return;
                $scope.oldData.phaseId = $scope.autoControl.phaseId;

                var phaseId = $scope.autoControl.phaseId ? $scope.autoControl.phaseId : 0;
                AutomaticControl.getPage("query=tenantId==" + $scope.tenantId + ";phaseId==" + phaseId + "&size=1&page=0&sort=created,desc").then(function (old) {
                    var oldData = old.data && old.data[0] ? old.data[0] : {};

                    $("#startTime").parsley().reset();
                    $("#endTime").parsley().reset();

                    refreshDatePicker('startTime', oldData.startTime);
                    refreshDatePicker('endTime', oldData.endTime);
                });
            });
        };

        function refreshCbb(cbb, options, originParams){
            cbb.resetScroll = true;
            cbb.options = options;
            cbb.originParams = originParams;
            ComboBoxController.init($scope, cbb);
        }

        function refreshSeasonCbb(){
            var areaIds = $scope.areaIds ? $scope.areaIds : 0;
            seasonCbb.resetScroll = true;
            seasonCbb.options = [""];
            seasonCbb.originParams = "tenantId==" + $scope.autoControl.tenantId + ";areaId=in=(" + areaIds + ");state!=2";
            ComboBoxController.init($scope, seasonCbb);
        }

        function refreshPhaseCbb(){
            var seasonId = $scope.autoControl.seasonId ? $scope.autoControl.seasonId : 0;
            phaseCbb.resetScroll = true;
            phaseCbb.options = [""];
            phaseCbb.originParams = "tenantId==" + $scope.autoControl.tenantId + ";seasonId==" + seasonId;
            ComboBoxController.init($scope, phaseCbb);
        }

        function refreshGroupDeviceCbb(){
            var areaIds = $scope.areaIds ? $scope.areaIds : 0;
            groupDeviceCbb.resetScroll = true;
            groupDeviceCbb.options = [""];
            // lay trong khu vuc do va khu vuc con, trang thai khac dieu khien bang tay
            groupDeviceCbb.originParams = "tenantId==" + $scope.autoControl.tenantId + ";areaId=in=(" + areaIds + ");state!=0";
            ComboBoxController.init($scope, groupDeviceCbb);
        }

        function reloadCelander(){
            $scope.autoControl.dataWaterDay = [];
            $scope.autoControl.waterDays = [];
            var calendar = $("#calendar");
            var kendoCalendar = calendar.data("kendoCalendar");
            if(kendoCalendar) kendoCalendar.destroy();
            calendar.empty();

            calendar.kendoCalendar({
                min: $scope.autoControl.startTime ? new Date($scope.autoControl.startTime) : undefined,
                max: $scope.autoControl.endTime ? new Date($scope.autoControl.endTime) : undefined,
                footer: false,
                change: function() {
                    if(!this.value()) return;
                    setValueWater(this.value());
                },
                navigate: function(e){
                    refreshCalendar(this);
                }
            });
        }

        function setValueWater(val){
            var fullDay = val.getFullYear() + "/" + val.getMonth() + "/" + val.getDate();
            // đã đc chọn từ trước thì sẽ là bỏ chọn
            if($scope.autoControl.dataWaterDay.includes(fullDay)){
                var index = $scope.autoControl.dataWaterDay.indexOf(fullDay);
                var index2 = $scope.autoControl.waterDays.indexOf(val.getTime());

                if (index !== -1) $scope.autoControl.dataWaterDay.splice(index, 1);
                if (index2 !== -1)  $scope.autoControl.waterDays.splice(index2, 1);
            } else{
                $scope.autoControl.dataWaterDay.push(fullDay);
                $scope.autoControl.waterDays.push(val.getTime());
            }

            // reset calendar - clear value
            resetCalendar();
            // reload cap nuoc
            refreshCalendar($("#calendar").data("kendoCalendar"));
        }

        function refreshCalendar(calendar){
            var elements = calendar.element.find("tbody").find("a");
            elements.each(function () {
                var value = $(this).data('value');
                if($scope.autoControl.dataWaterDay && $scope.autoControl.dataWaterDay.includes(value)){
                    $(this).attr("title", "Cấp nước");
                    $(this).parent().addClass("waterFill");
                } else{
                    $(this).attr("title", "Trộn phân");
                    $(this).parent().removeClass("waterFill");
                }
            });
        }

        function resetCalendar(){
            var calendar = $("#calendar").data("kendoCalendar");
            calendar.value(null);
            calendar.trigger('change');
        }

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

        function calculatorWaterDays (data){
            $scope.autoControl.dataWaterDay = [];
            if(data.waterDays && data.waterDays.length > 0){
                for(var i = 0; i < data.waterDays.length; i++){
                    var date = new Date(data.waterDays[i]);
                    $scope.autoControl.dataWaterDay.push(date.getFullYear() + "/" + date.getMonth() + "/" + date.getDate());
                }
            }
            $scope.autoControl.waterDays = data.waterDays;
        }

        // bơm = 1 bơm thì k cần đảo bơm
        $scope.firstLoad = true;
        $scope.$watch('autoControl.typePump', function (val) {
            if($scope.firstLoad) {
                $scope.firstLoad = false; return;
            }
            if(!val) {
                $("#timeInverter").parsley().reset();
                $scope.autoControl.timeInverter = 0;
            } else{
                $("#timePumpExecute").parsley().reset();
                $("#timePumpStop").parsley().reset();
                $scope.autoControl.timePumpExecute = 0;
                $scope.autoControl.timePumpStop = 0;
            }
        });
        // ================= ACTION ==============================
        function reloadTimePicker(id){
            $("#" + id).on("blur", function () {
                DateTimeValidation.onBlurTime($(this), false);
            }).kendoTimePicker({
                format: "HH:mm",
                change: function () {
                    if(id === 'timeTurnOn' || id === 'startTimeCutSun'){
                        $scope.autoControl.timeTurnOn = this.value() != null ? this.value().getTime() : null;
                        $scope.invalidTimeEnd = false;
                        if(id === 'timeTurnOn' && $scope.autoControl.timeTurnOn) $("#timeTurnOn").parsley().reset();
                        if(id === 'startTimeCutSun' && $scope.autoControl.timeTurnOn) $("#startTimeCutSun").parsley().reset();
                    } else if(id === 'timeTurnOff' || id === 'endTimeCutSun'){
                        $scope.autoControl.timeTurnOff = this.value() != null ? this.value().getTime() : null;
                        $scope.invalidTimeEnd = false;
                        if(id === 'timeTurnOff' && $scope.autoControl.timeTurnOn) $("#timeTurnOff").parsley().reset();
                        if(id === 'endTimeCutSun' && $scope.autoControl.timeTurnOn) $("#endTimeCutSun").parsley().reset();
                    } else if(id === 'timeSchedule' || id === 'editTimeSchedule'){
                        $scope.newSchedule.timeSchedule = this.value() != null ? this.value().getTime() : null;
                    }
                }
            });
        }

        function refreshTimePicker (id, val){
            $timeout(function () {
                var timePicker = $("#" + id).data("kendoTimePicker");
                if(!val) timePicker.value(null);
                else timePicker.value(genTime(val));
                timePicker.trigger('change');
            });
        }

        function refreshDatePicker (id, val){
            var datePickerInit = $("#" + id);
            datePickerInit.on("blur", function () {
                DateTimeValidation.onBlurDate($(this), false);
            }).kendoDatePicker({
                format: "dd/MM/yyyy",
                change: function () {
                    if(id === 'startTime'){
                        $scope.autoControl.startTime = this.value() != null ? this.value().getTime() : null;
                        if($scope.autoControl.startTime) $scope.invalidDayEnd = false;
                        reloadCelander();
                    } else if(id === 'endTime'){
                        $scope.autoControl.endTime = this.value() != null ? this.value().getTime() : null;
                        if($scope.autoControl.endTime) $scope.invalidDayEnd = false;
                        reloadCelander();
                    }
                }
            });

            $timeout(function () {
                var datePicker = $("#" + id).data("kendoDatePicker");
                if(!val) datePicker.value(null);
                else datePicker.value(genDate(val));
                datePicker.trigger('change');
            });
        }

        function resetFormSchedule(isNew){
            $scope.newSchedule = {};
            if(isNew){
                $scope.addAutomaticSchedule = false;
            } else{
                $scope.editAutomaticSchedule = false;
                $scope.editAutomaticSchedulePos = null;
            }
        }

        // GIỜ BƠM
        $scope.newSchedule = {};
        $scope.addAutomaticSchedule = false;
        $scope.editAutomaticSchedule = false;
        $scope.editAutomaticSchedulePos = null;
        $scope.onAddSchedule = function (){
            if($scope.addAutomaticSchedule) return;
            $scope.addAutomaticSchedule = true;
            reloadTimePicker('timeSchedule');
            refreshTimePicker('timeSchedule', null);
        };

        $scope.saveSchedule = function ($event, index){
            var $element = $event.target;
            var tr = $($element).closest('tr');
            // check valid form
            if(!ComboBoxController.checkIsValidForm(tr)) return;

            // check valid form
            var isNew = index == null || false;
            // la them moi
            if(!checkExitsSchedule(index)){
                if(isNew){
                    $scope.automaticSchedules.push($scope.newSchedule);
                } else{
                    // xac nhan da dc sua
                    $scope.newSchedule.isEdit = true;
                    $scope.automaticSchedules[index] = $scope.newSchedule;
                }

                ComboBoxController.resetCheckValidForm(tr);
                resetFormSchedule(isNew);
            } else{
                var txt = "Giờ bật bơm châm phân A, B và sục khí đã tồn tại";
                if($scope.autoControl.type == 5) txt = "Giờ bơm đã tồn tại";
                if($scope.autoControl.type == 7) txt = "Giờ bật đã tồn tại";
                AlertService.error(txt);
            }
        };

        $scope.onEditSchedule = function($event, index){
            $scope.addAutomaticSchedule = false;
            $scope.editAutomaticSchedule = true;
            $scope.editAutomaticSchedulePos = index;
            var editSchedule = angular.copy($scope.automaticSchedules[index]);
            $scope.newSchedule = editSchedule;

            $timeout(function () {
                reloadTimePicker('editTimeSchedule');
                refreshTimePicker('editTimeSchedule', editSchedule.timeSchedule);
            });

            $timeout(function () {
                var $element = $event.target;
                var tr = $($element).closest('tr');
                // reset valid form
                ComboBoxController.resetCheckValidForm(tr);
            })
        };

        //delete an item
        $scope.deleteSchedule = function (index) {
            var schedules = $scope.automaticSchedules;
            // 1 mảng chưa data bị xoá
            if(schedules[index].id){
                var scheduleDeletes = $scope.autoControl.scheduleDeletes ? $scope.autoControl.scheduleDeletes : [];
                scheduleDeletes.push(schedules[index].id);
                $scope.autoControl.scheduleDeletes = scheduleDeletes;
            }
            $scope.automaticSchedules = schedules.slice(0, index).concat(schedules.slice(index + 1));
            resetFormSchedule(!$scope.editAutomaticSchedule);
        };

        $scope.cancelSchedule = function($event, isNew){
            var $element = $event.target;
            var tr = $($element).closest('tr');
            // reset valid form
            ComboBoxController.resetCheckValidForm(tr);

            resetFormSchedule(isNew);
        };

        function checkExitsSchedule(index){
            var newSchedule = $scope.newSchedule;
            var schedules = $scope.autoControl.automaticSchedules;
            if(!schedules || schedules.length < 1) return false;
            var exitst = false;

            for (var i = 0; i < schedules.length; i++){
                if(angular.isDefined(index) && index === i) continue;
                // giờ chạy
                var timeStart = schedules[i].timeSchedule;
                // giờ chạy + số phút bắt đầu lần lượt của bơm A, bơm B
                var timeStartA = timeStart + (schedules[i].timeExecute * 60 * 1000);
                var timeStartB = null;
                if(schedules[i].timeExecute2){
                    timeStartB = timeStart + (schedules[i].timeExecute2 * 60 * 1000);
                }

                if(newSchedule.timeSchedule === timeStart ||
                    (newSchedule.timeSchedule >= timeStart && newSchedule.timeSchedule <= timeStartA) ||
                    (timeStartB && newSchedule.timeSchedule >= timeStart && newSchedule.timeSchedule <= timeStartB) ||
                    (newSchedule.timeSchedule < timeStart && (newSchedule.timeSchedule + newSchedule.timeExecute * 60 * 1000) >= timeStart) ||
                    (newSchedule.timeExecute2 && newSchedule.timeSchedule < timeStart && (newSchedule.timeSchedule + newSchedule.timeExecute2 * 60 * 1000) >= timeStart)){
                    exitst = true;
                    break;
                }
            }

            return exitst;
        }
        // ===========================================
        $scope.blockUI();
        AutomaticControl.getFull($stateParams.automaticControlId).then(function (data) {
            onReloadDatepicker();
            $scope.oldData = {
                tenantId: data.tenantId,
                areaId: data.areaId,
                seasonId: data.seasonId,
                productId: data.productId,
                groupDeviceId: data.groupDeviceId,
                phaseId: data.phaseId,
                type: data.type
            };
            data.groupDevice.gateway = data.gateway;
            data.groupDevice.gatewayId = data.gatewayId;
            $scope.autoControl = angular.copy(data);

            $scope.TABLES[tableConfig.tableId].customParams = "tenantId==" + data.tenantId + ";type==" + data.type+ ";automaticControlId==" + data.id;
            TableController.reloadPage(tableConfig.tableId);

            $timeout(function () {
                // refresh cbb
                refreshCbb(areaCbb, [{ id: data.areaId, name: data.areaName}], "tenantId==" + data.tenantId);
                // get child area
                Area.getChild(data.areaId).then(function (res) {
                    $scope.areaIds = res.data;
                    refreshCbb(seasonCbb, [data.season], "tenantId==" + data.tenantId + ";areaId=in=(" + $scope.areaIds.toString()  +");state!=2");
                    refreshCbb(groupDeviceCbb, [data.groupDevice], "tenantId==" + data.tenantId + ";areaId=in=(" + $scope.areaIds.toString()  +");state!=0");
                }).catch(function (err) {
                    console.log(err);
                });
                refreshCbb(phaseCbb, [data.phase], "tenantId==" + data.tenantId + ";seasonId==" + data.seasonId);
                $scope.autoControl.groupDevice.gateway = data.gateway;
                $scope.cbbSelected.gateway = data.gateway;

                // lich bom
                var pumpParams = "tenantId==" + data.tenantId + ";type==6;gatewayId==" + $scope.autoControl.gatewayId;
                refreshCbb(pumpCbb, [$scope.autoControl.pumpSchedule], pumpParams);
                $scope.autoControl.pumpScheduleId = data.pumpScheduleId;

                // refresh timepicker start - end
                refreshDatePicker('startTime', data.startTime);
                refreshDatePicker('endTime', data.endTime);

                // reset combo time check
                if(data.timeTurnOn){
                    reloadTimePicker('timeTurnOn');
                    reloadTimePicker('startTimeCutSun');
                    refreshTimePicker('timeTurnOn', data.timeTurnOn);
                    refreshTimePicker('startTimeCutSun', data.timeTurnOn);
                }
                if(data.timeTurnOff){
                    reloadTimePicker('timeTurnOff');
                    reloadTimePicker('endTimeCutSun');
                    refreshTimePicker('timeTurnOff', data.timeTurnOff);
                    refreshTimePicker('endTimeCutSun', data.timeTurnOff);
                }

                $("#typePump1").prop('checked', !data.typePump).iCheck( 'update');
                $("#typePump2").prop('checked', data.typePump).iCheck( 'update');

                // reloadCalendar();
                $timeout(function () {
                    // append ngay tuoi nuoc
                    calculatorWaterDays(data);
                    refreshCalendar($("#calendar").data("kendoCalendar"));
                    if($scope.blockModal != null) $scope.blockModal.hide();
                }, 500);
            });
        }).catch(function (err) {
            if($scope.blockModal != null) $scope.blockModal.hide();
        });

        // ================= SUBMIT ======================
        $scope.invalidDayEnd = false;
        $scope.invalidTimeEnd = false;
        $scope.btnDisable = false;
        $scope.submit = function(isClose) {
            if($scope.btnDisable) return;
            var $form = $("#group_device_form");
            $('#group_device_form').parsley();
            if(!$scope.group_device_form.$valid) return;
            if(!ComboBoxController.checkIsValidForm($form)) return;

            if($scope.autoControl.startTime > $scope.autoControl.endTime){
                AlertService.error("Ngày kết lúc luôn lớn hơn hoặc bằng ngày bắt đầu");
                $scope.invalidDayEnd = true;
                return;
            }

            if($scope.autoControl.timeTurnOn && $scope.autoControl.timeTurnOff && $scope.autoControl.timeTurnOn >= $scope.autoControl.timeTurnOff){
                AlertService.error("Thời gian kết lúc luôn lớn hơn thời gian bắt đầu");
                $scope.invalidTimeEnd = true;
                return;
            }

            $scope.invalidTimeEnd = false;
            $scope.invalidDayEnd = false;
            // kiem tra xem da co lich trong giai doan + dot nay chua
            AutomaticControl.getPage("query=tenantId==" + $scope.tenantId + ";id!=" + $scope.autoControl.id + ";seasonId==" + $scope.autoControl.seasonId + ";phaseId==" + $scope.autoControl.phaseId).then(function (data) {
                // Giai đoạn này đã có lịch điều khiển tự động, thay đổi thời gian của lịch sẽ thay đổi các lịch điều khiển tự động khác của giai đoạn đã tạo. Ban có chắc chắn muốn thực hiện?
                if(data.data && data.data.length > 0){
                    UIkit.modal.confirm("Giai đoạn này đã có lịch điều khiển tự động, thay đổi thời gian của lịch sẽ thay đổi các lịch điều khiển tự động khác của giai đoạn đã tạo. Ban có chắc chắn muốn thực hiện?", function () {
                        $scope.btnDisable = true;
                        $scope.blockUI();
                        createAutomaticControl(isClose);
                    }, {
                        labels: {
                            'Ok': $translate.instant("global.button.ok"),
                            'Cancel': $translate.instant("global.button.cancel")
                        }
                    });
                } else{
                    $scope.btnDisable = true;
                    $scope.blockUI();
                    createAutomaticControl(isClose);
                }
            });
        };
        function createAutomaticControl(isClose){
            $scope.autoControl.automaticSchedules = $scope.automaticSchedules;

            AutomaticControl.update($scope.autoControl).then(function(data){
                if($scope.blockModal != null) $scope.blockModal.hide();
                // $scope.device = data;
                AlertModalService.popup("success.msg.update");
                $timeout(function () {
                    isClose ? $state.go('automatic-controls'): $state.go('automatic-control-detail',{automaticControlId: data.id});
                },1100);
                $scope.btnDisable = false;
            }).catch(function(error){
                if($scope.blockModal != null) $scope.blockModal.hide();
                error.data.errorKey = $translate.instant(error.data.errorKey, {exitsName: error.data.entityName});
                ErrorHandle.handleOneError(error);
                $scope.btnDisable = false;
            });
        }

        // ================ VALIDATE FORM INITIAL ============
        var $formValidate = $('#group_device_form');
        $formValidate.parsley({
            'excluded': 'input[type=button], input[type=submit], input[type=reset], input[type=hidden], .selectize-input > input'
        }).on('form:validated',function() {
            $scope.$apply();
        }).on('field:validated',function(parsleyField) {
            if($(parsleyField.$element).hasClass('md-input')) {
                $scope.$apply();
            }
        });
    }
})();
