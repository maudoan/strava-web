(function() {
    'use strict';

    angular
        .module('erpApp')
        .factory('AesCrypt', AesCrypt);

    AesCrypt.$inject = ['$http','HOST_GW'];

    function AesCrypt ($http, HOST_GW) {
        var service = {
            encrypt: encrypt,
            decrypt: decrypt
        };
        var key = CryptoJS.enc.Latin1.parse('onehome-o6o12oii');
        var iv = CryptoJS.enc.Latin1.parse('onehome-4g0l0nhc');

        return service;

        function encrypt(str) {
            try {
                var encrypted = CryptoJS.AES.encrypt(str, key, {iv: iv, mode: CryptoJS.mode.CBC, padding: CryptoJS.pad.Pkcs7}).toString();
            } catch (e) {
                return str;
            }
            return encrypted == null || encrypted === "" ? str : encrypted;
        }

        function decrypt(str) {
            try {
                var decrypted = CryptoJS.AES.decrypt(str, key,{iv: iv,padding: CryptoJS.pad.Pkcs7}).toString(CryptoJS.enc.Utf8);
            } catch (e) {
                return str;
            }
            return decrypted == null || decrypted === "" ? str : decrypted;
        }
    }
})();
