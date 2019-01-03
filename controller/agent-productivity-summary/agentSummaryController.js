/**
 * Created by Pawan on 6/15/2016.
 */
/**
 * Created by Pawan on 6/15/2016.
 */

mainApp.controller("agentSummaryController", function ($scope, $filter, $state, $q, agentSummaryBackendService, loginService, $anchorScroll,uiGridConstants, filterDateRangeValidation,ShareData ) {

    $anchorScroll();
    $scope.startDate = moment().format("YYYY-MM-DD");
    $scope.endDate = moment().format("YYYY-MM-DD");
    $scope.dateValid = true;
    $scope.agentSummaryList = [];
    $scope.Agents = [];

	$scope.onDateChange = function () {

		if (moment($scope.startDate, "YYYY-MM-DD").isValid() && moment($scope.endDate, "YYYY-MM-DD").isValid()) {
			$scope.dateValid = true;
		}
		else {
			$scope.dateValid = false;
		}
	};

    // $(function () {
    //     $("#startDate").datepicker({maxDate: "-1D" });
    // });
	//
    // $(function () {
    //     $("#endDate").datepicker({maxDate: "-1D" });
    // });

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
        OutboundAnswered: 0,
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
                var filteredArr = $scope.Agents.filter(function (item) {

                    if (item.ResourceName) {
                        return item.ResourceName.toString().toLowerCase().match(query);
                    }
                    else {
                        return false;
                    }

                });

                return filteredArr;
            }
            else {
                return emptyArr;
            }


           /* if ($scope.Agents) {
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
            }*/
        }

    };

    $scope.getTableHeight = function() {
        var rowHeight = 30; // your row height
        var headerHeight = 50; // your header height
        return {
            height: (($scope.gridQOptions.data.length+2) * rowHeight + headerHeight) + "px"
        };
    };

    $scope.gridQOptions = {
        enableSorting: true,
        enableRowSelection: false,
        enableRowHeaderSelection: false,
        multiSelect: false,
        modifierKeysToMultiSelect: false,
        noUnselect: false,
        columnDefs: [
            {
                width: '150',name: 'AgentName', field: 'AgentName', headerTooltip: 'Agent Name',  sort: {
                direction: uiGridConstants.ASC
            }
            },
            {width: '80',name: 'Date', field: 'Date', headerTooltip: 'Date',cellFilter: 'date:\'yyyy-MM-dd\'', cellClass: 'table-time'},
            {width: '150',name: 'LoginTime', field: 'LoginTime', headerTooltip: 'LoginTime', cellClass: 'table-time'},
            {width: '60',name: 'TotalCallsInbound', field: 'TotalCallsInbound', headerTooltip: 'TotalCallsInbound', cellClass: 'table-number'},
            {width: '60',name : 'TotalCallsOutbound', field: 'TotalCallsOutbound', headerTooltip: 'TotalCallsOutbound', cellClass: 'table-number'},
            {width: '60',name: 'TotalAnswered', field: 'TotalAnswered', headerTooltip: 'TotalAnswered', cellClass: 'table-number'},
            {width: '60',name: 'TotalAnsweredOutbound', field: 'TotalAnsweredOutbound', headerTooltip: 'TotalAnsweredOutbound', cellClass: 'table-number'},
            {width: '60',name : 'TotalHoldInbound', field: 'TotalHoldInbound', headerTooltip: 'TotalHoldInbound', cellClass: 'table-number'},
            {width: '60',name : 'TotalHoldOutbound', field: 'TotalHoldOutbound', headerTooltip: 'TotalHoldOutbound', cellClass: 'table-number'},
            //{width: '60',name : 'MissedCallCount', field: 'MissCallCount', headerTooltip: 'MissedCallCount', cellClass: 'table-number'},
            {width: '80',name : 'StaffTime', field: 'StaffTime', headerTooltip: 'StaffTime', cellClass: 'table-time'},
            {width: '80',name : 'InboundTime', field: 'InboundTime', headerTooltip: 'InboundTime', cellClass: 'table-time'},
            {width: '80',name : 'OutboundTime', field: 'OutboundTime', headerTooltip: 'OutboundTime', cellClass: 'table-time'},
            {width: '80',name : 'IdleTimeInbound', field: 'IdleTimeInbound', headerTooltip: 'IdleTimeInbound', cellClass: 'table-time'},
            {width: '80',name : 'IdleTimeOutbound', field: 'IdleTimeOutbound', headerTooltip: 'IdleTimeOutbound', cellClass: 'table-time'},
            {width: '80',name : 'IdleTimeOffline', field: 'IdleTimeOffline', headerTooltip: 'IdleTimeOffline', cellClass: 'table-time'},
            {width: '80',name : 'TalkTimeInbound', field: 'TalkTimeInbound', headerTooltip: 'TalkTimeInbound', cellClass: 'table-time'},
            {width: '80',name : 'TalkTimeOutbound', field: 'TalkTimeOutbound', headerTooltip: 'TalkTimeOutbound', cellClass: 'table-time'},
            {width: '80',name : 'TotalHoldTimeInbound', field: 'TotalHoldTimeInbound', headerTooltip: 'TotalHoldTimeInbound', cellClass: 'table-time'},
            {width: '80',name : 'TotalHoldTimeOutbound', field: 'TotalHoldTimeOutbound', headerTooltip: 'TotalHoldTimeOutbound', cellClass: 'table-time'},
            {width: '80',name : 'AfterWorkTimeInbound', field: 'AfterWorkTimeInbound', headerTooltip: 'AfterWorkTimeInbound', cellClass: 'table-time'},
            {width: '80',name : 'AfterWorkTimeOutbound', field: 'AfterWorkTimeOutbound', headerTooltip: 'AfterWorkTimeOutbound', cellClass: 'table-time'},
            {width: '80',name : 'BreakTime', field: 'BreakTime', headerTooltip: 'BreakTime', cellClass: 'table-time'},
            {width: '80',name : 'AverageHandlingTimeInbound', field: 'AverageHandlingTimeInbound', headerTooltip: 'AverageHandlingTimeInbound', cellClass: 'table-time'},
            {width: '80',name : 'AverageHandlingTimeOutbound', field: 'AverageHandlingTimeOutbound', headerTooltip: 'AverageHandlingTimeOutbound', cellClass: 'table-time'},
            {width: '80',name : 'AvgTalkTimeInbound', field: 'AvgTalkTimeInbound', headerTooltip: 'AvgTalkTimeInbound', cellClass: 'table-time'},
            {width: '80',name : 'AvgTalkTimeOutbound', field: 'AvgTalkTimeOutbound', headerTooltip: 'AvgTalkTimeOutbound', cellClass: 'table-time'},
            {width: '80',name : 'AvgHoldTimeInbound', field: 'AvgHoldTimeInbound', headerTooltip: 'AvgHoldTimeInbound', cellClass: 'table-time'},
            {width: '80',name : 'AvgHoldTimeOutbound', field: 'AvgHoldTimeOutbound', headerTooltip: 'AvgHoldTimeOutbound', cellClass: 'table-time'}
        ],
        data: $scope.agentSummaryList,
        onRegisterApi: function (gridApi) {
            //$scope.grid1Api = gridApi;
        }
    };


