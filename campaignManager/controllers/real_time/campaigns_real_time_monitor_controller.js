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
            $scope.grid1Api = gridApi;
        }
    };

    $scope.queues = {test: "dasdas"};

    // implement with data array. need test concurrency issue. if any case use key value pair
    subscribeServices.subscribeDashboard('dashboard', function (event) {
        console.info(event);

        $scope.safeApply(function () {
            switch (event.roomName){
                case "DIALER:RealTimeCampaignEvents":{
                    var cam_obj =  $scope.gridQOptions.data.find(x => x.CampaignId === event.Message.CampaignId);
                    console.info(cam_obj);
                    /*$scope.safeApply(function () {
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
                        $scope.grid1Api.grid.refresh();
                    })*/

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
                    $scope.grid1Api.grid.refresh();
                }break;

                case "CAMPAIGNCONNECTED:TotalCount":{
                    if(event.Message &&  event.eventName==="TotalCount"){
                        $scope.total_answered =  event.Message.TotalCountWindow;
                    }
                }break;
                case "CAMPAIGNCONNECTED:CurrentCount":{
                    if(event.Message &&  event.eventName==="CurrentCount"){
                        $scope.total_connected =  event.Message.CurrentCountAllParams;
                    }
                }break;
                case "CAMPAIGNDIALING:CurrentCount":{
                    if(event.Message &&  event.eventName==="CurrentCount"){
                        $scope.total_dialings =  event.Message.CurrentCountAllParams;
                    }
                }break;

                case "CAMPAIGNDIALING:TotalCount":{
                    if(event.Message &&  event.eventName==="TotalCount"){
                        $scope.total_dialed =  event.Message.TotalCountWindow;
                    }
                }break;
            }
        });

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

    $scope.total_dialings = 0;
    $scope.total_answered =0;
    $scope.total_dialed = 0;
    $scope.total_connected = 0;
    var load_default_data = function () {
        $('#v_data_load').removeClass('display-none').addClass("v_data_loader");
        $('#v_data_grd').removeClass("qgrid").addClass('display-none');

        /*var method_list = [$scope.GetOngoinCampignList("ALL"), dashboardService.getCurrentCampaignCount("TOTALCAMPAIGNDIALING")];

        var window_names = ["TOTALCAMPAIGNANSWERED", "TOTALCAMPAIGNDIALED", "TOTALCAMPAIGNCONNECTED"];
        for (var i = 0; i < window_names.length; i++) {
            method_list.push(dashboardService.GetTotalCampaignCount(window_names[i]));
        }*/

        var method_list = [$scope.GetOngoinCampignList("ALL"),dashboardService.getCurrentCampaignCount("CAMPAIGNDIALING",null),dashboardService.getCurrentCampaignCount("CAMPAIGNCONNECTED",null)];

        var window_names = ["CAMPAIGNDIALING","CAMPAIGNCONNECTED"];//CAMPAIGNNUMBERSTAKEN
        for (var i = 0; i < window_names.length; i++) {
            method_list.push(dashboardService.GetTotalCampaignCount(window_names[i],null));
        }

        $q.all(method_list).then(function (resolveData) {
            if (resolveData) {
                $scope.total_dialings = resolveData[1];
                $scope.total_answered =resolveData[4];
                $scope.total_dialed = resolveData[3];
                $scope.total_connected = resolveData[2];
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
