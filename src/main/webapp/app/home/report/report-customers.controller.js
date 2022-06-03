(function () {
    'use strict';
    angular.module('erpApp').controller('ReportCustomersController', ReportCustomersController);

    ReportCustomersController.$inject = ['$rootScope', '$scope', '$state', '$http', '$timeout', 'ErrorHandle', 'HOST_GW',
        'AlertService', '$translate', 'TableController', 'ComboBoxController', 'AlertModalService', 'Report'];

    function ReportCustomersController($rootScope, $scope, $state, $http,$timeout, ErrorHandle, HOST_GW,
                                    AlertService, $translate, TableController, ComboBoxController, AlertModalService, Report) {
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
            deviceTypeIds: null,
            hasDevice: 2,
            modelCodes: null,
            areaIds: null,
            activeStartDate: null,
            activeEndDate: null,
            registerStartDate: null,
            registerEndDate: null
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

        $scope.selectize_roles_config = {
            plugins: {
                'remove_button': {
                    label     : ''
                }
            },
            maxItems: 1,
            valueField: 'id',
            labelField: 'name',
            searchField: 'name',
            create: false
        };

        $scope.selectize_roles_options = [
            {id: 2, name: "Tất cả"},
            {id: 1, name: "Khách hàng có thiết bị"},
            {id: 0, name: "Khách hàng chưa có thiết bị"}
        ]

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

        var areas = currentUser.areaIds.includes(1) ? [{ id: 0, name: "Không khu vực" }] : [];
        var areaCbb = {
            id: 'area',
            url: '/api/areas',
            originParams: "id>1",
            valueField: 'id',
            labelField: 'name',
            searchField: 'name',
            table: null,
            column: null,
            maxItems: null,
            ngModel: [],
            options: areas,
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

        $("#registerStartDatePicker").kendoDatePicker({
            format: "dd/MM/yyyy",
            change: function() {
                var value = this.value();
                if(value !=null){
                    $scope.searchInfo.registerStartDate = value.getTime()
                } else {
                    $scope.searchInfo.registerStartDate = null;
                }
            }
        });

        $("#registerEndDatePicker").kendoDatePicker({
            format: "dd/MM/yyyy",
            change: function() {
                var value = this.value();
                if(value !=null){
                    $scope.searchInfo.registerEndDate = value.getTime()
                } else {
                    $scope.searchInfo.registerEndDate = null;
                }
            }
        });

        $scope.customerReports = [];

        var validate = function (searchInfo) {
            let isValid = true;
            if(searchInfo.activeStartDate != null && searchInfo.activeEndDate != null && searchInfo.activeEndDate < searchInfo.activeStartDate) {
                isValid = false;
                $("#activeEndDatePicker").parent().css("border", "1px solid red");
            } else {
                $("#activeEndDatePicker").parent().css("border", "1px solid #e6e6e6");
            }

            if(searchInfo.registerStartDate != null && searchInfo.registerEndDate != null && searchInfo.registerEndDate < searchInfo.registerStartDate) {
                isValid = false;
                $("#registerEndDatePicker").parent().css("border", "1px solid red");
            } else {
                $("#registerEndDatePicker").parent().css("border", "1px solid #e6e6e6");
            }
            return isValid;
        }

        $scope.reportInfo = {
            totalCustomer: 0,
            totalDevice: 0,
            customerDataReports: []
        }

        $scope.isSearching = false;
        $scope.processSearch = function() {
            if(!validate($scope.searchInfo)) {
                AlertService.error("Lỗi điều kiện tìm kiếm");
                return;
            }

            $scope.blockUI();
            $scope.isSearching = true;
            Report.getReportCustomer($scope.searchInfo).then(function (data) {
                $scope.reportInfo.totalCustomer = data.totalCustomer;
                $scope.reportInfo.totalDevice = data.totalDevice;
                $scope.reportInfo.customerDataReports = data.customerDataReports;
                if ($scope.blockModal != null){$scope.blockModal.hide();}
                $scope.isSearching = false;
            }).catch(function (data) {
                ErrorHandle.handleOneError(data);
                if ($scope.blockModal != null){$scope.blockModal.hide();}
            });
        }

        $scope.countRowspan = function (customerReport) {
            let rowspan = 0;
            customerReport.deviceTypeReports.forEach(function (deviceType) {
                rowspan += deviceType.deviceModelReports.length + 1;
            })
            rowspan = rowspan + customerReport.deviceTypeReports.length;
            return rowspan == 0 ? 1 : rowspan;
        }

        $scope.exportExcel = function () {
            $scope.blockUI();
            Report.exportCustomerExcel($scope.reportInfo).then(function (res) {
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
            Report.exportCustomerPdf($scope.reportInfo).then(function (res) {
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

        $scope.changeRoles = function(){
            if($scope.searchInfo.hasDevice == 0){
                $scope.searchInfo.deviceTypeIds = null;
                $scope.searchInfo.modelCodes = null;
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
