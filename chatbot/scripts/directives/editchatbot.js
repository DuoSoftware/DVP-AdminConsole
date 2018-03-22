/**
 * Created by lakmini on 26/01/2018.
 */
mainApp.directive("editachatbot", function ($filter, $uibModal, chatbotService, integrationsService, botappconfigService, whitelistconfigService) {

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

            scope.copyBotID = function (cardID) {
                var id = cardID;

                var copyText = document.getElementById(id);
                copyText.select();
                document.execCommand("Copy");

                // window.getSelection().empty();
                // var copyField = document.getElementById(id);
                // var range = document.createRange();
                // range.selectNode(copyField);
                // window.getSelection().addRange(range);
                // document.execCommand('copy');
                scope.showAlert("Bot ID", 'Bot ID copied to clipboard.', "success");
            }

            scope.editbotdetails = function () {
                $(".sortable").sortable({

                    stop: function (event, ui) {
                        scope.order = [];
                        $(".sortable li").each(function (i, el) {
                            var OrderedBots = JSON.parse(el.id);
                            OrderedBots.order = i;
                            OrderedBots.aid = OrderedBots._id;
                            delete OrderedBots._id;
                            scope.order.push(OrderedBots);
                        })

                        scope.updatebotapps(scope.order);

                    }
                });
                $(".sortable").disableSelection();
                scope.getallBotApps(scope.bot._id);
                scope.getwhitelisturl(scope.bot._id);
                scope.editMode = !scope.editMode;
            };
            scope.editbotappdetails = function (botapp) {
                debugger
                scope.botappedit = !scope.botappedit;
                scope.selectedBot = botapp;
            };
            // bot details update method
            scope.modifyBotDetails = function (bot) {
                //delete bot._id;
                chatbotService.UpdateChatbot(bot).then(function (response) {
                    if (response) {
                        scope.showAlert("ChatBot", 'Bot Update Successfully.', "success");

                    } else {
                        scope.showAlert("ChatBot", 'Fail To Update Bot.', "error");
                    }

                }, function (error) {
                    scope.showAlert("ChatBot", 'Fail To Update Bot.', "error");

                });
            }
            //Selected bot delete method
            scope.deleteBot = function (bot) {
                console.log("deleteBot");
                scope.showConfirm("Delete Bot", "Delete", "ok", "cancel", "Do you want to delete " + bot.screen_name, function (obj) {
                    chatbotService.DeleteChatbot(bot).then(function (response) {
                        if (response.data.IsSuccess) {
                            scope.showAlert("ChatBot", 'Bot Delete Successfully.', "success");
                            scope.reloadpage();
                        } else {
                            scope.showAlert("ChatBot", 'Fail To Delete Bot.', "error");
                        }

                    }, function (error) {
                        scope.showAlert("ChatBot", '"Fail To Delete Bot.', "error");

                    });
                }, function () {

                }, bot);

            };


            scope.BotIntegrations = function (configDetails, appmodule) {
                integrationsService.ConfigApp(configDetails, appmodule).then(function (response) {
                    if (response.data.IsSuccess) {
                        scope.showAlert("ChatBot Integrations", 'Bot Integrations Created Successfully.', "success");
                    } else {
                        scope.showAlert("ChatBot Integrations", 'Fail Integrations To Created Bot.', "error");
                    }

                }, function (error) {
                    scope.showAlert("ChatBot Integrations", 'Fail Integrations To Created Bot.', "error");
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
                        for (var index = 0; index < response.data.Result.length; index++) {
                            if (id == response.data.Result[index].bot_id) {
                                scope.slectedConfig.push(response.data.Result[index]);
                            }
                        }
                        console.log(scope.slectedConfig);
                    } else {
                        scope.showAlert("Bot Apps", 'Fail To load Bot Apps.', "error");
                    }

                }, function (error) {
                    scope.showAlert("Bot Apps", 'Fail To load Bot Apps.', "error");
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
                    "config": {
                        "Securitykey": "<key>"
                    }
                }
                botappconfigService.SavenewBotApp(newbotapp).then(function (response) {
                    if (response.data.IsSuccess) {
                        scope.getallBotApps(scope.bot._id);
                        scope.botappedit = false;
                        scope.showAlert("Bot Apps", 'Added new Bot app.', "success");
                    } else {
                        scope.showAlert("Bot Apps", 'Fail To Save Bot Apps.', "error");
                    }

                }, function (error) {
                    scope.showAlert("Bot Apps", 'Fail To Save Bot Apps.', "error");
                });
            }

            //update bot app
            scope.updatebotapp = function (botapp) {
                debugger
                var id = botapp._id;
                // delete botapp._id;
                botappconfigService.UpdateBotApp(botapp, id).then(function (response) {
                    if (response.data.IsSuccess) {
                        scope.botappedit = false;
                        scope.showAlert("Bot Apps", 'Bot App Updated Successfully.', "success");
                    } else {
                        scope.showAlert("Bot Apps", 'Fail To Update Bot Apps.', "error");
                    }

                }, function (error) {
                    scope.showAlert("Bot Apps", 'Fail To Update Bot Apps.', "error");
                });
            };

            //update bot apps 
            scope.updatebotapps = function (botapps) {
                botappconfigService.UpdateBotApps(botapps).then(function (response) {
                    if (response.data.IsSuccess) {

                        scope.getallBotApps(scope.bot._id);
                        scope.showAlert("Bot Apps", 'Bot App Updated Successfully.', "success");
                    } else {
                        scope.showAlert("Bot Apps", 'Fail To Update Bot Apps.', "error");
                    }

                }, function (error) {
                    scope.showAlert("Bot Apps", 'Fail To Update Bot Apps.', "error");
                });
            };
            //Delete bot app 
            scope.deletebotapp = function (bot) {
                botappconfigService.DeleteBotApp(botapp._id).then(function (response) {
                    if (response.data.IsSuccess) {

                        scope.getallBotApps(scope.bot._id);
                        scope.showAlert("Bot Apps", 'Bot App Deleted Successfully.', "success");
                    } else {
                        scope.showAlert("Bot Apps", 'Fail To Deleted Bot Apps.', "error");
                    }

                }, function (error) {
                    scope.showAlert("Bot Apps", 'Fail To Deleted Bot Apps.', "error");
                });
            }
            //get facebook whitelist
            scope.getwhitelisturl = function (botid) {
                whitelistconfigService.GetAllWhitelist(scope.bot._id).then(function (response) {
                    if (response.data.IsSuccess) {
                        scope.urllist = response.data.Result;
                    }
                    //  else {
                    //     scope.showAlert("white list", 'error', "Fail To Load Url.");
                    // }

                }, function (error) {
                    scope.showAlert("White list", 'error', "Fail To Load Url.");
                });
            }
            //add facebook whitelist
            scope.addnewurl = function (url) {

                var isvalid = scope.urllist.findIndex(x => x == url);
                if (isvalid == -1) {
                    scope.urllist.push(url);
                    var jsonurl = { "urls": scope.urllist };
                    whitelistconfigService.AddWhitelist(jsonurl, scope.bot._id).then(function (response) {
                        if (response.data.IsSuccess) {
                            scope.url = "";
                            scope.getwhitelisturl(scope.bot._id);
                        } else {
                            scope.showAlert("White list", 'Fail To Added Url.', "error");
                        }

                    }, function (error) {
                        scope.showAlert("White list", 'Fail To Added Url.', "error");
                    });
                } else { scope.showAlert("White list", 'Already added to list', "error"); }

            }
            //Delete facebook whitelist
            scope.deleteurl = function (url) {

                scope.showConfirm("Delete URL", "Delete", "ok", "cancel", "Do you want to delete " + url, function (obj) {
                    var urlindex = scope.urllist.findIndex(x => x == url);
                    scope.urllist.splice(urlindex, 1);

                    var jsonurl = { "urls": scope.urllist };
                    whitelistconfigService.AddWhitelist(jsonurl, scope.bot._id).then(function (response) {
                        if (response.data.IsSuccess) {

                            scope.getwhitelisturl(scope.bot._id);
                        } else {
                            scope.showAlert("White list", 'Fail To Delete Url.', "error");
                        }

                    }, function (error) {
                        scope.showAlert("White list", 'Fail To Delete Url.', "error");
                    });

                }, function () {

                }, url);
            }
        }
    }

})