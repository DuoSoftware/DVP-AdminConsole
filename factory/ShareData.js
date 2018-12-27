/**
 * Created by Waruna on 1/2/2018.
 */

mainApp.factory('ShareData', function ($http) {
    return {BusinessUnit:'No Assigned Unit' , BusinessUnits: [], MyProfile: {}, UnitUsers: [],GetUserByBusinessUnit:function() {
        return $http({
            method: 'GET',
            url: baseUrls.UserServiceBaseUrl + "BusinessUnit/"+this.BusinessUnit+"/Users"
        }).then(function (response) {
            if (response.data && response.data.IsSuccess) {
                return response.data.Result;
            }
            return [];
        });
    },listeningCallId:"",isInCall:false};
});
