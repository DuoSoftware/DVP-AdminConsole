mainApp.controller('templateController', function ($scope, $q, $anchorScroll, chatbotService,$state) {
    $anchorScroll();

    console.log("Template controller is up!");

    

    $scope.navigateToUI = function(location){
        $state.go(location)
    }

    $scope.templateList = [
        {
            name:"Bot One",
            decription:"This is the first bot template"
        },
        {
            name:"Bot Two",
            decription:"This is the second bot template"
        }
    ];
});