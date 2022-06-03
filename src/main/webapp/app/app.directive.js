/*
*  erp Admin AngularJS
*  directives
*/
;'use strict';

erpApp
// page title
    .directive('pageTitle', [
        '$rootScope',
        '$timeout',
        function($rootScope, $timeout) {
            return {
                restrict: 'A',
                link: function() {
                    var listener = function(event, toState) {
                        var default_title = 'Strava';
                        $timeout(function() {
                            $rootScope.page_title = (toState.data && toState.data.pageTitle)
                                ? default_title + ' - ' + toState.data.pageTitle : default_title;
                        });
                    };
                    $rootScope.$on('$stateChangeSuccess', listener);
                }
            }
        }
    ])
    // add width/height properities to Image
    .directive('addImageProp', [
        '$timeout',
        'utils',
        function ($timeout,utils) {
            return {
                restrict: 'A',
                link: function (scope, elem, attrs) {
                    elem.on('load', function () {
                        $timeout(function() {
                            var w = !utils.isHighDensity() ? $(elem).actual('width') : $(elem).actual('width')/2,
                                h = !utils.isHighDensity() ? $(elem).actual('height') : $(elem).actual('height')/2;
                            $(elem).attr('width',w).attr('height',h);
                        })
                    });
                }
            };
        }
    ])
    // print page
    .directive('printPage', [
        '$rootScope',
        '$timeout',
        function ($rootScope,$timeout) {
            return {
                restrict: 'A',
                link: function (scope, elem, attrs) {
                    var message = attrs['printMessage'];
                    $(elem).on('click', function(e) {
                        e.preventDefault();
                        UIkit.modal.confirm(message ? message : 'Do you want to print this page?', function () {
                            // hide sidebar
                            $rootScope.primarySidebarActive = false;
                            $rootScope.primarySidebarOpen = false;
                            // wait for dialog to fully hide
                            $timeout(function () {
                                window.print();
                            }, 300)
                        }, {
                            labels: {
                                'Ok': 'print'
                            }
                        });
                    });
                }
            };
        }
    ])
    // full screen
    .directive('fullScreenToggle', [
        function () {
            return {
                restrict: 'A',
                link: function (scope, elem, attrs) {
                    $(elem).on('click', function(e) {
                        e.preventDefault();
                        screenfull.toggle();
                        $(window).resize();
                    });
                }
            };
        }
    ])
    // single card
    .directive('singleCard', [
        '$window',
        '$timeout',
        function ($window,$timeout) {
            return {
                restrict: 'A',
                link: function (scope, elem, attrs) {

                    var $md_card_single = $(elem),
                        w = angular.element($window);

                    function md_card_content_height() {
                        var content_height = w.height() - ((48 * 2) + 12);
                        $md_card_single.find('.md-card-content').innerHeight(content_height);
                    }

                    $timeout(function() {
                        md_card_content_height();
                    },100);

                    w.on('resize', function(e) {
                        // Reset timeout
                        $timeout.cancel(scope.resizingTimer);
                        // Add a timeout to not call the resizing function every pixel
                        scope.resizingTimer = $timeout( function() {
                            md_card_content_height();
                            return scope.$apply();
                        }, 280);
                    });

                }
            }
        }
    ])
    // outside list
    .directive('listOutside', [
        '$window',
        '$timeout',
        function ($window,$timeout) {
            return {
                restrict: 'A',
                link: function (scope, elem, attr) {

                    var $md_list_outside_wrapper = $(elem),
                        w = angular.element($window);

                    function md_list_outside_height() {
                        var content_height = w.height() - ((48 * 2) + 10);
                        $md_list_outside_wrapper.height(content_height);
                    }

                    md_list_outside_height();

                    w.on('resize', function(e) {
                        // Reset timeout
                        $timeout.cancel(scope.resizingTimer);
                        // Add a timeout to not call the resizing function every pixel
                        scope.resizingTimer = $timeout( function() {
                            md_list_outside_height();
                            return scope.$apply();
                        }, 280);
                    });

                }
            }
        }
    ])
    // callback on last element in ng-repeat
    .directive('onLastRepeat', function ($timeout) {
        return function (scope, element, attrs) {
            if (scope.$last) {
                $timeout(function () {
                    scope.$emit('onLastRepeat', element, attrs);
                })
            }
        };
    })
    // check table row
    .directive('tableCheckAll', [
        '$window',
        '$timeout',
        function ($window,$timeout) {
            return {
                restrict: 'A',
                link: function (scope, elem, attr) {

                    var $checkRow = $(elem).closest('table').find('.check_row');

                    $(elem)
                        .on('ifChecked',function() {
                            $checkRow.iCheck('check');
                        })
                        .on('ifUnchecked',function() {
                            $checkRow.iCheck('uncheck');
                        });

                }
            }
        }
    ])
    // table row check
    .directive('tableCheckRow', [
        '$window',
        '$timeout',
        function ($window,$timeout) {
            return {
                restrict: 'A',
                require: 'ngModel',
                link: function (scope, elem, attr, ngModel) {

                    var $this = $(elem);

                    scope.$watch(function () {
                        return ngModel.$modelValue;
                    }, function(newValue) {
                        if(newValue) {
                            $this.closest('tr').addClass('row_checked');
                        } else {
                            $this.closest('tr').removeClass('row_checked');
                        }
                    });

                }
            }
        }
    ])
    // content sidebar
    .directive('contentSidebar', [
        '$rootScope',
        '$document',
        function ($rootScope,$document) {
            return {
                restrict: 'A',
                link: function(scope,el,attr) {

                    if(!$rootScope.header_double_height) {
                        $rootScope.$watch('hide_content_sidebar', function() {
                            if($rootScope.hide_content_sidebar) {
                                $('#page_content').css('max-height', $('html').height() - 40);
                                $('html').css({
                                    'paddingRight': scrollbarWidth(),
                                    'overflow': 'hidden'
                                });
                            } else {
                                $('#page_content').css('max-height','');
                                $('html').css({
                                    'paddingRight': '',
                                    'overflow': ''
                                });
                            }
                        });

                    }
                }
            }
        }
    ])
    // attach events to document
    .directive('documentEvents', [
        '$rootScope',
        '$window',
        '$timeout',
        'variables',
        function ($rootScope, $window, $timeout,variables) {
            return {
                restrict: 'A',
                link: function(scope,el,attr) {

                    var hidePrimarySidebar = function() {
                        $rootScope.primarySidebarActive = false;
                        $rootScope.primarySidebarOpen = false;
                        $rootScope.hide_content_sidebar = false;
                        $rootScope.primarySidebarHiding = true;
                        $timeout(function() {
                            $rootScope.primarySidebarHiding = false;
                        },280);
                    };

                    var hideSecondarySidebar = function() {
                        $rootScope.secondarySidebarActive = false;
                    };

                    var hideMainSearch = function() {
                        var $header_main = $('#header_main');
                        $header_main
                            .children('.header_main_search_form')
                            .velocity("transition.slideUpBigOut", {
                                duration: 280,
                                easing: variables.easing_swiftOut,
                                begin: function() {
                                    $header_main.velocity("reverse");
                                    $rootScope.mainSearchActive = false;
                                },
                                complete: function() {
                                    $header_main
                                        .children('.header_main_content')
                                        .velocity("transition.slideDownBigIn", {
                                            duration: 280,
                                            easing: variables.easing_swiftOut,
                                            complete: function() {
                                                $('.header_main_search_input').blur().val('');
                                            }
                                        })
                                }
                            });
                    };

                    // hide components on $document click
                    scope.onClick = function ($event) {
                        // primary sidebar
                        if( $rootScope.primarySidebarActive && !$($event.target).closest('#sidebar_main').length && !$($event.target).closest('#sSwitch_primary').length && !$rootScope.largeScreen) {
                            hidePrimarySidebar();
                        }
                        // secondary sidebar
                        if( ($rootScope.secondarySidebarActive && !$($event.target).closest('#sidebar_secondary').length && !$($event.target).closest('#sSwitch_secondary').length) && !$rootScope.secondarySidebarPersistent) {
                            hideSecondarySidebar();
                        }
                        // main search form
                        if( $rootScope.mainSearchActive && !$($event.target).closest('.header_main_search_form').length && !$($event.target).closest('#main_search_btn').length) {
                            hideMainSearch();
                        }
                        // style switcher
                        if( $rootScope.styleSwitcherActive && !$($event.target).closest('#style_switcher').length) {
                            $rootScope.styleSwitcherActive = false;
                        }
                        // sticky notes form
                        if( $rootScope.noteFormActive && !$($event.target).closest('#note_form').length) {
                            $rootScope.noteFormActive = false;
                        }
                    };

                    // hide components on key press (esc)
                    scope.onKeyUp = function ($event) {
                        // primary sidebar
                        if( $rootScope.primarySidebarActive && !$rootScope.largeScreen && $event.keyCode == 27) {
                            hidePrimarySidebar();
                        }
                        // secondary sidebar
                        if( !$rootScope.secondarySidebarPersistent && $rootScope.secondarySidebarActive && $event.keyCode == 27) {
                            hideSecondarySidebar();
                        }
                        // main search form
                        if( $rootScope.mainSearchActive && $event.keyCode == 27) {
                            hideMainSearch();
                        }
                        // style switcher
                        if( $rootScope.styleSwitcherActive && $event.keyCode == 27) {
                            $rootScope.styleSwitcherActive = false;
                        }
                        // sticky notes form
                        if( $rootScope.noteFormActive && $event.keyCode == 27) {
                            $rootScope.noteFormActive = false;
                        }
                    };

                }
            };
        }
    ])
    // main search show
    .directive('mainSearchShow', [
        '$rootScope',
        '$window',
        'variables',
        '$timeout',
        function ($rootScope, $window, variables, $timeout) {
            return {
                restrict: 'E',
                template: '<a id="main_search_btn" class="user_action_icon" ng-click="showSearch()"><i class="material-icons md-24 md-light">&#xE8B6;</i></a>',
                replace: true,
                scope: true,
                link: function(scope,el,attr) {
                    scope.showSearch = function() {

                        $('#header_main')
                            .children('.header_main_content')
                            .velocity("transition.slideUpBigOut", {
                                duration: 280,
                                easing: variables.easing_swiftOut,
                                begin: function() {
                                    $rootScope.mainSearchActive = true;
                                },
                                complete: function() {
                                    $('#header_main')
                                        .children('.header_main_search_form')
                                        .velocity("transition.slideDownBigIn", {
                                            duration: 280,
                                            easing: variables.easing_swiftOut,
                                            complete: function() {
                                                $('.header_main_search_input').focus();
                                            }
                                        })
                                }
                            });
                    };
                }
            };
        }
    ])
    // main search hide
    .directive('mainSearchHide', [
        '$rootScope',
        '$window',
        'variables',
        function ($rootScope, $window, variables) {
            return {
                restrict: 'E',
                template: '<i class="md-icon header_main_search_close material-icons" ng-click="hideSearch()">&#xE5CD;</i>',
                replace: true,
                scope: true,
                link: function(scope,el,attr) {
                    scope.hideSearch = function () {

                        var $header_main = $('#header_main');

                        $header_main
                            .children('.header_main_search_form')
                            .velocity("transition.slideUpBigOut", {
                                duration: 280,
                                easing: variables.easing_swiftOut,
                                begin: function() {
                                    $header_main.velocity("reverse");
                                    $rootScope.mainSearchActive = false;
                                },
                                complete: function() {
                                    $header_main
                                        .children('.header_main_content')
                                        .velocity("transition.slideDownBigIn", {
                                            duration: 280,
                                            easing: variables.easing_swiftOut,
                                            complete: function() {
                                                $('.header_main_search_input').blur().val('');
                                            }
                                        })
                                }
                            });

                    };
                }
            };
        }
    ])

    // primary sidebar
    .directive('sidebarPrimary', [
        '$rootScope',
        '$window',
        '$timeout',
        'variables',
        function ($rootScope, $window, $timeout,variables) {
            return {
                restrict: 'A',
                scope: 'true',
                link: function(scope,el,attr) {

                    var $sidebar_main = $('#sidebar_main');

                    scope.submenuToggle = function ($event) {
                        $event.preventDefault();

                        var $this = $($event.currentTarget),
                            slideToogle = $this.next('ul').is(':visible') ? 'slideUp' : 'slideDown';

                        $this.next('ul')
                            .velocity(slideToogle, {
                                duration: 400,
                                easing: variables.easing_swiftOut,
                                begin: function() {
                                    if(slideToogle == 'slideUp') {
                                        $(this).closest('.submenu_trigger').removeClass('act_section')
                                    } else {
                                        if($rootScope.menuAccordionMode) {
                                            $this.closest('li').siblings('.submenu_trigger').each(function() {
                                                $(this).children('ul').velocity('slideUp', {
                                                    duration: 500,
                                                    easing: variables.easing_swiftOut,
                                                    begin: function() {
                                                        $(this).closest('.submenu_trigger').removeClass('act_section')
                                                    }
                                                })
                                            })
                                        }
                                        $(this).closest('.submenu_trigger').addClass('act_section')
                                    }
                                },
                                complete: function() {
                                    if(slideToogle !== 'slideUp') {
                                        var scrollContainer = $sidebar_main.find(".scroll-content").length ? $sidebar_main.find(".scroll-content") :  $sidebar_main.find(".scrollbar-inner");
                                        $this.closest('.act_section').velocity("scroll", {
                                            duration: 500,
                                            easing: variables.easing_swiftOut,
                                            container: scrollContainer
                                        });
                                    }
                                }
                            });
                    };

                    $rootScope.$watch('slimSidebarActive', function ( status ) {
                        if(status) {
                            var $body = $('body');
                            $sidebar_main
                                .mouseenter(function() {
                                    $body.removeClass('sidebar_slim_inactive');
                                    $body.addClass('sidebar_slim_active');
                                })
                                .mouseleave(function() {
                                    $body.addClass('sidebar_slim_inactive');
                                    $body.removeClass('sidebar_slim_active');
                                })
                        }
                    });

                }
            };
        }
    ])
    // toggle primary sidebar
    .directive('sidebarPrimaryToggle', [
        '$rootScope',
        '$window',
        '$timeout',
        function ($rootScope, $window, $timeout) {
            return {
                restrict: 'E',
                replace: true,
                scope: true,
                template: '<a id="sSwitch_primary" href="#" class="sSwitch sSwitch_left" ng-click="togglePrimarySidebar($event)" ng-hide="miniSidebarActive || slimSidebarActive || topMenuActive"><span class="sSwitchIcon"></span></a>',
                link: function (scope, el, attrs) {
                    scope.togglePrimarySidebar = function ($event) {

                        $event.preventDefault();

                        if($rootScope.primarySidebarActive) {
                            $rootScope.primarySidebarHiding = true;
                            if($rootScope.largeScreen) {
                                $timeout(function() {
                                    $rootScope.primarySidebarHiding = false;
                                    $(window).resize();
                                },290);
                            }
                        } else {
                            if($rootScope.largeScreen) {
                                $timeout(function() {
                                    $(window).resize();
                                },290);
                            }
                        }

                        $rootScope.primarySidebarActive = !$rootScope.primarySidebarActive;

                        if( !$rootScope.largeScreen ) {
                            $rootScope.hide_content_sidebar = $rootScope.primarySidebarActive ? true : false;
                        }

                        if($rootScope.primarySidebarOpen) {
                            $rootScope.primarySidebarOpen = false;
                            $rootScope.primarySidebarActive = false;
                        }
                    };

                }
            };
        }
    ])
    // secondary sidebar
    .directive('sidebarSecondary', [
        '$rootScope',
        '$timeout',
        'variables',
        function ($rootScope,$timeout,variables) {
            return {
                restrict: 'A',
                link: function(scope,el,attrs) {
                    $rootScope.sidebar_secondary = true;
                    if(attrs.toggleHidden == 'large') {
                        $rootScope.secondarySidebarHiddenLarge = true;
                    }

                    // chat
                    var $sidebar_secondary = $(el);
                    if($sidebar_secondary.find('.md-list.chat_users').length) {

                        $('.md-list.chat_users').on('click', 'li', function() {
                            $('.md-list.chat_users').velocity("transition.slideRightBigOut", {
                                duration: 280,
                                easing: variables.easing_swiftOut,
                                complete: function() {
                                    $sidebar_secondary
                                        .find('.chat_box_wrapper')
                                        .addClass('chat_box_active')
                                        .velocity("transition.slideRightBigIn", {
                                            duration: 280,
                                            easing: variables.easing_swiftOut,
                                            begin: function() {
                                                $sidebar_secondary.addClass('chat_sidebar')
                                            }
                                        })
                                }
                            });
                        });

                        $sidebar_secondary
                            .find('.chat_sidebar_close')
                            .on('click',function() {
                                $sidebar_secondary
                                    .find('.chat_box_wrapper')
                                    .removeClass('chat_box_active')
                                    .velocity("transition.slideRightBigOut", {
                                        duration: 280,
                                        easing: variables.easing_swiftOut,
                                        complete: function () {
                                            $sidebar_secondary.removeClass('chat_sidebar');
                                            $('.md-list.chat_users').velocity("transition.slideRightBigIn", {
                                                duration: 280,
                                                easing: variables.easing_swiftOut
                                            })
                                        }
                                    })
                            });

                        if($sidebar_secondary.find('.uk-tab').length) {
                            $sidebar_secondary.find('.uk-tab').on('change.uk.tab',function(event, active_item, previous_item) {
                                if($(active_item).hasClass('chat_sidebar_tab') && $sidebar_secondary.find('.chat_box_wrapper').hasClass('chat_box_active')) {
                                    $sidebar_secondary.addClass('chat_sidebar')
                                } else {
                                    $sidebar_secondary.removeClass('chat_sidebar')
                                }
                            })
                        }
                    }

                }
            };
        }
    ])
    // toggle secondary sidebar
    .directive('sidebarSecondaryToggle', [
        '$rootScope',
        '$window',
        '$timeout',
        function ($rootScope, $window, $timeout) {
            return {
                restrict: 'E',
                replace: true,
                template: '<a href="#" id="sSwitch_secondary" class="sSwitch sSwitch_right" ng-show="sidebar_secondary" ng-click="toggleSecondarySidebar($event)"><span class="sSwitchIcon"></span></a>',
                link: function (scope, el, attrs) {
                    scope.toggleSecondarySidebar = function ($event) {
                        $event.preventDefault();
                        $rootScope.secondarySidebarActive = !$rootScope.secondarySidebarActive;
                    };
                }
            };
        }
    ])
    // activate card fullscreen
    .directive('cardFullscreenActivate', [
        '$rootScope',
        'variables',
        function ($rootScope, variables) {
            return {
                restrict: 'E',
                replace: true,
                scope: true,
                template: '<i class="md-icon material-icons md-card-fullscreen-activate" ng-click="cardFullscreenActivate($event)">&#xE5D0;</i>',
                link: function (scope, el, attrs) {
                    scope.cardFullscreenActivate = function ($event) {
                        $event.preventDefault();

                        var $thisCard = $(el).closest('.md-card'),
                            mdCardToolbarFixed = $thisCard.hasClass('toolbar-fixed'),
                            mdCard_h = $thisCard.height(),
                            mdCard_w = $thisCard.width(),
                            body_scroll_top = $('body').scrollTop(),
                            mdCard_offset = $thisCard.offset();

                        // create placeholder for card
                        $thisCard.after('<div class="md-card-placeholder" style="width:'+ mdCard_w+'px;height:'+ mdCard_h+'px;"/>');
                        // add overflow hidden to #page_content (fix for ios)
                        //$body.addClass('md-card-fullscreen-active');
                        // add width/height to card (preserve original size)
                        $thisCard
                            .addClass('md-card-fullscreen')
                            .css({
                                'width': mdCard_w,
                                'height': mdCard_h,
                                'left': mdCard_offset.left,
                                'top': mdCard_offset.top - body_scroll_top
                            })
                            // animate card to top/left position
                            .velocity({
                                left: 0,
                                top: 0
                            },{
                                duration: 400,
                                easing: variables.easing_swiftOut,
                                begin: function(elements) {
                                    $rootScope.card_fullscreen = true;
                                    $rootScope.hide_content_sidebar = true;
                                    // add back button
                                    //$thisCard.find('.md-card-toolbar').prepend('<span class="md-icon md-card-fullscreen-deactivate material-icons uk-float-left">&#xE5C4;</span>');
                                    //erp_page_content.hide_content_sidebar();
                                }
                            })
                            // resize card to full width/height
                            .velocity({
                                height: '100%',
                                width: '100%'
                            },{
                                duration: 400,
                                easing: variables.easing_swiftOut,
                                complete: function(elements) {
                                    // activate onResize callback for some js plugins
                                    //$(window).resize();
                                    // show fullscreen content
                                    $thisCard.find('.md-card-fullscreen-content').velocity("transition.slideUpBigIn", {
                                        duration: 400,
                                        easing: variables.easing_swiftOut,
                                        complete: function(elements) {
                                            // activate onResize callback for some js plugins
                                            $(window).resize();
                                        }
                                    });
                                    if(mdCardToolbarFixed) {
                                        $thisCard.addClass('mdToolbar_fixed')
                                    }
                                }
                            });
                    }
                }
            }
        }
    ])
    // deactivate card fullscreen
    .directive('cardFullscreenDeactivate', [
        '$rootScope',
        '$window',
        'variables',
        function ($rootScope, $window, variables) {
            return {
                restrict: 'E',
                replace: true,
                template: '<span class="md-icon md-card-fullscreen-deactivate material-icons uk-float-left" ng-show="card_fullscreen" ng-click="cardFullscreenDeactivate($event)">&#xE5C4;</span>',
                link: function (scope, el, attrs) {
                    scope.cardFullscreenDeactivate = function ($event) {
                        $event.preventDefault();

                        // get card placeholder width/height and offset
                        var $thisPlaceholderCard = $('.md-card-placeholder'),
                            mdPlaceholderCard_h = $thisPlaceholderCard.height(),
                            mdPlaceholderCard_w = $thisPlaceholderCard.width(),
                            body_scroll_top = $('body').scrollTop(),
                            mdPlaceholderCard_offset_top = $thisPlaceholderCard.offset().top - body_scroll_top,
                            mdPlaceholderCard_offset_left = $thisPlaceholderCard.offset().left,
                            $thisCard = $('.md-card-fullscreen'),
                            mdCardToolbarFixed = $thisCard.hasClass('toolbar-fixed');

                        $thisCard
                        // resize card to original size
                            .velocity({
                                height: mdPlaceholderCard_h,
                                width: mdPlaceholderCard_w
                            },{
                                duration: 400,
                                easing: variables.easing_swiftOut,
                                begin: function(elements) {
                                    // hide fullscreen content
                                    $thisCard.find('.md-card-fullscreen-content').velocity("transition.slideDownOut",{ duration: 280, easing: variables.easing_swiftOut });
                                    $rootScope.card_fullscreen = false;
                                    if(mdCardToolbarFixed) {
                                        $thisCard.removeClass('mdToolbar_fixed')
                                    }
                                },
                                complete: function(elements) {
                                    $rootScope.hide_content_sidebar = false;
                                }
                            })
                            // move card to original position
                            .velocity({
                                left: mdPlaceholderCard_offset_left,
                                top: mdPlaceholderCard_offset_top
                            },{
                                duration: 400,
                                easing: variables.easing_swiftOut,
                                complete: function(elements) {
                                    // remove some styles added by velocity.js
                                    $thisCard.removeClass('md-card-fullscreen').css({
                                        width: '',
                                        height: '',
                                        left: '',
                                        top: ''
                                    });
                                    // remove card placeholder
                                    $thisPlaceholderCard.remove();
                                    $(window).resize();
                                }
                            })

                    }
                }
            }
        }
    ])
    // fullscren on card click
    .directive('cardFullscreenWhole', [
        '$rootScope',
        'variables',
        function ($rootScope, variables) {
            return {
                restrict: 'A',
                replace: true,
                scope: true,
                link: function (scope, el, attrs) {

                    $(el).on('click',function(e) {
                        e.preventDefault();
                        var $this = $(this);
                        if(!$this.hasClass('md-card-fullscreen')) {
                            scope.cardFSActivate();
                        }
                    });

                    $(el).on('click','.cardFSDeactivate',function(e) {
                        e.preventDefault();
                        var $this = $(this);
                        if(!$this.hasClass('md-card-fullscreen')) {
                            scope.cardFSDeactivate();
                        }
                    });

                    scope.cardFSActivate = function () {
                        var $thisCard = $(el),
                            mdCardToolbarFixed = $thisCard.hasClass('toolbar-fixed'),
                            mdCard_h = $thisCard.height(),
                            mdCard_w = $thisCard.width(),
                            body_scroll_top = $('body').scrollTop(),
                            mdCard_offset = $thisCard.offset();

                        // create placeholder for card
                        $thisCard.after('<div class="md-card-placeholder" style="width:'+ mdCard_w+'px;height:'+ mdCard_h+'px;"/>');
                        // add width/height to card (preserve original size)
                        $thisCard
                            .addClass('md-card-fullscreen')
                            .css({
                                'width': mdCard_w,
                                'height': mdCard_h
                            })
                            // animate card to top/left position
                            .velocity({
                                left: 0,
                                top: 0
                            },{
                                duration: 400,
                                easing: variables.easing_swiftOut,
                                begin: function(elements) {
                                    $rootScope.card_fullscreen = true;
                                    $rootScope.hide_content_sidebar = true;
                                    // add back button
                                    $thisCard.append('<span class="md-icon material-icons uk-position-top-right cardFSDeactivate" style="margin:10px 10px 0 0">&#xE5CD;</span>')
                                }
                            })
                            // resize card to full width/height
                            .velocity({
                                height: '100%',
                                width: '100%'
                            }, {
                                duration: 400,
                                easing: variables.easing_swiftOut,
                                complete: function(elements) {
                                    // show fullscreen content
                                    $thisCard.find('.md-card-fullscreen-content').velocity("transition.slideUpBigIn", {
                                        duration: 400,
                                        easing: variables.easing_swiftOut,
                                        complete: function(elements) {
                                            // activate onResize callback for some js plugins
                                            $(window).resize();
                                        }
                                    });
                                    if(mdCardToolbarFixed) {
                                        $thisCard.addClass('mdToolbar_fixed')
                                    }
                                }
                            });
                    };
                    scope.cardFSDeactivate = function () {
                        // get card placeholder width/height and offset
                        var $thisPlaceholderCard = $('.md-card-placeholder'),
                            mdPlaceholderCard_h = $thisPlaceholderCard.height(),
                            mdPlaceholderCard_w = $thisPlaceholderCard.width(),
                            mdPlaceholderCard_offset_top = $thisPlaceholderCard.offset().top,
                            mdPlaceholderCard_offset_left = $thisPlaceholderCard.offset().left,
                            $thisCard = $('.md-card-fullscreen'),
                            mdCardToolbarFixed = $thisCard.hasClass('toolbar-fixed');

                        $thisCard
                        // resize card to original size
                            .velocity({
                                height: mdPlaceholderCard_h,
                                width: mdPlaceholderCard_w
                            },{
                                duration: 400,
                                easing: variables.easing_swiftOut,
                                begin: function(elements) {
                                    // hide fullscreen content
                                    $thisCard.find('.md-card-fullscreen-content').velocity("transition.slideDownOut",{ duration: 280, easing: variables.easing_swiftOut });
                                    $rootScope.card_fullscreen = false;
                                    if(mdCardToolbarFixed) {
                                        $thisCard.removeClass('mdToolbar_fixed')
                                    }
                                    $thisCard.find('.cardFSDeactivate').remove();
                                },
                                complete: function(elements) {
                                    $rootScope.hide_content_sidebar = false;
                                }
                            })
                            // move card to original position
                            .velocity({
                                left: mdPlaceholderCard_offset_left,
                                top: mdPlaceholderCard_offset_top
                            },{
                                duration: 400,
                                easing: variables.easing_swiftOut,
                                complete: function(elements) {
                                    // remove some styles added by velocity.js
                                    $thisCard.removeClass('md-card-fullscreen').css({
                                        width: '',
                                        height: '',
                                        left: '',
                                        top: ''
                                    });
                                    // remove card placeholder
                                    $thisPlaceholderCard.remove();
                                    $(window).resize();
                                }
                            })

                    };
                }
            }
        }
    ])
    // card close
    .directive('cardClose', [
        'utils',
        function (utils) {
            return {
                restrict: 'E',
                replace: true,
                scope: true,
                template: '<i class="md-icon material-icons md-card-close" ng-click="cardClose($event)">&#xE14C;</i>',
                link: function (scope, el, attrs) {
                    scope.cardClose = function ($event) {
                        $event.preventDefault();

                        var $this = $(el),
                            thisCard = $this.closest('.md-card'),
                            removeCard = function() {
                                $(thisCard).remove();
                                $(window).resize();
                            };

                        utils.card_show_hide(thisCard,undefined,removeCard);

                    }
                }
            }
        }
    ])
    // card toggle
    .directive('cardToggle', [
        'variables',
        function (variables) {
            return {
                restrict: 'E',
                replace: true,
                scope: true,
                template: '<i class="md-icon material-icons md-card-toggle" ng-click="cardToggle($event)">&#xE316;</i>',
                link: function (scope, el, attrs) {

                    scope.cardToggle = function ($event) {
                        $event.preventDefault();

                        var $this = $(el),
                            thisCard = $this.closest('.md-card');

                        $(thisCard).toggleClass('md-card-collapsed').children('.md-card-content').slideToggle('280', variables.bez_easing_swiftOut);

                        $this.velocity({
                            scale: 0,
                            opacity: 0.2
                        }, {
                            duration: 280,
                            easing: variables.easing_swiftOut,
                            complete: function() {
                                $(thisCard).hasClass('md-card-collapsed') ? $this.html('&#xE313;') : $this.html('&#xE316;');
                                $this.velocity('reverse');
                                $(window).resize();
                            }
                        });
                    };

                    // hide card content on page load
                    var thisCard = $(el).closest('.md-card');
                    if(thisCard.hasClass('md-card-collapsed')) {
                        var $this_toggle = thisCard.find('.md-card-toggle');

                        $this_toggle.html('&#xE313;');
                        thisCard.children('.md-card-content').hide();
                    }

                }
            }
        }
    ])
    // card overlay toggle
    .directive('cardOverlayToggle', [
        function () {
            return {
                restrict: 'E',
                template: '<i class="md-icon material-icons" ng-click="toggleOverlay($event)">&#xE5D4;</i>',
                replace: true,
                scope: true,
                link: function (scope, el, attrs) {

                    if(el.closest('.md-card').hasClass('md-card-overlay-active')) {
                        el.html('&#xE5CD;')
                    }

                    scope.toggleOverlay = function ($event) {

                        $event.preventDefault();

                        if(!el.closest('.md-card').hasClass('md-card-overlay-active')) {
                            el
                                .html('&#xE5CD;')
                                .closest('.md-card').addClass('md-card-overlay-active');

                        } else {
                            el
                                .html('&#xE5D4;')
                                .closest('.md-card').removeClass('md-card-overlay-active');
                        }

                    }
                }
            }
        }
    ])
    // card toolbar progress
    .directive('cardProgress', [
        '$timeout',
        function ($timeout) {
            return {
                restrict: 'A',
                scope: true,
                link: function (scope, el, attrs) {

                    var $this = $(el).children('.md-card-toolbar'),
                        bg_percent = parseInt(attrs.cardProgress);


                    function updateCard(percent) {
                        var bg_color_default = $this.attr('card-bg-default');

                        var bg_color = !bg_color_default ? $this.css('backgroundColor') : bg_color_default;
                        if(!bg_color_default) {
                            $this.attr('card-bg-default',bg_color)
                        }

                        $this
                            .css({ 'background': '-moz-linear-gradient(left, '+bg_color+' '+percent+'%, #fff '+(percent)+'%)'})
                            .css({ 'background': '-webkit-linear-gradient(left, '+bg_color+' '+percent+'%, #fff '+(percent)+'%)'})
                            .css({ 'background': 'linear-gradient(to right,  '+bg_color+' '+percent+'%, #fff '+(percent)+'%)'});


                        scope.cardPercentage = percent;
                    }

                    updateCard(bg_percent);

                    scope.$watch(function() {
                        return $(el).attr('card-progress')
                    }, function(newValue) {
                        updateCard(newValue);
                    });

                }
            }
        }
    ])
    // custom scrollbar
    .directive('customScrollbar', [
        '$rootScope',
        '$timeout',
        function ($rootScope,$timeout) {
            return {
                restrict: 'A',
                scope: true,
                link: function (scope, el, attrs) {

                    // check if mini sidebar is enabled
                    if(attrs['id'] == 'sidebar_main' && $rootScope.miniSidebarActive) {
                        return;
                    }

                    $(el)
                        .addClass('uk-height-1-1')
                        .wrapInner("<div class='scrollbar-inner'></div>");

                    if(Modernizr.touch) {
                        $(el).children('.scrollbar-inner').addClass('touchscroll');
                    } else {
                        $timeout(function() {
                            $(el).children('.scrollbar-inner').scrollbar({
                                //disableBodyScroll: true,
                                scrollx: false,
                                duration: 100
                            });
                        })
                    }

                }
            }
        }
    ])
    // material design inputs
    .directive('mdInput',[
        '$timeout',
        function ($timeout) {
            return {
                restrict: 'A',
                scope: {
                    ngModel: '='
                },
                controller: function ($scope,$element) {
                    var $elem = $($element);
                    $scope.updateInput = function() {
                        // clear wrapper classes
                        $elem.closest('.md-input-wrapper').removeClass('md-input-wrapper-danger md-input-wrapper-success md-input-wrapper-disabled');

                        if($elem.hasClass('md-input-danger')) {
                            $elem.closest('.md-input-wrapper').addClass('md-input-wrapper-danger')
                        }
                        if($elem.hasClass('md-input-success')) {
                            $elem.closest('.md-input-wrapper').addClass('md-input-wrapper-success')
                        }
                        if($elem.prop('disabled')) {
                            $elem.closest('.md-input-wrapper').addClass('md-input-wrapper-disabled')
                        }
                        if($elem.hasClass('label-fixed')) {
                            $elem.closest('.md-input-wrapper').addClass('md-input-filled')
                        }
                        if($elem.val() != '') {
                            $elem.closest('.md-input-wrapper').addClass('md-input-filled')
                        }
                    };
                },
                link: function (scope, elem, attrs) {

                    var $elem = $(elem);

                    $timeout(function() {
                        if(!$elem.hasClass('md-input-processed')) {

                            var extraClass = '';
                            if($elem.is('[class*="uk-form-width-"]')) {
                                var elClasses = $elem.attr('class').split (' ');
                                for(var i = 0; i < elClasses.length; i++){
                                    var classPart = elClasses[i].substr(0,14);
                                    if(classPart == "uk-form-width-"){
                                        var extraClass = elClasses[i];
                                    }
                                }
                            }

                            if ($elem.prev('label').length) {
                                $elem.prev('label').andSelf().wrapAll('<div class="md-input-wrapper"/>');
                            } else if ($elem.siblings('[data-uk-form-password]').length) {
                                $elem.siblings('[data-uk-form-password]').andSelf().wrapAll('<div class="md-input-wrapper"/>');
                            } else {
                                $elem.wrap('<div class="md-input-wrapper"/>');
                            }
                            $elem
                                .addClass('md-input-processed')
                                .closest('.md-input-wrapper')
                                .append('<span class="md-input-bar '+extraClass+'"/>');
                        }

                        scope.updateInput();

                    });

                    scope.$watch(function() {
                            return $elem.attr('class'); },
                        function(newValue,oldValue){
                            if(newValue != oldValue) {
                                scope.updateInput();
                            }
                        }
                    );

                    scope.$watch(function() {
                            return $elem.val(); },
                        function(newValue,oldValue){
                            if( !$elem.is(':focus') && (newValue != oldValue) ) {
                                scope.updateInput();
                            }
                        }
                    );

                    $elem
                        .on('focus', function() {
                            $elem.closest('.md-input-wrapper').addClass('md-input-focus')
                        })
                        .on('blur', function() {
                            $timeout(function() {
                                $elem.closest('.md-input-wrapper').removeClass('md-input-focus');
                                if($elem.val() == '') {
                                    $elem.closest('.md-input-wrapper').removeClass('md-input-filled')
                                } else {
                                    $elem.closest('.md-input-wrapper').addClass('md-input-filled')
                                }
                            },100)
                        });

                }
            }
        }
    ])
    // material design fab speed dial
    .directive('mdFabSpeedDial',[
        'variables',
        '$timeout',
        function (variables,$timeout) {
            return {
                restrict: 'A',
                scope: true,
                link: function (scope, elem, attrs) {

                    var $elem = $(elem),
                        $wrapper = $(elem).closest('.md-fab-speed-dial,.md-fab-speed-dial-horizontal');

                    function activateFAB(obj) {
                        obj.closest('.md-fab-wrapper').addClass('md-fab-active');
                        obj.velocity({
                            scale: 0
                        }, {
                            duration: 140,
                            easing: variables.easing_swiftOut,
                            complete: function() {
                                obj
                                    .velocity({ scale: 1 },{
                                        duration: 140,
                                        easing: variables.easing_swiftOut
                                    })
                                    .children().toggle()
                            }
                        })
                    }
                    function deactivateFAB(obj) {
                        obj.closest('.md-fab-wrapper').removeClass('md-fab-active');
                        obj.velocity({
                            scale: 0
                        }, {
                            duration: 140,
                            easing: variables.easing_swiftOut,
                            complete: function() {
                                obj
                                    .velocity({ scale: 1 },{
                                        duration: 140,
                                        easing: variables.easing_swiftOut
                                    })
                                    .children().toggle()
                            }
                        })
                    }

                    $(elem).append('<i class="material-icons md-fab-action-close" style="display:none">&#xE5CD;</i>');

                    if($wrapper.is('[data-fab-hover]')) {
                        var deactiveateFabTimeout;
                        $wrapper
                            .on('mouseenter',function() {
                                $wrapper.addClass('md-fab-over');
                                $timeout.cancel(deactiveateFabTimeout);
                                setTimeout(function() {
                                    activateFAB($elem);
                                },100);
                            })
                            .on('mouseleave',function() {
                                deactivateFAB($elem);
                                deactiveateFabTimeout = $timeout(function() {
                                    $wrapper.removeClass('md-fab-over');
                                },500);
                            })
                    } else {
                        $elem
                            .on('click',function() {
                                if(!$elem.closest('.md-fab-wrapper').hasClass('md-fab-active')) {
                                    activateFAB($elem);
                                } else {
                                    deactivateFAB($elem);
                                }
                            })
                            .closest('.md-fab-wrapper').find('.md-fab-small')
                            .on('click',function() {
                                deactivateFAB($elem);
                            });
                    }
                    /*$(elem)
                        .append('<i class="material-icons md-fab-action-close" style="display:none">&#xE5CD;</i>')
                        .on('click',function(e) {
                            e.preventDefault();

                            var $this = $(this),
                                $this_wrapper = $this.closest('.md-fab-wrapper');

                            if(!$this_wrapper.hasClass('md-fab-active')) {
                                $this_wrapper.addClass('md-fab-active');
                            } else {
                                $this_wrapper.removeClass('md-fab-active');
                            }

                            $this.velocity({
                                scale: 0
                            },{
                                duration: 140,
                                easing: variables.easing_swiftOut,
                                complete: function() {
                                    $this.children().toggle();
                                    $this.velocity({
                                        scale: 1
                                    },{
                                        duration: 140,
                                        easing: variables.easing_swiftOut
                                    })
                                }
                            })
                        })
                        .closest('.md-fab-wrapper').find('.md-fab-small')
                        .on('click',function() {
                            $(elem).trigger('click');
                        });*/
                }
            }
        }
    ])
    // material design fab toolbar
    .directive('mdFabToolbar',[
        'variables',
        '$document',
        function (variables,$document) {
            return {
                restrict: 'A',
                scope: true,
                link: function (scope, elem, attrs) {

                    var $fab_toolbar = $(elem);

                    $fab_toolbar
                        .children('i')
                        .on('click', function(e) {
                            e.preventDefault();

                            var toolbarItems = $fab_toolbar.children('.md-fab-toolbar-actions').children().length;

                            $fab_toolbar.addClass('md-fab-animated');

                            var FAB_padding = !$fab_toolbar.hasClass('md-fab-small') ? 16 : 24,
                                FAB_size = !$fab_toolbar.hasClass('md-fab-small') ? 64 : 44;

                            setTimeout(function() {
                                $fab_toolbar
                                    .width((toolbarItems*FAB_size + FAB_padding))
                            },140);

                            setTimeout(function() {
                                $fab_toolbar.addClass('md-fab-active');
                            },420);

                        });

                    $($document).on('click scroll', function(e) {
                        if( $fab_toolbar.hasClass('md-fab-active') ) {
                            if (!$(e.target).closest($fab_toolbar).length) {

                                $fab_toolbar
                                    .css('width','')
                                    .removeClass('md-fab-active');

                                setTimeout(function() {
                                    $fab_toolbar.removeClass('md-fab-animated');
                                },140);

                            }
                        }
                    });
                }
            }
        }
    ])
    // material design fab sheet
    .directive('mdFabSheet',[
        'variables',
        '$document',
        function (variables,$document) {
            return {
                restrict: 'A',
                scope: true,
                link: function (scope, elem, attrs) {
                    var $fab_sheet = $(elem);

                    $fab_sheet
                        .children('i')
                        .on('click', function(e) {
                            e.preventDefault();

                            var sheetItems = $fab_sheet.children('.md-fab-sheet-actions').children('a').length;

                            $fab_sheet.addClass('md-fab-animated');

                            setTimeout(function() {
                                $fab_sheet
                                    .width('240px')
                                    .height(sheetItems*40 + 8);
                            },140);

                            setTimeout(function() {
                                $fab_sheet.addClass('md-fab-active');
                            },280);

                        });

                    $($document).on('click scroll', function(e) {
                        if( $fab_sheet.hasClass('md-fab-active') ) {
                            if (!$(e.target).closest($fab_sheet).length) {

                                $fab_sheet
                                    .css({
                                        'height':'',
                                        'width':''
                                    })
                                    .removeClass('md-fab-active');

                                setTimeout(function() {
                                    $fab_sheet.removeClass('md-fab-animated');
                                },140);

                            }
                        }
                    });
                }
            }
        }
    ])
    // hierarchical show
    .directive('hierarchicalShow', [
        '$timeout',
        '$rootScope',
        function ($timeout,$rootScope) {
            return {
                restrict: 'A',
                scope: true,
                link: function (scope, elem, attrs) {


                    var parent_el = $(elem),
                        baseDelay = 60;


                    var add_animation = function(children,length) {
                        children
                            .each(function(index) {
                                $(this).css({
                                    '-webkit-animation-delay': (index * baseDelay) + "ms",
                                    'animation-delay': (index * baseDelay) + "ms"
                                })
                            })
                            .end()
                            .waypoint({
                                element: elem[0],
                                handler: function() {
                                    parent_el.addClass('hierarchical_show_inView');
                                    setTimeout(function() {
                                        parent_el
                                            .removeClass('hierarchical_show hierarchical_show_inView fast_animation')
                                            .children()
                                            .css({
                                                '-webkit-animation-delay': '',
                                                'animation-delay': ''
                                            });
                                    }, (length*baseDelay)+1200 );
                                    this.destroy();
                                },
                                context: window,
                                offset: '90%'
                            });
                    };

                    $rootScope.$watch('pageLoaded',function() {
                        if($rootScope.pageLoaded) {
                            var children = parent_el.children(),
                                children_length = children.length;

                            $timeout(function() {
                                add_animation(children,children_length)
                            },560)

                        }
                    });

                    scope.$watch(function() {
                        return parent_el.hasClass('hierarchical_show');
                    }, function(newValue){
                        if($rootScope.pageLoaded && newValue) {
                            var children = parent_el.children(),
                                children_length = children.length;
                            add_animation(children,children_length);
                        }
                    });


                }
            }
        }
    ])
    // hierarchical slide in
    .directive('hierarchicalSlide', [
        '$timeout',
        '$rootScope',
        function ($timeout,$rootScope) {
            return {
                restrict: 'A',
                scope: true,
                link: function (scope, elem, attrs) {

                    var $this = $(elem),
                        baseDelay = 100;

                    var add_animation = function(children,context,childrenLength) {
                        children.each(function(index) {
                            $(this).css({
                                '-webkit-animation-delay': (index * baseDelay) + "ms",
                                'animation-delay': (index * baseDelay) + "ms"
                            })
                        });
                        $this.waypoint({
                            handler: function() {
                                $this.addClass('hierarchical_slide_inView');
                                $timeout(function() {
                                    $this.removeClass('hierarchical_slide hierarchical_slide_inView');
                                    children.css({
                                        '-webkit-animation-delay': '',
                                        'animation-delay': ''
                                    });
                                }, (childrenLength*baseDelay)+1200 );
                                this.destroy();
                            },
                            context: context[0],
                            offset: '90%'
                        });
                    };

                    $rootScope.$watch('pageLoaded',function() {
                        if($rootScope.pageLoaded) {
                            var thisChildren = attrs['slideChildren'] ? $this.children(attrs['slideChildren']) : $this.children(),
                                thisContext = attrs['slideContext'] ? $this.closest(attrs['slideContext']) : 'window',
                                thisChildrenLength = thisChildren.length;

                            if(thisChildrenLength >= 1) {
                                $timeout(function() {
                                    add_animation(thisChildren,thisContext,thisChildrenLength)
                                },560)
                            }
                        }
                    });

                    scope.$watch(function() {
                        return $this.hasClass('hierarchical_slide');
                    }, function(newValue){
                        if($rootScope.pageLoaded && newValue) {
                            var thisChildren = attrs['slideChildren'] ? $this.children(attrs['slideChildren']) : $this.children(),
                                thisContext = attrs['slideContext'] ? $this.closest(attrs['slideContext']) : 'window',
                                thisChildrenLength = thisChildren.length;

                            add_animation(thisChildren,thisContext,thisChildrenLength);
                        }
                    });

                }
            }
        }
    ])
    // preloaders
    .directive('mdPreloader',[
        function () {
            return {
                restrict: 'E',
                scope: {
                    width: '=?',
                    height: '=?',
                    strokeWidth: '=?',
                    style: '@?'
                },
                template: '<div class="md-preloader{{style}}"><svg xmlns="http://www.w3.org/2000/svg" version="1.1" ng-attr-height="{{ height }}" ng-attr-width="{{ width }}" viewbox="0 0 75 75"><circle cx="37.5" cy="37.5" r="33.5" ng-attr-stroke-width="{{ strokeWidth }}"/></svg></div>',
                link: function (scope, elem, attr) {

                    scope.width = scope.width ? scope.width : 48;
                    scope.height = scope.height ? scope.height : 48;
                    scope.strokeWidth = scope.strokeWidth ? scope.strokeWidth : 4;

                    attr.$observe('warning', function() {
                        scope.style = ' md-preloader-warning'
                    });

                    attr.$observe('success', function() {
                        scope.style = ' md-preloader-success'
                    });

                    attr.$observe('danger', function() {
                        scope.style = ' md-preloader-danger'
                    });

                }
            }
        }
    ])
    .directive('preloader',[
        '$rootScope',
        'utils',
        function ($rootScope,utils) {
            return {
                restrict: 'E',
                scope: {
                    width: '=?',
                    height: '=?',
                    style: '@?'
                },
                template: '<img src="assets/img/spinners/{{style}}{{imgDensity}}.gif" alt="" ng-attr-width="{{width}}" ng-attr-height="{{height}}">',
                link: function (scope, elem, attrs) {

                    scope.width = scope.width ? scope.width : 32;
                    scope.height = scope.height ? scope.height : 32;
                    scope.style = scope.style ? scope.style : 'spinner';
                    scope.imgDensity = utils.isHighDensity() ? '@2x' : '' ;

                    attrs.$observe('warning', function() {
                        scope.style = 'spinner_warning'
                    });

                    attrs.$observe('success', function() {
                        scope.style = 'spinner_success'
                    });

                    attrs.$observe('danger', function() {
                        scope.style = 'spinner_danger'
                    });

                    attrs.$observe('small', function() {
                        scope.style = 'spinner_small'
                    });

                    attrs.$observe('medium', function() {
                        scope.style = 'spinner_medium'
                    });

                    attrs.$observe('large', function() {
                        scope.style = 'spinner_large'
                    });

                }
            }
        }
    ])
    // uikit components
    .directive('ukHtmlEditor',[
        '$timeout',
        function ($timeout) {
            return {
                restrict: 'A',
                link: function (scope, elem, attrs) {
                    $timeout(function() {
                        UIkit.htmleditor(elem[0], {
                            'toolbar': '',
                            'height': '240'
                        });
                    });
                }
            }
        }
    ])
    .directive('ukNotification',[
        '$window',
        function ($window) {
            return {
                restrict: 'A',
                scope: {
                    message: '@',
                    status: '@?',
                    timeout: '@?',
                    group: '@?',
                    position: '@?',
                    callback: '&?'
                },
                link: function (scope, elem, attrs) {

                    var w = angular.element($window),
                        $element = $(elem);

                    scope.showNotify = function() {
                        var thisNotify = UIkit.notify({
                            message: scope.message,
                            status: scope.status ? scope.status : '',
                            timeout: scope.timeout ? scope.timeout : 5000,
                            group: scope.group ? scope.group : '',
                            pos: scope.position ? scope.position : 'top-center',
                            onClose: function() {
                                $('body').find('.md-fab-wrapper').css('margin-bottom','');
                                clearTimeout(thisNotify.timeout);

                                if(scope.callback) {
                                    if( angular.isFunction(scope.callback()) ) {
                                        scope.$apply(scope.callback());
                                    } else {
                                        console.log('Callback is not a function');
                                    }
                                }

                            }
                        });
                        if(
                            ( (w.width() < 768) && (
                                (scope.position == 'bottom-right')
                                || (scope.position == 'bottom-left')
                                || (scope.position == 'bottom-center')
                            ) )
                            || (scope.position == 'bottom-right')
                        ) {
                            var thisNotify_height = $(thisNotify.element).outerHeight(),
                                spacer = (w.width() < 768) ? -6 : 8;
                            $('body').find('.md-fab-wrapper').css('margin-bottom',thisNotify_height + spacer);
                        }
                    };

                    $element.on("click", function(){
                        if($('body').find('.uk-notify-message').length) {
                            $('body').find('.uk-notify-message').click();
                            setTimeout(function() {
                                scope.showNotify()
                            },450)
                        } else {
                            scope.showNotify()
                        }
                    });

                }
            }
        }
    ])
    .directive('accordionSectionOpen',[
        '$timeout',
        function ($timeout) {
            return {
                restrict: 'A',
                link: function (scope, elem, attrs) {
                    var sectOpen = attrs.accordionSectionOpen.toString().split(","),
                        $elem = $(elem);
                    $timeout(function() {
                        var data = $(elem).data();
                        // close all accordion sections
                        $elem.children('.uk-accordion-title.uk-active').each(function() {
                            $(this).trigger('click');
                        })
                        if(!data.accordion.options.collapse && (sectOpen.length > 1)) {
                            // open multiple sections
                            for(var $i = 0;$i <= sectOpen.length;$i++) {
                                $elem.children('.uk-accordion-title').eq(sectOpen[$i] - 1).trigger('click')
                            }
                        } else {
                            $elem.children('.uk-accordion-title').eq(sectOpen[0] - 1).trigger('click')
                        }
                    },220);
                }
            }
        }
    ])
    .directive('pageAside', [
        '$timeout',
        '$window',
        function ($timeout,$window) {
            return {
                restrict: 'A',
                link: function (scope, elem, attrs) {
                    var w = angular.element($window);

                    function calculateHeight() {
                        var viewportHeight = w.height(),
                            asideTop = $(elem).offset().top;

                        $(elem).height(viewportHeight - asideTop);
                    }
                    calculateHeight();
                    w.on('debouncedresize',function() {
                        calculateHeight();
                    });
                }
            }
        }
    ])
    .directive('pageAsideToggle', [
        '$timeout',
        '$window',
        function ($timeout,$window) {
            return {
                restrict: 'A',
                link: function (scope, elem, attrs) {
                    $(elem).on('click',function() {
                        $('body').toggleClass('page_aside_collapsed');
                    })
                }
            }
        }
    ])
    .directive('pageOverflow', [
        '$timeout',
        '$window',
        function ($timeout,$window) {
            return {
                restrict: 'A',
                link: function (scope, elem, attrs) {
                    var w = angular.element($window);

                    function calculateHeight() {
                        var viewportHeight = w.height(),
                            overflowTop = $(elem).offset().top,
                            height = viewportHeight - overflowTop;

                        if($(elem).children('.uk-overflow-container').length) {
                            $(elem).children('.uk-overflow-container').height(height);
                        } else {
                            $(elem).height(height);
                        }

                    }
                    calculateHeight();
                    w.on('debouncedresize',function() {
                        calculateHeight();
                    });

                }
            }
        }
    ])

    // datetime filter
    .directive('datePickerFilter', ['$rootScope','TableController','utils', 'AlertService',function ($rootScope, TableController, utils, AlertService) {
        return {
            restrict: 'EAC',
            replace: true,
            template: '<div style="margin-bottom: 10px !important;">\n' +
                '\t<input id="filter_date_column" class="md-input ng-isolate-scope md-input-processed"\n' +
                '\t   ng-model="inputValue" type="search" placeholder="Chọn ngày..."\n' +
                '\t   style="height: 38px;width: 150px;"\n' +
                '\t   ng-click="openModalDateRange()">\n' +
                '\t<div class="uk-modal uk-open" id="modal_date_range" aria-hidden="false" style="display: block; overflow-y: scroll;" ng-show="EnableShow">\n' +
                '\t\t<div class="uk-modal-dialog" id="modal_dialog" style="top: 22.5px;">\n' +
                '\t\t\t<div class="uk-grid" data-uk-grid-margin style="margin-left: -11px;">\n' +
                '\t\t\t\t<div class="uk-width-large-1-5">\n' +
                '\t\t\t\t\t<p style="margin-left: -30px;margin-top: 10px;">\n' +
                '\t\t\t\t\t\t<input type="radio" name="radio_demo" id="radio_range" icheck ng-model="radio_model" value="radio_1"/>\n' +
                '\t\t\t\t\t\t<label class="inline-label">Từ...đến...</label>\n' +
                '\t\t\t\t\t</p>\n' +
                '\t\t\t\t</div>\n' +
                '\t\t\t\t<div class="uk-width-large-2-5" style="margin-left: -54px;">\n' +
                '\t\t\t\t\t<div class="uk-input-group" style="width: 110%;">\n' +
                '\t\t\t\t\t\t<span class="uk-input-group-addon"><i class="uk-input-group-icon uk-icon-calendar"></i></span>\n' +
                '\t\t\t\t\t\t<input class="md-input" type="text" id="uk_date_start" data-uk-datepicker="{format:\'DD-MM-YYYY\', i18n: {{timeLanguage}} }" ng-model="ukDateStart">\n' +
                '\t\t\t\t\t</div>\n' +
                '\t\t\t\t</div>\n' +
                '\t\t\t\t<div class="uk-width-large-2-5" style="margin-left: 18px;">\n' +
                '\t\t\t\t\t<div class="uk-input-group" style="width: 110%;">\n' +
                '\t\t\t\t\t\t<span class="uk-input-group-addon"><i class="uk-input-group-icon uk-icon-calendar"></i></span>\n' +
                '\t\t\t\t\t\t<input class="md-input" type="text" id="uk_date_end" data-uk-datepicker="{format:\'DD-MM-YYYY\', i18n: {{timeLanguage}} }" ng-model="ukDateEnd">\n' +
                '\t\t\t\t\t</div>\n' +
                '\t\t\t\t</div>\n' +
                '\t\t\t</div>\n' +
                '\t\t\t<div class="uk-grid" data-uk-grid-margin style="margin-left: -11px;">\n' +
                '\t\t\t\t<div class="uk-width-large-1-5">\n' +
                '\t\t\t\t\t<p style="margin-left: -30px;margin-top: 13px;">\n' +
                '\t\t\t\t\t\t<input type="radio" name="radio_demo" id="radio_equal" icheck ng-model="radio_model" value="radio_2" />\n' +
                '\t\t\t\t\t\t<label class="inline-label">Ngày</label>\n' +
                '\t\t\t\t\t</p>\n' +
                '\t\t\t\t</div>\n' +
                '\t\t\t\t<div class="uk-width-large-2-5" style="margin-left: -54px;">\n' +
                '\t\t\t\t\t<div class="uk-input-group" style="width: 110%;">\n' +
                '\t\t\t\t\t\t<span class="uk-input-group-addon"><i class="uk-input-group-icon uk-icon-calendar"></i></span>\n' +
                '\t\t\t\t\t\t<input class="md-input" type="text" id="uk_date_equal" data-uk-datepicker="{format:\'DD-MM-YYYY\', i18n: {{timeLanguage}}}" ng-model="ukDateEqual">\n' +
                '\t\t\t\t\t</div>\n' +
                '\t\t\t\t</div>\n' +
                '\t\t\t\t<div class="uk-width-large-2-5" style="margin-left: 18px;"></div>\n' +
                '\t\t\t</div>\n' +
                '\t\t\t<div class="uk-grid" data-uk-grid-margin style="margin-left: -11px;">\n' +
                '\t\t\t\t<div class="uk-width-large-1-5">\n' +
                '\t\t\t\t\t<p style="margin-left: -30px;">\n' +
                '\t\t\t\t\t\t<input type="radio" name="radio_demo" id="radio_empty" icheck ng-model="radio_model" value="radio_3" ng-change="chooseEmpty()"/>\n' +
                '\t\t\t\t\t\t<label class="inline-label">Trống</label>\n' +
                '\t\t\t\t\t</p>\n' +
                '\t\t\t\t</div>\n' +
                '\t\t\t\t<div class="uk-width-large-2-5" style="margin-left: -54px;"></div>\n' +
                '\t\t\t\t<div class="uk-width-large-2-5" style="margin-left: 18px;"></div>\n' +
                '\t\t\t</div>\n' +
                '\t\t\t<div class="uk-modal-footer uk-text-right" style="width: 560px;margin-top: -10px;">\n' +
                '\t\t\t\t<button type="button" class="md-btn md-btn-flat uk-modal-close" ng-click="cancelModalDateRange()">THOÁT</button>\n' +
                '\t\t\t\t<button type="button" class="md-btn md-btn-flat uk-modal-close" ng-click="clearModalDateRange()">XÓA</button>\n' +
                '\t\t\t\t<button type="button" id="dateRangeApply" class="md-btn md-btn-flat md-btn-flat-primary" ng-click="selectDateRange()">TÌM</button>\n' +
                '\t\t\t</div>\n' +
                '\t\t</div>\n' +
                '\t</div>\n' +
                '</div>',
            scope: {
                table: '=',
                column: '='
            },
            link: function(scope, element, attrs) {
                var $ukDateStart = $("#uk_date_start");
                var $ukDateEnd = $("#uk_date_end");
                var $ukDateEqual = $("#uk_date_equal");

                scope.timeLanguage = $rootScope.timeLanguage;
                scope.isValidDate = function(d){
                    date = new Date(d);
                    return date instanceof Date && !isNaN(date);
                };
                scope.checkDateGreater = function(s, e){
                    var start = new Date(s);
                    var end = new Date(e);

                    return start > end;
                };

                //init
                scope.EnableShow = false;
                scope.radio_model = null;

                scope.clear = function () {
                    scope.radio_model = null;
                    scope.inputValue = null;
                    scope.dateStart = "";
                    scope.dateEnd = "";

                    scope.ukDateEqual = "";
                    scope.ukDateStart = "";
                    scope.ukDateEnd = "";

                    $ukDateStart.removeClass('md-input-danger');
                    $ukDateEnd.removeClass('md-input-danger');
                    $ukDateEqual.removeClass('md-input-danger');
                }

                scope.clear();

                scope.openModalDateRange = function(){
                    var td = element.parent();
                    td[0].style.zIndex = 1004;
                    scope.EnableShow = true;
                }
                scope.cancelModalDateRange = function () {
                    scope.EnableShow = false;
                    var td = element.parent();
                    td[0].style.zIndex = 4;
                }
                scope.clearModalDateRange = function(){
                    scope.clear();
                    scope.resetTable();
                }
                scope.resetTable = function(){
                    scope.table.filter[scope.column] = "";
                    TableController.handleFilter(scope.table.tableId);
                }
                scope.chooseEmpty = function () {
                    //console.log(scope.radio_model)
                    if(scope.radio_model == 'radio_3'){
                        //console.log('set null')
                        scope.inputValue = null;
                        scope.table.filter[scope.column] = "";scope.dateStart = null;scope.dateEnd = null;
                        scope.ukDateEqual = null;scope.ukDateStart = null;scope.ukDateEnd == null;
                    }else{
                        scope.clear();
                    }
                }
                scope.selectDateRange = function(){
                    $ukDateStart.removeClass('md-input-danger');
                    $ukDateEnd.removeClass('md-input-danger');
                    $ukDateEqual.removeClass('md-input-danger');

                    if(scope.radio_model == null){
                        AlertService.error('Cần chọn 1 trong các hình thức tìm kiếm');
                        return;
                    }
                    else if(scope.radio_model == 'radio_1'){
                        scope.inputValue = scope.ukDateStart.toString() + ' - ' + scope.ukDateEnd.toString();
                        var dateStart = scope.ukDateStart.replace(/(\d{2})-(\d{2})-(\d{4})/, "$3-$2-$1");
                        var dateEnd = scope.ukDateEnd.replace(/(\d{2})-(\d{2})-(\d{4})/, "$3-$2-$1");

                        var isValid = true;
                        if(!scope.isValidDate(dateStart)){
                            isValid = false;
                            $ukDateStart.addClass('md-input-danger');
                            AlertService.error('Ngày bắt đầu không đúng định dạng');
                        } else if(!scope.isValidDate(dateEnd)){
                            isValid = false;
                            $ukDateEnd.addClass('md-input-danger');
                            AlertService.error('Ngày kết thúc không đúng định dạng');
                        } else if(scope.checkDateGreater(dateStart, dateEnd)){
                            isValid = false;
                            $ukDateStart.addClass('md-input-danger');
                            AlertService.error('Ngày bắt đầu không được lớn hơn ngày kết thúc');
                        }
                        if(!isValid) return;

                        scope.dateStart = dateStart.toString() + " 00:00:00.000";
                        scope.dateEnd = dateEnd.toString() + " 23:59:59.000";

                        scope.table.filter[scope.column] = utils.toTimestamp(scope.dateStart) + '&' + utils.toTimestamp(scope.dateEnd);
                        TableController.handleFilter(scope.table.tableId);
                        //scope.inputValue = $uk_date_start.val().toString() + ' - ' + $uk_date_end.val().toString();
                    }
                    else if(scope.radio_model == 'radio_2'){
                        var dateEqual = scope.ukDateEqual.replace(/(\d{2})-(\d{2})-(\d{4})/, "$3-$2-$1");
                        if(!scope.isValidDate(dateEqual, "$3-$2-$1")){
                            $ukDateEqual.addClass('md-input-danger');
                            AlertService.error('Ngày tìm kiếm không hợp lệ');
                            return;
                        }
                        //scope.inputValue = $uk_date_equal.val().toString();
                        scope.inputValue = scope.ukDateEqual.toString();
                        scope.dateStart = dateEqual.toString() + " 00:00:00.000";
                        scope.dateEnd = dateEqual.toString() + " 23:59:59.000";
                        scope.table.filter[scope.column] = utils.toTimestamp(scope.dateStart) + '&' + utils.toTimestamp(scope.dateEnd);
                        TableController.handleFilter(scope.table.tableId);
                    } else if(scope.radio_model == 'radio_3'){
                        //console.log('filter null')
                        TableController.handleFilter(scope.table.tableId);
                    }
                    scope.EnableShow = false;
                }

                var count = 0;
                // click outside to close modal date filter
                // $(document).click(function(event) {
                //     //if you click on anything except the modal itself or the "open modal" link, close the modal
                //     if (!$(event.target).closest("#modal_dialog").length && event.target.id !== 'filter_date_column') {
                //         count += 1;
                //         if(scope.EnableShow && count > 1){
                //             scope.$apply(function(){
                //                 scope.EnableShow = false;
                //                 var td = element.parent();
                //                 td[0].style.zIndex = 4;
                //             });
                //         }
                //
                //     }
                // });

                $("#uk_date_start, #uk_date_end, #uk_date_equal").keyup(function ($event) {
                    if($event.keyCode && $event.keyCode == 13)
                    scope.selectDateRange();
                });

            }
        };
    }])
    .directive('datePickerSearch', ['$rootScope','utils', 'AlertService',function ($rootScope, utils, AlertService) {
        return {
            restrict: 'EAC',
            replace: true,
            template: '<div style="margin-bottom: 10px !important;">\n' +
                '\t<input id="filter_date_column" class="md-input ng-isolate-scope md-input-processed"\n' +
                '\t   ng-model="inputValue" type="search" placeholder="Chọn ngày..."\n' +
                '\t   style="height: 38px;"\n' +
                '\t   ng-click="openModalDateRange()">\n' +
                '\t<div class="uk-modal uk-open" id="modal_date_range" aria-hidden="false" style="display: block; overflow-y: scroll;" ng-show="EnableShow">\n' +
                '\t\t<div class="uk-modal-dialog" id="modal_dialog" style="top: 22.5px;">\n' +
                '\t\t\t<div class="uk-grid" data-uk-grid-margin style="margin-left: -11px;">\n' +
                '\t\t\t\t<div class="uk-width-large-1-5">\n' +
                '\t\t\t\t\t<p style="margin-left: -30px;margin-top: 10px;">\n' +
                '\t\t\t\t\t\t<input type="radio" name="radio_demo" id="radio_range" icheck ng-model="radio_model" value="radio_1"/>\n' +
                '\t\t\t\t\t\t<label class="inline-label" for="radio_range">Từ...đến...</label>\n' +
                '\t\t\t\t\t</p>\n' +
                '\t\t\t\t</div>\n' +
                '\t\t\t\t<div class="uk-width-large-2-5" style="margin-left: -54px;">\n' +
                '\t\t\t\t\t<div class="uk-input-group" style="width: 110%;">\n' +
                '\t\t\t\t\t\t<span class="uk-input-group-addon"><i class="uk-input-group-icon uk-icon-calendar"></i></span>\n' +
                '\t\t\t\t\t\t<input class="md-input" type="text" id="uk_date_start" data-uk-datepicker="{format:\'YYYY-MM-DD\', i18n: {{timeLanguage}} }" ng-model="ukDateStart">\n' +
                '\t\t\t\t\t</div>\n' +
                '\t\t\t\t</div>\n' +
                '\t\t\t\t<div class="uk-width-large-2-5" style="margin-left: 18px;">\n' +
                '\t\t\t\t\t<div class="uk-input-group" style="width: 110%;">\n' +
                '\t\t\t\t\t\t<span class="uk-input-group-addon"><i class="uk-input-group-icon uk-icon-calendar"></i></span>\n' +
                '\t\t\t\t\t\t<input class="md-input" type="text" id="uk_date_end" data-uk-datepicker="{format:\'YYYY-MM-DD\', i18n: {{timeLanguage}} }" ng-model="ukDateEnd">\n' +
                '\t\t\t\t\t</div>\n' +
                '\t\t\t\t</div>\n' +
                '\t\t\t</div>\n' +
                '\t\t\t<div class="uk-grid" data-uk-grid-margin style="margin-left: -11px;">\n' +
                '\t\t\t\t<div class="uk-width-large-1-5">\n' +
                '\t\t\t\t\t<p style="margin-left: -30px;margin-top: 13px;">\n' +
                '\t\t\t\t\t\t<input type="radio" name="radio_demo" id="radio_equal" icheck ng-model="radio_model" value="radio_2" />\n' +
                '\t\t\t\t\t\t<label class="inline-label" for="radio_equal">Ngày</label>\n' +
                '\t\t\t\t\t</p>\n' +
                '\t\t\t\t</div>\n' +
                '\t\t\t\t<div class="uk-width-large-2-5" style="margin-left: -54px;">\n' +
                '\t\t\t\t\t<div class="uk-input-group" style="width: 110%;">\n' +
                '\t\t\t\t\t\t<span class="uk-input-group-addon"><i class="uk-input-group-icon uk-icon-calendar"></i></span>\n' +
                '\t\t\t\t\t\t<input class="md-input" type="text" id="uk_date_equal" data-uk-datepicker="{format:\'YYYY-MM-DD\', i18n: {{timeLanguage}}}" ng-model="ukDateEqual">\n' +
                '\t\t\t\t\t</div>\n' +
                '\t\t\t\t</div>\n' +
                '\t\t\t\t<div class="uk-width-large-2-5" style="margin-left: 18px;"></div>\n' +
                '\t\t\t</div>\n' +
                '\t\t\t<div class="uk-grid" data-uk-grid-margin style="margin-left: -11px;">\n' +
                '\t\t\t\t<div class="uk-width-large-1-5">\n' +
                '\t\t\t\t\t<p style="margin-left: -30px;">\n' +
                '\t\t\t\t\t\t<input type="radio" name="radio_demo" id="radio_empty" icheck ng-model="radio_model" value="radio_3" ng-change="chooseEmpty()"/>\n' +
                '\t\t\t\t\t\t<label class="inline-label" for="radio_empty">Trống</label>\n' +
                '\t\t\t\t\t</p>\n' +
                '\t\t\t\t</div>\n' +
                '\t\t\t\t<div class="uk-width-large-2-5" style="margin-left: -54px;"></div>\n' +
                '\t\t\t\t<div class="uk-width-large-2-5" style="margin-left: 18px;"></div>\n' +
                '\t\t\t</div>\n' +
                '\t\t\t<div class="uk-modal-footer uk-text-right" style="width: 560px;margin-top: -10px;">\n' +
                '\t\t\t\t<button type="button" class="md-btn md-btn-flat uk-modal-close" ng-click="cancelModalDateRange()">THOÁT</button>\n' +
                '\t\t\t\t<button type="button" class="md-btn md-btn-flat uk-modal-close" ng-click="clearModalDateRange()">XÓA</button>\n' +
                '\t\t\t\t<button type="button" id="dateRangeApply" class="md-btn md-btn-flat md-btn-flat-primary" ng-click="selectDateRange()">TÌM</button>\n' +
                '\t\t\t</div>\n' +
                '\t\t</div>\n' +
                '\t</div>\n' +
                '</div>',
            scope: {
                value: '=',
                column: '='
            },
            link: function(scope, element, attrs) {
                var $ukDateStart = $("#uk_date_start");
                var $ukDateEnd = $("#uk_date_end");
                var $ukDateEqual = $("#uk_date_equal");

                scope.timeLanguage = $rootScope.timeLanguage;
                scope.isValidDate = function(d){
                    date = new Date(d);
                    return date instanceof Date && !isNaN(date);
                };
                scope.checkDateGreater = function(s, e){
                    var start = new Date(s);
                    var end = new Date(e);

                    return start > end;
                };

                //init
                scope.EnableShow = false;
                scope.radio_model = null;

                scope.clear = function () {
                    scope.radio_model = null;
                    scope.inputValue = null;
                    scope.dateStart = "";
                    scope.dateEnd = "";

                    scope.ukDateEqual = "";
                    scope.ukDateStart = "";
                    scope.ukDateEnd = "";

                    $ukDateStart.removeClass('md-input-danger');
                    $ukDateEnd.removeClass('md-input-danger');
                    $ukDateEqual.removeClass('md-input-danger');
                };

                scope.clear();

                scope.openModalDateRange = function(){
                    var td = element.parent();
                    td[0].style.zIndex = 1004;
                    scope.EnableShow = true;
                };
                scope.cancelModalDateRange = function () {
                    scope.EnableShow = false;
                    var td = element.parent();
                    td[0].style.zIndex = 4;
                };
                scope.clearModalDateRange = function(){
                    scope.clear();
                    scope.resetTable();
                };
                scope.resetTable = function(){
                    scope.value[scope.column] = "";
                };
                scope.chooseEmpty = function () {
                    if(scope.radio_model == 'radio_3'){
                        scope.inputValue = null;
                        scope.value[scope.column] = null;scope.dateStart = null;scope.dateEnd = null;
                        scope.ukDateEqual = null;scope.ukDateStart = null; scope.ukDateEnd == null;
                    }else{
                        scope.clear();
                    }
                }
                scope.selectDateRange = function(){
                    $ukDateStart.removeClass('md-input-danger');
                    $ukDateEnd.removeClass('md-input-danger');
                    $ukDateEqual.removeClass('md-input-danger');

                    if(scope.radio_model == null){
                        AlertService.error('Cần chọn 1 trong các hình thức tìm kiếm');
                        return;
                    }
                    else if(scope.radio_model == 'radio_1'){
                        scope.inputValue = scope.ukDateStart.toString() + ' - ' + scope.ukDateEnd.toString();

                        var isValid = true;
                        if(!scope.isValidDate(scope.ukDateStart)){
                            isValid = false;
                            $ukDateStart.addClass('md-input-danger');
                            AlertService.error('Ngày bắt đầu không đúng định dạng');
                        } else if(!scope.isValidDate(scope.ukDateEnd)){
                            isValid = false;
                            $ukDateEnd.addClass('md-input-danger');
                            AlertService.error('Ngày kết thúc không đúng định dạng');
                        } else if(scope.checkDateGreater(scope.ukDateStart, scope.ukDateEnd)){
                            isValid = false;
                            $ukDateStart.addClass('md-input-danger');
                            AlertService.error('Ngày bắt đầu không được lớn hơn ngày kết thúc');
                        }
                        if(!isValid) return;

                        scope.dateStart = scope.ukDateStart.toString() + " 00:00:00.000";
                        scope.dateEnd = scope.ukDateEnd.toString() + " 23:59:59.000";

                        scope.value[scope.column] = utils.toTimestamp(scope.dateStart) + '&' + utils.toTimestamp(scope.dateEnd);
                    }
                    else if(scope.radio_model == 'radio_2'){
                        if(!scope.isValidDate(scope.ukDateEqual)){
                            $ukDateEqual.addClass('md-input-danger');
                            AlertService.error('Ngày tìm kiếm không hợp lệ');
                            return;
                        }
                        scope.inputValue = scope.ukDateEqual.toString();
                        scope.dateStart = scope.ukDateEqual.toString() + " 00:00:00.000";
                        scope.dateEnd = scope.ukDateEqual.toString() + " 23:59:59.000";
                        scope.value[scope.column] = utils.toTimestamp(scope.dateStart) + '&' + utils.toTimestamp(scope.dateEnd);
                    } else if(scope.radio_model == 'radio_3'){

                    }
                    scope.EnableShow = false;
                };

                $("#uk_date_start, #uk_date_end, #uk_date_equal").keyup(function ($event) {
                    if($event.keyCode && $event.keyCode == 13)
                        scope.selectDateRange();
                });
            }
        };
    }])
    .directive('datetimePickerFilter', ['TableController','utils',function (TableController, utils) {
        return {
            restrict: 'EAC',
            replace: true,
            template: '<div>\n' +
                '\t<input id="filter_column" class="filter-table-cell ng-pristine ng-valid ng-empty ng-touched"\n' +
                '\t\t   ng-model="inputValue" type="search" placeholder=" Select datetime..."\n' +
                '\t\t   style="height: 38px;width: 200px;"\n' +
                '\t\t   ng-click="openModalDateTimeRange()">\n' +
                '\t<div class="uk-modal uk-open" id="modal_daterange" aria-hidden="false" style="display: block; overflow-y: scroll;" ng-show="EnableShow">\n' +
                '\t\t<div class="uk-modal-dialog" style="top: 22.5px;">\n' +
                '\t\t\t<div class="uk-grid" data-uk-grid-margin style="margin-left: -11px;">\n' +
                '\t\t\t\t<div class="uk-width-large-1-5">\n' +
                '\t\t\t\t\t<p style="margin-left: -30px;margin-top: 16px;">\n' +
                '\t\t\t\t\t\t<input type="radio" name="radio_demo" id="radio_range" icheck ng-model="radio_model" value="radio_1" ng-checked="true"/>\n' +
                '\t\t\t\t\t\t<label class="inline-label">Range</label>\n' +
                '\t\t\t\t\t</p>\n' +
                '\t\t\t\t</div>\n' +
                '\t\t\t\t<div class="uk-width-large-2-5" style="margin-left: -54px;">\n' +
                '\t\t\t\t\t<div class="uk-input-group" style="width: 120%;">\n' +
                // '\t\t\t\t\t\t<label for="uk_dp_start">Start Date</label><br>\n' +
                '\t\t\t\t\t\t<div style="padding-top: 7px;">\n' +
                '\t\t\t\t\t\t\t<input kendo-date-time-picker ng-model="ngModelStart" k-ng-model="kNgModelStart" style="width: 100%;" id="kUI_datetimepicker_start"/>\n' +
                '\t\t\t\t\t\t</div>\n' +
                '\t\t\t\t\t</div>\n' +
                '\t\t\t\t</div>\n' +
                '\t\t\t\t<div class="uk-width-large-2-5" style="margin-left: 18px;">\n' +
                '\t\t\t\t\t<div class="uk-input-group" style="width: 120%;">\n' +
                // '\t\t\t\t\t\t<label for="uk_dp_end">End Date</label><br>\n' +
                '\t\t\t\t\t\t<div style="padding-top: 7px;">\n' +
                '\t\t\t\t\t\t\t<input kendo-date-time-picker ng-model="ngModelEnd" k-ng-model="kNgModelEnd" style="width: 100%;" id="kUI_datetimepicker_end"/>\n' +
                '\t\t\t\t\t\t</div>\n' +
                '\t\t\t\t\t</div>\n' +
                '\t\t\t\t</div>\n' +
                '\t\t\t</div>\n' +
                '\t\t\t<div class="uk-grid" data-uk-grid-margin style="margin-left: -11px;">\n' +
                '\t\t\t\t<div class="uk-width-large-1-5">\n' +
                '\t\t\t\t\t<p style="margin-left: -30px;margin-top: 10px;">\n' +
                '\t\t\t\t\t\t<input type="radio" name="radio_demo" id="radio_equal" icheck ng-model="radio_model" value="radio_2" />\n' +
                '\t\t\t\t\t\t<label class="inline-label">Equal</label>\n' +
                '\t\t\t\t\t</p>\n' +
                '\t\t\t\t</div>\n' +
                '\t\t\t\t<div class="uk-width-large-2-5" style="margin-left: -54px;">\n' +
                '\t\t\t\t\t<div class="uk-input-group" style="width: 120%;">\n' +
                '\t\t\t\t\t\t<input kendo-date-time-picker ng-model="ngModelEqual" k-ng-model="kNgModelEqual" style="width: 100%;" id="kUI_datetimepicker"/>\n' +
                '\t\t\t\t\t</div>\n' +
                '\t\t\t\t</div>\n' +
                '\t\t\t\t<div class="uk-width-large-2-5" style="margin-left: 18px;"></div>\n' +
                '\t\t\t</div>\n' +
                '\t\t\t<div class="uk-grid" data-uk-grid-margin style="margin-left: -11px;">\n' +
                '\t\t\t\t<div class="uk-width-large-1-5">\n' +
                '\t\t\t\t\t<p style="margin-left: -30px;">\n' +
                '\t\t\t\t\t\t<input type="radio" name="radio_demo" id="radio_empty" icheck ng-model="radio_model" value="radio_3" />\n' +
                '\t\t\t\t\t\t<label class="inline-label">Is Empty</label>\n' +
                '\t\t\t\t\t</p>\n' +
                '\t\t\t\t</div>\n' +
                '\t\t\t\t<div class="uk-width-large-2-5" style="margin-left: -54px;"></div>\n' +
                '\t\t\t\t<div class="uk-width-large-2-5" style="margin-left: 18px;"></div>\n' +
                '\t\t\t</div>\n' +
                '\t\t\t<div class="uk-modal-footer uk-text-right" style="width: 560px;margin-top: -10px;">\n' +
                '\t\t\t\t<button type="button" class="md-btn md-btn-flat uk-modal-close" ng-click="cancelModalDateTimeRange()">Cancel</button>\n' +
                '\t\t\t\t<button type="button" class="md-btn md-btn-flat uk-modal-close" ng-click="clearModalDateTimeRange()">Clear</button>\n' +
                '\t\t\t\t<button type="button" id="daterangeApply" class="md-btn md-btn-flat md-btn-flat-primary" ng-click="selectDateTimeRange()">OK</button>\n' +
                '\t\t\t</div>\n' +
                '\t\t</div>\n' +
                '\t</div>\n' +
                '</div>',
            scope: {
                dateStart: '=',
                dateEnd: '=',
                table: '=',
                column: '=',
                scopeController: '=',
                originParams : '='
            },
            link: function(scope, element, attrs) {

                scope.EnableShow = false;

                scope.clear = function () {
                    scope.inputValue = null;
                    scope.ngModelStart = null;
                    scope.ngModelEnd = null;
                    scope.kNgModelStart = null;
                    scope.kNgModelEnd = null;
                    scope.ngModelEqual = null;
                    scope.kNgModelEqual = null;
                    //scope.radio_model = 'radio_1';
                }
                scope.clear();

                scope.radio_model = null;

                scope.openModalDateTimeRange = function(){
                    scope.EnableShow = true;
                }
                scope.cancelModalDateTimeRange = function () {
                    scope.EnableShow = false;
                }
                scope.clearModalDateTimeRange = function(){
                    scope.clear();
                }
                scope.resetTable = function(){
                    scope.table.filter[scope.column] = "";
                    scope.scopeController.handleFilter(scope.table.tableId);
                }
                scope.selectDateTimeRange = function(){
                    //console.log(scope.radio_model)
                    if(scope.radio_model == null || scope.radio_model == 'radio_1'){
                        scope.dateStart = kendo.toString(scope.kNgModelStart,"yyyy-MM-dd HH:mm:ss.sss");
                        scope.dateEnd = kendo.toString(scope.kNgModelEnd,"yyyy-MM-dd HH:mm:ss.sss");

                        if(scope.dateStart == null || scope.dateEnd == null){
                            scope.inputValue = null;
                            scope.resetTable();
                        }else{
                            scope.table.filter[scope.column] = utils.toTimestamp(scope.dateStart) + '&' + utils.toTimestamp(scope.dateEnd);
                            scope.scopeController.handleFilter(scope.table.tableId);
                            scope.inputValue = kendo.toString(scope.kNgModelStart,"yyyy/MM/dd") + ' - ' + kendo.toString(scope.kNgModelEnd,"yyyy/MM/dd");
                        }

                    }else if(scope.radio_model == 'radio_2'){
                        scope.dateStart = scope.dateEnd = kendo.toString(scope.kNgModelEqual,"yyyy-MM-dd HH:mm:ss.sss");

                        if(scope.dateStart == null){
                            scope.inputValue = kendo.toString(scope.kNgModelEqual,"yyyy-MM-dd HH:mm:ss");
                            scope.resetTable();
                        }else{
                            scope.inputValue = scope.dateStart;
                            scope.table.filter[scope.column] = utils.toTimestamp(scope.dateStart) + '&' + utils.toTimestamp(scope.dateEnd);
                            scope.scopeController.handleFilter(scope.table.tableId);
                        }
                    }else{
                        scope.resetTable();
                        scope.inputValue = null;
                        scope.dateStart = scope.dateEnd = null;
                    }
                    scope.EnableShow = false;
                }

                /*scope.$watch('kNgModelStart', function(newVal) {
                    console.log(kendo.toString(newVal,"yyyy-MM-dd HH:mm:ss"))
                }, true);*/
            }
        };
    }])
    .directive('datetimePickerRangeFilter', ['TableController','$compile','utils',function (TableController, $compile, utils) {
        return {
            restrict: 'EAC',
            replace: true,
            // templateUrl:'assets/templates/bootstrap-daterangepicker-master/bootstrap-daterangepicker-filter.html',
            template:   '<div class="demo">\n' +
                '                <input type="text" id="config-demo" class="form-control" style="height: 38px;border-radius: unset;">\n' +
                '                <i class="glyphicon glyphicon-calendar fa fa-calendar"></i>\n' +
                '            </div>',
            scope: {
                startdate: '=',
                enddate: '=',
                table: '=',
                column: '=',
                scopecontroller: '=',
                originparams : '='
            },
            link: function(scope, element, attrs) {
                var boostrap = '<link href="assets/css/bootstrap.min.css" rel="stylesheet">';
                element.append($compile(boostrap)(scope));

                var css = '<style>\n' +
                    '\t.demo { position: relative; }\n' +
                    '\t.demo i {\n' +
                    '\t\tposition: absolute; bottom: 12px; right: 10px; top: auto; cursor: pointer;\n' +
                    '\t}\n' +
                    '\t.uk-pagination>li>span {\n' +
                    '\t\tfont-size: medium;\n' +
                    '\t}\n' +
                    '\t.container-checkbox {\n' +
                    '\t\tfont-weight: normal;\n' +
                    '\t}\n' +
                    '\t.container-checkbox .checkmark:after {\n' +
                    '\t\twidth: 7px;\n' +
                    '\t\theight: 13px;\n' +
                    '\t}\n' +
                    '</style>';
                element.append($compile(css)(scope));

                scope.$watchGroup(['startdate', 'enddate'], function(newValues, oldValues, scope) {
                    if(angular.isDefined(scope.startdate) && angular.isDefined(scope.enddate)
                        && scope.startdate != null && scope.enddate != null){
                        //onsole.log(scope.startdate.format('YYYY-MM-dd HH:mm:ss') + ' - ' + scope.enddate.format('YYYY-MM-dd HH:mm:ss'));
                        //console.log(utils.toTimestamp(scope.startdate.format('YYYY-MM-dd HH:mm:ss')) + '&' + utils.toTimestamp(scope.enddate.format('YYYY-MM-dd HH:mm:ss')));
                        scope.table.filter[scope.column] = utils.toTimestamp(scope.startdate.format('YYYY-MM-dd HH:mm:ss')) + '&' + utils.toTimestamp(scope.enddate.format('YYYY-MM-dd HH:mm:ss'));
                        scope.scopecontroller.handleFilter(scope.table.tableId);
                    }
                });

                $(document).ready(function() {

                    //console.log('datetimepicker range');

                    $('.configurator input, .configurator select').change(function() {
                        updateConfig();
                    });

                    $('.demo i').click(function() {
                        //console.log('choose datetime');
                        $(this).parent().find('input').click();
                    });

                    $('#startDate').daterangepicker({
                        singleDatePicker: true,
                        startDate: moment().subtract(6, 'days')
                    });

                    $('#endDate').daterangepicker({
                        singleDatePicker: true,
                        startDate: moment()
                    });

                    updateConfig();

                    function updateConfig() {
                        var options = {};

                        if ($('#singleDatePicker').is(':checked'))
                            options.singleDatePicker = true;

                        if ($('#showDropdowns').is(':checked'))
                            options.showDropdowns = true;

                        if ($('#showWeekNumbers').is(':checked'))
                            options.showWeekNumbers = true;

                        if ($('#showISOWeekNumbers').is(':checked'))
                            options.showISOWeekNumbers = true;

                        if ($('#timePicker').is(':checked'))
                            options.timePicker = true;

                        if ($('#timePicker24Hour').is(':checked'))
                            options.timePicker24Hour = true;

                        if ($('#timePickerSeconds').is(':checked'))
                            options.timePickerSeconds = true;

                        if ($('#autoApply').is(':checked'))
                            options.autoApply = true;

                        if ($('#dateLimit').is(':checked'))
                            options.dateLimit = { days: 7 };

                        if ($('#ranges').is(':checked')) {
                            options.ranges = {
                                'Today': [moment(), moment()],
                                'Yesterday': [moment().subtract(1, 'days'), moment().subtract(1, 'days')],
                                'Last 7 Days': [moment().subtract(6, 'days'), moment()],
                                'Last 30 Days': [moment().subtract(29, 'days'), moment()],
                                'This Month': [moment().startOf('month'), moment().endOf('month')],
                                'Last Month': [moment().subtract(1, 'month').startOf('month'), moment().subtract(1, 'month').endOf('month')]
                            };
                        }

                        if ($('#locale').is(':checked')) {
                            $('#rtl-wrap').show();
                            options.locale = {
                                direction: $('#rtl').is(':checked') ? 'rtl' : 'ltr',
                                format: 'MM/DD/YYYY HH:mm',
                                separator: ' - ',
                                applyLabel: 'Apply',
                                cancelLabel: 'Cancel',
                                fromLabel: 'From',
                                toLabel: 'To',
                                customRangeLabel: 'Custom',
                                daysOfWeek: ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr','Sa'],
                                monthNames: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
                                firstDay: 1
                            };
                        } else {
                            $('#rtl-wrap').hide();
                        }

                        if (!$('#linkedCalendars').is(':checked'))
                            options.linkedCalendars = false;

                        if (!$('#autoUpdateInput').is(':checked'))
                            options.autoUpdateInput = false;

                        if (!$('#showCustomRangeLabel').is(':checked'))
                            options.showCustomRangeLabel = false;

                        if ($('#alwaysShowCalendars').is(':checked'))
                            options.alwaysShowCalendars = true;

                        //console.log('config-demo');
                        $('#config-demo').daterangepicker({
                            "timePicker": true,
                            "locale": {
                                "direction": "ltr",
                                // "format": "MM/DD/YYYY HH:mm",
                                "format": "MM/DD/YYYY",
                                "separator": " - ",
                                "applyLabel": "Apply",
                                "cancelLabel": "Cancel",
                                "fromLabel": "From",
                                "toLabel": "To",
                                "customRangeLabel": "Custom",
                                "daysOfWeek": [
                                    "Su",
                                    "Mo",
                                    "Tu",
                                    "We",
                                    "Th",
                                    "Fr",
                                    "Sa"
                                ],
                                "monthNames": [
                                    "January",
                                    "February",
                                    "March",
                                    "April",
                                    "May",
                                    "June",
                                    "July",
                                    "August",
                                    "September",
                                    "October",
                                    "November",
                                    "December"
                                ],
                                "firstDay": 1
                            },
                            "startDate": "01/01/2018",
                            "endDate": "01/07/2018"
                        }, function(start, end) {
                            //console.log("New date range selected: ' + start.format('YYYY-MM-DD') + ' to ' + end.format('YYYY-MM-DD') + ' (predefined range: ' + label + ')");
                            scope.startdate = start;
                            scope.enddate = end;
                        });

                        $('#daterangepicker_cancel').click(function () {
                            //console.log('cancel datetime picker');
                            scope.table.filter[scope.column] = "";
                            TableController.reloadPage(scope.table.tableId);
                        });
                    }

                });
            }
        };
    }])

    // active filter
    .directive('activeSearchFilter', ['TableController','$timeout','$translate',function ( TableController,$timeout,$translate) {
        return {
            restrict: 'EAC',
            replace: true,
            template: '<select id="activeFilter" kendo-combo-box\n' +
                '                    k-placeholder="label"\n' +
                '                    k-data-text-field="\'title\'"\n' +
                '                    k-data-value-field="\'value\'"\n' +
                '                    k-data-source="DataSource"\n' +
                '                    k-ng-model="ngmodel"\n' +
                '                    k-on-change="selectValue()"\n' +
                // '                    style="width: 200%;">\n' +
                '            </select>',
            scope: {
                label: '=',
                table: '=',
                isnullparamter: '='
            },
            link: function(scope, element, attrs) {
                scope.abc = scope.ngmodel = null;
                scope.DataSource = [
                    {value: 1, title: $translate.instant('global.common.active')},
                    {value: 0, title: $translate.instant('global.common.archived')}
                ];
                if(scope.isnullparamter){
                    scope.DataSource.unshift(
                        {value: 2, title: $translate.instant('global.common.register')}
                    );
                }
                scope.selectValue = function () {
                    if(angular.isDefined(scope.ngmodel) && scope.ngmodel != null){
                        scope.table.filter['active'] = scope.ngmodel.value;
                        TableController.handleFilter(scope.table.tableId);
                    } else {
                        scope.table.filter['active'] = "";
                        TableController.reloadPage(scope.table.tableId);
                    }
                };

                var fabric = $("#activeFilter").data("kendoComboBox");
                fabric.input.attr("readonly", true).on("keydown", function(e) {
                    if (e.keyCode === 8) {
                        e.preventDefault();
                    }
                });
            }
        };
    }])

    //searchable multiselect
    .directive("searchableMultiselect", function($timeout) {
        return {
            templateUrl: 'assets/templates/searchable-multiselect/searchableMultiselect.html',
            restrict: 'AE',
            scope: {
                displayAttr: '@',
                selectedItems: '=',
                allItems: '=',
                readOnly: '=',
                addItem: '&',
                removeItem: '&'
            },
            link: function(scope, element, attrs) {
                element.bind('click', function (e) {
                    e.stopPropagation();
                });

                //console.log(element[0].getBoundingClientRect());
                scope.width = element[0].getBoundingClientRect();

                scope.updateSelectedItems = function(obj) {
                    var selectedObj;
                    for (i = 0; typeof scope.selectedItems !== 'undefined' && i < scope.selectedItems.length; i++) {
                        if (scope.selectedItems[i][scope.displayAttr].toUpperCase() === obj[scope.displayAttr].toUpperCase()) {
                            selectedObj = scope.selectedItems[i];
                            break;
                        }
                    }
                    if ( typeof selectedObj === 'undefined' ) {
                        scope.addItem({item: obj});
                    } else {
                        scope.removeItem({item: selectedObj});
                    }
                };

                scope.isItemSelected = function(item) {
                    if ( typeof scope.selectedItems === 'undefined' ) return false;

                    var tmpItem;
                    for (i=0; i < scope.selectedItems.length; i++) {
                        tmpItem = scope.selectedItems[i];
                        if ( typeof tmpItem !== 'undefined'
                            &&	typeof tmpItem[scope.displayAttr] !== 'undefined'
                            &&	typeof item[scope.displayAttr] !== 'undefined'
                            &&	tmpItem[scope.displayAttr].toUpperCase() === item[scope.displayAttr].toUpperCase() ) {
                            return true;
                        }
                    }

                    return false;
                };

                scope.commaDelimitedSelected = function() {
                    var list = "";
                    angular.forEach(scope.selectedItems, function (item, index) {
                        list += item[scope.displayAttr];
                        if (index < scope.selectedItems.length - 1) list += ', ';
                    });
                    return list.length ? list : "Nothing Selected";
                }
            }
        }
    })

    // activate/deactivate
    .directive('activate', ['$translate','ErrorHandle', '$state', function ($translate,ErrorHandle, $state) {
        return {
            restrict: 'EAC',
            replace: true,
            template: '<a   title ="{{title | translate}}" ng-click=statusAction()\n' +
                '           class=" md-btn md-btn-small md-btn-wave-light md-btn-icon md-bg-grey-100 custom-btn-active float-right"\n' +
                '           href="javascript:void(0)">\n' +
                '           <i ng-class="iconClass"></i>\n' +
                '           <span class="uk-text-danger uk-text-bold" id="activeBtn" ng-class="activeClass" data-translate="{{status}}"></span>\n' +
                '      </a>',
            scope: {
                model: '=',
                activateService:'=',
                deactivateService:'=',
                isCurrentUser: '='
            },
            link: function(scope, element, attrs) {
                scope.$watch('model', function(newModel){
                    if(angular.isDefined(newModel)){
                        scope.status = "global.common.archived"
                        if(angular.isDefined(newModel.active)){
                            scope.active = newModel.active
                        } else {
                            scope.active = "undefined";
                        }
                        var statusAction = {
                            1: "global.common.archive",
                            0: "global.common.restore",
                            2: "global.common.register"
                        }
                        var statusTitle = {
                            1: "global.common.archived",
                            0: "global.common.restore",
                            2: "global.common.register"
                        }
                        var iconStyle = {
                            1: "uk-icon-toggle-on uk-icon-medium uk-text-success custom-cursor-poiter",
                            0: "uk-icon-toggle-off uk-icon-medium uk-text-danger custom-cursor-poiter",
                            2:"uk-icon-toggle-off uk-icon-medium uk-text-warning custom-cursor-poiter"
                        }

                        var statusStyle = {
                            1: "uk-text-success ",
                            0: "uk-text-danger",
                            2: "uk-text-warning"
                        }
                        if (scope.active == 1) {
                            scope.status = "global.common.active"
                        } else if (scope.active == 2){
                            scope.status = "global.common.register"
                        }
                        scope.activeClass = statusStyle[scope.active];
                        scope.title = statusTitle[scope.active];
                        scope.iconClass = iconStyle[scope.active];

                        //console.log(scope)
                        // scope.mouseHoverStatus = function () {
                        //     scope.status = statusAction[scope.active]
                        //     scope.activeClass = statusStyle[!scope.active]
                        // };
                        // scope.mouseLeaveStatus = function () {
                        //     scope.status = statusTitle[scope.active]
                        //     scope.activeClass = statusStyle[scope.active]
                        // };
                        scope.statusAction = function() {
                            // dang ky ko dc kich hoat
                            if(scope.model.active === 2) return;

                            UIkit.modal.confirm($translate.instant("global.common.changeObjectState"), function () {
                                if(scope.active == 1){
                                    scope.deactivateService(scope.model.id).then(function () {
                                        newModel.active = 0;
                                        scope.active = 0;
                                        scope.activeClass = statusStyle[scope.active];
                                        scope.title = statusTitle[scope.active];
                                        scope.iconClass = iconStyle[scope.active];
                                        scope.status =statusTitle[scope.active];

                                        if(angular.isDefined(scope.isCurrentUser) && scope.isCurrentUser){
                                            $state.go('login');
                                        }
                                    }).catch(function(data){
                                        ErrorHandle.handleError(data);
                                    })
                                } else {
                                    scope.activateService(scope.model.id).then(function () {
                                        newModel.active = 1;
                                        scope.active = 1;
                                        scope.activeClass = statusStyle[scope.active];
                                        scope.title = statusTitle[scope.active];
                                        scope.iconClass = iconStyle[scope.active];
                                        scope.status =statusTitle[scope.active];
                                    }).catch(function(data){
                                        ErrorHandle.handleError(data);
                                    })
                                }

                            }, {
                                labels: {
                                    'Ok': $translate.instant("global.button.update"),
                                    'Cancel': $translate.instant("global.button.cancel")
                                }
                            });
                        }
                    }

                },true)
            }
        };
    }])
    .directive('statusUserView', ['$translate','ErrorHandle', '$state', function ($translate,ErrorHandle, $state) {
        return {
            restrict: 'EAC',
            replace: true,
            template: '<a class=" md-btn md-btn-small md-btn-wave-light md-btn-icon md-bg-grey-100 custom-btn-active float-right"\n' +
            '           href="javascript:void(0)">\n' +
            '           <i ng-class="iconClass"></i>\n' +
            '           <span class="uk-text-danger uk-text-bold" id="activeBtn" ng-class="activeClass" data-translate="{{status}}"></span>\n' +
            '      </a>',
            scope: {
                model: '=',
                activateService:'=',
                deactivateService:'=',
                isCurrentUser: '='
            },
            link: function(scope, element, attrs) {
                scope.$watch('model', function(newModel){
                    if(angular.isDefined(newModel)){
                        scope.status = "global.common.archived"
                        if(angular.isDefined(newModel.active)){
                            scope.active = newModel.active
                        } else {
                            scope.active = "undefined";
                        }
                        var statusAction = {
                            1: "global.common.archive",
                            0: "global.common.restore",
                            2: "global.common.register"
                        }
                        var statusTitle = {
                            1: "global.common.archived",
                            0: "global.common.restore",
                            2: "global.common.register"
                        }
                        var iconStyle = {
                            1: "uk-icon-toggle-on uk-icon-medium uk-text-success custom-cursor-poiter",
                            0: "uk-icon-toggle-off uk-icon-medium uk-text-danger custom-cursor-poiter",
                            2:"uk-icon-toggle-off uk-icon-medium uk-text-warning custom-cursor-poiter"
                        }

                        var statusStyle = {
                            1: "uk-text-success ",
                            0: "uk-text-danger",
                            2: "uk-text-warning"
                        }
                        if (scope.active == 1) {
                            scope.status = "global.common.active"
                        } else if (scope.active == 2){
                            scope.status = "global.common.register"
                        }
                        scope.activeClass = statusStyle[scope.active];
                        scope.title = statusTitle[scope.active];
                        scope.iconClass = iconStyle[scope.active];
                    }

                },true)
            }
        };
    }])
    .directive('userActive', ['$translate','ErrorHandle', '$state', function ($translate,ErrorHandle, $state) {
        return {
            restrict: 'EAC',
            replace: true,
            template: '<a   title ="{{title | translate}}" ng-click=statusAction()\n' +
                '           class=" md-btn md-btn-small md-btn-wave-light md-btn-icon md-bg-grey-100 custom-btn-active float-right"\n' +
                '           href="javascript:void(0)">\n' +
                '           <i ng-class="iconClass"></i>\n' +
                '           <span class="uk-text-bold" id="activeBtn" ng-class="activeClass" data-translate="{{status}}"></span>\n' +
                '      </a>',
            scope: {
                model: '=',
                activateService:'=',
                deactivateService:'=',
                isCurrentUser: '='
            },
            link: function(scope, element, attrs) {
                scope.$watch('model', function(newModel){
                    if(angular.isDefined(newModel)){
                        scope.status = "global.common.archived"
                        if(angular.isDefined(newModel.active)){
                            scope.active = newModel.active
                        } else {
                            scope.active = "undefined";
                        }
                        var statusAction = {
                            1: "global.common.archive",
                            0: "global.common.restore",
                            2: "global.common.register",
                            3: "global.common.deleted"
                        }
                        var statusTitle = {
                            1: "global.common.archived",
                            0: "global.common.restore",
                            2: "global.common.register",
                            3: "global.common.deleted"
                        }
                        var iconStyle = {
                            1: "uk-icon-archive uk-icon-medium uk-text-success custom-cursor-poiter",
                            0: "uk-icon-archive uk-icon-medium uk-text-danger custom-cursor-poiter",
                            2: "uk-icon-archive uk-icon-medium uk-text-warning",
                            3: "uk-icon-archive uk-icon-medium uk-text-muted"
                        }

                        var statusStyle = {
                            1: "uk-text-success ",
                            0: "uk-text-danger",
                            2: "uk-text-warning",
                            3: "uk-text-muted"
                        }
                        if (scope.active == 1) {
                            scope.status = "global.common.active"
                        } else if (scope.active == 2){
                            scope.status = "global.common.register"
                        } else if(scope.active == 3){
                            scope.status = "global.common.deleted"
                        } else scope.status = "global.common.archived";

                        scope.activeClass = statusStyle[scope.active];
                        scope.title = statusTitle[scope.active];
                        scope.iconClass = iconStyle[scope.active];

                        scope.statusAction = function() {
                            // dang ky - deleted ko dc kich hoat
                            if(scope.model.active === 2 || scope.model.active === 3) return;

                            UIkit.modal.confirm($translate.instant("global.common.changeObjectState"), function () {
                                if(scope.active == 1){
                                    scope.deactivateService(scope.model.id).then(function () {
                                        newModel.active = 0;
                                        scope.active = 0;
                                        scope.activeClass = statusStyle[scope.active];
                                        scope.title = statusTitle[scope.active];
                                        scope.iconClass = iconStyle[scope.active];
                                        scope.status =statusTitle[scope.active];

                                        if(angular.isDefined(scope.isCurrentUser) && scope.isCurrentUser){
                                            $state.go('login');
                                        }
                                    }).catch(function(data){
                                        ErrorHandle.handleError(data);
                                    })
                                } else {
                                    scope.activateService(scope.model.id).then(function () {
                                        newModel.active = 1;
                                        scope.active = 1;
                                        scope.activeClass = statusStyle[scope.active];
                                        scope.title = statusTitle[scope.active];
                                        scope.iconClass = iconStyle[scope.active];
                                        scope.status =statusTitle[scope.active];
                                    }).catch(function(data){
                                        ErrorHandle.handleError(data);
                                    })
                                }

                            }, {
                                labels: {
                                    'Ok': $translate.instant("global.button.update"),
                                    'Cancel': $translate.instant("global.button.cancel")
                                }
                            });
                        }
                    }

                },true)
            }
        };
    }])
    .directive('changeStatePackage', ['$translate','ErrorHandle', '$state', function ($translate,ErrorHandle, $state) {
        return {
            restrict: 'EAC',
            replace: true,
            template: '<a   title ="{{title}}" ng-click=statusAction()\n' +
                '           class=" md-btn md-btn-small md-btn-wave-light md-btn-icon md-bg-grey-100 custom-btn-active float-right"\n' +
                '           href="javascript:void(0)">\n' +
                '           <i ng-class="iconClass"></i>\n' +
                '           <span class="uk-text-bold" id="activeBtn" ng-class="activeClass" data-translate="{{status}}"></span>\n' +
                '      </a>',
            scope: {
                model: '=',
                activateService:'=',
                deactivateService:'='
            },
            link: function(scope, element, attrs) {
                scope.$watch('model', function(newModel){
                    if(angular.isDefined(newModel)){
                        scope.active = "global.common.packageState.new"
                        if(angular.isDefined(newModel.active)){
                            scope.active = newModel.active
                        } else {
                            scope.active = "undefined";
                        }
                        var statusAction = {
                            0: "package.state.new",
                            1: "package.state.active",
                            2: "package.state.deactive",
                            3: "package.state.cacelled"
                        }
                        var statusTitle = {
                    		0: "package.state.new",
                            1: "package.state.active",
                            2: "package.state.deactive",
                            3: "package.state.cacelled"
                        }
                        var statusTootip = {
                            0: "Bấm để kích hoạt",
                            1: "Bấm để Tạm ngừng gói cước",
                            2: "Bấm để Kích hoạt lại"
                        }
                        var iconStyle = {
                            0: "uk-icon-external-link uk-icon-medium uk-text-primary custom-cursor-poiter",
                            1: "uk-icon-toggle-on uk-icon-medium uk-text-success custom-cursor-poiter",
                            2: "uk-icon-toggle-off uk-icon-medium uk-text-warning",
                            3: "uk-icon-ban uk-icon-medium uk-text-danger"
                        }

                        var statusStyle = {
                        	0: "uk-text-primary",
                            1: "uk-text-success ",
                            2: "uk-text-warning",
                            3: "uk-text-danger"
                            
                        }
                        if (scope.active == 1) {
                            scope.status = "package.state.active"
                        } else if (scope.active == 2){
                            scope.status = "package.state.deactive"
                        } else if(scope.active == 3){
                            scope.status = "package.state.cacelled"
                        } else scope.status = "package.state.new";

                        scope.activeClass = statusStyle[scope.active];
                        scope.title = statusTootip[scope.active];
                        scope.iconClass = iconStyle[scope.active];

                        scope.statusAction = function() {
                            // state Cancelled can not change
                            if(scope.model.active === 3) return;
                            var $message ="";
                            if(scope.model.active === 0){
                            	$message = $translate.instant("package.message.activate");
                            }else if(scope.model.active === 1){
                            	$message = $translate.instant("package.message.deactivate");
                            }else if(scope.model.active === 2){
                            	$message = $translate.instant("package.message.reactivate");
                            }
                            UIkit.modal.confirm($message, function () {
                                if(scope.active == 1){
                                    scope.deactivateService(scope.model.id).then(function () {
                                        newModel.active = 2;
                                        scope.active = 2;
                                        scope.activeClass = statusStyle[scope.active];
                                        scope.title = statusTitle[scope.active];
                                        scope.iconClass = iconStyle[scope.active];
                                        scope.status =statusTitle[scope.active];
                                    }).catch(function(data){
                                        ErrorHandle.handleError(data);
                                    })
                                } else {
                                    scope.activateService(scope.model.id).then(function () {
                                        newModel.active = 1;
                                        scope.active = 1;
                                        scope.activeClass = statusStyle[scope.active];
                                        scope.title = statusTitle[scope.active];
                                        scope.iconClass = iconStyle[scope.active];
                                        scope.status =statusTitle[scope.active];
                                    }).catch(function(data){
                                        ErrorHandle.handleError(data);
                                    })
                                }

                            }, {
                                labels: {
                                    'Ok': $translate.instant("global.button.ok"),
                                    'Cancel': $translate.instant("global.button.cancel")
                                }
                            });
                        }
                    }

                },true)
            }
        };
    }])
    .directive('changeStatePolicy', ['$translate','ErrorHandle', '$state', function ($translate,ErrorHandle, $state) {
        return {
            restrict: 'EAC',
            replace: true,
            template: '<a   title ="{{title | translate}}" ng-click=statusAction()\n' +
                '           class=" md-btn md-btn-small md-btn-wave-light md-btn-icon md-bg-grey-100 custom-btn-active float-right"\n' +
                '           href="javascript:void(0)">\n' +
                '           <i ng-class="iconClass"></i>\n' +
                '           <span class="uk-text-bold" id="activeBtn" ng-class="activeClass" data-translate="{{status}}"></span>\n' +
                '      </a>',
            scope: {
                model: '=',
                activateService:'=',
                deactivateService:'='
            },
            link: function(scope, element, attrs) {
                scope.$watch('model', function(newModel){
                    if(angular.isDefined(newModel)){
                        scope.active = "global.common.packageState.new"
                        if(angular.isDefined(newModel.active)){
                            scope.active = newModel.active
                        } else {
                            scope.active = "undefined";
                        }
                        var statusTitle = {
                            2: "device.policy.state.new",
                            1: "device.policy.state.execute",
                            0: "device.policy.state.stop"
                        }
                        var iconStyle = {
                            2: "uk-icon-external-link uk-icon-medium uk-text-primary custom-cursor-poiter",
                            1: "uk-icon-play-circle uk-icon-medium uk-text-success custom-cursor-poiter",
                            0: "uk-icon-pause uk-icon-medium uk-text-danger"
                        }

                        var statusStyle = {
                        	2: "uk-text-primary",
                            1: "uk-text-success",
                            0: "uk-text-danger"
                        }
                        if (scope.active == 1) {
                            scope.status = "device.policy.state.execute";
                        } else if (scope.active == 0){
                            scope.status = "device.policy.state.stop";
                        } else scope.status = "device.policy.state.new";
                        scope.activeClass = statusStyle[scope.active];
                        scope.title = statusTitle[scope.active];
                        scope.iconClass = iconStyle[scope.active];

                        scope.statusAction = function() {
                            // state Cancelled can not change
                           if(scope.model.active === 1){
                            	$message = $translate.instant("device.policy.message.stop");
                            }else {
                            	$message = $translate.instant("device.policy.message.execute");
                            }
                            UIkit.modal.confirm($message, function () {
                                if(scope.active == 1){
                                    scope.deactivateService(scope.model.id).then(function () {
                                        newModel.active = 0;
                                        scope.active = 0;
                                        scope.activeClass = statusStyle[scope.active];
                                        scope.title = statusTitle[scope.active];
                                        scope.iconClass = iconStyle[scope.active];
                                        scope.status =statusTitle[scope.active];
                                    }).catch(function(data){
                                        ErrorHandle.handleError(data);
                                    })
                                } else {
                                    scope.activateService(scope.model.id).then(function () {
                                        newModel.active = 1;
                                        scope.active = 1;
                                        scope.activeClass = statusStyle[scope.active];
                                        scope.title = statusTitle[scope.active];
                                        scope.iconClass = iconStyle[scope.active];
                                        scope.status =statusTitle[scope.active];
                                    }).catch(function(data){
                                        ErrorHandle.handleError(data);
                                    })
                                }

                            }, {
                                labels: {
                                    'Ok': $translate.instant("global.button.ok"),
                                    'Cancel': $translate.instant("global.button.cancel")
                                }
                            });
                        }
                    }

                },true)
            }
        };
    }])
    .directive('fixedHeader', ['$timeout', function ($timeout){
        return {
            restrict: 'EAC',
            link: function ($scope, $elem, $attrs, $ctrl) {
                var elem = $elem[0];

                // wait for data to load and then transform the table
                $scope.$watch(tableDataLoaded, function(isTableDataLoaded) {
                    if (isTableDataLoaded) {
                        transformTable();
                    }
                });

                function tableDataLoaded() {
                    // first cell in the tbody exists when data is loaded but doesn't have a width
                    // until after the table is transformed
                    var firstCell = elem.querySelector('tbody tr:first-child td:first-child');
                    return firstCell && !firstCell.style.width;
                }

                function transformTable() {
                    // reset display styles so column widths are correct when measured below
                    angular.element(elem.querySelectorAll('thead, tbody, tfoot')).css('display', '');

                    // wrap in $timeout to give table a chance to finish rendering
                    $timeout(function () {
                        // set widths of columns
                        angular.forEach(elem.querySelectorAll('tr:first-child th'), function (thElem, i) {

                            var tdElems = elem.querySelector('tbody tr:first-child td:nth-child(' + (i + 1) + ')');
                            var tfElems = elem.querySelector('tfoot tr:first-child td:nth-child(' + (i + 1) + ')');

                            var columnWidth = thElem.offsetWidth;
                            if (tdElems && i >0) {
                                tdElems.style.width = columnWidth  + 'px';
                            }
                            if (thElem && i >0) {
                                thElem.style.width = columnWidth  + 'px';
                            }
                            if (tfElems && i >0) {
                                tfElems.style.width = columnWidth + 'px';
                            }
                        });

                        // set css styles on thead and tbody
                        angular.element(elem.querySelectorAll('thead, tfoot')).css('display', 'block');

                        angular.element(elem.querySelectorAll('tbody')).css({
                            'display': 'block',
                            'height': $attrs.tableHeight || 'inherit',
                            'overflow': 'auto'
                        });

                        // reduce width of last column by width of scrollbar
                        var tbody = elem.querySelector('tbody');
                        var scrollBarWidth = tbody.offsetWidth - tbody.clientWidth;
                        if (scrollBarWidth > 0) {
                            // for some reason trimming the width by 2px lines everything up better
                            scrollBarWidth -= 2;
                            var lastColumn = elem.querySelector('tbody tr:first-child td:last-child');
                            lastColumn.style.width = (lastColumn.offsetWidth - scrollBarWidth) + 'px';
                        }
                    });
                }
            }
        }
    }])

    //number filter
    .directive('enterKeyPress', function () {
        return function (scope, element, attrs) {
            element.bind("keydown keypress", function (event) {
                if(event.which === 13) {
                    scope.$apply(function (){
                        scope.$eval(attrs.enterKeyPress);
                    });

                    event.preventDefault();
                }
            });
        };
    })
    .directive('scrollDirective',['$timeout', function ($timeout) {
        return {
            restrict: 'EAC',
            replace: true,
            scope: {
                scrollHandle: '&'
            },
            link: function (scope, elm, attr) {
                var raw = elm[0];
                elm.bind('scroll', function () {
                    //scope.curScrollPos = raw.scrollTop;
                    $timeout(function () {
                        //console.log(raw.scrollLeft);
                        scope.scrollHandle({value: raw.scrollLeft});
                        scope.$apply();
                    })

                });
            }
        }
    }])

    //mention
    .directive('thContent', ['$translate','TableController',function ($translate,TableController) {
        return {
            restrict: 'EAC',
            replace: true,
            template: '<span class="pointerMouse boldHeader" ng-click="handleSort($event)"\n' +
                '                    >\n' +
                '<i class="material-icons md-20 ">{{sortIcon}}</i>'+
                '<span>{{labelTranslated}}</span>'+
                '            </span>',
            scope: {
                label: '=',
                table: '=',
                column: '='
            },
            link: function(scope, element, attrs) {
                scope.labelTranslated = $translate.instant(scope.label);
                scope.sortIcon = scope.table.sort[scope.column];
                scope.handleSort = function ($event){
                    TableController.handleSort($event,scope.table.tableId, scope.column);
                }
                scope.$watch('table.sort[column]', function(oldValue, newValue) {
                    if (newValue) {
                        scope.sortIcon = scope.table.sort[scope.column];
                    }
                });
            }
        };
    }])
    .directive('defaultFilter', ['$translate','TableController',function ($translate,TableController) {
        return {
            restrict: 'EAC',
            replace: true,
            template: '<div style="margin-bottom: 10px!important;"><input class="md-input ng-isolate-scope md-input-processed" ng-change="handleFilter()" type="search" placeholder="{{label}}" ng-model="model"></div>',
            scope: {
                table: '=',
                column: '='
            },
            link: function(scope, element, attrs) {
                scope.label = $translate.instant("global.placeholder.search");
                scope.model = scope.table.filter[scope.column];
                scope.handleFilter = function () {
                    scope.table.filter[scope.column] = scope.model;
                    TableController.handleFilter(scope.table.tableId);
                }
            }
        };
    }])
    .directive('inputUpload', ['$translate','AlertService',function ($translate, AlertService) {
        return {
            restrict: 'EAC',
            replace: true,
            template: '<input id="user-input-form-file" type="file" accept=".png,.jpg,.jpeg,.gif" ng-model="file_upload.user">',
            scope: {
                // table: '=',
                // column: '='
                create: '='
            },
            link: function(scope, element, attrs) {
                if(scope.$parent.user && scope.$parent.user.userAvatarBase64){
                    scope.$parent.user.userAvatarBase64 = null;
                }

                element.change(function(ev){
                    var file = ev.target.files[0];
                    if(!file || file === null) return;

                    if (file.type.match(/image\/*/) == null) {
                        $("#user-input-form-file").val("");
                        if(scope.$parent.user){
                            scope.$parent.user.userAvatarBase64 = null;
                        }
                        AlertService.error("admin.messages.errorTypeUpload");
                        return;
                    }

                    // file lớn hơn 20MB
                    if(file.size > 20 * 1024 * 1024) {
                        $("#user-input-form-file").val("");
                        AlertService.error('Ảnh không được vượt quá 20MB');
                        return;
                    }

                    // nếu là tạo mới thì k cần confirm
                    if(scope.create){
                        showAvatar(file);
                    } else{
                        UIkit.modal.confirm($translate.instant("global.messages.changeAvatar"), function () {
                            showAvatar(file);
                        }, {
                            labels: {
                                'Ok': $translate.instant("global.button.ok"),
                                'Cancel': $translate.instant("global.button.cancel2")
                            }
                        })
                    }
                });

                function showAvatar(file){
                    var reader = new FileReader();
                    reader.onload = function (e) {
                        scope.$apply(function () {
                            scope.$parent.user.userAvatarBase64 = e.target.result;
                        });
                    }
                    reader.readAsDataURL(file);
                }
            }
        };
    }])
    .directive('myEnter', ['AlertModalService', 'Trace', function (AlertModalService, Trace) {
        return function (scope, element, attrs) {
            // get URL trace
            var urlTrace = window.location.origin;
            Trace.getUrlTrace().then(function(data) {
                urlTrace = data.traceUrl;
            });

            element.bind("keydown keypress", function (event) {
                if(event.which === 13) {
                    var value = $(element).val();
                    // check xem phải là đường link hay không
                    // http://domain...
                    if(value.indexOf('://') > -1){
                        var urlOrigin = window.location.origin;
                        // check xem có đúng định dạng ban đầu không - hoặc check có cùng link với trace không
                        // đối với trường hợp máy barcode bị quét thiếu ký tự
                        var urlEnter = value.substring(0, urlOrigin.length);
                        var urlEnter2 = value.substring(0, urlTrace.length);

                        if(urlOrigin !== urlEnter && urlTrace !== urlEnter2){
                            AlertModalService.handleOneError("Tem quét vào không đúng định dạng, vui lòng quét lại");
                            event.preventDefault();
                            return;
                        }
                    }

                    scope.$apply(function (){
                        scope.$eval(attrs.myEnter);
                    });

                    event.preventDefault();
                }
            });
        };
    }])
    // approved
    .directive('approve', ['ErrorHandle','$state', function (ErrorHandle,$state, apiData) {
        return {
            restrict: 'EAC',
            replace: true,
            template: '' +
                '<div>' +
                '   <a data-uk-modal="{target:' + "'#modal_overflow'" + '}" \n' +
                '       class="md-btn md-btn-small md-btn-wave-light md-btn-icon md-bg-grey-100 custom-btn-active float-right"\n' +
                '       href="javascript:void(0)" data-uk-tooltip title="{{title}}">\n' +
                '           <i class="uk-icon-toggle-off uk-icon-medium uk-text-warning custom-cursor-pointer"></i>\n' +
                '               <span class="{{activeClass}} uk-text-bold" id="activeBtn" data-translate="{{status}}"></span>\n' +
                '   </a>' +
                '   <div id="modal_overflow" class="uk-modal">\n' +
                '       <div class="uk-modal-dialog">\n' +
                '           <button type="button" class="uk-modal-close uk-close uk-close-alt"></button>\n' +
                '           <h3>\n' +
                '               <label class="label-bold" >Cấp phép cho doanh nghiệp này sử dụng hệ thống Nông Nghiệp Thông Minh?<br></label>\n' +
                '           </h3>\n' +
                '           <div class="uk-modal-footer uk-text-right">\n' +
                '               <button type="button" class="md-btn md-btn-primary uk-modal-close" ng-click=statusAction(true)>Phê duyệt</button>\n' +
                '               <button type="button" class="md-btn  uk-modal-close" ng-click=statusAction(false)>Hủy đăng ký</button>\n' +
                '            </div>\n' +
                '        </div>\n' +
                '    </div>\n' +
                '</div>',
            scope: {
                model: '=',
                active: '=',
                activateService: '=',
                deactivateService: '='
            },
            link: function(scope, element, attrs) {
                scope.$watch('model', function(newModel){
                    if(!angular.isDefined(newModel)) return;
                    // đăng ký - không hđ - hoạt động
                    if(scope.active === undefined || scope.active == null){
                        scope.status = "global.common.register";
                        scope.title = "Đăng ký";
                        scope.activeClass = 'uk-text-warning';
                    } else if(scope.active === false){
                        scope.status = "global.common.inactive";
                        scope.title = "Không hoạt động";
                        scope.activeClass = 'uk-text-danger';
                    } else{
                        scope.status = "global.common.approved";
                        scope.title = "Hoạt động";
                        scope.activeClass = 'uk-text-success';
                    }

                    scope.statusAction = function(active) {
                        if(active){
                            scope.activateService(scope.model.id).then(function () {
                                newModel.active = true;
                                scope.active = true;
                            }).catch(function(data){
                                ErrorHandle.handleError(data);
                            });

                        } else {
                            scope.deactivateService(scope.model.id).then(function () {
                                newModel.active = false;
                                scope.active = false;
                                $state.go('organizations');
                            }).catch(function(data){
                                ErrorHandle.handleError(data);
                            });
                        }
                    }
                },true)
            }
        };
    }])
    // active filter
    .directive('typeSearchFilter', ['TableController','$timeout','$translate',function (TableController,$timeout,$translate) {
        return {
            restrict: 'EAC',
            replace: true,
            template: '<select id="activeFilter" kendo-combo-box\n' +
                '                    k-placeholder="label"\n' +
                '                    k-data-text-field="\'title\'"\n' +
                '                    k-data-value-field="\'value\'"\n' +
                '                    k-data-source="DataSource"\n' +
                '                    k-ng-model="ngmodel"\n' +
                '                    k-on-change="selectValue()"\n' +
                // '                    style="width: 200%;">\n' +
                '            </select>',
            scope: {
                label: '=',
                table: '=',
                fieldData: '='
            },
            link: function(scope, element, attrs) {
                scope.ngmodel = null;
                scope.DataSource = [];
                if(scope.fieldData){
                    scope.DataSource = scope.fieldData;
                } else{
                    scope.DataSource = [
                        {value: 0, title: $translate.instant('global.common.member')},
                        {value: 1, title: $translate.instant('global.common.partner')},
                        {value: 2, title: $translate.instant('global.common.location')}
                    ];
                }

                scope.selectValue = function () {
                    if(angular.isDefined(scope.ngmodel) && scope.ngmodel != null){
                        scope.table.filter['type'] = scope.ngmodel.value;
                        TableController.handleFilter(scope.table.tableId);
                    } else {
                        scope.table.filter['type'] = "";
                        TableController.reloadPage(scope.table.tableId);
                    }
                };

                var fabric = $("#activeFilter").data("kendoComboBox");
                fabric.input.attr("readonly", true).on("keydown", function(e) {
                    if (e.keyCode === 8) {
                        e.preventDefault();
                    }
                });
            }
        };
    }])
    .directive('roleType', ['TableController','$timeout','$translate',function (TableController,$timeout,$translate) {
        return {
            restrict: 'EAC',
            replace: true,
            template: '<select id="activeFilter" kendo-combo-box\n' +
                '                    k-placeholder="label"\n' +
                '                    k-data-text-field="\'title\'"\n' +
                '                    k-data-value-field="\'value\'"\n' +
                '                    k-data-source="DataSource"\n' +
                '                    k-ng-model="ngmodel"\n' +
                '                    k-on-change="selectValue()"\n' +
                // '                    style="width: 200%;">\n' +
                '            </select>',
            scope: {
                label: '=',
                table: '=',
                fieldData: '='
            },
            link: function(scope, element, attrs) {
                scope.ngmodel = null;
                scope.DataSource = [];
                if(scope.fieldData){
                    scope.DataSource = scope.fieldData;
                } else{
                    scope.DataSource = [
                        {value: 0, title: 'Tùy Chọn'},
                        {value: 1, title: 'Mặc Định'},
                    ];
                }

                scope.selectValue = function () {
                    if(angular.isDefined(scope.ngmodel) && scope.ngmodel != null){
                        scope.table.filter['type'] = scope.ngmodel.value;
                        TableController.handleFilter(scope.table.tableId);
                    } else {
                        scope.table.filter['type'] = "";
                        TableController.reloadPage(scope.table.tableId);
                    }
                };

                var fabric = $("#activeFilter").data("kendoComboBox");
                fabric.input.attr("readonly", true).on("keydown", function(e) {
                    if (e.keyCode === 8) {
                        e.preventDefault();
                    }
                });
            }
        };
    }])
    // active filter
    .directive('searchDefault', ['TableController','$translate', '$timeout',function ( TableController,$translate, $timeout) {
        return {
            restrict: 'EAC',
            replace: true,
            template: '<select id="searchDefault" kendo-combo-box\n' +
                '                    k-placeholder="label"\n' +
                '                    k-data-text-field="\'title\'"\n' +
                '                    k-data-value-field="\'value\'"\n' +
                '                    k-data-source="DataSource"\n' +
                '                    k-ng-model="ngmodel"\n' +
                '                    k-on-change="selectValue()"\n' +
                '            </select>',
            scope: {
                label: '=',
                table: '='
            },
            link: function(scope, element, attrs) {
                scope.abc = scope.ngmodel = null;
                scope.DataSource = [
                    {value: 1, title: $translate.instant("global.common.default")},
                    {value: 0, title: $translate.instant('global.common.additional')}
                ];

                scope.selectValue = function () {
                    if(angular.isDefined(scope.ngmodel) && scope.ngmodel != null){
                        scope.table.filter['isDefault'] = scope.ngmodel.value;
                        TableController.handleFilter(scope.table.tableId);
                    } else {
                        scope.table.filter['isDefault'] = "";
                        TableController.reloadPage(scope.table.tableId);
                    }
                };

                $timeout(function () {
                    var fabric = $("#searchDefault").data("kendoComboBox");
                    fabric.input.attr("readonly", true).on("focus", function(e) {
                        fabric.open();
                    });
                });
            }
        };
    }])
    .directive('commonSearch', ['TableController','$translate','$timeout',function ( TableController, $translate, $timeout) {
        return {
            restrict: 'E',
            replace: true,
            template: '<select id="commonSearch" kendo-combo-box\n' +
                '                    k-placeholder="label"\n' +
                '                    k-data-text-field="\'title\'"\n' +
                '                    k-data-value-field="\'value\'"\n' +
                '                    k-data-source="DataSource"\n' +
                '                    k-ng-model="ngmodel"\n' +
                '                    k-on-change="selectValue()"\n' +
                '            </select>',
            scope: {
                label: '=',
                table: '=',
                values: '=',
                field: '='
            },
            link: function(scope, element, attrs) {
                scope.ngmodel = null;
                var dataSource = [];
                var field = scope.field && scope.field != null ? scope.field : 'active';

                if(scope.values && scope.values != null) {
                    dataSource = scope.values;
                } else{
                    dataSource = [
                        {value: 1, title: $translate.instant('global.common.active')},
                        {value: 0, title: $translate.instant('global.common.inactive')}
                    ];
                }
                scope.DataSource = dataSource;

                scope.selectValue = function () {
                    //console.log(scope.table)
                    if(angular.isDefined(scope.ngmodel) && scope.ngmodel != null){
                        scope.table.filter[field] = scope.ngmodel.value;
                        TableController.handleFilter(scope.table.tableId);
                    } else {
                        scope.table.filter[field] = "";
                        TableController.reloadPage(scope.table.tableId);
                    }
                };

                $timeout(function () {
                    var fabric = $("#commonSearch").data("kendoComboBox");
                    fabric.enable(true);
                    // fabric.input.attr("readonly", true).on("click", function(e) {
                    //     fabric.open();
                    // });
                });
            }
        };
    }])
    .directive('overflowLongText', ['apiData',function (apiData) {
        return {
            restrict: 'EAC',
            replace: true,
            template: '<div class="{{classReturn}}" title="{{valueReturn}}">{{valueReturn}}</div>',
            scope: {
                value: '=',
                isInput: '='
            },
            link: function(scope, element, attrs) {
                scope.$watch('value', function(newVal) {
                    if(angular.isDefined(newVal)&& newVal != null) {
                        scope.valueReturn = scope.value;
                        // class for input
                        if(scope.isInput) scope.classReturn = 'custom-info longTextShowToolTipFullWidth';
                        // class for span
                        else scope.classReturn = 'longTextShowToolTip text-inline';
                    }
                }, true);
            }
        };
    }])
    .directive('inputLongText', ['apiData',function (apiData) {
        return {
            restrict: 'A',
            require: 'ngModel',
            scope: {
                ngModel:'&'
            },
            link: function(scope, element, attrs) {
                $(element).css({ 'text-overflow': 'ellipsis'});
                scope.$watch(scope.ngModel, function (value) {
                    if(!value) return;
                    $(element).attr('title', value);
                });
            }
        };
    }]);