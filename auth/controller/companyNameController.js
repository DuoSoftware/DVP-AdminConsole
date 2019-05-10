mainApp.controller('companynameCtrl', function ($rootScope, $scope, $state, $http,
                                                loginService,
                                                config, $base64, $auth,$q) {


    $scope.companyName="";
    $scope.isExsists=true;
    var para = {
        userName: null,
        password: null,
        clientID: $base64.encode(config.client_Id_secret)

    };
    //$scope.loginFrm.$invalid=true;

    $scope.checkCompanyNameAvailability = function(form,isSignUp)
    {
        var deferred = $q.defer();

        try {
            loginService.getOrganizationExsistance($scope.companyName).then(function (res) {

                if(res)
                {
                    //showAlert("Info","error","Company Name is Already Taken");
                    $scope.isExsists=true;

                    form.companyName.$invalid=true;

                    if(!isSignUp)
                    {
                        $state.go('login',{company:$scope.companyName});
                    }


                    deferred.reject(true);


                }
                else {

                    if(!isSignUp)
                    {
                        showAlert("Error","error","Invalid Company Name ");
                    }

                    $scope.isExsists=false;

                    form.companyName.$invalid=false;


                    deferred.resolve(true);

                }
            },function (err) {
                showAlert("Error","error","Error in validating Company Name ");
                $scope.isExsists=true;

                form.companyName.$invalid=true;


                deferred.reject(false);
            });
        }
        catch (e) {
            deferred.reject(e);
        }

        return deferred.promise;

        /*return new Promise(function (resolve,reject) {
            loginService.getOrganizationExsistance($scope.companyName).then(function (res) {

                if(res)
                {
                    //showAlert("Info","error","Company Name is Already Taken");
                    $scope.isExsists=true;

                    form.companyName.$invalid=true;

                    if(!isSignUp)
                    {
                        $state.go('login',{company:$scope.companyName});
                    }


                    reject(true);


                }
                else {

                    if(!isSignUp)
                    {
                        showAlert("Error","error","Invalid Company Name ");
                    }

                    $scope.isExsists=false;

                    form.companyName.$invalid=false;


                    resolve(true);

                }
            },function (err) {
                showAlert("Error","error","Error in validating Company Name ");
                $scope.isExsists=true;

                form.companyName.$invalid=true;


                reject(false);
            });
        })*/

    }

    $rootScope.copyrightYear = new Date().getFullYear();


    var showAlert = function (title, type, content) {
        new PNotify({
            title: title,
            text: content,
            type: type,
            styling: 'bootstrap3',
            animate: {
                animate: true,
                in_class: "bounceIn",
                out_class: "bounceOut"
            }
        });
    };



    $scope.onClickSignUp = function (form) {
        $scope.checkCompanyNameAvailability(form,true).then(function (res) {
            $state.go('signUp',{company:$scope.companyName});
        },function (err) {

        });

    };

    $scope.authenticate = function (provider) {

        if($scope.companyName.length==0)
        {
            showAlert("Info","error","Company name cannot be empty");
        }
        else
        {
            para.companyname=$scope.companyName;
            para.scope = ["all_all", "profile_veeryaccount", "write_ardsresource", "write_notification", "read_myUserProfile", "read_productivity", "profile_veeryaccount", "resourceid"];

            $scope.isSocialMedia = true;
            $auth.authenticate(provider, para)
                .then(function () {
                    //toastr.success('You have successfully signed in with ' + provider + '!');
                    loginService.getMyPackages(function (result, status) {
                        if (status == 200) {
                            if (result) {
                                loginService.getUserNavigation(function (isnavigation) {
                                    $scope.isSocialMedia = false;
                                    $state.go('console');

                                })
                            } else {
                                $scope.isSocialMedia = false;
                                $state.go('console');
                            }
                        } else {

                            loginService.getUserNavigation(function (isnavigation) {
                                if(isnavigation) {
                                    $scope.isSocialMedia = false;
                                    $state.go('console');
                                }else{
                                    showAlert('Error', 'error', "Get console navigation failed, please contact administrator");
                                    $scope.isLogin = false;
                                    $scope.loginFrm.$invalid = false;
                                }
                            })
                        }
                    });
                })
                .catch(function (error) {
                    $scope.isSocialMedia = false;
                    if (error.message) {
                        loginService.clearCookie();
                        showAlert('Error', 'error', error.message);
                    } else if (error.data && error.data.message) {
                        loginService.clearCookie();
                        showAlert('Error', 'error', error.data.message);
                    } else {
                        loginService.clearCookie();
                        showAlert('Error', 'error', 'Please check login details...');
                    }
                });
        }

    };


});