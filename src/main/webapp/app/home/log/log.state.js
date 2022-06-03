(function () {
    'use strict';
    angular.module('erpApp')
        .config(stateConfig);
    stateConfig.$inject = ['$stateProvider'];

    function stateConfig($stateProvider) {
        $stateProvider
            .state('logProvider', {
                parent: 'restricted',
                template: "<div ui-view></div>",
                abstract: true,
                resolve: {
                    translatePartialLoader: ['$translate', '$translatePartialLoader', function ($translate, $translatePartialLoader) {
                        $translatePartialLoader.addPart('admin');
                        $translatePartialLoader.addPart('errors');
                        $translatePartialLoader.addPart('success');
                        $translatePartialLoader.addPart('global');
                        $translatePartialLoader.addPart('log');
                        return $translate.refresh();
                    }]
                }
            })
            .state('logs', {
                parent: 'logProvider',
                url: '/logs',
                templateUrl: 'app/home/log/log.home.html',
                controller: 'LogController',
                controllerAs: 'vm',
                data: {
                    pageTitle: 'admin.menu.logs',
                    authorities: ['ROLE_SYSTEM_ADMIN', 'ROLE_SYSTEM_USER','Log_View'],
                    sideBarMenu: 'inventory'
                },
                resolve: {
                    deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                        return $ocLazyLoad.load([
                            'lazy_parsleyjs',
                            'lazy_KendoUI',
                            'app/home/log/log.home.controller.js'
                        ]);
                    }]
                }
            })
            .state('logTypes', {
                parent: 'logProvider',
                url: '/logTypes',
                templateUrl: 'app/home/log/logType.home.html',
                controller: 'LogTypeController',
                controllerAs: 'vm',
                data: {
                    pageTitle: 'admin.menu.logTypes',
                    authorities: ['ROLE_SYSTEM_ADMIN', 'ROLE_SYSTEM_USER', 'ROLE_FARM_ADMIN', 'ROLE_USER', 'Log_View'],
                    sideBarMenu: 'inventory'
                },
                resolve: {
                    deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                        return $ocLazyLoad.load([
                            'lazy_ionRangeSlider',
                            'lazy_tablesorter',
                            'lazy_iCheck',
                            'lazy_tree',
                            'lazy_parsleyjs',
                            'lazy_KendoUI',
                            'app/home/log/logType.home.controller.js'
                        ]);
                    }]
                }
            })
            .state('logTypes-create', {
                parent: 'logProvider',
                url: '/logTypes/create',
                templateUrl: 'app/home/log/logType.create.html',
                controller: 'LogTypeCreateController',
                controllerAs: 'vm',
                data: {
                    pageTitle: 'admin.menu.logTypes',
                    authorities: ['ROLE_SYSTEM_ADMIN', 'ROLE_SYSTEM_USER', 'ROLE_FARM_ADMIN', 'ROLE_USER', 'Log_View'],
                    sideBarMenu: 'inventory'
                },
                resolve: {
                    deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                        return $ocLazyLoad.load([
                            'lazy_parsleyjs',
                            'lazy_KendoUI',
                            'app/home/log/logType.create.controller.js'
                        ]);
                    }]
                }
            })
            .state('logTypes-detail', {
                parent: 'logProvider',
                url: '/logTypes/{logTypeId:[0-9]{1,9}}/detail',
                templateUrl: 'app/home/log/logType.detail.html',
                controller: 'LogTypeDetailController',
                controllerAs: 'vm',
                data: {
                    pageTitle: 'admin.menu.logTypes',
                    authorities: ['ROLE_SYSTEM_ADMIN', 'ROLE_SYSTEM_USER', 'ROLE_FARM_ADMIN', 'ROLE_USER', 'Log_View'],
                    sideBarMenu: 'inventory'
                },
                resolve: {
                    deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                        return $ocLazyLoad.load([
                            'app/home/log/logType.detail.controller.js'
                        ]);
                    }]
                }
            })
            .state('logTypes-edit', {
                parent: 'logProvider',
                url: '/logTypes/{logTypeId:[0-9]{1,9}}/edit',
                templateUrl: 'app/home/log/logType.edit.html',
                controller: 'LogTypeEditController',
                controllerAs: 'vm',
                data: {
                    pageTitle: 'admin.menu.logTypes',
                    authorities: ['ROLE_SYSTEM_ADMIN', 'ROLE_SYSTEM_USER', 'ROLE_FARM_ADMIN', 'ROLE_USER', 'Log_View'],
                    sideBarMenu: 'inventory'
                },
                resolve: {
                    deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                        return $ocLazyLoad.load([
                            'lazy_parsleyjs',
                            'lazy_KendoUI',
                            'app/home/log/logType.edit.controller.js'
                        ]);
                    }]
                }
            })
    }
})();