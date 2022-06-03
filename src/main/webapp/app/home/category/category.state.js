(function () {
    'use strict';
    angular.module('erpApp')
        .config(stateConfig);
    stateConfig.$inject = ['$stateProvider']

    function stateConfig($stateProvider) {

        $stateProvider
            .state('categories', {
                parent: 'restricted',
                template: "<div ui-view></div>",
                abstract: true,
                resolve: {
                    translatePartialLoader: ['$translate', '$translatePartialLoader', function ($translate, $translatePartialLoader) {
                        $translatePartialLoader.addPart('admin');
                        $translatePartialLoader.addPart('errors');
                        $translatePartialLoader.addPart('success');
                        $translatePartialLoader.addPart('global');
                        $translatePartialLoader.addPart('infrastructure');
                        return $translate.refresh();
                    }]
                }
            })
            .state('category', {
                parent: 'categories',
                url: '/category',
                templateUrl: 'app/agri/dashboard/category.html',
                controller: 'CategoryController',
                controllerAs: 'vm',
                data: {
                    pageTitle: 'admin.menu.stockManagement',
                    authorities: ['ROLE_SYSTEM_ADMIN','ROLE_SYSTEM_USER','ROLE_FARM_ADMIN'], //TODO change role,
                    sideBarMenu: 'inventory'
                },
                resolve: {
                    deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                        return $ocLazyLoad.load([
                            'app/agri/dashboard/category.controller.js'
                        ]);
                    }]
                }
            })
            .state('uomTypes',{
                parent: 'categories',
                url: '/uomTypes',
                templateUrl: 'app/agri/category/uomType/uomType.home.html',
                controller: 'UomTypeHomeController',
                controllerAs: 'vm',
                data: {
                    pageTitle: 'admin.menu.uomType',
                    authorities: ['ROLE_SYSTEM_ADMIN','ROLE_SYSTEM_USER','ROLE_FARM_ADMIN', 'Uom_Type_View'], //TODO change role,
                    sideBarMenu: 'inventory'
                },
                resolve: {
                    deps: ['$ocLazyLoad', function($ocLazyLoad) {
                        return $ocLazyLoad.load([
                            'lazy_KendoUI',
                            'app/agri/category/uomType/uomType.home.controller.js'
                        ]);
                    }]
                }
            })
            .state('uomTypes-create',{
                parent: 'categories',
                url: '/uomTypes/create',
                templateUrl: 'app/agri/category/uomType/uomType.create.html',
                controller: 'UomTypeCreateController',
                controllerAs: 'vm',
                data: {
                    pageTitle: 'admin.menu.uomType',
                    parentLink: 'uomTypes',
                    authorities: ['ROLE_SYSTEM_ADMIN','ROLE_FARM_ADMIN', 'Uom_Type_Create'], //TODO change role,
                    sideBarMenu: 'inventory'
                },
                resolve: {
                    deps: ['$ocLazyLoad', function($ocLazyLoad) {
                        return $ocLazyLoad.load([
                            'lazy_parsleyjs',
                            'app/agri/category/uomType/uomType.create.controller.js'
                        ]);
                    }]
                }
            })
            .state('uomTypes-detail',{
                parent: 'categories',
                url: '/uomTypes/{uomTypeId}/detail',
                templateUrl: 'app/agri/category/uomType/uomType.detail.html',
                controller: 'UomTypeDetailController',
                controllerAs: 'vm',
                data: {
                    pageTitle: 'admin.menu.uomType',
                    parentLink: 'uomTypes',
                    authorities: ['ROLE_SYSTEM_ADMIN','ROLE_SYSTEM_USER','ROLE_FARM_ADMIN', 'Uom_Type_View'], //TODO change role,
                    sideBarMenu: 'inventory'
                },
                resolve: {
                    deps: ['$ocLazyLoad', function($ocLazyLoad) {
                        return $ocLazyLoad.load([
                            'app/agri/category/uomType/uomType.detail.controller.js'
                        ]);
                    }]
                }
            })
            .state('uomTypes-edit',{
                parent: 'categories',
                url: '/uomTypes/{uomTypeId}/edit',
                templateUrl: 'app/agri/category/uomType/uomType.edit.html',
                controller: 'UomTypeEditController',
                controllerAs: 'vm',
                data: {
                    pageTitle: 'admin.menu.uomType',
                    parentLink: 'uomTypes',
                    authorities: ['ROLE_SYSTEM_ADMIN','ROLE_FARM_ADMIN', 'Uom_Type_Update'], //TODO change role,
                    sideBarMenu: 'inventory'
                },
                resolve: {
                    deps: ['$ocLazyLoad', function($ocLazyLoad) {
                        return $ocLazyLoad.load([
                            'lazy_parsleyjs',
                            'app/agri/category/uomType/uomType.edit.controller.js'
                        ]);
                    }]
                }
            })
            .state('uoms',{
                parent: 'categories',
                url: '/uoms',
                templateUrl: 'app/agri/category/uom/uom.home.html',
                controller: 'UomHomeController',
                controllerAs: 'vm',
                data: {
                    pageTitle: 'admin.menu.uom',
                    authorities: ['ROLE_SYSTEM_ADMIN','ROLE_SYSTEM_USER','ROLE_FARM_ADMIN', 'Uom_View'], //TODO change role,
                    sideBarMenu: 'inventory'
                },
                resolve: {
                    deps: ['$ocLazyLoad', function($ocLazyLoad) {
                        return $ocLazyLoad.load([
                            'lazy_KendoUI',
                            'app/agri/category/uom/uom.home.controller.js'
                        ]);
                    }]
                }
            })
            .state('uoms-create',{
                parent: 'categories',
                url: '/uoms/create',
                templateUrl: 'app/agri/category/uom/uom.create.html',
                controller: 'UomCreateController',
                controllerAs: 'vm',
                data: {
                    pageTitle: 'admin.menu.uom',
                    parentLink: 'uoms',
                    authorities: ['ROLE_SYSTEM_ADMIN','ROLE_FARM_ADMIN', 'Uom_Create'], //TODO change role,
                    sideBarMenu: 'inventory'
                },
                resolve: {
                    deps: ['$ocLazyLoad', function($ocLazyLoad) {
                        return $ocLazyLoad.load([
                            'lazy_parsleyjs',
                            'app/agri/category/uom/uom.create.controller.js'
                        ]);
                    }]
                }
            })
            .state('uoms-detail',{
                parent: 'categories',
                url: '/uoms/{uomId}/detail',
                templateUrl: 'app/agri/category/uom/uom.detail.html',
                controller: 'UomDetailController',
                controllerAs: 'vm',
                data: {
                    pageTitle: 'admin.menu.uom',
                    parentLink: 'uoms',
                    authorities: ['ROLE_SYSTEM_ADMIN','ROLE_SYSTEM_USER','ROLE_FARM_ADMIN', 'Uom_View'], //TODO change role,
                    sideBarMenu: 'inventory'
                },
                resolve: {
                    deps: ['$ocLazyLoad', function($ocLazyLoad) {
                        return $ocLazyLoad.load([
                            'app/agri/category/uom/uom.detail.controller.js'
                        ]);
                    }]
                }
            })
            .state('uoms-edit',{
                parent: 'categories',
                url: '/uoms/{uomId}/edit',
                templateUrl: 'app/agri/category/uom/uom.edit.html',
                controller: 'UomEditController',
                controllerAs: 'vm',
                data: {
                    pageTitle: 'admin.menu.uom',
                    parentLink: 'uoms',
                    authorities: ['ROLE_SYSTEM_ADMIN','ROLE_SYSTEM_USER','ROLE_FARM_ADMIN', 'Uom_Update'], //TODO change role,
                    sideBarMenu: 'inventory'
                },
                resolve: {
                    deps: ['$ocLazyLoad', function($ocLazyLoad) {
                        return $ocLazyLoad.load([
                            'lazy_parsleyjs',
                            'app/agri/category/uom/uom.edit.controller.js'
                        ]);
                    }]
                }
            })
            .state('currency',{
                parent: 'categories',
                url: '/currency',
                templateUrl: 'app/agri/category/currency/currency.home.html',
                controller: 'CurrencyHomeController',
                controllerAs: 'vm',
                data: {
                    pageTitle: 'admin.menu.organizations',
                    authorities: ['ROLE_SYSTEM_ADMIN','ROLE_SYSTEM_USER','ROLE_FARM_ADMIN', 'Currency_View'], //TODO change role,
                    sideBarMenu: 'inventory'
                },
                resolve: {
                    deps: ['$ocLazyLoad', function($ocLazyLoad) {
                        return $ocLazyLoad.load([
                            'lazy_KendoUI',
                            'app/agri/category/currency/currency.home.controller.js'
                        ]);
                    }]
                }
            })

    }
})();