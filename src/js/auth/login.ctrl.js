/**
 * Created by garusis on 29/11/16.
 */
;!(function (module) {
    module
        .controller('LoginController', ['AppAuth', '$state',
            function (AppAuth, $state) {
                var loginCtrl = this;
                var vm = loginCtrl.vm = {};

                vm.loginData = {};

                loginCtrl.login = function (data) {
                    AppAuth
                        .login(data)
                        .then(function (response) {
                            alert('Logueado :D');
                            $state.go('home');
                        })
                        .catch(function (error) {
                            alert('error.');
                            console.log(error);
                        });
                };

            }]);
})(angular.module('mutualexample'));