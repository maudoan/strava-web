(function () {
    'use strict';

    angular
        .module('erpApp')
        .factory('DateTimeValidation', DateTimeValidation);

    DateTimeValidation.$inject = ['$translate'];

    function DateTimeValidation($translate, $scope) {
        var service = {
            init: init,
            onBlur: onBlur,
            validDateInput: validDateInput,
            validDateTimeInput: validDateTimeInput,
            onBlurDate: onBlurDate,
            onBlurTime: onBlurTime
        };

        return service;

        function init(scope) {
            $scope = scope;
            kendo.culture("vi-VN");
        }

        function onBlur($element, spanText) {
            $scope['errorDateTimeMessage'] = "Ngày tháng phải theo đúng định dạng: 23/01/2019 hoặc 23/01/2019 17:45:30";
            var value = $element.val().toString().trim();
            var datePicker = $element.data("kendoDateTimePicker");
            if (validDateInput(value)) {
                datePicker.value(value + " 00:00:00");
                datePicker.trigger('change');
                showErrorMessage($element, false, $scope['errorDateTimeMessage'], spanText);
            } else if (!validDateTimeInput(value)) {
                datePicker.value(null);
                datePicker.trigger('change');
                showErrorMessage($element, true, $scope['errorDateTimeMessage'], spanText);
            } else {
                showErrorMessage($element, false, $scope['errorDateTimeMessage'], spanText);
            }
        }

        function onBlurDate($element, spanText) {
            $scope['errorDateTimeMessage'] = "Ngày tháng phải theo đúng định dạng: 23/01/2019";
            var value = $element.val().toString().trim();
            var datePicker = $element.data("kendoDatePicker");
            if (validDateInput(value)) {
                datePicker.value(value + " 00:00:00");
                datePicker.trigger('change');
                showErrorMessage($element, false, $scope['errorDateTimeMessage'], spanText);
            } else if (!validDateInput(value)) {
                datePicker.value(null);
                datePicker.trigger('change');
                showErrorMessage($element, true, $scope['errorDateTimeMessage'], spanText);
            } else {
                showErrorMessage($element, false, $scope['errorDateTimeMessage'], spanText);
            }
        }

        function onBlurTime($element, spanText) {
            $scope['errorDateTimeMessage'] = "Thời gian phải theo đúng định dạng: 08:30:00";
            var value = $element.val().toString().trim();
            // ngày bắt đầu bộ đếm 01/01/1970
            var fullTime = "01/01/1970 " + value;

            var datePicker = $element.data("kendoTimePicker");
            if (validDateTimeInput(fullTime)) {
                datePicker.value(value);
                datePicker.trigger('change');
                showErrorMessage($element, false, $scope['errorDateTimeMessage'], spanText);
            } else if (!validDateTimeInput(fullTime)) {
                datePicker.value("");
                datePicker.trigger('change');
                showErrorMessage($element, true, $scope['errorDateTimeMessage'], spanText);
            } else {
                showErrorMessage($element, false, $scope['errorDateTimeMessage'], spanText);
            }
        }

        function validDateInput(value) {
            return moment(value, "DD/MM/YYYY", true).isValid() ||
                moment(value, "D/MM/YYYY", true).isValid() ||
                moment(value, "DD/M/YYYY", true).isValid() ||
                moment(value, "D/M/YYYY", true).isValid();
        }

        function validDateTimeInput(value) {
            return moment(value, "DD/MM/YYYY HH:mm:ss", true).isValid() ||
                moment(value, "DD/MM/YYYY HH:mm", true).isValid();
        }

        function showErrorMessage($element, show, message, spanText) {
            if (show) {
                if($element.closest('.errorDateTimeContainer').find('.errorDateTime').length === 0) {
                    $element.closest('.errorDateTimeContainer').append(
                        '<div class="errorDateTime uk-margin-top">' +
                            '<span title="' + message + '" class="uk-text-danger">' + message + '</span>' +
                        '</div>'
                    );

                    if(spanText) {
                        $element.closest('.errorDateTimeContainer').find('.errorDateTime').addClass('longTextShowToolTip');
                    }
                }
            } else {
                $element.closest('.errorDateTimeContainer').find('.errorDateTime').remove();
            }
        }
    }
})();
