(function () {
    'use strict';
    angular.module('erpApp')
        .controller('CameraController', CameraController);

    CameraController.$inject = ['$rootScope', '$scope', '$state', '$http', 'Area', '$timeout','Farm',
        'AlertService', '$translate', 'TableController', 'ComboBoxController', 'AlertModalService', 'Common', 'ErrorHandle', 'Device'];

    function CameraController($rootScope, $scope, $state, $http, Area, $timeout,Farm,
                              AlertService, $translate, TableController, ComboBoxController, AlertModalService, Common, ErrorHandle, Device) {
        var isLocal = false;
        var tenantId = window.localStorage.getItem("farmId");
        let query = "query=tenantId==" + tenantId + ";category==6;url!=null&page=0&size=10";
    
        Device.getPage(query).then(function (response) {
            var cameras = response.data;
            $scope.cameraLength = cameras.length;
            for(let [i, camera] of cameras.entries()) {
                $timeout(function () {
                    vxgplayer("vxg_media_player_" + i).onReadyStateChange(function () {
                        $("#camera_name_" + i).html(camera.name);
                        this.src(camera.url);
                    });
                });
            }

            var RTCPeerConnection = /*window.RTCPeerConnection ||*/ window.webkitRTCPeerConnection || window.mozRTCPeerConnection;

            if (RTCPeerConnection) (function () {
                var rtc = new RTCPeerConnection({iceServers:[]});
                if (1 || window.mozRTCPeerConnection) {      // FF [and now Chrome!] needs a channel/stream to proceed
                    rtc.createDataChannel('', {reliable:false});
                };

                rtc.onicecandidate = function (evt) {
                    // convert the candidate to SDP so we can run it through our general parser
                    // see https://twitter.com/lancestout/status/525796175425720320 for details
                    if (evt.candidate) grepSDP("a="+evt.candidate.candidate);
                };
                rtc.createOffer(function (offerDesc) {
                    grepSDP(offerDesc.sdp);
                    rtc.setLocalDescription(offerDesc);
                }, function (e) { console.warn("offer failed", e); });

                var addrs = Object.create(null);
                addrs["0.0.0.0"] = false;
                function getIpLocal(newAddr) {
                    if (newAddr in addrs) return;
                    else addrs[newAddr] = true;
                    var displayAddrs = Object.keys(addrs).filter(function (k) { return addrs[k]; });
                    console.log(displayAddrs);
                    if(displayAddrs!=null && (displayAddrs[0].indexOf('10.5.')!=-1 || displayAddrs[0].indexOf('10.2.')!=-1)){
                        isLocal = true; //createPlayer(true);
                    }else{
                        isLocal = false;//createPlayer(false);
                    }
                }

                function grepSDP(sdp) {
                    var hosts = [];
                    sdp.split('\r\n').forEach(function (line) { // c.f. http://tools.ietf.org/html/rfc4566#page-39
                        if (~line.indexOf("a=candidate")) {     // http://tools.ietf.org/html/rfc4566#section-5.13
                            var parts = line.split(' '),        // http://tools.ietf.org/html/rfc5245#section-15.1
                                addr = parts[4],
                                type = parts[7];
                            if (type === 'host') getIpLocal(addr);
                        } else if (~line.indexOf("c=")) {       // http://tools.ietf.org/html/rfc4566#section-5.7
                            var parts = line.split(' '),
                                addr = parts[2];
                            getIpLocal(addr);
                        }
                    });
                }
            })();
        });
    }
})();
