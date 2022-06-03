(function () {
    'use strict';
    angular.module('erpApp')
        .config(stateConfig);
    stateConfig.$inject = ['$stateProvider'];

    function stateConfig($stateProvider) {
        $stateProvider
            .state('qrCodeProvider', {
                parent: 'restricted',
                template: "<div ui-view></div>",
                abstract: true,
                resolve: {
                    translatePartialLoader: ['$translate', '$translatePartialLoader', function ($translate, $translatePartialLoader) {
                        $translatePartialLoader.addPart('admin');
                        $translatePartialLoader.addPart('errors');
                        $translatePartialLoader.addPart('success');
                        $translatePartialLoader.addPart('global');
                        $translatePartialLoader.addPart('qrcode');
                        $translatePartialLoader.addPart('infrastructure');
                        return $translate.refresh();
                    }]
                }
            })
            .state('qrCode', {
                parent: 'qrCodeProvider',
                url: '/qrCode',
                templateUrl: 'app/home/qrcode/qrcode.home.html',
                controller: 'QrCodeController',
                controllerAs: 'vm',
                data: {
                    pageTitle: 'admin.menu.qrCode',
                    authorities: ['ROLE_SYSTEM_ADMIN', 'ROLE_SYSTEM_USER', 'ROLE_FARM_ADMIN', 'ROLE_USER', 'QR_Code_View'], //TODO change role,
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
                            'app/home/qrcode/qrcode.home.controller.js'
                        ]);
                    }]
                }
            })
            .state('qrCode-add', {
                parent: 'qrCodeProvider',
                url: '/qrCode-create',
                templateUrl: 'app/home/qrcode/qrcode.create.html',
                controller: 'QrCodeCreateController',
                controllerAs: 'vm',
                data: {
                    pageTitle: 'admin.menu.qrCode',
                    authorities: ['ROLE_SYSTEM_ADMIN', 'ROLE_SYSTEM_USER', 'ROLE_FARM_ADMIN', 'ROLE_USER', 'QR_Code_View'], //TODO change role,
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
                            'app/home/qrcode/qrcode.create.controller.js'
                        ]);
                    }]
                }
            })
            .state('qrCode-edit', {
                parent: 'qrCodeProvider',
                url: '/qrCode/{qrCodeId}/edit',
                templateUrl: 'app/home/qrcode/qrcode.edit.html',
                controller: 'QrCodeEditController',
                controllerAs: 'vm',
                data: {
                    pageTitle: 'admin.menu.qrCode',
                    authorities: ['ROLE_SYSTEM_ADMIN', 'ROLE_SYSTEM_USER', 'ROLE_FARM_ADMIN', 'ROLE_USER', 'QR_Code_View'], //TODO change role,
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
                            'app/home/qrcode/qrcode.edit.controller.js'
                        ]);
                    }]
                }
            })
            .state('qrCode-detail', {
                parent: 'qrCodeProvider',
                url: '/qrCode/{qrCodeId}/detail',
                templateUrl: 'app/home/qrcode/qrcode.detail.html',
                controller: 'QrCodeDetailController',
                controllerAs: 'vm',
                data: {
                    pageTitle: 'admin.menu.qrCode',
                    authorities: ['ROLE_SYSTEM_ADMIN', 'ROLE_SYSTEM_USER', 'ROLE_FARM_ADMIN', 'ROLE_USER', 'QR_Code_View'], //TODO change role,
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
                            'app/home/qrcode/qrcode.detail.controller.js'
                        ]);
                    }]
                }
            })
    }
})();