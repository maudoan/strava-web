(function () {
    'use strict';
    angular.module('erpApp').controller('ReportDevicesController', ReportDevicesController);

    ReportDevicesController.$inject = ['$rootScope', '$scope', '$state', '$http', '$timeout', 'ErrorHandle', 'HOST_GW',
        'AlertService', '$translate', 'TableController', 'ComboBoxController', 'AlertModalService', 'Report', 'DeviceImport'];

    function ReportDevicesController($rootScope, $scope, $state, $http, $timeout, ErrorHandle, HOST_GW,
                                       AlertService, $translate, TableController, ComboBoxController, AlertModalService, Report, DeviceImport) {
        $scope.ComboBox = {};
        $scope.blockModal = null;
        $scope.blockUI = function () {
            if($scope.blockModal != null)
                $scope.blockModal.hide();
            $scope.blockModal = null;
            $scope.blockModal = UIkit.modal.blockUI('<div class=\'uk-text-center\'>Đang xử lý ...<br/><img class=\'uk-margin-top\' src=\'assets/img/spinners/spinner_success.gif\' alt=\'\'>');
        };
        var currentUser = $rootScope.currentUser;

        $scope.searchInfo ={
            deviceTypeIds: [],
            hasActive: 2,
            modelCodes: [],
            areaCodes: [],
            activeStartDate: null,
            activeEndDate: null,
            importStartDate: null,
            importEndDate: null,
            contractName: null
        }

        var deviceTypeCbb = {
            id: 'deviceType',
            url: '/api/device-types',
            originParams: "",
            valueField: 'id',
            labelField: 'name',
            searchField: 'name',
            table: null,
            column: null,
            maxItems: null,
            ngModel: [],
            options: [],
            placeholder: "nhập loại thiết bị...",
            orderBy: 'name,asc'
        };
        ComboBoxController.init($scope, deviceTypeCbb);

        var deviceModelCbb = {
            id: 'deviceModel',
            url: '/api/device-models',
            originParams: "",
            valueField: 'code',
            labelField: 'name',
            searchField: 'name',
            table: null,
            column: null,
            maxItems: null,
            ngModel: [],
            options: [],
            placeholder: "nhập dòng thiết bị...",
            orderBy: 'name,asc'
        };
        ComboBoxController.init($scope, deviceModelCbb);

        // var areas = currentUser.areaIds.includes(1) ? [{ id: 0, name: "Không khu vực" }] : [];
        var areaCbb = {
            id: 'area',
            url: '/api/areas',
            originParams: "id>1",
            valueField: 'areaCode',
            labelField: 'name',
            searchField: 'name',
            table: null,
            column: null,
            maxItems: null,
            ngModel: [],
            options: [],
            placeholder: "nhập khu vực...",
            orderBy: 'name,asc'
        };
        ComboBoxController.init($scope, areaCbb);

        $("#activeStartDatePicker").kendoDatePicker({
            format: "dd/MM/yyyy",
            change: function() {
                var value = this.value();
                if(value !=null){
                    $scope.searchInfo.activeStartDate = value.getTime()
                } else {
                    $scope.searchInfo.activeStartDate = null;
                }
            }
        });

        $("#activeEndDatePicker").kendoDatePicker({
            format: "dd/MM/yyyy",
            change: function() {
                var value = this.value();
                if(value !=null){
                    $scope.searchInfo.activeEndDate = value.getTime()
                } else {
                    $scope.searchInfo.activeEndDate = null;
                }
            }
        });

        $("#importStartDatePicker").kendoDatePicker({
            format: "dd/MM/yyyy",
            change: function() {
                var value = this.value();
                if(value !=null){
                    $scope.searchInfo.importStartDate = value.getTime()
                } else {
                    $scope.searchInfo.importStartDate = null;
                }
            }
        });

        $scope.selectize_roles_options = [
            {id: 0, name: "Chưa được kích hoạt"},
            {id: 1, name: "Đã được kích hoạt"},
            {id: 2, name: "Tất cả"}
        ];

        $("#importEndDatePicker").kendoDatePicker({
            format: "dd/MM/yyyy",
            change: function() {
                var value = this.value();
                if(value !=null){
                    $scope.searchInfo.importEndDate = value.getTime()
                } else {
                    $scope.searchInfo.importEndDate = null;
                }
            }
        });

        $scope.selectize_roles_config = {
            plugins: {
                'remove_button': {
                    label: ''
                }
            },
            maxItems: 1,
            valueField: 'id',
            labelField: 'name',
            searchField: 'name',
            create: false
        };

        $scope.changeRoles = function(){
            if($scope.searchInfo.hasActive == 0){
                $scope.searchInfo.activeStartDate = null;
                $scope.searchInfo.activeEndDate = null;
                var activeStartDatePicker = $("#activeStartDatePicker").data("kendoDatePicker");
                activeStartDatePicker.value(null);
                activeStartDatePicker.trigger("change");

                var activeEndDatePicker = $("#activeEndDatePicker").data("kendoDatePicker");
                activeEndDatePicker.value(null);
                activeEndDatePicker.trigger("change");
            }
        }

        var areaCodeList = "";
        var areaCodes = [];
        if(!currentUser.areaIds.includes(1)) {
            currentUser.areas.forEach(function (area) {
                areaCodes.push(area.areaCode);
            })
            if(areaCodes.length > 0) {
                areaCodeList = areaCodes.join(',');
            }
        }
        let params = areaCodeList.length > 0 ? "areaCode=in=("+areaCodeList+")" : "";
        // khai bao cau hinh cho bang
        var tableConfig = {
            tableId: "deviceImports",               //table Id
            model: "deviceImports",                 //model
            defaultSort:"serialNumber",          //sap xep mac dinh theo cot nao
            sortType: "asc",                //kieu sap xep
            loadFunction: null,     //api load du lieu
            paramBody: null,
            columns: null,               //bao gom cac cot nao
            handleAfterReload: null,        //xu ly sau khi load du lieu
            handleAfterReloadParams: null,  //tham so cho xu ly sau khi load
            deleteCallback: null,           //delete callback
            loading:false,
            customParams: params,        //dieu kien loc ban dau
            pager_id: "table_user_pager",   //phan trang
            page_id: "user_selectize_page", //phan trang
            page_number_id: "user_selectize_pageNum",   //phan trang
            page_size_option: ["5", "10", "25", "50"]   //lua chon size cua 1 page
        };

        TableController.initTable($scope, tableConfig);     //khoi tao table

        let validate = function (searchInfo) {
            let isValid = true;
            if(searchInfo.activeStartDate != null && searchInfo.activeEndDate != null && searchInfo.activeEndDate < searchInfo.activeStartDate) {
                isValid = false;
                $("#activeEndDatePicker").parent().css("border", "1px solid red");
            } else {
                $("#activeEndDatePicker").parent().css("border", "1px solid #e6e6e6");
            }

            if(searchInfo.importStartDate != null && searchInfo.importEndDate != null && searchInfo.importEndDate < searchInfo.importStartDate) {
                isValid = false;
                $("#importEndDatePicker").parent().css("border", "1px solid red");
            } else {
                $("#importEndDatePicker").parent().css("border", "1px solid #e6e6e6");
            }
            return isValid;
        }

        let customParams = function() {
            let params = "";
            if($scope.searchInfo.deviceTypeIds.length > 0) {
                params += "deviceTypeId=in=("+$scope.searchInfo.deviceTypeIds+");";
            }
            if($scope.searchInfo.hasActive == 0) {
                params += "activeDate==null;";
            }
            if($scope.searchInfo.hasActive == 1) {
                params += "activeDate!=null;";
            }
            if($scope.searchInfo.modelCodes.length > 0) {
                params += "itemCode=in=("+$scope.searchInfo.modelCodes+");";
            }
            if($scope.searchInfo.areaCodes.length > 0) {
                params += "(areaCode=in=("+$scope.searchInfo.areaCodes+"),realArea=in=("+$scope.searchInfo.areaCodes+"));";
            } else if(!currentUser.areaIds.includes(1)) {
                params += "(areaCode=in=("+$scope.searchInfo.areaCodes.concat(areaCodeList).join(",")+")"+
                    ",realArea=in=("+$scope.searchInfo.areaCodes.concat(areaCodeList).join(",")+"));";
            }
            if($scope.searchInfo.activeStartDate != null && $scope.searchInfo.activeStartDate != "") {
                params += "activeDate>=("+$scope.searchInfo.activeStartDate+");";
            }
            if($scope.searchInfo.activeEndDate != null && $scope.searchInfo.activeEndDate != "") {
                params += "activeDate<=("+$scope.searchInfo.activeEndDate+");";
            }
            if($scope.searchInfo.importStartDate != null && $scope.searchInfo.importStartDate != "") {
                params += "created>=("+$scope.searchInfo.importStartDate+");";
            }
            if($scope.searchInfo.importEndDate != null && $scope.searchInfo.importEndDate != "") {
                params += "created<=("+$scope.searchInfo.importEndDate+");";
            }
            if($scope.searchInfo.contractName != null && $scope.searchInfo.contractName != "") {
                params += "contractName=='*"+$scope.searchInfo.contractName+"*';";
            }
            return params;
        }

        $scope.deviceReportInfo = {
            "totalDeviceImport": 0,
            "totalHasDeviceActive": 0,
            "totalHasNotDeviceActive": 0,
            "totalHasContract": 0,
            "deviceImports": []
        }

        $scope.isEmptyData = true;
        $scope.pageNum = 0;
        $scope.isSearching = false;
        $scope.processSearch = function() {
            if(!validate($scope.searchInfo)) {
                AlertService.error("Ngày kết thúc phải lớn hơn ngày bắt đầu");
                return;
            }
            $scope.isSearching = true;
            $scope.blockUI();

            // cộng thêm 1 ngày vì hiện tại endDate đang ở 00h00p nếu endDate tồn tại
            if($scope.searchInfo.activeEndDate != null && $scope.searchInfo.activeEndDate != "") {
                $scope.searchInfo.activeEndDate = parseFloat($scope.searchInfo.activeEndDate) + 86400000;
            }
            if($scope.searchInfo.importEndDate != null && $scope.searchInfo.importEndDate != "") {
                $scope.searchInfo.importEndDate = parseFloat($scope.searchInfo.importEndDate) + 86400000;
            }
            if($scope.searchInfo.hasActive == undefined || $scope.searchInfo.hasActive == null || $scope.searchInfo.hasActive == "") {
                $scope.searchInfo.hasActive = 2; // tất cả danh sách thiết bị
            }
            Report.getReportDevice($scope.searchInfo).then(function (data) {
                $scope.deviceReportInfo.totalDeviceImport = data.totalDeviceImport;
                $scope.deviceReportInfo.totalHasDeviceActive = data.totalHasDeviceActive;
                $scope.deviceReportInfo.totalHasNotDeviceActive = data.totalHasNotDeviceActive;
                $scope.deviceReportInfo.totalHasContract = data.totalHasContract;
                $scope.deviceReportInfo.deviceImports = data.deviceImports;
                $scope.isSearching = false;
                if ($scope.blockModal != null) {$scope.blockModal.hide();}
            });

            $scope.isEmptyData = false;
            tableConfig.customParams = customParams();
            tableConfig.page_size_option = ["5", "10", "25", "50"] ;
            tableConfig.selectize_pageNum = $scope.pageNum;
            tableConfig.loadFunction = DeviceImport.getPage;
            TableController.initTable($scope, tableConfig);
            TableController.sortDefault(tableConfig.tableId);
            TableController.reloadPage(tableConfig.tableId);
        }

        $scope.exportExcel = function () {
            $scope.blockUI();
            Report.exportDeviceExcel($scope.deviceReportInfo).then(function (res) {
                if ($scope.blockModal != null){$scope.blockModal.hide();}
                $scope.downloadUrl = HOST_GW + "/api/files/export?filePath=" + res.url;
                $timeout(function () {
                    angular.element("#exportReport").trigger("click");
                });
            }).catch(function (error) {
                if ($scope.blockModal != null){$scope.blockModal.hide();}
                AlertService.error($translate.instant(error.data.errorKey));
            });
        }

        $scope.exportPdf = function () {
            $scope.blockUI();
            Report.exportDevicePdf($scope.deviceReportInfo).then(function (res) {
                if ($scope.blockModal != null){$scope.blockModal.hide();}
                $scope.downloadUrl = HOST_GW + "/api/files/export?filePath=" + res.url;
                $timeout(function () {
                    angular.element("#exportReport").trigger("click");
                });
            }).catch(function (error) {
                if ($scope.blockModal != null){$scope.blockModal.hide();}
                AlertService.error($translate.instant(error.data.errorKey));
            });
        }
        $(document).keypress(
            function(event){
                if (event.which == '13') {
                    event.preventDefault();
                    $timeout(function () {
                        angular.element("#searchBtn").trigger("click");
                    });
                }
            });
    }
})();