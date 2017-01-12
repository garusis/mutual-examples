/**
 * Created by garusis on 29/11/16.
 */
;!(function (module) {

    module.constant('ROUTES', {
        ROOT: 'http://localhost:3000/api',
        USER: 'app-user-accounts',
        ADMIN: 'admin-accounts',
        UPLOAD: {
            ROOT: 'files',
            ICONS: 'files/icons',
            IMAGES: 'files/images'
        }
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
                        config.isStaticResource = isStaticResource(config.url);
                        if (!config.isStaticResource) {
                            config.url = _options.origin + '/' + config.url;
                        }
                        return config;
                    },
                    response: function (response) {
                        if (response.config.isStaticResource) {
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
                    .defineState('login_admin', {
                        url: '/login_admin',
                        templateUrl: 'tpl/login.html',
                        controller: 'LoginAdminController',
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
                    .defineState('upload', {
                        url: '/upload',
                        templateUrl: 'tpl/upload.html',
                        controller: 'UploadController',
                        controllerAs: 'upCtrl',
                        data: {
                            requireAuth: true
                        }
                    })
                    .defineState('files', {
                        url: '/files',
                        templateUrl: 'tpl/files_list.html',
                        controller: 'FilesController',
                        controllerAs: 'fileCtrl',
                        data: {
                            requireAuth: true
                        }
                    })
                    .defineState('home', {
                        url: '/home',
                        templateUrl: 'tpl/home.html',
                        controller: 'HomeController',
                        controllerAs: 'homeCtrl',
                        data: {
                            requireAuth: true
                        }
                    });
            }])
        .config(['OriginInterceptorProvider', 'ROUTES', function (OriginInterceptorProvider, ROUTES) {
            OriginInterceptorProvider.config({
                origin: ROUTES.ROOT
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

})(angular.module('mutualexample', ['ionic', 'ngStorage', 'angularFileUpload']));