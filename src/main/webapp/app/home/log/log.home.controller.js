(function(){
    'use strict';
    angular.module('erpApp')
        .controller('LogController', LogController);

    LogController.$inject = ['$rootScope','$scope','$state','$translate',
        '$http', 'ErrorHandle', '$window', 'TableController', 'Log',
        'LogType', 'AlertService', 'ComboBoxController', '$timeout', 'HOST_GW', 'Common', 'Config'];
    function LogController($rootScope,$scope, $state, $translate,
                              $http, ErrorHandle, $window, TableController, Log,
                           LogType, AlertService, ComboBoxController, $timeout, HOST_GW, Common, Config) {
        const TIME_DELETE_LOG = "Time_Delete_Log";
        const TYPE_DELETE_LOG = "Type_Delete_Log";

        $scope.ComboBox = {};
        $scope.log = {};
        $scope.blockModal = null;
        $scope.blockUI = function () {
            if($scope.blockModal != null)
                $scope.blockModal.hide();
            $scope.blockModal = null;
            var pleaseWait = $translate.instant("global.common.pleaseWait");
            $scope.blockModal = UIkit.modal.blockUI('<div class="uk-text-center">' + pleaseWait + '<br/><img class="uk-margin-top" src="assets/img/spinners/spinner_success.gif" alt="">');
        };

        $scope.messages = {
            required: $translate.instant("global.messages.required"),
        };

        var arrErrorKey = [
            {id: "error.usernameIncorrect", value: $translate.instant("error.usernameIncorrect") },
            {id: "error.common.accessDenied", value: $translate.instant("error.common.accessDenied") },
            {id: "error.invalidResetPasswordToken", value: $translate.instant("error.invalidResetPasswordToken") },
            {id: "error.userAndPermission.emailInvalid", value: $translate.instant("error.userAndPermission.emailInvalid") },
            {id: "error.common.notFoundId", value: $translate.instant("error.common.notFoundId") },
            {id: "error.userAndPermission.confirmPassword", value: $translate.instant("error.userAndPermission.confirmPassword") },
            {id: "error.home.nameInvalid", value: $translate.instant("error.home.nameInvalid") },
            {id: "error.home.roomInvalid", value: $translate.instant("error.home.roomInvalid") },
            //{id: "error.room.homeIsNotFound", value: $translate.instant("error.room.homeIsNotFound") },
            {id: "error.home.roomIsNotFound", value: $translate.instant("error.home.roomIsNotFound") },
            {id: "error.home.deviceIdsAreNotFound", value: $translate.instant("error.home.deviceIdsAreNotFound") },
            {id: "error.userAndPermission.roleExist", value: $translate.instant("error.userAndPermission.roleExist") },
            {id: "error.userAndPermission.existsUserUseRole", value: $translate.instant("error.userAndPermission.existsUserUseRole") },
            {id: "error.passwordIncorect", value: $translate.instant("error.passwordIncorect") },
            {id: "error.userAndPermission.currentPasswordInvalid", value: $translate.instant("error.userAndPermission.currentPasswordInvalid") },
            {id: "error.room.nameInvalid", value: $translate.instant("error.room.nameInvalid") },
            {id: "error.home.accessPermission", value: $translate.instant("error.home.accessPermission") },
            {id: "error.room.accessPermission", value: $translate.instant("error.room.accessPermission") },
            {id: "error.room.requiredHomeId", value: $translate.instant("error.room.requiredHomeId") },
            {id: "error.room.deviceIdsAreNotFound", value: $translate.instant("error.room.deviceIdsAreNotFound") },
            {id: "error.room.roomIsNotFound", value: $translate.instant("error.room.roomIsNotFound") },
            {id: "error.userAndPermission.phoneNumberExists", value: $translate.instant("error.userAndPermission.phoneNumberExists") },
            {id: "error.phoneNumberInvalid", value: $translate.instant("error.phoneNumberInvalid") },
            {id: "error.userAndPermission.canNotDeleteYourSelf", value: $translate.instant("error.userAndPermission.canNotDeleteYourSelf") },
            {id: "error.device.ModelCodeIsNotFound", value: $translate.instant("error.device.ModelCodeIsNotFound") },
            {id: "error.accountInactive", value: $translate.instant("error.accountInactive") },
            {id: "error.common.timeout", value: $translate.instant("error.common.timeout") },
            {id: "error.userAndPermission.registeredButNotSetPassword", value: $translate.instant("error.userAndPermission.registeredButNotSetPassword") },
            {id: "error.userAndPermission.registeredButNotYetActivated", value: $translate.instant("error.userAndPermission.registeredButNotYetActivated") },
            {id: "error.typeInvalid", value: $translate.instant("error.typeInvalid") },
            {id: "error.accountInvalid", value: $translate.instant("error.accountInvalid") },
            {id: "error.userAttempt.exceededAttemptLogin", value: $translate.instant("error.userAttempt.exceededAttemptLogin") },
            {id: "error.userAttempt.exceededAttemptSendOtp", value: $translate.instant("error.userAttempt.exceededAttemptSendOtp") }
        ];

        $scope.logTypes = [
            "",
            $translate.instant("log.type.register"),
            $translate.instant("log.type.cancel"),
            $translate.instant("log.type.delete"),
        ];

        // khai bao cac column va kieu du lieu
        var columns = {
            'id': 'Number',
            'userId': 'Number',
            'type': 'Number',
            'uid': 'Text',
            'created': 'Datetime',
            'active': 'Number',
            'errorKey': 'TextExact',
            'email': 'Text'
        };

        // khai bao cau hinh cho bang
        var tableConfig = {
            tableId: "logs",               //table Id
            model: "logs",                 //model
            defaultSort: "created",          //sap xep mac dinh theo cot nao
            sortType: "desc",                //kieu sap xep
            loadFunction: Log.getPageFull,     //api load du lieu
            columns: columns,               //bao gom cac cot nao
            handleAfterReload: null,        //xu ly sau khi load du lieu
            handleAfterReloadParams: null,  //tham so cho xu ly sau khi load
            deleteCallback: null,           //delete callback
            customParams: "",               //dieu kien loc ban dau
            pager_id: "table_log_pager",   //phan trang
            page_id: "log_selectize_page", //phan trang
            page_number_id: "log_selectize_pageNum",   //phan trang
            page_size_option: ["5", "10", "25", "50"]   //lua chon size cua 1 page
        };

        TableController.initTable($scope, tableConfig);     //khoi tao table
        TableController.sortDefault(tableConfig.tableId);   //set gia tri sap xep mac dinh
        TableController.reloadPage(tableConfig.tableId);    //load du lieu cho table

        var fullNameCbb = {
            id: 'fullName',
            url: '/api/users',
            originParams: 'email!=null',
            valueField: 'id',
            labelField: 'email',
            searchField: 'email',
            table: null,
            column: null,
            maxItems: 1,
            ngModel: [],
            options: [],
            placeholder: $translate.instant("global.placeholder.choose")
        };
        ComboBoxController.init($scope, fullNameCbb);

        var phoneCbb = {
            id: 'phone',
            url: '/api/users',
            originParams: '',
            valueField: 'id',
            labelField: 'phone',
            searchField: 'phone',
            table: null,
            column: null,
            maxItems: 1,
            ngModel: [],
            options: [],
            placeholder: $translate.instant("global.placeholder.choose")
        };
        ComboBoxController.init($scope, phoneCbb);

        // var typeOptions = [
        //     { id: 1, value: $translate.instant("log.type.register") },
        //     { id: 7, value: $translate.instant("log.type.cancel") },
        //     { id: 9, value: $translate.instant("log.type.delete") },
        // ];
        var typeCbb = {
            id: 'type',
            url: '/api/logTypes',
            replaceUrl: '/search?query=',
            originParams: '',
            valueField: 'type',
            labelField: 'action',
            searchField: 'action',
            table: null,
            column: null,
            maxItems: 1,
            ngModel: [],
            //options: typeOptions,
            options: [],
            placeholder: $translate.instant("global.placeholder.choose")
        };
        ComboBoxController.init($scope, typeCbb);

        // ma loi
        $scope.log.errorKey = null;
        $scope.selectize_keys_options = arrErrorKey;
        $scope.selectize_keys_config = {
            plugins: {},
            maxItems: 1,
            valueField: 'id',
            labelField: 'value',
            searchField: 'value',
            placeholder: $translate.instant("global.placeholder.choose")
        };

        var statusOptions = [
            { id: 1, value: $translate.instant("log.status.success") },
            { id: 0, value: $translate.instant("log.status.failed") },
        ];

        $scope.log.active = null;
        $scope.selectize_status_options = statusOptions;
        $scope.selectize_status_config = {
            plugins: {},
            maxItems: 1,
            valueField: 'id',
            labelField: 'value',
            searchField: 'value',
            placeholder: $translate.instant("global.placeholder.choose")
        };

        var typeDeleteLogOptions = [
            { id: 0, value: "Tháng" },
            { id: 1, value: "Năm" }
        ];

        $scope.selectize_type_delete_options = typeDeleteLogOptions;
        $scope.selectize_type_delete_config = {
            plugins: {},
            maxItems: 1,
            valueField: 'id',
            labelField: 'value',
            searchField: 'value',
            placeholder: $translate.instant("global.placeholder.choose")
        };

        // ================= INIT FUNCTION =================
        var configQuery = "query=configKey=in=" + "(" + TIME_DELETE_LOG + "," + TYPE_DELETE_LOG +")";
        Config.getPage(configQuery).then(function (res) {
            if(res.data){
                var configs = res.data;
                for(var i = 0; i < configs.length; i++){
                    if(configs[i].configKey === TIME_DELETE_LOG){
                        $scope.config.timeDeleteLog = configs[i].configValue;
                        $scope.timeDeleteConfig.id = configs[i].id;
                    }
                    if(configs[i].configKey === TYPE_DELETE_LOG){
                        $scope.config.typeDeleteLog = configs[i].configValue;
                        $scope.typeDeleteConfig.id = configs[i].id;
                    }
                }
            }
        });

        // ================= FUNC =====================
        $scope.onSearch = function () {
            $scope.blockUI();
            var query = "";

            if($scope.log.userId){
                query = convertQuery(query, "Number", "userId", $scope.log.userId);
            }
            if($scope.log.type){
                query = convertQuery(query, "Number", "type", $scope.log.type);
            }
            if($scope.log.active){
                query = convertQuery(query, "Number", "active", $scope.log.active);
            }
            if($scope.log.note){
                query = convertQuery(query, "Text", "note", $scope.log.note);
            }
            if($scope.log.uid){
                query = convertQuery(query, "Text", "uid", $scope.log.uid);
            }
            if($scope.log.errorKey){
                query = convertQuery(query, "TextExact", "errorKey", $scope.log.errorKey);
            }
            if($scope.log.createdTmp){
                query = convertQuery(query, "DateTime", "created", $scope.log.createdTmp);
            } else{
                $scope.log.startTime = null;
                $scope.log.endTime = null;
            }

            tableConfig.customParams = query;
            TableController.reloadPage(tableConfig.tableId);    //load du lieu cho table

            $timeout(function () {
                if($scope.blockModal != null) $scope.blockModal.hide();
            }, 1000);
        };

        $scope.onDownload = function () {
            $scope.langSwitcherModel = 'gb';
            if($window.localStorage.getItem("lang") != null){
                $scope.langSwitcherModel = $window.localStorage.getItem("lang")
            }

            $scope.log.lang = $scope.langSwitcherModel;
            $scope.blockUI();
            Log.download($scope.log).then(function (res) {
                if($scope.blockModal != null) $scope.blockModal.hide();
                $scope.downloadUrl = HOST_GW + "/api/files/export?filePath=" + res.fileName;
                $timeout(function () {
                    angular.element("#exportLog").trigger("click");
                });
            }).catch(function (data) {
                if($scope.blockModal != null) $scope.blockModal.hide();
                ErrorHandle.handleError(data);
            });
        };

        function convertQuery(query, type, key, value){
            if(type === "Text"){
                query += key + '=="*' + value + '*";';
            } else if(type === "TextExact"){
                query += key + '=="' + value + '";';
            } else if(type === "Number"){
                query += key + '==' + value + ';';
            } else if(type === "DateTime"){
                if (value == null) {
                    query += key + '==null';
                } else if (value.length > 0) {
                    var datetime = value.split("&");
                    query += key + '>=' + datetime[0] + ';' + key + '<=' + datetime[1] + ';';
                    $scope.log.startTime = datetime[0];
                    $scope.log.endTime = datetime[1];
                }
            }
            return query;
        }

        $scope.convertJsonToHtml = function (data) {
            return JSON.parse(data);
        }

        // default 0
        $scope.config = {
            typeDeleteLog: 0,
            timeDeleteLog: null
        };

        $scope.timeDeleteConfig = {
            id: null,
            configKey: TIME_DELETE_LOG,
            configValue: $scope.config.timeDeleteLog
        };

        $scope.typeDeleteConfig = {
            id: null,
            configKey: TYPE_DELETE_LOG,
            configValue: $scope.config.typeDeleteLog
        };

        $scope.onSaveConfig = function () {
            var $form = $("#config_delete_form");
            $('#config_delete_form').parsley();
            if(!$scope.config_delete_form.$valid) return;
            if(!Common.checkIsValidForm($form)) return;

            $scope.blockUI();
            $scope.timeDeleteConfig.configValue = $scope.config.timeDeleteLog;
            $scope.typeDeleteConfig.configValue = $scope.config.typeDeleteLog;

            if($scope.timeDeleteConfig.id){
                Config.update($scope.timeDeleteConfig);
            } else{
                Config.create($scope.timeDeleteConfig);
            }

            if($scope.typeDeleteConfig.id){
                Config.update($scope.typeDeleteConfig);
            } else{
                Config.create($scope.typeDeleteConfig);
            }

            $timeout(function () {
                if($scope.blockModal != null) $scope.blockModal.hide();
                UIkit.modal($("#config_delete_log")).hide();
            }, 1000);
        };

        // ======================================
        var $formValidate = $('#config_delete_form');
        $formValidate.parsley({
            'excluded': 'input[type=button], input[type=submit], input[type=reset], input[type=hidden], .selectize-input > input'
        }).on('form:validated',function() {
            $scope.$apply();
        }).on('field:validated',function(parsleyField) {
            if($(parsleyField.$element).hasClass('md-input')) {
                $scope.$apply();
            }
        });

        $scope.refresh = function(){
            $state.go($state.current,{},{reload:true})
        }
    }
})();