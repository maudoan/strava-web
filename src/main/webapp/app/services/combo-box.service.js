(function () {
    'use strict';
    angular
        .module('erpApp')
        .factory('ComboBoxController', ComboBoxController);

    ComboBoxController.$inject = ['$rootScope', 'Principal','$translate','apiData','$http'];

    function ComboBoxController($rootScope, Principal, $translate,apiData,$http, $scope) {
        var service = {
            init: init,
            isEmpty: isEmpty,
            clone:clone,
            checkIsValidForm: checkIsValidForm,
            resetCheckValidForm: resetCheckValidForm,
            removeUnicode: removeUnicode,
            setLong: setLong,
            getProductByLocationIds: getProductByLocationIds,
            getParamSetLong: getParamSetLong,
            isEmptyObject: isEmptyObject,
            isValidDecimal: isValidDecimal,
            getDefaultOrganization: getDefaultOrganization
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

        function setLong(key, val) {
            var c1 = key + '=="*[' + val +']*",'; // [x]
            var c2 = key + '=="*[' + val +',*",'; // [x,1,2]
            var c3 = key + '=="*,' + val +',*",'; // [1,x,2]
            var c4 = key + '=="*,' + val +']*"'; //  [1,2,x]
            var str = '(' + c1 + c2 + c3 + c4 +')';

            return str;
        }

        function getProductByLocationIds(key, val){
            var c1 = key + '=="*[' + val +']*",'; // [x]
            var c2 = key + '=="*[' + val +',*",'; // [x,1,2]
            var c3 = key + '=="*,' + val +',*",'; // [1,x,2]
            var c4 = key + '=="*,' + val +']*",'; //  [1,2,x]
            var c5 = key + '==null'; //  null

            var str = '(' + c1 + c2 + c3 + c4 + c5 + ')';

            return str;
        }

        function getParamSetLong(key, val){
            var c1 = key + '=="*[' + val +']*",'; // [x]
            var c2 = key + '=="*[' + val +',*",'; // [x,1,2]
            var c3 = key + '=="*,' + val +',*",'; // [1,x,2]
            var c4 = key + '=="*,' + val +']*"'; //  [1,2,x]
            var str = '(' + c1 + c2 + c3 + c4 + ')';

            return str;
        }

        function init(scope, config) {
            $scope = scope;

            $scope.ComboBox[config.id] = {};
            if(!angular.isDefined(config.resetScroll)){
                $scope.ComboBox[config.id].resetScroll = false;
            } else {
                $scope.ComboBox[config.id].resetScroll = config.resetScroll;
            }
            if(!angular.isDefined(config.page)){
                $scope.ComboBox[config.id].page = 0;
            } else {
                $scope.ComboBox[config.id].page = config.page;
            }
            if(!angular.isDefined(config.totalCount)){
                $scope.ComboBox[config.id].totalCount = null;
            } else {
                $scope.ComboBox[config.id].totalCount = config.totalCount;
            }
            if(!angular.isDefined(config.replaceUrl)){
                config.replaceUrl = null;
            }

            if(!angular.isDefined(config.perPage)){
                $scope.ComboBox[config.id].perPage = 10;
            } else {
                $scope.ComboBox[config.id].perPage = config.perPage;
            }

            $scope.ComboBox[config.id].ngModel = config.ngModel;
            $scope.ComboBox[config.id].options = config.options;
            $scope.ComboBox[config.id].table = config.table;
            $scope.ComboBox[config.id].column = config.column;
            $scope.ComboBox[config.id].scope = $scope;
            $scope.ComboBox[config.id].config = {
                placeholder:config.placeholder,
                plugins: {
                    'infinite_scroll': {},
                    'remove_button': {
                        label     : ''
                    }
                }, //enable load more
                maxItems: config.maxItems,
                valueField: config.valueField,
                labelField: config.labelField,
                searchField:config.searchField,
                create: false,
                render: {
                    option: function (data, escape) {
                        if(!data[config.labelField]) return '<div class="hide"></div>';
                        return '<div class="option">' + '<span class="title" title="'+escape(data[config.labelField]) + '">' + escape(data[config.labelField]) + '</span>' + '</div>';
                    },
                    item: function (data, escape) {
                        return '<div class="item" title="'+escape(data[config.labelField]) +'">' + escape(data[config.labelField]) + '</div>';
                    }
                },
                //use load event if use load more
                load: function (query, callback) {
                    query = JSON.parse(query)
                    if($scope.ComboBox[config.id].resetScroll){
                        query.page = 0;
                        callback($scope.ComboBox[config.id].resetScroll);
                        $scope.ComboBox[config.id].resetScroll = false;
                    }
                    $scope.ComboBox[config.id].page = query.page || 0;
                    if (!$scope.ComboBox[config.id].totalCount || $scope.ComboBox[config.id].totalCount > ( ($scope.ComboBox[config.id].page - 1) * $scope.ComboBox[config.id].perPage)) {
                        if(!config.url || config.url === "") return;
                        var api = apiData.genApi(config.url, config.searchField, query.search, $scope.ComboBox[config.id].perPage, null, config.originParams, query.page, config.replaceUrl, config.orderBy);
                        $http.get(api).then(function (response) {
                            $scope.ComboBox[config.id].totalCount = parseInt(response.headers()["x-total-count"], 10);
                            callback(response.data);
                        });
                    } else {
                        callback();
                    }
                }
            };

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

        function resetCheckValidForm($form){
            $form.find("input.md-input, textarea.md-input").each(function () {
                $(this).parsley().reset();
            });
        }

        function removeUnicode(str) {
            str = str.replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g, "a");
            str = str.replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g, "e");
            str = str.replace(/ì|í|ị|ỉ|ĩ/g, "i");
            str = str.replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g, "o");
            str = str.replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g, "u");
            str = str.replace(/ỳ|ý|ỵ|ỷ|ỹ/g, "y");
            str = str.replace(/đ/g, "d");
            str = str.replace(/À|Á|Ạ|Ả|Ã|Â|Ầ|Ấ|Ậ|Ẩ|Ẫ|Ă|Ằ|Ắ|Ặ|Ẳ|Ẵ/g, "A");
            str = str.replace(/È|É|Ẹ|Ẻ|Ẽ|Ê|Ề|Ế|Ệ|Ể|Ễ/g, "E");
            str = str.replace(/Ì|Í|Ị|Ỉ|Ĩ/g, "I");
            str = str.replace(/Ò|Ó|Ọ|Ỏ|Õ|Ô|Ồ|Ố|Ộ|Ổ|Ỗ|Ơ|Ờ|Ớ|Ợ|Ở|Ỡ/g, "O");
            str = str.replace(/Ù|Ú|Ụ|Ủ|Ũ|Ư|Ừ|Ứ|Ự|Ử|Ữ/g, "U");
            str = str.replace(/Ỳ|Ý|Ỵ|Ỷ|Ỹ/g, "Y");
            str = str.replace(/Đ/g, "D");
            return str;
        }

        function isValidDecimal(val) {
            var tmp = val.split(".");
            if(tmp.length <= 1) return true;

            // check xem có bao nhiêu số thập phân đằng sau
            return tmp[1].toString().length <= 3;
        }

        function getDefaultOrganization (){
            var defaultVal = {id: 1, name: 'Tất cả'};
            var isAdmin = false;

            // check is admin => return tất cả
            Principal.hasAuthority("ROLE_SYSTEM_ADMIN").then(function (data) {
                isAdmin = data;
            });
            if(isAdmin) return defaultVal;

            var currentUser = $rootScope.currentUser;
            var organizations = currentUser.organizations;
            if(!organizations || organizations.length < 1) return defaultVal;

            // 1 dn thì trả về dn đó
            if(organizations.length < 2) return organizations[0];

            /*
            * xét xem có bao nhiêu DN độc lập
            * nếu chỉ có 1 cha => hiển thị cha đó, ngược lại hiển thị tất cả*/
            var countParentId = 0;
            var parent = defaultVal;
            var listParentIds = [];
            for(var i = 0; i < organizations.length; i++){
                if(!organizations[i].parentId){
                    countParentId += 1;
                    parent = organizations[i];
                    // lấy list cha riêng
                    listParentIds.push(organizations[i].id);
                } else{
                    // có thuộc cha đó không => không thì ở nhiều doanh nghiệp
                    // lấy cha cao nhất
                    var relateName = organizations[i].relateName;
                    var relateNameSplit = relateName.split('/');
                    if(!listParentIds.includes(parseInt(relateNameSplit[0]))){
                        countParentId += 1;
                    }
                }

                // có nhiều cha => lấy tất cả
                if(countParentId === 2){
                    parent = defaultVal;
                    break;
                }
            }

            return parent;
        }
    }
})();
