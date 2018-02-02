/**
 * Created by lakmini on 26/01/2018.
 */
mainApp.directive("editachatbot", function ($filter, $uibModal, chatbotService, integrationsService, botappconfigService) {

    return {
        restrict: "EAA",
        scope: {
            bot: "=",
            allbots: "=",
            'updatebot': '&',
            'reloadpage': '&'
        },

        templateUrl: 'chatbot/views/partials/editbotdetails.html',
        link: function (scope) {

            scope.editMode = false;
            scope.botappedit = false;

            scope.editbotdetails = function () {
                $("#sortable").sortable();
                $("#sortable").disableSelection();
                scope.getallBotApps(scope.bot._id);
                scope.editMode = !scope.editMode;
            };
            scope.editbotappdetails = function (botapp) {
                scope.botappedit = !scope.botappedit;
                scope.selectedBot = botapp;
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
                        if (response.data.IsSuccess) {
                            scope.showAlert("ChatBot", 'success', "Bot Delete Successfully.");
                            scope.reloadpage();
                        } else {
                            scope.showAlert("ChatBot", 'error', "Fail To Delete Bot.");
                        }

                    }, function (error) {
                        scope.showAlert("ChatBot", 'error', "Fail To Delete Bot.");

                    });
                }, function () {

                }, bot);

            };


            scope.BotIntegrations = function (configDetails, appmodule) {
                integrationsService.ConfigApp(configDetails, appmodule).then(function (response) {
                    if (response.data.IsSuccess) {
                        scope.showAlert("ChatBot Integrations", 'success', "Bot Integrations Created Successfully.");
                    } else {
                        scope.showAlert("ChatBot Integrations", 'error', "Fail Integrations To Created Bot.");
                    }

                }, function (error) {
                    scope.showAlert("ChatBot Integrations", 'error', "Fail Integrations To Created Bot.");
                });
            }
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


            //get all bots apps for mathch with current bot
            scope.getallBotApps = function (id) {
                scope.slectedConfig = [];
                botappconfigService.GetAllBotApps().then(function (response) {
                    if (response.data.IsSuccess) {
                        debugger;
                        for (var index = 0; index < response.data.Result.length; index++) {
                            if (id == response.data.Result[index].bot_id) {
                                scope.slectedConfig.push(response.data.Result[index]);
                            }
                        }
                        console.log(scope.slectedConfig);
                    } else {
                        scope.showAlert("Bot Apps", 'error', "Fail To load Bot Apps.");
                    }

                }, function (error) {
                    scope.showAlert("Bot Apps", 'error', "Fail To load Bot Apps.");
                });
            }
            //add new bot app
            scope.addnewBotApp = function (botapp) {

                var newbotapp = {
                    "company": -1,
                    "tenant": -1,
                    "bot_id": scope.bot._id,
                    "app": botapp.app,
                    "order": 0,
                    "config": {}
                }
                botappconfigService.SavenewBotApp(newbotapp).then(function (response) {
                    if (response.data.IsSuccess) {
                        scope.getallBotApps(scope.bot._id);
                        scope.botappedit = false;
                    } else {
                        scope.showAlert("Bot Apps", 'error', "Fail To Save Bot Apps.");
                    }

                }, function (error) {
                    scope.showAlert("Bot Apps", 'error', "Fail To Save Bot Apps.");
                });
            }

            //update bot app
            scope.updatebotapp = function (botapp) {
                botappconfigService.UpdateBotApp(botapp, scope.bot._id).then(function (response) {
                    if (response.data.IsSuccess) {
                        scope.botappedit = false;
                        scope.showAlert("Bot Apps", 'success', "Bot App Updated Successfully.");
                    } else {
                        scope.showAlert("Bot Apps", 'error', "Fail To Update Bot Apps.");
                    }

                }, function (error) {
                    scope.showAlert("Bot Apps", 'error', "Fail To Update Bot Apps.");
                });
            }
        }
    }

})