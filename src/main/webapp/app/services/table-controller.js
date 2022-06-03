(function () {
    'use strict';
    angular
        .module('erpApp')
        .factory('TableController', TableController);

    TableController.$inject = ['AlertService','ErrorHandle','$translate','$timeout'];

    function TableController(AlertService,ErrorHandle,$translate,$timeout, $scope) {
        var service = {
            initTable: initTable,
            sortDefault: sortDefault,
            sortDefaultByUpdated: sortDefaultByUpdated,
            reloadPage: reloadPage,
            reloadPageAndPageable:reloadPageAndPageable,
            getCurrentPageSize: getCurrentPageSize,
            getSelectedRowIDs: getSelectedRowIDs,
            goToFirstPage: goToFirstPage,
            goToLastPage: goToLastPage,
            defaultDelete:defaultDelete,
            defaultActive:defaultActive,
            defaultDeactive:defaultDeactive,
            handleSort:handleSort,
            handleFilter:handleFilter,
            checkIsValidForm: checkIsValidForm,
            deleteWithMessages: deleteWithMessages,
            highlightRowError: highlightRowError
        };

        return service;

        function initTable(scope, tableConfig) {
            $scope = scope;

            if($scope.TABLES == null) $scope.TABLES = {};

            var tableId = tableConfig.tableId;
            $scope.TABLES[tableId] = tableConfig;
            //console.log($scope.TABLES)

            init(scope, tableId);
            if($scope.initFirstTime == null || $scope.initFirstTime == false) {
                main();
                $scope.initFirstTime = true;
            }

            $scope.$on('onLastRepeat', function (scope, element, attrs) {
                var $ts_pager_filter = $("#"+tableId);
                if ($(element).closest($ts_pager_filter).length) {
                    // Tooltip for long text
                    if($scope.TABLES[tableId].param_allow_show_tooltip) {
                        $ts_pager_filter.find('tbody tr').each(function() {
                            var tr_tag = $(this);
                            $(tr_tag).find('td').each(function() {
                                if($(this).hasClass('fullDisplayText'))
                                    return;
                                if($(this).width() >= 200) {
                                    $(this).addClass('longTextShowToolTip');
                                    $(this).attr('title',$(this).text());
                                } else {
                                    $(this).removeClass('longTextShowToolTip');
                                    $(this).removeAttr('title');
                                }
                                /*if($(this).text().length >= 50) {
                                    $(this).addClass('longTextShowToolTip');
                                    $(this).attr('title',$(this).text());
                                } else {
                                    $(this).removeClass('longTextShowToolTip');
                                    $(this).removeAttr('title');
                                }*/
                            });
                        });
                    }

                    // select/unselect all table rows
                    $ts_pager_filter.find('.ts_checkbox_all')
                        .iCheck({
                            checkboxClass: 'icheckbox_md',
                            radioClass: 'iradio_md',
                            increaseArea: '20%'
                        })
                        .on('ifChecked', function () {
                            $ts_pager_filter
                                .find('.ts_checkbox')
                                // check all checkboxes in table
                                .prop('checked', true)
                                .iCheck('update')
                                // add highlight to row
                                .closest('tr')
                                .addClass('row_highlighted');

                            $scope.selectAllRows(tableId);
                        })
                        .on('ifUnchecked', function () {
                            $ts_pager_filter
                                .find('.ts_checkbox')
                                // uncheck all checkboxes in table
                                .prop('checked', false)
                                .iCheck('update')
                                // remove highlight from row
                                .closest('tr')
                                .removeClass('row_highlighted');

                            $scope.unSelectAllRows(tableId);
                        });

                    // select/unselect table row
                    $ts_pager_filter.find('.ts_checkbox')
                        .on('ifUnchecked', function () {
                            $(this).closest('tr').removeClass('row_highlighted');
                            $scope.unSelectOneRow($(this), tableId);
                        })
                        .on('ifChecked', function () {
                            $(this).closest('tr').addClass('row_highlighted');
                            $scope.selectOneRow($(this), tableId);
                        });
                }

                var checkCount = 0;
                var model = $scope.TABLES[tableId].model;
                for(var i =0; i< $scope.TABLES[tableId].param_check_list.length; i++){
                    var checkedId = Number($scope.TABLES[tableId].param_check_list[i]);
                    if ($scope.checkBoxIds[model].indexOf(checkedId) > -1){
                        checkCount ++;
                        var $row_checked = $("#"+ checkedId);
                        $row_checked.prop('checked', true)
                            .iCheck('update')
                            // add highlight to row
                            .closest('tr')
                            .addClass('row_highlighted');
                    }
                }
                if(angular.isDefined($scope[model])){
                    if(checkCount == $scope[model].length){
                        $ts_pager_filter.find('.ts_checkbox_all').prop('checked', true)
                            .iCheck('update')
                            // add highlight to row
                            .closest('tr')
                            .addClass('row_highlighted');
                    }
                }
            });

        }

        function init(scopeParam, tableId) {
            $scope = scopeParam;
            if($scope.selectPage == null) $scope.selectPage = $translate.instant('admin.pagination.selectPage');
            if($scope.pageSize == null) $scope.pageSize = $translate.instant('admin.pagination.pageSize');
            if($scope.sortIcons == null) $scope.sortIcons = ["sort", "keyboard_arrow_up", "keyboard_arrow_down"];
            $scope.TABLES[tableId].param_allow_show_tooltip = "true";
            $scope.TABLES[tableId].tree_query= "";
            $scope.TABLES[tableId].firstLoad= false;
            $scope.TABLES[tableId].param_current_page= 0;
            $scope.TABLES[tableId].param_page_size= 0;
            $scope.TABLES[tableId].param_total_result= 0;
            $scope.TABLES[tableId].param_page_total= 0;
            $scope.TABLES[tableId].param_sort_field= "";
            $scope.TABLES[tableId].sort= {};
            $scope.TABLES[tableId].param_check_list= [];
            $scope.TABLES[tableId].selectize_page_options =  [];
            $scope.TABLES[tableId].selectize_page_config =  {plugins: {'tooltip': ''}, create: false, maxItems: 1};
            $scope.TABLES[tableId].selectize_pageNum_config =  {plugins: {'tooltip': ''}, create: false, maxItems: 1};

            $scope.TABLES[tableId].filter = {};
            for (var key in $scope.TABLES[tableId].columns) {
                $scope.TABLES[tableId].sort[key] = $scope.sortIcons[0];
                $scope.TABLES[tableId].filter[key] = "";
            }

            if(angular.isDefined($scope.TABLES[tableId].default_size_option)){
                var default_size_option = $scope.TABLES[tableId].default_size_option;
                $scope.TABLES[tableId].param_page_size = $scope.TABLES[tableId].page_size_option[default_size_option];
            } else{
                $scope.TABLES[tableId].param_page_size = $scope.TABLES[tableId].page_size_option[1];
            }
        }

        function main() {
            $scope.setPageDisplay = function (tableId) {
                var left = $scope.TABLES[tableId].param_current_page * $scope.TABLES[tableId].param_page_size + 1;
                var right;
                if ($scope.TABLES[tableId].param_current_page == $scope.TABLES[tableId].param_page_total - 1) {
                    right = $scope.TABLES[tableId].param_total_result;
                } else {
                    right = ($scope.TABLES[tableId].param_current_page + 1) * $scope.TABLES[tableId].param_page_size;
                }
                if ($scope.TABLES[tableId].param_total_result == 0)
                    $("#" + $scope.TABLES[tableId].pager_id).find('.pageDisplay').html("0");
                else
                    $("#" + $scope.TABLES[tableId].pager_id).find('.pageDisplay').html(left + "-" + right + "/" + $scope.TABLES[tableId].param_total_result);
                if (!allowReloadDropSelectPage) {
                    $scope.TABLES[tableId].selectize_page = $scope.TABLES[tableId].param_current_page + 1;
                }

                // Disable all action if result have only one page
                if($scope.TABLES[tableId].param_page_total == 1) {
                    $("#" + $scope.TABLES[tableId].pager_id).find('.firstPage').addClass('disableMouse');
                    $("#" + $scope.TABLES[tableId].pager_id).find('.lastPage').addClass('disableMouse');
                    $("#" + $scope.TABLES[tableId].pager_id).find('.prevPage').addClass('disableMouse');
                    $("#" + $scope.TABLES[tableId].pager_id).find('.nextPage').addClass('disableMouse');
                } else if($scope.TABLES[tableId].param_page_total > 1) {
                    $("#" + $scope.TABLES[tableId].pager_id).find('.firstPage').removeClass('disableMouse');
                    $("#" + $scope.TABLES[tableId].pager_id).find('.lastPage').removeClass('disableMouse');
                    $("#" + $scope.TABLES[tableId].pager_id).find('.prevPage').removeClass('disableMouse');
                    $("#" + $scope.TABLES[tableId].pager_id).find('.nextPage').removeClass('disableMouse');

                    // if current page is first page, then disable first & prev action
                    if($scope.TABLES[tableId].param_current_page == 0) {
                        $("#" + $scope.TABLES[tableId].pager_id).find('.firstPage').addClass('disableMouse');
                        $("#" + $scope.TABLES[tableId].pager_id).find('.prevPage').addClass('disableMouse');
                    }

                    // if current page is last page, then disable last & next action
                    if($scope.TABLES[tableId].param_current_page == $scope.TABLES[tableId].param_page_total - 1) {
                        $("#" + $scope.TABLES[tableId].pager_id).find('.lastPage').addClass('disableMouse');
                        $("#" + $scope.TABLES[tableId].pager_id).find('.nextPage').addClass('disableMouse');
                    }
                }
            }

            $scope.resetPageDisplay = function (tableId) {
                if($scope.TABLES[tableId].param_page_size>0){
                    var a = Math.floor($scope.TABLES[tableId].param_total_result / $scope.TABLES[tableId].param_page_size);
                    var b = $scope.TABLES[tableId].param_total_result % $scope.TABLES[tableId].param_page_size;
                    if (b > 0) {
                        $scope.TABLES[tableId].param_page_total = a + 1;
                    } else {
                        $scope.TABLES[tableId].param_page_total = a;
                    }
                    $scope.TABLES[tableId].param_current_page = 0;
                    $scope.TABLES[tableId].selectize_page_options = [];
                    for (var i = 0; i < $scope.TABLES[tableId].param_page_total; i++) {
                        $scope.TABLES[tableId].selectize_page_options.push("" + (i + 1));
                    }
                }
            }

            $scope.checkSelectAllBtn = function (show, tableId) {
                $("#" + tableId).find('.ts_checkbox_all').prop('checked', show).iCheck('update');
            }

            $scope.showDeleteBtn = function (tableId, show) {
                if($scope.TABLES[tableId].configActiveBtn) {
                    $("#activateBtn").removeClass("hideElement")
                    $("#deactivateBtn").removeClass("hideElement")
                    $("#restoreBtn").removeClass("hideElement")
                    if (show) {
                        $("#deleteBtn").removeClass("hideElement")
                        $("#activateBtn").removeClass("hideElement")
                        $("#deactivateBtn").removeClass("hideElement")
                        $("#restoreBtn").removeClass("hideElement")
                    } else {
                        $("#deleteBtn").addClass("hideElement");
                    }
                } else {
                    if (show) {
                        $("#deleteBtn").removeClass("hideElement")
                        $("#activateBtn").removeClass("hideElement")
                        $("#deactivateBtn").removeClass("hideElement")
                        $("#restoreBtn").removeClass("hideElement")
                    } else {
                        $("#deleteBtn").addClass("hideElement");
                        $("#activateBtn").addClass("hideElement");
                        $("#deactivateBtn").addClass("hideElement");
                        $("#restoreBtn").addClass("hideElement")
                    }
                }

                if ($scope.TABLES[tableId].showDeleteBtnCallback != null) {
                    $scope.TABLES[tableId].showDeleteBtnCallback(table_id, show);
                }
            }

            $scope.getCommonQuery = function(tableId,parentValue) {
                var query = "";
                var table = $scope.TABLES[tableId];
                for (var key in table.filter) {
                    if (table.filter[key] != null && table.filter[key].length != "".length) {     // neu co gia tri tim kiem
                        switch (table.columns[key]) {
                            case "Text":
                                query += key + '=="*' + table.filter[key] + '*";';
                                break;
                            case "SetLong":
                                var c1 = key + '=="*[' + table.filter[key] +']*",'; // [x]
                                var c2 = key + '=="*[' + table.filter[key] +',*",'; // [x,1,2]
                                var c3 = key + '=="*,' + table.filter[key] +',*",'; // [1,x,2]
                                var c4 = key + '=="*,' + table.filter[key] +']*"'; //  [1,2,x]
                                query +='(' + c1 + c2 + c3 + c4 +');';
                                break;
                            case "TextExact":
                                query += key + '=="' + table.filter[key] + '";';
                                break;
                            case "Number":
                                query += key + '=="' + table.filter[key] + '";';
                                break;
                            case "MultiText":
                                if(table.filter[key].length > 0){
                                    var searchValue = table.filter[key].toString();
                                    query += key + '=in=("' + searchValue.replace(/,/g , '","') + '");';
                                }
                                break;
                            case "MultiNumber":
                                if(table.filter[key].length > 0){
                                    query += key + '=in=(' + table.filter[key].toString() + ');';
                                }
                                break;
                            case "NumberRange":
                                if(table.filter[key] == null){
                                    query += key + "=='null';";
                                }else{
                                    query += key + '>=' +table.filter[key].from + ';' + key + '<=' + table.filter[key].to + ';';
                                }
                                break;
                            case "DateTime":
                                if (table.filter[key] == null) {
                                    query += key + "=='null';";
                                } else if (table.filter[key].length > 0) {
                                    var datetime = table.filter[key].split("&");
                                    query += key + '>=' + datetime[0] + ';' + key + '<=' + datetime[1] + ';';
                                }
                                break;
                        }
                    }
                    else if(table.filter[key] == null){
                        query += key + "=='null';";
                    }
                }
                query += table.customParams + table.tree_query;
                if (query.slice(-1) == ';')  query = query.substr(0, query.length - 1);

                if (parentValue != null) {
                    if(query != ""){
                        query +=";"
                    } else {
                        query +="query="
                    }
                    query += table.parent_column + '==' + parentValue;
                }

                var params = "&page=" + table.param_current_page +
                             "&size=" + table.param_page_size +
                             "&sort=" + table.param_sort_field +
                             "," + table.sortType;
                // console.log(query+params)
                if(angular.isDefined(table.parent_column) && table.parent_column != null){
                    query = query + params
                    return query;
                }
                query = "query=" + query + params;
                if(angular.isDefined(table.specialUrl) && table.specialUrl){
                    var queryUrl = table.specialUrl + "&" + query;
                    query = queryUrl;
                }
                return query;
            }

            $scope.getChildQuery = function(table_id,parentValue,type,page) {
                var query = "";
                for (var i = 0; i < $scope.TABLES[table_id].param_filter_list.length; i++) {
                    if ($scope.TABLES[table_id].param_filter_list[i] != null && $scope.TABLES[table_id].param_filter_list[i].length != "".length) {
                        if ($scope.TABLES[table_id].param_fields_type[i] =="Text"){
                            query += $scope.TABLES[table_id].param_fields[i] + '=="*' + $scope.TABLES[table_id].param_filter_list[i] + '*";';
                        } else if ($scope.TABLES[table_id].param_fields_type[i] =="TextExact"){
                            query += $scope.TABLES[table_id].param_fields[i] + '=="' + $scope.TABLES[table_id].param_filter_list[i] + '";';
                        } else if($scope.TABLES[table_id].param_fields_type[i] =="Number"){
                            query += $scope.TABLES[table_id].param_fields[i] + '==' + $scope.TABLES[table_id].param_filter_list[i] + ';';
                        } else if($scope.TABLES[table_id].param_fields_type[i] =="MultiText" && $scope.TABLES[table_id].param_filter_list[i].length > 0) {
                            var searchValue = $scope.TABLES[table_id].param_filter_list[i].toString();
                            query += $scope.TABLES[table_id].param_fields[i] + '=in=("' + searchValue.replace(/,/g , '","') + '");';
                        } else if($scope.TABLES[table_id].param_fields_type[i] =="MultiNumber" && $scope.TABLES[table_id].param_filter_list[i].length > 0) {
                            query += $scope.TABLES[table_id].param_fields[i] + '=in=(' + $scope.TABLES[table_id].param_filter_list[i].toString() + ');';

                            //=========================================================================================/
                            // change only for search none project
                            // change id of none project to null
                            var CONSTANT_NONE_PROJECT = 19091992; // Don't change :)
                            if(query.indexOf(CONSTANT_NONE_PROJECT) > -1) {
                                if($scope.TABLES[table_id].param_filter_list[i].length == 1)
                                    query = query.replace('=in=(-'+CONSTANT_NONE_PROJECT+")", '==null');
                                else if($scope.TABLES[table_id].param_filter_list[i].length > 1){
                                    query = query.replace('-'+CONSTANT_NONE_PROJECT+",", '');
                                    query = query.replace(',-'+CONSTANT_NONE_PROJECT, '');
                                    query = query.replace('productVersionId=in=', 'productVersionId==null,productVersionId=in=');
                                }
                            }
                            //=========================================================================================/
                        }
                    }
                    if($scope.TABLES[table_id].param_fields_type[i] =="NumberRange") {
                        if($scope.TABLES[table_id].param_filter_list[i] == null){
                            query += $scope.TABLES[table_id].param_fields[i] + "=='null';";
                        }else{
                            query += $scope.TABLES[table_id].param_fields[i] + '>=' + $scope.TABLES[table_id].param_filter_list[i].from + ';' + $scope.TABLES[table_id].param_fields[i] + '<=' + $scope.TABLES[table_id].param_filter_list[i].to + ';';
                        }
                    }
                    if($scope.TABLES[table_id].param_fields_type[i] =="DateTime") {
                        if ($scope.TABLES[table_id].param_filter_list[i] == null) {
                            query += $scope.TABLES[table_id].param_fields[i] + "=='null';";
                        } else if ($scope.TABLES[table_id].param_filter_list[i].length > 0) {
                            var datetime = $scope.TABLES[table_id].param_filter_list[i].split("&");
                            query += $scope.TABLES[table_id].param_fields[i] + '>=' + datetime[0] + ';' + $scope.TABLES[table_id].param_fields[i] + '<=' + datetime[1] + ';';
                        }
                    }
                }
                query += $scope.TABLES[table_id].customParams + $scope.TABLES[table_id].tree_query;
                if (query.slice(-1) == ';')
                    query = query.substr(0, query.length - 1);

                if (parentValue != null) {
                    if(query != ""){
                        query +=";"
                    }
                    if(type == "text"){
                        query += $scope.TABLES[table_id].parent_column + '=="' + parentValue + '"';
                    } else {
                        query += $scope.TABLES[table_id].parent_column + '==' + parentValue;
                    }
                } else {
                    if(query != ""){
                        query +=";"
                    }
                    query += $scope.TABLES[table_id].parent_column + '==null';
                }

                var params = "&page=" + page +
                    "&size=" + $scope.TABLES[table_id].param_page_size +
                    "&sort=" + $scope.TABLES[table_id].param_sort_field +
                    "," + $scope.TABLES[table_id].sortType;
                query = "query=" + query + params
                return query;
            }

            $scope.expandAndCollapse = function(table_id,object,type){
                object.expand = ! object.expand;
                object.pageNum = 0;
                if (object.expand){
                    $scope.getChildObjects(table_id,object,type);
                } else {
                    object.pageableValue = false;
                    object.child = [];
                }
            }

            $scope.showMoreObjects  =function (table_id,object,type) {
                object.pageNum = object.pageNum +1;
                $scope.getChildObjects(table_id,object,type);
            }

            $scope.getChildObjects = function (table_id,object,type) {
                var parentValue = object[$scope.TABLES[table_id].parent_column];
                var model = $scope.TABLES[table_id].model;
                $scope.TABLES[table_id].getChildFunction($scope.getChildQuery(table_id,parentValue,type,object.pageNum)).then(function (response) {
                    if(angular.isDefined(object.child)){
                        object.child = object.child.concat(response.data);
                    } else {
                        object.child = response.data;
                    }
                    if(object.child.length < response.headers()["x-total-count"]){
                        object.pageableValue = "Show more...(" + object.child.length + "/" +response.headers()["x-total-count"] +")"
                    } else {
                        object.pageableValue = null;
                    }
                    for(var i =0; i< object.child.length; i ++){
                        var id = object.child[i].id;
                        if(!$scope.checkBoxIds[model].includes(id)){
                            $scope.checkBoxIds[model].push(id);
                        }
                    }
                })
            }

            function quantityCalculator (table_id,index){
                var model = $scope.TABLES[table_id].model;
                if(index < $scope[model].length){
                    var quantity_column = $scope.TABLES[table_id].quantity_column;
                    var quantity_query = $scope.TABLES[table_id].quantity_query;
                    var parentValue = $scope[model][index][$scope.TABLES[table_id].parent_column];
                    var query = $scope.getChildQuery(table_id,parentValue,$scope.groupColumn[$scope.modelAdFilter].type,0);
                    var tableModel = $scope.TABLES[table_id].tableModel;
                    $scope.TABLES[table_id].sumQuantity(query,tableModel,quantity_query).then(function (quantities) {
                        for(var i=0; i<quantity_column.length; i++){
                            $scope[model][index][quantity_column[i]] = quantities[0][i];
                        }
                        index++;
                        quantityCalculator(table_id,index);
                    })
                }
            }

            function quantityTotalCalculator (table_id){
                var quantity_query = $scope.TABLES[table_id].quantity_query;
                var query = "query=" + $scope.getCommonQuery(table_id,null);
                var tableModel = $scope.TABLES[table_id].tableModel;
                $scope.TABLES[table_id].sumQuantity(query,tableModel,quantity_query).then(function (quantities) {
                    $scope.TABLES[table_id].assignQuantities(quantities[0]);
                })
            }

            $scope.checkBoxIds= {}
            $scope.reloadPage = function (table_id, callback,isClearCheckList) {
                if($scope.TABLES[table_id] === undefined) return;
                $scope.TABLES[table_id].loading = true;
                //console.log($scope.TABLES[table_id]);
                if($scope.TABLES[table_id].param_page_size == undefined || $scope.TABLES[table_id].param_page_size == null || $scope.TABLES[table_id].param_page_size.length == 0) return;
                var allParams = $scope.getCommonQuery(table_id,null);
                var objectBody = null;

                if($scope.TABLES[table_id].paramBody != undefined && $scope.TABLES[table_id].paramBody != null) {
                    objectBody = $scope.TABLES[table_id].paramBody;
                }

                if(objectBody != null) {
                    $scope.TABLES[table_id].loadFunction(allParams, objectBody).then(function (data) {
                        $scope.handleData(table_id, callback,isClearCheckList, data);
                        $scope.TABLES[table_id].loading = false;
                    }).catch(function () {
                        $scope.TABLES[table_id].loading = false;
                    });
                } else if(angular.isDefined($scope.TABLES[table_id].parent_column) && $scope.TABLES[table_id].parent_column !=null){
                    $scope.TABLES[table_id].loadFunction(allParams,$scope.TABLES[table_id].parent_column).then(function (data) {
                        $scope.handleData(table_id, callback,isClearCheckList, data);
                        $scope.TABLES[table_id].loading = false;
                    }).catch(function () {
                        $scope.TABLES[table_id].loading = false;
                    });
                } else {
                    $scope.TABLES[table_id].loadFunction(allParams).then(function (data) {
                        $scope.handleData(table_id, callback,isClearCheckList, data);
                        $scope.TABLES[table_id].loading = false;
                    }).catch(function () {
                        $scope.TABLES[table_id].loading = false;
                        $scope.showNoResult = $translate.instant('global.messages.noResult');
                        $( "#"+$scope.TABLES[table_id].tableId ).after( $( "<div id=\"noResult"+$scope.TABLES[table_id].tableId +"\" style=\"background: white!important;color: black;\" class=\"uk-alert uk-text-center uk-alert-info\" data-uk-alert><span>"+$scope.showNoResult +"</span></div>") );
                    });
                }
            }

            $scope.reloadPageAndPageable = function(table_id){
                $scope.reloadPage(table_id, function (ok) {
                    if (ok == "OK") {
                        $scope.resetPageDisplay(table_id);
                        $scope.TABLES[table_id].preventSearch = false;
                    }
                    if ($scope.blockModal != null){$scope.blockModal.hide();}
                },true);
            }

            $scope.handleData = function (table_id, callback,isClearCheckList, data) {
                console.log("Call reload: " + table_id)      //DO NOT COMMENT THIS CONSOLE LOG
                //console.log($scope.TABLES[table_id]);
                // $scope.TABLES[table_id].param_check_list = [];
                $scope.checkSelectAllBtn(false, table_id);
                $scope.showDeleteBtn(table_id, false);
                if(!angular.isDefined(isClearCheckList)){
                    $scope.TABLES[table_id].param_check_list = [];
                }

                var model = $scope.TABLES[table_id].model;
                $scope[model] = data.data;
                $scope.checkBoxIds[model] = []
                for(var i =0; i< $scope[model].length; i ++){
                    $scope.checkBoxIds[model].push($scope[model][i].id)
                }
                if($scope.TABLES[table_id].handleAfterReload != null) {
                    $scope.TABLES[table_id].handleAfterReload(data.data, $scope.TABLES[table_id].handleAfterReloadParams);
                }

                if($scope.TABLES[table_id].handleAfterReload2 != null) {
                    $scope.TABLES[table_id].handleAfterReload2(data, $scope.TABLES[table_id].handleAfterReloadParams);
                }

                $scope.TABLES[table_id].param_total_result = data.headers()["x-total-count"];
                if(!angular.isDefined($scope.TABLES[table_id].param_total_result)) $scope.TABLES[table_id].param_total_result =0;
                if($scope.TABLES[table_id].param_total_result == 0){
                    if (!angular.element('#noResult'+$scope.TABLES[table_id].tableId).length) {
                        if($scope.TABLES[table_id]['DONT_SHOW_NO_DATA']){
                            return;
                        }
                        $scope.showNoResult = $translate.instant('global.messages.noResult');
                        //$( "#"+$scope.TABLES[table_id].idTable ).after( $( "<div id=\"noResult\" style=\"background: white!important;color: black;\" class=\"uk-alert uk-text-center uk-alert-info\" data-uk-alert><span>"+$scope.showNoResult +"</span></div>") );
                        $( "#"+$scope.TABLES[table_id].tableId ).after( $( "<div id=\"noResult"+$scope.TABLES[table_id].tableId +"\" style=\"background: white!important;color: black;\" class=\"uk-alert uk-text-center uk-alert-info\" data-uk-alert><span>"+$scope.showNoResult +"</span></div>") );
                    }
                }else{
                    if (angular.element('#noResult'+$scope.TABLES[table_id].tableId).length) {
                        $("#noResult"+$scope.TABLES[table_id].tableId).remove();
                    }
                }
                if (!$scope.TABLES[table_id].firstLoad) {
                    $scope.resetPageDisplay(table_id);
                    $scope.TABLES[table_id].selectize_pageNum = $scope.TABLES[table_id].param_page_size;
                    $scope.TABLES[table_id].firstLoad = true;
                }

                if (callback != null){
                    callback("OK");
                }

                if(Number($scope.TABLES[table_id].param_page_total) == 0 || ((Number($scope.TABLES[table_id].param_page_total) * Number($scope.TABLES[table_id].param_page_size) < Number($scope.TABLES[table_id].param_total_result)))) {
                    $scope.resetPageDisplay(table_id);
                }
                $scope.setPageDisplay(table_id);

                UIkit.tooltip('.tooltip').hide();

                if(angular.isDefined($scope.TABLES[table_id].parent_column) && $scope.TABLES[table_id].parent_column != null){
                    $scope.handleTreeTable(table_id)
                }
            }

            $scope.handleTreeTable =function (table_id) {
                //expand first row
                var model = $scope.TABLES[table_id].model;
                if($scope[model].length > 0){
                    var parentValue = $scope[model][0][$scope.TABLES[table_id].parent_column];
                    $scope[model][0].expand = true;
                    $scope[model][0].pageNum = 0;
                    $scope.TABLES[table_id].getChildFunction($scope.getChildQuery(table_id,parentValue,$scope.groupColumn[$scope.modelAdFilter].type,0)).then(function (response) {
                        $scope[model][0].child = response.data
                        if($scope[model][0].child.length < response.headers()["x-total-count"]){
                            $scope[model][0].pageableValue = "Show more...(" + $scope[model][0].child.length + "/" +response.headers()["x-total-count"] +")"
                        } else {
                            $scope[model][0].pageableValue = null;
                        }
                    })
                }
                if(angular.isDefined($scope.TABLES[table_id].quantity_column) && $scope.TABLES[table_id].quantity_column !=null){
                    quantityCalculator(table_id,0);
                }
                if(angular.isDefined($scope.TABLES[table_id].assignQuantities) && $scope.TABLES[table_id].assignQuantities !=null){
                    quantityTotalCalculator(table_id);
                }
            }

            $scope.customReloadPage = function (table_id, callback) {
                $scope.TABLES[table_id].loadFunction($scope.TABLES[table_id].customParams).then(function (data) {
                    if (data.data.length == 0) {return}
                    // $scope.TABLES[table_id].param_check_list = [];
                    $scope.checkSelectAllBtn(false, table_id);
                    $scope.showDeleteBtn(table_id, false);
                    var model = $scope.TABLES[table_id].model;
                    $scope[model] = data.data;
                    $scope.TABLES[table_id].param_total_result = data.headers()["x-total-count"];
                    if($scope.TABLES[table_id].param_total_result == 0){
                        if (!angular.element('#noResult'+$scope.TABLES[table_id].tableId).length) {

                            if($scope.TABLES[table_id]['DONT_SHOW_NO_DATA'])
                                return;

                            $scope.showNoResult = $translate.instant('global.messages.noResult');
                           // $("#" + $scope.TABLES[table_id].idTable).after($("<div id=\"noResult\"  class=\"uk-alert uk-text-center uk-alert-info\" style=\"background: white!important;color: black;\" data-uk-alert><span>" + $scope.showNoResult + "</span></div>"));
                            $( "#"+$scope.TABLES[table_id].tableId ).after( $( "<div id=\"noResult"+$scope.TABLES[table_id].tableId +"\" style=\"background: white!important;color: black;\" class=\"uk-alert uk-text-center uk-alert-info\" data-uk-alert><span>"+$scope.showNoResult +"</span></div>") );

                        }
                    }else{
                        if (angular.element('#noResult'+$scope.TABLES[table_id].tableId).length) {
                            $("#noResult"+$scope.TABLES[table_id].tableId).remove();
                        }
                    }
                    if (!$scope.TABLES[table_id].firstLoad) {
                        $scope.resetPageDisplay(table_id);
                        $scope.TABLES[table_id].selectize_pageNum = $scope.TABLES[table_id].param_page_size;
                        $scope.TABLES[table_id].firstLoad = true;
                    }
                    if (callback != null)
                        callback("OK");
                    $scope.setPageDisplay(table_id);

                    UIkit.tooltip('.tooltip').hide();
                })
            }

            $scope.handleSort = function ($event, table_id,key) {
                var icon = "";
                switch ($scope.TABLES[table_id].sort[key]) {
                    case $scope.sortIcons[0]:
                        // sort asc
                        $scope.TABLES[table_id].sort[key] = $scope.sortIcons[1];
                        $scope.TABLES[table_id].sortType = "asc";
                        icon = '>' + $scope.sortIcons[1] + '<';
                        break;
                    case $scope.sortIcons[1]:
                        // sort desc
                        $scope.TABLES[table_id].sort[key] = $scope.sortIcons[2];
                        $scope.TABLES[table_id].sortType = "desc";
                        icon = '>' + $scope.sortIcons[2] + '<';
                        break;
                    case $scope.sortIcons[2]:
                        // sort asc
                        $scope.TABLES[table_id].sort[key] = $scope.sortIcons[1];
                        $scope.TABLES[table_id].sortType = "asc";
                        icon = '>' + $scope.sortIcons[1] + '<';
                        break;
                }

                // sort 1 column only
                $("#" + table_id + " thead th").removeClass("tablesorter-headerAsc");
                $($event.target.closest("th")).addClass("tablesorter-headerAsc");

                for (var s in   $scope.TABLES[table_id].sort) {
                    if (s != key) {
                        $scope.TABLES[table_id].sort[s] = $scope.sortIcons[0];
                    }
                }

                $scope.TABLES[table_id].param_sort_field = key;
                allowReloadDropSelectPage = false;
                $scope.reloadPage(table_id,null,true);
            }

            // Now filter trigger after 500 ms after keypress
            // Make sure call only one time if user press too quickly
            var timeoutF;

            $scope.handleFilter = function (tableId) {
                console.log(tableId)
                if($scope.TABLES[tableId].preventSearch) {
                    clearTimeout(timeoutF);
                    timeoutF = setTimeout(function () {
                        allowReloadDropSelectPage = false;
                        //console.log($scope.TABLES[table_id]);
                        $scope.TABLES[tableId].param_current_page = 0;
                        $scope.reloadPage(tableId, function (ok) {
                            if (ok == "OK") {
                                $scope.resetPageDisplay(tableId);
                                $scope.TABLES[tableId].preventSearch = false;
                            }
                        },true);
                    }, 500);
                    return;
                }
                $scope.TABLES[tableId].preventSearch = true;
                timeoutF = setTimeout(function () {
                    allowReloadDropSelectPage = false;
                    //console.log($scope.TABLES[table_id]);
                    $scope.TABLES[tableId].param_current_page = 0;
                    $scope.reloadPage(tableId, function (ok) {
                        if (ok == "OK") {
                            $scope.resetPageDisplay(tableId);
                            $scope.TABLES[tableId].preventSearch = false;
                        }
                    },true);
                }, 500);
            }

            $scope.handleNextPage = function (table_id) {
                if ($scope.TABLES[table_id].param_current_page < $scope.TABLES[table_id].param_page_total - 1) {
                    $scope.TABLES[table_id].param_current_page++;
                    allowReloadDropSelectPage = false;
                    $scope.reloadPage(table_id,null,true);
                }
            }

            $scope.handlePreviousPage = function (table_id) {
                if ($scope.TABLES[table_id].param_current_page > 0) {
                    $scope.TABLES[table_id].param_current_page--;
                    allowReloadDropSelectPage = false;
                    $scope.reloadPage(table_id,null,true);
                }
            }

            $scope.handleFirstPage = function (table_id) {
                if($scope.TABLES[table_id].param_current_page == 0)
                    return;

                $scope.TABLES[table_id].param_current_page = 0;
                allowReloadDropSelectPage = false;
                $scope.reloadPage(table_id,null,true);
            }

            $scope.handleLastPage = function (table_id) {
                if($scope.TABLES[table_id].param_current_page == $scope.TABLES[table_id].param_page_total - 1)
                    return;

                $scope.TABLES[table_id].param_current_page = $scope.TABLES[table_id].param_page_total - 1;
                allowReloadDropSelectPage = false;
                $scope.reloadPage(table_id,null,true);
            }

            var allowReloadDropSelectPage = false;
            $scope.selectPageHandle = function (table_id) {
                if (allowReloadDropSelectPage) {
                    $scope.TABLES[table_id].param_current_page = $("#"+$scope.TABLES[table_id].page_id).val() - 1;
                    $scope.reloadPage(table_id,null,true);
                }
            }

            $scope.selectPageClickHandle = function () {
                allowReloadDropSelectPage = true;
            }

            $scope.selectPageNumHandle = function (table_id) {
                allowReloadDropSelectPage = false;
                $scope.TABLES[table_id].param_page_size = $("#"+$scope.TABLES[table_id].page_number_id).val();
                $scope.resetPageDisplay(table_id);
                $scope.reloadPage(table_id,null,true);
            }

            $scope.deleteRows = function (table_id) {
                $scope.TABLES[table_id].param_check_list.sort();
                UIkit.modal.confirm($translate.instant("global.actionConfirm.delete"), function () {
                    //$("#ts_pager_filter").trigger('update');
                    if ($scope.TABLES[table_id].deleteCallback != null) {
                        $scope.TABLES[table_id].deleteCallback(table_id);
                    }
                }, {
                    labels: {
                        'Ok': $translate.instant("global.button.delete"),
                        'Cancel': $translate.instant("global.button.cancel")
                    }
                });
            }

            $scope.selectAllRows = function (table_id) {
                // $scope.TABLES[table_id].param_check_list = [];
                var model = $scope.TABLES[table_id].model;
                for (var i = 0; i < $scope[model].length; i++) {
                    if(!$scope.TABLES[table_id].param_check_list.includes($scope[model][i].id)){
                        $scope.TABLES[table_id].param_check_list.push($scope[model][i].id);

                        if(angular.isDefined($scope.TABLES[table_id].param_check_data)) {
                            var exist = false;
                            for(var j = 0; j < $scope.TABLES[table_id].param_check_data.length; j++) {
                                if($scope.TABLES[table_id].param_check_data[j].id == $scope[model][i].id) {
                                    exist = true;
                                    break;
                                }
                            }
                            if(!exist) {
                                $scope.TABLES[table_id].param_check_data.push($scope[model][i]);
                            }
                        }

                    }
                }
                $scope.showDeleteBtn(table_id, true);
                if(angular.isDefined($scope.eventChange)) $scope.eventChange();
            }

            $scope.unSelectAllRows = function (table_id) {
                var model = $scope.TABLES[table_id].model;
                for (var i = 0; i < $scope[model].length; i++) {
                    var valueIndex = $scope.TABLES[table_id].param_check_list.indexOf($scope[model][i].id);
                    if (valueIndex > -1) {
                        $scope.TABLES[table_id].param_check_list.splice(valueIndex, 1);

                        if(angular.isDefined($scope.TABLES[table_id].param_check_data)) {
                            for(var j = $scope.TABLES[table_id].param_check_data.length - 1; j >= 0; j--) {
                                if($scope.TABLES[table_id].param_check_data[j].id == $scope[model][i].id) {
                                    $scope.TABLES[table_id].param_check_data.splice(j, 1);
                                }
                            }
                        }

                    }
                }
                $scope.showDeleteBtn(table_id, false);
                if(angular.isDefined($scope.eventChange)) $scope.eventChange();
                // $scope.TABLES[table_id].param_check_list = [];
            }

            $scope.selectOneRow = function (element, table_id) {
                var _id = element.closest('input').attr('id');
                _id = Number(_id);

                $scope.TABLES[table_id].param_check_list.push(_id);
                var model = $scope.TABLES[table_id].model;
                if(angular.isDefined($scope.TABLES[table_id].param_check_data)) {
                    for(var i = 0; i < $scope[model].length; i++) {
                        if($scope[model][i].id == _id) {
                            var exist = false;
                            for(var j = 0; j < $scope.TABLES[table_id].param_check_data.length; j++) {
                                if($scope.TABLES[table_id].param_check_data[j].id == $scope[model][i].id) {
                                    exist = true;
                                    break;
                                }
                            }
                            if(!exist) {
                                $scope.TABLES[table_id].param_check_data.push($scope[model][i]);
                            }
                        }
                    }
                }

                if (($scope.TABLES[table_id].param_check_list.length == $scope[model].length) ||
                    ($scope.TABLES[table_id].param_check_list.length % $scope[model].length == 0)) {
                    $scope.checkSelectAllBtn(true, table_id);
                }
                $scope.showDeleteBtn(table_id, true);
                if(angular.isDefined($scope.eventChange)) $scope.eventChange();
            }

            $scope.unSelectOneRow = function (element, table_id) {
                var _id = element.closest('input').attr('id');
                _id = Number(_id);

                var index = $scope.TABLES[table_id].param_check_list.indexOf(_id);
                // if(index == - 1) index = $scope.TABLES[table_id].param_check_list.indexOf(_id2);
                if (index > -1) {
                    $scope.TABLES[table_id].param_check_list.splice(index, 1);

                    if(angular.isDefined($scope.TABLES[table_id].param_check_data)) {
                        for(var i = $scope.TABLES[table_id].param_check_data.length - 1; i >= 0; i--) {
                            if($scope.TABLES[table_id].param_check_data[i].id == _id) {
                                $scope.TABLES[table_id].param_check_data.splice(i, 1);
                            }
                        }
                    }
                }

                if ($scope.TABLES[table_id].param_check_list.length == 0) {
                    $scope.showDeleteBtn(table_id, false);
                } else {
                    $scope.showDeleteBtn(table_id, true);
                }
                $scope.checkSelectAllBtn(false, table_id);
                if(angular.isDefined($scope.eventChange)) $scope.eventChange();
            }
        }

        function sortDefault(tableId) {
            if(angular.isDefined($scope.TABLES[tableId].defaultSort) && $scope.TABLES[tableId].defaultSort !=null) {
                $scope.TABLES[tableId].sort[$scope.TABLES[tableId].defaultSort] = $scope.sortIcons[2];
                $scope.TABLES[tableId].param_sort_field = $scope.TABLES[tableId].defaultSort;
            } else {
                $scope.TABLES[tableId].param_sort_field = 'created';
                $scope.TABLES[tableId].sortType = "desc";
            }
        }

        function sortDefaultByUpdated(table_id) {
            var pos = -1;
            for (var i = 0; i < $scope.TABLES[table_id].param_fields.length; i++) {
                if($scope.TABLES[table_id].param_fields[i] == "updated") {
                    pos = i;
                    break;
                }
            }
            if(pos > -1) {
                $scope.TABLES[table_id].sort[pos] = $scope.sortIcons[2];
                $scope.TABLES[table_id].sortType = "desc";
                $scope.TABLES[table_id].param_sort_field = $scope.TABLES[table_id].param_fields[pos];
            }
        }

        function reloadPage(table_id) {
            $scope.reloadPage(table_id);
        }

        function reloadPageAndPageable(table_id){
            $scope.reloadPageAndPageable(table_id);
        }

        function getCurrentPageSize(table_id) {
            return $scope.TABLES[table_id].param_page_size;
        }

        function getSelectedRowIDs(table_id) {
            return $scope.TABLES[table_id].param_check_list;
        }

        function goToFirstPage(table_id) {
            $scope.handleFirstPage(table_id)
        }

        function goToLastPage(table_id) {
            $scope.handleLastPage(table_id)
        }

        function handleSort($event, key, table_id) {
            $scope.handleSort($event, key, table_id);
        }

        function handleFilter(tableId){
            $scope.handleFilter(tableId);
        }

        // Handle Delete Rows
        function defaultDelete(tableId, deleteFunction, type) {
        	var erMsg = $translate.instant('global.error.deleteError');
        	var confirmMsg = $translate.instant('global.actionConfirm.delete');
        	var successMsg = $translate.instant('global.success.delete');
        	var erMsgShowTooltip = $translate.instant('global.error.erMsgShowTooltip');;
        	if(angular.isDefined(type) && type !== ""){
                switch (type) {
	                case "material":
	                    erMsg = $translate.instant('error.material.noPermissionOrRelateObject');
	                    break;
	                case "deviceType":
	                    erMsg = $translate.instant('error.deviceType.alreadyUsed');
	                    break;
	                case "transfer":
	                    erMsg = $translate.instant("error.transfer.transferCantDelete");
	                    break;
	                case "order":
	                    erMsg = $translate.instant("error.order.orderCantDelete");
	                    break;
                    case "data-package":
                        erMsg = $translate.instant('error.servicePackage.batchDeleteFail');
                        erMsgShowTooltip = $translate.instant('error.servicePackage.cannotDelete');
                        break;
                    default:
                        break;
                }
            }
        	UIkit.modal.confirm(confirmMsg, function () {
                var ids = getSelectedRowIDs(tableId);
                deleteFunction(ids)
                    .then(function(data){
                        if (data.length > 0) {
                            AlertService.error(erMsg);
                            $scope.TABLES[tableId].loading =  true;
                            reloadPage(tableId);

                            $timeout(function () {
                                var model = $scope.TABLES[tableId].model;
                                var map = {};
                                for(var i=0; i< $scope[model].length; i ++){
                                    map[$scope[model][i].id] = $scope[model][i];
                                }
                                for(var i=0; i< data.length; i++){
                                    if(angular.isDefined(map[data[i]])){
                                        map[data[i]].unRemove = erMsgShowTooltip;
                                    }
                                }
                            },500);

                        } else {
                            AlertService.success(successMsg);
                            reloadPage(tableId);
                        }
                    })
                    .catch(function(error) {
                        // parse ids fail
                        var idsFail = null;
                        try {
                            idsFail = JSON.parse(error.data.params);
                        } catch (e) {}
                        if(Array.isArray(idsFail)){
                            highlightRowError(tableId, idsFail);
                        }
                        ErrorHandle.handleError(error);
                    })
            }, {
                labels: {
                    'Ok': $translate.instant("global.button.delete"),
                    'Cancel': $translate.instant("global.button.cancel2")
                }
            });
        }

        function deleteWithMessages(tableId, deleteFunction, type) {
            UIkit.modal.confirm($translate.instant("global.actionConfirm.delete"), function () {
                var ids = getSelectedRowIDs(tableId);
                deleteFunction(ids).then(function(data){
                    if (data.length > 0) {
                        var model = $scope.TABLES[tableId].model;
                        var arr = $scope[model];

                        var arrError = [];
                        var arrErrorName = [];

                        arr.forEach(function (val) {
                            arrError[val.id] = val;
                        });

                        data.forEach(function (val) {
                            if(arrError[val]) arrErrorName.push(arrError[val].name);
                        });

                        var erMsg = type + ": " + arrErrorName.join(", ") + " " + $translate.instant('global.error.deleteErrorUsed');
                        AlertService.error(erMsg);
                        $scope.TABLES[tableId].loading =  true;
                        reloadPage(tableId);

                        $timeout(function () {
                            var map = {};
                            for(var i=0; i< $scope[model].length; i ++){
                                map[$scope[model][i].id] = $scope[model][i];
                            }
                            for(var i=0; i< data.length; i++){
                                if(angular.isDefined(map[data[i]])){
                                    map[data[i]].unRemove = "Không được xóa đối tượng của hệ thống hoặc đối tượng đã được sử dụng";
                                }
                            }
                        },500);

                    } else {
                        AlertService.success('global.success.delete');
                        reloadPage(tableId);
                    }
                })
                .catch(function(data){
                    ErrorHandle.handleError(data);
                })
            }, {
                labels: {
                    'Ok': $translate.instant("global.button.delete"),
                    'Cancel': $translate.instant("global.button.cancel")
                }
            });
        }

        function defaultActive(tableId, activeFunction){
            if ($scope.TABLES[tableId].param_check_list.length > 0){
                activeFunction($scope.TABLES[tableId].param_check_list).then(function () {
                    AlertService.success('global.success.active')
                    TableMultiple.reloadPage(tableId);
                }).catch(function(data){
                    ErrorHandle.handleError(data);
                })
            }
        }

        function defaultDeactive(tableId, deactiveFunction, type){
        	var erMsg = $translate.instant('global.error.deactivateError');
        	var confirmMsg = $translate.instant('global.actionConfirm.batchDeactivate');
        	var successMsg = $translate.instant('global.success.inactive');
        	var erMsgShowTooltip ="";
        	if(angular.isDefined(type) && type !== ""){
                switch (type) {
                    case "data-package":
                    	confirmMsg = $translate.instant('package.message.batchDeactivate');
                    	successMsg = $translate.instant('success.servicePackageMsg.batchDeactive');
                        erMsg = $translate.instant('error.servicePackage.batchDeactiveFail');
                        erMsgShowTooltip = $translate.instant('error.servicePackage.cannotDeactive');
                        break;
                    default:
                        break;
                }
            }
        	UIkit.modal.confirm(confirmMsg, function () {
                var ids = getSelectedRowIDs(tableId);
                deactiveFunction(ids)
                    .then(function(data){
                        if (data.length > 0) {
                            AlertService.error(erMsg);
                            $scope.TABLES[tableId].loading =  true;
                            reloadPage(tableId);

                            $timeout(function () {
                                var model = $scope.TABLES[tableId].model;
                                var map = {};
                                for(var i=0; i< $scope[model].length; i ++){
                                    map[$scope[model][i].id] = $scope[model][i];
                                }
                                for(var i=0; i< data.length; i++){
                                    if(angular.isDefined(map[data[i]])){
                                        map[data[i]].unRemove = erMsgShowTooltip;
                                    }
                                }
                            },500);

                        } else {
                            AlertService.success(successMsg);
                            reloadPage(tableId);
                        }
                    })
                    .catch(function(error) {
                        // parse ids fail
                        var idsFail = null;
                        try {
                            idsFail = JSON.parse(error.data.params);
                        } catch (e) {}
                        if(Array.isArray(idsFail)){
                            highlightRowError(tableId, idsFail);
                        }
                        ErrorHandle.handleError(error);
                    })
            }, {
                labels: {
                	'Cancel': $translate.instant("global.button.cancel"),
                    'Ok': $translate.instant("global.button.ok")
                }
            });
        }
        
        function checkIsValidForm($form){
            // check riêng từng input
            var checkValid = true;
            $form.find("input.md-input").each(function () {
                if(!$(this).parsley().isValid()){
                    checkValid = false;
                    return false;
                }
            });
            return checkValid;
        }
        
        function highlightRowError(tableId, errorIds) {
            $scope.TABLES[tableId].loading = true;
            var allParams = $scope.getCommonQuery(tableId,null);
            $scope.TABLES[tableId].loadFunction(allParams).then(function (data) {
                $scope.handleData(tableId, null, undefined, data);
                $scope.TABLES[tableId].loading = false;

                var models = $scope.TABLES[tableId].model;
                for (let model of $scope[models]) {
                    if (errorIds.includes(model.id)) {
                        model.unRemove = true;
                    }
                }
            }).catch(function () {
                $scope.TABLES[tableId].loading = false;
            });
        }
    }
})();
