(function () {
    'use strict';
    angular.module('erpApp')
        .controller('SeasonCreateController', SeasonCreateController);

    SeasonCreateController.$inject = ['$rootScope', '$scope', '$state', 'Season', 'AlertService',
        'AlertModalService', '$translate', 'ErrorHandle', 'ComboBoxController',
        '$timeout', 'Phase', 'DateTimeValidation'];

    function SeasonCreateController($rootScope, $scope, $state, Season, AlertService,
                                    AlertModalService, $translate, ErrorHandle, ComboBoxController,
                                    $timeout, Phase, DateTimeValidation) {
        DateTimeValidation.init($scope);
        $scope.ComboBox = {};
        $scope.areas = {};
        $scope.managers = [];
        $scope.season = {
            areaId: null,
            phases: [],
            state: 0 // dot moi tao co state = 0
        };

        $scope.messages = {
            required : $translate.instant('admin.messages.required'),
            gln_msg : $translate.instant('global.messages.number_msg'),
            maxLength12 : $translate.instant('global.messages.maxLength12'),
            maxLength20 : $translate.instant('global.messages.maxLength20'),
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

        $scope.maxDate = null;
        $scope.today = null;
        maxDate();
        function maxDate(){
            var today = new Date();
            var dd = today.getDate();
            var mm = today.getMonth() + 1; //January is 0!

            var yyyy = today.getFullYear();
            if (dd < 10) {
                dd = '0' + dd;
            }
            if (mm < 10) {
                mm = '0' + mm;
            }
            var tomorrow = dd + '/' + mm + '/' + yyyy;
            $scope.today = (new Date(yyyy, mm - 1, dd)).getTime();
            $scope.maxDate = tomorrow;
        }

        function checkValidPhase (type) {
            //type = 1: đang thực hiện - chỉ cần 1 tick là đc
            // type = 2: hoàn thành, toàn bộ phải đc tick
            var phases = $scope.season.phases;
            var countTick = 0;

            for(var i = 0; i < phases.length; i++){
                if(phases[i].state) countTick += 1;
            }

            // đang thực hiện có thể tích hoặc ko
            if(type === 1) return countTick >= 0;
            else return countTick === phases.length;
        }

        // get season có giai đoạn gần dây nhất trong địa điểm này
        $scope.btnDisable = false;
        $scope.submit = function (isClose) {
            if($scope.btnDisable) return;
            var $form = $('#form_createSeason');
            $('#form_createSeason').parsley();
            if (!$scope.form_createSeason.$valid) return;
            if(!ComboBoxController.checkIsValidForm($form)) return;

            // check con gd chua luu
            if($scope.showAddPhase || $scope.showEditPhase){
                AlertService.error("Còn giai đoạn chưa được lưu, xin thử lại");
                return;
            }

            // convertDateToSubmit();
            if(!checkValidDate()){
                return;
            }

            if($scope.season.state !== 0 && !checkValidPhase($scope.season.state)){
                if($scope.season.state === 1){
                    AlertService.error("Vui lòng tick chọn ít nhất 1 giai đoạn thực hiện để tiếp tục");
                } else{
                    AlertService.error("Vẫn còn giai đoạn thực hiện chưa được hoàn thành");
                }
                return;
            }

            $scope.blockUI();
            $scope.btnDisable = true;
            Season.create($scope.season).then(function (data) {
                $scope.blockModal.hide();
                AlertModalService.popup("success.msg.create");
                $timeout(function () {
                    isClose?$state.go('seasons'):$state.go('seasons-detail',{seasonId: data.id});
                },1100);
            }).catch(function (data) {
                $scope.btnDisable = false;
                $scope.blockModal.hide();
                ErrorHandle.handleOneError(data);
            });
        };

        function checkValidDate(){
            var isValid = true;
            if($scope.season.expectedBeginDate && $scope.season.expectedFinishDate
                && ($scope.season.expectedBeginDate > $scope.season.expectedFinishDate))
            {
                AlertService.error("Ngày bắt đầu DK phải trước Ngày kết thúc DK");
                isValid = false;
            }

            if($scope.season.realityBeginDate && $scope.season.realityFinishDate
                && ($scope.season.realityBeginDate > $scope.season.realityFinishDate))
            {
                AlertService.error("Ngày bắt đầu TT phải trước Ngày kết thúc TT");
                isValid = false;
            }

            return isValid;
        }

        var tenantId = window.localStorage.getItem("farmId");
        var tenantName = window.localStorage.getItem("farmName");
        $scope.season.tenantId = tenantId;
        $scope.season.tenantName = tenantName;

        var areaCbb = {
            id:'areaCbb',
            url:'/api/areas',
            originParams: 'tenantId == ' + tenantId,
            queryRelate: '',
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
        ComboBoxController.init($scope, areaCbb);

        var productCbb = {
            id:'productCbb',
            url:'/api/products',
            specialUrl: '',
            originParams: 'tenantId == ' + tenantId,
            queryRelate: '',
            valueField:'id',
            labelField:'name',
            searchField:'name',
            table: null,
            column: null,
            maxItems: 1,
            ngModel: [],
            options: [],
            placeholder: $translate.instant("global.placeholder.choose")
        };
        ComboBoxController.init($scope, productCbb);

        function reloadDatepicker(id){
            var datePickerInit = $("#" + id);
            datePickerInit.on("blur", function () {
                DateTimeValidation.onBlurDate($(this), false);
            }).kendoDatePicker({
                format: "dd/MM/yyyy",
                change: function () {
                    if(id === 'expectedBeginDate'){
                        $scope.season.expectedBeginDate = this.value() != null ? this.value().getTime() : null;
                    } else if(id === 'realityBeginDate'){
                        $scope.season.realityBeginDate = this.value() != null ? this.value().getTime() : null;
                        reloadState();
                    } else if(id === 'expectedFinishDate'){
                        $scope.season.expectedFinishDate = this.value() != null ? this.value().getTime() : null;
                    } else if(id === 'realityFinishDate'){
                        $scope.season.realityFinishDate = this.value() != null ? this.value().getTime() : null;
                        reloadState();
                    }
                }
            });
        }

        function reloadState(){
            // Đợt mới tạo không có ngày bắt đầu thực tế hoặc có ngày bắt đầu thực tế
            var state = 0;
            // nhưng chưa đến ngày bắt đầu thực tế thì đợt ở trạng thái Chưa thự hiện
            if($scope.season.realityBeginDate == null || ($scope.season.realityBeginDate > $scope.today)){
                state = 0;
            }
            if($scope.season.realityBeginDate != null && $scope.season.realityBeginDate <= $scope.today){
                state = 1;
            }
            if($scope.season.realityFinishDate != null && $scope.season.realityFinishDate <= $scope.today){
                state = 2;
            }
            $scope.season.state = state;

            // state = 0 - reset het tick phase
            if(state === 0 && $scope.season.phases && $scope.season.phases.length > 0){
                var phases = $scope.season.phases;
                for(var i = 0; i <= phases.length; i ++){
                    if(!phases[i]) continue;
                    phases[i].state = false;
                }

                $scope.season.phases = phases;
            }
        }

        $timeout(function () {
            reloadDatepicker('expectedBeginDate');
            reloadDatepicker('realityBeginDate');
            reloadDatepicker('expectedFinishDate');
            reloadDatepicker('realityFinishDate');
        });
        // =============================================
        // phase config
        $scope.showAddPhase = false;
        $scope.showEditPhase = false;
        $scope.editPhasePosition = null;
        $scope.newItemPhase = {};

        // show add column
        $scope.addNewPhase = function () {
            $scope.showAddPhase = true;
            $scope.showEditPhase = false;
            $scope.editPhasePosition = null;
        };

        $scope.createByHand = 0;
        // click add item
        $scope.saveItemPhase = function () {
            if(!$("#stageName").parsley().isValid() && !$("#stageDes").parsley().isValid()) return;

            if(!checkExitsPhase()){
                var newItemPhase = angular.copy($scope.newItemPhase);
                newItemPhase.state = $scope.newItemPhase.state ? $scope.newItemPhase.state : false;
                $scope.season.phases.push(newItemPhase);

                reloadPhasePage(newItemPhase.state);

                $timeout(function () {
                    resetFormPhase();
                });
            } else{
                AlertService.error("Giai đoạn thực hiện này đã tồn tại");
            }
        };

        $scope.editPhase = function (index) {
            $scope.showAddPhase = false;
            $scope.showEditPhase = true;
            $scope.editPhasePosition = index;
            var newItemPhase = angular.copy($scope.season.phases[index]);

            $scope.newItemPhase = newItemPhase;
        };

        // save item vừa sửa
        $scope.savePhaseEdit = function (index) {
            if($("#editPhaseName").parsley().isValid() || $("#editPhaseDes").parsley().isValid()){
                if(!checkExitsPhase(index)){
                    var newItemPhase = angular.copy($scope.newItemPhase);
                    $scope.season.phases[index] = newItemPhase;

                    reloadPhasePage(newItemPhase.state, index);

                    $timeout(function () {
                        resetFormPhase();
                    });
                } else{
                    AlertService.error("Giai đoạn thực hiện này đã tồn tại");
                }
            }
        };

        //delete an item
        $scope.deletePhase = function (index) {
            var phases = $scope.season.phases;
            if(phases[index] && phases[index].createByHand) $scope.createByHand -= 1;

            $scope.season.phases = phases.slice(0, index).concat(phases.slice(index + 1));
            resetFormPhase();
        };

        //change checkbox
        function reloadPhasePage (isChecked, index) {
            var phases = angular.copy($scope.season.phases);

            for(var i = 0; i < phases.length; i++){
                // sửa
                if(angular.isDefined(index) && index >= 0){
                    if(isChecked && i < index){
                        phases[i].state = true;
                    } else if(!isChecked && i > index){
                        phases[i].state = false;
                    }
                } else if(!angular.isDefined(index) && isChecked){
                    // thêm mới - có checked thì check hết, ngược lại bỏ
                    phases[i].state = true;
                }
            }

            $scope.season.phases = phases;
        }

        //reset form
        function resetFormPhase(){
            $scope.showAddPhase = false;
            $scope.showEditPhase = false;
            $scope.editPhasePosition = null;
            $scope.newItemPhase = {};

            $("#stageName").parsley().reset();
            $("#stageDes").parsley().reset();
        }

        function checkExitsPhase(index){
            var newItemPhase = $scope.newItemPhase;
            var phases = $scope.season.phases;
            if($scope.season.phases.length < 1) return false;
            var exitst = false;

            for (var i = 0; i < phases.length; i++){
                if(angular.isDefined(index) && index == i) continue;
                if(newItemPhase.name == phases[i].name){
                    exitst = true;
                    break;
                }
            }

            return exitst;
        }

        $scope.cancelHandlePhase = function(){
            resetFormPhase();
        };
        // ==================================

        $scope.onChangeFarm = function () {
            var tenantId = $scope.season.tenantId ? $scope.season.tenantId : 0;
            areaCbb.options = [""];
            areaCbb.resetScroll = true;
            areaCbb.originParams = 'tenantId==' + tenantId;
            ComboBoxController.init($scope, areaCbb);

            productCbb.options = [""];
            productCbb.resetScroll = true;
            productCbb.originParams = "tenantId==" + tenantId;
            ComboBoxController.init($scope, productCbb);
        };

        $scope.onChangeProduct = function () {
            if(!$scope.season.productId) return;

            // tìm đợt hoàn thành gần đây nhất của sản phẩm này
            var query = "query=productId==" + $scope.season.productId + ";state==2&page=0&size=1&sort=realityFinishDate,desc;id,desc";
            Season.getPage(query).then(function (res) {
                if(!res.data || res.data.length < 1) {
                    resetFormPhase();
                    $scope.season.phases = [];
                    return;
                }
                var season = res.data[0];
                // get phase by season id
                Phase.getPage("query=seasonId==" + season.id).then(function (data) {
                    resetFormPhase();
                    var newPhases = [];
                    for(var i = 0; i < data.data.length; i++){
                        var phase = data.data[i];
                        phase.state = false;
                        phase.id = null;
                        newPhases.push(phase);
                    }
                    $scope.season.phases = newPhases;
                }).catch(function (err) {
                    ErrorHandle.handleOneError(err);
                });
            });
        };
        //===============================
        if (angular.element('#form_createSeason').length) {
            var $formValidate = $('#form_createSeason');
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