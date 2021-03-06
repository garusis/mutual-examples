/**
 * Created by garusis on 29/11/16.
 */
;!(function (module) {
    module
        .controller('UploadController', ['$scope', 'AppAuth', '$state', 'FileUploader', 'ROUTES',
            function ($scope, AppAuth, $state, FileUploader, ROUTES) {
                var upCtrl = this;
                var vm = upCtrl.vm = {};

                var uploader = vm.uploader = new FileUploader({
                    scope: $scope,                          // to automatically update the html. Default: $rootScope
                    url: ROUTES.ROOT + '/' + ROUTES.UPLOAD.ICONS + '/upload',
                    formData: [
                        {key: 'value'}
                    ],
                    headers: AppAuth.assingHeaders({})
                });

                // ADDING FILTERS
                uploader.filters.push({
                    name: 'filterName',
                    fn: function (item, options) { // second user filter
                        console.info('filter2');
                        return true;
                    }
                });

                // REGISTER HANDLERS
                // --------------------
                uploader.onAfterAddingFile = function (item) {
                    console.info('After adding a file', item);
                };
                // --------------------
                uploader.onAfterAddingAll = function (items) {
                    console.info('After adding all files', items);
                };
                // --------------------
                uploader.onWhenAddingFileFailed = function (item, filter, options) {
                    console.info('When adding a file failed', item);
                };
                // --------------------
                uploader.onBeforeUploadItem = function (item) {
                    console.info('Before upload', item);
                };
                // --------------------
                uploader.onProgressItem = function (item, progress) {
                    console.info('Progress: ' + progress, item);
                };
                // --------------------
                uploader.onProgressAll = function (progress) {
                    vm.progress = progress;
                };
                // --------------------
                uploader.onSuccessItem = function (item, response, status, headers) {
                    console.info('Success', response, status, headers);
                    $scope.$broadcast('uploadCompleted', item);
                };
                // --------------------
                uploader.onErrorItem = function (item, response, status, headers) {
                    console.info('Error', response, status, headers);
                };
                // --------------------
                uploader.onCancelItem = function (item, response, status, headers) {
                    console.info('Cancel', response, status);
                };
                // --------------------
                uploader.onCompleteItem = function (item, response, status, headers) {
                    console.info('Complete', response, status, headers);
                };
                // --------------------
                uploader.onCompleteAll = function () {
                    console.info('Complete all');
                    $state.go('files');
                };
                // --------------------

            }]);
})(angular.module('mutualexample'));