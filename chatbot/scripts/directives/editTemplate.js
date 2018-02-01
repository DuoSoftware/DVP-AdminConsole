/**
 * Created by Shehan on 26/1/2018.
 */
mainApp.directive("edittemplate", function ($filter, $uibModal, appBackendService) {

    return {
        restrict: "EAA",
        scope: {
            template: "=",
            'updateTemplate': '&',
            'deleteTemplate': '&'
        },

        templateUrl: 'chatbot/views/partials/editTemplate.html',

        link: function (scope) {

            scope.editTemplate = function () {
                scope.editMode = !scope.editMode;
            };

            scope.removeCard = function (index) {
                scope.template.items.splice(index, 1);
            }

            scope.addNewCard = function () {
                scope.template.items.push({
                    buttons: [],
                    default_action: {
                        url: ""
                    },
                    image_url: "",
                    sub_title: "",
                    title: "<new card>"
                });
            }

            scope.copyCardID = function (cardID) {
                
                var id = cardID;
                window.getSelection().empty();
                var copyField = document.getElementById(id);
                var range = document.createRange();
                range.selectNode(copyField);
                window.getSelection().addRange(range);
                document.execCommand('copy');
                scope.showAlert("Card ID", 'Card ID copied to clipboard.', "success");

                // var copyElement = document.createElement("textarea");
                // copyElement.style.position = 'fixed';
                // copyElement.style.opacity = '0';
                // copyElement.textContent = cardID;
                // var body = document.getElementsByTagName('body')[0];
                // body.appendChild(copyElement);
                // copyElement.select();
                // document.execCommand('copy');
                // body.removeChild(copyElement);
                // row.copied = true;
                // var urlheaders = document.getElementsByClassName('url-header');
                // $('<span class="dynamic-state-pill">Copied</span>').appendTo(urlheaders[index]);
                // setTimeout(function () {
                //     $('.dynamic-state-pill').remove();
                // }, 1000);
            }

            scope.removeTemplate = function (item) {

                scope.showConfirm("Delete Template", "Delete", "ok", "cancel", "Are you sure you want to delete " + item.name, function (obj) {

                    scope.deleteTemplate(scope.template);
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