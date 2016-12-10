/**
 * Created by garusis on 10/12/16.
 */
;!(function (module) {
    module
        .factory('AppAuth', ['$http', 'ROUTES', function ($http, ROUTES) {

            var AppAuth = {};

            AppAuth.signup = function (data) {
                return $http.post(ROUTES.USER, data);
            };

            return AppAuth;
        }]);
})(angular.module('mutualexample'));