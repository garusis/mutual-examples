/**
 * Created by garusis on 29/11/16.
 */
;!(function (module) {
    module
        .controller('LoginAdminController', ['AppAuth', '$state',
            function (AppAuth, $state) {
                var loginCtrl = this;
                var vm = loginCtrl.vm = {};

                vm.loginData = {};

                loginCtrl.login = function (data) {
                    AppAuth
                        .loginAdmin(data)
                        .then(function (response) {
                            alert('Logueado :D');
                            $state.go('upload');
                        })
                        .catch(function (error) {
                            alert('error.');
                            console.log(error);
                        });
                };

            }]);
})(angular.module('mutualexample'));