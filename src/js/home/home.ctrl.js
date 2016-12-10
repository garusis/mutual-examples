/**
 * Created by garusis on 29/11/16.
 */
;!(function (module) {
    module
        .controller('HomeController', ['AppAuth', '$state',
            function (AppAuth, $state) {
                var homeCtrl = this;
                homeCtrl.logout = function (data) {
                    AppAuth
                        .logout()
                        .then(function (response) {
                            alert('sesión cerrada');
                            $state.go('login');
                        })
                        .catch(function (error) {
                            alert('error.');
                            console.log(error);
                        });
                };

            }]);
})(angular.module('mutualexample'));