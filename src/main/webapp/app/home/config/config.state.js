(function () {
    'use strict';
    angular.module('erpApp')
        .config(stateConfig);
    stateConfig.$inject = ['$stateProvider'];

    function stateConfig($stateProvider) {
        $stateProvider
            .state('configProvider', {
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
            .state('configs', {
                parent: 'configProvider',
                url: '/configs',
                templateUrl: 'app/home/config/config.home.html',
                controller: 'ConfigController',
                controllerAs: 'vm',
                data: {
                    pageTitle: 'admin.menu.configs',
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
                            'app/home/config/config.home.controller.js'
                        ]);
                    }]
                }
            })
            .state('configs-create', {
                parent: 'configProvider',
                url: '/configs/create',
                templateUrl: 'app/home/config/config.create.html',
                controller: 'ConfigCreateController',
                controllerAs: 'vm',
                data: {
                    pageTitle: 'admin.menu.configs',
                    authorities: ['ROLE_SYSTEM_ADMIN', 'ROLE_SYSTEM_USER', 'ROLE_FARM_ADMIN', 'ROLE_USER', 'Log_View'],
                    sideBarMenu: 'inventory'
                },
                resolve: {
                    deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                        return $ocLazyLoad.load([
                            'lazy_parsleyjs',
                            'lazy_KendoUI',
                            'app/home/config/config.create.controller.js'
                        ]);
                    }]
                }
            })
            .state('configs-detail', {
                parent: 'configProvider',
                url: '/configs/{configId:[0-9]{1,9}}/detail',
                templateUrl: 'app/home/config/config.detail.html',
                controller: 'ConfigDetailController',
                controllerAs: 'vm',
                data: {
                    pageTitle: 'admin.menu.configs',
                    authorities: ['ROLE_SYSTEM_ADMIN', 'ROLE_SYSTEM_USER'],
                    sideBarMenu: 'inventory'
                },
                resolve: {
                    deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                        return $ocLazyLoad.load([
                            'app/home/config/config.detail.controller.js'
                        ]);
                    }]
                }
            })
            .state('configs-edit', {
                parent: 'configProvider',
                url: '/configs/{configId:[0-9]{1,9}}/edit',
                templateUrl: 'app/home/config/config.edit.html',
                controller: 'ConfigEditController',
                controllerAs: 'vm',
                data: {
                    pageTitle: 'admin.menu.configs',
                    authorities: ['ROLE_SYSTEM_ADMIN', 'ROLE_SYSTEM_USER'],
                    sideBarMenu: 'inventory'
                },
                resolve: {
                    deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                        return $ocLazyLoad.load([
                            'lazy_parsleyjs',
                            'lazy_KendoUI',
                            'app/home/config/config.edit.controller.js'
                        ]);
                    }]
                }
            })
    }
})();