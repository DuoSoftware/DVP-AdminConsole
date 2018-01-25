mainApp.controller('templateController', function ($scope, $q, $anchorScroll, chatbotService,$state) {
    $anchorScroll();

    console.log("Template controller is up!");

    

    $scope.navigateToUI = function(location){
        $state.go(location)
    }
});