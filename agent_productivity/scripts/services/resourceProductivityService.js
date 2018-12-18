/**
 * Created by Rajinda on 12/31/2015.
 */

var clusterModule = angular.module("resourceProductivityServiceModule", []);

clusterModule.factory("resourceProductivityService", function ($http, $log, authService, baseUrls,ShareData) {

    var postdata = {bu:ShareData.BusinessUnit};
    if(ShareData.BusinessUnit.toLowerCase()==="all"){
        postdata = {};
    }
    var getProductivity = function () {
        return $http({
            method: 'get',
            url: baseUrls.resourceServiceBaseUrl + "Resources/Productivity",
            params:postdata
        }).then(function (response) {
            if (response.data && response.data.IsSuccess) {
                return response.data.Result;
            } else {
                return {};
            }
        });
    };

    var getOnlineAgents = function () {

        /*return $http.get(baseUrls.ardsmonitoringBaseUrl + "MONITORING/resources").then(function (response) {
                if (response.data && response.data.IsSuccess) {
                    return response.data.Result;
                } else {
                    return {};
                }
            });*/

        return $http.get(baseUrls.resourceServiceBaseUrl + "Resources").then(function (response) {
                if (response.data && response.data.IsSuccess) {
                    return response.data.Result;
                } else {
                    return {};
                }
            });
    };

    return {
        GetProductivity: getProductivity,
        GetOnlineAgents: getOnlineAgents

    }

});
