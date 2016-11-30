/**
 * Created by garusis on 29/11/16.
 */
;!(function (module) {

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
        .config(['$stateProvider', '$urlRouterProvider', function ($stateProvider, $urlRouterProvider) {
            $urlRouterProvider.otherwise('/login');

            $stateProvider
                .state('login', {
                    url: '/login',
                    templateUrl: 'tpl/login.html'
                });
        }])
        .config(['OriginInterceptorProvider', function (OriginInterceptorProvider) {
            OriginInterceptorProvider.config({
                origin: 'http://mutual-back-dev.herokuapp.com'
            });
        }]);

})(angular.module('mutualexample', ['ionic']));