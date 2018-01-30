/**
 * Created by Lakmini on 01/29/2018.
 */
'use strict';
mainApp.factory("integrationsService", function ($http, $log, $filter, authService, baseUrls) {
    var configapp = function (configdetails,appmodule) {
        var url = "";
        if (appmodule == "FaceBook") {
            url = baseUrls.botAPIUrl + "channel/facebook"
        } else if (appmodule == "Slack") {
            url = baseUrls.botAPIUrl + "channel/slack"
        }
        return $http({
            method: 'POST',
            url: url,
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJzdWtpdGhhIiwianRpIjoiYWEzOGRmZWYtNDFhOC00MWUyLTgwMzktOTJjZTY0YjM4ZDFmIiwic3ViIjoiNTZhOWU3NTlmYjA3MTkwN2EwMDAwMDAxMjVkOWU4MGI1YzdjNGY5ODQ2NmY5MjExNzk2ZWJmNDMiLCJleHAiOjE5MDIzODExMTgsInRlbmFudCI6LTEsImNvbXBhbnkiOi0xLCJzY29wZSI6W3sicmVzb3VyY2UiOiJhbGwiLCJhY3Rpb25zIjoiYWxsIn1dLCJpYXQiOjE0NzAzODExMTh9.Gmlu00Uj66Fzts-w6qEwNUz46XYGzE8wHUhAJOFtiRo',
                'companyInfo': '1:103'
            },
            data: configdetails
        }).then(function (response) {
            if (response.data && response.data.IsSuccess) {
                return response;
            } else {
                return response;
            }

        });
    };
    return {
        ConfigApp: configapp

    }
})