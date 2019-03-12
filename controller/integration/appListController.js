mainApp.controller("appListController", function ($scope, $filter, $location, $log, $state, $anchorScroll, integrationConfigService) {

    $anchorScroll();

    $scope.showConfirm = function (tittle, label, okbutton, cancelbutton, content, OkCallback, CancelCallBack, okObj) {

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

    $scope.showAlert = function (tittle,type, content) {

        new PNotify({
            title: tittle,
            text: content,
            type: type,
            styling: 'bootstrap3'
        });
    };

    $scope.appList = [];

    // set default app data..

    $scope.resetAppData = function(){
        $scope.appData = {
            trycount: 5, 
            timeout: 10
        };

        // reset form...
        if($scope["fOuter"]){
            $scope["fOuter"].$setUntouched();
            $scope["fOuter"].$setPristine();
        }
        
    };

    $scope.resetAppData();

    $scope.parameters = {parameterLocation: "QUERY"};

    $scope.isProcessing = false;

    $scope.showConfiguration = false;
    $scope.showConfigurations = function () {
        $scope.resetAppData();
        $scope.showConfiguration = !$scope.showConfiguration;
    };

    $scope.showParameter = false;
    $scope.showParameters = function () {
        $scope.showParameter = !$scope.showParameter;
    };

    $scope.addParameters = function (parameters) {
        $scope.appData.parameters.push(parameters);
        $scope.parameters = {parameterLocation: "QUERY"};

        var form = $scope["fInner"];
        form.$setUntouched();
        form.$setPristine();
        $scope.showParameter = false;
    };

    $scope.loadApps = function () {
        $scope.isProcessing = true;
        integrationConfigService.getAppDetails().then(function (response) {
            if (response) {
                $scope.appList = response;
            } else {
                $scope.showAlert("App Integrations", "error", "Fail To Load App Configurations.");
            }
            $scope.isProcessing = false;
        }, function (error) {
            $scope.isProcessing = false;
            $scope.showAlert("App Integrations", "error", "Fail To Load App Configurations.");
        });

    };
    $scope.loadApps();

    $scope.saveApp = function (appData) {
        $scope.isProcessing = true;
        integrationConfigService.saveAppDetails(appData).then(function (response) {
            if (response) {
                $scope.showAlert("Integrations", 'success', "Configurations Created Successfully.");
                if(!appData._id){
                    $scope.appList.push(response);
                }
                $scope.showConfiguration = false;
                $scope.resetAppData();

                var form = $scope["fOuter"];
                form.$setUntouched();
                form.$setPristine();
            } else {

                $scope.showAlert("Integrations", "error", "Fail To Save Integration Configurations.");
            }
            $scope.isProcessing = false;
        }, function (error) {
            $scope.isProcessing = false;
            $scope.showAlert("Integrations", "error", "Fail To Save Integration Configurations.");
        });

    };

    $scope.editApp = function(appData){
        $scope.appData = appData;
        $scope.showConfiguration = true;
        // angular.element('#int_app_name').focus();
        $anchorScroll();
    }

    $scope.configureApp = function(app_id){
        $state.go('console.appconfig', {'app_id': app_id});
    };

    $scope.deleteIntegrationAPIDetails = function (integrationData) {
        $scope.showConfirm("Delete Configurations", "Delete", "ok", "cancel", "Do you want to delete " + integrationData.name, function (obj) {
            $scope.isProcessing = true;
            integrationConfigService.deleteIntegrationAPIDetails(integrationData._id).then(function (response) {
                if (response) {
                    $scope.loadConfig();
                    $scope.showAlert("Integrations", 'success', "Configurations Deleted Successfully.");
                } else {
                    $scope.showAlert("Integrations", "error", "Fail To Delete Integration Configurations.");
                }
                $scope.isProcessing = false;
            }, function (error) {
                $scope.isProcessing = false;
                $scope.showAlert("Integrations", "error", "Fail To Delete Integration Configurations.");
            });
        }, function () {

        }, integrationData)
    };

    $scope.deleteParameter = function (parameters) {
        var index = $scope.appData.parameters.indexOf(parameters);
        $scope.appData.parameters.splice(index, 1);
    }
});