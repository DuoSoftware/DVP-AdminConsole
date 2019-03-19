mainApp.controller("campaign_real_time_monitor_controller", function ($scope, $compile, $uibModal, $filter, $q, $location, $log, $anchorScroll, campaignService, uiGridConstants, subscribeServices, dashboardService,ShareData) {

    $anchorScroll();
    $scope.showAlert = function (tittle, type, content) {
        new PNotify({
            title: tittle,
            text: content,
            type: type,
            styling: 'bootstrap3'
        });
    };

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

    $scope.getTableHeight = function() {
        var rowHeight = 30; // your row height
        var headerHeight = 30; // your header height
        return {
           height: ($scope.gridQOptions.data.length * rowHeight + headerHeight) + "px"
        };
    };

    var startTimeTemplate = "<div>{{row.entity.StartTime| date:'yyyy-MM-dd HH:mm:ss'}}</div>";
    var endTimeTimeTemplate = "<div>{{row.entity.EndTime| date:'yyyy-MM-dd HH:mm:ss'}}</div>";

    $scope.campaign_grid_api ={};
    $scope.gridQOptions = {
        enableFiltering: true,
        enableSorting: true,
        enableRowSelection: false,
        enableRowHeaderSelection: false,
        multiSelect: false,
        modifierKeysToMultiSelect: false,
        noUnselect: false,
        columnDefs: [{
            enableSorting: true, enableFiltering: true,
            name: 'CampaignId',
            field: 'CampaignId',
            headerTooltip: 'Campaign ID',
            cellClass: 'table-number',
            sort: {
                direction: uiGridConstants.ASC
            }
        }, {
            enableSorting: false, enableFiltering: false,
            name: 'PhoneNumber',
            field: 'PhoneNumber',
            headerTooltip: 'Phone Number',
            cellClass: 'table-number',
            //width: '15%'
        },
            {
                enableSorting: true, enableFiltering: true,
                name: 'DialState',
                field: 'DialState',
                headerTooltip: 'Dial State'
            },
            {
                enableSorting: true, enableFiltering: true,
                name: 'TryCount',
                field: 'TryCount',
                headerTooltip: 'Try Count'

            },

            {
                enableSorting: true, enableFiltering: false,
                name: 'DialState',
                field: 'DialState',
                headerTooltip: 'Dial State'
            },

            {
                enableSorting: true, enableFiltering: false,
                name: 'SessionId',
                field: 'SessionId',
                headerTooltip: 'SessionId',
                cellClass: 'table-number'
            }],
        data: [],
        onRegisterApi: function (gridApi) {
            $scope.campaign_grid_api = gridApi;
        }
    };

    $scope.queues = {test: "dasdas"};

    // implement with data array. need test concurrency issue. if any case use key value pair
    subscribeServices.subscribeDashboard('dashboard', function (event) {
        console.info(event);

        $scope.safeApply(function () {
            switch (event.roomName){
                case "DIALER:RealTimeCampaignEvents":{
                    console.info("------------------------ Campaign monitor ---------------------------------------");
                    console.info(event);

                    /*var cam_obj =  $scope.gridQOptions.data.filter(x => x.CampaignId === event.Message.CampaignId);*/
                    var cam_obj =  $scope.gridQOptions.data.find(x => x.SessionId === event.Message.SessionId);
                    console.info(cam_obj);
                    /*$scope.safeApply(function () {
                        switch (event.eventName){
                            case "UPDATE_CAMPAIGN_CALL":{
                                if(cam_obj)
                                    cam_obj.DialState = event.Message.DialState;
                                break;
                            }
                            case "NEW_CAMPAIGN_CALL":{
                                if(!cam_obj)
                                    $scope.gridQOptions.data.push(event.Message);
                                break;
                            }
                            case "REMOVE_CAMPAIGN_CALL":{
                                if(cam_obj)
                                {var index = $scope.gridQOptions.data.indexOf(cam_obj);
                                    $scope.gridQOptions.data.splice(index, 1);}
                                break;
                            }
                        }
                        $scope.campaign_grid_api.grid.refresh();
                    });*/

                    switch (event.eventName){
                        case "UPDATE_CAMPAIGN_CALL":{
                            if(cam_obj && $scope.campaignId === event.Message.CampaignId)
                                cam_obj.DialState = event.Message.DialState;
                            break;
                        }
                        case "NEW_CAMPAIGN_CALL":{
                            if(!cam_obj && $scope.campaignId === event.Message.CampaignId)
                                $scope.gridQOptions.data.push(event.Message);
                            break;
                        }
                        case "REMOVE_CAMPAIGN_CALL":{
                            if(cam_obj)
                            {var index = $scope.gridQOptions.data.indexOf(cam_obj);
                                $scope.gridQOptions.data.splice(index, 1);}
                            break;
                        }
                    }
                    $scope.campaign_grid_api.grid.refresh();
                }
                    break;
                case "CAMPAIGNCONNECTED:CurrentCount":{
                    if(event.Message&& $scope.campaignId === event.Message.param1&&  event.eventName==="CurrentCount"){
                        $scope.connected =  event.Message.CurrentCountParam1;
                    }
                }break;
                case "CAMPAIGNDIALING:CurrentCount":{
                    if(event.Message&&$scope.campaignId === event.Message.param1&&  event.eventName==="CurrentCount"){
                        $scope.dialing =  event.Message.CurrentCountParam1;
                    }
                }break;
                case "CAMPAIGNDIALING:TotalCount":{
                    if(event.Message&&$scope.campaignId === event.Message.param1&&  event.eventName==="TotalCount"){
                        $scope.total_dialed =  event.Message.TotalCountParam1;
                    }
                }break;
                case "CAMPAIGNNUMBERSTAKEN:TotalCount":{
                    if(event.Message&&$scope.campaignId === event.Message.param1&&  event.eventName==="TotalCount"){
                        $scope.total_numbers =  event.Message.TotalCountParam1;
                    }
                }break;
            }
        });
    });

    $scope.campaignId = "1171";
    $scope.isProgress = false;
    $scope.GetCampignCallList = function () {
        $('#v_data_load').removeClass('display-none').addClass("v_data_loader");
        $('#v_data_grd').removeClass("qgrid").addClass('display-none');
        campaignService.GetCampignCallList($scope.campaignId).then(function (response) {
            $scope.gridQOptions.data = response;
            $('#v_data_load').addClass('display-none');
            $('#v_data_grd').removeClass('display-none').addClass("qgrid");
        }, function (error) {
            $scope.showAlert("Campaign", 'error', "Fail To Campaign List");
            $('#v_data_load').addClass('display-none');
            $('#v_data_grd').removeClass('display-none');
            console.error(error);
        });
    };
    $scope.GetCampignCallList();


    $scope.total_numbers = 0;
    $scope.total_dialed = 0;
    $scope.connected =  0;
    $scope.dialing =  0;
    var load_default_data = function () {
        $('#v_data_load').removeClass('display-none').addClass("v_data_loader");
        $('#v_data_grd').removeClass("qgrid").addClass('display-none');

        var method_list = [$scope.GetCampignCallList(),dashboardService.getCurrentCampaignCount("CAMPAIGNDIALING",$scope.campaignId),dashboardService.getCurrentCampaignCount("CAMPAIGNCONNECTED",$scope.campaignId)];

        var window_names = ["CAMPAIGNNUMBERSTAKEN","CAMPAIGNDIALING"];
        for (var i = 0; i < window_names.length; i++) {
            method_list.push(dashboardService.GetTotalCampaignCount(window_names[i],$scope.campaignId));
        }
        $q.all(method_list).then(function (resolveData) {
            if (resolveData) {
                $scope.total_numbers = resolveData[3];
                $scope.total_dialed =resolveData[4];
                $scope.connected = resolveData[2];
                $scope.dialing = resolveData[1];
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
