(function () {
    'use strict';
    angular.module('erpApp')
            .config(stateConfig);
    stateConfig.$inject = ['$stateProvider']

    function stateConfig($stateProvider) {

        $stateProvider
                .state('notifications', {
                    parent: 'admin',
                    url: '/notifications',
                    templateUrl: 'app/log-notify/notifications.home.html',
                    controller: 'NotificationController',
                    controllerAs: 'vm',
                    data: {
                        pageTitle: 'inventory.logs.notification',
                        authorities: ['ROLE_SYSTEM_ADMIN', 'ROLE_SYSTEM_USER', 'ROLE_FARM_ADMIN'], //TODO change role,
                        sideBarMenu: 'inventory'
                    },
                    resolve: {
                        deps: ['$ocLazyLoad', function ($ocLazyLoad) { 
                                return $ocLazyLoad.load([
                                    'lazy_ionRangeSlider',
                                    'lazy_tablesorter',
                                    'lazy_KendoUI',
                                    'app/log-notify/notifications.controller.js'
                                ]);
                            }],
                        translatePartialLoader: ['$translate', '$translatePartialLoader', function ($translate, $translatePartialLoader) {
                                $translatePartialLoader.addPart('global');
                                $translatePartialLoader.addPart('admin');
                                $translatePartialLoader.addPart('errors');
                                $translatePartialLoader.addPart('success');
                                return $translate.refresh();
                            }]
                    }
                })           
    }
})();