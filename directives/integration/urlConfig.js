/**
 * Created by Waruna on 1/4/2018.
 */

mainApp.directive('urlConfig', function () {
    return {
        restrict: 'E',
        scope: {
            integrationObj: '=',
            referenceObjects: '@',
            cssClass: '@'
        },
        templateUrl: 'template/integration/urlConfig.html',
        link: function (scope) {
            scope.refObjects = JSON.parse(scope.referenceObjects);

            scope.resetParams = function(){
                scope.params = {};
                scope["fInner"].$setUntouched();
                scope["fInner"].$setPristine();
            };

            scope.showParameters = function () {
                scope.showParameter = !scope.showParameter;
            };

            scope.addParameters = function(params){
                scope.integrationObj.parameters.push(params);
                scope.resetParams();
            }

            scope.deleteParameter = function (parameters) {
                var index = scope.integrationObj.parameters.indexOf(parameters);
                scope.integrationObj.parameters.splice(index, 1);
            }
        }
    }
});