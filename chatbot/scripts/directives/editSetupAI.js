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

        controller: function($scope, $state, setupAIService) { 

                $scope.getWorkflows = function(){
                    setupAIService.GetWorkFlow().then(function (response) {
                        if (response.data !==0 ) {
                            $scope.workFlowNames = response.data;
                            console.log($scope.workFlowNames);
                        } else {
                            $scope.showAlert("Work Flows", 'error', "Fail To load work flows.");
                        }

                    }, function (error) {
                        $scope.showAlert("Work Flows", 'error', "Fail To load work flows.");
                    });  
                }
                $scope.getWorkflows();


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
