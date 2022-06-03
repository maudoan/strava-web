(function () {
    'use strict';
    angular.module('erpApp')
        .config(stateConfig);
    stateConfig.$inject = ['$stateProvider']

    function stateConfig($stateProvider) {

        $stateProvider
            .state('manufacturing', {
                parent: 'restricted',
                template: "<div ui-view></div>",
                abstract: true,
                resolve: {
                    translatePartialLoader: ['$translate', '$translatePartialLoader', function ($translate, $translatePartialLoader) {
                        $translatePartialLoader.addPart('admin');
                        $translatePartialLoader.addPart('errors');
                        $translatePartialLoader.addPart('success');
                        $translatePartialLoader.addPart('global');
                        $translatePartialLoader.addPart('manufacturing');
                        $translatePartialLoader.addPart('infrastructure');
                        return $translate.refresh();
                    }]
                }
            })
            .state('manufacturing-manager', {
                parent: 'admin',
                url: '/manufacturing-manager',
                templateUrl: 'app/agri/dashboard/manufacturing.manager.html',
                controller: 'ManufacturingManagerController',
                controllerAs: 'vm',
                data: {
                    pageTitle: 'admin.menu.stockManagement',
                    authorities: ['ROLE_SYSTEM_ADMIN','ROLE_SYSTEM_USER','ROLE_FARM_ADMIN', 'Procedure_Log_View','Procedure_View','Area_View'], //TODO change role,
                    sideBarMenu: 'inventory'
                },
                resolve: {
                    deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                        return $ocLazyLoad.load([
                            'app/agri/dashboard/manufacturing.manager.controller.js'
                        ]);
                    }]
                }
            })
            .state('procedureLogs',{
                parent: 'manufacturing',
                url: '/procedureLogs',
                templateUrl: 'app/agri/manufacturing/procedureLog/procedureLog.home.html',
                controller: 'ProcedureLogController',
                controllerAs: 'vm',
                params: {
                    seasonId : null
                },
                data: {
                    pageTitle: 'admin.menu.procedureLog',
                    authorities: ['ROLE_SYSTEM_ADMIN', 'ROLE_SYSTEM_USER', 'ROLE_FARM_ADMIN','Procedure_Log_View'], //TODO change role,
                    sideBarMenu: 'inventory'
                },
                resolve: {
                    deps: ['$ocLazyLoad', function($ocLazyLoad) {
                        return $ocLazyLoad.load([
                            'lazy_ionRangeSlider',
                            'lazy_tablesorter',
                            'lazy_KendoUI',
                            'app/agri/manufacturing/procedureLog/procedureLog.home.controller.js'
                        ]);
                    }]
                }
            })
            .state('procedureLogs-create',{
                parent: 'manufacturing',
                url: '/procedureLogs-create',
                templateUrl: 'app/agri/manufacturing/procedureLog/procedureLog.create.html',
                controller: 'ProcedureLogCreateController',
                controllerAs: 'vm',
                data: {
                    pageTitle: 'admin.menu.procedureLog',
                    parentLink: 'procedureLogs',
                    authorities: ['ROLE_SYSTEM_ADMIN', 'ROLE_FARM_ADMIN', 'Procedure_Log_Create'], //TODO change role,
                    sideBarMenu: 'inventory'
                },
                resolve: {
                    deps: ['$ocLazyLoad', function($ocLazyLoad) {
                        return $ocLazyLoad.load([
                            'lazy_parsleyjs',
                            'lazy_ionRangeSlider',
                            'lazy_tablesorter',
                            'lazy_KendoUI',
                            'app/agri/manufacturing/procedureLog/procedureLog.create.controller.js'
                        ]);
                    }]
                }
            })
            .state('procedureLogs-edit',{
                parent: 'manufacturing',
                url: '/procedureLogs/{procedureLogId}/edit',
                templateUrl: 'app/agri/manufacturing/procedureLog/procedureLog.edit.html',
                controller: 'ProcedureLogEditController',
                controllerAs: 'vm',
                data: {
                    pageTitle: 'admin.menu.procedureLog',
                    parentLink: 'procedureLogs',
                    authorities: ['ROLE_SYSTEM_ADMIN', 'ROLE_FARM_ADMIN', 'Procedure_Log_Update'], //TODO change role,
                    sideBarMenu: 'inventory'
                },
                resolve: {
                    deps: ['$ocLazyLoad', function($ocLazyLoad) {
                        return $ocLazyLoad.load([
                            'lazy_parsleyjs',
                            'lazy_KendoUI',
                            'app/agri/manufacturing/procedureLog/procedureLog.edit.controller.js'
                        ]);
                    }]
                }
            })
            .state('procedureLogs-detail',{
                parent: 'manufacturing',
                url: '/procedureLogs/{procedureLogId}/detail',
                templateUrl: 'app/agri/manufacturing/procedureLog/procedureLog.detail.html',
                controller: 'ProcedureLogDetailController',
                controllerAs: 'vm',
                data: {
                    pageTitle: 'admin.menu.procedureLog',
                    parentLink: 'procedureLogs',
                    authorities: ['ROLE_SYSTEM_ADMIN', 'ROLE_FARM_ADMIN', 'Procedure_Log_View'], //TODO change role,
                    sideBarMenu: 'inventory'
                },
                resolve: {
                    deps: ['$ocLazyLoad', function($ocLazyLoad) {
                        return $ocLazyLoad.load([
                            'lazy_ionRangeSlider',
                            'lazy_tablesorter',
                            'lazy_KendoUI',
                            'app/agri/manufacturing/procedureLog/procedureLog.detail.controller.js'
                        ]);
                    }]
                }
            })
            .state('procedures',{
                parent: 'manufacturing',
                url: '/procedures',
                templateUrl: 'app/agri/manufacturing/procedure/procedure.home.html',
                controller: 'ProcedureController',
                controllerAs: 'vm',
                data: {
                    pageTitle: 'admin.menu.stock',
                    authorities: ['ROLE_SYSTEM_ADMIN', 'ROLE_FARM_ADMIN', 'Procedure_View'], //TODO change role,
                    sideBarMenu: 'inventory'
                },
                resolve: {
                    deps: ['$ocLazyLoad', function($ocLazyLoad) {
                        return $ocLazyLoad.load([
                            'lazy_ionRangeSlider',
                            'lazy_tablesorter',
                            'lazy_KendoUI',
                            'app/agri/manufacturing/procedure/procedure.home.controller.js'
                        ]);
                    }]
                }
            })
            .state('procedures-create',{
                parent: 'manufacturing',
                url: '/procedures-create',
                templateUrl: 'app/agri/manufacturing/procedure/procedure.create.html',
                controller: 'ProcedureCreateController',
                controllerAs: 'vm',
                data: {
                    pageTitle: 'admin.menu.stock',
                    authorities: ['ROLE_SYSTEM_ADMIN', 'ROLE_FARM_ADMIN', 'Procedure_View'], //TODO change role,
                    sideBarMenu: 'inventory'
                },
                resolve: {
                    deps: ['$ocLazyLoad', function($ocLazyLoad) {
                        return $ocLazyLoad.load([
                            'lazy_ionRangeSlider',
                            'lazy_tablesorter',
                            'lazy_KendoUI',
                            'app/agri/manufacturing/procedure/procedure.create.controller.js'
                        ]);
                    }]
                }
            })
            .state('procedures-edit',{
                parent: 'manufacturing',
                url: '/procedures/{procedureId}/edit',
                templateUrl: 'app/agri/manufacturing/procedure/procedure.edit.html',
                controller: 'ProcedureCreateController',
                controllerAs: 'vm',
                data: {
                    pageTitle: 'admin.menu.stock',
                    authorities: ['ROLE_SYSTEM_ADMIN', 'ROLE_FARM_ADMIN', 'Procedure_View'], //TODO change role,
                    sideBarMenu: 'inventory'
                },
                resolve: {
                    deps: ['$ocLazyLoad', function($ocLazyLoad) {
                        return $ocLazyLoad.load([
                            'lazy_ionRangeSlider',
                            'lazy_tablesorter',
                            'lazy_KendoUI',
                            'app/agri/manufacturing/procedure/procedure.edit.controller.js'
                        ]);
                    }]
                }
            })
            .state('procedures-detail',{
                parent: 'manufacturing',
                url: '/procedures/{procedureId}/detail',
                templateUrl: 'app/agri/manufacturing/procedure/procedure.detail.html',
                controller: 'ProcedureCreateController',
                controllerAs: 'vm',
                data: {
                    pageTitle: 'admin.menu.stock',
                    authorities: ['ROLE_SYSTEM_ADMIN', 'ROLE_FARM_ADMIN', 'Procedure_View'], //TODO change role,
                    sideBarMenu: 'inventory'
                },
                resolve: {
                    deps: ['$ocLazyLoad', function($ocLazyLoad) {
                        return $ocLazyLoad.load([
                            'lazy_ionRangeSlider',
                            'lazy_tablesorter',
                            'lazy_KendoUI',
                            'app/agri/manufacturing/procedure/procedure.detail.controller.js'
                        ]);
                    }]
                }
            })
            .state('seasons',{
                parent: 'manufacturing',
                url: '/seasons',
                templateUrl: 'app/agri/manufacturing/season/season.home.html',
                controller: 'SeasonController',
                controllerAs: 'vm',
                data: {
                    pageTitle: 'admin.menu.season',
                    authorities: ['ROLE_SYSTEM_ADMIN', 'ROLE_SYSTEM_USER', 'ROLE_FARM_ADMIN', 'Season_View'], //TODO change role,
                    sideBarMenu: 'inventory'
                },
                resolve: {
                    deps: ['$ocLazyLoad', function($ocLazyLoad) {
                        return $ocLazyLoad.load([
                            'lazy_ionRangeSlider',
                            'lazy_tablesorter',
                            'lazy_KendoUI',
                            'app/agri/manufacturing/season/season.home.controller.js'
                        ]);
                    }]
                }
            })
            .state('seasons-create',{
                parent: 'manufacturing',
                url: '/seasons-create',
                templateUrl: 'app/agri/manufacturing/season/season.create.html',
                controller: 'SeasonCreateController',
                controllerAs: 'vm',
                data: {
                    pageTitle: 'admin.menu.season',
                    parentLink: 'seasons',
                    authorities: ['ROLE_SYSTEM_ADMIN', 'ROLE_FARM_ADMIN', 'Season_Create'], //TODO change role,
                    sideBarMenu: 'inventory'
                },
                resolve: {
                    deps: ['$ocLazyLoad', function($ocLazyLoad) {
                        return $ocLazyLoad.load([
                            'lazy_parsleyjs',
                            'lazy_ionRangeSlider',
                            'lazy_tablesorter',
                            'lazy_KendoUI',
                            'app/agri/manufacturing/season/season.create.controller.js'
                        ]);
                    }]
                }
            })
            .state('seasons-edit',{
                parent: 'manufacturing',
                url: '/seasons/{seasonId}/edit',
                templateUrl: 'app/agri/manufacturing/season/season.edit.html',
                controller: 'SeasonEditController',
                controllerAs: 'vm',
                data: {
                    pageTitle: 'admin.menu.season',
                    parentLink: 'seasons',
                    authorities: ['ROLE_SYSTEM_ADMIN', 'ROLE_FARM_ADMIN', 'Season_Update'], //TODO change role,
                    sideBarMenu: 'inventory'
                },
                resolve: {
                    deps: ['$ocLazyLoad', function($ocLazyLoad) {
                        return $ocLazyLoad.load([
                            'lazy_parsleyjs',
                            'lazy_ionRangeSlider',
                            'lazy_tablesorter',
                            'lazy_KendoUI',
                            'app/agri/manufacturing/season/season.edit.controller.js'
                        ]);
                    }]
                }
            })
            .state('seasons-detail',{
                parent: 'manufacturing',
                url: '/seasons/{seasonId}/detail',
                templateUrl: 'app/agri/manufacturing/season/season.detail.html',
                controller: 'SeasonDetailController',
                controllerAs: 'vm',
                data: {
                    pageTitle: 'admin.menu.season',
                    parentLink: 'seasons',
                    authorities: ['ROLE_SYSTEM_ADMIN', 'ROLE_FARM_ADMIN', 'Season_View'], //TODO change role,
                    sideBarMenu: 'inventory'
                },
                resolve: {
                    deps: ['$ocLazyLoad', function($ocLazyLoad) {
                        return $ocLazyLoad.load([
                            'lazy_ionRangeSlider',
                            'lazy_tablesorter',
                            'lazy_KendoUI',
                            'lazy_parsleyjs',
                            'app/agri/manufacturing/season/season.detail.controller.js'
                        ]);
                    }]
                }
            })
    }
})();