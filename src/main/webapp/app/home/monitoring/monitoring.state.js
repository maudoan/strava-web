(function () {
    'use strict';
    angular.module('erpApp')
        .config(stateConfig);
    stateConfig.$inject = ['$stateProvider'];

    function stateConfig($stateProvider) {
        $stateProvider
            .state('monitoring', {
                parent: 'restricted',
                template: "<div ui-view></div>",
                abstract: true,
                resolve: {
                    translatePartialLoader: ['$translate', '$translatePartialLoader', function ($translate, $translatePartialLoader) {
                        $translatePartialLoader.addPart('admin');
                        $translatePartialLoader.addPart('errors');
                        $translatePartialLoader.addPart('success');
                        $translatePartialLoader.addPart('global');
                        $translatePartialLoader.addPart('monitoring');
                        return $translate.refresh();
                    }]
                }
            })
            .state('monitoring-manager', {
                parent: 'admin',
                url: '/monitoring-manager',
                templateUrl: 'app/agri/dashboard/monitoring.manager.html',
                controller: 'MonitoringManagerController',
                controllerAs: 'vm',
                data: {
                    pageTitle: 'admin.menu.monitoringManagement',
                    authorities: ['ROLE_SYSTEM_ADMIN', 'ROLE_SYSTEM_USER', 'ROLE_FARM_ADMIN', 'Farm_View'],
                    sideBarMenu: 'inventory'
                },
                resolve: {
                    deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                        return $ocLazyLoad.load([
                            'app/agri/dashboard/monitoring.manager.controller.js'
                        ]);
                    }]
                }
            })
            .state('cameras', {
                parent: 'monitoring',
                url: '/cameras',
                templateUrl: 'app/agri/monitoring/camera/camera.home.html',
                controller: 'CameraController',
                controllerAs: 'vm',
                data: {
                    pageTitle: 'admin.menu.monitoring',
                    authorities: ['ROLE_SYSTEM_ADMIN', 'ROLE_SYSTEM_USER', 'ROLE_FARM_ADMIN', 'Camera_View'],
                    sideBarMenu: 'inventory'
                },
                resolve: {
                    deps: ['$ocLazyLoad', function($ocLazyLoad) {
                        return $ocLazyLoad.load([
                            'lazy_ionRangeSlider',
                            'lazy_tablesorter',
                            'lazy_KendoUI',
                            'app/agri/monitoring/camera/camera.home.controller.js'
                        ]);
                    }]
                }
            })
    }
})();