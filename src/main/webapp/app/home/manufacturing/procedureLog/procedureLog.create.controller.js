(function () {
    'use strict';
    angular.module('erpApp')
        .controller('ProcedureLogCreateController', ProcedureLogCreateController);

    ProcedureLogCreateController.$inject = ['$rootScope', '$scope', '$state', '$filter', '$timeout',
        'AlertService', 'DateTimeValidation', '$translate', 'TableController', 'ComboBoxController',
        'AlertModalService', 'ErrorHandle', 'ProcedureLog', 'Product', 'Area', '$window', 'Phase', 'FileService'];

    function ProcedureLogCreateController($rootScope, $scope, $state, $filter, $timeout,
                                          AlertService, DateTimeValidation, $translate, TableController, ComboBoxController,
                                          AlertModalService, ErrorHandle, ProcedureLog, Product, Area, $window, Phase, FileService) {
        $scope.tenantId = $window.localStorage.getItem("farmId") ? $window.localStorage.getItem("farmId") : 0;
        $scope.tenantName = $window.localStorage.getItem("farmName") ? $window.localStorage.getItem("farmName") : null;

        $scope.ComboBox = {};
        DateTimeValidation.init($scope);
        $scope.procedureLog = {
            tenantId: $scope.tenantId,
            attachment: []
        };
        $scope.cbbSelected = {
            season: null,
            product: null
        };

        $scope.messages = {
            required : $translate.instant('admin.messages.required'),
            maxLength255 : $translate.instant('global.messages.maxLength255'),
            maxLength1000 : $translate.instant('global.messages.maxLength1000')
        };

        $scope.blockModal = null;
        $scope.blockUI = function () {
            if($scope.blockModal != null)
                $scope.blockModal.hide();
            $scope.blockModal = null;
            $scope.blockModal = UIkit.modal.blockUI('<div class=\'uk-text-center\'>Please Wait...<br/><img class=\'uk-margin-top\' src=\'assets/img/spinners/spinner_success.gif\' alt=\'\'>');
        };

        function genDateTime(time) {
            var date = $filter('date')(time, 'dd/MM/yyyy');
            return date
        }

        // var farmCbb = {
        //     id: 'farmCbb',
        //     url: '/api/tenants',
        //     originParams: 'active==1',
        //     valueField: 'id',
        //     labelField: 'name',
        //     searchField: 'name',
        //     table: null,
        //     column: null,
        //     maxItems: 1,
        //     ngModel: [],
        //     options: [],
        //     placeholder: $translate.instant("global.placeholder.choose")
        // };
        // ComboBoxController.init($scope, farmCbb);

        var areaCbb = {
            id: 'areaCbb',
            url: '/api/areas',
            originParams: 'tenantId==' + $scope.tenantId,
            valueField: 'id',
            labelField: 'name',
            searchField: 'name',
            table: null,
            column: null,
            maxItems: 1,
            ngModel: [],
            options: [],
            placeholder: $translate.instant("global.placeholder.choose")
        };
        ComboBoxController.init($scope, areaCbb);

        var seasonCbb = {
            id: 'seasonCbb',
            url: '/api/seasons',
            originParams: 'tenantId==' + $scope.tenantId + ";state==1", // chi lay dot dang thuc hien
            valueField: 'id',
            labelField: 'name',
            searchField: 'name',
            table: null,
            column: null,
            maxItems: 1,
            ngModel: [],
            options: [],
            placeholder: $translate.instant("global.placeholder.choose")
        };
        ComboBoxController.init($scope, seasonCbb);

        var ownerCbb = {
            id: 'ownerCbb',
            url: '/api/users',
            replaceUrl: '/search-user-in-tenant?id=' + $scope.tenantId + "&query=",
            originParams: '',
            valueField: 'id',
            labelField: 'fullName',
            searchField: 'fullName',
            table: null,
            column: null,
            maxItems: 1,
            ngModel: [],
            options: [],
            placeholder: $translate.instant("global.placeholder.choose")
        };
        ComboBoxController.init($scope, ownerCbb);

        var phaseCbb = {
            id: 'phaseCbb',
            url: '/api/phases',
            originParams: 'tenantId==' + $scope.tenantId,
            valueField: 'id',
            labelField: 'name',
            searchField: 'name',
            table: null,
            column: null,
            maxItems: 1,
            ngModel: [],
            options: [],
            placeholder: $translate.instant("global.placeholder.choose"),
            orderBy: 'created,desc'
        };
        ComboBoxController.init($scope, phaseCbb);

        //NGÀY ghi nhật kí
        var today = new Date();
        $("#executeDate")
            .on("blur", function () {
                DateTimeValidation.onBlurDate($(this), false);
            })
            .kendoDatePicker({
                format: "dd/MM/yyyy",
                change: function () {
                    $scope.procedureLog.executeDate = this.value() != null ? this.value().getTime() : null;
                },
                // max: new Date()
            });

        var executeDate = genDateTime(today.getTime());
        var datepickerImport = $("#executeDate").data("kendoDatePicker");
        datepickerImport.value(executeDate);
        datepickerImport.trigger("change");

        $timeout(function () {
            makeInputDatepickerReadonly();
        });

        // khoá input không cho sửa input date picker
        function makeInputDatepickerReadonly() {
            $(".k-datetimepicker, .k-datepicker").find("input").attr("readonly", true);
        }

        // =========================================
        function resetCbbWithParams(cbb, originParams, options){
            cbb.options = options ? options : [""];
            cbb.resetScroll = true;
            cbb.originParams = originParams;
            ComboBoxController.init($scope, cbb);
        }

        // $scope.onChangeFarm = function () {
        //     $timeout(function () {
        //         var tenantId = $scope.procedureLog.tenantId ? $scope.procedureLog.tenantId : 0;
        //         var originParams = "tenantId==" + tenantId;
        //
        //         // resetCbbWithParams(ownerCbb, originParams);
        //         resetCbbWithParams(seasonCbb, originParams);
        //         resetCbbWithParams(phaseCbb, originParams);
        //         resetCbbWithParams(areaCbb, originParams);
        //     });
        // };

        $scope.onChangeSeason = function () {
            $timeout(function () {
                // get info product and kv sx
                var seasonId = $scope.procedureLog.seasonId ? $scope.procedureLog.seasonId : 0;
                var season = $scope.cbbSelected.season[0];
                var areaParentId = season && season.areaId ? season.areaId : 0;
                var originParams = "tenantId==" + $scope.tenantId + ";seasonId==" + seasonId;
                $scope.procedureLog.seasonCode = season && season.code ? season.code : '';

                // get product
                if(seasonId){
                    Product.getOne(season.productId).then(function (product) {
                        $scope.cbbSelected.product = product;
                        $scope.procedureLog.productId = product.id;
                    }).catch(function (err) {
                        ErrorHandle.handleOneError(err);
                    });

                    Area.getOne(season.areaId).then(function (area) {
                        areaCbb.resetScroll = true;
                        areaCbb.options = [area];
                        areaCbb.replaceUrl = "/search-child?parentId=" + areaParentId + "&query=";
                        ComboBoxController.init($scope, areaCbb);
                        $scope.procedureLog.areaId = areaParentId;
                    }).catch(function (err) {
                        ErrorHandle.handleOneError(err);
                    });
                } else{
                    $scope.procedureLog.productId = null;
                    $scope.cbbSelected.product = null;
                    areaCbb.resetScroll = true;
                    areaCbb.options = [""];
                    ComboBoxController.init($scope, areaCbb);
                }

                // get list phase
                var phaseDefault = null;
                Phase.getPage("query=tenantId==" + $scope.tenantId + ";seasonId==" + seasonId + "&size=20&page=0&sort=created,desc").then(function (data) {
                    var phases = data.data;

                    if(!phases || phases.length < 1) {
                        resetCbbWithParams(phaseCbb, originParams);
                        $scope.procedureLog.phaseId = null;
                        return;
                    }

                    // Nếu đợt chưa có giai đoạn được tích chọn hoàn thành thì mặc định hiển thị giai đoạn đầu tiên của đợt
                    for(var i = 0; i < phases.length; i++){
                        if(!phases[i].state) {
                            phaseDefault = phases[i]; break;
                        }
                    }
                    if(!phaseDefault) phaseDefault = phases[0];
                    resetCbbWithParams(phaseCbb, originParams, [phaseDefault]);
                    $scope.procedureLog.phaseId = phaseDefault.id;
                }).catch(function (err) {
                    resetCbbWithParams(phaseCbb, originParams);
                    $scope.procedureLog.phaseId = null;
                });
            });
        };

        // get user first
        getCurrentUser();
        function getCurrentUser (){
            var currentUser = $rootScope.currentUser;

            ownerCbb.options = [currentUser];
            ComboBoxController.init($scope, ownerCbb);
            $scope.procedureLog.userId = currentUser.id;
        }

        // file
        function previewFiles() {
            $scope.procedureLog.attachments = [];
            $scope.files = [];

            if (this.files) $.each(this.files, readAndPreview);

            function readAndPreview(i, file) {
                // file lớn hơn 20MB
                if(file.size > 20 * 1024 * 1024) {
                    $("#file-input").val("");
                    AlertService.error('File đính kèm không được vượt quá 20MB');
                    $scope.procedureLog.attachments = [];
                    $scope.$apply();
                    return false;
                }

                $scope.procedureLog.attachments.push({name : file.name});
                $scope.files.push(file);
                $scope.$apply();
            }
        }

        $('#file-input').on("change", previewFiles);

        async function uploadAttachment(files){
            var attachment = [];
            for(var i = 0; i < files.length; i++){
                var result = await FileService.uploadAvatar(files[i], 2);
                attachment.push(result.data.fileName);
            }
            return attachment;
        }

        $scope.removeAttachment = function(index){
            // var fileList = $scope.procedureLog.attachments;
            // var files = fileList.slice(0, index).concat(fileList.slice(index + 1));
            var attachments = $scope.procedureLog.attachments;
            var files = $scope.files;
            $scope.procedureLog.attachments = attachments.slice(0, index).concat(attachments.slice(index + 1));;
            $scope.files = files.slice(0, index).concat(files.slice(index + 1));
        }

        // ==========================
        $scope.btnDisable = false;
        $scope.submit = async function (isClose) {
            if($scope.btnDisable) return;
            var $form = $('#form_create_procedureLog');
            $('#form_create_procedureLog').parsley();
            if (!$scope.form_create_procedureLog.$valid) return;
            if(!ComboBoxController.checkIsValidForm($form)) return;

            $scope.blockUI();
            $scope.btnDisable = true;

            //upload before create
            var files = $scope.files;
            if(files && files.length > 0){
                // cho upload xong anh
                await uploadAttachment(files);
                createProcedureLog(isClose);
            } else {
                createProcedureLog(isClose);
            }
        };

        function createProcedureLog(isClose){
            ProcedureLog.create($scope.procedureLog).then(function (data) {
                if($scope.blockModal != null) $scope.blockModal.hide();
                AlertModalService.popup("success.msg.create");
                $timeout(function () {
                    isClose ? $state.go('procedureLogs'):$state.go('procedureLogs-detail',{procedureLogId: data.id});
                },1100);
            }).catch(function (data) {
                $scope.btnDisable = false;
                if($scope.blockModal != null) $scope.blockModal.hide();
                ErrorHandle.handleOneError(data);
            });
        }

        //===============================
        if (angular.element('#form_create_procedureLog').length) {
            var $formValidate = $('#form_create_procedureLog');
            $formValidate
                .parsley({
                    'excluded': 'input[type=button], input[type=submit], input[type=reset], input[type=hidden], .selectize-input > input'
                })
                .on('form:validated', function () {
                    $scope.$apply();
                })
                .on('field:validated', function (parsleyField) {
                    if ($(parsleyField.$element).hasClass('md-input')) {
                        $scope.$apply();
                    }
                });
        }
    }
})();
