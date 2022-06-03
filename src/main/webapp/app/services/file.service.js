(function() {
    'use strict';

    angular
        .module('erpApp')
        .factory('FileService', FileService);

    FileService.$inject = ['$http', 'HOST_GW'];

    function FileService ($http, HOST_GW) {
        return {
            uploadFile: uploadFile,
            downloadFile: downloadFile,
            deleteFileUpload: deleteFileUpload
        };

        function uploadFile(file, type) {
            var fd = new FormData();
            fd.append('file', file);
            fd.append('type', type);
            return $http.post(HOST_GW + '/api/files/upload/', fd, {
                transformRequest: angular.identity,
                headers: { 'Content-Type': undefined }
            }).then(function(response) {
                return response;
            });
        }

        function deleteFileUpload(fileName, type = 1) {
            return $http.delete(HOST_GW + '/api/files/delete-file-uploaded?fileName=' + fileName + "&type=" + type).then(function(response) {
                return response.data;
            });
        }

        function downloadFile(fileName) {
            return $http.get(HOST_GW + '/api/files/download?fileName=' + fileName).then(function(response) {
                return response.data;
            });
        }
    }
})();
