/**
 * Created by Shehan on 29/1/2018.
 */
mainApp.directive("workflow", function ($filter, $uibModal, appBackendService) {

    return {
        restrict: "EAA",
        scope: {
            wfdata: "=",
            'editWf': '&',
        },

        templateUrl: 'chatbot/views/partials/workflow.html',

        link: function (scope) {
            scope.mode = "view";
            scope.changeMode = function (mode) {
                scope.mode = mode
            };

            scope.editWorkflow = function(data){
                debugger
                scope.editWF(data);
            }

        }

    }
});