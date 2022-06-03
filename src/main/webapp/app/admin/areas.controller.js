(function () {
    'use strict';
    angular.module('erpApp').controller('AreaController', AreaController);

    AreaController.$inject = ['$rootScope', '$scope', '$state', '$http','$timeout',
        'AlertService', '$translate', 'TableController', 'ComboBoxController', 'AlertModalService',
        'Area', 'ErrorHandle', 'Principal'];

    function AreaController($rootScope, $scope, $state, $http,$timeout, AlertService, $translate, TableController, ComboBoxController,
                            AlertModalService, Area, ErrorHandle, Principal) {
        $scope.userAreaIds = $rootScope.currentUser.areaIds;

        $scope.blockUI = function () {
            if ($scope.blockModal != null)
                $scope.blockModal.hide();
            $scope.blockModal = null;
            $scope.blockModal = UIkit.modal.blockUI('<div class=\'uk-text-center\'>Đang xử lý ...<br/><img class=\'uk-margin-top\' src=\'assets/img/spinners/spinner_success.gif\' alt=\'\'>');
        };

        var isAdmin = false, isAreaViewDetail = false, isAreaCreate = false, isAreaUpdate = false, isAreaDelete = false;
        if(Principal.hasAnyAuthority(["ROLE_SYSTEM_ADMIN"])) {
            isAdmin = true;
        }
        if(isAdmin || Principal.hasAnyAuthority(["Area_View_Detail"])) {
            isAreaViewDetail = true;
        }
        if(isAdmin || Principal.hasAnyAuthority(["Area_Create"])) {
            isAreaCreate = true;
        }
        if(isAdmin || Principal.hasAnyAuthority(["Area_Update"])) {
            isAreaUpdate = true;
        }
        if(isAdmin || Principal.hasAnyAuthority(["Area_Delete"])) {
            isAreaDelete = true;
        }

        $scope.ComboBox = {};

        $scope.searchInfo = {
            "name": null,
            "description": null
        }

        $scope.idsForDelete = [];

        $scope.processGetTree = function () {
            Area.getTree($scope.searchInfo).then(function (res) {
                if ($scope.blockModal != null) $scope.blockModal.hide();
                reloadTree(res.data);
            }).catch(function (data) {
                if ($scope.blockModal != null) $scope.blockModal.hide();
                ErrorHandle.handleError(data);
            });
        };
        $scope.processGetTree();

        // ==================== TREE ====================
        var dataRoot = [
            {
                title: "Tất cả",
                key: 0,
                folder: true,
                expanded: true,
                description: "All area",
                areaCode: "ALL",
                children: []
            }
        ];

        function reloadTree(data) {
            if (!angular.isDefined(data) || data == null || data.length === 0 || data === '') {
                $scope.empty = true;
            } else {
                $scope.empty = false;
            }
            if(data.length == 0) {
                $scope.isEmptyData = true;
                dataRoot[0].children = [];
            } else {
                $scope.isEmptyData = false;
                dataRoot[0] = data[0];
            }
            data = dataRoot;

            var $tree = $("#tree");
            $tree.fancytree({
                extensions: ["table", "childcounter"],
                source: data,
                checkbox: true,
                icons: false,
                selectMode: 2,
                table: {
                    indentation: 20,      // indent 20px per node level
                    nodeColumnIdx: 0,     // render the node title into the 2nd column
                },
                loadChildren: function(event, data) {
                    data.node.updateCounters();
                },
                select: function(e, data) {
                    let tree = $tree.fancytree("getTree");
                    let rootNode = tree.getNodeByKey("1");
                    let currentNode = data.node;

                    currentNode.visitParents(function (parent) {
                        if(!currentNode.selected) {
                            parent.selected = false;
                            parent.render();
                        }
                    });
                    currentNode.visit(function (children) {
                        children.selected = currentNode.selected ? true : false;
                        children.render();
                    });
                    // Get a list of all selected nodes, and convert to a key array:
                    $scope.idsForDelete = $.map(data.tree.getSelectedNodes(), function(node){
                        return node.key;
                    });

                    let isAreaAll = $scope.userAreaIds.includes(1);
                    // update checkbox of root node
                    if(!isAreaAll) {
                        if($scope.idsForDelete.length == 1 && $scope.idsForDelete.includes("1") || !rootNode.selected) {
                            rootNode.partsel = false;
                            rootNode.selected = false;
                            rootNode.render();
                        } else if ($scope.idsForDelete.length <= rootNode.countChildren()) {
                            rootNode.partsel = true;
                            rootNode.selected = false;
                            rootNode.render();
                        }
                    }
                },
                renderColumns: function (event, data) {
                    var node = data.node, $tdList = $(node.tr).find(">td");
                    let isCurrentArea = $scope.userAreaIds.includes(parseInt(node.key));
                    let isAreaAll = $scope.userAreaIds.includes(1);
                    let areaName = (isAdmin || isAreaAll || isAreaViewDetail && isCurrentArea) ? "<a href='#/areas/" +node.key+ "/detail'>" + node.title + "</a>" : node.title;

                    if(!isAdmin && !isAreaAll && !isCurrentArea) {
                        node.unselectable = true;
                        node.render();
                    }

                    $tdList.find(".fancytree-title").html(areaName).attr("title", node.data.name);
                    $tdList.eq(1).text(node.data.areaCode == null ? "" : node.data.areaCode);
                    $tdList.eq(2).text(node.data.description == null ? "" : node.data.description);

                    let createBtn = isAreaCreate ? "<a class='add'><i id='" + node.key + "' class='uk-icon-plus-circle' title='Thêm'> </i></a> &nbsp; " : "";
                    let editBtn = isAreaUpdate ? "<a class='edit'><i id='" + node.key + "' class='uk-icon-small uk-icon-edit' title='Sửa' style='font-size: 17px'> </i></a>&nbsp; " : "";
                    let deleteBtn = isAreaDelete ? (node.key != 1 ? "<a class='delete'><i id='" + node.key + "' class='material-icons' title='Xóa'>delete</a>" : "") : "";

                    if(isAdmin || isAreaAll || isCurrentArea) {
                        $tdList.eq(3).html(createBtn + editBtn + deleteBtn);
                    }
                    $tdList.parent().attr("value", node.key);
                }
            });
        }

        $(document).on("click", "tr td .add", function (e) {
            $state.go('areas-create', {'areaParentId': e.target.id});
        });

        $(document).on("click", "tr td .edit", function (e) {
            $state.go('areas-edit', {areaId: e.target.id});
        });

        $(document).on("click", "tr td .delete", function (e) {
            $scope.deleteArea([e.target.id]);
            e.stopImmediatePropagation();
        });

        $scope.defaultDelete = function() {
            $scope.deleteArea($scope.idsForDelete);
        }

        $scope.deleteArea = function(ids) {
            UIkit.modal.confirm("Bạn có chắc chắn muốn xóa?", function () {
                $scope.blockUI();
                Area.deleteRecord(ids).then(function () {
                    if ($scope.blockModal != null) $scope.blockModal.hide();
                    $state.reload();
                    AlertService.success("success.msg.delete");
                }).catch(function (error) {
                    if ($scope.blockModal != null) $scope.blockModal.hide();
                    ErrorHandle.handleOneError(error);
                    let idsFail = JSON.parse(error.data.entityName);
                    for (let id of idsFail) {
                        $('#tree tr[value=' + id + ']').addClass("custom-un-remove");
                    }
                });
            }, {
                labels: {
                    'Ok': $translate.instant("global.button.ok"),
                    'Cancel': $translate.instant("global.button.cancel")
                }
            });
        }

        $scope.importExcel = function() {
            var file = $("#form-file")[0].files[0];
            if(!file) {
               AlertService.error("error.messages.chooseFile");
               return;
            }

            var fileName = file.name;
            // check file excel
            if(fileName.substr(-5, 5) !== '.xlsx' && fileName.substr(-4, 4) !== '.xls') {
               AlertService.error("admin.messages.errorTypeUpload");
               return;
            }

            // file lớn hơn 20MB
            if(file.size > 20 * 1024 * 1024) {
               AlertService.error('error.messages.errorMaximum');
               return;
            }

            $scope.blockUI();
            Area.importExcel(file).then(function(res){
                $scope.blockModal.hide();
                UIkit.modal("#modal_overflow", {}).hide();
                if(res.data != null && res.data.length > 0) {
                    $scope.userAreaIds = $scope.userAreaIds.concat(res.data);
                    AlertService.success("success.msg.upload");
                    $timeout(function () {
                        $scope.processGetTree();
                    }, 200);
                }
                else{
                    AlertService.error("error.messages.uploadFail");
                }
            }).catch(function (data) {
                $scope.blockModal.hide();
                ErrorHandle.handleError(data);
                $("#form-file").val('');
            });
        }

        $(document).keypress(
            function (event) {
                if (event.which == '13') {
                    event.preventDefault();
                    $timeout(function () {
                        angular.element("#searchBtn").trigger("click");
                    });
                }
            }
        );
    }
})();
