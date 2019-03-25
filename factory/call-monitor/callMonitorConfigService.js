/**
 * Created by Pawan on 5/28/2016.
 */

mainApp.factory('callMonitorSrv', function ($http, authService,baseUrls) {

    return {

        getCurrentCalls: function () {
            var authToken = authService.GetToken();
            return $http({
                method: 'GET',
                url: baseUrls.monitorrestapi+"Calls"
            }).then(function(response)
            {
                return response;
            });
        },

        getCurrentCampaigns: function () {
            var authToken = authService.GetToken();
            return $http({
                method: 'GET',
                url: baseUrls.monitorrestapi+"Campaigns"
            }).then(function(response)
            {
                return response;
            });
        },

        bargeCalls: function (bargeID,protocol,destinationKey,legID) {
            var authToken = authService.GetToken();

            return $http({
                method: 'POST',
                url: baseUrls.monitorrestapi+"Dispatch/"+bargeID+"/barge/"+legID,
                data:
                {
                    protocol:protocol,
                    destination:destinationKey
                }
            }).then(function(response)
            {
                console.log(JSON.stringify(response));
                return response;
            });
        },

        listenCall: function (bargeID,protocol,destinationKey,fromNum,Skill) {
            var authToken = authService.GetToken();
            return $http({
                method: 'POST',
                url: baseUrls.monitorrestapi+"Dispatch/"+bargeID+"/listen?callernum="+fromNum+"&listenskill="+Skill,
                data:
                {
                    protocol:protocol,
                    destination:destinationKey
                }
            }).then(function(response)
            {
                console.log(JSON.stringify(response));
                return response;
            });
        },
        threeWayCall: function (bargeID,protocol,destinationKey,legID) {
            var authToken = authService.GetToken();
            return $http({
                method: 'POST',
                url: baseUrls.monitorrestapi+"Dispatch/"+bargeID+"/threeway/"+legID,
                data:
                {
                    protocol:protocol,
                    destination:destinationKey
                }
            }).then(function(response)
            {
                console.log(JSON.stringify(response));
                return response;
            });
        },
        returnToListen: function (bargeID,protocol,destinationKey,legID) {
            var authToken = authService.GetToken();
            return $http({
                method: 'POST',
                url: baseUrls.monitorrestapi+"Dispatch/"+bargeID+"/returnlisten/"+legID,
                data:
                {
                    protocol:protocol,
                    destination:destinationKey
                }
            }).then(function(response)
            {
                console.log(JSON.stringify(response));
                return response;
            });
        },
        swapUser: function (bargeID,protocol,destinationKey,legID) {
            var authToken = authService.GetToken();
            return $http({
                method: 'POST',
                url: baseUrls.monitorrestapi+"Dispatch/"+bargeID+"/swap/"+legID,
                data:
                {
                    protocol:protocol,
                    destination:destinationKey
                }
            }).then(function(response)
            {
                console.log(JSON.stringify(response));
                return response;
            });
        }


    }
});




