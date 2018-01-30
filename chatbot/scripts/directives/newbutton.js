/**
 * Created by Shehan on 29/1/2018.
 */
mainApp.directive("newbutton", function ($filter, $uibModal, appBackendService) {

    return {
        restrict: "EAA",
        scope: {
            'updateApplication': '&'
        },

        templateUrl: 'chatbot/views/partials/newbutton.html',

        link: function (scope) {

            scope.getnewButtonObject = function () {
                return {
                    other_data: {
                        url: "https://www.pizzahut.lk"
                    },
                    payload: {
                        message: "Small Cheese pizza"
                    },
                    title: "Small (Rs.450)",
                    type: "postback"
                }
            }

            scope.getnewCardObject = function () {
                return {
                    buttons: [scope.getnewButtonObject()],
                    default_action: {
                        url: ""
                    },
                    image_url: "",
                    sub_title: "",
                    title: ""
                }
            }

            scope.newCard = scope.getnewCardObject();

            scope.editCard = function () {
                scope.editMode = !scope.editMode;
            };

            scope.removeTemplate = function (item) {

                scope.showConfirm("Delete Template", "Delete", "ok", "cancel", "Are you sure you want to delete " + item.name, function (obj) {

                    // appBackendService.deleteApplication(scope.application).then(function (response) {
                    //     if (response) {
                    //         scope.updateApplication(item);
                    //         scope.showAlert("Deleted","File " + item.AppName + " Deleted successfully","success");
                    //     }
                    //     else
                    //         scope.showAlert("Error", "Error in file removing", "error");
                    // }, function (error) {
                    //     scope.showAlert("Error", "Error in file removing", "error");
                    // });

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

        }

    }
});