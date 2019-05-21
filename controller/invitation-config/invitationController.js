/**
 * Created by Pawan on 1/16/2018.
 */
mainApp.controller("invitationController", function ($scope, $state, loginService,$ngConfirm,userProfileApiAccess,invitationApiAccess) {


    $scope.searchCriteria = "";
    $scope.isRequested=false;
    $scope.invites = [];
    $scope.newInvite={
        role:"agent"
    };
    $scope.userList = [];
    $scope.requestableAccounts =[];
    $scope.notRegisteredUsers=[];
    $scope.commonUsers=[];
    $scope.requestUsers=[];

    $scope.onUserChipAdd = function(chip)
    {
        $scope.userList.push(chip.tag);
    }
    $scope.onUserChipDelete = function(chip)
    {
        $scope.userList.splice($scope.userList.indexOf(chip.tag),1);
    }

    $scope.showConfirmation = function (title, contentData, allText,registeredText, allFunc,regFunc ,closeFunc) {

        $ngConfirm({
            title: title,
            content: contentData, // if contentUrl is provided, 'content' is ignored.
            scope: $scope,
            buttons: {
                // long hand button definition
                Registered: {
                    text: allText,
                    btnClass: 'btn-primary',
                    keys: ['enter'], // will trigger when enter is pressed
                    action: function (scope) {
                        allFunc();
                    }
                },
                NotRegistered: {
                    text: registeredText,
                    btnClass: 'btn-primary',
                    action: function (scope) {
                        regFunc();
                    }
                },
                // short hand button definition
                close: function (scope) {
                    closeFunc();
                }
            }
        });
    };

    /* $scope.names = ["123","56","333"];
     var content = '<strong>{{name}}</strong><div><span>Valid Invitees</span><div ng-repeat="item in names"><span class="reqchip">{{item}}</span></div></div>';

     $scope.showConfirmation("Invitations",content,"all","reg",function () {

     },function () {

     },function () {

     })*/



    $scope.showAlert = function (title, content, msgtype) {

        new PNotify({
            title: title,
            text: content,
            type: msgtype,
            styling: 'bootstrap3'
        });
    };



    $scope.sendInvitation = function () {

        $scope.isRequested=true;
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


                var inviteObj = {
                    message:$scope.newInvite.message,
                    to:[],
                    role:$scope.newInvite.role
                }

                if(resUsers.data.IsSuccess && resUsers.data.Result)
                {
                    if(resUsers.data.Result.unavailableAccounts)
                    {
                        requestableAccounts=resUsers.data.Result.unavailableAccounts;
                    }
                    if(resUsers.data.Result.unavailableUsers)
                    {
                        notRegisteredUsers=resUsers.data.Result.unavailableUsers;
                    }
                    if(resUsers.data.Result.unavailableUsers)
                    {
                        commonUsers=resUsers.data.Result.commonUsers;
                    }
                    if(resUsers.data.Result.requestUsers)
                    {
                        requestUsers=resUsers.data.Result.requestUsers;
                    }

                    if(notRegisteredUsers.length==0 && requestableAccounts.length==0)
                    {
                        $scope.showAlert("Registered Users Found","Users you trying to invite have been registered already with your Company","info");
                        $scope.isRequested=false;
                    }
                    else {
                        var content = '<strong>{{name}}</strong><div><span>Valid Invitees</span><div ng-repeat="item in resUsers.data.Result.unavailableAccounts"><span class="reqchip">{{item}}</span></div></div>';

                        $scope.showConfirmation("Invitations",content,"All","Registered Only",function () {

                            if(requestableAccounts.length>0)
                            {
                                inviteObj.to=requestableAccounts;

                                invitationApiAccess.sendInvitations(inviteObj).then(function (resSend) {

                                    if(resSend.data.IsSuccess)
                                    {
                                        $scope.showAlert("Success","Invitation sent successfully","success");
                                        loadSentInvitations();

                                    }
                                    else
                                    {
                                        $scope.showAlert("Error","Invitation sending failed","error");
                                        $scope.isRequested=false;
                                    }
                                    $scope.isRequested=false;
                                },function (errSend) {
                                    $scope.showAlert("Error","Invitation sending failed","error");
                                    $scope.isRequested=false;
                                });
                            }

                            if(notRegisteredUsers.length>0)
                            {
                                inviteObj.to=notRegisteredUsers;

                                invitationApiAccess.requestInvitations(inviteObj).then(function (resSend) {

                                    if(resSend.data.IsSuccess)
                                    {
                                        $scope.showAlert("Success","Invitation sent successfully","success");
                                        loadSentInvitations();
                                    }
                                    else
                                    {
                                        $scope.showAlert("Error","Invitation sending failed","error");
                                    }
                                    $scope.isRequested=false;
                                },function (errSend) {
                                    $scope.showAlert("Error","Invitation sending failed","error");
                                });
                            }
                        },function () {

                            if(requestableAccounts.length>0)
                            {
                                inviteObj.to=requestableAccounts;

                                invitationApiAccess.sendInvitations(inviteObj).then(function (resSend) {

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
                                    $scope.isRequested=false;
                                });
                            }



                        },function () {
                            $scope.isRequested=false;
                        });

                    }


                    /*var content = '<strong>Invitees Identified as follows </strong>'+'<div style="padding-top: 10px">' +
                        '<div> <span>Direct Invitables</span>' +
                        '<div ng-repeat="account in requestableAccounts">' +
                        '<div class="chip">' +
                        '  <img src="img_avatar.jpg" alt="Person">' +
                        '  {{account}}' +
                        '</div>'+
                        '</div>'+
                        '</div></div>';*/






                }
                else
                {
                    $scope.showAlert("Error","Error in Validation requests","error");
                    $scope.isRequested=false;
                }


            },function (errUsers) {
                $scope.isRequested=false;
            })
        }
        else {
            $scope.isRequested=false;
            $scope.showAlert("Error","error","Add Users before send request");
        }



        //console.log(strName);







    };

    var loadSentInvitations = function () {
        $scope.newInvite={
            role:"agent"
        };

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