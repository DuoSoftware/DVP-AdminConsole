/**
 * Created by Shehan on 01/26/2018.
 */

'use strict';
mainApp.factory("templateService", function ($http, $log, $filter, authService, baseUrls) {

    var createTemplate = function (template) {
        return $http({
            method: 'POST',
            url: baseUrls.templateAPIUrl + "Card/",
            data: template
        }).then(function (response) {
            if (response.data && response.data.IsSuccess) {
                return response;
            } else {
                return response;
            }
        });
    };

    var getAllTemplates = function () {
        return $http({
            method: 'GET',
            url: baseUrls.templateAPIUrl + "Cards/"
        }).then(function (response) {
            if (response.data && response.data.IsSuccess) {
                return response;
            } else {
                return response;
            }
        });
    };

    return {
        CreateTemplate: createTemplate,
        GetAllTemplates: getAllTemplates
    }
});