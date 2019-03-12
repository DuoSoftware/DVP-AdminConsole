/**
 * Created by Waruna on 7/3/2017.
 * */

mainApp.factory("integrationConfigService", function ($http, authService,baseUrls) {
    return {

        saveIntegrationAPIDetails: function (postData) {
            return $http({
                method: 'POST',
                url:baseUrls.integrationapi +"IntegrationInfo",
                data:postData
            }).then(function(response)
            {
                if (response.data && response.data.IsSuccess) {
                    return response.data.Result;
                } else {
                    return null;
                }
            });
        },

        getIntegrationAPIDetails: function () {
            return $http({
                method: 'GET',
                url: baseUrls.integrationapi +"IntegrationInfo"
            }).then(function(response)
            {
                if (response.data && response.data.IsSuccess) {
                    return response.data.Result;
                } else {
                    return null;
                }
            });
        },

        deleteIntegrationAPIDetails: function (id) {
            return $http({
                method: 'DELETE',
                url: baseUrls.integrationapi +"IntegrationInfo/"+id
            }).then(function(response)
            {
                if (response.data && response.data.IsSuccess) {
                    return response.data.IsSuccess;
                } else {
                    return false;
                }
            });
        },

        getAppDetails: function () {
            return $http({
                method: 'GET',
                url: baseUrls.integrationapi +'AppInfo'
            }).then(function(response)
            {
                if (response.data && response.data.IsSuccess) {
                    return response.data.Result;
                } else {
                    return null;
                }
            });
        },

        saveAppDetails: function (appData) {
            return $http({
                method: 'POST',
                url:baseUrls.integrationapi +'AppInfo',
                data:appData
            }).then(function(response)
            {
                if (response.data && response.data.IsSuccess) {
                    return response.data.Result;
                } else {
                    return null;
                }
            });
        },

        getAppById: function (app_id) {
            return $http({
                method: 'GET',
                url: baseUrls.integrationapi + 'AppInfo/' + app_id
            }).then(function (resp) {
                return resp.data;
            });
        }
    }
});