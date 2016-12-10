/**
 * Created by garusis on 29/11/16.
 */
;!(function (module) {

    module.constant('ROUTES', {
        USER: 'app-user-accounts'
    });

    module
        .provider('OriginInterceptor', ['$httpProvider', function ($httpProvider) {
            var _options = {
                origin: location.origin
            };

            this.config = function (options) {
                _options = angular.extend(_options, options);
            };

            this.$get = ['$q', '$timeout', function ($q, $timeout) {
                function isStaticResource(url) {
                    return /\..*$/.test(url)
                }

                return {
                    request: function (config) {
                        if (!isStaticResource(config.url)) {
                            config.url = _options.origin + '/' + config.url;
                        }
                        return config;
                    },
                    response: function (response) {
                        if (isStaticResource(response.config.url)) {
                            return response;
                        }
                        return response.data;
                    }
                }
            }];

            $httpProvider.interceptors.push('OriginInterceptor');
        }]);

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
                        controller: 'LoginController',
                        controllerAs: 'loginCtrl',
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
                        controller: 'ConfirmController',
                        controllerAs: 'confCtrl',
                        data: {
                            requireNoAuth: true
                        }
                    })
                    .defineState('home', {
                        url: '/home',
                        templateUrl: 'tpl/home.html',
                        controller:'HomeController',
                        controllerAs:'homeCtrl',
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
        .run(['$rootScope', 'AppAuth', '$state', function ($rootScope, AppAuth, $state) {
            $rootScope.$on('$stateChangeStart', function (event, toState, toParams) {
                var data = toState.data || {};
                if (toParams.allowByAuth || (_.isNil(data.requireNoAuth) && _.isNil(data.requireAuth))) return;

                event.preventDefault();
                if (AppAuth.isAuthenticated()) {
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

})(angular.module('mutualexample', ['ionic', 'ngStorage']));