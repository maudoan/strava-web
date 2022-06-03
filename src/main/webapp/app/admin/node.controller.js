(function(){
    'use strict';
    angular.module('erpApp')
        .controller('NodeController',NodeController);

    NodeController.$inject = ['$rootScope','$scope','$state','$stateParams','$http','$timeout','apiData','Node', 'AlertService','$translate','variables','ErrorHandle', '$window','TableController','AlertModalService'];
    function NodeController($rootScope,$scope, $state,$stateParams,$http,$timeout,apiData, Node, AlertService,$translate, variables, ErrorHandle, $window,TableController,AlertModalService) {
        var vm = this;
        $scope.ComboBox = {};
        // khai bao cac column va kieu du lieu
        var columns = {
            'id':'Number',
            'name':'Text',
            'ip':'Text',
            'port':'Text',
            'domain':'Text',
            'created':'DateTime',
            'active':'Number'
        }

        // khai bao cau hinh cho bang
        var tableConfig = {
            tableId: "node",               //table Id
            model: "nodes",                 //model
            defaultSort:"created",          //sap xep mac dinh theo cot nao
            sortType: "desc",                //kieu sap xep
            loadFunction: Node.getPage,     //api load du lieu
            columns: columns,               //bao gom cac cot nao
            handleAfterReload: null,        //xu ly sau khi load du lieu
            handleAfterReloadParams: null,  //tham so cho xu ly sau khi load
            deleteCallback: null,           //delete callback
            customParams: "",               //dieu kien loc ban dau
            pager_id: "table_user_pager",   //phan trang
            page_id: "user_selectize_page", //phan trang
            page_number_id: "user_selectize_pageNum",   //phan trang
            page_size_option: ["5", "10", "25", "50"]   //lua chon size cua 1 page
        }

        TableController.initTable($scope, tableConfig);     //khoi tao table
        TableController.sortDefault(tableConfig.tableId);   //set gia tri sap xep mac dinh
        TableController.reloadPage(tableConfig.tableId);    //load du lieu cho table

        // ham xoa mac dinh
        $scope.defaultDelete = function () {
            TableController.defaultDelete(tableConfig.tableId,Node.deleteMany);
        }
        var $formValidate = $('#form_createuser');
        $formValidate.parsley({
            'excluded': 'input[type=button], input[type=submit], input[type=reset], input[type=hidden], .selectize-input > input'
        }).on('form:validated',function() {
            $scope.$apply();
        }).on('field:validated',function(parsleyField) {
            if($(parsleyField.$element).hasClass('md-input')) {
                $scope.$apply();
            }
        });
        $scope.required_msg = $translate.instant('admin.messages.required')
        $scope.maxLength255 = $translate.instant('global.messages.maxLength255')

        $scope.createNode = function() {
            $('#form_createuser').parsley();
            if(!$scope.form_createuser.$valid) return;

            Node.create($scope.node).then(function (data) {
                TableController.reloadPage(tableConfig.tableId);
                $timeout(function () {
                    angular.element("#closeBtn").trigger("click");
                });
                AlertModalService.popup("success.msg.create");
            }).catch(function (data) {
                ErrorHandle.handleOneError(data);
            });
        }

    }

})();