(function () {
    'use strict';
    angular.module('erpApp')
        .controller('RoleHomeController', RoleHomeController);

    RoleHomeController.$inject = ['$rootScope', '$scope', '$state', 'Role', 'Privilege', 'AlertService', '$translate', 'variables', '$timeout', 'TableController', 'ErrorHandle','ComboBoxController', 'Organization', 'User', '$window'];

    function RoleHomeController($rootScope, $scope, $state, Role, Privilege, AlertService, $translate, variables, $timeout, TableController, ErrorHandle, ComboBoxController, Organization, User, $window) {
        $scope.tenantId = $window.localStorage.getItem('farmId');
        $scope.ComboBox = {};
        $scope.blockModal = null;
        $scope.blockUI = function () {
            if($scope.blockModal != null)
                $scope.blockModal.hide();
            $scope.blockModal = null;
            $scope.blockModal = UIkit.modal.blockUI('<div class=\'uk-text-center\'>Đang xử lý ...<br/><img class=\'uk-margin-top\' src=\'assets/img/spinners/spinner_success.gif\' alt=\'\'>');
        };
        // khai bao cac column va kieu du lieu
        var columns = {
            'id':'Number',
            'name':'Text',
            'description':'Text',
            'type':'Number'
        }

        $scope.typeFields = [
            {value: 0, title: 'Tùy Chọn'},
            {value: 1, title: 'Mặc Định'}
        ];

        User.current().then(function (data) {
            if(data.organizations && data.organizations.length > 0){
                var organization = data.organizations[0];
                $scope.ComboBox['organizationId'].options = [organization];
                // form import
                $scope.idSearch = organization.id;
            }
        }).catch(function (error) {

        });

        // khai bao cau hinh cho bang
        var tableConfig = {
            tableId: "roles",               //table Id
            model: "roles",                 //model
            defaultSort:"created",          //sap xep mac dinh theo cot nao
            sortType: "",                //kieu sap xep
            loadFunction: Role.getPage,     //api load du lieu
            columns: columns,               //bao gom cac cot nao
            handleAfterReload: null,        //xu ly sau khi load du lieu
            handleAfterReloadParams: null,  //tham so cho xu ly sau khi load
            deleteCallback: null,           //delete callback
            customParams: "",               //dieu kien loc ban dau
            pager_id: "table_role_pager",   //phan trang
            page_id: "role_selectize_page", //phan trang
            page_number_id: "role_selectize_pageNum",   //phan trang
            page_size_option: ["5", "10", "25", "50"]   //lua chon size cua 1 page
        }

        TableController.initTable($scope, tableConfig);     //khoi tao table
        TableController.sortDefault(tableConfig.tableId);   //set gia tri sap xep mac dinh
        TableController.reloadPage(tableConfig.tableId);    //load du lieu cho table

        var organizationComboBox = {
            id:'organizationId',
            url:'/api/organizations',
            originParams:'active==1;type=out=(2);physicalLocation==0', // chỉ lấy địa điểm
            valueField:'id',
            labelField:'name',
            searchField:'name',
            table: null,
            column: null,
            maxItems:1,
            ngModel:[],
            options:[],
            placeholder: $translate.instant("global.placeholder.choose")
        };
        ComboBoxController.init($scope, organizationComboBox);

        var firstLoad = false;
        $scope.onChangeLocation = function() {
            if(!firstLoad){
                firstLoad = true;
                return;
            }
            //get list organition child
            if($scope.idSearch == null){
                tableConfig.customParams = "";
                TableController.reloadPage(tableConfig.tableId);    //load du lieu cho table
            } else{
                if($scope.idSearch == 1){
                    tableConfig.customParams = "";
                    TableController.reloadPage(tableConfig.tableId);    //load du lieu cho table
                    return;
                }
                Organization.getChild($scope.idSearch).then(function (data) {
                    tableConfig.customParams = "organizationId=in=" + data;
                    TableController.reloadPage(tableConfig.tableId);    //load du lieu cho table
                });
            }
        };

        // ham xoa mac dinh
        $scope.defaultDelete = function () {
            TableController.defaultDelete(tableConfig.tableId,Role.deleteMany);
        };

        $scope.deleteOne = function(id){
            UIkit.modal.confirm($translate.instant("global.actionConfirm.delete"), function () {
                $scope.blockUI();
                Role.deleteOne(id).then(function () {
                    if($scope.blockModal != null) $scope.blockModal.hide();

                    TableController.reloadPage(tableConfig.tableId);
                    AlertService.success("success.msg.delete");
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
    }

})();