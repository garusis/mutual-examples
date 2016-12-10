/**
 * Created by garusis on 29/11/16.
 */
;!(function (module) {
    module
        .controller('SignupController', ['AppAuth', '$state',
            function (AppAuth, $state) {
                var signupCtrl = this;
                var vm = signupCtrl.vm = {};

                vm.signupData = {};

                signupCtrl.signup = function (data) {
                    AppAuth
                        .signup(data)
                        .then(function (response) {
                            alert('Registrado, revise su correo para confirmar el email.');
                            $state.go('email-confirm');
                            console.log(response);
                        })
                        .catch(function (error) {
                            alert('error.');
                            console.log(error);
                        });
                };

            }]);
})(angular.module('mutualexample'));