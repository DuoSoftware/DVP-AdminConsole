mainApp.controller('setupAIController', function ($scope, $q, $anchorScroll, $state, setupAIService) {
    $anchorScroll();

    console.log("Setup AI controller is up!");

    $scope.buttonName = "SAVE";

    $scope.setupAI = {
        "workFlowName": "",
        "events":[] ,
        "enable": true
    };

    $scope.workFlowNames=[
    {
       
        "DateTime": "2018-02-16T10:10:27.660Z",
        "Description": "CargillsFlowV2",
        "DisplayName": "CargillsFlowV2",
        "ID": "",
        "Name": "kalanaduocargillsflowv2",
        "UserName": "kalana@duosoftware.com",
        "WFID": "a2FsYW5hZHVvLmRldi5zbW9vdGhmbG93LmlvLWU4NjQxNg",
        "comment": null,
        "version": "1"
    },
    {
        
        "DateTime": "2017-10-26T12:54:15.913Z",
        "Description": "1",
        "DisplayName": "wf17",
        "ID": "a2FsYW5hZHVvLmRldi5zbW9vdGhmbG93LmlvLTA2ZmNmYQ",
        "Name": "kalanaduo_wf17",
        "UserName": "kalana@duosoftware.com",
        "WFID": "a2FsYW5hZHVvLmRldi5zbW9vdGhmbG93LmlvLWJjMDhiZg",
        "comment": "1",
        "version": "1"
    },
    {
        "DateTime": "2017-10-06T04:24:56.611Z",
        "Description": "1",
        "DisplayName": "wf12",
        "ID": "a2FsYW5hZHVvLmRldi5zbW9vdGhmbG93LmlvLTA2ZWQ1Nw",
        "Name": "kalanaduo_wf12",
        "UserName": "kalana@duosoftware.com",
        "WFID": "a2FsYW5hZHVvLmRldi5zbW9vdGhmbG93LmlvLTlmMjJiZg",
        "comment": "1",
        "version": "1"
    },
    {
        "DateTime": "2017-11-17T05:52:32.337Z",
        "Description": "18",
        "DisplayName": "wf18",
        "ID": "a2FsYW5hZHVvLmRldi5zbW9vdGhmbG93LmlvLTAyYmEzNw",
        "Name": "kalanaduowf18",
        "UserName": "kalana@duosoftware.com",
        "WFID": "a2FsYW5hZHVvLmRldi5zbW9vdGhmbG93LmlvLTMwODIxYg",
        "comment": "1",
        "version": "1"
    }
    ];

   

    $scope.createSetupAI = function (setup) {

    console.log(setup);
    $scope.setup = setup;
    $scope.events = [];
    for (var i = 0; i < setup.events.length; i++) {
        for(var key in setup.events[i]) {
                $scope.events.push(setup.events[i][key]);
                console.log($scope.events);    
        }
      
    }
    $scope.setup.events = [];
    $scope.setupai={};
    $scope.setupai.enable=$scope.setup.enable;
    $scope.setupai.workFlowName = $scope.setup.workFlowName;
    $scope.setupai.events = $scope.events;

    console.log($scope.setupai);
    setupAIService.CreateSetupAI($scope.setupai).then(function (response) {
        if (response.data.IsSuccess) {
            $scope.showAlert("Setup AI", 'success', "Setup AI Created Successfully.");
            $scope.reloadPage();
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

            console.log($scope.allsetupai);
            for (var i=0; i<$scope.allsetupai.length; i++) {
                for (var j=0; j<$scope.workFlowNames.length; j++) {
                    if($scope.allsetupai[i].workFlowName === $scope.workFlowNames[j].Name){
                        $scope.workFlowNames.splice(j, 1);
                    }
                
                }
            }

            } else {
                $scope.showAlert("Setup AI", 'error', "Fail To load setup ai.");
            }

        }, function (error) {
            $scope.showAlert("Set up AI", 'error', "Fail To load setup ai.");
        });  
    }
    $scope.getAllSetupAi();

    // $scope.getAllworkflow = function () {
    //     setupAIService.GetWorkFlow().then(function (response) {
    //         if (response.data.IsSuccess) {
    //             $scope.allworkflow= response.data.Result;
    //             console.log($scope.allworkflow);
    //         } else {
    //             $scope.showAlert("Work Flow", 'error', "Fail To load work flow.");
    //         }

    //     }, function (error) {
    //         $scope.showAlert("Work Flow", 'error', "Fail To load work flow.");
    //     });  
    // }
    // $scope.getAllworkflow();

    // for (var index = 0; index < array.length; index++) {
    //     var element = array[index];
        
    // }

    

    $scope.updateSetupai = function (setup) {
        console.log(setup);
        $scope.setup = setup;
        $scope.events = [];
        for (var i = 0; i < setup.events.length; i++) {
            for(var key in setup.events[i]) {
                    $scope.events.push(setup.events[i][key]);
                    console.log($scope.events);    
            }
        
        }
        $scope.setup.events = [];
        $scope.setupai={};
        $scope.setupai.enable=$scope.setup.enable;
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

    $scope.deleteSetupai = function(setup){
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