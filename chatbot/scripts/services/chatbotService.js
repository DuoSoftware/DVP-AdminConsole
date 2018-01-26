/**
 * Created by Lakmini on 01/25/2018.
 */

'use strict';
mainApp.factory("chatbotService", function ($http, $log, $filter, authService, baseUrls) {

    var createChatbot = function (bot) {

        return $http({
            method: 'POST',
            url: baseUrls.botAPIUrl + "Bot/",
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJzdWtpdGhhIiwianRpIjoiYWEzOGRmZWYtNDFhOC00MWUyLTgwMzktOTJjZTY0YjM4ZDFmIiwic3ViIjoiNTZhOWU3NTlmYjA3MTkwN2EwMDAwMDAxMjVkOWU4MGI1YzdjNGY5ODQ2NmY5MjExNzk2ZWJmNDMiLCJleHAiOjE5MDIzODExMTgsInRlbmFudCI6LTEsImNvbXBhbnkiOi0xLCJzY29wZSI6W3sicmVzb3VyY2UiOiJhbGwiLCJhY3Rpb25zIjoiYWxsIn1dLCJpYXQiOjE0NzAzODExMTh9.Gmlu00Uj66Fzts-w6qEwNUz46XYGzE8wHUhAJOFtiRo',
                'companyInfo': '1:103'
            },
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
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': 'bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJzdWtpdGhhIiwianRpIjoiYWEzOGRmZWYtNDFhOC00MWUyLTgwMzktOTJjZTY0YjM4ZDFmIiwic3ViIjoiNTZhOWU3NTlmYjA3MTkwN2EwMDAwMDAxMjVkOWU4MGI1YzdjNGY5ODQ2NmY5MjExNzk2ZWJmNDMiLCJleHAiOjE5MDIzODExMTgsInRlbmFudCI6LTEsImNvbXBhbnkiOi0xLCJzY29wZSI6W3sicmVzb3VyY2UiOiJhbGwiLCJhY3Rpb25zIjoiYWxsIn1dLCJpYXQiOjE0NzAzODExMTh9.Gmlu00Uj66Fzts-w6qEwNUz46XYGzE8wHUhAJOFtiRo',
                        'companyInfo': '1:103'
                    }                    
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
        GetAllChatbots :getAllChatbots
    }
});