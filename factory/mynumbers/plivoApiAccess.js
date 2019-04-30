/**
 * Created by Nimeshka on 04/28/2019.
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
        var GetStates = function(countryCode){
            return $http({
                method: 'GET',
                url: baseUrls.voxboneApiUrl +'inventory/liststate/'+countryCode
            })
                .then(function(response){
                    return response.data;
                });
        };
        var GetDidsForCountryCode = function(countryCode, pageNumber, pageSize){
            return $http({
                method: 'GET',
                url: baseUrls.voxboneApiUrl +'inventory/listdidgroup/'+countryCode+'/'+pageNumber+'/'+pageSize
            })
                .then(function(response){
                    return response.data;
                });
        };
        var FilterDidsFormType = function(didType, countryCode, pageNumber, pageSize){
            return $http({
                method: 'GET',
                url: baseUrls.voxboneApiUrl +'inventory/listdidgroup/type/'+didType+'/'+countryCode+'/'+pageNumber+'/'+pageSize
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
        var OrderDid = function(orderInfo){
            return $http({
                method: 'POST',
                url: baseUrls.voxboneApiUrl +'order/OrderDids',
                data: orderInfo
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
            GetStates: GetStates,
            GetDidsForCountryCode: GetDidsForCountryCode,
            FilterDidsFormType: FilterDidsFormType,
            FilterDidsFormState: FilterDidsFormState,
            OrderDid: OrderDid,
            GetNumberRates: GetNumberRates
        };
    };
    var module = angular.module("veeryConsoleApp");
    module.factory('twilioApi', twilioApi);
}());


mainApp.factory('plivoAPI', function ($http, baseUrls) {
    return {
        searchNumbers: function(searchParams){
            return $http({
                method: 'GET',
                url: 'http://localhost:3640/DVP/API/1.0.0/PhoneNumber',
                params: searchParams
            })
            .then(function(response){
                return response.data;
            });
        }
    }
});
