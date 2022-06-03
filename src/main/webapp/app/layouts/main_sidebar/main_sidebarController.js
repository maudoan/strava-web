angular
    .module('erpApp')
    .controller('main_sidebarCtrl', [
        '$timeout',
        '$scope',
        '$rootScope',
        '$translate','$state', 'JhiLanguageService', 'tmhDynamicLocale','$window',
        function ($timeout,$scope,$rootScope,$translate,$state, JhiLanguageService, tmhDynamicLocale,$window) {
            $scope.$on('onLastRepeat', function (scope, element, attrs) {
                $timeout(function() {
                    if(!$rootScope.miniSidebarActive) {
                        // $('#sidebar_main').find('.current_section > a').trigger('click');
                        // activate current section
                        var sideBar = $('#sidebar_main');
                        var currentSection = sideBar.find('.current_section > a');
                        if(currentSection.length === 0){
                            currentSection = sideBar.find('li.act_item').closest('li.submenu_trigger').find("> a");
                            currentSection.parent().addClass('current_section');
                        }
                        currentSection.trigger('click');
                    } else {
                        // add tooltips to mini sidebar
                        var tooltip_elem = $('#sidebar_main').find('.menu_tooltip');
                        tooltip_elem.each(function() {
                            var $this = $(this);

                            $this.attr('title',$this.find('.menu_title').text());
                            UIkit.tooltip($this, {
                                pos: 'right'
                            });
                        });
                    }
                })
            });

            // language switcher
            if($window.localStorage.getItem("lang") !=null){
                $scope.langSwitcherModel = $window.localStorage.getItem("lang")
            } else {
                $scope.langSwitcherModel = 'gb';
                // $window.localStorage.setItem("lang", "vi");
            }
            $scope.langSwitcherOptions = [
                {id: 2, title: 'Tiếng Việt', value: 'vn'},
                {id: 1, title: 'English', value: 'gb'}
            ];

            $scope.langSwitcherConfig = {
                maxItems: 1,
                render: {
                    option: function(langData, escape) {
                        return  '<div class="option">' +
                            '<i class="item-icon flag-' + escape(langData.value).toUpperCase() + '"></i>' +
                            '<span>' + escape(langData.title) + '</span>' +
                            '</div>';
                    },
                    item: function(langData, escape) {
                        return '<div class="item"><i class="item-icon flag-' + escape(langData.value).toUpperCase() + '"></i></div>';
                    }
                },
                valueField: 'value',
                labelField: 'title',
                searchField: 'title',
                create: false,
                onInitialize: function(selectize) {
                    $('#lang_switcher').next().children('.selectize-input').find('input').attr('readonly',true);
                },
                onChange: function(value) {
                    var langKey = value==='gb' ? 'en' : (value==='vn'? 'vi' : 'en');
                    $translate.use(langKey);
                    tmhDynamicLocale.set(langKey);
                    $window.localStorage.setItem("lang", value);
                }
            };
            $scope.$watch('langSwitcherModel', function() {
                var value = $scope.langSwitcherModel;
                var langKey = value==='gb' ? 'en' : (value==='vn'? 'vi' : 'en');
                $translate.use(langKey);
                tmhDynamicLocale.set(langKey);
            });

            // menu entries
            var menu = {
                'inventory': [
                    // {
                    //     id: 0,
                    //     title: 'admin.menu.dashboard',
                    //     icon: '&#xE871;',
                    //     link:'dashboard',
                    //     privilege:"ROLE_SYSTEM_ADMIN,ROLE_SYSTEM_USER,ROLE_HOME_ADMIN,Home_Page_View",
                    // },

                    {
                        id: 2,
                        title: 'admin.menu.customerManagement',
                        icon: '&#xE7EF;',
                        link: 'customers',
                        privilege:"ROLE_SYSTEM_ADMIN,ROLE_SYSTEM_USER,ROLE_HOME_ADMIN, Customer_View"
                    },
                    {
                        id: 15,
                        title: 'STC Running',
                        icon: '&#xE7EF;',
                        link: 'list-strava',
                    },
                    {
                        id: 3,
                        title: 'admin.menu.deviceManagement',
                        icon: 'settings_input_component',
                        privilege:"ROLE_SYSTEM_ADMIN,ROLE_SYSTEM_USER,ROLE_HOME_ADMIN,Device_View,Device_Type_View,Device_Model_View, Device_Import, Device_Import_View",
                        submenu:[
                            {
                                id: 4,
                                title: 'admin.menu.device',
                                link:'devices',
                                privilege:"ROLE_SYSTEM_ADMIN,ROLE_SYSTEM_USER,ROLE_HOME_ADMIN, Device_View"
                            },
                            {
                                id: 5,
                                title: 'admin.menu.deviceType',
                                link:'device-types',
                                privilege:"ROLE_SYSTEM_ADMIN,ROLE_SYSTEM_USER,ROLE_HOME_ADMIN, Device_Type_View"
                            },
                            {
                                id: 6,
                                title: 'admin.menu.deviceModel',
                                link:'device-models',
                                privilege:"ROLE_SYSTEM_ADMIN,ROLE_SYSTEM_USER,ROLE_HOME_ADMIN, Device_Model_View"
                            },
                            {
                                id: 7,
                                title: 'admin.menu.deviceImport',
                                link:'device-imports',
                                privilege:"ROLE_SYSTEM_ADMIN,ROLE_SYSTEM_USER, Device_Import, Device_Import_View"
                            },
                        ]
                    },
                    {
                        id: 4,
                        title: 'admin.menu.firmwareManagement',
                        icon: 'backup',
                        privilege:"ROLE_SYSTEM_ADMIN, ROLE_SYSTEM_USER, ROLE_HOME_ADMIN, Firmware_View, Policy_View",
                        submenu:[
                            {
                                id: 1,
                                title: 'admin.menu.fileManagement',
                                link:'firmwares',
                                privilege:"ROLE_SYSTEM_ADMIN, ROLE_SYSTEM_USER, ROLE_HOME_ADMIN, Firmware_View"
                            },
                            {
                                id: 2,
                                title: 'admin.menu.policyManagement',
                                link:'policy',
                                privilege:"ROLE_SYSTEM_ADMIN, ROLE_SYSTEM_USER, ROLE_HOME_ADMIN,Policy_View"
                            }
                        ]
                    },
                    {
                        id: 7,
                        title: 'admin.menu.dataPackageManagement',
                        icon: 'payment',
                        privilege: "ROLE_SYSTEM_ADMIN, ROLE_SYSTEM_USER, ROLE_HOME_ADMIN, Service_Package_View, Data_Package_View",
                        submenu: [
                            {
                                id: 8,
                                title: 'admin.menu.dataPackageTitle',
                                link: 'packages',
                                privilege: "ROLE_SYSTEM_ADMIN,ROLE_SYSTEM_USER,ROLE_HOME_ADMIN, Data_Package_View"
                            }
                        ]
                    },
                    {
                        id: 1,
                        title: 'admin.menu.administration',
                        icon: '&#xE8B8;',
                        privilege:"ROLE_SYSTEM_ADMIN,ROLE_SYSTEM_USER,ROLE_HOME_ADMIN,User_View,Organization_View,Role_View,Privilege_View",
                        submenu:[
                            {
                                title: 'admin.menu.admin',
                                link: 'users',
                                privilege:"ROLE_SYSTEM_ADMIN,ROLE_SYSTEM_USER,ROLE_HOME_ADMIN, User_View"
                            },
                            {
                                title: 'admin.menu.roles',
                                link: 'roles',
                                privilege:"ROLE_SYSTEM_ADMIN,ROLE_SYSTEM_USER,ROLE_HOME_ADMIN, Role_View"
                            },
                            {
                                title: 'admin.menu.privileges',
                                link: 'privileges',
                                privilege:"ROLE_SYSTEM_ADMIN,ROLE_SYSTEM_USER,ROLE_HOME_ADMIN, Privilege_View"
                            },
                            {
                                title: 'Khu vực',
                                link: 'areas',
                                privilege:"ROLE_SYSTEM_ADMIN, Area_View"
                            },
//                            {
//                                title: 'admin.menu.notification',
//                                link: 'notifications',
//                                privilege:"ROLE_SYSTEM_ADMIN,ROLE_SYSTEM_USER,ROLE_HOME_ADMIN, Notification_View"
//                            }
                        ]
                    },
                    {
                        id: 10,
                        title: 'admin.menu.logs',
                        icon: 'assignment',
                        privilege: "ROLE_SYSTEM_ADMIN, ROLE_SYSTEM_USER, ROLE_HOME_ADMIN, Log_View",
                        link: 'logs'
                    },
                    // {
                    //     id: 11,
                    //     title: 'admin.menu.notifications',
                    //     icon: 'notifications',
                    //     privilege: "ROLE_SYSTEM_ADMIN, ROLE_SYSTEM_USER, ROLE_HOME_ADMIN",
                    //     link: 'notifications'
                    // },
                    {
                        id: 12,
                        title: 'admin.menu.report',
                        icon: 'people',
                        privilege: "ROLE_SYSTEM_ADMIN, ROLE_SYSTEM_USER, ROLE_HOME_ADMIN, Device_Report_View, Customer_Report_View",
                        submenu: [
                            {
                                id: 13,
                                title: 'admin.menu.reportDevice',
                                link: 'report-devices',
                                privilege: "ROLE_SYSTEM_ADMIN,ROLE_SYSTEM_USER,ROLE_HOME_ADMIN, Device_Report_View"
                            },
                            {
                                id: 14,
                                title: 'admin.menu.reportCustomer',
                                link: 'report-customers',
                                privilege: "ROLE_SYSTEM_ADMIN,ROLE_SYSTEM_USER,ROLE_HOME_ADMIN, Customer_Report_View"
                            }
                        ]
                    },

                ]
            };

            $scope.sections = menu[$rootScope.toState.data.sideBarMenu];
            $scope.linkActive = $rootScope.toState.data.parentLink;
            $rootScope.$on('$stateChangeSuccess', function () {
                $scope.linkActive = $rootScope.toState.data.parentLink;
                $scope.sections = menu[$rootScope.toState.data.sideBarMenu];

                if($scope.linkActive){
                    $timeout(function () {
                        var sideBar = $('#sidebar_main');
                        sideBar.find('li.act_item').closest('li.act_section').addClass('current_section');
                    })
                }
            });

            // reload page by calling root
            $scope.dirtyTrick = function (link) {
                console.log($state.current.name)
                if($state.current.name === link){
                    $scope.$emit("trick", {
                        link: link
                    });
                }
            }
        }
    ])
;