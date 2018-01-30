/**
 * Created by Shehan on 30/1/2018.
 */
mainApp.directive("cardbutton", function ($filter, $uibModal, appBackendService) {

    return {
        restrict: "EAA",
        scope: {
            button: "=",
            buttons: "=",
            'removeButton': '&'
        },
        templateUrl: 'chatbot/views/partials/cardbutton.html',
        link: function (scope) {
            scope.mode = "view"
            // if (scope.button == undefined) {
            //     scope.mode = "new"
            // } else {
            //     scope.mode = "view"
            // }
            scope.changeMode = function (mode) {
                scope.mode = mode
            };

            

            scope.newButton = function () {
                debugger
                //scope.button = scope.getnewButtonObject();
                scope.button = {};
                scope.changeMode("edit");
            }

            scope.removeButtonfromList = function () {
                // scope.removeButton(button);
                scope.buttons.splice(0, 1);
            }

        }

    }
});