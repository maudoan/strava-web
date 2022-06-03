(function () {
    'use strict';
    angular.module('erpApp')
        .config(stateConfig);
    stateConfig.$inject = ['$stateProvider']

    function stateConfig($stateProvider) {

        $stateProvider
            .state('device-module', {
                parent: 'restricted',
                template: "<div ui-view></div>",
                abstract: true,
                resolve: {
                    translatePartialLoader: ['$translate', '$translatePartialLoader', function ($translate, $translatePartialLoader) {
                        $translatePartialLoader.addPart('admin');
                        $translatePartialLoader.addPart('errors');
                        $translatePartialLoader.addPart('success');
                        $translatePartialLoader.addPart('global');
                        $translatePartialLoader.addPart('device');
                        return $translate.refresh();
                    }]
                }
            })
            //stock
            .state('devices',{
                parent: 'device-module',
                url: '/devices',
                templateUrl: 'app/home/device/device/devices.html',
                controller: 'DevicesController',
                controllerAs: 'vm',
                params: {
                    deviceId:null
                },
                data: {
                    pageTitle: 'admin.menu.device',
                    authorities: ['ROLE_SYSTEM_ADMIN','ROLE_SYSTEM_USER','ROLE_HOME_ADMIN', 'Device_View'], //TODO change role,
                    sideBarMenu: 'inventory'
                },
                resolve: {
                    deps: ['$ocLazyLoad', function($ocLazyLoad) {
                        return $ocLazyLoad.load([
                            'lazy_ionRangeSlider',
                            'lazy_tablesorter',
                            'lazy_KendoUI',
                            'lazy_parsleyjs',
                            'app/home/device/device/devices.controller.js'
                        ]);
                    }]
                }
            })
            .state('devices-detail',{
                parent:'device-module',
                url:'/devices/{deviceId:[0-9]{1,9}}/detail',
                templateUrl:'app/home/device/device/device.detail.html',
                data: {
                    pageTitle: 'admin.menu.device',
                    parentLink: 'devices',
                    authorities:['ROLE_SYSTEM_ADMIN','ROLE_SYSTEM_USER','ROLE_HOME_ADMIN', 'Device_View_Detail'],
                    sideBarMenu: 'inventory'
                },
                controller: 'DeviceDetailController',
                resolve: {
                    deps: ['$ocLazyLoad', function($ocLazyLoad) {
                        return $ocLazyLoad.load([
                            'lazy_parsleyjs',
                            'app/home/device/device/device.detail.controller.js'
                        ]);
                    }]
                }

            })
            .state('device-types',{
                parent: 'device-module',
                url: '/device-types',
                templateUrl: 'app/home/device/device-type/device-types.html',
                controller: 'DeviceTypesController',
                controllerAs: 'vm',
                params: {
                    deviceTypeId:null
                },
                data: {
                    pageTitle: 'admin.menu.deviceType',
                    authorities: ['ROLE_SYSTEM_ADMIN','ROLE_SYSTEM_USER','ROLE_HOME_ADMIN', 'Device_Type_View'], //TODO change role,
                    sideBarMenu: 'inventory'
                },
                resolve: {
                    deps: ['$ocLazyLoad', function($ocLazyLoad) {
                        return $ocLazyLoad.load([
                            'lazy_ionRangeSlider',
                            'lazy_tablesorter',
                            'lazy_KendoUI',
                            'lazy_parsleyjs',
                            'app/home/device/device-type/device-types.controller.js'
                        ]);
                    }]
                }
            })
            .state('device-types-detail',{
                parent:'device-module',
                url:'/device-types/{deviceTypeId:[0-9]{1,9}}/detail',
                templateUrl:'app/home/device/device-type/device-type.detail.html',
                data: {
                    pageTitle: 'admin.menu.deviceType',
                    parentLink: 'device-types',
                    authorities:['ROLE_SYSTEM_ADMIN','ROLE_SYSTEM_USER','ROLE_HOME_ADMIN', 'Device_Type_View_Detail'],
                    sideBarMenu: 'inventory'
                },
                controller: 'DeviceTypeDetailController',
                resolve: {
                    deps: ['$ocLazyLoad', function($ocLazyLoad) {
                        return $ocLazyLoad.load([
                            'lazy_parsleyjs',
                            'app/home/device/device-type/device-type.detail.controller.js'
                        ]);
                    }]
                }

            })
            .state('device-types-create',{
                parent:'device-module',
                url:'/device-types/create',
                templateUrl:'app/home/device/device-type/device-type.create.html',
                data: {
                    pageTitle: 'admin.menu.deviceType',
                    parentLink: 'device-types',
                    authorities:['ROLE_SYSTEM_ADMIN','ROLE_HOME_ADMIN', 'Device_Type_Create'],
                    sideBarMenu: 'inventory'
                },
                controller: 'DeviceTypeCreateController',
                resolve: {
                    deps: ['$ocLazyLoad', function($ocLazyLoad) {
                        return $ocLazyLoad.load([
                            'lazy_parsleyjs',
                            'app/home/device/device-type/device-type.create.controller.js'
                        ]);
                    }]
                }
            })
            .state('device-types-edit',{
                url:'/device-types/{deviceTypeId:[0-9]{1,9}}/edit',
                templateUrl:'app/home/device/device-type/device-type.edit.html',
                parent:'device-module',
                data: {
                    pageTitle: 'admin.menu.deviceType',
                    parentLink: 'device-types',
                    authorities:['ROLE_SYSTEM_ADMIN','ROLE_HOME_ADMIN', 'Device_Type_Update'],
                    sideBarMenu: 'inventory'
                },
                controller: 'DeviceTypeEditController',
                resolve: {
                    deps: ['$ocLazyLoad', function($ocLazyLoad) {
                        return $ocLazyLoad.load([
                            'lazy_parsleyjs',
                            'app/home/device/device-type/device-type.edit.controller.js'
                        ]);
                    }]
                }
            })
            .state('device-models',{
                parent: 'device-module',
                url: '/device-models',
                templateUrl: 'app/home/device/device-model/device-models.html',
                controller: 'DeviceModelsController',
                controllerAs: 'vm',
                params: {
                    deviceModelId: null
                },
                data: {
                    pageTitle: 'admin.menu.deviceModel',
                    authorities: ['ROLE_SYSTEM_ADMIN','ROLE_SYSTEM_USER','ROLE_HOME_ADMIN', 'Device_Model_View'], //TODO change role,
                    sideBarMenu: 'inventory'
                },
                resolve: {
                    deps: ['$ocLazyLoad', function($ocLazyLoad) {
                        return $ocLazyLoad.load([
                            'lazy_ionRangeSlider',
                            'lazy_tablesorter',
                            'lazy_KendoUI',
                            'lazy_parsleyjs',
                            'app/home/device/device-model/device-models.controller.js'
                        ]);
                    }]
                }
            })
            .state('device-models-create',{
                parent:'device-module',
                url:'/device-models/create',
                templateUrl:'app/home/device/device-model/device-model.create.html',
                data: {
                    pageTitle: 'admin.menu.deviceModel',
                    parentLink: 'device-models',
                    authorities:['ROLE_SYSTEM_ADMIN','ROLE_HOME_ADMIN', 'Device_Model_Create'],
                    sideBarMenu: 'inventory'
                },
                controller: 'DeviceModelCreateController',
                resolve: {
                    deps: ['$ocLazyLoad', function($ocLazyLoad) {
                        return $ocLazyLoad.load([
                            'lazy_parsleyjs',
                            'app/home/device/device-model/device-model.create.controller.js'
                        ]);
                    }]
                }
            })
            .state('device-models-edit',{
                url:'/device-models/{deviceModelId:[0-9]{1,9}}/edit',
                templateUrl:'app/home/device/device-model/device-model.edit.html',
                parent:'device-module',
                data: {
                    pageTitle: 'admin.menu.deviceModel',
                    parentLink: 'device-models',
                    authorities:['ROLE_SYSTEM_ADMIN','ROLE_HOME_ADMIN', 'Device_Model_Update'],
                    sideBarMenu: 'inventory'
                },
                controller: 'DeviceModelEditController',
                resolve: {
                    deps: ['$ocLazyLoad', function($ocLazyLoad) {
                        return $ocLazyLoad.load([
                            'lazy_parsleyjs',
                            'app/home/device/device-model/device-model.edit.controller.js'
                        ]);
                    }]
                }
            })
            .state('device-models-detail',{
                parent:'device-module',
                url:'/device-models/{deviceModelId:[0-9]{1,9}}/detail',
                templateUrl:'app/home/device/device-model/device-model.detail.html',
                data: {
                    pageTitle: 'admin.menu.deviceModel',
                    parentLink: 'device-models',
                    authorities:['ROLE_SYSTEM_ADMIN','ROLE_SYSTEM_USER','ROLE_HOME_ADMIN', 'Device_Model_View_Detail'],
                    sideBarMenu: 'inventory'
                },
                controller: 'DeviceModelDetailController',
                resolve: {
                    deps: ['$ocLazyLoad', function($ocLazyLoad) {
                        return $ocLazyLoad.load([
                            'lazy_parsleyjs',
                            'app/home/device/device-model/device-model.detail.controller.js'
                        ]);
                    }]
                }
            })
            .state('policy',{
                parent: 'device-module',
                url: '/policy',
                templateUrl: 'app/home/device/policy/policy.home.html',
                controller: 'PolicyController',
                controllerAs: 'vm',
                params: {
                },
                data: {
                    pageTitle: 'admin.menu.policy',
                    authorities: ['ROLE_SYSTEM_ADMIN','ROLE_SYSTEM_USER','ROLE_HOME_ADMIN', 'Policy_View'], //TODO change role,
                    sideBarMenu: 'inventory'
                },
                resolve: {
                    deps: ['$ocLazyLoad', function($ocLazyLoad) {
                        return $ocLazyLoad.load([
                            'lazy_ionRangeSlider',
                            'lazy_tablesorter',
                            'lazy_KendoUI',
                            'lazy_parsleyjs',
                            'app/home/device/policy/policy.home.controller.js'
                        ]);
                    }]
                }
            })
            .state('policy-create',{
                parent:'device-module',
                url:'/policy/create',
                templateUrl:'app/home/device/policy/policy.create.html',
                data: {
                    pageTitle: 'admin.menu.policy',
                    parentLink: 'policy',
                    authorities:['ROLE_SYSTEM_ADMIN','ROLE_HOME_ADMIN', 'Policy_Create'],
                    sideBarMenu: 'inventory'
                },
                controller: 'PolicyCreateController',
                resolve: {
                    deps: ['$ocLazyLoad', function($ocLazyLoad) {
                        return $ocLazyLoad.load([
                            'lazy_parsleyjs',
                            'app/home/device/policy/policy.create.controller.js'
                        ]);
                    }]
                }
            })
            .state('policy-edit',{
                url:'/policy/{id:[0-9]{1,9}}/edit',
                templateUrl:'app/home/device/policy/policy.edit.html',
                parent:'device-module',
                data: {
                    pageTitle: 'admin.menu.policy',
                    parentLink: 'policy',
                    authorities:['ROLE_SYSTEM_ADMIN','ROLE_HOME_ADMIN', 'Policy_Update'],
                    sideBarMenu: 'inventory'
                },
                controller: 'PolicyEditController',
                resolve: {
                    deps: ['$ocLazyLoad', function($ocLazyLoad) {
                        return $ocLazyLoad.load([
                            'lazy_parsleyjs',
                            'app/home/device/policy/policy.edit.controller.js'
                        ]);
                    }]
                }
            })
            .state('policy-detail',{
                parent:'device-module',
                url:'/policy/{id:[0-9]{1,9}}/detail',
                templateUrl:'app/home/device/policy/policy.detail.html',
                data: {
                    pageTitle: 'admin.menu.policy',
                    parentLink: 'policy',
                    authorities:['ROLE_SYSTEM_ADMIN','ROLE_SYSTEM_USER','ROLE_HOME_ADMIN', 'Policy_View_Detail'],
                    sideBarMenu: 'inventory'
                },
                controller: 'PolicyDetailController',
                resolve: {
                    deps: ['$ocLazyLoad', function($ocLazyLoad) {
                        return $ocLazyLoad.load([
                            'lazy_parsleyjs',
                            'app/home/device/policy/policy.detail.controller.js'
                        ]);
                    }]
                }
            })
            .state('policy-history',{
                parent:'device-module',
                url:'/policy/{id:[0-9]{1,9}}/history',
                templateUrl:'app/home/device/policy/policy.history.html',
                data: {
                    pageTitle: 'admin.menu.policy',
                    parentLink: 'policy',
                    authorities:['ROLE_SYSTEM_ADMIN','ROLE_SYSTEM_USER','ROLE_HOME_ADMIN', 'Policy_History'],
                    sideBarMenu: 'inventory'
                },
                controller: 'PolicyHistoryController',
                resolve: {
                    deps: ['$ocLazyLoad', function($ocLazyLoad) {
                        return $ocLazyLoad.load([
                        	'lazy_ionRangeSlider',
                            'lazy_tablesorter',
                            'lazy_KendoUI',
                            'lazy_parsleyjs',
                            'app/home/device/policy/policy.history.controller.js'
                        ]);
                    }]
                }
            })
            .state('firmwares',{
                parent: 'device-module',
                url: '/firmwares',
                templateUrl: 'app/home/device/firmware/firmwares.html',
                controller: 'FirmwaresController',
                controllerAs: 'vm',
                params: {
                },
                data: {
                    pageTitle: 'admin.menu.firmware',
                    authorities: ['ROLE_SYSTEM_ADMIN','ROLE_SYSTEM_USER','ROLE_HOME_ADMIN', 'Firmware_View'], //TODO change role,
                    sideBarMenu: 'inventory'
                },
                resolve: {
                    deps: ['$ocLazyLoad', function($ocLazyLoad) {
                        return $ocLazyLoad.load([
                        	'lazy_ionRangeSlider',
                            'lazy_tablesorter',
                            'lazy_KendoUI',
                            'lazy_parsleyjs',
                            'app/home/device/firmware/firmwares.controller.js'
                        ]);
                    }]
                }
            }).state('firmwares-create',{
                parent:'device-module',
                url:'/firmwares/create',
                templateUrl:'app/home/device/firmware/firmware.create.html',
                data: {
                    pageTitle: 'admin.menu.firmware',
                    parentLink: 'firmwares',
                    authorities:['ROLE_SYSTEM_ADMIN','ROLE_HOME_ADMIN', 'Firmware_Create'],
                    sideBarMenu: 'inventory'
                },
                controller: 'FirmwareCreateController',
                resolve: {
                    deps: ['$ocLazyLoad', function($ocLazyLoad) {
                        return $ocLazyLoad.load([
                            'lazy_parsleyjs',
                            'app/home/device/firmware/firmware.create.controller.js'
                        ]);
                    }]
                }
            })
            .state('firmwares-edit',{
                url:'/firms/{firmwareId:[0-9]{1,9}}/edit',
                templateUrl:'app/home/device/firmware/firmware.edit.html',
                parent:'device-module',
                data: {
                    pageTitle: 'admin.menu.firmware',
                    parentLink: 'firmwares',
                    authorities:['ROLE_SYSTEM_ADMIN','ROLE_HOME_ADMIN', 'Firmware_Update'],
                    sideBarMenu: 'inventory'
                },
                controller: 'FirmwareEditController',
                resolve: {
                    deps: ['$ocLazyLoad', function($ocLazyLoad) {
                        return $ocLazyLoad.load([
                            'lazy_parsleyjs',
                            'app/home/device/firmware/firmware.edit.controller.js'
                        ]);
                    }]
                }
            })
            .state('firmwares-detail',{
                parent:'device-module',
                url:'/firmwares/{firmwareId:[0-9]{1,9}}/detail',
                templateUrl:'app/home/device/firmware/firmware.detail.html',
                data: {
                    pageTitle: 'admin.menu.firmware',
                    parentLink: 'firmwares',
                    authorities:['ROLE_SYSTEM_ADMIN','ROLE_SYSTEM_USER','ROLE_HOME_ADMIN', 'Firmware_View_Detail'],
                    sideBarMenu: 'inventory'
                },
                controller: 'FirmwareDetailController',
                resolve: {
                    deps: ['$ocLazyLoad', function($ocLazyLoad) {
                        return $ocLazyLoad.load([
                            'lazy_parsleyjs',
                            'app/home/device/firmware/firmware.detail.controller.js'
                        ]);
                    }]
                }
            })
            .state('device-imports',{
                parent: 'device-module',
                url: '/device-imports',
                templateUrl: 'app/home/device/device-import/device-import.html',
                controller: 'DeviceImportController',
                controllerAs: 'vm',
                params: {},
                data: {
                    pageTitle: 'admin.menu.deviceImport',
                    authorities: ['ROLE_SYSTEM_ADMIN','ROLE_SYSTEM_USER','ROLE_HOME_ADMIN', 'Device_Import', 'Device_Import_View'], //TODO change role,
                    sideBarMenu: 'inventory'
                },
                resolve: {
                    deps: ['$ocLazyLoad', function($ocLazyLoad) {
                        return $ocLazyLoad.load([
                            'lazy_ionRangeSlider',
                            'lazy_tablesorter',
                            'lazy_KendoUI',
                            'lazy_parsleyjs',
                            'app/home/device/device-import/device-import.controller.js'
                        ]);
                    }]
                }
            })
    }
})();