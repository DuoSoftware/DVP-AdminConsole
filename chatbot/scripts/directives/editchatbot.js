/**
 * Created by lakmini on 26/01/2018.
 */
mainApp.directive("editachatbot", function ($filter, $uibModal, chatbotService) {

    return {
        restrict: "EAA",
        scope: {
            bot: "=",
            botDesc: "=",
            'updatebot': '&',
            'reloadpage': '&'
        },

        templateUrl: 'chatbot/views/partials/editbotdetails.html',
        link: function (scope) {

            console.log(scope.bot.name);
            scope.editMode = false;

            scope.editbotdetails = function () {
                scope.editMode = !scope.editMode;
                console.log(scope.bot);
            };
            // bot details update method
            scope.modifyBotDetails = function (bot) {

                chatbotService.UpdateChatbot(bot).then(function (response) {
                    if (response) {
                        scope.showAlert("ChatBot", 'success', "Bot Update Successfully.");

                    } else {
                        scope.showAlert("ChatBot", 'error', "Fail To Update Bot.");
                    }

                }, function (error) {
                    scope.showAlert("ChatBot", 'error', "Fail To Update Bot.");

                });
            }
            //Selected bot delete method
            scope.deleteBot = function (bot) {
                console.log("deleteBot");
                scope.showConfirm("Delete Bot", "Delete", "ok", "cancel", "Do you want to delete " + bot.screen_name, function (obj) {
                    chatbotService.DeleteChatbot(bot).then(function (response) {
                        if (response) {
                            scope.showAlert("ChatBot", 'success', "Bot Delete Successfully.");

                        } else {
                            scope.showAlert("ChatBot", 'error', "Fail To Delete Bot.");
                        }

                    }, function (error) {
                        scope.showAlert("ChatBot", 'error', "Fail To Delete Bot.");

                    });
                }, function () {

                }, bot);

            };
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

        }
    }

})