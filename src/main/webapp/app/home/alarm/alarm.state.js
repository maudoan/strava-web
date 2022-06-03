(function () {
    'use strict';
    angular.module('erpApp')
            .config(stateConfig);
    stateConfig.$inject = ['$stateProvider']

    function stateConfig($stateProvider) {

        $stateProvider
                .state('alarm-config', {
                    parent: 'admin',
                    url: '/alarm-config',
                    templateUrl: 'app/home/alarm/config/config.html',
                    controller: 'AlarmConfigController',
                    controllerAs: 'vm',
                    data: {
                        pageTitle: 'admin.menu.alarm.config',
                        authorities: ['ROLE_SYSTEM_ADMIN', 'ROLE_SYSTEM_USER', 'ROLE_FARM_ADMIN', 'Alarm_Controller_View'], //TODO change role,
                        sideBarMenu: 'inventory'
                    },
                    resolve: {
                        deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                                return $ocLazyLoad.load([
                                    'lazy_ionRangeSlider',
                                    'lazy_tablesorter',
                                    'lazy_KendoUI',
                                    'app/home/alarm/config/config.controller.js'
                                ]);
                            }],
                        translatePartialLoader: ['$translate', '$translatePartialLoader', function ($translate, $translatePartialLoader) {
                                $translatePartialLoader.addPart('global');
                                $translatePartialLoader.addPart('alarm');
                                $translatePartialLoader.addPart('admin');
                                $translatePartialLoader.addPart('errors');
                                $translatePartialLoader.addPart('success');
                                return $translate.refresh();
                            }]
                    }
                })

                .state('alarm-config-create', {
                    parent: 'admin',
                    url: '/alarm-config-create',
                    templateUrl: 'app/home/alarm/config/config.create.html',
                    controller: 'AlarmConfigCreateController',
                    controllerAs: 'vm',
                    data: {
                        pageTitle: 'admin.menu.alarm.config',
                        parentLink: 'alarm-config',
                        authorities: ['ROLE_SYSTEM_ADMIN', 'ROLE_FARM_ADMIN', 'Alarm_Controller_Create'], //TODO change role,
                        sideBarMenu: 'inventory'
                    },
                    resolve: {
                        deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                                return $ocLazyLoad.load([
                                    'lazy_ionRangeSlider',
                                    'lazy_tablesorter',
                                    'lazy_KendoUI',
                                    'lazy_parsleyjs',
                                    'app/home/alarm/config/config.create.controller.js'
                                ]);
                            }],
                        translatePartialLoader: ['$translate', '$translatePartialLoader', function ($translate, $translatePartialLoader) {
                                $translatePartialLoader.addPart('global');
                                $translatePartialLoader.addPart('alarm');
                                $translatePartialLoader.addPart('admin');
                                $translatePartialLoader.addPart('errors');
                                $translatePartialLoader.addPart('success');
                                return $translate.refresh();
                            }]
                    }
                }).
                state('alarm-config-edit', {
                    parent: 'admin',
                    url: '/config/{configId}/edit',
                    templateUrl: 'app/home/alarm/config/config.edit.html',
                    controller: 'AlarmConfigEditController',
                    controllerAs: 'vm',
                    data: {
                        pageTitle: 'admin.menu.alarm.config',
                        parentLink: 'alarm-config',
                        authorities: ['ROLE_SYSTEM_ADMIN', 'ROLE_FARM_ADMIN', 'Alarm_Controller_Update'], //TODO change role,
                        sideBarMenu: 'inventory'
                    },
                    resolve: {
                        deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                                return $ocLazyLoad.load([
                                    'lazy_ionRangeSlider',
                                    'lazy_tablesorter',
                                    'lazy_KendoUI',
                                    'lazy_parsleyjs',
                                    'app/home/alarm/config/config.edit.controller.js'
                                ]);
                            }],
                        translatePartialLoader: ['$translate', '$translatePartialLoader', function ($translate, $translatePartialLoader) {
                                $translatePartialLoader.addPart('global');
                                $translatePartialLoader.addPart('alarm');
                                $translatePartialLoader.addPart('admin');
                                $translatePartialLoader.addPart('errors');
                                $translatePartialLoader.addPart('success');
                                return $translate.refresh();
                            }]
                    }
                }).
                        
                state('alarm-config-detail', {
                    parent: 'admin',
                    url: '/config/{configId}/detail',
                    templateUrl: 'app/home/alarm/config/config.detail.html',
                    controller: 'AlarmConfigDetailController',
                    controllerAs: 'vm',
                    data: {
                        pageTitle: 'admin.menu.alarm.config',
                        parentLink: 'alarm-config',
                        authorities: ['ROLE_SYSTEM_ADMIN', 'ROLE_FARM_ADMIN', 'Alarm_Controller_View'], //TODO change role,
                        sideBarMenu: 'inventory'
                    },
                    resolve: {
                        deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                                return $ocLazyLoad.load([
                                    'lazy_ionRangeSlider',
                                    'lazy_tablesorter',
                                    'lazy_KendoUI',
                                    'lazy_parsleyjs',
                                    'app/home/alarm/config/config.detail.controller.js'
                                ]);
                            }],
                        translatePartialLoader: ['$translate', '$translatePartialLoader', function ($translate, $translatePartialLoader) {
                                $translatePartialLoader.addPart('global');
                                $translatePartialLoader.addPart('alarm');
                                $translatePartialLoader.addPart('admin');
                                $translatePartialLoader.addPart('errors');
                                $translatePartialLoader.addPart('success');
                                return $translate.refresh();
                            }]
                    }
                })

                .state('alarm-history', {
                    parent: 'admin',
                    url: '/alarm-history',
                    templateUrl: 'app/home/alarm/history/history.home.html',
                    controller: 'AlarmHistoryHomeController',
                    controllerAs: 'vm',
                    data: {
                        pageTitle: 'admin.menu.alarm.history',
                        authorities: ['ROLE_SYSTEM_ADMIN', 'ROLE_SYSTEM_USER', 'ROLE_FARM_ADMIN', 'Alarm_History_View'], //TODO change role,
                        sideBarMenu: 'inventory'
                    },
                    resolve: {
                        deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                                return $ocLazyLoad.load([
                                    'lazy_ionRangeSlider',
                                    'lazy_tablesorter',
                                    'lazy_KendoUI',
                                    'app/home/alarm/history/history.home.controller.js'
                                ]);
                            }],
                        translatePartialLoader: ['$translate', '$translatePartialLoader', function ($translate, $translatePartialLoader) {
                                $translatePartialLoader.addPart('global');
                                $translatePartialLoader.addPart('alarm');
                                $translatePartialLoader.addPart('admin');
                                $translatePartialLoader.addPart('errors');
                                $translatePartialLoader.addPart('success');
                                return $translate.refresh();
                            }]
                    }
                })
                .state('alarm-history-detail', {
                    parent: 'admin',
                    url: '/alarm-history/{alarmId:[0-9]{1,9}}/detail',
                    templateUrl: 'app/home/alarm/history/history.detail.html',
                    controller: 'HistoryDetailController',
                    controllerAs: 'vm',
                    data: {
                        pageTitle: 'admin.menu.alarm.history',
                        authorities: ['ROLE_SYSTEM_ADMIN', 'ROLE_SYSTEM_USER', 'ROLE_FARM_ADMIN', 'Alarm_History_View'], //TODO change role,
                        sideBarMenu: 'inventory'
                    },
                    resolve: {
                        deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                                return $ocLazyLoad.load([
                                    'lazy_ionRangeSlider',
                                    'lazy_tablesorter',
                                    'lazy_KendoUI',
                                    'app/home/alarm/history/history.detail.controller.js'
                                ]);
                            }],
                        translatePartialLoader: ['$translate', '$translatePartialLoader', function ($translate, $translatePartialLoader) {
                                $translatePartialLoader.addPart('global');
                                $translatePartialLoader.addPart('alarm');
                                return $translate.refresh();
                            }]
                    }
                })
    }
})();