//    $scope.dtOptions = {paging: false, searching: false, info: false, order: [2, 'asc']};

    $scope.getAgentSummary = function () {
        $scope.isTableLoading = 0;
        $scope.agentSummaryList = [];
        $scope.gridQOptions.data = [];
        var resId = null;
        if ($scope.agentFilter) {
            resId = $scope.agentFilter.ResourceId;
        }

        var momentTz = moment.parseZone(new Date()).format('Z');
        momentTz = momentTz.replace("+", "%2B");

        var queryStartDate = $scope.startDate + ' 00:00:00' + momentTz;
        var queryEndDate = $scope.endDate + ' 23:59:59' + momentTz;

        agentSummaryBackendService.getAgentSummary(queryStartDate, queryEndDate, resId, ShareData.BusinessUnit).then(function (response) {


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
                var totalOutboundAnswered = 0;
                var totalCallsInb = 0;
                var totalCallsOut = 0;
                var MissCallCount = 0;
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
                        totalBreakTime = totalBreakTime + summaryData[i].Summary[j].BreakTime;


                        summaryData[i].Summary[j].StaffTime = TimeFromatter(summaryData[i].Summary[j].StaffTime, "HH:mm:ss");
                        summaryData[i].Summary[j].LoginTime = moment(summaryData[i].Summary[j].LoginTime).format("YYYY-MM-DD HH:mm:ss");
                        summaryData[i].Summary[j].InboundTime = TimeFromatter(summaryData[i].Summary[j].InboundTime, "HH:mm:ss");
                        summaryData[i].Summary[j].OutboundTime = TimeFromatter(summaryData[i].Summary[j].OutboundTime, "HH:mm:ss");
                        summaryData[i].Summary[j].IdleTimeInbound = TimeFromatter(summaryData[i].Summary[j].IdleTimeInbound, "HH:mm:ss");
                        summaryData[i].Summary[j].IdleTimeOutbound = TimeFromatter(summaryData[i].Summary[j].IdleTimeOutbound, "HH:mm:ss");
                        summaryData[i].Summary[j].IdleTimeOffline = TimeFromatter(summaryData[i].Summary[j].IdleTimeOffline, "HH:mm:ss");
                        summaryData[i].Summary[j].BreakTime = TimeFromatter(summaryData[i].Summary[j].BreakTime, "HH:mm:ss");

                        if(ShareData.BusinessUnit && ShareData.BusinessUnit.toLowerCase() != "all") {

                            if (summaryData[i].Summary[j] && summaryData[i].Summary[j][ShareData.BusinessUnit]) {

                                totalInboundAfterWorkTime = totalInboundAfterWorkTime + summaryData[i].Summary[j][ShareData.BusinessUnit].AfterWorkTimeInbound;
                                totalOutboundAfterWorkTime = totalOutboundAfterWorkTime + summaryData[i].Summary[j][ShareData.BusinessUnit].AfterWorkTimeOutbound;
                                totalInboundAverageHandlingTime = totalInboundAverageHandlingTime + summaryData[i].Summary[j][ShareData.BusinessUnit].AverageHandlingTimeInbound;
                                totalOutboundAverageHandlingTime = totalOutboundAverageHandlingTime + summaryData[i].Summary[j][ShareData.BusinessUnit].AverageHandlingTimeOutbound;
                                totalInboundAverageTalkTime = totalInboundAverageTalkTime + summaryData[i].Summary[j][ShareData.BusinessUnit].AvgTalkTimeInbound;
                                totalOutboundAverageTalkTime = totalOutboundAverageTalkTime + summaryData[i].Summary[j][ShareData.BusinessUnit].AvgTalkTimeOutbound;
                                totalInboundTalkTime = totalInboundTalkTime + summaryData[i].Summary[j][ShareData.BusinessUnit].TalkTimeInbound;
                                totalOutboundTalkTime = totalOutboundTalkTime + summaryData[i].Summary[j][ShareData.BusinessUnit].TalkTimeOutbound;
                                totalInboundHoldTime = totalInboundHoldTime + summaryData[i].Summary[j][ShareData.BusinessUnit].TotalHoldTimeInbound;
                                totalOutboundHoldTime = totalOutboundHoldTime + summaryData[i].Summary[j][ShareData.BusinessUnit].TotalHoldTimeOutbound;
                                totalAnswered = totalAnswered + summaryData[i].Summary[j][ShareData.BusinessUnit].TotalAnswered;
                                totalCallsInb = totalCallsInb + summaryData[i].Summary[j][ShareData.BusinessUnit].TotalCallsInbound;
                                totalCallsOut = totalCallsOut + summaryData[i].Summary[j][ShareData.BusinessUnit].TotalCallsOutbound;
                                MissCallCount = MissCallCount + summaryData[i].Summary[j][ShareData.BusinessUnit].MissCallCount;
                                totalOutboundAnswered = totalOutboundAnswered + summaryData[i].Summary[j][ShareData.BusinessUnit].TotalAnsweredOutbound;
                                totalInboundHold = totalInboundHold + summaryData[i].Summary[j][ShareData.BusinessUnit].TotalHoldInbound;
                                totalOutboundHold = totalOutboundHold + summaryData[i].Summary[j][ShareData.BusinessUnit].TotalHoldOutbound;
                                totalInboundAvgHoldTime = totalInboundAvgHoldTime + summaryData[i].Summary[j][ShareData.BusinessUnit].AvgHoldTimeInbound;
                                totalOutboundAvgHoldTime = totalOutboundAvgHoldTime + summaryData[i].Summary[j][ShareData.BusinessUnit].AvgHoldTimeOutbound;


                                summaryData[i].Summary[j].TotalAnswered = summaryData[i].Summary[j][ShareData.BusinessUnit].TotalAnswered;
                                summaryData[i].Summary[j].TotalAnsweredOutbound = summaryData[i].Summary[j][ShareData.BusinessUnit].TotalAnsweredOutbound;
                                summaryData[i].Summary[j].TotalCallsInbound = summaryData[i].Summary[j][ShareData.BusinessUnit].TotalCallsInbound;
                                summaryData[i].Summary[j].TotalCallsOutbound = summaryData[i].Summary[j][ShareData.BusinessUnit].TotalCallsOutbound;
                                summaryData[i].Summary[j].TotalHoldInbound = summaryData[i].Summary[j][ShareData.BusinessUnit].TotalHoldInbound;
                                summaryData[i].Summary[j].TotalHoldOutbound = summaryData[i].Summary[j][ShareData.BusinessUnit].TotalHoldOutbound;



                                summaryData[i].Summary[j].AfterWorkTimeInbound = TimeFromatter(summaryData[i].Summary[j][ShareData.BusinessUnit].AfterWorkTimeInbound, "HH:mm:ss");
                                summaryData[i].Summary[j].AfterWorkTimeOutbound = TimeFromatter(summaryData[i].Summary[j][ShareData.BusinessUnit].AfterWorkTimeOutbound, "HH:mm:ss");
                                summaryData[i].Summary[j].AverageHandlingTimeInbound = TimeFromatter(summaryData[i].Summary[j][ShareData.BusinessUnit].AverageHandlingTimeInbound, "HH:mm:ss");
                                summaryData[i].Summary[j].AverageHandlingTimeOutbound = TimeFromatter(summaryData[i].Summary[j][ShareData.BusinessUnit].AverageHandlingTimeOutbound, "HH:mm:ss");
                                summaryData[i].Summary[j].TalkTimeInbound = TimeFromatter(summaryData[i].Summary[j][ShareData.BusinessUnit].TalkTimeInbound, "HH:mm:ss");
                                summaryData[i].Summary[j].TalkTimeOutbound = TimeFromatter(summaryData[i].Summary[j][ShareData.BusinessUnit].TalkTimeOutbound, "HH:mm:ss");
                                summaryData[i].Summary[j].AvgTalkTimeInbound = TimeFromatter(summaryData[i].Summary[j][ShareData.BusinessUnit].AvgTalkTimeInbound, "HH:mm:ss");
                                summaryData[i].Summary[j].AvgTalkTimeOutbound = TimeFromatter(summaryData[i].Summary[j][ShareData.BusinessUnit].AvgTalkTimeOutbound, "HH:mm:ss");
                                summaryData[i].Summary[j].TotalHoldTimeInbound = TimeFromatter(summaryData[i].Summary[j][ShareData.BusinessUnit].TotalHoldTimeInbound, "HH:mm:ss");
                                summaryData[i].Summary[j].TotalHoldTimeOutbound = TimeFromatter(summaryData[i].Summary[j][ShareData.BusinessUnit].TotalHoldTimeOutbound, "HH:mm:ss");
                                summaryData[i].Summary[j].AvgHoldTimeInbound = TimeFromatter(summaryData[i].Summary[j][ShareData.BusinessUnit].AvgHoldTimeInbound, "HH:mm:ss");
                                summaryData[i].Summary[j].AvgHoldTimeOutbound = TimeFromatter(summaryData[i].Summary[j][ShareData.BusinessUnit].AvgHoldTimeOutbound, "HH:mm:ss");

                            }else{


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
                                MissCallCount = MissCallCount + summaryData[i].Summary[j].MissCallCount;
                                totalOutboundAnswered = totalOutboundAnswered + summaryData[i].Summary[j].TotalAnsweredOutbound;
                                totalInboundHold = totalInboundHold + summaryData[i].Summary[j].TotalHoldInbound;
                                totalOutboundHold = totalOutboundHold + summaryData[i].Summary[j].TotalHoldOutbound;
                                totalInboundAvgHoldTime = totalInboundAvgHoldTime + summaryData[i].Summary[j].AvgHoldTimeInbound;
                                totalOutboundAvgHoldTime = totalOutboundAvgHoldTime + summaryData[i].Summary[j].AvgHoldTimeOutbound;

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

                            }
                        }else {


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
                            MissCallCount = MissCallCount + summaryData[i].Summary[j].MissCallCount;
                            totalOutboundAnswered = totalOutboundAnswered + summaryData[i].Summary[j].TotalAnsweredOutbound;
                            totalInboundHold = totalInboundHold + summaryData[i].Summary[j].TotalHoldInbound;
                            totalOutboundHold = totalOutboundHold + summaryData[i].Summary[j].TotalHoldOutbound;
                            totalInboundAvgHoldTime = totalInboundAvgHoldTime + summaryData[i].Summary[j].AvgHoldTimeInbound;
                            totalOutboundAvgHoldTime = totalOutboundAvgHoldTime + summaryData[i].Summary[j].AvgHoldTimeOutbound;

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


                        }


                        // totalInboundAfterWorkTime = totalInboundAfterWorkTime + summaryData[i].Summary[j].AfterWorkTimeInbound;
                        // totalOutboundAfterWorkTime = totalOutboundAfterWorkTime + summaryData[i].Summary[j].AfterWorkTimeOutbound;
                        // totalInboundAverageHandlingTime = totalInboundAverageHandlingTime + summaryData[i].Summary[j].AverageHandlingTimeInbound;
                        // totalOutboundAverageHandlingTime = totalOutboundAverageHandlingTime + summaryData[i].Summary[j].AverageHandlingTimeOutbound;
                        // totalInboundAverageTalkTime = totalInboundAverageTalkTime + summaryData[i].Summary[j].AvgTalkTimeInbound;
                        // totalOutboundAverageTalkTime = totalOutboundAverageTalkTime + summaryData[i].Summary[j].AvgTalkTimeOutbound;
                        // totalInboundTalkTime = totalInboundTalkTime + summaryData[i].Summary[j].TalkTimeInbound;
                        // totalOutboundTalkTime = totalOutboundTalkTime + summaryData[i].Summary[j].TalkTimeOutbound;
                        // totalInboundHoldTime = totalInboundHoldTime + summaryData[i].Summary[j].TotalHoldTimeInbound;
                        // totalOutboundHoldTime = totalOutboundHoldTime + summaryData[i].Summary[j].TotalHoldTimeOutbound;
                        // totalBreakTime = totalBreakTime + summaryData[i].Summary[j].BreakTime;
                        // totalAnswered = totalAnswered + summaryData[i].Summary[j].TotalAnswered;
                        // totalCallsInb = totalCallsInb + summaryData[i].Summary[j].TotalCallsInbound;
                        // totalCallsOut = totalCallsOut + summaryData[i].Summary[j].TotalCallsOutbound;
                        // MissCallCount = MissCallCount + summaryData[i].Summary[j].MissCallCount;
                        // totalOutboundAnswered = totalOutboundAnswered + summaryData[i].Summary[j].TotalAnsweredOutbound;
                        // totalInboundHold = totalInboundHold + summaryData[i].Summary[j].TotalHoldInbound;
                        // totalOutboundHold = totalOutboundHold + summaryData[i].Summary[j].TotalHoldOutbound;
                        // totalInboundAvgHoldTime = totalInboundAvgHoldTime + summaryData[i].Summary[j].AvgHoldTimeInbound;
                        // totalOutboundAvgHoldTime = totalOutboundAvgHoldTime + summaryData[i].Summary[j].AvgHoldTimeOutbound;
                        // summaryData[i].Summary[j].StaffTime = TimeFromatter(summaryData[i].Summary[j].StaffTime, "HH:mm:ss");
                        // summaryData[i].Summary[j].LoginTime = moment(summaryData[i].Summary[j].LoginTime).format("YYYY-MM-DD HH:mm:ss");
                        // summaryData[i].Summary[j].InboundTime = TimeFromatter(summaryData[i].Summary[j].InboundTime, "HH:mm:ss");
                        // summaryData[i].Summary[j].OutboundTime = TimeFromatter(summaryData[i].Summary[j].OutboundTime, "HH:mm:ss");
                        // summaryData[i].Summary[j].IdleTimeInbound = TimeFromatter(summaryData[i].Summary[j].IdleTimeInbound, "HH:mm:ss");
                        // summaryData[i].Summary[j].IdleTimeOutbound = TimeFromatter(summaryData[i].Summary[j].IdleTimeOutbound, "HH:mm:ss");
                        // summaryData[i].Summary[j].IdleTimeOffline = TimeFromatter(summaryData[i].Summary[j].IdleTimeOffline, "HH:mm:ss");
                        // summaryData[i].Summary[j].AfterWorkTimeInbound = TimeFromatter(summaryData[i].Summary[j].AfterWorkTimeInbound, "HH:mm:ss");
                        // summaryData[i].Summary[j].AfterWorkTimeOutbound = TimeFromatter(summaryData[i].Summary[j].AfterWorkTimeOutbound, "HH:mm:ss");
                        // summaryData[i].Summary[j].AverageHandlingTimeInbound = TimeFromatter(summaryData[i].Summary[j].AverageHandlingTimeInbound, "HH:mm:ss");
                        // summaryData[i].Summary[j].AverageHandlingTimeOutbound = TimeFromatter(summaryData[i].Summary[j].AverageHandlingTimeOutbound, "HH:mm:ss");
                        // summaryData[i].Summary[j].TalkTimeInbound = TimeFromatter(summaryData[i].Summary[j].TalkTimeInbound, "HH:mm:ss");
                        // summaryData[i].Summary[j].TalkTimeOutbound = TimeFromatter(summaryData[i].Summary[j].TalkTimeOutbound, "HH:mm:ss");
                        // summaryData[i].Summary[j].AvgTalkTimeInbound = TimeFromatter(summaryData[i].Summary[j].AvgTalkTimeInbound, "HH:mm:ss");
                        // summaryData[i].Summary[j].AvgTalkTimeOutbound = TimeFromatter(summaryData[i].Summary[j].AvgTalkTimeOutbound, "HH:mm:ss");
                        // summaryData[i].Summary[j].TotalHoldTimeInbound = TimeFromatter(summaryData[i].Summary[j].TotalHoldTimeInbound, "HH:mm:ss");
                        // summaryData[i].Summary[j].TotalHoldTimeOutbound = TimeFromatter(summaryData[i].Summary[j].TotalHoldTimeOutbound, "HH:mm:ss");
                        // summaryData[i].Summary[j].AvgHoldTimeInbound = TimeFromatter(summaryData[i].Summary[j].AvgHoldTimeInbound, "HH:mm:ss");
                        // summaryData[i].Summary[j].AvgHoldTimeOutbound = TimeFromatter(summaryData[i].Summary[j].AvgHoldTimeOutbound, "HH:mm:ss");
                        // summaryData[i].Summary[j].BreakTime = TimeFromatter(summaryData[i].Summary[j].BreakTime, "HH:mm:ss");

                        count++;
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
                $scope.total.MissCallCount = MissCallCount;
                $scope.total.OutboundAnswered = totalOutboundAnswered;
                $scope.AgentDetailsAssignToSummery();
                //console.log($scope.agentSummaryList);

                $scope.isTableLoading = 1;
            }

        }, function (error) {
            loginService.isCheckResponse(error);
            console.log("Error in Queue Summary loading ", error);
            $scope.isTableLoading = 1;
        });
    };

    $scope.disableDownload = false;

    $scope.getAgentSummaryCSV = function () {
		/** Kasun_Wijeratne_5_MARCH_2018
		 * ----------------------------------------*/
		if(filterDateRangeValidation.validateDateRange($scope.startDate, $scope.endDate) == false){
			$scope.showAlert("Invalid End Date", 'error', "End Date should not exceed 31 days from Start Date");
			return -1;
		}
		/** ----------------------------------------
		 * Kasun_Wijeratne_5_MARCH_2018*/
        $scope.disableDownload = true;
        $scope.DownloadFileName = 'AGENT_PRODUCTIVITY_SUMMARY_' + $scope.startDate + '_' + $scope.endDate;
        var deferred = $q.defer();
        var agentSummaryList = [];
        var resId = null;
        if ($scope.agentFilter) {
            resId = $scope.agentFilter.ResourceId;
        }

        var momentTz = moment.parseZone(new Date()).format('Z');
        momentTz = momentTz.replace("+", "%2B");

        var queryStartDate = $scope.startDate + ' 00:00:00' + momentTz;
        var queryEndDate = $scope.endDate + ' 23:59:59' + momentTz;

        agentSummaryBackendService.getAgentSummary(queryStartDate, queryEndDate, resId).then(function (response) {

            $scope.disableDownload = false;

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
                var MissCallCount = 0;
                var totalInboundHold = 0;
                var totalOutboundHold = 0;
                var totalInboundAvgHoldTime = 0;
                var totalOutboundAvgHoldTime = 0;
                var totalOutboundAnswered = 0;

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
                        totalBreakTime = totalBreakTime + summaryData[i].Summary[j].BreakTime;


                        summaryData[i].Summary[j].StaffTime = TimeFromatter(summaryData[i].Summary[j].StaffTime, "HH:mm:ss");
                        summaryData[i].Summary[j].LoginTime = moment(summaryData[i].Summary[j].LoginTime).format("YYYY-MM-DD HH:mm:ss");
                        summaryData[i].Summary[j].InboundTime = TimeFromatter(summaryData[i].Summary[j].InboundTime, "HH:mm:ss");
                        summaryData[i].Summary[j].OutboundTime = TimeFromatter(summaryData[i].Summary[j].OutboundTime, "HH:mm:ss");
                        summaryData[i].Summary[j].IdleTimeInbound = TimeFromatter(summaryData[i].Summary[j].IdleTimeInbound, "HH:mm:ss");
                        summaryData[i].Summary[j].IdleTimeOutbound = TimeFromatter(summaryData[i].Summary[j].IdleTimeOutbound, "HH:mm:ss");
                        summaryData[i].Summary[j].IdleTimeOffline = TimeFromatter(summaryData[i].Summary[j].IdleTimeOffline, "HH:mm:ss");
                        summaryData[i].Summary[j].BreakTime = TimeFromatter(summaryData[i].Summary[j].BreakTime, "HH:mm:ss");

                        if(ShareData.BusinessUnit && ShareData.BusinessUnit.toLowerCase() != "all") {

                            if (summaryData[i].Summary[j] && summaryData[i].Summary[j][ShareData.BusinessUnit]) {

                                totalInboundAfterWorkTime = totalInboundAfterWorkTime + summaryData[i].Summary[j][ShareData.BusinessUnit].AfterWorkTimeInbound;
                                totalOutboundAfterWorkTime = totalOutboundAfterWorkTime + summaryData[i].Summary[j][ShareData.BusinessUnit].AfterWorkTimeOutbound;
                                totalInboundAverageHandlingTime = totalInboundAverageHandlingTime + summaryData[i].Summary[j][ShareData.BusinessUnit].AverageHandlingTimeInbound;
                                totalOutboundAverageHandlingTime = totalOutboundAverageHandlingTime + summaryData[i].Summary[j][ShareData.BusinessUnit].AverageHandlingTimeOutbound;
                                totalInboundAverageTalkTime = totalInboundAverageTalkTime + summaryData[i].Summary[j][ShareData.BusinessUnit].AvgTalkTimeInbound;
                                totalOutboundAverageTalkTime = totalOutboundAverageTalkTime + summaryData[i].Summary[j][ShareData.BusinessUnit].AvgTalkTimeOutbound;
                                totalInboundTalkTime = totalInboundTalkTime + summaryData[i].Summary[j][ShareData.BusinessUnit].TalkTimeInbound;
                                totalOutboundTalkTime = totalOutboundTalkTime + summaryData[i].Summary[j][ShareData.BusinessUnit].TalkTimeOutbound;
                                totalInboundHoldTime = totalInboundHoldTime + summaryData[i].Summary[j][ShareData.BusinessUnit].TotalHoldTimeInbound;
                                totalOutboundHoldTime = totalOutboundHoldTime + summaryData[i].Summary[j][ShareData.BusinessUnit].TotalHoldTimeOutbound;
                                totalAnswered = totalAnswered + summaryData[i].Summary[j][ShareData.BusinessUnit].TotalAnswered;
                                totalCallsInb = totalCallsInb + summaryData[i].Summary[j][ShareData.BusinessUnit].TotalCallsInbound;
                                totalCallsOut = totalCallsOut + summaryData[i].Summary[j][ShareData.BusinessUnit].TotalCallsOutbound;
                                MissCallCount = MissCallCount + summaryData[i].Summary[j][ShareData.BusinessUnit].MissCallCount;
                                totalOutboundAnswered = totalOutboundAnswered + summaryData[i].Summary[j][ShareData.BusinessUnit].TotalAnsweredOutbound;
                                totalInboundHold = totalInboundHold + summaryData[i].Summary[j][ShareData.BusinessUnit].TotalHoldInbound;
                                totalOutboundHold = totalOutboundHold + summaryData[i].Summary[j][ShareData.BusinessUnit].TotalHoldOutbound;
                                totalInboundAvgHoldTime = totalInboundAvgHoldTime + summaryData[i].Summary[j][ShareData.BusinessUnit].AvgHoldTimeInbound;
                                totalOutboundAvgHoldTime = totalOutboundAvgHoldTime + summaryData[i].Summary[j][ShareData.BusinessUnit].AvgHoldTimeOutbound;


                                summaryData[i].Summary[j].TotalAnswered = summaryData[i].Summary[j][ShareData.BusinessUnit].TotalAnswered;
                                summaryData[i].Summary[j].TotalAnsweredOutbound = summaryData[i].Summary[j][ShareData.BusinessUnit].TotalAnsweredOutbound;
                                summaryData[i].Summary[j].TotalCallsInbound = summaryData[i].Summary[j][ShareData.BusinessUnit].TotalCallsInbound;
                                summaryData[i].Summary[j].TotalCallsOutbound = summaryData[i].Summary[j][ShareData.BusinessUnit].TotalCallsOutbound;
                                summaryData[i].Summary[j].TotalHoldInbound = summaryData[i].Summary[j][ShareData.BusinessUnit].TotalHoldInbound;
                                summaryData[i].Summary[j].TotalHoldOutbound = summaryData[i].Summary[j][ShareData.BusinessUnit].TotalHoldOutbound;



                                summaryData[i].Summary[j].AfterWorkTimeInbound = TimeFromatter(summaryData[i].Summary[j][ShareData.BusinessUnit].AfterWorkTimeInbound, "HH:mm:ss");
                                summaryData[i].Summary[j].AfterWorkTimeOutbound = TimeFromatter(summaryData[i].Summary[j][ShareData.BusinessUnit].AfterWorkTimeOutbound, "HH:mm:ss");
                                summaryData[i].Summary[j].AverageHandlingTimeInbound = TimeFromatter(summaryData[i].Summary[j][ShareData.BusinessUnit].AverageHandlingTimeInbound, "HH:mm:ss");
                                summaryData[i].Summary[j].AverageHandlingTimeOutbound = TimeFromatter(summaryData[i].Summary[j][ShareData.BusinessUnit].AverageHandlingTimeOutbound, "HH:mm:ss");
                                summaryData[i].Summary[j].TalkTimeInbound = TimeFromatter(summaryData[i].Summary[j][ShareData.BusinessUnit].TalkTimeInbound, "HH:mm:ss");
                                summaryData[i].Summary[j].TalkTimeOutbound = TimeFromatter(summaryData[i].Summary[j][ShareData.BusinessUnit].TalkTimeOutbound, "HH:mm:ss");
                                summaryData[i].Summary[j].AvgTalkTimeInbound = TimeFromatter(summaryData[i].Summary[j][ShareData.BusinessUnit].AvgTalkTimeInbound, "HH:mm:ss");
                                summaryData[i].Summary[j].AvgTalkTimeOutbound = TimeFromatter(summaryData[i].Summary[j][ShareData.BusinessUnit].AvgTalkTimeOutbound, "HH:mm:ss");
                                summaryData[i].Summary[j].TotalHoldTimeInbound = TimeFromatter(summaryData[i].Summary[j][ShareData.BusinessUnit].TotalHoldTimeInbound, "HH:mm:ss");
                                summaryData[i].Summary[j].TotalHoldTimeOutbound = TimeFromatter(summaryData[i].Summary[j][ShareData.BusinessUnit].TotalHoldTimeOutbound, "HH:mm:ss");
                                summaryData[i].Summary[j].AvgHoldTimeInbound = TimeFromatter(summaryData[i].Summary[j][ShareData.BusinessUnit].AvgHoldTimeInbound, "HH:mm:ss");
                                summaryData[i].Summary[j].AvgHoldTimeOutbound = TimeFromatter(summaryData[i].Summary[j][ShareData.BusinessUnit].AvgHoldTimeOutbound, "HH:mm:ss");

                            }else{


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
                                MissCallCount = MissCallCount + summaryData[i].Summary[j].MissCallCount;
                                totalOutboundAnswered = totalOutboundAnswered + summaryData[i].Summary[j].TotalAnsweredOutbound;
                                totalInboundHold = totalInboundHold + summaryData[i].Summary[j].TotalHoldInbound;
                                totalOutboundHold = totalOutboundHold + summaryData[i].Summary[j].TotalHoldOutbound;
                                totalInboundAvgHoldTime = totalInboundAvgHoldTime + summaryData[i].Summary[j].AvgHoldTimeInbound;
                                totalOutboundAvgHoldTime = totalOutboundAvgHoldTime + summaryData[i].Summary[j].AvgHoldTimeOutbound;

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

                            }
                        }else {


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
                            MissCallCount = MissCallCount + summaryData[i].Summary[j].MissCallCount;
                            totalOutboundAnswered = totalOutboundAnswered + summaryData[i].Summary[j].TotalAnsweredOutbound;
                            totalInboundHold = totalInboundHold + summaryData[i].Summary[j].TotalHoldInbound;
                            totalOutboundHold = totalOutboundHold + summaryData[i].Summary[j].TotalHoldOutbound;
                            totalInboundAvgHoldTime = totalInboundAvgHoldTime + summaryData[i].Summary[j].AvgHoldTimeInbound;
                            totalOutboundAvgHoldTime = totalOutboundAvgHoldTime + summaryData[i].Summary[j].AvgHoldTimeOutbound;

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


                        }

                        count++;
                        agentSummaryList.push(summaryData[i].Summary[j]);


                        // totalStaffTime = totalStaffTime + summaryData[i].Summary[j].StaffTime;
                        // totalInboundTime = totalInboundTime + summaryData[i].Summary[j].InboundTime;
                        // totalOutboundTime = totalOutboundTime + summaryData[i].Summary[j].OutboundTime;
                        // totalInboundIdleTime = totalInboundIdleTime + summaryData[i].Summary[j].IdleTimeInbound;
                        // totalOutboundIdleTime = totalOutboundIdleTime + summaryData[i].Summary[j].IdleTimeOutbound;
                        // totalOfflineIdleTime = totalOfflineIdleTime + summaryData[i].Summary[j].IdleTimeOffline;
                        // totalInboundAfterWorkTime = totalInboundAfterWorkTime + summaryData[i].Summary[j].AfterWorkTimeInbound;
                        // totalOutboundAfterWorkTime = totalOutboundAfterWorkTime + summaryData[i].Summary[j].AfterWorkTimeOutbound;
                        // totalInboundAverageHandlingTime = totalInboundAverageHandlingTime + summaryData[i].Summary[j].AverageHandlingTimeInbound;
                        // totalOutboundAverageHandlingTime = totalOutboundAverageHandlingTime + summaryData[i].Summary[j].AverageHandlingTimeOutbound;
                        // totalInboundAverageTalkTime = totalInboundAverageTalkTime + summaryData[i].Summary[j].AvgTalkTimeInbound;
                        // totalOutboundAverageTalkTime = totalOutboundAverageTalkTime + summaryData[i].Summary[j].AvgTalkTimeOutbound;
                        // totalInboundTalkTime = totalInboundTalkTime + summaryData[i].Summary[j].TalkTimeInbound;
                        // totalOutboundTalkTime = totalOutboundTalkTime + summaryData[i].Summary[j].TalkTimeOutbound;
                        // totalInboundHoldTime = totalInboundHoldTime + summaryData[i].Summary[j].TotalHoldTimeInbound;
                        // totalOutboundHoldTime = totalOutboundHoldTime + summaryData[i].Summary[j].TotalHoldTimeOutbound;
                        // totalBreakTime = totalBreakTime + summaryData[i].Summary[j].BreakTime;
                        // totalAnswered = totalAnswered + summaryData[i].Summary[j].TotalAnswered;
                        // totalOutboundAnswered = totalOutboundAnswered + summaryData[i].Summary[j].TotalAnsweredOutbound;
                        // totalCallsInb = totalCallsInb + summaryData[i].Summary[j].TotalCallsInbound;
                        // totalCallsOut = totalCallsOut + summaryData[i].Summary[j].TotalCallsOutbound;
                        // MissCallCount = MissCallCount + summaryData[i].Summary[j].MissCallCount;
                        // totalInboundHold = totalInboundHold + summaryData[i].Summary[j].TotalHoldInbound;
                        // totalOutboundHold = totalOutboundHold + summaryData[i].Summary[j].TotalHoldOutbound;
                        // totalInboundAvgHoldTime = totalInboundAvgHoldTime + summaryData[i].Summary[j].AvgHoldTimeInbound;
                        // totalOutboundAvgHoldTime = totalOutboundAvgHoldTime + summaryData[i].Summary[j].AvgHoldTimeOutbound;
                        //
                        // count++;
                        //
                        // summaryData[i].Summary[j].StaffTime = TimeFromatter(summaryData[i].Summary[j].StaffTime, "HH:mm:ss");
                        // summaryData[i].Summary[j].LoginTime = moment(summaryData[i].Summary[j].LoginTime).format("YYYY-MM-DD HH:mm:ss");
                        // summaryData[i].Summary[j].InboundTime = TimeFromatter(summaryData[i].Summary[j].InboundTime, "HH:mm:ss");
                        // summaryData[i].Summary[j].OutboundTime = TimeFromatter(summaryData[i].Summary[j].OutboundTime, "HH:mm:ss");
                        // summaryData[i].Summary[j].IdleTimeInbound = TimeFromatter(summaryData[i].Summary[j].IdleTimeInbound, "HH:mm:ss");
                        // summaryData[i].Summary[j].IdleTimeOutbound = TimeFromatter(summaryData[i].Summary[j].IdleTimeOutbound, "HH:mm:ss");
                        // summaryData[i].Summary[j].IdleTimeOffline = TimeFromatter(summaryData[i].Summary[j].IdleTimeOffline, "HH:mm:ss");
                        // summaryData[i].Summary[j].AfterWorkTimeInbound = TimeFromatter(summaryData[i].Summary[j].AfterWorkTimeInbound, "HH:mm:ss");
                        // summaryData[i].Summary[j].AfterWorkTimeOutbound = TimeFromatter(summaryData[i].Summary[j].AfterWorkTimeOutbound, "HH:mm:ss");
                        // summaryData[i].Summary[j].AverageHandlingTimeInbound = TimeFromatter(summaryData[i].Summary[j].AverageHandlingTimeInbound, "HH:mm:ss");
                        // summaryData[i].Summary[j].AverageHandlingTimeOutbound = TimeFromatter(summaryData[i].Summary[j].AverageHandlingTimeOutbound, "HH:mm:ss");
                        // summaryData[i].Summary[j].TalkTimeInbound = TimeFromatter(summaryData[i].Summary[j].TalkTimeInbound, "HH:mm:ss");
                        // summaryData[i].Summary[j].TalkTimeOutbound = TimeFromatter(summaryData[i].Summary[j].TalkTimeOutbound, "HH:mm:ss");
                        // summaryData[i].Summary[j].AvgTalkTimeInbound = TimeFromatter(summaryData[i].Summary[j].AvgTalkTimeInbound, "HH:mm:ss");
                        // summaryData[i].Summary[j].AvgTalkTimeOutbound = TimeFromatter(summaryData[i].Summary[j].AvgTalkTimeOutbound, "HH:mm:ss");
                        // summaryData[i].Summary[j].TotalHoldTimeInbound = TimeFromatter(summaryData[i].Summary[j].TotalHoldTimeInbound, "HH:mm:ss");
                        // summaryData[i].Summary[j].TotalHoldTimeOutbound = TimeFromatter(summaryData[i].Summary[j].TotalHoldTimeOutbound, "HH:mm:ss");
                        // summaryData[i].Summary[j].AvgHoldTimeInbound = TimeFromatter(summaryData[i].Summary[j].AvgHoldTimeInbound, "HH:mm:ss");
                        // summaryData[i].Summary[j].AvgHoldTimeOutbound = TimeFromatter(summaryData[i].Summary[j].AvgHoldTimeOutbound, "HH:mm:ss");
                        // summaryData[i].Summary[j].BreakTime = TimeFromatter(summaryData[i].Summary[j].BreakTime, "HH:mm:ss");
                        //
                        //
                        // agentSummaryList.push(summaryData[i].Summary[j]);

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
                    LoginTime: 'N/A',
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
                    TalkTimeInbound: TimeFromatter(totalInboundTalkTime, "HH:mm:ss"),
                    TalkTimeOutbound: TimeFromatter(totalOutboundTalkTime, "HH:mm:ss"),
                    TotalHoldTimeInbound: TimeFromatter(totalInboundHoldTime, "HH:mm:ss"),
                    TotalHoldTimeOutbound: TimeFromatter(totalOutboundHoldTime, "HH:mm:ss"),
                    BreakTime: TimeFromatter(totalBreakTime, "HH:mm:ss"),
                    TotalAnswered: totalAnswered,
                    TotalCallsInbound: totalCallsInb,
                    TotalCallsOutbound: totalCallsOut,
                    MissCallCount: MissCallCount,
                    TotalAnsweredOutbound: totalOutboundAnswered,
                    TotalHoldInbound: totalInboundHold,
                    TotalHoldOutbound: totalOutboundHold,
                    AvgHoldTimeInbound: '00:00:00',
                    AvgHoldTimeOutbound: '00:00:00'
                };

                if (count > 0) {
                    total.AverageHandlingTimeInbound = TimeFromatter(Math.round(totalInboundAverageHandlingTime / count), "HH:mm:ss");
                    total.AverageHandlingTimeOutbound = TimeFromatter(Math.round(totalOutboundAverageHandlingTime / count), "HH:mm:ss");
                    total.AvgTalkTimeInbound = TimeFromatter(Math.round(totalInboundAverageTalkTime / count), "HH:mm:ss");
                    total.AvgTalkTimeOutbound = TimeFromatter(Math.round(totalOutboundAverageTalkTime / count), "HH:mm:ss");
                    total.AvgHoldTimeInbound = TimeFromatter(Math.round(totalInboundAvgHoldTime / count), "HH:mm:ss");
                    total.AvgHoldTimeOutbound = TimeFromatter(Math.round(totalOutboundAvgHoldTime / count), "HH:mm:ss");
                }
                else {
                    total.AverageHandlingTimeInbound = TimeFromatter(totalInboundAverageHandlingTime, "HH:mm:ss");
                    total.AverageHandlingTimeOutbound = TimeFromatter(totalOutboundAverageHandlingTime, "HH:mm:ss");
                    total.AvgTalkTimeInbound = TimeFromatter(totalInboundAverageTalkTime, "HH:mm:ss");
                    total.AvgTalkTimeOutbound = TimeFromatter(totalOutboundAverageTalkTime, "HH:mm:ss");
                    total.AvgHoldTimeInbound = TimeFromatter(totalInboundAvgHoldTime, "HH:mm:ss");
                    total.AvgHoldTimeOutbound = TimeFromatter(totalOutboundAvgHoldTime, "HH:mm:ss");
                }

                agentSummaryList.push(total);
                //$scope.AgentDetailsAssignToSummery();
                deferred.resolve(agentSummaryList);
            }

        }, function (error) {
            $scope.disableDownload = false;
            loginService.isCheckResponse(error);
            console.log("Error in Queue Summary loading ", error);
            deferred.reject(agentSummaryList);
        });

        return deferred.promise;
    };

    $scope.getAgents = function () {

        ShareData.getAgentDetailsCount().then(function (row_count) {
            var pagesize = 20;
            var pagecount = Math.ceil(row_count / pagesize);

            var method_list = [];

            for (var i = 1; i <= pagecount; i++) {
                method_list.push(ShareData.getAgentDetailsWithPaging(pagesize, i));
            }


            $q.all(method_list).then(function (resolveData) {
                if (resolveData) {

                    resolveData.map(function (data) {

                        data.map(function (item) {

                            $scope.Agents.push(item);
                        });
                    });

                }
                else
                {
                    $scope.showAlert("Error","Error in loading agent details","error");
                }



            }).catch(function (err) {
                console.log("Error in Agent details picking " + err);

                $scope.showAlert("Error","Error in loading Agent details","error");
            });



        }, function (err) {
            console.log("Error in Agent details picking " + err);
            $scope.showAlert("Error","Error in loading Agent details","error");
        });



        /*agentSummaryBackendService.getAgentDetails().then(function (response) {
            if (response.data.IsSuccess) {

                console.log(response.data.Result.length + " Agent records found");
                $scope.Agents = response.data.Result;
            }
            else {
                console.log("Error in Agent details picking");
            }
        }, function (error) {
            loginService.isCheckResponse(error);
            console.log("Error in Agent details picking " + error);
        });*/
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

        $scope.gridQOptions.data = $scope.agentSummaryList;
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