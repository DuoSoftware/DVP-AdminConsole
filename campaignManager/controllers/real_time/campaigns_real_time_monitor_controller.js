mainApp.controller("campaigns_real_time_monitor_controller", function ($scope, $q, $compile, $uibModal, $filter, $location, $log, $anchorScroll, campaignService, uiGridConstants, subscribeServices, dashboardService,ShareData) {

    $anchorScroll();
    $scope.showAlert = function (tittle, type, content) {
        new PNotify({
            title: tittle,
            text: content,
            type: type,
            styling: 'bootstrap3'
        });
    };

    var startTimeTemplate = "<div>{{row.entity.StartTime| date:'yyyy-MM-dd HH:mm:ss'}}</div>";
    var endTimeTimeTemplate = "<div>{{row.entity.EndTime| date:'yyyy-MM-dd HH:mm:ss'}}</div>";


    $scope.gridQOptions = {
        enableFiltering: true,
        enableSorting: true,
        enableRowSelection: false,
        enableRowHeaderSelection: false,
        multiSelect: false,
        modifierKeysToMultiSelect: false,
        noUnselect: false,
        columnDefs: [{
            enableSorting: true, enableFiltering: false,
            name: 'CampaignId',
            field: 'CampaignId',
            headerTooltip: 'Campaign ID',
            cellClass: 'table-number'
        }, {
            enableSorting: true, enableFiltering: true,
            name: 'CampaignName',
            field: 'CampaignName',
            headerTooltip: 'Campaign Name',
            width: '15%',
            sort: {
                direction: uiGridConstants.ASC
            }
        },
            {
                enableSorting: true, enableFiltering: true,
                name: 'CampaignMode',
                field: 'CampaignMode',
                headerTooltip: 'Campaign Mode'
            },
            {
                enableSorting: true, enableFiltering: true,
                name: 'OperationalStatus',
                field: 'OperationalStatus',
                headerTooltip: 'Operational Status',

            },

            {
                enableSorting: true, enableFiltering: false,
                name: 'CampaignChannel',
                field: 'CampaignChannel',
                headerTooltip: 'Campaign Channel'
            },

            {
                enableSorting: true, enableFiltering: false,
                name: 'Extension',
                field: 'Extension',
                headerTooltip: 'Extension',
                cellClass: 'table-number'
            }, {
                enableSorting: true, enableFiltering: false,
                name: 'DialoutMechanism',
                field: 'DialoutMechanism',
                headerTooltip: 'Dialout Mechanism'
            },
            {
                enableSorting: true, enableFiltering: false,
                name: 'StartTime',
                field: 'StartTime',
                headerTooltip: 'Start Time',
                cellTemplate: startTimeTemplate,
                cellClass: 'table-time'
            },
            {
                enableSorting: true, enableFiltering: false,
                name: 'EndTime',
                field: 'EndTime',
                headerTooltip: 'End Time',
                cellTemplate: endTimeTimeTemplate,
                cellClass: 'table-time'
            }],
        data: [],
        onRegisterApi: function (gridApi) {
            //$scope.grid1Api = gridApi;
        }
    };

    $scope.queues = {test: "dasdas"};

    // implement with data array. need test concurrency issue. if any case use key value pair
    subscribeServices.subscribeDashboard('dashboard', function (event) {
        console.debug(event);
        if (event.roomName === "DIALER:RealTimeCampaignEvents") {
            /*var cam_obj =  $scope.gridQOptions.data.filter(x => x.CampaignId === event.Message.CampaignId);*/

            var cam_obj =  $scope.gridQOptions.data.find(x => x.CampaignId === event.Message.CampaignId);
            console.info(cam_obj);
            switch (event.eventName) {
                case "UPDATE_CAMPAIGN": {
                    if (cam_obj)
                        cam_obj.OperationalStatus = event.Message.OperationalStatus;
                    break;
                }
                case "NEW_CAMPAIGN": {
                    if (!cam_obj)
                        $scope.gridQOptions.data.push(event.Message);
                    break;
                }
                case "REMOVE_CAMPAIGN": {
                    if (cam_obj) {
                        var index = $scope.gridQOptions.data.indexOf(cam_obj);
                        $scope.gridQOptions.data.splice(index, 1);
                    }
                    break;
                }
            }
        }
        ;
        /* if (event && event.Message && event.Message.businessUnit
             && ((ShareData.BusinessUnit.toLowerCase() === 'all' && event.Message.businessUnit.toLowerCase() === '*') || (event.Message.businessUnit.toLowerCase() === ShareData.BusinessUnit.toLowerCase()))) {
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

                         /!*if (!$scope.queues[event.Message.queueDetail.QueueId]) {
                             $scope.queueList.push(item);
                         }*!/
                         $scope.safeApply(function () {
                             item.CurrentMaxWaitTime = (item.CurrentMaxWaitTime === 0) ? undefined : item.CurrentMaxWaitTime;
                             $scope.queues[event.Message.queueDetail.QueueId] = item;
                         });

                         var res = [];
                         for (var x in $scope.queues) {
                             $scope.queues.hasOwnProperty(x) && res.push($scope.queues[x])
                         }
                         $scope.safeApply(function () {
                             $scope.gridQOptions.data = res;
                         });
                     }
                     break;
             }
         }

    */

    });

    $scope.isProgress = false;
    $scope.GetOngoinCampignList = function (value) {
        $('#v_data_load').removeClass('display-none').addClass("v_data_loader");
        $('#v_data_grd').removeClass("qgrid").addClass('display-none');
        campaignService.GetOngoinCampignList().then(function (response) {

            if (response) {
                if (value === "ALL") {
                    $scope.gridQOptions.data = response;
                }
                else {
                    $scope.gridQOptions.data = $filter('filter')(response, {OperationalStatus: value}, true);
                }
            }
            $('#v_data_load').addClass('display-none');
            $('#v_data_grd').removeClass('display-none').addClass("qgrid");
        }, function (error) {
            $scope.showAlert("Campaign", 'error', "Fail To Campaign List");
            $('#v_data_load').addClass('display-none');
            $('#v_data_grd').removeClass('display-none');
            console.error(error);
        });
    };
    //$scope.GetOngoinCampignList("ALL");

    $scope.total_dialed = 0;
    $scope.total_answered = 0;
    $scope.total_concurrency = 0;
    $scope.total_connected = 0;
    var load_default_data = function () {
        $('#v_data_load').removeClass('display-none').addClass("v_data_loader");
        $('#v_data_grd').removeClass("qgrid").addClass('display-none');

        var method_list = [$scope.GetOngoinCampignList("ALL"), dashboardService.getCurrentCampaignCount("TOTALCAMPAIGNDIALING")];

        //var window_names = ["TOTALDIALED", "TOTALANSWERED", "TOTALCONNECTED"];
        var window_names = ["TOTALCAMPAIGNANSWERED", "TOTALCAMPAIGNDIALED", "TOTALCAMPAIGNCONNECTED"];
        for (var i = 0; i < window_names.length; i++) {
            method_list.push(dashboardService.GetTotalCampaignCount(window_names[i]));
        }
        $q.all(method_list).then(function (resolveData) {
            if (resolveData) {
                $scope.total_concurrency = resolveData[1];
                $scope.total_answered =resolveData[2];
                $scope.total_dialed = resolveData[3];
                $scope.total_connected = resolveData[4];
            }

            $('#v_data_load').addClass('display-none');
            $('#v_data_grd').removeClass('display-none').addClass("qgrid");
        }).catch(function (err) {
            console.error(err);

            $scope.showAlert("Load Users", "error", "Fail To Get User List.");
        });
    };
    load_default_data();



    $scope.$watch(function () {
        return ShareData.BusinessUnit;
    }, function (newValue, oldValue) {
        if (newValue.toString().toLowerCase() != oldValue.toString().toLowerCase()) {
            load_default_data();
        }
    });
});
