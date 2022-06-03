(function(){
    'use strict';
    angular.module('erpApp')
        .controller('DiagramController', DiagramController);

    DiagramController.$inject = ['$rootScope','$scope','$state', '$stateParams','$timeout', 'AlertService','$translate', '$http', 'ErrorHandle', '$window', 'Area', 'Season','HOST_DEVICE_SOCKET'];
    function DiagramController($rootScope,$scope, $state, $stateParams,$timeout, AlertService, $translate, $http, ErrorHandle, $window, Area, Season,HOST_DEVICE_SOCKET) {
        // get data area
        $scope.tenantId = $window.localStorage.getItem("farmId");
        $scope.data = [];
        $scope.seasons = [];
        $scope.loadSector = function(){
            Area.genSector($stateParams.areaId).then(function (response) {
                $scope.jsonDiagram  = response.data;
                $timeout(function () {
                    asyncCall();
                })
            })
        }
        $scope.loadSector();


        //==================SOCKET===========
        var stompClient = null;
        $scope.connection = function connect() {
            var socket = new SockJS(HOST_DEVICE_SOCKET);
            stompClient = Stomp.over(socket);
            stompClient.connect({}, function(frame) {
                console.log('Connected: ' + frame);
                stompClient.subscribe('/topic/device-telemetry', function(message) {
                    handlerMessage(message);
                });
            });
        }

        $scope.connection();

        function handlerMessage(message) {
            $scope.mapDevice = JSON.parse(message.body);
            for(var device in $scope.mapDevice){
                var value =  $scope.mapDevice[device];
                updateData(device,value);
            }
        }
        //===========================================


        $scope.areaTypes = [
            '',
            $translate.instant("inventory.area.typeArea.growingMedia"),
            $translate.instant("inventory.area.typeArea.hydroponic"),
            $translate.instant("inventory.area.typeArea.husbandry"),
            $translate.instant("inventory.area.typeArea.land"),
            $translate.instant("inventory.area.typeArea.other")
        ];

       // if(!$stateParams.type || !$scope.tenantId){
       //     $state.go('dashboard');
       // } else {
       //     // get diagram
       //     // Diagram.getPage("query=tenantId==" + $scope.tenantId + ";type==" + $stateParams.type).then(function (data) {
       //     //
       //     // });
       //     var areaIds = [44, 46];
       //      // get season by areaId - get only processing season
       // }

        async function asyncCall() {
            const result = await getSeason();
            $scope.seasons = result;
            genDiagram();
        }

        async function getSeason() {
           var listSeason = [];
            // for(var i = 0; i < areaIds.length; i++){
            //
            // }
            var query = "tenantId==" + $scope.tenantId + ";areaId==" + $stateParams.areaId+ ";state==1&size=1&page=0&sort=created,desc";
            var result = await Season.getPage("query=" + query);
            var season = result && result.data[0] ? result.data[0] : {};
            listSeason.push(season);

            return listSeason;
        }

        function updateData(deviceCode,value) {
            var model = $scope.myDiagram.model;
            $scope.myDiagram.startTransaction("clear device data");
            $scope.myDiagram.nodes.each(function(node) {
                if (node.data.key === deviceCode) {
                    handleAction(model,node,"setText",null,null,value,null)
                }
            });
            $scope.myDiagram.commitTransaction("clear device data");
        }
        function handleAction(model, node, actionName, actionData, key, value, valueObjs) {
            var result = false;
            if(model && node && actionName) {
                var propertyName = "";
                var forceSet = false; //actionData.forceSet;
                if(actionName == "setText") {
                    propertyName = "text";
                    forceSet = true;
                    if(value == "disconnected") {
                        value = "dis";
                    } else if(value) {
                        if(Number(value) == value)
                            value = Number(Number.parseFloat(value).toFixed(2));
                    }
                } else if(actionName == "setFontColor") {
                    propertyName ="font-color";
                } else if(actionName == "setBackgroundUrl") {
                    propertyName ="background-url";
                } else if(actionName == "setVisible") {
                    propertyName ="visible";
                } else if(actionName.indexOf() != -1) {
                    //TODO
                }

                if(propertyName) {
                    if(actionData) { //becareful empty obj
                        var tmpVal = actionData[value];
                        if(tmpVal == undefined) {
                            if(actionData.hasOwnProperty("defaultOpt"))
                                tmpVal = actionData[actionData.defaultOpt];
                        }

                        if(tmpVal != undefined) {
                            model.setDataProperty(node.data, propertyName, tmpVal);
                            result = true;
                        }
                    }
                    if(!actionData || (!result && forceSet)){
                        model.setDataProperty(node.data, propertyName, value);
                        result = true;
                    }
                }
            }
            return result;
        }


        function genDiagram(){
            var icons = {};

            var $ = go.GraphObject.make;
            $scope.myDiagram = $(go.Diagram, "myDiagramDiv", {
                maxSelectionCount: 1,
                "toolManager.hoverDelay": 10,
                initialContentAlignment: go.Spot.Center,
                initialAutoScale: go.Diagram.Uniform,
                "undoManager.isEnabled": true,
                allowMove: false,
                allowDelete: false,
            });

            $scope.myDiagram.nodeTemplate = $(go.Node, "Spot", {
                    locationObjectName: 'SHAPE',
                    locationSpot: go.Spot.Center,
                    toolTip: $(go.Adornment, "Auto",
                        $(go.Shape, { fill: "#EFEFCC" }),
                        $(go.TextBlock, { margin: 2, width: 140 },
                        new go.Binding("text", "", infoString).ofObject()))
                },
                new go.Binding("location", "pos", go.Point.parse).makeTwoWay(go.Point.stringify),
                $(go.Panel, "Spot",
                    $(go.Picture, {
                            name: "BACKGROUND",
                            width: null,
                            height: null,
                            margin: new go.Margin(0,0,0,0)
                        },
                        new go.Binding("source", "background-url"),
                        new go.Binding("height", "background-height"),
                        new go.Binding("width", "background-width"),
                        new go.Binding("margin", "background-margin", parseMargin)),
                    $(go.Shape, {
                            name: "SHAPE",
                            figure: "Circle",
                            fill: null,
                            stroke: null,
                            strokeWidth: 0,
                            width: 0,
                            height: 0
                        },
                        new go.Binding("figure", "shape"),
                        new go.Binding("fill", "shape-color"),
                        new go.Binding("width", "shape-width"),
                        new go.Binding("height", "shape-height")),
                    $(go.Shape, {
                            name: "ICON",
                            width: 0,
                            height: 0,
                            stroke: null,
                            strokeWidth: 0,
                            fill: null,
                            margin: new go.Margin(0,0,0,0)
                        },
                        new go.Binding("fill", "icon-color"),
                        new go.Binding("width", "icon-width"),
                        new go.Binding("height", "icon-height"),
                        new go.Binding("geometry", "icon", geoFunc)),
                    $(go.Panel, "Spot",
                        $(go.Picture,
                            {
                                name: "TEXT_BOUDING",
                            },
                            new go.Binding("margin", "text-margin", parseMargin)),
                        $(go.TextBlock, {
                                font: "14px Lato, sans-serif",
                                textAlign: "center",
                                maxSize: new go.Size(120, NaN),
                                alignment: go.Spot.BottomCenter,
                                alignmentFocus: go.Spot.BottomCenter
                            },
                            new go.Binding("font", "font"),
                            new go.Binding("stroke", "font-color"),
                            new go.Binding("maxSize", "text-maxWidth", parseMaxTextWidth),
                            new go.Binding("width", "text-width"),
                            new go.Binding("textAlign", "text-align"),
                            new go.Binding("text")
                        )
                    )
                )
            );

            $scope.myDiagram.groupTemplate =
                $(go.Group, "Auto", {
                        selectionObjectName: "PANEL",
                        ungroupable: true },
                    $(go.TextBlock, {
                            font: "bold 19px sans-serif",
                            isMultiline: false,
                            editable: false
                        },
                        new go.Binding("text", "text").makeTwoWay(),
                        new go.Binding("stroke", "color")),
                    $(go.Panel, "Auto",
                        { name: "PANEL" },
                        $(go.Shape, "Rectangle",
                            {
                                fill: "#fff", stroke: "gray", strokeWidth: 2,
                                portId: "", cursor: "pointer"
                            },
                            new go.Binding("strokeWidth"),
                            new go.Binding("fill"),
                            new go.Binding("stroke"),
                            new go.Binding("width"),
                            new go.Binding("height")
                        ),
                        $(go.Placeholder, { margin: 10, background: "transparent" },
                            new go.Binding("background", "background"),
                            new go.Binding("margin", "margin", parseMargin)
                        )
                    )
                );

            $scope.myDiagram.linkTemplate =
                $(go.Link, {
                        toShortLength: -2,
                        fromShortLength: -2,
                        layerName: "Background",
                        routing: go.Link.Orthogonal,
                        corner: 10,
                        reshapable: true,
                        resegmentable: true,
                        relinkableFrom: true,
                        relinkableTo: true
                    },
                    new go.Binding("layerName"),
                    new go.Binding("fromSpot", "fromSpot", function(d) { return spotConverter(d); }),
                    new go.Binding("toSpot", "toSpot", function(d) { return spotConverter(d); }),

                    new go.Binding("points").makeTwoWay(),
                    new go.Binding("layerName"),
                    $(go.Shape, "Circle", {isPanelMain: true, stroke: "#4f92df"/* blue*/, strokeWidth: 2 , fill: "#4f92df"},
                        new go.Binding("stroke", "color"),
                        new go.Binding("strokeWidth")
                    ),
                    $(go.Shape, { isPanelMain: true, strokeWidth: 0, fill: "#4f92df", stroke: "#4f92df"},
                        new go.Binding("isPanelMain"),
                        new go.Binding("toArrow"),
                        new go.Binding("stroke", "color"),
                        new go.Binding("strokeWidth"))
                );

            $scope.myDiagram.model = go.Model.fromJson($scope.jsonDiagram);

            function infoString(obj) {
                var part = obj.part;
                if (part instanceof go.Adornment) part = part.adornedPart;
                var msg = "";
                if (part instanceof go.Link) {
                    msg = "";
                } else if (part instanceof go.Node) {
                    msg = part.data.description;

                    if(msg != undefined && msg != "") {
                        obj.visible = true;
                    } else {
                        obj.visible = false;
                    }
                }
                return msg;
            }

            function geoFunc(geoname) {
                var geo = icons[geoname];
                if (typeof geo === "string") {
                    geo = icons[geoname] = go.Geometry.parse(geo, true);
                }
                return geo;
            }

            function parseMargin(value) {
                if(value + 0 == 0 + value) {
                    return value;
                }
                return go.Margin.parse(value);
            }

            function parseMaxTextWidth(value) {
                return new go.Size(value, NaN);
            }

            function parseString(value) {
                if(value.indexOf("id="))
                    return value.substr(3);
                return value;
            }

            function spotConverter(dir) {
                if (dir === "left") return go.Spot.LeftSide;
                if (dir === "right") return go.Spot.RightSide;
                if (dir === "top") return go.Spot.TopSide;
                if (dir === "bottom") return go.Spot.BottomSide;
                if (dir === "rightsingle") return go.Spot.Right;
            }

            function getValueByKey(valueObjs, key) {
                for(var idx = 0; idx < valueObjs.length; idx++) {
                    var obj = valueObjs[idx];
                    if(key == obj.param) {
                        return obj.value;
                    }
                }
                return undefined;
            }

            function handleAction(model, node, actionName, actionData, key, value, valueObjs) {
                var result = false;
                if(model && node && actionName) {
                    var propertyName = "";
                    var forceSet = false; //actionData.forceSet;
                    if(actionName == "setText") {
                        propertyName = "text";
                        forceSet = true;
                        if(value == "disconnected") {
                            value = "dis";
                        } else if(value) {
                            if(Number(value) == value)
                                value = Number(Number.parseFloat(value).toFixed(2));
                        }
                    } else if(actionName == "setFontColor") {
                        propertyName ="font-color";
                    } else if(actionName == "setBackgroundUrl") {
                        propertyName ="background-url";
                    } else if(actionName == "setVisible") {
                        propertyName ="visible";
                    } else if(actionName.indexOf() != -1) {
                        //TODO
                    }

                    if(propertyName) {
                        if(actionData) { //becareful empty obj
                            var tmpVal = actionData[value];
                            if(tmpVal == undefined) {
                                if(actionData.hasOwnProperty("defaultOpt"))
                                    tmpVal = actionData[actionData.defaultOpt];
                            }

                            if(tmpVal != undefined) {
                                model.setDataProperty(node.data, propertyName, tmpVal);
                                result = true;
                            }
                        }
                        if(!actionData || (!result && forceSet)){
                            model.setDataProperty(node.data, propertyName, value);
                            result = true;
                        }
                    }
                }
                return result;
            }

            var actionDatas = {};
            actionDatas.handleActionFn = handleAction; //default
            //TODO load handleActionFn from data
            //TODO load datas

            function triggerNodeAction(model, node, key, value, valueObjs) {
                if(model && node) {
                    var actions = node.data.action;
                    if(actions) {
                        var overrideAction = node.data.overrideAction;
                        var handleActionFn = actionDatas.handleActionFn;
                        //TODO load handleActionFn from overrideAction if exist

                        var idx, actionArrSize;
                        actionArrSize = actions.length;
                        for(idx = 0; idx < actionArrSize; idx++) {
                            var actionName = actions[idx];
                            var actionData = actionDatas[actionName];

                            if( overrideAction && overrideAction.hasOwnProperty(actionName))
                                actionData = overrideAction[actionName];
                            handleActionFn(model,node, actionName, actionData, key, value, valueObjs);
                        }
                    }
                }
            }

            var deviceCheckerObj = {};

            // function processMessage(msgObj) {
            //     if(msgObj && msgObj.hasOwnProperty("device_values")) {
            //         for(property in msgObj) {
            //             if(property == "state_hardware") {
            //                 var node = myDiagram.findNodeForKey(msgObj.device_id + "_" + property);
            //                 if(node)
            //                     triggerNodeAction(myDiagram.model, node, property, msgObj[property], msgObj.device_values);
            //             } else if(property == "device_values") {
            //                 for(var idx = 0; idx < msgObj.device_values.length; idx++) {
            //                     var obj = msgObj.device_values[idx];
            //                     var key = obj.param;
            //                     var node = myDiagram.findNodeForKey(msgObj.device_id + "_" + key);
            //                     if(node)
            //                         triggerNodeAction(myDiagram.model, node, key, obj.value, msgObj.device_values);
            //                 }
            //             } else if(property == "device_id" && msgObj[property]) {
            //                 deviceCheckerObj[msgObj[property]] = new Date().getTime();
            //             }
            //         }
            //     }
            // }

            function clearData(deviceId) {
                var model = myDiagram.model;
                myDiagram.startTransaction("clear device data");
                myDiagram.nodes.each(function(node) {
                    if (node.data.key.indexOf(deviceId) !== -1) {
                        triggerNodeAction(model, node, "", "", null);
                    }
                });
                myDiagram.commitTransaction("clear device data");
            }

            // function deviceChecker() {
            //     for(var key in deviceCheckerObj) {
            //         if(key) {
            //             var value = deviceCheckerObj[key];
            //             var now = new Date().getTime();
            //             if(value && now && ((now - value) > 900000)) { //15min
            //                 clearData(key);
            //             }
            //         }
            //     }
            //
            //     setTimeout(function() {
            //         deviceChecker();
            //     }, 10000);
            // }
            //deviceChecker();

            // update info
            var areaInfos = [];
            function updateAreaInfo() {
                for (var index in $scope.seasons) {
                    var season = $scope.seasons[index];
                    var now = (new Date()).getTime();
                    var elapsedTime = '';
                    var estimatedTimeLeft = '';

                    // so ngay da trong
                    if(season.expectedFinishDate && season.expectedBeginDate){
                        elapsedTime = Math.floor(Math.abs(now - season.expectedBeginDate) / 86400000);
                    }
                    // so ngay du kien thu hoach
                    if(season.expectedFinishDate){
                        estimatedTimeLeft = Math.floor(Math.abs(season.expectedFinishDate - now) / 86400000);
                    }

                    areaInfos.push({
                        areaId: season.areaId,
                        seasonId: season.id,
                        productName: season.productName,
                        elapsedTime: elapsedTime,
                        estimatedTimeLeft: estimatedTimeLeft
                    });
                }

                updateAreaInfoToScreen();

                setTimeout(function() {
                    updateAreaInfo();
                }, 3600000);//1h
            }
            updateAreaInfo();

            function updateAreaInfoToScreen() {
                var model = $scope.myDiagram.model;
                $scope.myDiagram.startTransaction("update area info");

                // dat ten theo areaId
                for (var index in areaInfos) {
                    var areaId = areaInfos[index].areaId;
                    var indexTemp = parseInt(index) + 2; // bien tam de render dc du lieu
                    var node = $scope.myDiagram.findNodeForKey("area_" + indexTemp + "_info_plant");
                    console.log("area_" + indexTemp + "_info_plant")
                    if(node != null){
                        triggerNodeAction(model, node, "", areaInfos[index].productName, null);
                    }

                    node = $scope.myDiagram.findNodeForKey("area_" + indexTemp + "_info_estimate_time_left");
                    if(node != null){
                        triggerNodeAction(model, node, "", areaInfos[index].estimatedTimeLeft, null);
                    }

                    node = $scope.myDiagram.findNodeForKey("area_" + indexTemp + "_info_elapsed_time");
                    if(node != null){
                        triggerNodeAction(model, node, "", areaInfos[index].elapsedTime, null);
                    }
                }
                $scope.myDiagram.commitTransaction("update area info");
            }

            // var d = new Date();
            // var deviceClientId = configvnpt.mqtt.clientId + d.getTime();
            // var clientDiagram = new VNPT.CLIENT(configvnpt.mqtt.host, configvnpt.mqtt.port, deviceClientId);
            // clientDiagram.onMessageArrived = function (message) {
            //     var string = message.payloadString;
            //     console.log("onMessageArrived:"+string);
            //     try {
            //         var messageObject = JSON.parse(string);
            //         if(messageObject==null || messageObject.hasOwnProperty("passcode")){
            //             return;
            //         }
            //
            //         myDiagram.startTransaction("update diagram");
            //         if(messageObject.hasOwnProperty("load") && messageObject.load =='all') {
            //             for( var idx = 0; idx < messageObject.tankList.length; idx++) {
            //                 processMessage(messageObject.tankList[idx]);
            //             }
            //         } else {
            //             processMessage(messageObject);
            //         }
            //         myDiagram.commitTransaction("update diagram");
            //     } catch(err) {
            //         console.log(err);
            //     }
            // };
            //
            // clientDiagram.connect({
            //     onFailure:function(){
            //     },
            //     onSuccess:function(){
            //         clientDiagram.subscribe(configvnpt.mqtt.subscribe + gatewayId);
            //     },
            //     useSSL: configvnpt.mqtt.useSSL
            // });
            //
            // clientDiagram.onConnectionLost = function () {
            //     clientDiagram.connect({
            //         onFailure:function(){
            //         },
            //         onSuccess:function(){
            //             clientDiagram.subscribe(configvnpt.mqtt.subscribe + gatewayId);
            //         },
            //         useSSL: configvnpt.mqtt.useSSL
            //     });
            // };

        }
    }

})();