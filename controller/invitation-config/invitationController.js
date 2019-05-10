/**
 * Created by Pawan on 1/16/2018.
 */
mainApp.controller("invitationController", function ($scope, $state, loginService,$ngConfirm,userProfileApiAccess,invitationApiAccess) {


    $scope.searchCriteria = "";
    $scope.invites = [];
    $scope.newInvite={
        role:"agent"
    };
    $scope.userList = [];

$scope.onUserChipAdd = function(chip)
{
    $scope.userList.push(chip.tag);
}
$scope.onUserChipDelete = function(chip)
{
    $scope.userList.splice($scope.userList.indexOf(chip.tag),1);
}

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


        var strNames="";

        angular.forEach($scope.userList,function (item,i) {

            strNames=strNames+"name="+item;
            if(i!=$scope.userList.length-1)
            {
                strNames= strNames+"&";
            }



        });

        if(strNames!="")
        {
            invitationApiAccess.checkInvitable(strNames).then(function (resUsers) {

                if(resUsers.data.IsSuccess)
                {
                    var requestableAccounts =[];
                    var notRegisteredUsers=[];
                }


            },function (errUsers) {

            })
        }



        //console.log(strName);

        if($scope.newInvite.to)
        {
            invitationApiAccess.checkInvitable($scope.newInvite.to).then(function (resInvitable) {

                if(resInvitable.data.IsSuccess)
                {
                    var inviteObj = {
                        message:$scope.newInvite.message,
                        to:$scope.newInvite.to,
                        role:$scope.newInvite.role
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


    $scope.reloadPage = function () {
        $state.reload();
    }

});