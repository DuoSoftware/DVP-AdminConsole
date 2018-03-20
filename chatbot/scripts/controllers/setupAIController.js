mainApp.controller('setupAIController', function ($scope, $q, $anchorScroll, $state, setupAIService) {
    $anchorScroll();

    console.log("Setup AI controller is up!");

    $scope.buttonName = "SAVE";
    $scope.checkData = false;
    $scope.notFound = false;
    $scope.checkWorkFlowMatching = false;
    $scope.notMatchingKeyWord= false;

    $scope.setupAI = {
        "workFlowName": "",
        "events": [],
        "enable": true
    };

    $scope.createNewAutomation = function () {
        var url = "https://smoothflow.io/app/";
        var win = window.open(url, '_blank');
        win.focus();
    }

    $scope.testWorkFlowForText = {
        "message":""
    }

    $scope.getworkflowfortextAPIUrl = function(workflowfortext){
        console.log(workflowfortext);
        $scope.checkWorkFlowMatching = true;
        setupAIService.SetWorkFlowForText(workflowfortext).then(function (response) {
            console.log(response);
            $scope.checkWorkFlowMatching = false;
            console.log(response.status);
            if (response.status == 200) {
                $scope.testWorkForText = response.data;
                console.log($scope.testWorkForText);
                
                if(response.data.IsSuccess==false){
                 
                    //ai coudn't found any matching work flow
                    $scope.checkWorkFlowMatching = false;
                    $scope.checkData = false;
                    $scope.notFound = true;
                    if(response.data.Result.aiResolution.entities.length !==0 ){
                         $scope.notMatchingKeyWord= true;
                        
                    }
                    else{
                        $scope.notMatchingKeyWord= false;
                       
                    }
                   
                    console.log('ai could not found any matching work flow');
                }
                else{
                
                    $scope.checkWorkFlowMatching = false;
                    $scope.checkData = true;
                    $scope.notFound = false;
                    $scope.notMatchingKeyWord= false;
                    
                    $scope.showAlert("WorkFlow For Text", 'success', response.data.CustomMessage);
                }
                
            } else {
                $scope.checkData = false;
                $scope.notFound = false;
                $scope.checkWorkFlowMatching = false;
                $scope.notMatchingKeyWord= false;
          
                $scope.showAlert("WorkFlow For Text", 'error', "Fail To config workFlow for text.");
            }

        }, function (error) {
            $scope.checkData = false;
            $scope.notFound = false;
            $scope.checkWorkFlowMatching = false;
            $scope.notMatchingKeyWord= false;
            $scope.showAlert("WorkFlow For Text", 'error', "Fail To config workFlow for text.");
        });
    }

    $scope.getWorkflows = function () {
        setupAIService.GetWorkFlow().then(function (response) {
            console.log(response);
            if (response.data !== 0) {
                $scope.workFlowNames = response.data;
                console.log($scope.workFlowNames);
                
            } else {
                $scope.showAlert("Work Flows", 'error', "Fail To load work flows.");
            }

        }, function (error) {
            $scope.showAlert("Work Flows", 'error', "Fail To load work flows.");
        });
    }
    $scope.getWorkflows();

    $scope.createSetupAI = function (setup) {

        console.log(setup);
        $scope.setup = setup;
        $scope.events = [];
        for (var i = 0; i < setup.events.length; i++) {
            for (var key in setup.events[i]) {
                $scope.events.push(setup.events[i][key]);
                console.log($scope.events);
            }

        }
        $scope.setup.events = [];
        $scope.setupai = {};
        $scope.setupai.enable = $scope.setup.enable;
        $scope.setupai.workFlowName = $scope.setup.workFlowName;
        $scope.setupai.events = $scope.events;

        console.log($scope.setupai);
        setupAIService.CreateSetupAI($scope.setupai).then(function (response) {
            if (response.data.IsSuccess) {
                $scope.showAlert("Setup AI", 'success', "Setup AI Created Successfully.");
                $scope.getAllSetupAi();
            } else {
                $scope.showAlert("Setup AI", 'error', "Fail To Create Setup AI.");
            }

        }, function (error) {
            $scope.showAlert("Setup AI", 'error', "Fail To Create Setup AI.");

        });

    };

    $scope.getAllSetupAi = function () {
        setupAIService.GetAllSetupAI().then(function (response) {
            if (response.data.IsSuccess) {
                $scope.allsetupai = response.data.Result;
                console.log($scope.allsetupai);

                // console.log($scope.allsetupai);
                // for (var i=0; i<$scope.allsetupai.length; i++) {
                //     for (var j=0; j<$scope.workFlowNames.length; j++) {
                //         if($scope.allsetupai[i].workFlowName === $scope.workFlowNames[j].Name){
                //             $scope.workFlowNames.splice(j, 1);
                //         }

                //     }
                // }

            } else {
                $scope.showAlert("Setup AI", 'error', "Fail To load setup ai.");
            }

        }, function (error) {
            $scope.showAlert("Set up AI", 'error', "Fail To load setup ai.");
        });
    }
    $scope.getAllSetupAi();

    $scope.updateSetupai = function (setup) {
        console.log(setup);
        $scope.setup = setup;
        $scope.events = [];
        for (var i = 0; i < setup.events.length; i++) {
            for (var key in setup.events[i]) {
                $scope.events.push(setup.events[i][key]);
                console.log($scope.events);
            }

        }
        $scope.setup.events = [];
        $scope.setupai = {};
        $scope.setupai.enable = $scope.setup.enable;
        $scope.setupai.workFlowName = $scope.setup.workFlowName;
        $scope.setupai.events = $scope.events;
        $scope.setupai.company = $scope.setup.company;
        $scope.setupai.tenant = $scope.setup.tenant;
        $scope.setupai._id = $scope.setup._id;
        $scope.setupai.__v = $scope.setup.__v;

        console.log($scope.setupai);
        setupAIService.UpdateSetupAI($scope.setupai).then(function (response) {
            if (response.data && response.data.IsSuccess) {
                $scope.showAlert("Setup AI", 'success', "Setup AI updated successfully.");
                $scope.getAllSetupAi();
            } else {
                $scope.showAlert("Setup AI", 'error', "Failed to update setup ai.");
            }

        }, function (error) {
            $scope.showAlert("Setup AI", 'error', "Fail To update setup ai.");
        });
    }

    $scope.deleteSetupai = function (setup) {
        setupAIService.DeleteSetupAI(setup).then(function (response) {
            console.log(response._id);
            if (response.data && response.data.IsSuccess) {
                $scope.showAlert("Setup AI", 'success', "Setup AI deleted successfully.");
                $scope.getAllSetupAi();
            } else {
                $scope.showAlert("Setup AI", 'error', "Failed to delete setup ai.");
            }
        }, function (error) {
            $scope.showAlert("Setup AI", 'error', "Failed to delete setup ai.");
        });

    }

    $scope.reloadPage = function () {
        $state.reload();
    };


});
