mainApp.controller('chatbotController', function ($scope, $q, $anchorScroll, chatbotService, $state, $uibModal, integrationsService) {
    $anchorScroll();

    console.log("Chatbot controller is up!");
    //Create New Bot
    $scope.CreateNewBot = function (newBot) {

        var bot = {
            "name": newBot.name,
            "company": 103,
            "tenant": 1,
            "screen_name": newBot.name,
            "status": true,
            "channel_facebook": {
                "company": 103,
                "tenant": 1,
                "page_id": "smoothdevbot",
                "app_id": "123456",
                "app_secret": "123456",
                "page_token": "EAARlNKkVmH0BACKZB87xROqPwlNDyaxX105VLwYMc7Gkcs8J8OXuO4yAnYWNwvR8mDpHa9o9G12h4LJSRqNWMuP6YGwuRwq5FSsuS7FlbIIVyHBZCgLrfZCBE1vrW78U3H91AZCZC4wZC0hN99MZAsNyY65vhLFlqEumElm3zPlkAZDZD",
                "verification_token": "123456"
            },
            "channel_slack": {
                "company": 103,
                "tenant": 1,
                "client_id": "295373426962.295411085860",
                "client_secret": "43e7c6b0eaeddb4e68f01b8e355d9fc2",
                "verification_token": "V4RziySqYN8QvGQuWHDjYcxD",
                "api_token": "xoxp-295373426962-296433140231-294719310272-7423be5fc086dd04f990bdccd43a6ada",
                "bot_token": "xoxb-295303466291-3v495qCgo2KpVJRthuQ8CGAx"

            },
            "avatar": "11111111111111111111111111111111111111111111"
        }

        chatbotService.CreateChatbot(bot).then(function (response) {
            if (response) {
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
            if (response) {
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