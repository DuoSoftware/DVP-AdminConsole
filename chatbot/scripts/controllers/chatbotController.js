mainApp.controller('chatbotController', function ($scope, $q, $anchorScroll, chatbotService, $state, $uibModal, integrationsService) {
    $anchorScroll();

    console.log("Chatbot controller is up!");
    //Create New Bot
    $scope.CreateNewBot = function (newBot) {

        var bot = {
            "name": newBot.name,           
            "screen_name": newBot.name,
            "status": true,
            "company":-1,
            "tenant":-1,
            "channel_facebook": {  
                "company":-1,
                "tenant":-1,             
                "page_id": "",
                "app_id": "",
                "app_secret": "",
                "page_token": "",
                "verification_token": ""
            },
            "channel_slack": {  
                "company":-1,
                "tenant":-1,              
                "client_id": "",
                "client_secret": "",
                "verification_token": "",
                "api_token": "",
                "bot_token": ""

            },
            "avatar": "11111111111111111111111111111111111111111111"
        }

        chatbotService.CreateChatbot(bot).then(function (response) {
            if (response.data.IsSuccess) {
                $scope.showAlert("ChatBot", 'success', "Bot Created Successfully.");
                $scope.reloadPage();
            } else {
                $scope.showAlert("ChatBot", 'error', "Fail To Create Bot.");
            }

        }, function (error) {
            $scope.showAlert("ChatBot", 'error', "Fail To Create Bot.");

        });

    };

    //Get All Bots
    $scope.getAllBots = function () {
        chatbotService.GetAllChatbots().then(function (response) {
            if (response.data.IsSuccess) {
                $scope.allbots = response.data.Result;
                //$scope.allbots = temp.Result;
            } else {
                $scope.showAlert("ChatBot", 'error', "Fail To load Bot.");
            }

        }, function (error) {
            $scope.showAlert("ChatBot", 'error', "Fail To load Bot.");
        });
    };
    $scope.getAllBots();

    $scope.navigateToUI = function (location) {
        $state.go(location)
    }
    $scope.reloadPage = function () {
        $state.reload();
    };


});