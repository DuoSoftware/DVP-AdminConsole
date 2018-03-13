/**
 * Created by divani on 9/3/2018.
 */
mainApp.directive("editsetupai", function ($filter, $uibModal, appBackendService, $state) {

    return {
        restrict: "EAA",
        scope: {
            setupai: "=",
            setupaiType: "=",
            setupaiTypes: "=",
            'updateSetupai': '&',
            'deleteSetupai': '&'
        },

        templateUrl: 'chatbot/views/partials/editSetupAI.html',

        link: function (scope) {

            scope.removeSetupai = function (item) {

                scope.showConfirm("Delete Setup AI", "Delete", "ok", "cancel", "Are you sure you want to delete " + item.workFlowName, function (obj) {
                    scope.deleteSetupai(scope.setupai);

                }, function () {

                }, item);
            };

            /* Start of Default methods*/

            scope.showConfirm = function (tittle, label, okbutton, cancelbutton, content, OkCallback, CancelCallBack, okObj) {

                (new PNotify({
                    title: tittle,
                    text: content,
                    icon: 'glyphicon glyphicon-question-sign',
                    hide: false,
                    confirm: {
                        confirm: true
                    },
                    buttons: {
                        closer: false,
                        sticker: false
                    },
                    history: {
                        history: false
                    }
                })).get().on('pnotify.confirm', function () {
                    OkCallback("confirm");
                }).on('pnotify.cancel', function () {

                });

            };

            scope.showAlert = function (title, content, type) {

                new PNotify({
                    title: title,
                    text: content,
                    type: type,
                    styling: 'bootstrap3'
                });
            };

            /* End of Default Methods */

        },

        controller: function($scope, $state) { 

                 $scope.workFlowNames=[
                {
                
                    "DateTime": "2018-02-16T10:10:27.660Z",
                    "Description": "CargillsFlowV2",
                    "DisplayName": "CargillsFlowV2",
                    "ID": "",
                    "Name": "kalanaduocargillsflowv2",
                    "UserName": "kalana@duosoftware.com",
                    "WFID": "a2FsYW5hZHVvLmRldi5zbW9vdGhmbG93LmlvLWU4NjQxNg",
                    "comment": null,
                    "version": "1"
                },
                {
                    
                    "DateTime": "2017-10-26T12:54:15.913Z",
                    "Description": "1",
                    "DisplayName": "wf17",
                    "ID": "a2FsYW5hZHVvLmRldi5zbW9vdGhmbG93LmlvLTA2ZmNmYQ",
                    "Name": "kalanaduo_wf17",
                    "UserName": "kalana@duosoftware.com",
                    "WFID": "a2FsYW5hZHVvLmRldi5zbW9vdGhmbG93LmlvLWJjMDhiZg",
                    "comment": "1",
                    "version": "1"
                },
                {
                    "DateTime": "2017-10-06T04:24:56.611Z",
                    "Description": "1",
                    "DisplayName": "wf12",
                    "ID": "a2FsYW5hZHVvLmRldi5zbW9vdGhmbG93LmlvLTA2ZWQ1Nw",
                    "Name": "kalanaduo_wf12",
                    "UserName": "kalana@duosoftware.com",
                    "WFID": "a2FsYW5hZHVvLmRldi5zbW9vdGhmbG93LmlvLTlmMjJiZg",
                    "comment": "1",
                    "version": "1"
                },
                {
                    "DateTime": "2017-11-17T05:52:32.337Z",
                    "Description": "18",
                    "DisplayName": "wf18",
                    "ID": "a2FsYW5hZHVvLmRldi5zbW9vdGhmbG93LmlvLTAyYmEzNw",
                    "Name": "kalanaduowf18",
                    "UserName": "kalana@duosoftware.com",
                    "WFID": "a2FsYW5hZHVvLmRldi5zbW9vdGhmbG93LmlvLTMwODIxYg",
                    "comment": "1",
                    "version": "1"
                }
                ];


                $scope.closeTemplate = function () {
                    $scope.editMode = false;
                    $scope.reloadPage();
                };


                $scope.reloadPage = function () {
                        $state.reload();
                };

                $scope.editSetupai = function (setupai) {
                  console.log(setupai);
                    $scope.editMode = true;
                };
        }
    }
});