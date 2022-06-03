(function () {
    'use strict';
    angular
        .module('erpApp')
        .factory('PrintLogController', PrintLogController);

    PrintLogController.$inject = ['$http'];

    function PrintLogController($http) {
        var service = {
            writeLogPrinter: writeLogPrinter
        };

        return service;

        function writeLogPrinter(params) {
            /*var params = [
                {
                    id: 1,
                    url: "http://10.15.12.152:8080/#/trace/1136",
                    productName: "Dưa lưới",
                    organizationName: "Địa điểm sản xuất NN Hòa Lạc",
                    gln: "0100692594002",
                    lotNumber: "15750208190909764002",
                    ssccNumber: "",
                    qtyPerPack: "1 (kg)",
                    packedDate: "02/12/2019",
                    expiredDate: "29/12/2019"
                }
            ];*/

            $http.post('http://localhost:8123/api/printers', params).then(function(response) {
                return response.data;
            });
        }
    }
})();
