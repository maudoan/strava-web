(function(){
    'use strict';
    angular.module('erpApp')
        .config(stateConfig);
    stateConfig.$inject = ['$stateProvider']

    function stateConfig($stateProvider) {
        $stateProvider
            .state('admin',{
                parent:'restricted',
                template:"<div ui-view></div>",
                abstract: true,
                resolve: {
                    translatePartialLoader: ['$translate', '$translatePartialLoader', function ($translate, $translatePartialLoader) {
                        $translatePartialLoader.addPart('admin');
                        $translatePartialLoader.addPart('errors');
                        $translatePartialLoader.addPart('success');
                        $translatePartialLoader.addPart('global');
                        $translatePartialLoader.addPart('inventory');
                        return $translate.refresh();
                    }]
                }
            })
            .state('users',{
                parent: 'admin',
                url: '/users',
                templateUrl: 'app/admin/user.home.html',
                controller: 'UserHomeController',
                controllerAs: 'vm',
                data: {
                    pageTitle: 'admin.user.list',
                    authorities: ['ROLE_SYSTEM_ADMIN','ROLE_SYSTEM_USER','ROLE_FARM_ADMIN', 'User_View'], //TODO change role,
                    sideBarMenu: 'inventory'
                },
                params: {
                    organizationId: null,
                    organizationName: null
                },
                resolve: {
                    deps: ['$ocLazyLoad', function($ocLazyLoad) {
                        return $ocLazyLoad.load([
                            'lazy_ionRangeSlider',
                            'lazy_tablesorter',
                            'lazy_iCheck',
                            'lazy_parsleyjs',
                            'lazy_KendoUI',
                            'app/admin/user.home.controller.js'
                        ]);
                    }]
                }
            })
            .state('users-create',{
                url:'/users/create',
                templateUrl:'app/admin/user.create.html',
                parent:'admin',
                data: {
                    pageTitle: 'admin.user.create',
                    parentLink: 'users',
                    authorities:['ROLE_SYSTEM_ADMIN','ROLE_SYSTEM_USER','ROLE_FARM_ADMIN', 'User_Create'],
                    sideBarMenu: 'inventory'
                },
                controller: 'UserCreateController',
                resolve: {
                    deps: ['$ocLazyLoad', function($ocLazyLoad) {
                        return $ocLazyLoad.load([
                            'lazy_parsleyjs',
                            'assets/js/custom/uikit_fileinput.min.js',
                            'app/admin/user.create.controller.js'
                        ]);
                    }]
                }

            })
            .state('users-detail',{
                url:'/users/{userId:[0-9]{1,9}}/detail',
                templateUrl:'app/admin/user.detail.html',
                parent:'admin',
                data: {
                    pageTitle: 'admin.user.detail',
                    parentLink: 'users',
                    authorities:['ROLE_SYSTEM_ADMIN','ROLE_SYSTEM_USER','ROLE_FARM_ADMIN', 'User_View_Detail'],
                    sideBarMenu: 'inventory'
                },
                controller: 'UserDetailController',
                resolve: {
                    deps: ['$ocLazyLoad', function($ocLazyLoad) {
                        return $ocLazyLoad.load([
                            'lazy_parsleyjs',
                            'app/admin/user.detail.controller.js'
                        ]);
                    }]
                }

            })
            .state('users-edit',{
                url:'/users/{userId:[0-9]{1,9}}/edit',
                templateUrl:'app/admin/user.edit.html',
                parent:'admin',
                data: {
                    pageTitle: 'admin.user.edit',
                    parentLink: 'users',
                    authorities:['ROLE_SYSTEM_ADMIN','ROLE_SYSTEM_USER', 'User_Update'],
                    sideBarMenu: 'inventory'
                },
                controller: 'UserEditController',
                resolve: {
                    deps: ['$ocLazyLoad', function($ocLazyLoad) {
                        return $ocLazyLoad.load([
                            'lazy_parsleyjs',
                            'app/admin/user.edit.controller.js',
                            'assets/js/custom/uikit_fileinput.min.js'
                        ]);
                    }]
                }

            })
            .state('privileges',{
                parent: 'admin',
                url: '/privileges',
                templateUrl: 'app/admin/privilege.home.html',
                controller: 'PrivilegeHomeController',
                controllerAs: 'vm',
                data: {
                    pageTitle: 'admin.privilege.list',
                    authorities: ['ROLE_SYSTEM_ADMIN','ROLE_SYSTEM_USER','ROLE_FARM_ADMIN', 'Privilege_View'], //TODO change role,
                    sideBarMenu: 'inventory'
                },
                resolve: {
                    deps: ['$ocLazyLoad', function($ocLazyLoad) {
                        return $ocLazyLoad.load([
                            'lazy_ionRangeSlider',
                            'lazy_tablesorter',
                            'lazy_parsleyjs',
                            'lazy_KendoUI',
                            'app/admin/privilege.home.controller.js'
                        ]);
                    }]
                }
            })
            // .state('privileges-create',{
            //     url:'/privileges/create',
            //     templateUrl:'app/admin/privilege.create.html',
            //     parent:'admin',
            //     data: {
            //         pageTitle: 'admin.privilege.create',
            //         authorities:['ROLE_SYSTEM_ADMIN','ROLE_SYSTEM_USER','ROLE_FARM_ADMIN', 'priv_base_Privilege_create'],
            //         sideBarMenu: 'admin'
            //     },
            //     controller: 'PrivilegeCreateController',
            //     resolve: {
            //         deps: ['$ocLazyLoad', function($ocLazyLoad) {
            //             return $ocLazyLoad.load([
            //                 'lazy_parsleyjs',
            //                 'app/admin/privilege.create.controller.js'
            //             ]);
            //         }]
            //     }
            //
            // })
            .state('privileges-detail',{
                url:'/privileges/{privilegeName}/detail',
                templateUrl:'app/admin/privilege.detail.html',
                parent:'admin',
                data: {
                    pageTitle: 'admin.privilege.detail',
                    authorities:['ROLE_SYSTEM_ADMIN','ROLE_SYSTEM_USER', 'Privilege_View_Detail'],
                    sideBarMenu: 'inventory'
                },
                controller: 'PrivilegeDetailController',
                resolve: {
                    deps: ['$ocLazyLoad', function($ocLazyLoad) {
                        return $ocLazyLoad.load([
                            'lazy_parsleyjs',
                            'app/admin/privilege.detail.controller.js'
                        ]);
                    }]
                }

            })
            // .state('privileges-edit',{
            //     url:'/privileges/{privilegeName}/edit',
            //     templateUrl:'app/admin/privilege.edit.html',
            //     parent:'admin',
            //     data: {
            //         pageTitle: 'admin.privilege.edit',
            //         authorities:['ROLE_SYSTEM_ADMIN','ROLE_SYSTEM_USER','ROLE_FARM_ADMIN', 'priv_base_Privilege_update', 'priv_base_Privilege_delete'],
            //         sideBarMenu: 'admin'
            //     },
            //     controller: 'PrivilegeEditController',
            //     resolve: {
            //         deps: ['$ocLazyLoad', function($ocLazyLoad) {
            //             return $ocLazyLoad.load([
            //                 'lazy_parsleyjs',
            //                 'app/admin/privilege.edit.controller.js'
            //             ]);
            //         }]
            //     }
            //
            // })
            .state('roles',{
                parent: 'admin',
                url: '/roles',
                templateUrl: 'app/admin/role.home.html',
                controller: 'RoleHomeController',
                controllerAs: 'vm',
                data: {
                    pageTitle: 'admin.menu.roles',
                    authorities: ['ROLE_SYSTEM_ADMIN','ROLE_SYSTEM_USER','ROLE_FARM_ADMIN', 'Role_View'], //TODO change role,
                    sideBarMenu: 'inventory'
                },
                resolve: {
                    deps: ['$ocLazyLoad', function($ocLazyLoad) {
                        return $ocLazyLoad.load([
                            'lazy_ionRangeSlider',
                            'lazy_tablesorter',
                            'lazy_parsleyjs',
                            'lazy_KendoUI',
                            'app/admin/role.home.controller.js'
                        ]);
                    }]
                }
            })
            .state('roles-create',{
                url:'/roles/create',
                templateUrl:'app/admin/role.create.html',
                parent:'admin',
                data: {
                    pageTitle: 'admin.menu.roles',
                    parentLink: 'roles',
                    authorities:['ROLE_SYSTEM_ADMIN','ROLE_SYSTEM_USER','ROLE_FARM_ADMIN', 'Role_Create'],
                    sideBarMenu: 'inventory'
                },
                controller: 'RoleCreateController',
                resolve: {
                    deps: ['$ocLazyLoad', function($ocLazyLoad) {
                        return $ocLazyLoad.load([
                            'lazy_parsleyjs',
                            'lazy_tree',
                            'app/admin/role.create.controller.js'
                        ]);
                    }]
                }

            })
            .state('roles-detail',{
                url:'/roles/{roleId:[0-9]{1,9}}/detail',
                templateUrl:'app/admin/role.detail.html',
                parent:'admin',
                data: {
                    pageTitle: 'admin.menu.roles',
                    parentLink: 'roles',
                    authorities:['ROLE_SYSTEM_ADMIN','ROLE_SYSTEM_USER', 'Role_View_Detail'],
                    sideBarMenu: 'inventory'
                },
                controller: 'RoleDetailController',
                resolve: {
                    deps: ['$ocLazyLoad', function($ocLazyLoad) {
                        return $ocLazyLoad.load([
                            'lazy_parsleyjs',
                            'lazy_tree',
                            'app/admin/role.detail.controller.js'
                        ]);
                    }]
                }

            })
            .state('roles-edit',{
                url:'/roles/{roleId:[0-9]{1,9}}/edit',
                templateUrl:'app/admin/role.edit.html',
                parent:'admin',
                data: {
                    pageTitle: 'admin.menu.roles',
                    parentLink: 'roles',
                    authorities:['ROLE_SYSTEM_ADMIN','ROLE_SYSTEM_USER', 'Role_Update'],
                    sideBarMenu: 'inventory'
                },
                controller: 'RoleEditController',
                resolve: {
                    deps: ['$ocLazyLoad', function($ocLazyLoad) {
                        return $ocLazyLoad.load([
                            'lazy_parsleyjs',
                            'lazy_tree',
                            'app/admin/role.edit.controller.js'
                        ]);
                    }]
                }

            })
            .state('user-profile',{
                url:'/user-profile',
                templateUrl:'app/admin/user.profileHome.html',
                parent:'admin',
                data: {
                    pageTitle: 'admin.user.detail',
                    //authorities:['ROLE_SYSTEM_ADMIN','ROLE_SYSTEM_USER','ROLE_FARM_ADMIN','ROLE_USER'],
                    sideBarMenu: 'inventory'
                },
                controller: 'UserProfileCtrl',
                resolve: {
                    deps: ['$ocLazyLoad', function($ocLazyLoad) {
                        return $ocLazyLoad.load([
                            'lazy_parsleyjs',
                            'app/admin/user.profileController.js'
                        ]);
                    }]
                }

            })
            .state('user-edit',{
                url:'/user-edit',
                templateUrl:'app/admin/user.editProfile.html',
                parent:'admin',
                data: {
                    pageTitle: 'admin.user.detail',
                    //authorities:['ROLE_SYSTEM_ADMIN','ROLE_SYSTEM_USER','ROLE_FARM_ADMIN','ROLE_USER'],
                    sideBarMenu: 'inventory'
                },
                controller: 'UserProfileEditController',
                resolve: {
                    deps: ['$ocLazyLoad', function($ocLazyLoad) {
                        return $ocLazyLoad.load([
                            'lazy_parsleyjs',
                            'app/admin/user.editProfile.controller.js'
                        ]);
                    }]
                }

            })
            // .state('home',{
            //     parent: 'admin',
            //     url: '/',
            //     templateUrl: 'app/home/manager/customer/customer.home.html',
            //     controller: 'CustomerHomeController',
            //     controllerAs: 'vm',
            //     data: {
            //         pageTitle: 'admin.menu.customer',
            //         authorities: ['ROLE_SYSTEM_ADMIN', 'ROLE_SYSTEM_USER', 'User_View'], //TODO change role,
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
            //                 'app/home/manager/customer/customer.home.controller.js'
            //             ]);
            //         }]
            //     }
            // })
            .state('dashboard',{
                parent: 'admin',
                url: '/',
                templateUrl: 'app/home/dashboard/dashboard.html',
                controller: 'DashboardController',
                controllerAs: 'vm',
                data: {
                    pageTitle: 'admin.menu.customer',
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
                            'app/home/dashboard/dashboard.controller.js'
                        ]);
                    }]
                }
            })
            .state('administration',{
                parent: 'admin',
                url: '/administration',
                templateUrl: 'app/dashboard/administration.html',
                controller: 'AdministrationController',
                controllerAs: 'vm',
                data: {
                    pageTitle: 'admin.menu.administration',
                    authorities: ['ROLE_SYSTEM_ADMIN','ROLE_SYSTEM_USER','ROLE_FARM_ADMIN', 'ROLE_USER'], //TODO change role,
                    sideBarMenu: 'inventory'
                },
                resolve: {
                    deps: ['$ocLazyLoad', function($ocLazyLoad) {
                        return $ocLazyLoad.load([
                            'app/dashboard/administration.controller.js'
                        ]);
                    }]
                }
            })
            .state('organizations',{
                parent: 'admin',
                url: '/organizations',
                templateUrl: 'app/admin/organization/organization.home.html',
                controller: 'OrganizationHomeController',
                controllerAs: 'vm',
                data: {
                    pageTitle: 'admin.menu.organizations',
                    authorities: ['ROLE_SYSTEM_ADMIN','ROLE_SYSTEM_USER','ROLE_FARM_ADMIN', 'Organization_View'], //TODO change role,
                    sideBarMenu: 'inventory'
                },
                resolve: {
                    deps: ['$ocLazyLoad', function($ocLazyLoad) {
                        return $ocLazyLoad.load([
                            // 'lazy_ionRangeSlider',
                            // 'lazy_tablesorter',
                            // 'lazy_parsleyjs',
                            'lazy_KendoUI',
                            'app/admin/organization/organization.home.controller.js'
                        ]);
                    }]
                }
            })
            .state('organizations-detail',{
                parent: 'admin',
                url: '/organization/{organizationId}/detail',
                templateUrl: 'app/admin/organization/organization.detail.html',
                controller: 'OrganizationDetailController',
                controllerAs: 'vm',
                data: {
                    pageTitle: 'admin.organization.title',
                    authorities: ['ROLE_SYSTEM_ADMIN','ROLE_SYSTEM_USER','ROLE_FARM_ADMIN', 'Organization_View'], //TODO change role,
                    sideBarMenu: 'inventory'
                },
                resolve: {
                    deps: ['$ocLazyLoad', function($ocLazyLoad) {
                        return $ocLazyLoad.load([
                            // 'lazy_ionRangeSlider',
                            // 'lazy_tablesorter',
                            // 'lazy_parsleyjs',
                            // 'lazy_KendoUI',
                            'app/admin/organization/organization.detail.controller.js'
                        ]);
                    }]
                }
            })
            .state('organizations-edit',{
                parent: 'admin',
                url: '/organization/{organizationId}/edit',
                templateUrl: 'app/admin/organization/organization.edit.html',
                controller: 'OrganizationEditController',
                controllerAs: 'vm',
                data: {
                    pageTitle: 'admin.organization.title',
                    authorities: ['ROLE_SYSTEM_ADMIN','ROLE_SYSTEM_USER','ROLE_FARM_ADMIN', 'Organization_Update','Organization_Delete'], //TODO change role,
                    sideBarMenu: 'inventory'
                },
                resolve: {
                    deps: ['$ocLazyLoad', function($ocLazyLoad) {
                        return $ocLazyLoad.load([
                            'lazy_parsleyjs',
                            // 'lazy_ionRangeSlider',
                            'app/admin/organization/organization.edit.controller.js'
                        ]);
                    }]
                }
            })
            .state('organizations-create',{
                parent: 'admin',
                url: '/organization/create',
                templateUrl: 'app/admin/organization/organization.create.html',
                controller: 'OrganizationCreateController',
                controllerAs: 'vm',
                data: {
                    pageTitle: 'admin.organization.title',
                    authorities: ['ROLE_SYSTEM_ADMIN','ROLE_SYSTEM_USER','ROLE_FARM_ADMIN', 'Organization_Create'], //TODO change role,
                    sideBarMenu: 'inventory'
                },
                resolve: {
                    deps: ['$ocLazyLoad', function($ocLazyLoad) {
                        return $ocLazyLoad.load([
                            'lazy_parsleyjs',
                            'app/admin/organization/organization.create.controller.js'
                        ]);
                    }]
                }
            })
            .state('nodes',{
                parent: 'admin',
                url: '/nodes',
                templateUrl: 'app/admin/node.html',
                controller: 'NodeController',
                controllerAs: 'vm',
                data: {
                    pageTitle: 'admin.menu.node',
                    authorities: ['ROLE_SYSTEM_ADMIN','ROLE_SYSTEM_USER','ROLE_FARM_ADMIN'], //TODO change role,
                    sideBarMenu: 'inventory'
                },
                resolve: {
                    deps: ['$ocLazyLoad', function($ocLazyLoad) {
                        return $ocLazyLoad.load([
                            // 'lazy_ionRangeSlider',
                            // 'lazy_tablesorter',
                            'lazy_parsleyjs',
                            'lazy_KendoUI',
                            'app/admin/node.controller.js'
                        ]);
                    }]
                }
            })
            .state('diagram',{
                parent: 'admin',
                url: '/diagram/{areaId}',
                templateUrl: 'app/home/dashboard/diagram.html',
                controller: 'DiagramController',
                controllerAs: 'vm',
                params: {
                    type: null
                },
                data: {
                    pageTitle: 'admin.menu.dashboard',
                    authorities: ['ROLE_SYSTEM_ADMIN','ROLE_SYSTEM_USER','ROLE_FARM_ADMIN', 'ROLE_USER', 'Home_Page_View'], //TODO change role,
                    sideBarMenu: 'inventory'
                },
                resolve: {
                    deps: ['$ocLazyLoad', function($ocLazyLoad) {
                        return $ocLazyLoad.load([
                            'lazy_ionRangeSlider',
                            'lazy_tablesorter',
                            'lazy_iCheck',
                            'lazy_tree',
                            'lazy_parsleyjs',
                            'lazy_KendoUI',
                            'app/home/dashboard/diagram.controller.js'
                        ]);
                    }]
                }
            })
            .state('areas',{
                parent: 'admin',
                url: '/areas',
                templateUrl: 'app/admin/areas.html',
                controller: 'AreaController',
                controllerAs: 'vm',
                data: {
                    pageTitle: 'Khu vực',
                    authorities: ['ROLE_SYSTEM_ADMIN','Area_View'], //TODO change role,
                    sideBarMenu: 'inventory'
                },
                params: {
                    organizationId: null,
                    organizationName: null
                },
                resolve: {
                    deps: ['$ocLazyLoad', function($ocLazyLoad) {
                        return $ocLazyLoad.load([
                            'lazy_ionRangeSlider',
                            'lazy_tablesorter',
                            'lazy_parsleyjs',
                            'lazy_KendoUI',
                            'lazy_tree',
                            'app/admin/areas.controller.js'
                        ]);
                    }]
                }
            })
            .state('areas-create',{
                url:'/areas/create',
                templateUrl:'app/admin/area.create.html',
                parent:'admin',
                params: {
                  'areaParentId': null
                },
                data: {
                    pageTitle: 'admin.menu.area',
                    parentLink: 'areas',
                    authorities:['ROLE_SYSTEM_ADMIN', 'Area_Create'],
                    sideBarMenu: 'inventory'
                },
                controller: 'AreaCreateController',
                resolve: {
                    deps: ['$ocLazyLoad', function($ocLazyLoad) {
                        return $ocLazyLoad.load([
                            'lazy_parsleyjs',
                            'assets/js/custom/uikit_fileinput.min.js',
                            'app/admin/area.create.controller.js'
                        ]);
                    }]
                }

            })
            .state('areas-detail',{
                url: '/areas/{areaId}/detail',
                templateUrl:'app/admin/area.detail.html',
                parent:'admin',
                data: {
                    pageTitle: 'admin.menu.area',
                    parentLink: 'areas',
                    authorities:['ROLE_SYSTEM_ADMIN', 'Area_View_Detail'],
                    sideBarMenu: 'inventory'
                },
                controller: 'AreaDetailController',
                resolve: {
                    deps: ['$ocLazyLoad', function($ocLazyLoad) {
                        return $ocLazyLoad.load([
                            'lazy_parsleyjs',
                            'assets/js/custom/uikit_fileinput.min.js',
                            'app/admin/area.detail.controller.js'
                        ]);
                    }]
                }

            })
            .state('areas-edit',{
                url: '/areas/{areaId}/edit',
                templateUrl:'app/admin/area.edit.html',
                parent:'admin',
                data: {
                    pageTitle: 'admin.menu.area',
                    parentLink: 'areas',
                    authorities:['ROLE_SYSTEM_ADMIN', 'Area_Update'],
                    sideBarMenu: 'inventory'
                },
                controller: 'AreaEditController',
                resolve: {
                    deps: ['$ocLazyLoad', function($ocLazyLoad) {
                        return $ocLazyLoad.load([
                            'lazy_parsleyjs',
                            'assets/js/custom/uikit_fileinput.min.js',
                            'app/admin/area.edit.controller.js'
                        ]);
                    }]
                }

            })
    }
})();