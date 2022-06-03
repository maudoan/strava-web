(function () {
    'use strict';
    angular.module('erpApp')
        .controller('PolicyHistoryController', PolicyHistoryController);

    PolicyHistoryController.$inject = ['$rootScope', '$scope', '$state', '$http','$stateParams','$timeout',
        'AlertService', '$translate', 'TableController', 'ComboBoxController', 'AlertModalService','Policy','$window', 'HOST_GW'];

    function PolicyHistoryController($rootScope, $scope, $state, $http,$stateParams,$timeout,
                                         AlertService, $translate, TableController, ComboBoxController,
                                      AlertModalService, Policy, Provider, $window, HOST_GW) {
        $scope.blockModal = null;
        $scope.blockUI = function () {
            if($scope.blockModal != null) $scope.blockModal.hide();
            $scope.blockModal = null;
            $scope.blockModal = UIkit.modal.blockUI('<div class=\'uk-text-center\'>Đang xử lý ...<br/><img class=\'uk-margin-top\' src=\'assets/img/spinners/spinner_success.gif\' alt=\'\'>');
        };
        $scope.policy = {};
        $(document).keypress(
	        function(event){
	            if (event.which == '13') {
	                event.preventDefault();
	                $timeout(function () {
	                    angular.element("#searchBtn").trigger("click");
	                });
	            }
	        });
        function getDetail(){
        	Policy.getOne($stateParams.id).then(function (policy) {
            	$scope.policy = policy;
            	if($scope.policy.created){
            		var d = new Date($scope.policy.created),
            	    dformat = [String(d.getDate()).padStart(2, '0'),
            	    		   String(d.getMonth()+1).padStart(2, '0'),
            	               d.getFullYear()].join('-')+' '+
            	              [d.getHours(),
            	               d.getMinutes(),
            	               d.getSeconds()].join(':');
                    $scope.createdString = dformat;
                }else $scope.createdString ="";
            	if($scope.policy.fromVersionName == null || $scope.policy.fromVersionName == '' 
            		|| $scope.policy.fromVersionName == undefined) $scope.policy.fromVersionName = 'All';
            });
        }
        getDetail();
        $scope.stateFields = [
            { value: 0, title: $translate.instant('device.policy.stateUpgradeFW.success')},
            { value: 2, title: $translate.instant('device.policy.stateUpgradeFW.fail')},
            { value: 1, title: $translate.instant('device.policy.stateUpgradeFW.notUpgrade')}
        ];
        $scope.input ={
        	policyId:$stateParams.id,
        	userId: null,
        	deviceName:null,
            uid: null,
            updatedFrom: null,
            updatedTo: null,
            active: 2
        }
        
        $scope.selectize_active_config = {
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

        $scope.selectize_active_options = [
        	{id: 2, name: $translate.instant('device.policy.stateUpgradeFW.all')},
            //{id: -1, name: $translate.instant('device.policy.stateUpgradeFW.notUpgrade')},
            {id: 1, name: $translate.instant('device.policy.stateUpgradeFW.success')},
            {id: 0, name: $translate.instant('device.policy.stateUpgradeFW.fail')}
        ]
        
        $("#updatedFromPicker").kendoDatePicker({
            format: "dd/MM/yyyy",
            change: function() {
                var value = this.value();
                if(value !=null){
                    $scope.input.updatedFrom = value.getTime()
                } else {
                    $scope.input.updatedFrom = null;
                }
            }
        });
        
        $("#updatedToPicker").kendoDatePicker({
            format: "dd/MM/yyyy",
            change: function() {
                var value = this.value();
                if(value !=null){
                    $scope.input.updatedTo = value.getTime()
                } else {
                    $scope.input.updatedTo = null;
                }
            }
        });
        
        var loadFunction = Policy.getPolicyHistory;
        // load policy history
        var columns = {
            'id':'Number',
            'userId':'Text',
            'deviceName':'Text',
            'uid':'Text',
            'active':'Number',
            'updated':'DateTime'
        };
        // khai bao cau hinh cho bang
        var tableConfig = {
            tableId: "policyHistories",               //table Id
            model: "policyHistories",                 //model
            defaultSort:"",          //sap xep mac dinh theo cot nao
            sortType: "desc",                //kieu sap xep
            loadFunction: loadFunction,     //api load du lieu
            paramBody:$scope.input,
            columns: columns,               //bao gom cac cot nao
            handleAfterReload: null,        //xu ly sau khi load du lieu
            handleAfterReloadParams: null,  //tham so cho xu ly sau khi load
            deleteCallback: null,           //delete callback
            customParams: "",               //dieu kien loc ban dau
            pager_id: "table_policyHistory_pager",   //phan trang
            page_id: "policyHistory_selectize_page", //phan trang
            page_number_id: "policyHistory_selectize_pageNum",   //phan trang
            page_size_option: ["5", "10", "25", "50"]   //lua chon size cua 1 page
        };
        TableController.initTable($scope, tableConfig);     //khoi tao table
        TableController.sortDefault(tableConfig.tableId);   //set gia tri sap xep mac dinh
        TableController.reloadPage(tableConfig.tableId);    //load du lieu cho table
        $scope.$watch('TABLES["policyHistories"].loading', function (newVal) {
            if(newVal){
                $scope.blockUI();
            } else {
                if ($scope.blockModal != null){$scope.blockModal.hide();}
                if($scope.policyHistories && $scope.policyHistories[0]){
                    if($scope.policyHistories[0].policyHistories){
                        $scope.policyHistories[0].expand = true
                    }
                    console.log($scope.policyHistories);
                }
            }

        }, true);
        
        $scope.search = function(){
            TableController.reloadPage(tableConfig.tableId);    //load du lieu cho table
        }
        
        $scope.expand = function(index){
            $scope.policyHistories[index].expand = true
            console.log($scope.policyHistories);
        }
        $scope.collapse = function(index){
            $scope.policyHistories[index].expand = false
            console.log($scope.policyHistories);
        }
        $scope.refresh = function(){
        	$scope.input.policyId = $stateParams.id
            $scope.input.userId = null
            $scope.input.deviceName = null
            $scope.input.uid = null
            $scope.input.updatedFrom = null
            $scope.input.updatedTo = null
            $scope.input.actives = 2
            var updatedFromPicker = $("#updatedFromPicker").data("kendoDatePicker");
        	updatedFromPicker.value(null);
        	updatedFromPicker.trigger("change");
        	var updatedToPicker = $("#updatedToPicker").data("kendoDatePicker");
        	updatedToPicker.value(null);
        	updatedToPicker.trigger("change");
            $scope.search();
        }
    }
})();
