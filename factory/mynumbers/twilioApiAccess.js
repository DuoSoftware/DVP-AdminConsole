/**
 * Created by marlon on 04/28/2019.
 */

(function(){
    var twilioApi = function($http, baseUrls){
       var GetCountryCodes = function(){
            return $http({
                method: 'GET',
                url: baseUrls.twilioApiUrl +'Countries'
            })
                .then(function(response){
                    return response.data;
                });
        };
        var GetAvailableNumbersByType = function(isoCountry,numberType, pageNumber, pageSize){
            return $http({
                method: 'GET',
                url: baseUrls.twilioApiUrl +'PhoneNumbers/'+numberType+ '/'+isoCountry  //+'/' +pageNumber+'/'+pageSize
            })
                .then(function(response){
                    return response.data;
                });
        };
        var FilterDidsFormState = function(didType, stateId, countryCode, pageNumber, pageSize){
            return $http({
                method: 'GET',
                url: baseUrls.voxboneApiUrl +'inventory/listdidgroup/state/'+stateId+'/'+didType+'/'+countryCode+'/'+pageNumber+'/'+pageSize
            })
                .then(function(response){
                    return response.data;
                });
        };
        var GetNumberRates = function(){
            return $http({
                method: 'GET',
                url: baseUrls.TrunkServiceURL +'PhoneNumberTrunkApi/Operator/VOXBONE'
            })
                .then(function(response){
                    return response.data;
                });
        };

        return{
            GetCountryCodes: GetCountryCodes,
            GetAvailableNumbersByType: GetAvailableNumbersByType,
            FilterDidsFormState: FilterDidsFormState,
            GetNumberRates: GetNumberRates
        };
    };
    var module = angular.module("veeryConsoleApp");
    module.factory('twilioApi', twilioApi);
}());