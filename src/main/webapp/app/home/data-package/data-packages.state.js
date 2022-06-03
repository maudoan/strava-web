(function () {
    'use strict';
    angular.module('erpApp')
        .config(stateConfig);
    stateConfig.$inject = ['$stateProvider']

    function stateConfig($stateProvider) {

        $stateProvider
            .state('data-package-module', {
                parent: 'restricted',
                template: "<div ui-view></div>",
                abstract: true,
                resolve: {
                    translatePartialLoader: ['$translate', '$translatePartialLoader', function ($translate, $translatePartialLoader) {
                        $translatePartialLoader.addPart('admin');
                        $translatePartialLoader.addPart('errors');
                        $translatePartialLoader.addPart('success');
                        $translatePartialLoader.addPart('global');
                        $translatePartialLoader.addPart('data-package');
                        return $translate.refresh();
                    }]
                }
            })
            //stock
            .state('packages',{
                parent: 'data-package-module',
                url: '/packages',
                templateUrl: 'app/home/data-package/data-packages.html',
                controller: 'DataPackagesController',
                controllerAs: 'vm',
                params: {
                    packageId: null
                },
                data: {
                    pageTitle: 'admin.menu.dataPackageTitle',
                    authorities: ['ROLE_SYSTEM_ADMIN','ROLE_SYSTEM_USER','ROLE_HOME_ADMIN', 'Data_Package_View'], //TODO change role,
                    sideBarMenu: 'inventory'
                },
                resolve: {
                    deps: ['$ocLazyLoad', function($ocLazyLoad) {
                        return $ocLazyLoad.load([
                            'lazy_ionRangeSlider',
                            'lazy_tablesorter',
                            'lazy_KendoUI',
                            'lazy_parsleyjs',
                            'app/home/data-package/data-packages.controller.js'
                        ]);
                    }]
                }
            })
            .state('packages-create',{
                parent:'data-package-module',
                url:'/packages/create',
                templateUrl:'app/home/data-package/data-package.create.html',
                data: {
                    pageTitle: 'admin.menu.dataPackageTitle',
                    parentLink: 'packages',
                    authorities:['ROLE_SYSTEM_ADMIN','ROLE_HOME_ADMIN', 'Data_Package_Create'],
                    sideBarMenu: 'inventory'
                },
                controller: 'DataPackageCreateController',
                resolve: {
                    deps: ['$ocLazyLoad', function($ocLazyLoad) {
                        return $ocLazyLoad.load([
                            'lazy_parsleyjs',
                            'app/home/data-package/data-package.create.controller.js'
                        ]);
                    }]
                }
            })
            .state('packages-edit',{
                url:'/packages/{packageId:[0-9]{1,9}}/edit',
                templateUrl:'app/home/data-package/data-package.edit.html',
                parent:'data-package-module',
                data: {
                    pageTitle: 'admin.menu.dataPackageTitle',
                    parentLink: 'packages',
                    authorities:['ROLE_SYSTEM_ADMIN','ROLE_HOME_ADMIN', 'Data_Package_Update'],
                    sideBarMenu: 'inventory'
                },
                controller: 'DataPackageEditController',
                resolve: {
                    deps: ['$ocLazyLoad', function($ocLazyLoad) {
                        return $ocLazyLoad.load([
                            'lazy_parsleyjs',
                            'app/home/data-package/data-package.edit.controller.js'
                        ]);
                    }]
                }
            })
            .state('packages-detail',{
                parent:'data-package-module',
                url:'/packages/{packageId:[0-9]{1,9}}/detail',
                templateUrl:'app/home/data-package/data-package.detail.html',
                data: {
                    pageTitle: 'admin.menu.dataPackageTitle',
                    parentLink: 'packages',
                    authorities:['ROLE_SYSTEM_ADMIN','ROLE_SYSTEM_USER','ROLE_HOME_ADMIN', 'Data_Package_View_Detail'],
                    sideBarMenu: 'inventory'
                },
                controller: 'DataPackageDetailController',
                resolve: {
                    deps: ['$ocLazyLoad', function($ocLazyLoad) {
                        return $ocLazyLoad.load([
                            'lazy_parsleyjs',
                            'app/home/data-package/data-package.detail.controller.js'
                        ]);
                    }]
                }
            })
            .state('service-customers',{
                parent: 'data-package-module',
                url: '/service-customers',
                templateUrl: 'app/home/data-package/service-customer/user.home.html',
                controller: 'ServiceCustomerController',
                controllerAs: 'vm',
                params: {},
                data: {
                    pageTitle: 'admin.menu.serviceCustomer',
                    authorities: ['ROLE_SYSTEM_ADMIN','ROLE_SYSTEM_USER','ROLE_HOME_ADMIN', 'Service_Customer_View'], //TODO change role,
                    sideBarMenu: 'inventory'
                },
                resolve: {
                    deps: ['$ocLazyLoad', function($ocLazyLoad) {
                        return $ocLazyLoad.load([
                            'lazy_ionRangeSlider',
                            'lazy_tablesorter',
                            'lazy_KendoUI',
                            'lazy_parsleyjs',
                            'app/home/data-package/service-customer/user.home.controller.js'
                        ]);
                    }]
                }
            })
            .state('service-customers-detail',{
                parent:'data-package-module',
                url:'/service-customers/{userId:[0-9]{1,9}}/detail',
                templateUrl:'app/home/data-package/service-customer/user.detail.html',
                data: {
                    pageTitle: 'admin.menu.serviceCustomer',
                    parentLink: 'service-customers',
                    authorities:['ROLE_SYSTEM_ADMIN','ROLE_SYSTEM_USER','ROLE_HOME_ADMIN', 'Service_Customer_View'],
                    sideBarMenu: 'inventory'
                },
                controller: 'ServiceCustomerDetailController',
                resolve: {
                    deps: ['$ocLazyLoad', function($ocLazyLoad) {
                        return $ocLazyLoad.load([
                            'lazy_ionRangeSlider',
                            'lazy_tablesorter',
                            'lazy_KendoUI',
                            'lazy_parsleyjs',
                            'app/home/data-package/service-customer/user.detail.controller.js'
                        ]);
                    }]
                }

            })
    }
})();