(function() {
    'use strict';

    angular
        .module('erpApp')
        .factory('Organization', Organization);

    Organization.$inject = ['$http','HOST_GW'];

    function Organization ($http,HOST_GW) {
        var service = {
            current : current,
            getAll: getAll,
            create: create,
            getPage: getPage,
            getPageSimple: getPageSimple,
            getOrganizationById: getOrganizationById,
            getList: getList,
            update: update,
            deleteOne: deleteOne,
            deleteMany: deleteMany,
            activate:activate,
            deactivate:deactivate,
            uploadAvatar:uploadAvatar,
            deleteFileUpload: deleteFileUpload,
            deleteAvatar:deleteAvatar,
            checkDuplicateCode: checkDuplicateCode,
            getAllByCond: getAllByCond,
            generateGln: generateGln,
            getOne: getOne,
            getChild: getChild,
            searchForTransfer: searchForTransfer,
            getHighestParent: getHighestParent,
            getNearestParent: getNearestParent,
            searchForOrder: searchForOrder,
            approve:approve,
            getManyChildren: getManyChildren,
            searchAll: searchAll,
            getByPhysicalLocation: getByPhysicalLocation,
            convertDate: convertDate
        };

        return service;

        function current() {
            return $http.get(HOST_GW + '/api/organizations/current').then(function(response) {
                return response.data;
            });
        }

        function getAll() {
            return $http.get(HOST_GW + '/api/organizations').then(function(response) {
                return response.data;
            });
        }

        function create(organization) {
            return $http.post(HOST_GW + '/api/organizations/register', organization).then(function(response) {
                return response.data;
            });
        }

        function getPage(params) {
            return $http.get(HOST_GW + '/api/organizations/search?' + params).then(function (response) {
                return response;
            });
        }

        function getPageSimple(params) {
            return $http.get(HOST_GW + '/api/organizations/search-simple?' + params).then(function (response) {
                return response;
            });
        }

        function getAllByCond(params) {
            return $http.get(HOST_GW + '/api/organizations/search?' + params).then(function (response) {
                return response;
            });
        }

        function getOrganizationById(id) {
            return $http.get(HOST_GW + '/api/organizations/' + id).then(function(response) {
                return response.data;
            });
        }

        function update(organization) {
            return $http.put(HOST_GW + '/api/organizations/' + organization.id, organization).then(function(response) {
                return response.data;
            });
        }

        function deleteOne(id) {
            return $http.delete(HOST_GW + '/api/organizations/' + id).then(function(response) {
                return response.data;
            });
        }

        function deleteMany(ids) {
            return $http.post(HOST_GW + '/api/organizations/batch-delete', ids).then(function(response) {
                return response.data;
            });
        }

        function activate(id) {
            return $http.get(HOST_GW + '/api/organizations/activate?id=' + id).then(function(response) {
                return response.data;
            });
        }

        function deactivate(id) {
            return $http.get(HOST_GW + '/api/organizations/deactivate?id=' +id).then(function(response) {
                return response.data;
            });
        }

        function uploadAvatar(file, model) {
            var fd = new FormData();
            fd.append('file', file);
            fd.append('model', model);
            return $http.post(HOST_GW + '/api/upload/', fd,{
                transformRequest: angular.identity,
                headers: {'Content-Type': undefined}
            }).then(function(response) {
                return response;
            });
        }

        function deleteAvatar(userId) {
            return $http.post(HOST_GW + '/api/organizations/'+ userId +'/deleteAvatar').then(function(response) {
                return response.data;
            });
        }

        function deleteFileUpload(fileName) {
            return $http.delete(HOST_GW + '/api/deleteFileUploaded?fileName=' + fileName).then(function(response) {
                return response.data;
            });
        }

        function checkDuplicateCode(code) {
            return $http.get(HOST_GW + '/api/organizations/code?code=' + code).then(function(response) {
                return response.data;
            });
        }

        function generateGln(organization) {
            return $http.post(HOST_GW + '/api/organizations/generateGln', organization).then(function (response) {
                return response.data;
            });
        }

        function getList(params){
            return $http.get(HOST_GW + '/api/organizations/search?' + params).then(function (response) {
                return response;
            });
        }

        function getOne(id){
            return $http.get(HOST_GW + '/api/organizations/' + id).then(function(response) {
                return response.data;
            });
        }

        function getChild(id, isSystemId){
            return $http.get(HOST_GW + '/api/organizations/get-child?id=' + id).then(function(response) {
                if(response.data.length > 0){
                    // lấy id = 1
                    var organizationIds = !isSystemId ? "(" : "(1,";
                    for(var i=0; i < response.data.length; i ++){
                        organizationIds +=response.data[i];
                        if(i< response.data.length - 1){
                            organizationIds +=",";
                        }
                    }
                    organizationIds +=")";
                    return organizationIds;
                }
                return null;
            });
        }

        function searchForTransfer(params) {
            return $http.get(HOST_GW + '/api/organizations/search-for-transfer?' + params).then(function (response) {
                return response.data;
            });
        }

        function getHighestParent(id){
            return $http.get(HOST_GW + '/api/organizations/highest-parent/' + id).then(function(response) {
                return response.data;
            });
        }

        function getNearestParent(id){
            return $http.get(HOST_GW + '/api/organizations/nearest-parent/' + id).then(function(response) {
                return response.data;
            });
        }

        function searchForOrder(params) {
            return $http.get(HOST_GW + '/api/organizations/search-for-order?' + params).then(function (response) {
                return response.data;
            });
        }

        function approve(id,nodeId) {
            var api = HOST_GW + '/api/organizations/approve?id=' + id;
            if(nodeId){
                api +='&nodeId=' + nodeId;
            }
            return $http.get(api).then(function (response) {
                return response.data;
            });
        }

        function getManyChildren(ids){
            return $http.get(HOST_GW + '/api/organizations/get-children?ids=' + ids).then(function(response) {
                if(response.data.length > 0){
                    // lấy id = 1
                    var organizationIds = "(1,";
                    for(var i=0; i < response.data.length; i ++){
                        organizationIds +=response.data[i];
                        if(i< response.data.length - 1){
                            organizationIds +=",";
                        }
                    }
                    organizationIds +=")";
                    return organizationIds;
                }
                return null;
            });
        }

        function searchAll(params) {
            return $http.get(HOST_GW + '/api/organizations/getAll/search?' + params).then(function(response) {
                return response.data;
            });
        }

        function getByPhysicalLocation(parentId, physicalLocation) {
            return $http.get(HOST_GW + '/api/organizations/get-by-physicalLocation?id=' + parentId + '&physicalLocation=' + physicalLocation).then(function(response) {
                return response.data;
            });
        }

        // 18/12/2019 to timestamp
        function convertDate(day){
            var dateParts = day.split("/");
            if(dateParts.length < 2) dateParts = day.split("-");
            var dateObject = new Date(+dateParts[2], dateParts[1] - 1, +dateParts[0]);

            return dateObject;
        }
    }
})();
