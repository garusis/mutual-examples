/**
 * Created by garusis on 29/11/16.
 */
;!(function (module) {
    module
        .controller('FilesController', ['$state', '$scope', 'ROUTES', 'Home',
            function ($state, $scope, ROUTES, Home) {
                var fileCtrl = this;
                var vm = fileCtrl.vm = {};

                vm.files = [];

                $scope.$on('$stateChangeSuccess', function (event, toState) {
                    if (toState.name === 'files') {
                        Home.getFiles('ICONS')
                            .then(function (files) {
                                vm.files= files;
                            });
                    }
                });

            }]);
})(angular.module('mutualexample'));