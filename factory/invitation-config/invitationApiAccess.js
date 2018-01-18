/**
 * Created by Pawan on 1/17/2018.
 */


mainApp.factory('invitationApiAccess', function ($http, baseUrls)
{
    return {

        sendInvitation: function (invObj) {
            return $http({
                method: 'POST',
                url: baseUrls.UserServiceBaseUrl+'Invitation/to/'+invObj.to,
                data:invObj
            }).then(function(response)
            {
                return response;
            });
        },
        getSentInvitations: function () {
            return $http({
                method: 'GET',
                url: baseUrls.UserServiceBaseUrl+'SendInvitations'
            }).then(function(response)
            {
                return response;
            });
        },
        cancelSentInvitation: function (id) {
            return $http({
                method: 'PUT',
                url: baseUrls.UserServiceBaseUrl+'Invitation/Cancel/'+id
            }).then(function(response)
            {
                return response;
            });
        },
        checkInvitable: function (name) {
            return $http({
                method: 'GET',
                url: baseUrls.UserServiceBaseUrl+'User/'+name+'/invitable'
            }).then(function(response)
            {
                return response;
            });
        },
        resendInvitation: function (id) {
            return $http({
                method: 'PUT',
                url: baseUrls.UserServiceBaseUrl+'Invitation/Resend/'+id
            }).then(function(response)
            {
                return response;
            });
        }



    }
});