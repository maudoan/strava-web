(function(){
    'use strict';
    angular.module('erpApp')
        .controller('UserHomeController',UserHomeController);

    UserHomeController.$inject = ['$rootScope','$scope','$state','$stateParams','$http','$timeout','apiData','User',
        'AlertService','$translate','variables','ErrorHandle', '$window','TableController','ComboBoxController', 'HOST_GW'];
    function UserHomeController($rootScope,$scope, $state,$stateParams,$http,$timeout,apiData, User, AlertService,$translate,
                                variables, ErrorHandle, $window,TableController,ComboBoxController, HOST_GW) {
        $scope.ComboBox = {};
        $scope.input ={
            areaIds:[],
            roleIds: []
        }
        function getPage(params) {
            if($scope.input.areaIds == null) $scope.input.areaIds = []
            return $http.get(HOST_GW + '/api/users/search-operator?areaIds=' + $scope.input.areaIds +"&roleIds=" + $scope.input.roleIds + "&" + params).then(function (response) {
                return response;
            });
        }

        $scope.blockModal = null;
        $scope.blockUI = function () {
            if($scope.blockModal != null)
                $scope.blockModal.hide();
            $scope.blockModal = null;
            $scope.blockModal = UIkit.modal.blockUI('<div class=\'uk-text-center\'>Đang xử lý ...<br/><img class=\'uk-margin-top\' src=\'assets/img/spinners/spinner_success.gif\' alt=\'\'>');
        };
        $scope.hostGW = HOST_GW;

        var roleCbx = {
            id: 'role',
            url: '/api/roles',
            originParams: 'id!=0',
            valueField: 'id',
            labelField: 'name',
            searchField: 'name',
            table: null,
            column: null,
            maxItems: null,
            ngModel: [],
            options: [],
            placeholder: null,
            orderBy: 'id,asc'
        };
        ComboBoxController.init($scope, roleCbx);

        var areaCbx = {
            id: 'area',
            url: '/api/areas',
            originParams: null,
            valueField: 'id',
            labelField: 'name',
            searchField: 'name',
            table: null,
            column: null,
            maxItems: null,
            ngModel: [],
            options: [],
            placeholder: null,
            orderBy: 'id,asc'
        };
        ComboBoxController.init($scope, areaCbx);
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
        var customParams = "type==0";
        var tableConfig = {
            tableId: "users",               //table Id
            model: "users",                 //model
            defaultSort:"created",          //sap xep mac dinh theo cot nao
            sortType: "desc",                //kieu sap xep
            loadFunction: getPage,     //api load du lieu
            columns: columns,               //bao gom cac cot nao
            handleAfterReload: null,        //xu ly sau khi load du lieu
            handleAfterReloadParams: null,  //tham so cho xu ly sau khi load
            deleteCallback: null,           //delete callback
            customParams: customParams,               //dieu kien loc ban dau
            pager_id: "table_user_pager",   //phan trang
            page_id: "user_selectize_page", //phan trang
            page_number_id: "user_selectize_pageNum",   //phan trang
            page_size_option: ["5", "10", "25", "50"]   //lua chon size cua 1 page
        }

        TableController.initTable($scope, tableConfig);     //khoi tao table
        TableController.sortDefault(tableConfig.tableId);   //set gia tri sap xep mac dinh
        TableController.reloadPage(tableConfig.tableId);    //load du lieu cho table

        $scope.search = function(){
            TableController.reloadPage(tableConfig.tableId);
        }
        // ham xoa mac dinh
         $scope.defaultDelete = async function () {
             TableController.defaultDelete(tableConfig.tableId,User.deleteMany);
         };

        // active mac dinh
        $scope.activate = function () {
            TableController.defaultActive(tableConfig.tableId,User.active);
        }

        //deactivate mac dinh
        $scope.deactivate = function () {
            TableController.defaultDeactive(tableConfig.tableId,User.deactivate);
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

        $scope.handleActive = function(id,email,active){
            $scope.activeUserId = id;
            $scope.activeUser = active;
            $scope.userEmail = email;
            if(active==1){
                $scope.activeMsg = $translate.instant("admin.user.inactiveUser");
            } else {
                $scope.activeMsg = $translate.instant("admin.user.activeUser");
            }
            $timeout(function () {
                angular.element("#activeBtn").trigger("click");
            });
        }

        $scope.activeOne = function(){
            var ids = [];
            ids.push($scope.activeUserId);
            if($scope.activeUser == 1){
                User.deactivate(ids).then(function () {
                    AlertService.success("success.msg.update");
                    TableController.reloadPage(tableConfig.tableId);
                }).catch(function(data){
                    ErrorHandle.handleError(data);
                });
            } else {
                User.activate(ids).then(function () {
                    AlertService.success("success.msg.update");
                    TableController.reloadPage(tableConfig.tableId);
                }).catch(function(data){
                    ErrorHandle.handleError(data);
                });
            }
        }

        var emailComboBox = {
            id:'users-email',
            url:'/api/users',
            originParams:'',
            valueField:'email',
            labelField:'email',
            searchField:'email',
            table:$scope.TABLES['users'],
            column:'email',
            maxItems:1,
            ngModel:[],
            options:[],
            placeholder:$translate.instant("global.placeholder.search")
        }

        ComboBoxController.init($scope,emailComboBox);

        $scope.importExcel = function() {
            var file = $("#form-file")[0].files[0];
            if(!file) {
                AlertService.error("error.messages.chooseFile");
                return;
            }

            var fileName = file.name;
            // check file excel
            if(fileName.substr(-5, 5) !== '.xlsx' && fileName.substr(-4, 4) !== '.xls') {
                AlertService.error("admin.messages.errorTypeUpload");
                return;
            }

            // file lớn hơn 20MB
            if(file.size > 20 * 1024 * 1024) {
                AlertService.error('error.messages.errorMaximum');
                return;
            }

            $scope.blockUI();
            User.importExcel(file).then(function(data){
                $scope.blockModal.hide();
                UIkit.modal("#modal_overflow", {}).hide();

                if(!data.fileName) {
                    AlertService.success("success.msg.upload");
                    $timeout(function () {
                        $state.go($state.current, {}, { reload: true });
                    }, 1200);
                }
                else{
                    AlertService.error("error.messages.uploadFail");
                }
            }).catch(function (data) {
                $scope.blockModal.hide();
                ErrorHandle.handleError(data);
                $("#form-file").val('');
            });
        }
    }

})();