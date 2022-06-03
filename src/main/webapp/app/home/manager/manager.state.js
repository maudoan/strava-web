(function () {
    'use strict';
    angular.module('erpApp')
        .config(stateConfig);
    stateConfig.$inject = ['$stateProvider'];

    function stateConfig($stateProvider) {
        $stateProvider
            .state('manager', {
                parent: 'restricted',
                template: "<div ui-view></div>",
                abstract: true,
                resolve: {
                    translatePartialLoader: ['$translate', '$translatePartialLoader', function ($translate, $translatePartialLoader) {
                        $translatePartialLoader.addPart('admin');
                        $translatePartialLoader.addPart('errors');
                        $translatePartialLoader.addPart('success');
                        $translatePartialLoader.addPart('global');
                        $translatePartialLoader.addPart('application');
                        $translatePartialLoader.addPart('data-package');
                        return $translate.refresh();
                    }]
                }
            })
            .state('customers', {
                parent: 'manager',
                url: '/customers',
                templateUrl: 'app/home/manager/customer/customer.home.html',
                controller: 'CustomerHomeController',
                controllerAs: 'vm',
                data: {
                    pageTitle: 'admin.menu.customer',
                    authorities: ['ROLE_SYSTEM_ADMIN', 'ROLE_SYSTEM_USER', 'Customer_View'], //TODO change role,
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
                            'app/home/manager/customer/customer.home.controller.js'
                        ]);
                    }]
                }
            })
            // .state('customers-detail', {
            //     parent: 'manager',
            //     url: '/customers/{userId}/detail',
            //     templateUrl: 'app/home/manager/customer/customer.detail.html',
            //     controller: 'CustomerDetailController',
            //     controllerAs: 'vm',
            //     data: {
            //         pageTitle: 'admin.menu.customer',
            //         parentLink: 'customers',
            //         authorities: ['ROLE_SYSTEM_ADMIN', 'ROLE_SYSTEM_USER', 'User_View_Detail'], //TODO change role,
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
            //                 'app/home/manager/customer/customer.detail.controller.js'
            //             ]);
            //         }]
            //     }
            // })
    }
})();