/**
 * Created by Shehan on 26/1/2018.
 */
mainApp.directive("editintegration", function ($filter, $uibModal, appBackendService, $state) {

    return {
        restrict: "EAA",
        scope: {
            template: "=",
            templateType: "=",
            templateTypes: "=",
            'updateIntegration': '&',
            'deleteIntegration': '&'
        },

        templateUrl: 'chatbot/views/partials/editIntegration.html',

        link: function (scope) {

            scope.templateType = scope.templateType;

            scope.getSelectedTemplateType = function(){
                angular.for
            }
            scope.selectedTemplateType = scope.getSelectedTemplateType(scope.templateType);

            scope.removeCard = function (index) {
                scope.template.items.splice(index, 1);
            }

            scope.addNewCard = function () {
                scope.template.items.push({
                    buttons: [],
                    default_action: {
                        url: ""
                    },
                    image_url: "",
                    sub_title: "",
                    title: "<new card>"
                });
            }

            scope.copyCardID = function (cardID) {

                var id = cardID;
                window.getSelection().empty();
                var copyField = document.getElementById(id);
                var range = document.createRange();
                range.selectNode(copyField);
                window.getSelection().addRange(range);
                document.execCommand('copy');
                scope.showAlert("Card ID", 'Card ID copied to clipboard.', "success");
            }

            scope.removeTemplate = function (item) {

                scope.showConfirm("Delete Integration", "Delete", "ok", "cancel", "Are you sure you want to delete " + item.name, function (obj) {
                    scope.deleteIntegration(scope.template);

                }, function () {

                }, item);
            };

            /* Start of Default methods*/

            scope.showConfirm = function (tittle, label, okbutton, cancelbutton, content, OkCallback, CancelCallBack, okObj) {

                (new PNotify({
                    title: tittle,
                    text: content,
                    icon: 'glyphicon glyphicon-question-sign',
                    hide: false,
                    confirm: {
                        confirm: true
                    },
                    buttons: {
                        closer: false,
                        sticker: false
                    },
                    history: {
                        history: false
                    }
                })).get().on('pnotify.confirm', function () {
                    OkCallback("confirm");
                }).on('pnotify.cancel', function () {

                });

            };

            scope.showAlert = function (title, content, type) {

                new PNotify({
                    title: title,
                    text: content,
                    type: type,
                    styling: 'bootstrap3'
                });
            };

            /* End of Default Methods */

        },

        controller: function($scope, $state) { 

                $scope.closeTemplate = function () {
                    $scope.editMode = false;
                    $scope.reloadPage();
                };


                $scope.reloadPage = function () {
                        $state.reload();
                };

                $scope.editTemplate = function (template) {
                  
                    $scope.editMode = true;
                    console.log(template);
                    $scope.integrate = template;
   
                    $scope.integrate.body = JSON.stringify($scope.integrate.body);
                    console.log($scope.integrate.body);

                    if($scope.integrate.headers === {} || $scope.integrate.headers === undefined){
                        $scope.integrate.headers = [{key:"",value:""}];
                    }
                    else{
                        console.log($scope.integrate.headers);
                        var xx = Object.keys($scope.integrate.headers);
                        var arr = xx.map(function(x) {
                            var o = {}; 
                            o['key'] = x;
                            o['value'] = $scope.integrate.headers[x];
                            return o;
                        })
                        $scope.integrate.headers = [];
                        $scope.integrate.headers = arr;
                    }
                   
                    
                    if($scope.integrate.url_params === {} || $scope.integrate.url_params === undefined){
                        $scope.integrate.url_params = [{key:"",value:""}];
                    }
                    else{
                        // var obj = {binara: 'jkshdjkfhasdf',prasad: '123131231'};
                        console.log($scope.integrate.url_params);
                        var yy = Object.keys($scope.integrate.url_params);
                        var arry = yy.map(function(y) {
                            var o = {}; 
                            o['key'] = y;
                            o['value'] = $scope.integrate.url_params[y];
                            return o;
                        })
                        $scope.integrate.url_params = [];
                        $scope.integrate.url_params = arry;

                    }

                    if($scope.integrate.response.success.check_fields.length === 0){
                        $scope.integrate.response.success.check_fields = [{name:"",type:"",value:""}];
                    }
                
                    if($scope.integrate.response.error.check_fields.length === 0){
                        $scope.integrate.response.error.check_fields = [{name:"",type:"",value:""}];
                    }
                };
    
    $scope.deleteUrlParams = deleteUrlParams;
    $scope.deleteHeader = deleteHeader;
    $scope.successDeleteCheckFields = successDeleteCheckFields;
    $scope.errordeleteCheckFields = errordeleteCheckFields;
                
    function deleteUrlParams(index){
        console.log(index);
        for (var j = $scope.integrate.url_params.length - 1; j >= 0; j--) {
            if (j == index) {
                $scope.integrate.url_params.splice(j, 1);
            }
        }
    }

    function deleteHeader(index){
        console.log(index);
        for (var k = $scope.integrate.headers.length - 1; k >= 0; k--) {
            if (k == index) {
                $scope.integrate.headers.splice(k, 1);
            }
        }
    }

    function successDeleteCheckFields(index){
        console.log(index);
        for (var m = $scope.integrate.response.success.check_fields.length - 1; m >= 0; m--) {
            if (m == index) {
                $scope.integrate.response.success.check_fields.splice(m, 1);
            }
        }
    }

    function errordeleteCheckFields(index){
        for (var n = $scope.integrate.response.error.check_fields.length - 1; n >= 0; n--) {
            if (n == index) {
                $scope.integrate.response.error.check_fields.splice(n, 1);
            }
        }
    }


                console.log($scope.integrate);

              
                $scope.addSuccessCheckFields = addSuccessCheckFields;
                $scope.addErrorCheckFields = addErrorCheckFields;
                $scope.addCheckHeaders = addCheckHeaders;
                $scope.addUrlParams = addUrlParams;

                // var headers={};
                // var url_params={};

                function addCheckHeaders(){
            
                    $scope.template.headers.push({});
                }

                function addErrorCheckFields(){
                
                    $scope.template.response.error.check_fields.push({});
                }

                function addUrlParams(){
        
                    $scope.template.url_params.push({});
                }

                function addSuccessCheckFields(){

                    $scope.template.response.success.check_fields.push({});
                }
        }

    }
});