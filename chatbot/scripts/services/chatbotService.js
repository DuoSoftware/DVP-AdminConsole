/**
 * Created by Lakmini on 01/25/2018.
 */

'use strict';
mainApp.factory("chatbotService", function ($http, $log, $filter, authService, baseUrls) {

    var createChatbot = function (bot) {

        return $http({
            method: 'POST',
            url: baseUrls.botAPIUrl + "Bot/",            
            data: bot
        }).then(function (response) {
            if (response.data && response.data.IsSuccess) {
                return response;
            } else {
                return response;
            }

        });
    };
    var getAllChatbots = function () {

        return $http({
            method: 'GET',
            url: baseUrls.botAPIUrl + "Bots/",           
        }).then(function (response) {
            if (response.data && response.data.IsSuccess) {
                return response;
            } else {
                return response;
            }

        });
    };
    var updateChatbot = function (bot) {
        return $http({
            method: 'PUT',
            url: baseUrls.botAPIUrl + "Bot/" + bot._id,           
            data: bot
        }).then(function (response) {
            if (response.data && response.data.IsSuccess) {
                return response;
            } else {
                return response;
            }

        });

    };
    var deleteChatbot = function (bot) {
        return $http({
            method: 'DELETE',
            url: baseUrls.botAPIUrl + "Bot/" + bot._id,          
        }).then(function (response) {
            if (response.data && response.data.IsSuccess) {
                return response;
            } else {
                return response;
            }

        });

    };
    return {
        CreateChatbot: createChatbot,
        GetAllChatbots: getAllChatbots,
        UpdateChatbot: updateChatbot,
        DeleteChatbot: deleteChatbot
    }
});