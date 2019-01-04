/**
 * Created by marlon on 9/6/2016.
 */

(function () {
    var app = angular.module("veeryConsoleApp");

    var hourlyBandReportCtrl = function ($scope, $filter, $timeout, loginService, cdrApiHandler, resourceService, baseUrls,$anchorScroll,ShareData, uiGridConstants, uiGridGroupingConstants) {
        $scope.hourlyBandGridOptions = {
            enableFiltering: true,
            enableColumnResizing: true,
            enableRowSelection: true,
            enableRowHeaderSelection: true,
            multiSelect: false,
            modifierKeysToMultiSelect: false,
            noUnselect: false, enableHorizontalScrollbar: true,
            columnDefs: [
                {
                    name: 'Date',
                    field: 'date',
                    headerTooltip: 'Date',
                    enableFiltering: true,
                    enableCellEdit: false,
                    enableSorting: true,
                    width: '8%',
                    grouping: { groupPriority: 0 },
                    sort: {
                        priority: 0,
                        direction: uiGridConstants.ASC
                    }
                },
                {
                    name: 'Hour',
                    field: 'hour',
                    headerTooltip: 'Hour',
                    enableFiltering: true,
                    enableCellEdit: false,
                    enableSorting: true,
                    width: '5%', cellClass: 'table-number',
                    grouping: { groupPriority: 1 },
                    sort: {
                        priority: 1,
                        direction: uiGridConstants.ASC
                    }
                },
                {
                    name: 'agentskill',
                    field: 'agentskill',
                    headerTooltip: 'Date',
                    enableFiltering: true,
                    enableCellEdit: false,
                    enableSorting: true,
                    width: '10%',
                    grouping: { groupPriority: 2 },
                    sort: {
                        priority: 2,
                        direction: uiGridConstants.ASC
                    }
                },

                {
                    name: 'IVRCallsCount',
                    field: 'IVRCallsCount',
                    headerTooltip: 'Agent Mode',
                    enableFiltering: false,
                    enableCellEdit: false,
                    enableSorting: true,
                    width: "*" , cellClass: 'table-number',
                    treeAggregationType: uiGridGroupingConstants.aggregation.SUM, customTreeAggregationFinalizerFn: function( aggregation ) {
                        aggregation.rendered = aggregation.value;
                    }
                    },
                {
                    name: 'QueuedCallsCount',
                    field: 'QueuedCallsCount',
                    headerTooltip: 'State Time',
                    enableFiltering: false,
                    enableCellEdit: false,
                    enableSorting: true,
                    width: "*", cellClass: 'table-number'
                },
                {
                    name: 'AbandonCallsCount',
                    field: 'AbandonCallsCount',
                    headerTooltip: 'Incoming Call Count',
                    enableFiltering: false,
                    enableCellEdit: false,
                    enableSorting: true,
                    width: "*", cellClass: 'table-number'
                },
                {
                    name: 'AbandonPercentage',
                    field: 'AbandonPercentage',
                    headerTooltip: 'Outgoing Call Count',
                    enableFiltering: false,
                    enableCellEdit: false,
                    enableSorting: true,
                    width: "*", cellClass: 'table-number'
                },
                {
                    name: 'DropCallsCount',
                    field: 'DropCallsCount',
                    headerTooltip: 'MissCall Count',
                    enableFiltering: false,
                    enableCellEdit: false,
                    enableSorting: true,
                    width: "*", cellClass: 'table-number'
                },
                {
                    name: 'DropCallsCount',
                    field: 'DropCallsCount',
                    headerTooltip: 'Transfer Call Count',
                    enableFiltering: false,
                    enableCellEdit: false,
                    enableSorting: true,
                    width: "*", cellClass: 'table-number'
                },
                {
                    name: 'HoldAverage',
                    field: 'HoldAverage',
                    headerTooltip: 'Acw Time',
                    enableFiltering: false,
                    enableCellEdit: false,
                    enableSorting: true,
                    width: "*", cellClass: 'table-time'
                },
                {
                    name: 'IvrAverage',
                    field: 'IvrAverage',
                    headerTooltip: 'Break Time',
                    enableFiltering: false,
                    enableCellEdit: false,
                    enableSorting: true,
                    width: "*", cellClass: 'table-time'
                },
                {
                    name: 'RingAverage',
                    field: 'RingAverage',
                    headerTooltip: 'OnCall Time',
                    enableFiltering: false,
                    enableCellEdit: false,
                    enableSorting: true,
                    width: "*", cellClass: 'table-time'
                },
                {
                    name: 'TalkAverage',
                    field: 'TalkAverage',
                    headerTooltip: 'Hold Time',
                    enableFiltering: false,
                    enableCellEdit: false,
                    enableSorting: true,
                    width: "*", cellClass: 'table-time'
                },
                {
                    name: 'AnswerCount',
                    field: 'AnswerCount',
                    headerTooltip: 'Idle Time',
                    enableFiltering: false,
                    enableCellEdit: false,
                    enableSorting: true,
                    width: "*", cellClass: 'table-time',
                },
                {
                    name: 'QueueAverage',
                    field: 'QueueAverage',
                    headerTooltip: 'Staffed Time',
                    enableFiltering: false,
                    enableCellEdit: false,
                    enableSorting: true,
                    width: "*", cellClass: 'table-time'
                },
                {
                    name: 'AnswerPercentage',
                    field: 'AnswerPercentage',
                    headerTooltip: 'Staffed Time',
                    enableFiltering: false,
                    enableCellEdit: false,
                    enableSorting: true,
                    width: "*", cellClass: 'table-time'
                },
                {
                    name: 'AbandonedQueueAvg',
                    field: 'AbandonedQueueAvg',
                    headerTooltip: 'Staffed Time',
                    enableFiltering: false,
                    enableCellEdit: false,
                    enableSorting: true,
                    width: "*", cellClass: 'table-time'
                },
                {
                    name: 'AnsweredQueueAvg',
                    field: 'AnsweredQueueAvg',
                    headerTooltip: 'Staffed Time',
                    enableFiltering: false,
                    enableCellEdit: false,
                    enableSorting: true,
                    width: "*", cellClass: 'table-time'
                }

            ],
            data: [{test: "loading"}]
        };

        $anchorScroll();


        $scope.dtOptions = {paging: false, searching: false, info: false, order: [0, 'asc']};

        $scope.showAlert = function (tittle, type, content) {

            new PNotify({
                title: tittle,
                text: content,
                type: type,
                styling: 'bootstrap3'
            });
        };

        $scope.moment = moment;

        $scope.summaryArr = [];

        $scope.cancelDownload = true;
        $scope.buttonClass = 'fa fa-file-text';
        $scope.fileDownloadState = 'RESET';
        $scope.currentCSVFilename = '';
        $scope.DownloadButtonName = 'CSV';



        $scope.obj = {
            fromdate: moment().format("YYYY-MM-DD"),
            todate: moment().format("YYYY-MM-DD"),
            fromhour: moment().format("H"),
            tohour: moment().format("m")
        };

        var checkFileReady = function (fileName) {

            if ($scope.cancelDownload) {
                $scope.fileDownloadState = 'RESET';
                $scope.DownloadButtonName = 'CSV';
            }
            else {
                cdrApiHandler.getFileMetaData(fileName).then(function (fileStatus) {
                    if (fileStatus && fileStatus.Result) {
                        if (fileStatus.Result.Status === 'PROCESSING') {
                            $timeout(checkFileReady(fileName), 10000);
                        }
                        else {


                            var decodedToken = loginService.getTokenDecode();

                            if (decodedToken && decodedToken.company && decodedToken.tenant) {
                                $scope.currentCSVFilename = fileName;
                                $scope.DownloadCSVFileUrl = baseUrls.fileServiceInternalUrl + 'File/DownloadLatest/' + decodedToken.tenant + '/' + decodedToken.company + '/' + fileName;
                                $scope.fileDownloadState = 'READY';
                                $scope.DownloadButtonName = 'CSV';
                                $scope.cancelDownload = true;
                                $scope.buttonClass = 'fa fa-spinner fa-spin';
                            }
                            else {
                                $scope.fileDownloadState = 'RESET';
                                $scope.DownloadButtonName = 'CSV';
                            }


                        }
                    }
                    else {
                        $scope.fileDownloadState = 'RESET';
                        $scope.DownloadButtonName = 'CSV';
                    }

                }).catch(function (err) {
                    loginService.isCheckResponse(err);
                    $scope.fileDownloadState = 'RESET';
                    $scope.DownloadButtonName = 'CSV';
                });
            }

        };

        $scope.downloadPress = function () {
            $scope.fileDownloadState = 'RESET';
            $scope.DownloadButtonName = 'CSV';
            $scope.cancelDownload = true;
            $scope.buttonClass = 'fa fa-file-text';
        };


        var isEmpty = function (map) {
            for (var key in map) {
                if (map.hasOwnProperty(key)) {
                    return false;
                }
            }
            return true;
        };

        var emptyArr = [];

        $scope.querySearch = function (query) {
            if (query === "*" || query === "") {
                if ($scope.qList) {
                    return $scope.qList;
                }
                else {
                    return emptyArr;
                }

            }
            else {
                if ($scope.qList) {
                    var filteredArr = $scope.qList.filter(function (item) {
                        var regEx = "^(" + query + ")";

                        if (item.Attribute) {
                            return item.Attribute.match(regEx);
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
            }

        };

        $scope.checkTagCount = function () {
            if (!$scope.skillFilter || $scope.skillFilter.length < 5) {
                return true;
            }
            else {
                return false;
            }
        };


        var getQueueList = function () {

            resourceService.getQueueSettings().then(function (qList) {
                if (qList && qList.length > 0) {

                    var tempQList = qList.filter(function(q)
                    {
                        return !!(q.ServerType === 'CALLSERVER' && q.RequestType === 'CALL');
                    });

                    $scope.qList = tempQList;
                }
                else
                {
                    $scope.qList = [];
                }


            }).catch(function (err) {
                $scope.qList = [];
                loginService.isCheckResponse(err);
            });
        };
        getQueueList();

        var tempQueueArr = {};
        var curCount = 0;
//---
        var buildSummaryListByHr = function (fromdate, todate, fromhour, tohour, attributes, recId, momentTz, callback)
        {
            cdrApiHandler.getCallSummaryForQueueByHr(fromdate, todate, fromhour, tohour, attributes, momentTz,ShareData.BusinessUnit).then(function (sumResp)
            {
                if (!sumResp.Exception && sumResp.IsSuccess && sumResp.Result)
                {

                    tempQueueArr = sumResp.Result;
                    callback(null, true);

                }
                else
                {
                    callback(null, false);
                }


            }, function (err) {
                loginService.isCheckResponse(err);
                callback(err, false);
            })
        };


        $scope.getCallSummaryByHr = function () {

            try
            {
                $scope.summaryArr = [];
                $scope.hourlyBandGridOptions.data = {};
                $scope.progressSumVal = 0;
                curCount = 0;

                var momentTz = moment.parseZone(new Date()).format('Z');
                //momentTz = momentTz.replace("+", "%2B");

                $scope.obj.isTableLoadingHr = 0;

                if($scope.skillFilter && $scope.skillFilter.length > 0)
                {
                    var skillArr = [];
                    for (var i=0; i<$scope.skillFilter.length; i++){
                        skillArr.push($scope.skillFilter[i].QueueName)
                    }

                    var skillString = skillArr.join(',');

                    buildSummaryListByHr($scope.obj.fromdate, $scope.obj.todate, $scope.obj.fromhour, $scope.obj.tohour, skillString, $scope.skillFilter[0].RecordID, momentTz, function (err, processDoneResp)
                    {
                        if(err)
                        {
                            $scope.showAlert('Queue wise summary', 'error', 'Error occurred');
                        }
                        $scope.hourlyBandGridOptions.data = tempQueueArr;
                        $scope.obj.isTableLoadingHr = 1;

                    });
                }
                else
                {
                    $scope.showAlert('Queue wise summary', 'error', 'No queues added');
                    $scope.obj.isTableLoadingHr = 1;
                }


            }
            catch (ex) {
                $scope.showAlert('Queue wise summary', 'error', 'Error occurred while loading call summary');
                $scope.obj.isTableLoadingHr = 1;
            }

        };

        $scope.getCallSummaryDownload = function () {

            try {
                $scope.summaryArr = [];

                var attribArray = $scope.skillFilter.map(function (item) {
                    return item.QueueName;
                });

                if ($scope.DownloadButtonName === 'CSV') {
                    $scope.cancelDownload = false;
                    $scope.buttonClass = 'fa fa-spinner fa-spin';
                }
                else {
                    $scope.cancelDownload = true;
                    $scope.buttonClass = 'fa fa-file-text';
                }

                $scope.DownloadButtonName = 'PROCESSING...';


                var momentTz = moment.parseZone(new Date()).format('Z');
                //momentTz = momentTz.replace("+", "%2B");

                cdrApiHandler.getCallSummaryForQueueHrDownload($scope.obj.day, attribArray, momentTz, 'csv',ShareData.BusinessUnit).then(function (sumResp) {
                    if (!sumResp.Exception && sumResp.IsSuccess && sumResp.Result) {
                        var downloadFilename = sumResp.Result;

                        checkFileReady(downloadFilename);

                    }
                    else {
                        $scope.showAlert('Error', 'error', 'Error occurred while loading cdr list');
                        $scope.fileDownloadState = 'RESET';
                        $scope.DownloadButtonName = 'CSV';
                    }


                }, function (err) {
                    loginService.isCheckResponse(err);
                    $scope.showAlert('Error', 'error', 'Error occurred while loading cdr list');
                    $scope.fileDownloadState = 'RESET';
                    $scope.DownloadButtonName = 'CSV';
                });


            }
            catch (ex) {
                $scope.showAlert('Error', 'error', 'Error occurred while loading cdr list');
                $scope.fileDownloadState = 'RESET';
                $scope.DownloadButtonName = 'CSV';
            }

        };


    };
    app.controller("hourlyBandReportCtrl", hourlyBandReportCtrl);

}());


