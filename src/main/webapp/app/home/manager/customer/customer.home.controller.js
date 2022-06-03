(function(){
    'use strict';
    angular.module('erpApp')
        .controller('CustomerHomeController',CustomerHomeController);

    CustomerHomeController.$inject = ['$rootScope','$scope','$state','$stateParams','$http','$timeout','apiData','User',
        'AlertService','$translate','variables','ErrorHandle', '$window','TableController','ComboBoxController',
        'Device', 'ServicePayment', 'DataPackage', 'ServiceBill', 'AlertModalService', 'ServiceDevice'];
    function CustomerHomeController($rootScope,$scope, $state,$stateParams,$http,$timeout,apiData, User,
        AlertService,$translate, variables, ErrorHandle, $window,TableController,ComboBoxController,
        Device, ServicePayment, DataPackage, ServiceBill, AlertModalService, ServiceDevice) {
        $scope.ComboBox = {};
        $scope.page = 0; // 0 - home; 1- detail;  2 - edit; 3 - bill history detail
        $scope.blockModal = null;
        $scope.blockUI = function () {
            if($scope.blockModal != null)
                $scope.blockModal.hide();
            $scope.blockModal = null;
            $scope.blockModal = UIkit.modal.blockUI('<div class=\'uk-text-center\'>Đang xử lý ...<br/><img class=\'uk-margin-top\' src=\'assets/img/spinners/spinner_success.gif\' alt=\'\'>');
        };

        $(document).keypress(
            function(event){
                if (event.which == '13') {
                    event.preventDefault();
                }
            });

        $scope.dataSource = [
            {value: 2, title: $translate.instant('global.common.register')},
            {value: 1, title: $translate.instant('global.common.active')},
            {value: 0, title: $translate.instant('global.common.archived')},
            {value: 3, title: $translate.instant('global.common.deleted')}
        ];

        var loadFunction = User.getCustomerPage;
        // khai bao cac column va kieu du lieu
        var columns = {
            'id':'Number',
            'email':'Text',
            "type":'Number',
            'username':'Text',
            'phone':'Text',
            'fullName':'Text',
            'created':'DateTime',
            'createdBy':'Text',
            'updated':'DateTime',
            'updatedBy':'Text',
            'active':'Number',
            'areaId':'MultiNumber',
            'code':'Text'
        };

        // khai bao cau hinh cho bang
        var customParams = "type==1"; // lay ENDUSER
        var tableConfig = {
            tableId: "users",               //table Id
            model: "users",                 //model
            defaultSort:"created",          //sap xep mac dinh theo cot nao
            sortType: "desc",                //kieu sap xep
            loadFunction: loadFunction,     //api load du lieu
            columns: columns,               //bao gom cac cot nao
            handleAfterReload: null,        //xu ly sau khi load du lieu
            handleAfterReloadParams: null,  //tham so cho xu ly sau khi load
            deleteCallback: null,           //delete callback
            loading:false,
            customParams: customParams,               //dieu kien loc ban dau
            pager_id: "table_user_pager",   //phan trang
            page_id: "user_selectize_page", //phan trang
            page_number_id: "user_selectize_pageNum",   //phan trang
            page_size_option: ["5", "10", "25", "50"]   //lua chon size cua 1 page
        };

        TableController.initTable($scope, tableConfig);     //khoi tao table
        TableController.sortDefault(tableConfig.tableId);   //set gia tri sap xep mac dinh
        // $scope.$watch('TABLES["users"].loading', function (newVal) {
        //     console.log(newVal)
        //     if(newVal){
        //         $scope.blockUI();
        //     } else {
        //         if ($scope.blockModal != null){$scope.blockModal.hide();}
        //     }
        //
        // }, true);
        TableController.reloadPage(tableConfig.tableId);    //load du lieu cho table

        var areaCbx = {
            id: 'area',
            url: '/api/areas',
            originParams: "id>1",
            valueField: 'id',
            labelField: 'name',
            searchField: 'name',
            table: $scope.TABLES['users'],
            column: 'areaId',
            maxItems: null,
            ngModel: [],
            options: [],
            placeholder: "Tìm kiếm",
            orderBy: 'name,asc'
        };
        ComboBoxController.init($scope, areaCbx);
        var area2Cbx = {
            id: 'area2',
            url: '/api/areas',
            originParams: "id>1",
            valueField: 'id',
            labelField: 'name',
            searchField: 'name',
            table: null,
            column: null,
            maxItems: 1,
            ngModel: [],
            options: [],
            placeholder: null,
            orderBy: 'name,asc'
        };
        ComboBoxController.init($scope, area2Cbx);

        $scope.CbxActivate = {
            activateService:User.activateCustomer,
            deactivateService:User.deactivateCustomer
        }

        $scope.defaultDelete = async function () {
	        var ids = TableController.getSelectedRowIDs(tableConfig.tableId);
	        let query = "query=type==1;active==1;id=in=(" + ids + ")&page=0&size=10000";
    	    var data = await User.getPage(query);
    	    if(data.data == null || data.data == undefined || data.data.length < 1){
    	    	TableController.defaultDelete(tableConfig.tableId,User.deleteMany);
    	    }else {
    	    	AlertService.error($translate.instant("error.userAndPermission.deleteActiveEndUser"));
    	    }
        }
        
        $scope.deleteOne = function (id){
            UIkit.modal.confirm($translate.instant("global.actionConfirm.delete"), function () {
                $scope.blockUI();
                User.deleteOne(id).then(function () {
                    if($scope.blockModal != null) $scope.blockModal.hide();
                    AlertService.success("success.msg.delete");

                    TableController.reloadPage(tableConfig.tableId);
                }).catch(function (data) {
                    if($scope.blockModal != null) $scope.blockModal.hide();
                    ErrorHandle.handleOneError(data);
                });
            }, {
                labels: {
                    'Ok': $translate.instant("global.button.ok"),
                    'Cancel': $translate.instant("global.button.cancel")
                }
            });
        };

        $scope.selectCustomer = function(index,user) {
            $scope.index = index;
            $scope.page = 1;
            $scope.user = user
            $timeout(function () {
                angular.element("#tab1").trigger("click");
            });
            if ($scope.user.areaId) {
                var areas = [
                    {
                        id: $scope.user.areaId,
                        name: $scope.user.area,
                    }
                ]
                area2Cbx.options = areas;
                ComboBoxController.init($scope, area2Cbx);
            }

            // khai bao cac column va kieu du lieu
            var columnsDevice = {
                'name':'Text',
                'uid':'Text',
                'modelCode':'Text',
                'activeDate': 'DateTime',
                'active': 'Number',
                'lastUpdated': 'DateTime'
            };

            // khai bao cau hinh cho bang
            var tableConfigDevice = {
                tableId: "devices",               //table Id
                model: "devices",                 //model
                defaultSort:"created",          //sap xep mac dinh theo cot nao
                sortType: "desc",                //kieu sap xep
                loadFunction: Device.getPage,     //api load du lieu
                paramBody: null,
                columns: columnsDevice,               //bao gom cac cot nao
                handleAfterReload: null,        //xu ly sau khi load du lieu
                handleAfterReloadParams: null,  //tham so cho xu ly sau khi load
                deleteCallback: null,           //delete callback
                customParams: "ownId==" + user.id +";isWeb",               //dieu kien loc ban dau
                pager_id: "table_device_pager",   //phan trang
                page_id: "device_selectize_page", //phan trang
                page_number_id: "device_selectize_pageNum",   //phan trang
                page_size_option: ["5", "10", "25", "50"]   //lua chon size cua 1 page
            };

            TableController.initTable($scope, tableConfigDevice);     //khoi tao table
            TableController.sortDefault(tableConfigDevice.tableId);   //set gia tri sap xep mac dinh
            TableController.reloadPage(tableConfigDevice.tableId);    //load du lieu cho table

            // ================== ServicePayment ==================
            let servicePaymentIds = new Set();
            $scope.servicePaymentSearchInfo = {
                'uid': null,
                'servicePaymentId': Array.from(servicePaymentIds)
            }

            $scope.labelDefaultSearch = $translate.instant("global.placeholder.search");
            // khai bao cac column va kieu du lieu
            var columnsServicePayment = {
                'servicePackageId':'MultiNumber',
                'startTime':'DateTime',
                'endTime':'DateTime'
            };
            var currentTime = new Date().getTime();
            var customParams = "userId==" + user.id + ";endTime>=" + currentTime;
            // khai bao cau hinh cho bang
            var tableConfigServicePayment = {
                tableId: "servicePayments",               //table Id
                model: "servicePayments",                 //model
                defaultSort:"created",          //sap xep mac dinh theo cot nao
                sortType: "desc",                //kieu sap xep
                loadFunction: ServicePayment.customSearch,     //api load du lieu
                paramBody:$scope.servicePaymentSearchInfo,
                columns: columnsServicePayment,               //bao gom cac cot nao
                handleAfterReload: null,        //xu ly sau khi load du lieu
                handleAfterReloadParams: null,  //tham so cho xu ly sau khi load
                deleteCallback: null,           //delete callback
                customParams: customParams,               //dieu kien loc ban dau
                pager_id: "table_service_payment_pager",   //phan trang
                page_id: "service_payment_selectize_page", //phan trang
                page_number_id: "service_payment_selectize_pageNum",   //phan trang
                page_size_option: ["5", "10", "25", "50"]   //lua chon size cua 1 page
            };

            TableController.initTable($scope, tableConfigServicePayment);     //khoi tao table
            TableController.sortDefault(tableConfigServicePayment.tableId);   //set gia tri sap xep mac dinh
            TableController.reloadPage(tableConfigServicePayment.tableId);    //load du lieu cho table
            $scope.handleFilterUid = function () {
                $scope.servicePaymentSearchInfo.servicePaymentId = Array.from(servicePaymentIds);
                TableController.reloadPage(tableConfigServicePayment.tableId);    //load du lieu cho table
                servicePaymentIds = new Set();
            }

            $scope.pushServicePaymentId = function (id) {
                servicePaymentIds.add(id);
            }

            var servicePackageCbb = {
                id: 'servicePackage',
                url: '/api/service-packages',
                originParams: "active==1",
                valueField: 'id',
                labelField: 'name',
                searchField: 'name',
                table: null,
                column: 'servicePackageId',
                maxItems: 1,
                ngModel: [],
                options: [],
                placeholder: "gói cước",
                orderBy: 'name,asc'
            };
            ComboBoxController.init($scope, servicePackageCbb);

            var servicePackageSearchCbb1 = {
                id: 'servicePackageSearch1',
                url: '/api/service-packages',
                originParams: "active==1",
                valueField: 'id',
                labelField: 'name',
                searchField: 'name',
                table: $scope.TABLES["servicePayments"],
                column: 'servicePackageId',
                maxItems: null,
                ngModel: [],
                options: [],
                placeholder: "gói cước",
                orderBy: 'name,asc'
            };
            ComboBoxController.init($scope, servicePackageSearchCbb1);

            $scope.servicePayment = {
                id: null,
                servicePackageId: null,
                userId: user.id
            };

            $scope.isRegister = false;
            $scope.registerServicePayment = function (isRegister) {
                $scope.isRegister = isRegister;
                $scope.isChange = false;
                $scope.tab = 2;
                $scope.servicePayment.servicePackageId = null;
                $scope.servicePayment.id = null;
            }

            $scope.isChange = false;
            $scope.idTemp = 0;
            $scope.changeServicePayment = function (servicePackageId, servicePaymentId) {
                if(servicePackageId == null) {
                    $scope.isChange = false;
                    return;
                }
                $scope.idTemp = servicePaymentId;
                $scope.isChange = true;
                $scope.isRegister = false;
                DataPackage.getOne(servicePackageId).then(function (response) {
                    servicePackageCbb.options = [response];
                    $scope.servicePayment.servicePackageId = servicePackageId;
                    ComboBoxController.init($scope, servicePackageCbb);
                });
            }

            $scope.processRegister = function () {
                UIkit.modal.confirm("Bạn có chắc muốn đăng ký gói cước này?<br/>Đăng ký gói cước mới bạn phải chọn lại thiết bị đăng ký ở trên mobile app.", function () {
                    $scope.isRegister = false;
                    ServicePayment.create($scope.servicePayment).then(function (res) {
                        AlertModalService.popup("success.msg.create");
                        $timeout(function () {
                            TableController.reloadPage(tableConfigServicePayment.tableId);
                            TableController.reloadPage(tableConfigBill.tableId);
                        }, 1100);
                    }).catch(function(err){
                        ErrorHandle.handleOneError(err);
                    })
                }, {
                    labels: {
                        'Ok': $translate.instant("global.button.ok"),
                        'Cancel': $translate.instant("global.button.cancel")
                    }
                });
            }

            $scope.processChange = function (id) {
                UIkit.modal.confirm("Bạn có chắc chắn muốn đổi gói?</br>Đổi gói cước sẽ phải thêm lại thiết bị đăng ký ở trên mobile app. Các thiết bị" +
                    " đã đăng ký trong gói cước cũ sẽ không được gắn với gói cước mới", function () {
                    $scope.isChange = false;
                    $scope.servicePayment.id = id;  // Id của ServicePayment cần đổi
                    ServicePayment.change($scope.servicePayment).then(function (res) {
                        AlertModalService.popup("success.msg.change");
                        currentTime = new Date().getTime() + 10000;
                        customParams = "userId==" + user.id + ";endTime>=" + currentTime;
                        $timeout(function () {
                            tableConfigServicePayment.customParams = customParams;
                            TableController.reloadPage(tableConfigServicePayment.tableId);
                            TableController.reloadPage(tableConfigBill.tableId);
                        }, 1100);
                    }).catch(function(err){
                        ErrorHandle.handleOneError(err);
                    })
                }, {
                    labels: {
                        'Ok': $translate.instant("global.button.ok"),
                        'Cancel': $translate.instant("global.button.cancel")
                    }
                });
            }

            $scope.processDeActivate = function (id) {
                UIkit.modal.confirm("Bạn có chắc chắn muốn hủy gói cước này?", function () {
                    $scope.isChange = false;
                    ServicePayment.deactivate(id).then(function (res) {
                        AlertModalService.popup("success.msg.deactivate");
                        $timeout(function () {
                            TableController.reloadPage(tableConfigServicePayment.tableId);
                            TableController.reloadPage(tableConfigBill.tableId);
                        }, 1100);
                    }).catch(function(err){
                        ErrorHandle.handleOneError(err);
                    })
                }, {
                    labels: {
                        'Ok': $translate.instant("global.button.ok"),
                        'Cancel': $translate.instant("global.button.cancel")
                    }
                });
            }

            // ================== ServiceBill ==================
            // khai bao cac column va kieu du lieu
            var columnsBill = {
                'action':'MultiNumber',
                'servicePackageId':'MultiNumber',
                'datePayment':'DateTime',
            };

            // khai bao cau hinh cho bang
            var tableConfigBill = {
                tableId: "serviceBills",               //table Id
                model: "serviceBills",                 //model
                defaultSort:"created",          //sap xep mac dinh theo cot nao
                sortType: "desc",                //kieu sap xep
                loadFunction: ServiceBill.getPage,     //api load du lieu
                columns: columnsBill,               //bao gom cac cot nao
                handleAfterReload: null,        //xu ly sau khi load du lieu
                handleAfterReloadParams: null,  //tham so cho xu ly sau khi load
                deleteCallback: null,           //delete callback
                customParams: "userId==" + user.id,               //dieu kien loc ban dau
                pager_id: "table_service_bill_pager",   //phan trang
                page_id: "service_bill_selectize_page", //phan trang
                page_number_id: "service_bill_selectize_pageNum",   //phan trang
                page_size_option: ["5", "10", "25", "50"]   //lua chon size cua 1 page
            };

            TableController.initTable($scope, tableConfigBill);     //khoi tao table
            TableController.sortDefault(tableConfigBill.tableId);   //set gia tri sap xep mac dinh
            TableController.reloadPage(tableConfigBill.tableId);    //load du lieu cho table

            // cấu hình filter
            var servicePackageSearchCbb2 = {
                id: 'servicePackageSearch2',
                url: '/api/service-packages',
                originParams: "active==1",
                valueField: 'id',
                labelField: 'name',
                searchField: 'name',
                table: $scope.TABLES["serviceBills"],
                column: 'servicePackageId',
                maxItems: null,
                ngModel: [],
                options: [],
                placeholder: "gói cước",
                orderBy: 'name,asc'
            };
            ComboBoxController.init($scope, servicePackageSearchCbb2);

            var actionCbb = {
                id: 'actionCbb',
                url: null,
                originParams: null,
                valueField: 'id',
                labelField: 'name',
                searchField: 'name',
                table: $scope.TABLES["serviceBills"],
                column: 'action',
                maxItems: null,
                ngModel: [],
                options: [{id: 0, name: "Hủy gói"}, {id: 1, name: "Đăng ký"}, {id: 3, name: "Gia hạn"}],
                placeholder: "hành động",
                orderBy: 'name,asc'
            };
            ComboBoxController.init($scope, actionCbb);
        }

        $scope.selectHistoryDetail = function(index, user, serviceBill) {
            $scope.page = 3;
            $scope.serviceBill = serviceBill;
            $scope.serviceBillAction = serviceBill.action == 0 ? "Hủy gói" : serviceBill.action == 1 ? "Đăng ký" : "Gia hạn";

            // ================== ServiceDevice ==================
            // khai bao cac column va kieu du lieu
            var columnsServiceDevice = {
                'name':'Text',
                'startTime':'Number',
                'endTime':'Number',
                'uid':'Text',
            };

            // khai bao cau hinh cho bang
            var tableConfigServiceDevice = {
                tableId: "serviceDevices",               //table Id
                model: "serviceDevices",                 //model
                defaultSort:"created",          //sap xep mac dinh theo cot nao
                sortType: "desc",                //kieu sap xep
                loadFunction: ServiceDevice.getPage,     //api load du lieu
                columns: columnsServiceDevice,               //bao gom cac cot nao
                handleAfterReload: null,        //xu ly sau khi load du lieu
                handleAfterReloadParams: null,  //tham so cho xu ly sau khi load
                deleteCallback: null,           //delete callback
                customParams: "servicePaymentId==" + serviceBill.servicePaymentId + ";userId==" + user.id,               //dieu kien loc ban dau
                pager_id: "table_service_payment_pager",   //phan trang
                page_id: "service_payment_selectize_page", //phan trang
                page_number_id: "service_payment_selectize_pageNum",   //phan trang
                page_size_option: ["5", "10", "25", "50"]   //lua chon size cua 1 page
            };

            TableController.initTable($scope, tableConfigServiceDevice);     //khoi tao table
            TableController.sortDefault(tableConfigServiceDevice.tableId);   //set gia tri sap xep mac dinh
            TableController.reloadPage(tableConfigServiceDevice.tableId);    //load du lieu cho table
        }

        $scope.back = function(){
            if($scope.page == 1){
                $scope.page = 0;
            } else if($scope.page == 2 || $scope.page == 3){
                $scope.page = 1;
            }
        }

        $scope.edit = function(){
            $scope.page = 2;
            $scope.editUser = Object.assign({}, $scope.user);
        }

        $scope.btnDisable = false;
        $scope.submit = function(isClose) {
            var $form = $("#form_createuser");
            $('#form_createuser').parsley();
            if(!$scope.form_createuser.$valid) return;
            if(!ComboBoxController.checkIsValidForm($form)) return;
            if($scope.btnDisable) return;

            $scope.btnDisable = true;
            $scope.blockUI();
            updateUser(isClose);
        };

        function updateUser(isClose){
            User.update($scope.editUser).then(function(data){
                $scope.btnDisable = false;
                $scope.editUser.area = data.area
                $scope.user = $scope.editUser;
                $scope.users[$scope.index] = $scope.editUser;
                if($scope.blockModal != null) $scope.blockModal.hide();
                AlertService.success("success.msg.update");
                $timeout(function () {
                    if(isClose){
                        $scope.page = 0
                    } else {
                        $scope.page = 1
                    }
                },500);

            }).catch(function(data){
                $scope.btnDisable = false;
                if($scope.blockModal != null) $scope.blockModal.hide();
                ErrorHandle.handleOneError(data);
                $scope.btnDisable = false;
            })
        }

        $scope.$on('dashboard', function (event, args) {
            $scope.page = 0;
        });

        $scope.refresh = function(){
            $state.go("dashboard",{},{reload:true})
        }

        $scope.tab = 1;
        $scope.clickTab = function (i) {
            $scope.tab = i;
        };
    }
})();