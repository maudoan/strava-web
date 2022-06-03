/*
*  erp Admin AngularJS
*/
;"use strict";

var erpApp = angular.module('erpApp', [
    'ui.router',
    'ngStorage',
    'ngResource',
    'ngCookies',
    'ngFileUpload',
    'oc.lazyLoad',
    'ngSanitize',
    'ngRetina',
    'ncy-angular-breadcrumb',
    'ConsoleLogger',
    'tmh.dynamicLocale',
    'pascalprecht.translate',
    'angular-input-stars',
    'ui.sortable',
    'growlNotifications',
    'Dragtable'
]);

erpApp.constant('variables', {
    header_main_height: 48,
    easing_swiftOut: [ 0.4,0,0.2,1 ],
    bez_easing_swiftOut: $.bez([ 0.4,0,0.2,1 ])
});

/* detect IE */
function detectIE(){var a=window.navigator.userAgent,b=a.indexOf("MSIE ");if(0<b)return parseInt(a.substring(b+5,a.indexOf(".",b)),10);if(0<a.indexOf("Trident/"))return b=a.indexOf("rv:"),parseInt(a.substring(b+3,a.indexOf(".",b)),10);b=a.indexOf("Edge/");return 0<b?parseInt(a.substring(b+5,a.indexOf(".",b)),10):!1};

/* Run Block */
erpApp
    .run([
        '$rootScope',
        '$state',
        '$stateParams',
        '$http',
        '$window',
        '$timeout',
        'variables',
        'User',
        function ($rootScope, $state, $stateParams,$http,$window, $timeout,variables, User) {

            $rootScope.$state = $state;
            $rootScope.$stateParams = $stateParams;
            $rootScope.currentUser = null;

            $rootScope.$on('$stateChangeSuccess', function () {

                // scroll view to top
                $("html, body").animate({
                    scrollTop: 0
                }, 200);

                if(detectIE()) {
                    $('svg,canvas,video').each(function () {
                        $(this).css('height', 0);
                    });
                };

                $timeout(function() {
                    $rootScope.pageLoading = false;
                },300);

                $timeout(function() {
                    $rootScope.pageLoaded = true;
                    $rootScope.appInitialized = true;
                    // wave effects
                    $window.Waves.attach('.md-btn-wave,.md-fab-wave', ['waves-button']);
                    $window.Waves.attach('.md-btn-wave-light,.md-fab-wave-light', ['waves-button', 'waves-light']);
                    if(detectIE()) {
                        $('svg,canvas,video').each(function() {
                            var $this = $(this),
                                height = $(this).attr('height'),
                                width = $(this).attr('width');

                            if(height) {
                                $this.css('height', height);
                            }
                            if(width) {
                                $this.css('width', width);
                            }
                            var peity = $this.prev('.peity_data,.peity');
                            if(peity.length) {
                                peity.peity().change()
                            }
                        });
                    }
                },600);

            });

            $rootScope.$on('$stateChangeStart', function (event, toState, toParams, fromState, fromParams) {
                // main search
                $rootScope.mainSearchActive = false;
                // secondary sidebar
                $rootScope.sidebar_secondary = false;
                $rootScope.secondarySidebarHiddenLarge = false;

                if($($window).width() < 1220 ) {
                    // hide primary sidebar
                    $rootScope.primarySidebarActive = false;
                    $rootScope.hide_content_sidebar = false;
                }
                if(!toParams.hasOwnProperty('hidePreloader')) {
                    $rootScope.pageLoading = true;
                    $rootScope.pageLoaded = false;
                }
            });

            // fastclick (eliminate the 300ms delay between a physical tap and the firing of a click event on mobile browsers)
            FastClick.attach(document.body);


            // modernizr
            $rootScope.Modernizr = Modernizr;

            // get window width
            var w = angular.element($window);
            $rootScope.largeScreen = w.width() >= 1220;

            w.on('resize', function() {
                return $rootScope.largeScreen = w.width() >= 1220;
            });

            // show/hide main menu on page load
            $rootScope.primarySidebarOpen = $rootScope.largeScreen;

            $rootScope.pageLoading = true;

            // define language datepicker
            $rootScope.timeLanguage = {
                months: ['Tháng 1', 'Tháng 2', 'Tháng 3', 'Tháng 4', 'Tháng 5', 'Tháng 6', 'Tháng 7', 'Tháng 8', 'Tháng 9', 'Tháng 10', 'Tháng 11', 'Tháng 12'],
                weekdays: ['CN', 'Thứ 2', 'Thứ 3', 'Thứ 4', 'Thứ 5', 'Thứ 6', 'Thứ 7']
            };

            // wave effects
            $window.Waves.init();
        }
    ])
    .run(['PrintToConsole', function(PrintToConsole) {
        PrintToConsole.active = false;
    }])
    .run(['stateHandler',function(stateHandler) {
        stateHandler.initialize();
    }])
;
