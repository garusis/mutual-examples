/**
 * Created by garusis on 10/12/16.
 */
;!(function (module) {
    module
        .factory('Home', ['$http', 'ROUTES', '$q', '$localStorage', function ($http, ROUTES, $q, $localStorage) {
            var Home = {};

            Home.getFiles = function (container) {
                return $http.get(ROUTES.UPLOAD[container] + '/files')
                    .then(function (files) {
                        return _.map(files, function (file) {
                            return {
                                name: file.name,
                                url: ROUTES.ROOT + '/' + ROUTES.UPLOAD.ROOT + '/' + file.container + '/download/' + file.name
                            };
                        });
                    });
            };

            return Home;
        }]);
})(angular.module('mutualexample'));