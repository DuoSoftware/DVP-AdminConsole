mainApp.controller('firstLoginCtrl', function ($rootScope, $scope, $state, $http,
                                               loginService,
                                               config, $base64, $auth,$q,$location,vcRecaptchaService,signUpServices) {

    var userData ={};
    $scope.isRequested=false;
    var showAlert = function (title, type, content) {
        new PNotify({
            title: title,
            text: content,
            type: type,
            styling: 'bootstrap3'
        });
    };

    if($location.search().company)
    {
        userData.companyName = $location.search().company;
        $scope.companyName=userData.companyName;
    }
    if($location.search().role)
    {
        userData.role = $location.search().role;
    }
    if($location.search().invitation)
    {
        userData.invitation = $location.search().invitation;
    }


    $scope.newWidgetId = 0;
    $scope.getRecaptchaId = function (widgetId) {
        $scope.newWidgetId = widgetId;
        return;
    };



    $scope.setupPassword = function () {

        $scope.isRequested=true;
        if($scope.password)
        {
            userData.password = $scope.password;
        }
        if (vcRecaptchaService.getResponse($scope.newWidgetId) === "") { //if string is empty
            alert("Please resolve the captcha and submit!");
            $scope.isRequested=false;
        } else {
            userData['g-recaptcha-response'] = vcRecaptchaService.getResponse($scope.newWidgetId);
            sendPasswordConfirmation(userData)
        }
    };

    var sendPasswordConfirmation = function(user)
    {
        signUpServices.invitationSignup(user).then(function (res) {
            console.log(user);
            //$scope.isRequested=false;
            $scope.showAlert("Info","info","Check your Email Inbox for Login");
        }).catch(function (err) {
            $scope.showAlert("Error","error","Something went wrong, Try again");
            $scope.isRequested=false;
        });
    }



});