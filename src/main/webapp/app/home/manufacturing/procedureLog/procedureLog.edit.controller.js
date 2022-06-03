(function () {
    'use strict';
    angular.module('erpApp')
        .controller('ProcedureLogEditController', ProcedureLogEditController);

    ProcedureLogEditController.$inject = ['$rootScope', '$scope', '$state', '$stateParams','$filter','$timeout',
        'AlertService','DateTimeValidation', '$translate', 'TableController', 'ComboBoxController',
        'AlertModalService', 'ErrorHandle', 'ProcedureLog', 'Season', 'FileService'];

    function ProcedureLogEditController($rootScope, $scope, $state, $stateParams,$filter,$timeout,
                                          AlertService,DateTimeValidation, $translate, TableController, ComboBoxController,
                                        AlertModalService, ErrorHandle, ProcedureLog, Season, FileService) {
        DateTimeValidation.init($scope);
        $scope.ComboBox = {};
        $scope.procedureLog = {};
        $scope.cbbSelected = {
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

        var areaCbb = {
            id: 'areaCbb',
            url: '/api/areas',
            originParams: '',
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

        var ownerCbb = {
            id: 'ownerCbb',
            url: '/api/users',
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
            originParams: '',
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
        ComboBoxController.init($scope, phaseCbb);

        //NGÀY ghi nhật kí
        $("#executeDate")
            .on("blur", function () {
                DateTimeValidation.onBlurDate($(this), false);
            })
            .kendoDatePicker({
                format: "dd/MM/yyyy",
                change: function () {
                    $scope.procedureLog.executeDate = this.value() != null ? this.value().getTime() : null;
                }
            });

        $timeout(function () {
            makeInputDatepickerReadonly();
        });

        // khoá input không cho sửa input date picker
        function makeInputDatepickerReadonly() {
            $(".k-datetimepicker, .k-datepicker").find("input").attr("readonly", true);
        }

        $scope.season = null;
        // =============== init data =================
        ProcedureLog.getFull($stateParams.procedureLogId).then(function(data){
            $scope.procedureLog = data;

            var executeDate = genDateTime(data.executeDate);
            var datepickerImport = $("#executeDate").data("kendoDatePicker");
            datepickerImport.value(executeDate);
            datepickerImport.trigger("change");

            // reset cbb
            Season.getOne(data.seasonId).then(function (season) {
                $scope.season = season;
                $scope.cbbSelected.product = data.product;

                ownerCbb.replaceUrl = "/search-user-in-tenant?id=" + data.tenantId + "&query=";
                resetCbbWithParams(ownerCbb, data.user, "");
                resetCbbWithParams(phaseCbb, data.phase, "seasonId==" + season.id);

                areaCbb.replaceUrl = "/search-child?parentId=" + season.areaId + "&query=";
                resetCbbWithParams(areaCbb, data.area, "");
            }).catch(function (err) {
                console.log(err);
            });
        }).catch(function (err) {
            console.log(err);
            ErrorHandle.handleError(err);
        });

        // =========================================
        function resetCbbWithParams(cbb, options, originParams){
            if(options){
                cbb.options = [options];
            } else{
                cbb.options = [""];
            }
            cbb.resetScroll = true;
            cbb.originParams = originParams;
            ComboBoxController.init($scope, cbb);
        }

        // file
        function previewFiles() {
            $scope.procedureLog.attachment = [];
            if (this.files) $.each(this.files, readAndPreview);

            function readAndPreview(i, file) {
                // file lớn hơn 20MB
                if(file.size > 20 * 1024 * 1024) {
                    $("#file-input").val("");
                    AlertService.error('File đính kèm không được vượt quá 20MB');
                    $scope.procedureLog.attachment = [];
                    $scope.$apply();
                    return false;
                }

                $scope.procedureLog.attachment.push(file.name);
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
            var files = $("#file-input")[0].files;
            if(files && files.length > 0){
                var attachment = await uploadAttachment(files);
                $scope.procedureLog.attachment = attachment;
                updateProcedureLog(isClose);
            } else {
                updateProcedureLog(isClose);
            }
        };

        function updateProcedureLog(isClose) {
            ProcedureLog.update($scope.procedureLog).then(function (data) {
                $scope.blockModal.hide();
                AlertModalService.popup("success.msg.create");
                $timeout(function () {
                    isClose ? $state.go('procedureLogs'):$state.go('procedureLogs-detail',{procedureLogId: data.id});
                },1100);
            }).catch(function (data) {
                $scope.btnDisable = false;
                $scope.blockModal.hide();
                ErrorHandle.handleError(data);
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
