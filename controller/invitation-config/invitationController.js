/**
 * Created by Pawan on 1/16/2018.
 */
mainApp.controller("invitationController", function ($scope, $state, loginService,$ngConfirm,userProfileApiAccess,invitationApiAccess) {


    $scope.searchCriteria = "";
   $scope.invites = [];

    $scope.showConfirmation = function (title, contentData, okText, okFunc, closeFunc) {

        $ngConfirm({
            title: title,
            content: contentData, // if contentUrl is provided, 'content' is ignored.
            scope: $scope,
            buttons: {
                // long hand button definition
                ok: {
                    text: okText,
                    btnClass: 'btn-primary',
                    keys: ['enter'], // will trigger when enter is pressed
                    action: function (scope) {
                        okFunc();
                    }
                },
                // short hand button definition
                close: function (scope) {
                    closeFunc();
                }
            }
        });
    };
    $scope.showAlert = function (title, content, msgtype) {

        new PNotify({
            title: title,
            text: content,
            type: msgtype,
            styling: 'bootstrap3'
        });
    };



    $scope.sendInvitation = function () {

        if($scope.newInvite.to)
        {
            invitationApiAccess.checkInvitable($scope.newInvite.to).then(function (resInvitable) {

                if(resInvitable.data.IsSuccess)
                {
                    var inviteObj = {
                        message:$scope.newInvite.message,
                        to:$scope.newInvite.to,
                        role:"agent"
                    }
                    invitationApiAccess.sendInvitation(inviteObj).then(function (resSend) {

                        if(resSend.data.IsSuccess)
                        {
                            $scope.showAlert("Success","Invitation sent successfully","success");
                            loadSentInvitations();
                        }
                        else
                        {
                            $scope.showAlert("Error","Invitation sending failed","error");
                        }
                    },function (errSend) {
                        $scope.showAlert("Error","Invitation sending failed","error");
                    });
                }
                else
                {
                    $scope.showAlert("Info","User is not invitable try another user","info");
                }

            },function (errInvitable) {
                $scope.showAlert("Error","Error in searching user invitablility","error");
            });
        }




    };

    var loadSentInvitations = function () {
        invitationApiAccess.getSentInvitations().then(function (resInvitations) {
            if(resInvitations.data.IsSuccess)
            {
                if(resInvitations.data.Result.length>0)
                {
                    $scope.invites=resInvitations.data.Result;
                }
                else
                {
                    $scope.showAlert("Info","No sent invitations found","info");
                }

            }
            else
            {
                $scope.showAlert("Error","Error in Loading sent invitations","error");
            }


        },function (errInvitations) {

            $scope.showAlert("Error","Error in Loading sent invitations","error");
        } );
    };
    loadSentInvitations();

    /* $scope.AppList=[];
     $scope.newApplication={};
     $scope.addNew = false;
     $scope.MasterAppList=[];
     $scope.IsDeveloper=false;
     $scope.Developers=[];

     $scope.showAlert = function (tittle,content,type) {

     new PNotify({
     title: tittle,
     text: content,
     type: type,
     styling: 'bootstrap3'
     });
     };



     $scope.saveAplication= function (resource) {


     resource.Availability=true;
     if(resource.ObjClass=="DEVELOPER")
     {
     resource.IsDeveloper=true;
     }
     appBackendService.saveNewApplication(resource).then(function (response) {

     if(!response.data.IsSuccess)
     {

     console.info("Error in adding new Application "+response.data.Exception);
     $scope.showAlert("Error", "There is an error in saving Application ","error");
     //$scope.showAlert("Error",)
     }
     else
     {
     $scope.addNew = !response.data.IsSuccess;
     $scope.showAlert("Success", "New Application added sucessfully.","success");

     $scope.AppList.splice(0, 0, response.data.Result);
     $scope.newApplication={};


     }
     $state.reload();
     }), function (error) {
     console.info("Error in adding new Application "+error);
     $scope.showAlert("Error", "There is an Exception in saving Application "+error,"error");
     $state.reload();
     }
     };


     $scope.addApplication = function () {
     $scope.addNew = !$scope.addNew;
     };
     $scope.removeDeleted = function (item) {

     var index = $scope.AppList.indexOf(item);
     if (index != -1) {
     $scope.AppList.splice(index, 1);
     }

     };
     $scope.reloadPage = function () {
     $state.reload();
     };

     $scope.GetApplications = function () {
     appBackendService.getApplications().then(function (response) {

     if(response.data.Exception)
     {
     console.info("Error in picking App list "+response.data.Exception);
     }
     else
     {
     $scope.AppList = response.data.Result;
     //$scope.MasterAppList = response.data.Result;
     }

     }), function (error) {
     console.info("Error in picking App service "+error);
     }
     };

     $scope.cancleEdit = function () {
     $scope.addNew=false;
     };



     $scope.GetApplications();*/

    $scope.reloadPage = function () {
        $state.reload();
    }

});