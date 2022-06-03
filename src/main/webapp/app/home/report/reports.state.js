(function () {
    'use strict';
    angular.module('erpApp')
        .config(stateConfig);
    stateConfig.$inject = ['$stateProvider']

    function stateConfig($stateProvider) {

        $stateProvider
            .state('report-module', {
                parent: 'restricted',
                template: "<div ui-view></div>",
                abstract: true,
                resolve: {
                    translatePartialLoader: ['$translate', '$translatePartialLoader', function ($translate, $translatePartialLoader) {
                        $translatePartialLoader.addPart('admin');
                        $translatePartialLoader.addPart('errors');
                        $translatePartialLoader.addPart('success');
                        $translatePartialLoader.addPart('global');
                        $translatePartialLoader.addPart('report');
                        return $translate.refresh();
                    }]
                }
            })
            .state('report-customers',{
                parent: 'report-module',
                url: '/report-customers',
                templateUrl: 'app/home/report/report-customers.html',
                controller: 'ReportCustomersController',
                controllerAs: 'vm',
                params: {
                    packageId: null
                },
                data: {
                    pageTitle: 'Báo cáo số lượng khách hàng',
                    authorities: ['ROLE_SYSTEM_ADMIN','ROLE_SYSTEM_USER','ROLE_HOME_ADMIN', 'Customer_Report_View'], //TODO change role,
                    sideBarMenu: 'inventory'
                },
                resolve: {
                    deps: ['$ocLazyLoad', function($ocLazyLoad) {
                        return $ocLazyLoad.load([
                            'lazy_ionRangeSlider',
                            'lazy_tablesorter',
                            'lazy_KendoUI',
                            'lazy_parsleyjs',
                            'app/home/report/report-customers.controller.js'
                        ]);
                    }]
                }
            })
            .state('report-devices',{
                parent: 'report-module',
                url: '/report-devices',
                templateUrl: 'app/home/report/report-devices.html',
                controller: 'ReportDevicesController',
                controllerAs: 'vm',
                params: {
                    packageId: null
                },
                data: {
                    pageTitle: 'Báo cáo số lượng thiết bị',
                    authorities: ['ROLE_SYSTEM_ADMIN','ROLE_SYSTEM_USER','ROLE_HOME_ADMIN', 'Device_Report_View'], //TODO change role,
                    sideBarMenu: 'inventory'
                },
                resolve: {
                    deps: ['$ocLazyLoad', function($ocLazyLoad) {
                        return $ocLazyLoad.load([
                            'lazy_ionRangeSlider',
                            'lazy_tablesorter',
                            'lazy_KendoUI',
                            'lazy_parsleyjs',
                            'app/home/report/report-devices.controller.js'
                        ]);
                    }]
                }
            })
    }
})();