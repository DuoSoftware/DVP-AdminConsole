/**
 * Created by Rajinda on 9/1/2016.
 */
mainApp.controller('AgentSummaryController', function ($scope, $state, $timeout, $filter,
                                                       dashboardService, moment, userImageList, $anchorScroll, subscribeServices, userProfileApiAccess, reportQueryFilterService) {
    $anchorScroll();
    //var getAllRealTime = function () {
    //    $scope.getProfileDetails();
    //    getAllRealTimeTimer = $timeout(getAllRealTime, $scope.refreshTime);
    //};
    //
    //var getAllRealTimeTimer = $timeout(getAllRealTime, $scope.refreshTime);
    //
    //$scope.$on("$destroy", function () {
    //    if (getAllRealTimeTimer) {
    //        $timeout.cancel(getAllRealTimeTimer);
    //    }
    //});
    //$scope.refreshTime = 1000;

    $scope.enableFilter = true;

    $scope.StatusAllList = [];


    $scope.StatusList = {
        ReservedProfile: [],
        AvailableProfile: [],
        ConnectedProfile: [],
        AfterWorkProfile: [],
        OutboundProfile: [],
        SuspendedProfile: [],
        BreakProfile: [],
        profile: []
    };

    $scope.filter = {
        filterType: 'ALL',
        agentFilter: [],
        groupFilter: []
    };

    $scope.usrList = [];
    $scope.grpList = [];

    var emptyArr = [];

    $scope.querySearchUser = function (query) {
        if (query === "*" || query === "") {
            if ($scope.usrList) {
                return $scope.usrList;
            }
            else {
                return emptyArr;
            }

        }
        else {
            if ($scope.usrList) {
                var filteredArrUsr = $scope.usrList.filter(function (item) {
                    var regEx = "^(" + query + ")";

                    if (item.username) {
                        return item.username.match(regEx);
                    }
                    else {
                        return false;
                    }

                });

                return filteredArrUsr;
            }
            else {
                return emptyArr;
            }
        }

    };

    $scope.querySearchGroup = function (query) {
        if (query === "*" || query === "") {
            if ($scope.grpList) {
                return $scope.grpList;
            }
            else {
                return emptyArr;
            }

        }
        else {
            if ($scope.grpList) {
                var filteredArrGrp = $scope.grpList.filter(function (item) {
                    var regEx = "^(" + query + ")";

                    if (item.name) {
                        return item.name.match(regEx);
                    }
                    else {
                        return false;
                    }

                });

                return filteredArrGrp;
            }
            else {
                return emptyArr;
            }
        }

    };

    /*--------------------------- Filter ------------------------------------------*/
    $scope.SaveReportQueryFilter = function () {
        reportQueryFilterService.SaveReportQueryFilter("AgentProfileSummary", $scope.filter);
    };

    $scope.GetReportQueryFilter = function () {
        reportQueryFilterService.GetReportQueryFilter("AgentProfileSummary").then(function (response) {
            if (response) {
                $scope.filter = response;
            }
        }, function (error) {
            console.log(error);
        });

    };
    $scope.GetReportQueryFilter();

    /*--------------------------- Filter ------------------------------------------*/

    $scope.loadUserList = function () {
        userProfileApiAccess.getUsers().then(function (usrList) {
            if (usrList && usrList.Result) {
                var usrMapList = usrList.Result.map(function (usr) {
                    return {username: usr.username};
                });
                $scope.usrList = usrMapList;
            }
            else {
                $scope.usrList = [];
            }

        }).catch(function (err) {
            $scope.showAlert('Agent List', 'error', 'Failed to bind agent auto complete list');

        })
    };

    $scope.onSelectionChanged = function () {
        if ($scope.filter.filterType === 'ALL') {
            $scope.filter.agentFilter = [];
            $scope.filter.groupFilter = [];
        }
        else if ($scope.filter.filterType === 'USER') {
            $scope.filter.groupFilter = [];
        }
        else if ($scope.filter.filterType === 'GROUP') {
            $scope.filter.agentFilter = [];
        }

        $scope.SaveReportQueryFilter();
    };

    $scope.loadUserList();

    $scope.loadUserGroupList = function () {
        userProfileApiAccess.getUserGroups().then(function (grpList) {
            if (grpList && grpList.Result) {
                $scope.originalGrpList = grpList.Result;
                var grpMapList = grpList.Result.map(function (grp) {
                    return {name: grp.name};
                });

                $scope.grpList = grpMapList;
            }
            else {
                $scope.grpList = [];
            }


        }).catch(function (err) {
            $scope.showAlert('Group List', 'error', 'Failed to bind group auto complete list');

        })
    };

    $scope.loadUserGroupList();

    $scope.filterResList = function (res) {
        if ($scope.filter.filterType === 'USER') {
            if ($scope.filter.agentFilter && $scope.filter.agentFilter.length > 0) {
                var matchingRecord = $scope.filter.agentFilter.find(function (agent) {
                    return agent.username === res.resourceName;
                });

                return !!matchingRecord;
            }
            else {
                return false;
            }

        }
        else if ($scope.filter.filterType === 'GROUP') {
            if ($scope.filter.groupFilter && $scope.filter.groupFilter.length > 0) {
                var tempUserArr = [];

                $scope.filter.groupFilter.forEach(function (grp) {
                    var tempGrp = $scope.originalGrpList.find(function (grpItem) {
                        return grpItem.name === grp.name;
                    });

                    if (tempGrp && tempGrp.users && tempGrp.users.length > 0) {
                        tempUserArr = tempUserArr.concat(tempGrp.users);
                    }
                });


                if (tempUserArr && tempUserArr.length > 0) {
                    var matchingRecord = tempUserArr.find(function (agent) {
                        return agent.username === res.resourceName;
                    });

                    return !!matchingRecord;
                }
                else {
                    return false;
                }
            }
            else {
                return false;
            }
        }
        else {
            return true;
        }
    };

    $scope.getProfileDetails = function () {
        dashboardService.GetProfileDetails().then(function (response) {
            $scope.StatusList = {
                ReservedProfile: [],
                AvailableProfile: [],
                ConnectedProfile: [],
                AfterWorkProfile: [],
                OutboundProfile: [],
                SuspendedProfile: [],
                BreakProfile: [],
                profile: []
            };
            if (response.length > 0) {
                for (var i = 0; i < response.length; i++) {
                    if (response[i]) {
                        var profile = {
                            name: '',
                            resourceId: '',
                            slotState: null,
                            slotMode: null,
                            LastReservedTime: 0,
                            LastReservedTimeT: 0,
                            other: null,
                            breakExceeded: false,
                            freezeExceeded: false
                        };

                        profile.resourceName = response[i].ResourceName;
                        profile.resourceId = response[i].ResourceId;
                        //get current user profile image
                        userImageList.getAvatarByUserName(profile.resourceName, function (res) {
                            profile.avatar = res;
                        });

                        var resonseStatus = null, resonseAvailability = null, resourceMode = null;
                        var reservedDate = "";
                        if (response[i].ConcurrencyInfo && response[i].ConcurrencyInfo.length > 0) {

                            response[i].ConcurrencyInfo.forEach(function (concurrency) {
                                if (concurrency && concurrency.HandlingType === 'CALL' && concurrency.SlotInfo && concurrency.SlotInfo.length > 0) {

                                    // is user state Reason

                                    if (response[i].Status.Reason && response[i].Status.State) {
                                        resonseAvailability = response[i].Status.State;
                                        resonseStatus = response[i].Status.Reason;
                                        resourceMode = response[i].Status.Mode;
                                    }


                                    if (concurrency.IsRejectCountExceeded) {
                                        resonseAvailability = "NotAvailable";
                                        resonseStatus = "Suspended";
                                    }

                                    profile.slotMode = resourceMode;


                                    if (concurrency.SlotInfo[0]) {

                                        reservedDate = concurrency.SlotInfo[0].StateChangeTime;
                                    }


                                    if (resonseAvailability == "NotAvailable" && (resonseStatus == "Reject Count Exceeded" || resonseStatus == "Suspended")) {
                                        profile.slotState = resonseStatus;
                                        profile.other = "Reject";
                                    } else if (resonseAvailability == "NotAvailable" && resonseStatus.toLowerCase().indexOf("break") > -1) {
                                        profile.slotState = resonseStatus;
                                        profile.other = "Break";
                                        reservedDate = response[i].Status.StateChangeTime;
                                    } else {

                                        if (concurrency.SlotInfo[0]) {
                                            profile.slotState = concurrency.SlotInfo[0].State;
                                        }

                                        /*if (response[i].ConcurrencyInfo[0].SlotInfo[0].State == "Available") {

                                         reservedDate = response[i].Status.StateChangeTime;
                                         }*/
                                    }

                                    profile.LastReservedTimeT = reservedDate;
                                    if (reservedDate == "") {
                                        profile.LastReservedTime = null;
                                    } else {
                                        profile.LastReservedTime = moment(reservedDate).format("h:mm a");
                                    }


                                }
                            });


                            // else if (profile.slotState == 'Break' ||profile.slotState == 'MeetingBreak' ||
                            //         profile.slotState == 'MealBreak' || profile.slotState == 'TrainingBreak' ||
                            //         profile.slotState == 'TeaBreak' || profile.slotState == 'OfficialBreak' ||
                            //         profile.slotState == 'AUXBreak' ||
                            //         profile.slotState == 'ProcessRelatedBreak') {
                            //         $scope.BreakProfile.push(profile);
                            //     }

                        } else {
                            resourceMode = response[i].Status.Mode;
                            resonseAvailability = response[i].Status.State;
                            resonseStatus = response[i].Status.Reason;
                            profile.slotState = "Other";
                            profile.slotMode = resourceMode;
                            profile.other = "Offline";
                            reservedDate = response[i].Status.StateChangeTime;
                            profile.LastReservedTimeT = reservedDate;

                            if (resonseAvailability == "NotAvailable" && resonseStatus.toLowerCase().indexOf("break") > -1) {
                                profile.slotState = resonseStatus;
                                profile.other = "Break";
                            }
                        }


                        if (profile.slotState == 'Reserved') {
                            $scope.StatusList.ReservedProfile.push(profile);
                        }
                        else if (profile.other == 'Break') {
                            $scope.StatusList.BreakProfile.push(profile);
                        }
                        else if (profile.slotState == 'Connected') {
                            $scope.StatusList.ConnectedProfile.push(profile);
                        } else if (profile.slotState == 'AfterWork') {
                            $scope.StatusList.AfterWorkProfile.push(profile);
                        } else if (profile.slotMode == 'Outbound' && profile.other == null) {
                            $scope.StatusList.OutboundProfile.push(profile);
                        } else if (profile.slotState == 'Suspended') {
                            $scope.StatusList.SuspendedProfile.push(profile);
                        } else if (profile.slotState == 'Available') {
                            $scope.StatusList.AvailableProfile.push(profile);
                        } else {
                            $scope.StatusList.profile.push(profile);
                            //$scope.BreakProfile.push(profile);
                        }


                    }
                }
            }

            angular.merge($scope.StatusAllList, $scope.StatusList.ReservedProfile, $scope.StatusList.AvailableProfile, $scope.StatusList.ConnectedProfile, $scope.StatusList.AfterWorkProfile, $scope.StatusList.OutboundProfile, $scope.StatusList.SuspendedProfile, $scope.StatusList.BreakProfile,$scope.StatusList.profile);
            console.log($scope.StatusAllList);
        });
    };
    $scope.getProfileDetails();

    var setResourceData = function (profile) {
        profile.breakExceeded = false;
        profile.freezeExceeded = false;
        if (profile.slotState == 'Reserved') {
            $scope.StatusList.ReservedProfile.push(profile);
        } else if (profile.other == 'Break') {
            $scope.StatusList.BreakProfile.push(profile);
        }
        else if (profile.slotState == 'Connected') {
            $scope.StatusList.ConnectedProfile.push(profile);
        } else if (profile.slotState == 'AfterWork') {
            $scope.StatusList.AfterWorkProfile.push(profile);
        } else if (profile.slotMode == 'Outbound' && profile.other == null) {
            $scope.StatusList.OutboundProfile.push(profile);
        } else if (profile.slotState == 'Suspended') {
            $scope.StatusList.SuspendedProfile.push(profile);
        } else if (profile.slotState == 'Available') {
            $scope.StatusList.AvailableProfile.push(profile);
        } else {
            $scope.StatusList.profile.push(profile);
        }
        angular.merge($scope.StatusAllList, $scope.StatusList.ReservedProfile, $scope.StatusList.AvailableProfile, $scope.StatusList.ConnectedProfile, $scope.StatusList.AfterWorkProfile, $scope.StatusList.OutboundProfile, $scope.StatusList.SuspendedProfile, $scope.StatusList.BreakProfile,$scope.StatusList.profile);
        console.log($scope.StatusAllList);
    };

    var removeExistingResourceData = function (profile) {

        $scope.StatusList.ReservedProfile.forEach(function (data, i) {
            if (data.resourceName === profile.resourceName) {
                $scope.StatusList.ReservedProfile.splice(i, 1);
            }
        });

        $scope.StatusList.AvailableProfile.forEach(function (data, i) {
            if (data.resourceName === profile.resourceName) {
                $scope.StatusList.AvailableProfile.splice(i, 1);
            }
        });

        $scope.StatusList.ConnectedProfile.forEach(function (data, i) {
            if (data.resourceName === profile.resourceName) {
                $scope.StatusList.ConnectedProfile.splice(i, 1);
            }
        });

        $scope.StatusList.AfterWorkProfile.forEach(function (data, i) {
            if (data.resourceName === profile.resourceName) {
                $scope.StatusList.AfterWorkProfile.splice(i, 1);
            }
        });

        $scope.StatusList.OutboundProfile.forEach(function (data, i) {
            if (data.resourceName === profile.resourceName) {
                $scope.StatusList.OutboundProfile.splice(i, 1);
            }
        });

        $scope.StatusList.SuspendedProfile.forEach(function (data, i) {
            if (data.resourceName === profile.resourceName) {
                $scope.StatusList.SuspendedProfile.splice(i, 1);
            }
        });

        $scope.StatusList.BreakProfile.forEach(function (data, i) {
            if (data.resourceName === profile.resourceName) {
                $scope.StatusList.BreakProfile.splice(i, 1);
            }
        });

        $scope.StatusList.profile.forEach(function (data, i) {
            if (data.resourceName === profile.resourceName) {
                $scope.StatusList.profile.splice(i, 1);
            }
        });

        angular.merge($scope.StatusAllList, $scope.StatusList.ReservedProfile, $scope.StatusList.AvailableProfile, $scope.StatusList.ConnectedProfile, $scope.StatusList.AfterWorkProfile, $scope.StatusList.OutboundProfile, $scope.StatusList.SuspendedProfile, $scope.StatusList.BreakProfile,$scope.StatusList.profile);
        console.log($scope.StatusAllList);
    };

    subscribeServices.subscribeDashboard(function (event) {
        switch (event.roomName) {
            case 'ARDS:ResourceStatus':
                if (event.Message) {

                    userImageList.getAvatarByUserName(event.Message.userName, function (res) {
                        event.Message.avatar = res;
                    });

                    if (event.Message.task === 'CALL' || !event.Message.task) {
                        removeExistingResourceData(event.Message);
                        setResourceData(event.Message);
                    }

                }
                break;

            case 'ARDS:RemoveResourceTask':
                if (event.Message) {

                    userImageList.getAvatarByUserName(event.Message.userName, function (res) {
                        event.Message.avatar = res;
                    });

                    if (event.Message.task && event.Message.task === 'CALL') {
                        removeExistingResourceData(event.Message);
                        setResourceData(event.Message);
                    }

                }
                break;

            case 'ARDS:RemoveResource':
                if (event.Message) {

                    removeExistingResourceData(event.Message);

                }
                break;
            case 'ARDS:break_exceeded':
                if (event.Message) {
                    var agent = $filter('filter')($scope.StatusList.BreakProfile, {'resourceId': event.Message.ResourceId});
                    if (agent && agent.length > 0) {
                        agent[0].breakExceeded = true;
                    }
                }

                break;
            case 'ARDS:freeze_exceeded':
                if (event.Message) {
                    var agent = $filter('filter')($scope.StatusList.AfterWorkProfile, {'resourceId': event.Message.ResourceId});
                    if (agent && agent.length > 0) {
                        agent[0].freezeExceeded = true;
                    }
                }
                break;
            default:
                //console.log(event);
                break;

        }
    });


    /*subscribeServices.SubscribeEvents(function (event, data) {
     switch (event) {
     case 'break_exceeded':
     var agent = $filter('filter')($scope.StatusList.BreakProfile, {'name': data.UserName});
     if (agent) {
     agent.breakExceeded = true;
     }
     break;


     }
     });*/

});