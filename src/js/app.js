/**
 * Created by garusis on 29/11/16.
 */
;!(function (module) {

    module.constant('ROUTES', {
        USER: '/app-user-accounts'
    });

    module
        .provider('OriginInterceptor', function ($httpProvider) {
            var _options = {
                origin: location.origin
            };

            this.config = function (options) {
                _options = angular.extend(_options, options);
            };

            this.$get = [function () {
                return {
                    request: function (config) {
                        if (!/\..*$/.test(config.url)) {
                            config.url = _options.origin + '/' + config.url;
                        }
                        return config;
                    },
                    response: function (response) {
                        return response;
                    }
                }
            }];

            $httpProvider.interceptors.push('OriginInterceptor');
        });

    module
        .config(['$stateProvider', '$urlRouterProvider',
            function ($stateProvider, $urlRouterProvider) {
                $urlRouterProvider.otherwise('/signup');

                $stateProvider.defineState = function (stateName, stateDefinition) {
                    if (!stateDefinition.params) {
                        stateDefinition.params = {};
                    }
                    stateDefinition.params.allowByAuth = false;

                    $stateProvider.state(stateName, stateDefinition);
                    return $stateProvider;
                };

                $stateProvider
                    .defineState('login', {
                        url: '/login',
                        templateUrl: 'tpl/login.html',
                        data: {
                            requireNoAuth: true
                        }
                    })
                    .defineState('signup', {
                        url: '/signup',
                        templateUrl: 'tpl/signup.html',
                        controller: 'SignupController',
                        controllerAs: 'signupCtrl',
                        data: {
                            requireNoAuth: true
                        }
                    })
                    .defineState('email-confirm', {
                        url: '/email-confirm',
                        templateUrl: 'tpl/email-confirm.html',
                        data: {
                            requireNoAuth: true
                        }
                    })
                    .defineState('home', {
                        url: '/home',
                        templateUrl: 'tpl/home.html',
                        data: {
                            requireAuth: true
                        }
                    });
            }])
        .config(['OriginInterceptorProvider', function (OriginInterceptorProvider) {
            OriginInterceptorProvider.config({
                origin: 'http://localhost:3000/api'
            });
        }])
        .run(['$rootScope', '$auth', '$state', function ($rootScope, $auth, $state) {
            $rootScope.$on('$stateChangeStart', function (event, toState, toParams) {
                var data = toState.data || {};
                if (toParams.allowByAuth || (_.isNil(data.requireNoAuth) && _.isNil(data.requireAuth))) return;

                event.preventDefault();
                if ($auth.isAuthenticated()) {
                    if (data.requireAuth) {
                        toParams.allowByAuth = true;
                        return $state.go(toState.name, toParams)
                    }
                    return $state.go('home');
                }

                if (data.requireNoAuth) {
                    toParams.allowByAuth = true;
                    return $state.go(toState.name, toParams)
                }
                $state.go('login');
            });
        }]);

})(angular.module('mutualexample', ['ionic', 'satellizer']));