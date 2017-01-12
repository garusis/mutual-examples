/**
 * Created by garusis on 10/12/16.
 */
;!(function (module) {
    module
        .provider('AppAuth', ['$httpProvider', '$localStorageProvider', function ($httpProvider, $localStorageProvider) {
            var token = $localStorageProvider.get('auth.token') || null;
            var _options = {
                headerToken: 'Authorization'
            };

            this.config = function (options) {
                _options = angular.extend(_options, options);
            };

            var AppAuth = {};

            AppAuth.assingHeaders = function (obj) {
                if (token) {
                    obj[_options.headerToken] = token;
                }
                return obj;
            };

            this.$get = ['$http', 'ROUTES', '$q', '$localStorage', function ($http, ROUTES, $q, $localStorage) {


                AppAuth.signup = function (data) {
                    return $http.post(ROUTES.USER, data);
                };
                AppAuth.login = function (data) {
                    return $http.post(ROUTES.USER + '/login?include=user', data)
                        .then(function (data) {
                            $localStorage['auth.token'] = token = data.id;
                            $localStorage['auth.userId'] = data.user.id;
                            return data;
                        });
                };
                AppAuth.loginAdmin = function (data) {
                    return $http.post(ROUTES.ADMIN + '/login?include=user', data)
                        .then(function (data) {
                            $localStorage['auth.token'] = token = data.id;
                            $localStorage['auth.userId'] = data.user.id;
                            return data;
                        });
                };
                AppAuth.confirm = function (uid, confirmToken) {
                    return $http.get(ROUTES.USER + '/confirm', {params: {uid: uid, token: confirmToken}});
                };
                AppAuth.isAuthenticated = function () {
                    return !!token;
                };
                AppAuth.logout = function () {
                    var deferred = $q.defer();
                    $http
                        .post(ROUTES.USER + '/logout')
                        .finally(function () {
                            token = null;
                            delete $localStorage['auth.token'];
                            delete $localStorage['auth.userId'];
                            return deferred.resolve();
                        });
                    return deferred.promise;
                };


                return AppAuth;
            }];

            $httpProvider.interceptors.push([function () {
                return {
                    request: function (config) {
                        AppAuth.assingHeaders(config.headers);
                        return config;
                    }
                }
            }]);

        }]);
})(angular.module('mutualexample'));