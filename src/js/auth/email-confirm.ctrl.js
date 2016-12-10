/**
 * Created by garusis on 29/11/16.
 */
;!(function (module) {
    module
        .controller('ConfirmController', ['AppAuth', '$state',
            function (AppAuth, $state) {
                var confCtrl = this;
                var vm = confCtrl.vm = {};

                vm.confirmData = {};

                confCtrl.confirm = function (data) {
                    AppAuth
                        .confirm(data.uid, data.token)
                        .then(function (response) {
                            alert('Correo confirmado.');
                            $state.go('login');
                        })
                        .catch(function (error) {
                            alert('error.');
                            console.log(error);
                        });
                };

            }]);
})(angular.module('mutualexample'));