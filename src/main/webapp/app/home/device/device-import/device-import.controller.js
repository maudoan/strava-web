(function(){
    'use strict';
    angular.module('erpApp')
        .controller('DeviceImportController',DeviceImportController);

    DeviceImportController.$inject = ['$rootScope','$scope', '$state', '$timeout', '$translate',
        'DeviceImport', 'AlertService', 'ErrorHandle', 'TableController', 'ComboBoxController',
        'HOST_GW', 'FileImport'];
    function DeviceImportController($rootScope,$scope, $state, $timeout, $translate,
                                    DeviceImport, AlertService, ErrorHandle, TableController, ComboBoxController,
                                    HOST_GW, FileImport) {
        $scope.ComboBox = {};
        $scope.page = 0; // 0 - home 1- detail  2 - edit
        $scope.blockModal = null;
        $scope.blockUI = function () {
            if($scope.blockModal != null)
                $scope.blockModal.hide();
            $scope.blockModal = null;
            $scope.blockModal = UIkit.modal.blockUI('<div class=\'uk-text-center\'>Đang xử lý ...<br/><img class=\'uk-margin-top\' src=\'assets/img/spinners/spinner_success.gif\' alt=\'\'>');
        };

        $scope.dataSource = [
            {value: 0, title: "Trả ngay"},
            {value: 1, title: "Trả chậm"},
        ];

        var loadFunction = DeviceImport.getPage;
        // khai bao cac column va kieu du lieu
        var columns = {
            'id':'Number',
            'contractName':'Text',
            'orderNumber':'Text',
            'contractType':'Number',
            'itemCode':'Text',
            'serialNumber':'Text',
            'uid':'Text',
            'mac':'Text',
            'shipDate':'DateTime',
            'packageName':'Text',
            'areaCode':'MultiText',
            'created':'DateTime'
        };

        var currentUser = $rootScope.currentUser;
        var areaCodeList = "";
        if(!currentUser.areaIds.includes(1)) {
            let areaCodes = [];
            currentUser.areas.forEach(function (area) {
                areaCodes.push(area.areaCode);
            })
            if(areaCodes.length > 0) {
                areaCodeList = areaCodes.join(',');
            }
        }
        // khai bao cau hinh cho bang
        var customParams = areaCodeList.length > 0 ? "areaCode=in=("+areaCodeList+")" : "";
        var tableConfig = {
            tableId: "deviceImports",               //table Id
            model: "deviceImports",                 //model
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

        var loadFunction2 = FileImport.getPage;
        // khai bao cac column va kieu du lieu
        var columns2 = {
            'id':'Number',
            'originalFileName':'Text',
            'fileName':'Number',
            'total':'Number',
            'serialNumber':'Text',
            'areaIds':'SetLong',
            'created':'DateTime'
        };

        // khai bao cau hinh cho bang
        var customParams2 = ""; // lay ENDUSER
        var tableConfig2 = {
            tableId: "fileImports",               //table Id
            model: "fileImports",                 //model
            defaultSort:"created",          //sap xep mac dinh theo cot nao
            sortType: "desc",                //kieu sap xep
            loadFunction: loadFunction2,     //api load du lieu
            paramBody:$scope.input,
            columns: columns2,               //bao gom cac cot nao
            handleAfterReload: null,        //xu ly sau khi load du lieu
            handleAfterReloadParams: null,  //tham so cho xu ly sau khi load
            deleteCallback: null,           //delete callback
            loading:false,
            customParams: customParams2,               //dieu kien loc ban dau
            pager_id: "table_file_import_pager",   //phan trang
            page_id: "file_import_selectize_page", //phan trang
            page_number_id: "file_import_selectize_pageNum",   //phan trang
            page_size_option: ["5", "10", "25", "50"]   //lua chon size cua 1 page
        };

        TableController.initTable($scope, tableConfig2);     //khoi tao table
        TableController.sortDefault(tableConfig2.tableId);   //set gia tri sap xep mac dinh
        // TableController.reloadPage(tableConfig2.tableId);

        var areaCbb = {
            id: 'areaCbb',
            url: '/api/areas',
            originParams: '',
            valueField: 'id',
            labelField: 'name',
            searchField: 'name',
            table: $scope.TABLES['fileImports'],
            column: 'areaIds',
            maxItems: 1,
            ngModel: [],
            options: [],
            placeholder: $translate.instant("global.placeholder.choose")
        };
        ComboBoxController.init($scope, areaCbb);

        var deviceAreaCbb = {
            id: 'deviceAreaCbb',
            url: '/api/areas',
            originParams: '',
            valueField: 'areaCode',
            labelField: 'name',
            searchField: 'name',
            table: $scope.TABLES['deviceImports'],
            column: 'areaCode',
            maxItems: null,
            ngModel: [],
            options: [],
            placeholder: $translate.instant("global.placeholder.choose")
        };
        ComboBoxController.init($scope, deviceAreaCbb);
        // =======================================================

        /* import excel */
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
            if(file.size > 2 * 1024 * 1024) {
                AlertService.error('error.messages.errorMaximum2MB');
                return;
            }

            $scope.blockUI();
            DeviceImport.importExcel(file).then(function(data){
                $scope.blockModal.hide();
                UIkit.modal("#modal_overflow", {}).hide();

                if(data.status === 0) {
                    AlertService.success("Tải dữ liệu thành công");
                    $timeout(function () {
                        $state.go($state.current, {}, { reload: true });
                    }, 1200);
                } else{
                    $scope.downloadUrl = HOST_GW + "/api/files/export?filePath=" + data.data;
                    $timeout(function () {angular.element("#exportBtn").trigger("click");});
                }
            }).catch(function (data) {
                $scope.blockModal.hide();
                UIkit.modal("#modal_overflow", {}).hide();
                ErrorHandle.handleOneError(data);
            });
        }

        // ======================================================
        $scope.page = 1; // page: 1 thiết bị, 2 danh sách, 3 thiết bị tìm theo danh sách
        $scope.showListFileImport = function (page, fileImport) {
            $scope.blockUI();
            console.log(page)
            $scope.fileImportName = null;
            $scope.page = page;
            tableConfig.customParams = "";
            if(page === 2) {
                TableController.reloadPage(tableConfig2.tableId);
            } else if(page === 3){
                tableConfig.customParams = "fileImportId==" + fileImport.id;
                $scope.fileImportName = fileImport.originalFileName;
                TableController.reloadPage(tableConfig.tableId);
            } else {
                TableController.reloadPage(tableConfig.tableId);
            }

            $timeout(function () {
                $scope.blockModal.hide();
            }, 1000);
        }
    }
})();