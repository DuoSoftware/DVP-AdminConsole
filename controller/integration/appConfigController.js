mainApp.controller("appConfigController", function ($scope, $state, $stateParams, $filter, $location, $log, $anchorScroll, ticketService, integrationConfigService) {

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

    $scope.getAppById = function(app_id){
        $scope.isProcessing = true;
        integrationConfigService.getAppById(app_id).then(function (response) {
            if (response && response.IsSuccess) {
                $scope.currentApp = response.Result;
            } else {
                $scope.showAlert("App Integrations", "error", "Failed To Load App.");
                $state.go('console.appintegration');
            }
            $scope.isProcessing = false;
        }, function (error) {
            $scope.isProcessing = false;
            $scope.showAlert("App Integrations", "error", "Failed To Load App.");
            $state.go('console.appintegration');
        });
    };

    $scope.getAppById($stateParams.app_id);

    $scope.LoadFormList = function(){
		$scope.isProcessing = true;
		ticketService.LoadFormList().then(function (response) {
			if(response){
				$scope.formList = response;
			}
			else{
				$scope.showAlert("Load Form", "Fail To Load Form List.");
			}
			$scope.isProcessing = false;
		}, function (error) {
            $scope.showAlert("Load Form", "Fail To Load Form List.");
            $scope.isProcessing = false;
		});

    };

    $scope.LoadFormList();

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

    $scope.resetActionData = function(){
        $scope.actionData = {
            name: '', 
            icon: '',
            dynamic_form_id: '',
            integration: {
                parameters: [],
                url:''
            },
            response_map: {
                accepted_codes: [],
                success_msg: '',
                error_msg: ''
            },
            new: true
        };

        // reset form...
        if($scope["fOuter"]){
            $scope["fOuter"].$setUntouched();
            $scope["fOuter"].$setPristine();
        }
        
    };

    $scope.addActionToApp = function(action){
        $scope.currentApp.actions.push(action);
        $scope.resetActionData();
        $scope.showConfigurations();
        $anchorScroll('#'+action.name);
    }

    $scope.resetActionData();

    $scope.isProcessing = false;
    $scope.showConfiguration = false;
    $scope.isUpdate = false;

    $scope.showConfigurations = function () {
        $scope.resetActionData();
        $scope.showConfiguration = !$scope.showConfiguration;
    };

    $scope.reloadConfig = function(){
        $state.go('console.appconfig', { 'app_id': $scope.currentApp._id }, {reload: true});
    };

    $scope.editAction = function(action){
        $scope.actionData = action;
        $scope.showConfiguration = true;
        $scope.isUpdate = true;
        $anchorScroll('action_panel');
    }

    $scope.addParameters = function (parameters) {
        $scope.appData.parameters.push(parameters);

        var form = $scope["fInner"];
        form.$setUntouched();
        form.$setPristine();
        $scope.showParameter = false;
    };

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

    $scope.updateApp = function (appData) {
        
        $scope.isProcessing = true;

        integrationConfigService.updateAppDetails(appData).then(function (response) {
            if (response.IsSuccess) {
                $scope.showAlert("App Integrations", 'success', "App updated Successfully.");

                // reload the config window...
                $scope.reloadConfig();
                $scope.showConfiguration = false;
            } else {
                $scope.showAlert("App Integrations", "error", "Fail To Save App.");
            }
            $scope.isProcessing = false;
        }, function (error) {
            $scope.isProcessing = false;
            $scope.showAlert("App Integrations", "error", "Fail To Save App.");
        });

    };   

    $scope.deleteAction = function (action) {
        $scope.showConfirm("Delete Action", "Delete", "ok", "cancel", "Do you want to delete " + action.name + " action?", function (obj) {
            var index = $scope.currentApp.actions.indexOf(action);
            $scope.$apply(function(){
                $scope.currentApp.actions.splice(index, 1);
            });
        }, function () {

        }, action)
    };
});
