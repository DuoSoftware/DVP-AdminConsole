/**
 * Created by Heshan.i on 10/26/2016.
 */

mainApp.controller("queueSlaBreakDownController", function ($scope, $filter, $state, $q, queueSummaryBackendService, loginService,$anchorScroll) {

    $anchorScroll();
    $scope.param = {
        qDate: moment().format("YYYY-MM-DD")
    };
    $scope.dateValid = true;
    $scope.queueSummaryList = [];
    $scope.dailiySummaryList = [];
    $scope.viewMode = 'table';

    $scope.changeView = function (viewMode) {
        $scope.viewMode = viewMode;
    };


    var timeFormatCreator = function (arrVal) {

        return arrVal.map(function (item) {

            if(item && item.BreakDown)
            {
                // Check between times (ex:- 10-20 , 40-50)
                var valArr = item.BreakDown.trim().split("-");

                if(valArr.length>1)
                {
                    var rangeStr = "Between" ;
                    valArr.forEach(function (val,i) {

                       // From the second value concat with & sign
                        i==0?rangeStr=rangeStr.concat(" ",val):rangeStr = rangeStr.concat(" & ",val);

                    });

                    item.BreakDown = rangeStr;
                }
                else
                {
                    var lessArr = item.BreakDown.trim().split("<").filter(function(val) {

                        return val !="" && !isNaN(val);

                    });
                    var gtrArr = item.BreakDown.trim().split(">").filter(function(val) {

                        return val !="" && !isNaN(val);

                    });

                        // Check Less than ranges (ex:- 10< , 120<)
                    if(lessArr.length==1)
                    {
                        item.BreakDown = "Less than "+lessArr[0];
                    }
                    else
                    {
                        // Check Greater than ranges (ex:- >10 , >120)
                        item.BreakDown = "Greater than "+gtrArr[0];
                    }

                }

                return item;
            }

        });
    }

    var createDailyGraph = function () {
        $scope.dailySLAbreakObj = [];
        $scope.isTableLoading = 0;
        // get daily summary data
        queueSummaryBackendService.getQueueDailySlaBreakDown($scope.param.qDate).then(function (response) {
            if (response && response.data && response.data.Result) {
                $scope.isTableLoading = 1;



                $scope.dailiySummaryList = timeFormatCreator(response.data.Result);

                response.data.Result.forEach(function (value, key) {
                    var chartData = {
                        name: '',
                        data: [],
                        labels: []
                    };
                    chartData.name = response.data.Result[key].Queue;
                    chartData.labels.push(response.data.Result[key].BreakDown);
                    chartData.data.push(response.data.Result[key].Average);
                    for (var i = 0; i < $scope.dailySLAbreakObj.length; i++) {
                        if ($scope.dailySLAbreakObj[i].name == chartData.name) {
                            $scope.dailySLAbreakObj[i].data.push(response.data.Result[key].Average);
                            $scope.dailySLAbreakObj[i].labels.push(response.data.Result[key].BreakDown);
                            return;
                        }
                    }
                    $scope.dailySLAbreakObj.push(chartData);
                });
                //code update damith
                //SLA daily summary graph
                $scope.options = {
                    type: 'pie',
                    responsive: true,
                    legend: {
                        display: true,
                        position: 'bottom',
                        padding: 5,
                        labels: {
                            fontColor: 'rgb(130, 152, 174)',
                            fontSize: 10,
                            boxWidth: 10
                        }
                    },
                    title: {
                        display: true
                    }
                };
            } else {
                $scope.isTableLoading = 2;
            }
        }, function (error) {
            loginService.isCheckResponse(error);
            console.log("Error in Queue Summary loading ", error);
        });
    };


    $scope.onDateChange = function () {
        if (moment($scope.param.qDate, "YYYY-MM-DD").isValid()) {
            $scope.dateValid = true;
        }
        else {
            $scope.dateValid = false;
        }
    };

    $scope.searchOption  = {}
    $scope.searchOption.name = 'hourly';
    $scope.getQueueSummary = function () {
        if ($scope.searchOption.name == 'hourly') {
            $scope.queueSummaryList = [];
            $scope.isTableLoading = 0;
            queueSummaryBackendService.getQueueHourlySlaBreakDown($scope.param.qDate).then(function (response) {
                if (!response.data.IsSuccess) {
                    $scope.isTableLoading = 2;
                    console.log("Queue Summary loading failed ", response.data.Exception);
                }
                else {
                    $scope.isTableLoading = 1;
                    $scope.queueSummaryList = timeFormatCreator(response.data.Result);

                }

            }, function (error) {
                loginService.isCheckResponse(error);
                console.log("Error in Queue Summary loading ", error);
                $scope.isTableLoading = 2;
            });
        } else if ($scope.searchOption.name == 'daily') {
            createDailyGraph();
        }
    };

    $scope.getQueueDailySummary = function () {
        $scope.dailyQueueSummaryList = [];
        $scope.isTableLoading = 0;
        queueSummaryBackendService.getQueueSlaBreakDown($scope.param.qDate).then(function (response) {
            if (!response.data.IsSuccess) {
                console.log("Queue Summary loading failed ", response.data.Exception);
            }
            else {
                $scope.dailyQueueSummaryList = timeFormatCreator(response.data.Result);

                $scope.isTableLoading = 1;
                console.log($scope.dailyQueueSummaryList);
            }

        }, function (error) {
            loginService.isCheckResponse(error);
            console.log("Error in Queue Summary loading ", error);
        });
    };


    $scope.getProcessedSlaCSVDownload = function () {
        var deferred = $q.defer();

        var queueSummaryListForCsv = [];

        if($scope.searchOption.name == 'hourly')
        {
            queueSummaryBackendService.getQueueHourlySlaBreakDown($scope.param.qDate).then(function (response) {

                if (!response.data.IsSuccess) {
                    console.log("Queue Summary loading failed ", response.data.Exception);
                    deferred.resolve(queueSummaryListForCsv);
                }
                else {
                    queueSummaryListForCsv = timeFormatCreator(response.data.Result);

                    deferred.resolve(queueSummaryListForCsv);

                    console.log(queueSummaryListForCsv);
                }

            }, function (error) {
                loginService.isCheckResponse(error);
                deferred.resolve(queueSummaryListForCsv);
                console.log("Error in Queue Hourly Summary loading ", error);
            });
        }
        else
        {
            queueSummaryBackendService.getQueueSlaBreakDown($scope.param.qDate).then(function (response) {

                if (!response.data.IsSuccess) {
                    console.log("Queue Summary loading failed ", response.data.Exception);
                    deferred.resolve(queueSummaryListForCsv);
                }
                else {
                    queueSummaryListForCsv = timeFormatCreator(response.data.Result);

                    deferred.resolve(queueSummaryListForCsv);

                    console.log(queueSummaryListForCsv);
                }

            }, function (error) {
                loginService.isCheckResponse(error);
                deferred.resolve(queueSummaryListForCsv);
                console.log("Error in Queue Daily Summary loading ", error);
            });
        }


        return deferred.promise;

    };

}).config(['ChartJsProvider', function (ChartJsProvider) {
    // Configure all charts
    ChartJsProvider.setOptions({
        chartColors: ['#ba70fc', '#45eaca', '#9e7cf4', '#ffef54', '#8defee', '#00e1dd', '#009c98', '#00498e','#fac13c', '#d22859', '#F564A3', '#5AA8B2', '#53d4c0','#7BC1A1', '#4eecfa', '#1671db', '#c1ef5e']
        // chartColors: ['#511a6d', '#6d0633', '#5d2882', '#e60376', '#8defee', '#a586bf', '#009c98', '#00498e','#fac13c', '#d22859', '#F564A3', '#5AA8B2', '#53d4c0','#7BC1A1', '#4eecfa', '#1671db', '#c1ef5e']
    });
}]);