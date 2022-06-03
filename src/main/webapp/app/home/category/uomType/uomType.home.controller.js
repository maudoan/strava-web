(function(){
    'use strict';
    angular.module('erpApp')
        .controller('UomTypeHomeController', UomTypeHomeController);

    UomTypeHomeController.$inject = ['$rootScope', '$scope', '$state', 'UomType', 'Organization', '$http', 'AlertService',
        '$translate', 'TableController', 'ComboBoxController', 'User', 'ErrorHandle', '$timeout','HOST_GW', 'Principal'];
    function UomTypeHomeController($rootScope, $scope, $state, UomType, Organization, $http, AlertService, $translate,
                                   TableController, ComboBoxController, User, ErrorHandle, $timeout,HOST_GW, Principal) {
        var vm = this;
        $scope.host=HOST_GW;
        $scope.ComboBox = {};
        $scope.organizationId = "";

        $scope.blockModal;
        $scope.blockUI = function () {
            if($scope.blockModal != null)
                $scope.blockModal.hide();
            $scope.blockModal = null;
            $scope.blockModal = UIkit.modal.blockUI('<div class=\'uk-text-center\'>Please Wait...<br/><img class=\'uk-margin-top\' src=\'assets/img/spinners/spinner_success.gif\' alt=\'\'>');
        };
        if(Principal.hasAnyAuthority(["ROLE_SYSTEM_ADMIN"])) {
            $scope.isAdmin = true;
        }

        // check
        User.current().then(function (data) {
            if(data.organizations && data.organizations.length > 0){
                var organization = data.organizations[0];
                // form search
                $scope.ComboBox['organizationId'].options = [organization];
                $scope.organizationId = organization.id;
            }
            var all = { id : 1, name: 'Tất cả' };
            $scope.ComboBox['searchComboBox'].options = [all];
            $scope.idSearch = all.id;
        }).catch(function (error) {

        });

        // gồm 7 options: Diện tích, chiều dài, nhiệt độ, thời gian, thể tích, khối lượng, bao gói, khác
        $scope.fieldData = [
            {value: 1, title: $translate.instant('global.common.acerage')},
            {value: 2, title: $translate.instant('global.common.length')},
            {value: 3, title: $translate.instant('global.common.temperature')},
            {value: 4, title: $translate.instant('global.common.time')},
            {value: 5, title: $translate.instant('global.common.volume')},
            {value: 6, title: $translate.instant('global.common.weigh')},
            {value: 7, title: $translate.instant('global.common.packing')},
            {value: 0, title: $translate.instant('global.common.other')}
        ];

        $scope.statusField = [
            {value: 1, title: $translate.instant("global.common.default")},
            {value: 0, title: $translate.instant('global.common.additional')}
        ];

        $scope.fieldUnit = [
            $translate.instant('global.common.other'),
            $translate.instant('global.common.acerage'),
            $translate.instant('global.common.length'),
            $translate.instant('global.common.temperature'),
            $translate.instant('global.common.time'),
            $translate.instant('global.common.volume'),
            $translate.instant('global.common.weigh'),
            $translate.instant('global.common.packing')
        ];

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
            'isDefault': 'Number'
        };

        var tenantId = window.localStorage.getItem("farmId");
        var customParams = "(tenantId==" + tenantId + ";tenantId!=null, isDefault==1)";
        // khai bao cau hinh cho bang
        var tableConfig = {
            tableId: "uomTypes",            //table Id
            model: "uomTypes",             //model
            defaultSort:"created",          //sap xep mac dinh theo cot nao
            sortType: "desc",                //kieu sap xep
            loadFunction: UomType.getPage,     //api load du lieu
            columns: columns,               //bao gom cac cot nao
            handleAfterReload: null,        //xu ly sau khi load du lieu
            handleAfterReloadParams: null,  //tham so cho xu ly sau khi load
            deleteCallback: null,           //delete callback
            customParams: customParams,               //dieu kien loc ban dau
            pager_id: "table_uomType_pager",   //phan trang
            page_id: "uomType_selectize_page", //phan trang
            page_number_id: "uomType_selectize_pageNum",   //phan trang
            page_size_option: ["5", "10", "25", "50"],   //lua chon size cua 1 page
            plugins: [ 'remove_button' ]
        };

        TableController.initTable($scope, tableConfig);     //khoi tao table
        TableController.sortDefault(tableConfig.tableId);   //set gia tri sap xep mac dinh
        TableController.reloadPage(tableConfig.tableId);    //load du lieu cho table

        var organizationComboBox = {
            id:'organizationId',
            url:'/api/organizations',
            originParams:'active==1;type=out=(2,3);physicalLocation==0',
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

        var searchComboBox = {
            id:'searchComboBox',
            url:HOST_GW+'/api/tenants',
            originParams:'active==1',
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
        ComboBoxController.init($scope, searchComboBox);

        $scope.$watch('idSearch', function (val) {
            // if($scope.idSearch == null){
            //     tableConfig.customParams = "";
            //     TableController.reloadPage(tableConfig.tableId);
            // } else{
            //     if($scope.idSearch == 1){
            //         tableConfig.customParams = "";
            //         TableController.reloadPage(tableConfig.tableId);
            //         return;
            //     }
            //     Organization.getChild($scope.idSearch, true).then(function (data) {
            //         tableConfig.customParams = "organizationId=in=" + data;
            //         TableController.reloadPage(tableConfig.tableId);    //load du lieu cho table
            //     });
            // }
        });

        // ham xoa mac dinh
        $scope.defaultDelete = function () {
            TableController.defaultDelete(tableConfig.tableId, UomType.deleteMany);
            // TableController.deleteWithMessages(tableConfig.tableId, UomType.deleteMany, $translate.instant("admin.menu.uomType"), $scope.uomTypes);
        };

        //delete one row
        $scope.deleteOne= function (id) {
            UIkit.modal.confirm($translate.instant("infrastructure.uomType.deleteUomType"), function () {
                UomType.deleteOne(id).then(function (data) {
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

        // =========================================
        // $scope.downloadSample = function () {
        //     // gen file excel
        //   UomType.downloadSample().then(function (data) {
        //       console.log(data);
        //       window.location.href = "api/download?filePath=" + data.fileName;
        //   }).catch(function (err) {
        //       ErrorHandle.handleOneError(err);
        //   });
        // };

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

            // file lớn hơn 20MB
            if(file.size > 20 * 1024 * 1024) {
                AlertService.error('error.messages.errorMaximum');
                return;
            }

            if(!$scope.organizationId){
                AlertService.error("Vui lòng chọn doanh nghiệp cần import dữ liệu");
                return;
            }
            var organizationId = $scope.organizationId ? parseInt($scope.organizationId) : 1;

            $scope.blockUI();
            UomType.importExcel(file, "uom_type", organizationId).then(function(data){
                $scope.blockModal.hide();
                UIkit.modal("#modal_overflow", {}).hide();

                if(!data.fileName) {
                    AlertService.success("Tải dữ liệu thành công");
                    $timeout(function () {
                        $state.go($state.current, {}, { reload: true });
                    }, 1200);
                }
                else{
                    AlertService.error("Tải lên lỗi");
                    $scope.downloadUrl = "api/download?filePath=" + data.fileName;
                    $timeout(function () {angular.element("#exportBtn").trigger("click");});
                }

            }).catch(function (data) {
                $scope.blockModal.hide();
                UIkit.modal("#modal_overflow", {}).hide();
                ErrorHandle.handleError(data);
            });
        }
    }
})();