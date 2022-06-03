(function () {
    'use strict';
    angular.module('erpApp')
        .config(stateConfig);
    stateConfig.$inject = ['$stateProvider'];

    function stateConfig($stateProvider) {
        $stateProvider
            .state('notificationProvider', {
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
            // .state('notifications', {
            //     parent: 'notificationProvider',
            //     url: '/notifications',
            //     templateUrl: 'app/home/notification/notification.home.html',
            //     controller: 'NotificationController',
            //     controllerAs: 'vm',
            //     data: {
            //         pageTitle: 'admin.menu.notifications',
            //         authorities: ['ROLE_SYSTEM_ADMIN', 'ROLE_SYSTEM_USER', 'ROLE_FARM_ADMIN', 'ROLE_USER', 'Log_View'],
            //         sideBarMenu: 'inventory'
            //     },
            //     resolve: {
            //         deps: ['$ocLazyLoad', function ($ocLazyLoad) {
            //             return $ocLazyLoad.load([
            //                 'lazy_ionRangeSlider',
            //                 'lazy_tablesorter',
            //                 'lazy_iCheck',
            //                 'lazy_tree',
            //                 'lazy_parsleyjs',
            //                 'lazy_KendoUI',
            //                 'app/home/notification/notification.home.controller.js'
            //             ]);
            //         }]
            //     }
            // })
    }
})();