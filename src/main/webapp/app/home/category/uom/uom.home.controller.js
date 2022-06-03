(function(){
    'use strict';
    angular.module('erpApp')
        .controller('UomHomeController', UomHomeController);

    UomHomeController.$inject = ['$rootScope', '$scope', '$state', 'Uom',
        'Organization', 'User', '$http', 'AlertService','$translate',
        'TableController', 'ComboBoxController', 'ErrorHandle', '$timeout', 'Principal'];
    function UomHomeController($rootScope, $scope, $state, Uom,
                               Organization, User, $http, AlertService,
                               $translate, TableController, ComboBoxController,
                               ErrorHandle, $timeout, Principal) {
        $scope.ComboBox = {};

        $scope.blockModal = null;
        $scope.blockUI = function () {
            if($scope.blockModal != null)
                $scope.blockModal.hide();
            $scope.blockModal = null;
            $scope.blockModal = UIkit.modal.blockUI('<div class=\'uk-text-center\'>Please Wait...<br/><img class=\'uk-margin-top\' src=\'assets/img/spinners/spinner_success.gif\' alt=\'\'>');
        };
        if(Principal.hasAnyAuthority(["ROLE_SYSTEM_ADMIN"])) {
            $scope.isAdmin = true;
        }

        // khai bao cac column va kieu du lieu
        var columns = {
            'id': 'Number',
            'name': 'Text',
            'type':'Number',
            'description': 'Text',
            'active':'Number',
            'created': 'DateTime',
            'createdBy': 'Text',
            'updated': 'DateTime',
            'updatedBy': 'Text',
            'pronunciation': 'Text',
            'uomTypeId':'MultiNumber',
            'isDefault':'Number'
        };

        var tenantId = window.localStorage.getItem("farmId");
        var customParams = "(tenantId == " + tenantId + ";tenantId!=null, isDefault==1)";
        // khai bao cau hinh cho bang
        var tableConfig = {
            tableId: "uoms",            //table Id
            model: "uoms",             //model
            defaultSort:"created",          //sap xep mac dinh theo cot nao
            sortType: "desc",                //kieu sap xep
            loadFunction: Uom.getPageFull,     //api load du lieu
            columns: columns,               //bao gom cac cot nao
            handleAfterReload: null,        //xu ly sau khi load du lieu
            handleAfterReloadParams: null,  //tham so cho xu ly sau khi load
            deleteCallback: null,           //delete callback
            customParams: customParams,               //dieu kien loc ban dau
            pager_id: "table_uom_pager",   //phan trang
            page_id: "uom_selectize_page", //phan trang
            page_number_id: "uom_selectize_pageNum",   //phan trang
            page_size_option: ["5", "10", "25", "50"]   //lua chon size cua 1 page
        };

        TableController.initTable($scope, tableConfig);     //khoi tao table
        TableController.sortDefault(tableConfig.tableId);   //set gia tri sap xep mac dinh
        TableController.reloadPage(tableConfig.tableId);    //load du lieu cho table

        var customParams = "(tenantId == " + tenantId + ";tenantId!=null, isDefault==1)";
        var uomTypeComboBox = {
            id:'uom-uomTypeId',
            url:'/api/uomTypes',
            originParams: customParams,
            valueField:'id',
            labelField:'name',
            searchField:'name',
            table: $scope.TABLES['uoms'],
            column: 'uomTypeId',
            maxItems:1,
            ngModel:[],
            options:[],
            placeholder: $translate.instant("global.placeholder.choose")
        };
        ComboBoxController.init($scope, uomTypeComboBox);

        // =================================================
        // ham xoa mac dinh
        $scope.defaultDelete = function () {
            TableController.defaultDelete(tableConfig.tableId, Uom.deleteMany);
            // TableController.deleteWithMessages(tableConfig.tableId, Uom.deleteMany, $translate.instant("admin.menu.uom"));
        };


        //delete one row
        $scope.deleteOne= function (id) {
            UIkit.modal.confirm($translate.instant("infrastructure.uom.deleteUom"), function () {
                Uom.deleteOne(id).then(function (data) {
                    AlertService.success("success.msg.delete");
                    TableController.reloadPage(tableConfig.tableId);
                }).catch(function (error) {
                    TableController.highlightRowError(tableConfig.tableId, JSON.parse(error.data.params));
                    ErrorHandle.handleOneError(error);
                });
            }, {
                labels: {
                    'Ok': $translate.instant("global.button.ok"),
                    'Cancel': $translate.instant("global.button.cancel")
                }
            })
        };

        // import excel
        $scope.importExcel = function(){

            var file = $("#form-file")[0].files[0];
            if(!file) {
                AlertService.error("Vui lòng chọn file để tiến hành import dữ liệu");
                return;
            }

            var fileName = file.name;
            // check file excel
            if(fileName.substr(-5, 5) !== '.xlsx' && fileName.substr(-4,4) !== '.xls') {
                AlertService.error("admin.messages.errorTypeUpload");
                return;
            }

            if(!$scope.organizationId){
                AlertService.error("Vui lòng chọn doanh nghiệp cần import dữ liệu");
                return;
            }

            // file lớn hơn 20MB
            if(file.size > 20 * 1024 * 1024) {
                AlertService.error('error.messages.errorMaximum');
                return;
            }

            var organizationId = $scope.organizationId ? parseInt($scope.organizationId) : 1;

            $scope.blockUI();
            Uom.importExcel(file, "uom", organizationId).then(function(data){
                $scope.blockModal.hide();

                if(!data.fileName) {
                    AlertService.success("Tải dữ liệu thành công");
                    $timeout(function () {
                        $state.go($state.current, {}, { reload: true });
                    }, 1200);
                }
                else{
                    AlertService.success("Tải lên lỗi");
                    $scope.downloadUrl = "api/download?filePath=" + data.fileName;
                    $timeout(function () {angular.element("#exportBtn").trigger("click");});
                }
            }).catch(function (data) {
                $scope.blockModal.hide();
                UIkit.modal("#modal_overflow", {}).hide();
                ErrorHandle.handleOneError(data);
            });
        }
    }
})();