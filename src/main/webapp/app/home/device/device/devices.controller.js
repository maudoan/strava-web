(function(){
    'use strict';
    angular.module('erpApp')
        .controller('DevicesController',DevicesController);

    DevicesController.$inject = ['$rootScope','$scope','$state','$stateParams','$http','$timeout','apiData','User', 'AlertService','$translate','variables','ErrorHandle', '$window','TableController','ComboBoxController'];
    function DevicesController($rootScope,$scope, $state,$stateParams,$http,$timeout,apiData, User, AlertService,$translate, variables, ErrorHandle, $window,TableController,ComboBoxController) {
        $scope.ComboBox = {};
        $scope.page = 0; // 0 - home 1- detail  2 - edit
        $scope.blockModal = null;
        $scope.blockUI = function () {
            if($scope.blockModal != null)
                $scope.blockModal.hide();
            $scope.blockModal = null;
            $scope.blockModal = UIkit.modal.blockUI('<div class=\'uk-text-center\'>Đang xử lý ...<br/><img class=\'uk-margin-top\' src=\'assets/img/spinners/spinner_success.gif\' alt=\'\'>');
        };
        var currentUser = $rootScope.currentUser;

        $(document).keypress(
            function(event){
                if (event.which == '13') {
                    event.preventDefault();
                    $timeout(function () {
                        angular.element("#searchBtn").trigger("click");
                    });
                }
            });

        $scope.input ={
            areaIds: null,
            userId: null,
            deviceName:null,
            uid: null,
            deviceModelIds: null,
            activeDate: null,
            actives: null,
            hasDevice: 2
        }
        var areas = currentUser.areaIds.includes(1) ? [{ id: 0, name: "Không khu vực" }] : [];
        var areaCbx = {
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

        var codeCbx = {
            id: 'code',
            url: '/api/users',
            originParams: "type==1",
            valueField: 'id',
            labelField: 'code',
            searchField: 'code',
            table: null,
            column: null,
            maxItems: 1,
            ngModel: [],
            options: [],
            placeholder: "nhập mã KH...",
            orderBy: 'code,asc'
        };
        ComboBoxController.init($scope, codeCbx);

        var phoneCbx = {
            id: 'phone',
            url: '/api/users',
            originParams: "type==1",
            valueField: 'id',
            labelField: 'username',
            searchField: 'username',
            table: null,
            column: null,
            maxItems: 1,
            ngModel: [],
            options: [],
            placeholder: "nhập số điện thoại...",
            orderBy: 'phone,asc'
        };
        ComboBoxController.init($scope, phoneCbx);

        var emailCbx = {
            id: 'email',
            url: '/api/users',
            originParams: "type==1",
            valueField: 'id',
            labelField: 'email',
            searchField: 'email',
            table: null,
            column: null,
            maxItems: 1,
            ngModel: [],
            options: [],
            placeholder: "nhập email...",
            orderBy: 'email,asc'
        };
        ComboBoxController.init($scope, emailCbx);

        var modelCbx = {
            id: 'model',
            url: '/api/device-models',
            originParams: "",
            valueField: 'id',
            labelField: 'code',
            searchField: 'code',
            table: null,
            column: null,
            maxItems: null,
            ngModel: [],
            options: [],
            placeholder: "nhập dòng thiết bị...",
            orderBy: 'name,asc'
        };
        ComboBoxController.init($scope, modelCbx);

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

        $scope.selectize_active_config = {
            plugins: {
                'remove_button': {
                    label     : ''
                }
            },
            maxItems: null,
            valueField: 'id',
            labelField: 'name',
            searchField: 'name',
            create: false
        };

        $scope.selectize_active_options = [
            {id: 2, name: $translate.instant('global.common.register')},
            {id: 1, name: $translate.instant('global.common.active')},
            {id: 0, name: $translate.instant('global.common.archived')},
            {id: 3, name: $translate.instant('global.common.deleted')}
        ]

        $("#activeDatePicker").kendoDatePicker({
            format: "dd/MM/yyyy",
            change: function() {
                var value = this.value();
                if(value !=null){
                    $scope.input.activeDate = value.getTime()
                } else {
                    $scope.input.activeDate = null;
                }
            }
        });

        $scope.dataSource = [
            {value: 2, title: $translate.instant('global.common.register')},
            {value: 1, title: $translate.instant('global.common.active')},
            {value: 0, title: $translate.instant('global.common.archived')},
            {value: 3, title: $translate.instant('global.common.deleted')}
        ];

        var loadFunction = User.getCustomer;
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
            'active':'Number'
        };

        // khai bao cau hinh cho bang
        var customParams = "type==1"; // lay ENDUSER
        var tableConfig = {
            tableId: "users",               //table Id
            model: "users",                 //model
            defaultSort:"created",          //sap xep mac dinh theo cot nao
            sortType: "desc",                //kieu sap xep
            loadFunction: loadFunction,     //api load du lieu
            paramBody:$scope.input,
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
        TableController.reloadPage(tableConfig.tableId);
        // $scope.$watch('TABLES["users"].loading', function (newVal) {
        //     if(newVal){
        //         $scope.blockUI();
        //     } else {
        //         if ($scope.blockModal != null){$scope.blockModal.hide();}
        //
        //         if($scope.users && $scope.users[0]){
        //             if($scope.users[0].devices){
        //                 $scope.users[0].expand = true
        //             }
        //         }
        //     }
        //
        // }, true);

        $scope.search = function(){
            TableController.reloadPage(tableConfig.tableId);    //load du lieu cho table
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

        $scope.selectCustomer = function(index,user){
            $scope.index = index;
            $scope.page = 1;
            $scope.user = user;
            if($scope.user.areaId){
                var areas =[
                    {
                        id: $scope.user.areaId,
                        name: $scope.user.area,
                    }
                ]
                area2Cbx.options = areas;
                ComboBoxController.init($scope, area2Cbx);
            }
        }

        $scope.back = function(){
            if($scope.page == 1){
                $scope.page = 0;
            } else if($scope.page == 2){
                $scope.page = 1;
            } else if($scope.page == 3){
                $scope.page = 0;
            }
        }

        $scope.edit = function(){
            $scope.page = 2;
            $scope.editUser = Object.assign({}, $scope.user);
        }

        $scope.expand = function(index){
            $scope.users[index].expand = true
        }
        $scope.collapse = function(index){
            $scope.users[index].expand = false
        }
        $scope.refresh = function(){
            $scope.input.areaIds = null
            $scope.input.userId = null
            $scope.input.deviceName = null
            $scope.input.uid = null
            $scope.input.deviceModelIds = null
            $scope.input.activeDate = null
            $scope.input.actives = null
            $scope.input.hasDevice = 2

            var activeDatePicker = $("#activeDatePicker").data("kendoDatePicker");
            activeDatePicker.value(null);
            activeDatePicker.trigger("change");
            $scope.search();
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

        $scope.selectDevice = function(index,device,user){
            $scope.user = user
            $scope.device = device;
            $scope.deviceIndex = index;
            $scope.page = 3;
        }

        $scope.$on('devices', function (event, args) {
            $scope.page = 0
            $scope.refresh();
        });
    }
})();