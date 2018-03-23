/**
 * Created by Shehan on 01/26/2018.
 */

'use strict';
mainApp.factory("templateService", function ($http, $log, $filter, authService, baseUrls) {

    var createTemplate = function (template, category) {
        return $http({
            method: 'POST',
            url: baseUrls.templateAPIUrl + category + "/",
            data: template
        }).then(function (response) {
            if (response.data && response.data.IsSuccess) {
                return response;
            } else {
                return response;
            }
        });
    };

    var updateTemplate = function (template, category) {
        return $http({
            method: 'POST',
            url: baseUrls.templateAPIUrl + category + "/" + template._id,
            data: template
        }).then(function (response) {
            if (response.data && response.data.IsSuccess) {
                return response;
            } else {
                return response;
            }
        });
    };

    var deleteTemplate = function (template, category) {
        return $http({
            method: 'DELETE',
            url: baseUrls.templateAPIUrl + category + "/" + template._id,
            data: template
        }).then(function (response) {
            if (response.data && response.data.IsSuccess) {
                return response;
            } else {
                return response;
            }
        });
    };

    var getAllTemplates = function (category) {
        return $http({
            method: 'GET',
            url: baseUrls.templateAPIUrl + category + "s/"
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
        UpdateTemplate: updateTemplate,
        DeleteTemplate: deleteTemplate,
        GetAllTemplates: getAllTemplates
    }
});