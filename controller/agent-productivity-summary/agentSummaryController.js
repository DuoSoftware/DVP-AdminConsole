/**
 * Created by Pawan on 6/15/2016.
 */
/**
 * Created by Pawan on 6/15/2016.
 */

mainApp.controller("agentSummaryController", function ($scope, $filter, $state, $q, agentSummaryBackendService, loginService, $anchorScroll) {

    $anchorScroll();
    $scope.startDate = moment().format("YYYY-MM-DD");
    $scope.endDate = moment().format("YYYY-MM-DD");
    $scope.dateValid = true;
    $scope.agentSummaryList = [];
    $scope.Agents = [];

    $scope.total = {
        StaffTime: 0,
        InboundTime: 0,
        OutboundTime: 0,
        InboundIdleTime: 0,
        OutboundIdleTime: 0,
        OfflineIdleTime: 0,
        InboundAfterWorkTime: 0,
        OutboundAfterWorkTime: 0,
        InboundAverageHandlingTime: '00:00:00',
        OutboundAverageHandlingTime: '00:00:00',
        InboundAverageTalkTime: '00:00:00',
        OutboundAverageTalkTime: '00:00:00',
        InboundTalkTime: 0,
        OutboundTalkTime: 0,
        InboundHoldTime: 0,
        OutboundHoldTime: 0,
        BreakTime: 0,
        Answered: 0,
        InboundCalls: 0,
        OutboundCalls: 0,
        InboundHold: 0,
        OutboundHold: 0,
        InboundAverageHoldTime: '00:00:00',
        OutboundAverageHoldTime: '00:00:00'
    };

    $scope.querySearch = function (query) {
        var emptyArr = [];
        if (query === "*" || query === "") {
            if ($scope.Agents) {
                return $scope.Agents;
            }
            else {
                return emptyArr;
            }

        }
        else {
            if ($scope.Agents) {
                return $scope.Agents.filter(function (item) {
                    var regEx = "^(" + query + ")";

                    if (item.ResourceName) {
                        return item.ResourceName.match(regEx);
                    }
                    else {
                        return false;
                    }

                });
            }
            else {
                return emptyArr;
            }
        }

    };

    $scope.dtOptions = {paging: false, searching: false, info: false, order: [2, 'asc']};


    $scope.onDateChange = function () {
        if (moment($scope.startDate, "YYYY-MM-DD").isValid() && moment($scope.endDate, "YYYY-MM-DD").isValid()) {
            $scope.dateValid = true;
        }
        else {
            $scope.dateValid = false;
        }
    };

    $scope.getAgentSummary = function () {
        $scope.isTableLoading = 0;
        $scope.agentSummaryList = [];
        var resId = null;
        if ($scope.agentFilter) {
            resId = $scope.agentFilter.ResourceId;
        }
        agentSummaryBackendService.getAgentSummary($scope.startDate, $scope.endDate, resId).then(function (response) {


            if (!response.data.IsSuccess) {
                console.log("Queue Summary loading failed ", response.data.Exception);
                $scope.isTableLoading = 1;
            }
            else {

                var summaryData = response.data.Result;

                var totalStaffTime = 0;
                var totalInboundTime = 0;
                var totalOutboundTime = 0;
                var totalInboundIdleTime = 0;
                var totalOutboundIdleTime = 0;
                var totalOfflineIdleTime = 0;
                var totalInboundAfterWorkTime = 0;
                var totalOutboundAfterWorkTime = 0;
                var totalInboundAverageHandlingTime = 0;
                var totalOutboundAverageHandlingTime = 0;
                var totalInboundAverageTalkTime = 0;
                var totalOutboundAverageTalkTime = 0;
                var totalInboundTalkTime = 0;
                var totalOutboundTalkTime = 0;
                var totalInboundHoldTime = 0;
                var totalOutboundHoldTime = 0;
                var totalBreakTime = 0;
                var totalAnswered = 0;
                var totalCallsInb = 0;
                var totalCallsOut = 0;
                var totalInboundHold = 0;
                var totalOutboundHold = 0;
                var totalInboundAvgHoldTime = 0;
                var totalOutboundAvgHoldTime = 0;

                var count = 0;

                for (var i = 0; i < summaryData.length; i++) {
                    // main objects

                    for (var j = 0; j < summaryData[i].Summary.length; j++) {
                        totalStaffTime = totalStaffTime + summaryData[i].Summary[j].StaffTime;
                        totalInboundTime = totalInboundTime + summaryData[i].Summary[j].InboundTime;
                        totalOutboundTime = totalOutboundTime + summaryData[i].Summary[j].OutboundTime;
                        totalInboundIdleTime = totalInboundIdleTime + summaryData[i].Summary[j].IdleTimeInbound;
                        totalOutboundIdleTime = totalOutboundIdleTime + summaryData[i].Summary[j].IdleTimeOutbound;
                        totalOfflineIdleTime = totalOfflineIdleTime + summaryData[i].Summary[j].IdleTimeOffline;
                        totalInboundAfterWorkTime = totalInboundAfterWorkTime + summaryData[i].Summary[j].AfterWorkTimeInbound;
                        totalOutboundAfterWorkTime = totalOutboundAfterWorkTime + summaryData[i].Summary[j].AfterWorkTimeOutbound;
                        totalInboundAverageHandlingTime = totalInboundAverageHandlingTime + summaryData[i].Summary[j].AverageHandlingTimeInbound;
                        totalOutboundAverageHandlingTime = totalOutboundAverageHandlingTime + summaryData[i].Summary[j].AverageHandlingTimeOutbound;
                        totalInboundAverageTalkTime = totalInboundAverageTalkTime + summaryData[i].Summary[j].AvgTalkTimeInbound;
                        totalOutboundAverageTalkTime = totalOutboundAverageTalkTime + summaryData[i].Summary[j].AvgTalkTimeOutbound;
                        totalInboundTalkTime = totalInboundTalkTime + summaryData[i].Summary[j].TalkTimeInbound;
                        totalOutboundTalkTime = totalOutboundTalkTime + summaryData[i].Summary[j].TalkTimeOutbound;
                        totalInboundHoldTime = totalInboundHoldTime + summaryData[i].Summary[j].TotalHoldTimeInbound;
                        totalOutboundHoldTime = totalOutboundHoldTime + summaryData[i].Summary[j].TotalHoldTimeOutbound;
                        totalBreakTime = totalBreakTime + summaryData[i].Summary[j].BreakTime;
                        totalAnswered = totalAnswered + summaryData[i].Summary[j].TotalAnswered;
                        totalCallsInb = totalCallsInb + summaryData[i].Summary[j].TotalCallsInbound;
                        totalCallsOut = totalCallsOut + summaryData[i].Summary[j].TotalCallsOutbound;
                        totalInboundHold = totalInboundHold + summaryData[i].Summary[j].TotalHoldInbound;
                        totalOutboundHold = totalOutboundHold + summaryData[i].Summary[j].TotalHoldOutbound;
                        totalInboundAvgHoldTime = totalInboundAvgHoldTime + summaryData[i].Summary[j].AvgHoldTimeInbound;
                        totalOutboundAvgHoldTime = totalOutboundAvgHoldTime + summaryData[i].Summary[j].AvgHoldTimeOutbound;

                        count++;

                        summaryData[i].Summary[j].StaffTime = TimeFromatter(summaryData[i].Summary[j].StaffTime, "HH:mm:ss");
                        summaryData[i].Summary[j].InboundTime = TimeFromatter(summaryData[i].Summary[j].InboundTime, "HH:mm:ss");
                        summaryData[i].Summary[j].OutboundTime = TimeFromatter(summaryData[i].Summary[j].OutboundTime, "HH:mm:ss");
                        summaryData[i].Summary[j].IdleTimeInbound = TimeFromatter(summaryData[i].Summary[j].IdleTimeInbound, "HH:mm:ss");
                        summaryData[i].Summary[j].IdleTimeOutbound = TimeFromatter(summaryData[i].Summary[j].IdleTimeOutbound, "HH:mm:ss");
                        summaryData[i].Summary[j].IdleTimeOffline = TimeFromatter(summaryData[i].Summary[j].IdleTimeOffline, "HH:mm:ss");
                        summaryData[i].Summary[j].AfterWorkTimeInbound = TimeFromatter(summaryData[i].Summary[j].AfterWorkTimeInbound, "HH:mm:ss");
                        summaryData[i].Summary[j].AfterWorkTimeOutbound = TimeFromatter(summaryData[i].Summary[j].AfterWorkTimeOutbound, "HH:mm:ss");
                        summaryData[i].Summary[j].AverageHandlingTimeInbound = TimeFromatter(summaryData[i].Summary[j].AverageHandlingTimeInbound, "HH:mm:ss");
                        summaryData[i].Summary[j].AverageHandlingTimeOutbound = TimeFromatter(summaryData[i].Summary[j].AverageHandlingTimeOutbound, "HH:mm:ss");
                        summaryData[i].Summary[j].TalkTimeInbound = TimeFromatter(summaryData[i].Summary[j].TalkTimeInbound, "HH:mm:ss");
                        summaryData[i].Summary[j].TalkTimeOutbound = TimeFromatter(summaryData[i].Summary[j].TalkTimeOutbound, "HH:mm:ss");
                        summaryData[i].Summary[j].AvgTalkTimeInbound = TimeFromatter(summaryData[i].Summary[j].AvgTalkTimeInbound, "HH:mm:ss");
                        summaryData[i].Summary[j].AvgTalkTimeOutbound = TimeFromatter(summaryData[i].Summary[j].AvgTalkTimeOutbound, "HH:mm:ss");
                        summaryData[i].Summary[j].TotalHoldTimeInbound = TimeFromatter(summaryData[i].Summary[j].TotalHoldTimeInbound, "HH:mm:ss");
                        summaryData[i].Summary[j].TotalHoldTimeOutbound = TimeFromatter(summaryData[i].Summary[j].TotalHoldTimeOutbound, "HH:mm:ss");
                        summaryData[i].Summary[j].AvgHoldTimeInbound = TimeFromatter(summaryData[i].Summary[j].AvgHoldTimeInbound, "HH:mm:ss");
                        summaryData[i].Summary[j].AvgHoldTimeOutbound = TimeFromatter(summaryData[i].Summary[j].AvgHoldTimeOutbound, "HH:mm:ss");
                        summaryData[i].Summary[j].BreakTime = TimeFromatter(summaryData[i].Summary[j].BreakTime, "HH:mm:ss");


                        $scope.agentSummaryList.push(summaryData[i].Summary[j]);
                    }
                }

                $scope.total.StaffTime = TimeFromatter(totalStaffTime, "HH:mm:ss");
                $scope.total.InboundIdleTime = TimeFromatter(totalInboundIdleTime, "HH:mm:ss");
                $scope.total.OutboundIdleTime = TimeFromatter(totalOutboundIdleTime, "HH:mm:ss");
                $scope.total.OfflineIdleTime = TimeFromatter(totalOfflineIdleTime, "HH:mm:ss");
                $scope.total.InboundAfterWorkTime = TimeFromatter(totalInboundAfterWorkTime, "HH:mm:ss");
                $scope.total.OutboundAfterWorkTime = TimeFromatter(totalOutboundAfterWorkTime, "HH:mm:ss");
                if (count > 0) {
                    $scope.total.InboundAverageHandlingTime = TimeFromatter(Math.round(totalInboundAverageHandlingTime / count), "HH:mm:ss");
                    $scope.total.OutboundAverageHandlingTime = TimeFromatter(Math.round(totalOutboundAverageHandlingTime / count), "HH:mm:ss");
                    $scope.total.InboundAverageTalkTime = TimeFromatter(Math.round(totalInboundAverageTalkTime / count), "HH:mm:ss");
                    $scope.total.OutboundAverageTalkTime = TimeFromatter(Math.round(totalOutboundAverageTalkTime / count), "HH:mm:ss");
                    $scope.total.InboundAverageHoldTime = TimeFromatter(Math.round(totalInboundAvgHoldTime / count), "HH:mm:ss");
                    $scope.total.OutboundAverageHoldTime = TimeFromatter(Math.round(totalOutboundAvgHoldTime / count), "HH:mm:ss");
                }
                else {
                    $scope.total.InboundAverageHandlingTime = TimeFromatter(totalInboundAverageHandlingTime, "HH:mm:ss");
                    $scope.total.OutboundAverageHandlingTime = TimeFromatter(totalOutboundAverageHandlingTime, "HH:mm:ss");
                    $scope.total.OutboundAverageTalkTime = TimeFromatter(totalInboundAverageTalkTime, "HH:mm:ss");
                    $scope.total.OutboundAverageTalkTime = TimeFromatter(totalOutboundAverageTalkTime, "HH:mm:ss");
                    $scope.total.InboundAverageHoldTime = TimeFromatter(totalInboundAvgHoldTime, "HH:mm:ss");
                    $scope.total.OutboundAverageHoldTime = TimeFromatter(totalOutboundAvgHoldTime, "HH:mm:ss");
                }

                $scope.total.InboundTalkTime = TimeFromatter(totalInboundTalkTime, "HH:mm:ss");
                $scope.total.OutboundTalkTime = TimeFromatter(totalOutboundTalkTime, "HH:mm:ss");
                $scope.total.InboundHoldTime = TimeFromatter(totalInboundHoldTime, "HH:mm:ss");
                $scope.total.OutboundHoldTime = TimeFromatter(totalOutboundHoldTime, "HH:mm:ss");
                $scope.total.BreakTime = TimeFromatter(totalBreakTime, "HH:mm:ss");
                $scope.total.Answered = totalAnswered;
                $scope.total.InboundCalls = totalCallsInb;
                $scope.total.OutboundCalls = totalCallsOut;
                $scope.AgentDetailsAssignToSummery();
                console.log($scope.agentSummaryList);

                $scope.isTableLoading = 1;
            }

        }, function (error) {
            loginService.isCheckResponse(error);
            console.log("Error in Queue Summary loading ", error);
            $scope.isTableLoading = 1;
        });
    };

    $scope.getAgentSummaryCSV = function () {
        $scope.DownloadFileName = 'AGENT_PRODUCTIVITY_SUMMARY_' + $scope.startDate + '_' + $scope.endDate;
        var deferred = $q.defer();
        var agentSummaryList = [];
        var resId = null;
        if ($scope.agentFilter) {
            resId = $scope.agentFilter.ResourceId;
        }

        agentSummaryBackendService.getAgentSummary($scope.startDate, $scope.endDate, resId).then(function (response) {

            if (!response.data.IsSuccess) {
                console.log("Queue Summary loading failed ", response.data.Exception);
                deferred.reject(agentSummaryList);
            }
            else {

                var summaryData = response.data.Result;

                var totalStaffTime = 0;
                var totalInboundTime = 0;
                var totalOutboundTime = 0;
                var totalInboundIdleTime = 0;
                var totalOutboundIdleTime = 0;
                var totalOfflineIdleTime = 0;
                var totalInboundAfterWorkTime = 0;
                var totalOutboundAfterWorkTime = 0;
                var totalInboundAverageHandlingTime = 0;
                var totalOutboundAverageHandlingTime = 0;
                var totalInboundAverageTalkTime = 0;
                var totalOutboundAverageTalkTime = 0;
                var totalInboundTalkTime = 0;
                var totalOutboundTalkTime = 0;
                var totalInboundHoldTime = 0;
                var totalOutboundHoldTime = 0;
                var totalBreakTime = 0;
                var totalAnswered = 0;
                var totalCallsInb = 0;
                var totalCallsOut = 0;
                var totalInboundHold = 0;
                var totalOutboundHold = 0;
                var totalInboundAvgHoldTime = 0;
                var totalOutboundAvgHoldTime = 0;

                var count = 0;

                for (var i = 0; i < summaryData.length; i++) {
                    // main objects

                    for (var j = 0; j < summaryData[i].Summary.length; j++) {
                        totalStaffTime = totalStaffTime + summaryData[i].Summary[j].StaffTime;
                        totalInboundTime = totalInboundTime + summaryData[i].Summary[j].InboundTime;
                        totalOutboundTime = totalOutboundTime + summaryData[i].Summary[j].OutboundTime;
                        totalInboundIdleTime = totalInboundIdleTime + summaryData[i].Summary[j].IdleTimeInbound;
                        totalOutboundIdleTime = totalOutboundIdleTime + summaryData[i].Summary[j].IdleTimeOutbound;
                        totalOfflineIdleTime = totalOfflineIdleTime + summaryData[i].Summary[j].IdleTimeOffline;
                        totalInboundAfterWorkTime = totalInboundAfterWorkTime + summaryData[i].Summary[j].AfterWorkTimeInbound;
                        totalOutboundAfterWorkTime = totalOutboundAfterWorkTime + summaryData[i].Summary[j].AfterWorkTimeOutbound;
                        totalInboundAverageHandlingTime = totalInboundAverageHandlingTime + summaryData[i].Summary[j].AverageHandlingTimeInbound;
                        totalOutboundAverageHandlingTime = totalOutboundAverageHandlingTime + summaryData[i].Summary[j].AverageHandlingTimeOutbound;
                        totalInboundAverageTalkTime = totalInboundAverageTalkTime + summaryData[i].Summary[j].AvgTalkTimeInbound;
                        totalOutboundAverageTalkTime = totalOutboundAverageTalkTime + summaryData[i].Summary[j].AvgTalkTimeOutbound;
                        totalInboundTalkTime = totalInboundTalkTime + summaryData[i].Summary[j].TalkTimeInbound;
                        totalOutboundTalkTime = totalOutboundTalkTime + summaryData[i].Summary[j].TalkTimeOutbound;
                        totalInboundHoldTime = totalInboundHoldTime + summaryData[i].Summary[j].TotalHoldTimeInbound;
                        totalOutboundHoldTime = totalOutboundHoldTime + summaryData[i].Summary[j].TotalHoldTimeOutbound;
                        totalBreakTime = totalBreakTime + summaryData[i].Summary[j].BreakTime;
                        totalAnswered = totalAnswered + summaryData[i].Summary[j].TotalAnswered;
                        totalCallsInb = totalCallsInb + summaryData[i].Summary[j].TotalCallsInbound;
                        totalCallsOut = totalCallsOut + summaryData[i].Summary[j].TotalCallsOutbound;
                        totalInboundHold = totalInboundHold + summaryData[i].Summary[j].TotalHoldInbound;
                        totalOutboundHold = totalOutboundHold + summaryData[i].Summary[j].TotalHoldOutbound;
                        totalInboundAvgHoldTime = totalInboundAvgHoldTime + summaryData[i].Summary[j].AvgHoldTimeInbound;
                        totalOutboundAvgHoldTime = totalOutboundAvgHoldTime + summaryData[i].Summary[j].AvgHoldTimeOutbound;

                        count++;

                        summaryData[i].Summary[j].StaffTime = TimeFromatter(summaryData[i].Summary[j].StaffTime, "HH:mm:ss");
                        summaryData[i].Summary[j].InboundTime = TimeFromatter(summaryData[i].Summary[j].InboundTime, "HH:mm:ss");
                        summaryData[i].Summary[j].OutboundTime = TimeFromatter(summaryData[i].Summary[j].OutboundTime, "HH:mm:ss");
                        summaryData[i].Summary[j].IdleTimeInbound = TimeFromatter(summaryData[i].Summary[j].IdleTimeInbound, "HH:mm:ss");
                        summaryData[i].Summary[j].IdleTimeOutbound = TimeFromatter(summaryData[i].Summary[j].IdleTimeOutbound, "HH:mm:ss");
                        summaryData[i].Summary[j].IdleTimeOffline = TimeFromatter(summaryData[i].Summary[j].IdleTimeOffline, "HH:mm:ss");
                        summaryData[i].Summary[j].AfterWorkTimeInbound = TimeFromatter(summaryData[i].Summary[j].AfterWorkTimeInbound, "HH:mm:ss");
                        summaryData[i].Summary[j].AfterWorkTimeOutbound = TimeFromatter(summaryData[i].Summary[j].AfterWorkTimeOutbound, "HH:mm:ss");
                        summaryData[i].Summary[j].AverageHandlingTimeInbound = TimeFromatter(summaryData[i].Summary[j].AverageHandlingTimeInbound, "HH:mm:ss");
                        summaryData[i].Summary[j].AverageHandlingTimeOutbound = TimeFromatter(summaryData[i].Summary[j].AverageHandlingTimeOutbound, "HH:mm:ss");
                        summaryData[i].Summary[j].TalkTimeInbound = TimeFromatter(summaryData[i].Summary[j].TalkTimeInbound, "HH:mm:ss");
                        summaryData[i].Summary[j].TalkTimeOutbound = TimeFromatter(summaryData[i].Summary[j].TalkTimeOutbound, "HH:mm:ss");
                        summaryData[i].Summary[j].AvgTalkTimeInbound = TimeFromatter(summaryData[i].Summary[j].AvgTalkTimeInbound, "HH:mm:ss");
                        summaryData[i].Summary[j].AvgTalkTimeOutbound = TimeFromatter(summaryData[i].Summary[j].AvgTalkTimeOutbound, "HH:mm:ss");
                        summaryData[i].Summary[j].TotalHoldTimeInbound = TimeFromatter(summaryData[i].Summary[j].TotalHoldTimeInbound, "HH:mm:ss");
                        summaryData[i].Summary[j].TotalHoldTimeOutbound = TimeFromatter(summaryData[i].Summary[j].TotalHoldTimeOutbound, "HH:mm:ss");
                        summaryData[i].Summary[j].AvgHoldTimeInbound = TimeFromatter(summaryData[i].Summary[j].AvgHoldTimeInbound, "HH:mm:ss");
                        summaryData[i].Summary[j].AvgHoldTimeOutbound = TimeFromatter(summaryData[i].Summary[j].AvgHoldTimeOutbound, "HH:mm:ss");
                        summaryData[i].Summary[j].BreakTime = TimeFromatter(summaryData[i].Summary[j].BreakTime, "HH:mm:ss");


                        agentSummaryList.push(summaryData[i].Summary[j]);
                    }
                }

                for (var k = 0; k < agentSummaryList.length; k++) {
                    for (var l = 0; l < $scope.Agents.length; l++) {
                        if ($scope.Agents[l].ResourceId == agentSummaryList[k].Agent) {
                            agentSummaryList[k].AgentName = $scope.Agents[l].ResourceName;

                        }
                    }
                }

                var total =
                {
                    AgentName: 'Total',
                    Date: 'N/A',
                    StaffTime: TimeFromatter(totalStaffTime, "HH:mm:ss"),
                    InboundTime: TimeFromatter(totalInboundTime, "HH:mm:ss"),
                    OutboundTime: TimeFromatter(totalOutboundTime, "HH:mm:ss"),
                    IdleTimeInbound: TimeFromatter(totalInboundIdleTime, "HH:mm:ss"),
                    IdleTimeOutbound: TimeFromatter(totalOutboundIdleTime, "HH:mm:ss"),
                    IdleTimeOffline: TimeFromatter(totalOfflineIdleTime, "HH:mm:ss"),
                    AfterWorkTimeInbound: TimeFromatter(totalInboundAfterWorkTime, "HH:mm:ss"),
                    AfterWorkTimeOutbound: TimeFromatter(totalOutboundAfterWorkTime, "HH:mm:ss"),
                    AverageHandlingTimeInbound: '00:00:00',
                    AverageHandlingTimeOutbound: '00:00:00',
                    AvgTalkTimeInbound: '00:00:00',
                    AvgTalkTimeOutbound: '00:00:00',
                    InboundTalkTime: TimeFromatter(totalInboundTalkTime, "HH:mm:ss"),
                    OutboundTalkTime: TimeFromatter(totalOutboundTalkTime, "HH:mm:ss"),
                    InboundHoldTime: TimeFromatter(totalInboundHoldTime, "HH:mm:ss"),
                    OutboundHoldTime: TimeFromatter(totalOutboundHoldTime, "HH:mm:ss"),
                    BreakTime: TimeFromatter(totalBreakTime, "HH:mm:ss"),
                    Answered: totalAnswered,
                    InboundCalls: totalCallsInb,
                    OutboundCalls: totalCallsOut,
                    InboundHold: totalInboundHold,
                    OutboundHold: totalOutboundHold,
                    InboundAverageHoldTime: '00:00:00',
                    OutboundAverageHoldTime: '00:00:00'
                };

                if (count > 0) {
                    total.InboundAverageHandlingTime = TimeFromatter(Math.round(totalInboundAverageHandlingTime / count), "HH:mm:ss");
                    total.OutboundAverageHandlingTime = TimeFromatter(Math.round(totalOutboundAverageHandlingTime / count), "HH:mm:ss");
                    total.InboundAverageTalkTime = TimeFromatter(Math.round(totalInboundAverageTalkTime / count), "HH:mm:ss");
                    total.OutboundAverageTalkTime = TimeFromatter(Math.round(totalOutboundAverageTalkTime / count), "HH:mm:ss");
                    total.InboundAverageHoldTime = TimeFromatter(Math.round(totalInboundAvgHoldTime / count), "HH:mm:ss");
                    total.OutboundAverageHoldTime = TimeFromatter(Math.round(totalOutboundAvgHoldTime / count), "HH:mm:ss");
                }
                else {
                    total.InboundAverageHandlingTime = TimeFromatter(totalInboundAverageHandlingTime, "HH:mm:ss");
                    total.OutboundAverageHandlingTime = TimeFromatter(totalOutboundAverageHandlingTime, "HH:mm:ss");
                    total.OutboundAverageTalkTime = TimeFromatter(totalInboundAverageTalkTime, "HH:mm:ss");
                    total.OutboundAverageTalkTime = TimeFromatter(totalOutboundAverageTalkTime, "HH:mm:ss");
                    total.InboundAverageHoldTime = TimeFromatter(totalInboundAvgHoldTime, "HH:mm:ss");
                    total.OutboundAverageHoldTime = TimeFromatter(totalOutboundAvgHoldTime, "HH:mm:ss");
                }

                agentSummaryList.push(total);
                //$scope.AgentDetailsAssignToSummery();
                deferred.resolve(agentSummaryList);
            }

        }, function (error) {
            loginService.isCheckResponse(error);
            console.log("Error in Queue Summary loading ", error);
            deferred.reject(agentSummaryList);
        });

        return deferred.promise;
    };

    $scope.getAgents = function () {
        agentSummaryBackendService.getAgentDetails().then(function (response) {
            if (response.data.IsSuccess) {
                console.log("Agents " + response.data.Result);
                console.log(response.data.Result.length + " Agent records found");
                $scope.Agents = response.data.Result;
            }
            else {
                console.log("Error in Agent details picking");
            }
        }, function (error) {
            loginService.isCheckResponse(error);
            console.log("Error in Agent details picking " + error);
        });
    };

    $scope.AgentDetailsAssignToSummery = function () {


        for (var i = 0; i < $scope.agentSummaryList.length; i++) {
            //$scope.agentSummaryList[i].AverageHandlingTime=Math.round($scope.agentSummaryList[i].AverageHandlingTime * 100) / 100;
            for (var j = 0; j < $scope.Agents.length; j++) {
                if ($scope.Agents[j].ResourceId == $scope.agentSummaryList[i].Agent) {
                    $scope.agentSummaryList[i].AgentName = $scope.Agents[j].ResourceName;

                }
            }
        }
    };

    var TimeFromatter = function (mins, timeFormat) {

        var timeStr = '00:00:00';
        if (mins > 0) {
            var durationObj = moment.duration(mins * 1000);

            var totalHrs = Math.floor(durationObj.asHours());

            var temphrs = '00';


            if (totalHrs > 0 && totalHrs < 10) {
                temphrs = '0' + totalHrs;
            }
            else if (totalHrs >= 10) {
                temphrs = totalHrs;
            }

            var tempmins = '00';

            if (durationObj._data.minutes > 0 && durationObj._data.minutes < 10) {
                tempmins = '0' + durationObj._data.minutes;
            }
            else if (durationObj._data.minutes >= 10) {
                tempmins = durationObj._data.minutes;
            }

            var tempsec = '00';

            if (durationObj._data.seconds > 0 && durationObj._data.seconds < 10) {
                tempsec = '0' + durationObj._data.seconds;
            }
            else if (durationObj._data.seconds >= 10) {
                tempsec = durationObj._data.seconds;
            }

            timeStr = temphrs + ':' + tempmins + ':' + tempsec;
        }

        return timeStr;

    };

    $scope.getAgents();

});