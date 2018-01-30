/**
 * Created by Shehan on 30/1/2018.
 */
mainApp.directive("cardbutton", function ($filter, $uibModal, appBackendService) {

    return {
        restrict: "EAA",
        scope: {
            button: "=",
            'addNewButton': '&'
        },
        templateUrl: 'chatbot/views/partials/cardbutton.html',
        link: function (scope) {
            scope.mode = "view"
            if(scope.button == undefined){
                scope.mode = "new"
            }else{
                scope.mode = "view"
            }
            scope.changeMode = function (mode) {
                scope.mode = mode
            };

            scope.getnewButtonObject = function () {
                return {
                    other_data: {
                        url: ""
                    },
                    payload: {
                        message: ""
                    },
                    title: "",
                    type: "postback"
                }
            }

            scope.newButton = function(){
                scope.button = scope.getnewButtonObject();
                scope.changeMode("edit");
            }

            scope.addNewButton = function(){

            }

        }

    }
});