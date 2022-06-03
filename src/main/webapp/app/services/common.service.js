(function () {
    'use strict';

    angular
        .module('erpApp')
        .factory('Common', Common);

    Common.$inject = ['$rootScope', '$translate'];
    function Common($rootScope, $translate) {
        var service = {
            isEmpty: isEmpty,
            isEmptyObject: isEmptyObject,
            isObject: isObject,
            clone:clone,
            getDefaultTenant: getDefaultTenant,
            getTypeFarm: getTypeFarm,
            truncateString: truncateString,
            checkIsValidForm: checkIsValidForm
        };

        return service;

        function isEmpty(x){
            if(!angular.isDefined(x) || x == null || x === ''){
                return true;
            }
            return false;
        }

        function isEmptyObject(obj){
            if(obj === "" || (Object.entries(obj).length === 0 && obj.constructor === Object)) return true;
            return false;
        }

        function isObject(obj) {
            var type = typeof obj;
            return type === 'function' || type === 'object' && !!obj;
        }

        function clone(src) {
            return JSON.parse(JSON.stringify(src));
        }

        function getDefaultTenant(){
            var defaultTenant = null;
            var currentUser = $rootScope.currentUser;
            var tenants = currentUser.tenants;
            if(!tenants || tenants.length <= 1) return;
            for(var i = 0; i < tenants.length; i++){
                if(tenants[i].type === 1) continue;

                // chỉ lấy ra vị trí thứ 2, bởi vì vị trí đầu tiên là tenant mặc định khi tạo
                defaultTenant = tenants[i];
                break;
            }

            return defaultTenant;
        }

        function getTypeFarm() {
            return [
                {id: 1, name: $translate.instant('infrastructure.farm.typeFarm.grow')},
                {id: 2, name: $translate.instant('infrastructure.farm.typeFarm.feed')},
                {id: 3, name: $translate.instant('infrastructure.farm.typeFarm.growAndFeed')}
            ];
        }
        
        function truncateString(string, n) {
            return (string.length > n) ? string.substr(0, n-1) + '...' : string;
        }
        
        function checkIsValidForm($form){
            // check riêng từng input
            var checkValid = true;
            $form.find("input.md-input, textarea.md-input").each(function () {
                if(!$(this).parsley().isValid()){
                    checkValid = false;
                    return false;
                }
            });
            return checkValid;
        }
    }
})();