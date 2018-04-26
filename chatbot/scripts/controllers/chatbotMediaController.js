mainApp.controller('chatbotMediaController', function ($scope, $q, $anchorScroll, botMediaService, $state, $uibModal, integrationsService) {
    $anchorScroll();

    console.log("Chatbot controller is up!");

    //Get All Media Files
    $scope.getAllMedia = function () {
        botMediaService.GetAllMediaFiles().then(function (response) {
            console.log(response);
            if (response.data.IsSuccess) {
                $scope.allmediaFiles = response.data.Result;
            } else {
                $scope.showAlert("ChatBot", 'error', "Fail To load Media.");
            }

        }, function (error) {
            $scope.showAlert("ChatBot", 'error', "Fail To load Media.");
        });
    };
    $scope.getAllMedia();

    $scope.navigateToUI = function (location) {
        $state.go(location)
    }
    $scope.reloadPage = function () {
        $state.reload();
    };

   


});