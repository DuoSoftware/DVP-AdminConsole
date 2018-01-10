/**
 * Created by Damith on 5/29/2016.
 */

mainApp.controller('realTimeQueuedCtrl', function ($scope, $rootScope, $timeout, $filter, queueMonitorService,
                                                   $anchorScroll,
                                                   subscribeServices, reportQueryFilterService,uiGridConstants, ShareData) {

        $scope.safeApply = function (fn) {
            var phase = this.$root.$$phase;
            if (phase == '$apply' || phase == '$digest') {
                if (fn && (typeof(fn) === 'function')) {
                    fn();
                }
            } else {
                this.$apply(fn);
            }
        };
        $anchorScroll();

        $scope.dtOptions = {paging: false, searching: false, info: false, order: [0, 'desc']};
        subscribeServices.subscribe('queuedetail');
        //subscribe services
        subscribeServices.subscribeDashboard('realtime', function (event) {

            switch (event.roomName) {
                case 'QUEUE:QueueDetail':
                    if (event.Message) {
                        var item = event.Message.queueDetail.QueueInfo;
                        if (item.CurrentMaxWaitTime) {
                            var d = moment(item.CurrentMaxWaitTime).valueOf();
                            item.MaxWaitingMS = d;

                            if (item.EventTime) {

                                var serverTime = moment(item.EventTime).valueOf();
                                tempMaxWaitingMS = serverTime - d;
                                item.MaxWaitingMS = moment().valueOf() - tempMaxWaitingMS;

                            }

                        }

                        //
                        item.id = event.Message.queueDetail.QueueId;

                        item.QueueName = event.Message.queueDetail.QueueName;
                        item.AverageWaitTime = Math.round(item.AverageWaitTime * 100) / 100;

                        if (item.TotalQueued > 0) {
                            item.presentage = Math.round((item.TotalAnswered / item.TotalQueued) * 100);
                        }

                        if (!$scope.queues[event.Message.queueDetail.QueueId]) {
                            $scope.queueList.push(item);
                        }

                        $scope.safeApply(function () {
                            item.CurrentMaxWaitTime = (item.CurrentMaxWaitTime === 0) ? undefined : item.CurrentMaxWaitTime;
                            $scope.queues[event.Message.queueDetail.QueueId] = item;
                        });

                        setGridData();
                    }
                    break;
            }
        });


        //$scope.percent = 65;

        //#

        $scope.isGrid = false;
        $scope.summaryText = "Table";
        $scope.isLoaded = false;
        $scope.refreshTime = 10000;
        $scope.firstTimeLoad = true;

        $scope.pieoption = {
            animate: {
                duration: 1000,
                enabled: true
            },
            barColor: '#2C3E50',
            scaleColor: false,
            lineWidth: 20,
            lineCap: 'circle',
            size: 200
        };

        //#Chart option
        $scope.queueoption = {
            grid: {
                borderColor: '#f8f6f6',
                show: true
            },
            series: {shadowSize: 0, color: "#f8b01d"},
            color: {color: '#63a5a2'},
            legend: {
                container: '#legend',
                show: true
            },
            yaxis: {
                min: 0,
                max: 10
            },
            xaxis: {
                tickFormatter: function (val, axis) {
                    return moment.unix(val).minute() + ":" + moment.unix(val).second();
                }
            }
        };

        $scope.queues = {};

        $scope.queueList = [];

        var emptyArr = [];

        $scope.querySearch = function (query) {
            if (query === "*" || query === "") {
                if ($scope.queueList) {
                    return $scope.queueList;
                }
                else {
                    return emptyArr;
                }

            }
            else {
                if ($scope.queueList) {
                    var filteredArr = $scope.queueList.filter(function (item) {
                        var regEx = "^(" + query + ")";

                        if (item.QueueName) {
                            return item.QueueName.match(regEx);
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


        /*$scope.GetAllQueueStatistics = function () {

         queueMonitorService.GetAllQueueStats().then(function (response) {

         $scope.queues = [];
         $scope.queues = response.map(function (c, index) {

         if(c.QueueId)

         var item = c.QueueInfo;
         item.id = c.QueueId;
         item.queuename= c.QueueName;
         item.AverageWaitTime = Math.round(item.AverageWaitTime*100)/100;

         if (c.QueueInfo.TotalQueued > 0) {
         item.presentage = Math.round((c.QueueInfo.TotalAnswered / c.QueueInfo.TotalQueued) * 100);
         }
         return item;
         });
         });
         };*/


        $scope.checkQueueAvailability = function (itemID) {

            var value = $filter('filter')($scope.queues, {id: itemID})[0];
            if (value) {
                return false;
            }
            else {
                return true;
            }


        };

        $scope.SaveReportQueryFilter = function () {
            setGridData();
            var reportQueryName = 'realtime-queued';

            if(ShareData.BusinessUnit)
            {
                reportQueryName = reportQueryName + ':' + ShareData.BusinessUnit;
            }
            reportQueryFilterService.SaveReportQueryFilter(reportQueryName, $scope.selectedQueues);
        };

        $scope.selectedQueues = [];
        $scope.GetReportQueryFilter = function () {

            var reportQueryName = 'realtime-queued';

            if(ShareData.BusinessUnit)
            {
                reportQueryName = reportQueryName + ':' + ShareData.BusinessUnit;
            }

            reportQueryFilterService.GetReportQueryFilter(reportQueryName).then(function (response) {
                if (response) {
                    $scope.selectedQueues = response;
                }
            }, function (error) {
                console.log(error);
            });
        };
        $scope.GetReportQueryFilter();

        $scope.checkQueueHidden = function (qid) {
            if ($scope.selectedQueues && $scope.selectedQueues.length > 0) {
                var matchingQueues = $scope.selectedQueues.filter(function (queue) {
                    if (queue.id === qid) {
                        return true;
                    }
                });

                if (matchingQueues && matchingQueues.length > 0) {
                    return false;
                }
                else {
                    return true;
                }
            }
            else {
                return false;
            }

        }


        $scope.GetAllQueueStatistics = function () {

            $scope.queues = {};
            $scope.queueList = [];

            queueMonitorService.GetAllQueueStats().then(function (response) {
                if(response && response.length > 0)
                {
                    var i = 1;
                    angular.forEach(response, function (c) {
                        // var value = $filter('filter')(updatedQueues, {id: item.id})[0];
                        // if (!value) {
                        //     $scope.queues.splice($scope.queues.indexOf(item), 1);
                        // }


                        var item = c.QueueInfo;
                        item.id = c.QueueId;
                        item.QueueName = c.QueueName;
                        item.AverageWaitTime = Math.round(item.AverageWaitTime * 100) / 100;

                        if (item.CurrentMaxWaitTime) {
                            var d = moment(item.CurrentMaxWaitTime).valueOf();
                            item.MaxWaitingMS = d;

                            if (item.EventTime) {

                                var serverTime = moment(item.EventTime).valueOf();
                                tempMaxWaitingMS = serverTime - d;
                                item.MaxWaitingMS = moment().valueOf() - tempMaxWaitingMS;

                            }

                        }

                        if (item.TotalQueued > 0) {
                            item.presentage = Math.round((item.TotalAnswered / item.TotalQueued) * 100);
                        }
                        item.CurrentMaxWaitTime = (item.CurrentMaxWaitTime === 0) ? undefined : item.CurrentMaxWaitTime;
                        // if ($scope.checkQueueAvailability(item.id)) {
                        item.agentCount = i++;
                        $scope.queues[item.id] = item;
                        $scope.queueList.push(item);
                        //}
                    });
                }
                else
                {
                    $scope.queues = {};
                    $scope.queueList = [];
                }



            });
        };

        $scope.ShareData = ShareData;

        $scope.$watch('ShareData.BusinessUnit', function()
        {
            var reportQueryName = 'realtime-queued';

            if(ShareData.BusinessUnit)
            {
                reportQueryName = reportQueryName + ':' + ShareData.BusinessUnit;
            }

            reportQueryFilterService.GetReportQueryFilter(reportQueryName).then(function (response) {
                if (response) {
                    $scope.selectedQueues = response;
                    if(!$scope.firstTimeLoad)
                    {
                        $scope.GetAllQueueStatistics();
                    }
                    else
                    {
                        $scope.firstTimeLoad = false;
                    }
                }
            }, function (error) {
                if(!$scope.firstTimeLoad)
                {
                    $scope.GetAllQueueStatistics();
                }
                else
                {
                    $scope.firstTimeLoad = false;
                }
                console.log(error);
            });



        });


        /*

         $scope.GetAllQueueStatistics = function() {


         queueMonitorService.GetAllConcurrentQueue().then(function (response) {

         $scope.dataSetQueued[0].data = response.map(function (c, index) {
         var item = c;

         if(c.TotalQueued > 0) {
         item.presentage = Math.round(c.TotalAnswered / c.TotalQueued) * 100;
         }

         return item;
         });
         });
         }


         */


        $scope.changeView = function () {
            $scope.isGrid = !$scope.isGrid;
            if ($scope.isGrid) {
                $scope.summaryText = "Card";
            }
            else {
                $scope.summaryText = "Table";
            }
        };

        $scope.GetAllQueueStatistics();


        var ServerHandler = (function () {
            $scope.dataSetQueued = [{
                data: [],
                lines: {
                    fill: true,
                    lineWidth: 2
                }
            }];
        })();

        var getAllRealTime = function () {
            //$scope.GetAllQueueStatistics();
            //getAllRealTimeTimer = $timeout(getAllRealTime, $scope.refreshTime);
        };

        // getAllRealTime();
        //var getAllRealTimeTimer = $timeout(getAllRealTime, $scope.refreshTime);

        $scope.$on("$destroy", function () {
            // if (getAllRealTimeTimer) {
            //     $timeout.cancel(getAllRealTimeTimer);
            // }
            subscribeServices.unsubscribe('queuedetail');
            subscribeServices.unSubscribeDashboard('realtime');

        });

        //update code
        //damith
        $scope.cardViewMode = 'large';
        $scope.largeCard = true;
        $scope.changeCardView = function (_viewType) {
            $scope.cardViewMode = _viewType;

            $scope.summary = _viewType === 'table';
            $scope.largeCard = _viewType === 'large';
            $scope.smallCard = _viewType === 'small';
            $scope.showDetails = _viewType === 'medium';

            if (_viewType === 'table') {
                setGridData();
            }
        };

    $scope.getTableHeight = function() {
        var rowHeight = 30; // your row height
        var headerHeight = 50; // your header height
        return {
            height: (($scope.gridOptions3.data.length+2) * rowHeight + headerHeight) + "px"
        };
    };

    var statusTemplate = '<timer start-time=\"row.entity.MaxWaitingMS\" interval=\"1000\"> {{hhours}}:{{mminutes}}:{{sseconds}}</timer>';
    var maxWaitTimeTemplate = "<div>{{row.entity.MaxWaitTime| secondsToDateTime | date:'HH:mm:ss'}}</div>";

    $scope.gridOptions3 = {
        enableSorting: true,
        enableRowSelection: false,
        enableRowHeaderSelection: false,
        multiSelect: false,
        modifierKeysToMultiSelect: false,
        noUnselect: false,
        columnDefs: [
            {
                name: 'QueueName', field: 'QueueName', headerTooltip: 'Queue Name', width: '15%', sort: {
                direction: uiGridConstants.ASC
            }
            },
            {name: 'Cur.Waiting', field: 'CurrentWaiting', headerTooltip: 'Current Waiting', cellClass: 'table-number'},
            {
                name: 'Avg.Wait',
                field: 'AverageWaitTime',
                headerTooltip: 'Average Wait Time',
                cellFilter: " number : 2",
                cellClass: 'table-time',
                cellTemplate: "<div>{{row.entity.AverageWaitTime|secondsToDateTime| date:'HH:mm:ss'}}</div>"
            },
            {
                name: 'Cur.MaxWait',
                field: 'CurrentMaxWaitTime',
                headerTooltip: 'Current MaxWait Time',
                cellTemplate: statusTemplate,
                cellClass: 'table-time'
            },
            {
                name: 'MaxWait',
                field: 'MaxWaitTime',
                headerTooltip: 'Max Waiting Time',
                cellTemplate: maxWaitTimeTemplate,
                cellClass: 'table-time'
            },
            {name: 'Q.Dropped', field: 'QueueDropped', headerTooltip: 'Queue Dropped', cellClass: 'table-number'},
            {name: 'Answered', field: 'TotalAnswered', headerTooltip: 'Total Answered', cellClass: 'table-number'},
            {name: 'Queued', field: 'TotalQueued', headerTooltip: 'Total Queued', cellClass: 'table-number'},
            {name: 'presentage', field: 'presentage', headerTooltip: 'presentage', cellClass: 'presentage'},
            {name: 'Time', field: 'EventTime', headerTooltip: 'Last Event Time', visible: false},
            {name: 'id', field: 'id', visible: false}
        ],
        data: [],
        onRegisterApi: function (gridApi) {
            //$scope.grid1Api = gridApi;
        }
    };


        //update new table
       /* $scope.gridOptions3 = {
            enableColumnResizing: true,
            enableGridMenu: true,
            enableSorting: true,
            data: [],
            columnDefs: [
                {
                    name: 'QueueName', field: 'QueueName', headerTooltip: 'Queue Name', width: 200, sort: {
                    direction: uiGridConstants.ASC
                }
                },
                /!*{
                    name: 'QueueName',
                    displayName: 'Queue Name',
                    width: 200
                },*!/
                {
                    name: 'CurrentWaiting',
                    displayName: 'Current waiting',
                    width: 100
                },
                {
                    name: 'CurrentMaxWaitTime',
                    displayName: 'Current max waiting Time',
                    width: 170,
                    cellTemplate: "<timer start-time=\"row.entity.MaxWaitingMS\" interval=\"1000\"> {{hhours}}:{{mminutes}}:{{sseconds}}</timer>"
                },
                {
                    name: 'TotalQueued',
                    displayName: 'Total Queued',
                    width: 100
                },
                {
                    name: 'TotalAnswered',
                    displayName: 'Answered Calls',
                    width: 100
                },
                {
                    name: 'TotalAnswered',
                    displayName: 'Answered Calls',
                    width: 100
                },
                {
                    name: 'QueueDropped',
                    displayName: 'Droped Calls',
                    width: 100
                },
                {
                    name: 'MaxWaitTime',
                    displayName: 'Max wait Time',
                    width: 100,
                    cellTemplate: "<div>{{row.entity.MaxWaitTime|secondsToDateTime| date:'HH:mm:ss'}}</div>"
                },
                {
                    name: 'AverageWaitTime',
                    displayName: 'Avg. Wait Time',
                    width: 100,
                    cellTemplate: "<div>{{row.entity.AverageWaitTime|secondsToDateTime| date:'HH:mm:ss'}}</div>"
                },
                {
                    name: 'presentage',
                    displayName: 'Answered Percentage',
                    width: 100
                }


            ]
        };*/


        var setGridData = function () {

            /*var res = [];
            for (var x in $scope.queues) {
                $scope.queues.hasOwnProperty(x) && res.push($scope.queues[x]&& !$scope.checkQueueHidden(x.id))
            }
            $scope.safeApply(function () {
                $scope.gridOptions3.data = res;
            });*/

            var gridData = [];
            for (var key in $scope.queues) {
                if ($scope.queues.hasOwnProperty(key)&& !$scope.checkQueueHidden(key)) {
                    gridData.push($scope.queues[key]);
                }
            }
            $scope.safeApply(function () {
                $scope.gridOptions3.data = gridData;
            });
        };

    }
);

mainApp.directive('queued', function (queueMonitorService, $timeout, loginService) {
    return {

        restrict: 'EA',
        scope: {
            name: "@",
            queueoption: "=",
            pieoption: "=",
            viewmode: "=",
            que: "="
        },


        templateUrl: 'template/queued-temp.html',
        link: function (scope, element, attributes) {


            //console.log(scope.queueoption)
            // console.log(scope.pieoption)
            // scope.skillList=scope.name.match(/attribute_[0-9]*/g);
            scope.tempSkills = scope.name.match(/attribute_([^\-]+)/g);

            scope.skillList = scope.tempSkills.map(function (item) {
                return item.split('_')[1].toString();
            });

            //scope.que = {};
            scope.options = {};
            // scope.que.CurrentWaiting = 0;
            // scope.que.CurrentMaxWaitTime = 0;
            // scope.que.presentage = 0;
            scope.maxy = 10;
            scope.val = "0";

            scope.dataSet = [{
                data: [],
                lines: {
                    fill: true,
                    lineWidth: 2
                }
            }];


            scope.queueoption = {
                grid: {
                    borderColor: '#f8f6f6',
                    show: true
                },
                series: {shadowSize: 0, color: "#f8b01d"},
                color: {color: '#63a5a2'},
                legend: {
                    container: '#legend',
                    show: true
                },
                yaxis: {
                    min: 0,
                    max: scope.maxy
                },
                xaxis: {
                    tickFormatter: function (val, axis) {
                        return moment.unix(val).minute() + ":" + moment.unix(val).second();
                    }
                }
            };


            var qData = function () {

                queueMonitorService.GetSingleQueueStats(scope.name).then(function (response) {
                    scope.que = response.QueueInfo;
                    scope.que.id = response.QueueId;

                    scope.que.QueueName = response.QueueName;
                    scope.que.AverageWaitTime = Math.round(scope.que.AverageWaitTime * 100) / 100;

                    if (scope.que.TotalQueued > 0) {
                        scope.que.presentage = Math.round((scope.que.TotalAnswered / scope.que.TotalQueued) * 100);
                    }
                }, function (err) {
                    loginService.isCheckResponse(err);
                });
            };

            var skilledResources = function () {

                var skillObj = {
                    skills: scope.skillList
                };

                queueMonitorService.getAvailableResourcesToSkill(skillObj).then(function (response) {
                    scope.agentCount = response;
                }, function (err) {
                    loginService.isCheckResponse(err);
                });
            };


            var qStats = function () {

                //GetSingleQueueStats
                queueMonitorService.GetSingleQueueGraph(scope.name).then(function (response) {
                    response.pop();
                    var max = 0;
                    scope.dataSet[0].data = response.map(function (c, index) {
                        var item = [];
                        item[0] = c[1];
                        item[1] = c[0];


                        if (c[0] > max) {

                            max = c[0];
                        }

                        return item;
                    });

                    if (max == 0) {
                        max = 1;
                    }

                    if (scope.maxy != Math.ceil(max)) {

                        scope.maxy = Math.ceil(max);
                        scope.queueoption.yaxis.max = scope.maxy + 1;
                    }
                }, function (err) {
                    loginService.isCheckResponse(err);
                });

            }


            //qData();
            qStats();
            skilledResources();


            var updateRealtime = function () {

                // qData();
                qStats();
                skilledResources();

                updatetimer = $timeout(updateRealtime, 2000);

            };

            var updatetimer = $timeout(updateRealtime, 2000);

            //updateRealtime();


            scope.$on("$destroy", function () {
                if (updatetimer) {
                    $timeout.cancel(updatetimer);
                }
            });


            /*

             $interval(function updateRandom() {
             qData();
             qStats();


             }, 10000);

             */


        },


    }
});

mainApp.directive('queuedlist', function (queueMonitorService, moment, $timeout, loginService) {
    return {

        restrict: 'EA',
        /*template:"<th class=\"fs15 text-left\">{{que.queuename}}</th><th class=\"fs15 text-right\">{{que.CurrentWaiting}}</th><th class=\"fs15 text-right\">{{que.CurrentMaxWaitTime| secondsToDateTime | date:'HH:mm:ss'}}</th>"
         +"<th class=\"fs15 text-right\">{{que.TotalQueued}}</th><th class=\"fs15 text-right\">{{que.MaxWaitTime| secondsToDateTime | date:'HH:mm:ss'}}</th>"
         + "<th class=\"fs15 text-right\">{{que.AverageWaitTime| secondsToDateTime | date:'HH:mm:ss'}}</th> <th class=\"fs15 text-right\">{{que.presentage}}</th>",
         */
        scope: {
            name: "@",
            queueoption: "=",
            pieoption: "=",
            viewmode: "=",
            que: "="
        },

        template: "<th class=\"fs15 text-left\">{{que.QueueName}}</th>" + "<th class=\"fs15\">{{que.CurrentWaiting}}</th>"
        + "<th class=\"fs15\"><timer start-time=\"que.MaxWaitingMS\" interval=\"1000\"> {{hhours}}:{{mminutes}}:{{sseconds}}</timer></th> <th class=\"fs15\">{{que.TotalQueued}}</th><th class=\"fs15\">{{que.TotalAnswered}}</th><th class=\"fs15\">{{que.QueueDropped}}</th>"
        + "<th class=\"fs15\">{{que.MaxWaitTime| secondsToDateTime | date:'HH:mm:ss'}}</th> <th class=\"fs15\">{{que.AverageWaitTime| secondsToDateTime | date:'HH:mm:ss'}}</th>"
        + "<th class=\"fs15\">{{que.presentage}}</th>",

        // <th class=\"fs15\">{{que.agentCount}}</th>
        link: function (scope, element, attributes) {


            scope.maxy = 10;
            scope.val = "";


            var qData = function () {

                /*queueMonitorService.GetSingleQueueStats(scope.name).then(function (response) {

                 if (response.QueueInfo) {
                 response.QueueInfo.QueueName = response.QueueName;
                 }
                 scope.que = response.QueueInfo;
                 if (response.QueueInfo.CurrentMaxWaitTime) {
                 scope.que.CurrentMaxWaitTime = moment().diff(moment(response.QueueInfo.CurrentMaxWaitTime), 'seconds');
                 }
                 console.log("que  ", scope.que);
                 scope.que.id = response.QueueId;

                 scope.val = response.QueueName;
                 scope.que.AverageWaitTime = Math.round(scope.que.AverageWaitTime * 100) / 100;

                 if (scope.que.TotalQueued > 0) {
                 scope.que.presentage = Math.round((scope.que.TotalAnswered / scope.que.TotalQueued) * 100);
                 }
                 }, function (err) {
                 loginService.isCheckResponse(err);
                 });*/
            };


            //sqData();

            scope.tempSkills = scope.name.match(/attribute_([^\-]+)/g);

            scope.skillList = scope.tempSkills.map(function (item) {
                return item.split('_')[1].toString();
            });

            var skilledResources = function () {

                var skillObj = {
                    skills: scope.skillList
                };

                queueMonitorService.getAvailableResourcesToSkill(skillObj).then(function (response) {
                    scope.que.agentCount = response;
                }, function (err) {
                    loginService.isCheckResponse(err);
                });
            };

            //skilledResources();

            var updateRealtime = function () {

                //qData();
                skilledResources();

                updatetimer = $timeout(updateRealtime, 2000);

            };

            //var updatetimer = $timeout(updateRealtime, 2000);

            //updateRealtime();


            // scope.$on("$destroy", function () {
            //     if (updatetimer) {
            //         $timeout.cancel(updatetimer);
            //     }
            // })


            /*

             $interval(function updateRandom() {
             qData();
             qStats();


             }, 10000);

             */


        },


    }
});
