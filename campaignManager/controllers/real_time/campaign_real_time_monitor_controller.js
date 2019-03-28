mainApp.controller("campaign_real_time_monitor_controller", function ($stateParams,$scope, $compile, $uibModal, $filter, $q, $location, $log, $anchorScroll, campaignService, uiGridConstants, subscribeServices, dashboardService,ShareData,contactService) {

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
    $scope.campaignId = $stateParams.campaignid;
    $scope.campaignname = $stateParams.campaignname;

    var setDonutData =function () {
        try{
            /*myObject.setOption({
                series: [{
                    data:[{name: "ProfilesCount",value: $scope.ProfilesCount},{name:"ProfileLoaded", value:$scope.ProfileLoaded},{name: "ContactLoaded",value: $scope.ContactLoaded},{name:"ContactRejected",value:$scope.total_contact_rejected},{name: "ProfileRejected",value: $scope.ProfileRejected},{name: "Dialed",value: $scope.total_dialed},{name: "Dialing",value: $scope.dialing}]
                }]

            });*/

           //myObject.data.datasets[0].data= [$scope.ProfilesCount,$scope.ProfileLoaded,$scope.ProfileRejected,$scope.ContactLoaded,$scope.total_contact_rejected,$scope.total_dialed,$scope.dialing]
            myChart1.data.datasets[0].data= [$scope.ContactCount,$scope.ContactLoaded,$scope.total_contact_rejected,$scope.total_dialed,$scope.dialing,$scope.total_answered];
            myChart1.update();
        }catch(ex){
            console.log(ex);
        }
    };

    $scope.height_px = "2000px !important";
    $scope.getTableHeight = function() {
        return $scope.height_px;
       /* var rowHeight = 30; // your row height
        var headerHeight = 30; // your header height
        $scope.height_px = ($scope.gridQOptions.data.length * rowHeight + headerHeight) + "px";
        return {
            height: ($scope.gridQOptions.data.length * rowHeight + headerHeight) + "px !important"
        };*/
    };

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
                field: 'DialState',cellClass: 'table-number',
                headerTooltip: 'Dial State'
            },
            {
                enableSorting: true, enableFiltering: true,
                name: 'TryCount',
                field: 'TryCount',cellClass: 'table-number',
                headerTooltip: 'Try Count'

            },

            {
                enableSorting: true, enableFiltering: false,
                name: 'DialState',
                field: 'DialState',cellClass: 'table-number',
                headerTooltip: 'Dial State'
            },

            {
                enableSorting: true, enableFiltering: false,
                name: 'SessionId',
                field: 'SessionId',
                headerTooltip: 'SessionId',
                cellClass: 'table-number'
            }],
        data: [{test: "loading"}],
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
                            { $scope.gridQOptions.data.push(event.Message);
                                $scope.getTableHeight();}
                            break;
                        }
                        case "REMOVE_CAMPAIGN_CALL":{
                            if(cam_obj)
                            {var index = $scope.gridQOptions.data.indexOf(cam_obj);
                                $scope.gridQOptions.data.splice(index, 1);
                                $scope.getTableHeight();}
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
                        setDonutData();
                    }
                }break;
                case "CAMPAIGNDIALING:TotalCount":{
                    if(event.Message&&$scope.campaignId === event.Message.param1&&  event.eventName==="TotalCount"){
                        $scope.total_dialed =  event.Message.TotalCountParam1;
                        setDonutData();
                    }
                }break;
                case "CAMPAIGNNUMBERSTAKEN:TotalCount":{
                    if(event.Message&&$scope.campaignId === event.Message.param1&&  event.eventName==="TotalCount"){
                        $scope.ContactLoaded =  event.Message.TotalCountParam1;
                        setDonutData();
                    }
                }break;
                case "CAMPAIGNREJECTED:TotalCount":{
                    if(event.Message &&  event.eventName==="TotalCount"){
                        $scope.total_contact_rejected =  event.Message.TotalCountWindow;
                        setDonutData();
                    }
                }break;
                case "CAMPAIGNCONNECTED:TotalCount": {
                    if (event.Message && event.eventName === "TotalCount") {
                        $scope.total_answered = event.Message.TotalCountParam1;
                    }
                }
            }
            $scope.getTableHeight();
        });
    });


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

    $scope.campaignSelectedData={};

    var load_campaign = function () {
        campaignService.GetCampaign($scope.campaignId).then(function (response) {
            $scope.campaignSelectedData = response;
        }, function (error) {
            $scope.isSetCommand = false;
            $scope.showAlert("Campaign", 'error', "Fail To Load Campaign Data.");
        });
    };
    load_campaign();

    $scope.ContactLoaded = 0;
    $scope.total_dialed = 0;
    $scope.connected =  0;
    $scope.dialing =  0;
    var load_default_data = function () {
        $('#v_data_load').removeClass('display-none').addClass("v_data_loader");
        $('#v_data_grd').removeClass("qgrid").addClass('display-none');

        var method_list = [contactService.ProfilesCount($scope.campaignId),contactService.ProfileLoadedCount($scope.campaignId),contactService.ProfileRejectCount($scope.campaignId),
            contactService.ProfileContactsCount($scope.campaignId),contactService.ProfileContactLoadedCount($scope.campaignId),contactService.ProfileContactRejectedCount($scope.campaignId),
            dashboardService.getCurrentCampaignCount("CAMPAIGNDIALING",$scope.campaignId),dashboardService.getCurrentCampaignCount("CAMPAIGNCONNECTED",$scope.campaignId),
            dashboardService.GetTotalCampaignCount("CAMPAIGNDIALING",$scope.campaignId),dashboardService.GetTotalCampaignCount("CAMPAIGNCONNECTED",$scope.campaignId),$scope.GetCampignCallList()];


        $q.all(method_list).then(function (resolveData) {
            if (resolveData) {



                $scope.ProfilesCount = (resolveData[0].data && resolveData[0].data.IsSuccess)?resolveData[0].data.Result:0;
                $scope.ProfileLoaded= (resolveData[1].data && resolveData[1].data.IsSuccess)?resolveData[1].data.Result:0;
                $scope.ProfileRejected =(resolveData[2].data && resolveData[2].data.IsSuccess)?resolveData[2].data.Result:0;

                $scope.ContactCount =(resolveData[3].data && resolveData[3].data.IsSuccess)?resolveData[3].data.Result:0;
                $scope.ContactLoaded =(resolveData[4].data && resolveData[4].data.IsSuccess)?resolveData[4].data.Result:0;// CAMPAIGNNUMBERSTAKEN GetTotalCampaignCount
                $scope.total_contact_rejected= (resolveData[5].data && resolveData[5].data.IsSuccess)?resolveData[5].data.Result:0;


                $scope.dialing = resolveData[6];//CAMPAIGNDIALING  getCurrentCampaignCount
                $scope.connected = resolveData[7];//CAMPAIGNCONNECTED   getCurrentCampaignCount
                $scope.total_dialed =resolveData[8]; // CAMPAIGNDIALING GetTotalCampaignCount
                $scope.total_answered = resolveData[9];



                $scope.echartDonutSetOption({
                    ResourceId:"ResourceId123",
                    // hide profile wise count till implement in dialer side,
                    /*data:[$scope.ProfilesCount,$scope.ProfileLoaded,$scope.ProfileRejected,$scope.ContactCount,$scope.ContactLoaded,$scope.total_contact_rejected,$scope.total_dialed,$scope.dialing]*/
                    data:[$scope.ContactCount,$scope.ContactLoaded,$scope.total_contact_rejected,$scope.total_dialed,$scope.dialing,$scope.total_answered]
                    //'ProfilesCount','ProfileLoaded', 'ProfileRejected','ContactCount','ContactLoaded','ContactRejected', 'Dialed', 'Dialing'
                });
            }

            $('#v_data_load').addClass('display-none');
            $('#v_data_grd').removeClass('display-none').addClass("qgrid");
        }).catch(function (err) {
            console.error(err);

            $scope.showAlert("Load Users", "error", "Fail To Get User List.");
        });
    };
    load_default_data();


    var myChart1 ={};
    var myObject = {};
    $scope.echartDonutSetOption = function (campaign) {

        var ctx = document.getElementById('campaignDataBarChart').getContext('2d');
        myObject ={
            type: 'bar',

            data: {
                /*labels: ['ProfilesCount','ProfileLoaded', 'ProfileRejected','ContactCount','ContactLoaded','ContactRejected', 'Dialed', 'Dialing'],*/
                labels: ['ContactCount','ContactLoaded','ContactRejected', 'Dialed', 'Dialing','TotalAnswered'],
                datasets: [
                    {
                        label: "Total Count",
                        backgroundColor: [
                            'rgba(43, 201, 226, 1)',
                            'rgba(231, 133, 94, 1)',
                            'rgba(93, 121, 152, 1)',
                            'rgba(174, 231, 118, 1)',
                            'rgba(251, 206, 139, 1)',
                            'rgba(34, 52, 72, 1)'
                        ],
                        data: campaign.data
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                tooltips: {
                    enabled: true
                },
                scales: {
                    yAxes: [{
                        stacked: true,
                        ticks: {
                            min: 0,
                            stepSize: 100
                        },
                        gridLines: {
                            show: true,
                            color: "#F3F3F3"
                        }
                    }],
                    xAxes: [{
                        gridLines: {
                            show: true,
                            color: "#F3F3F3"
                        }
                    }]
                },
                legend: {
                    labels: {
                        // This more specific font property overrides the global property
                        fontColor: '#485465',
                        FontFamily: "Ubuntu-Regular'"
                    }
                },
                grid: {
                    borderWidth: 1,
                    borderColor: '#fff',
                    show: false
                }
            }
        };
        myChart1 = new Chart(ctx, myObject)

    };

    $scope.echartDonutSetOption({
        ResourceId:"ResourceId123",
        ResourceName:"Campign",
        data:[0,0,0,0,0,0,0,0,0]
    });

    $scope.isSetCommand = false;

    $scope.sendCommandToCampaign = function (cam, command) {
        $scope.isSetCommand = true;
        campaignService.SendCommandToCampaign(cam.CampaignId, command).then(function (response) {
            $scope.isSetCommand = false;
            if (response) {
                $scope.showAlert("Campaign", 'success', "Operation Execute Successfully.");

                switch (command) {
                    case 'stop':
                        $scope.campaignSelectedData.OperationalStatus = 'stop';
                        break;
                    case  'resume':
                        $scope.campaignSelectedData.OperationalStatus = 'start';
                        break;
                    case  'end':
                        $scope.campaignSelectedData.OperationalStatus = 'done';
                        break;
                    case  'pause':
                        $scope.campaignSelectedData.OperationalStatus = 'pause';
                        break;
                }
            } else {
                $scope.showAlert("Campaign", 'error', "Fail To Execute Command.");
            }
        }, function (error) {
            $scope.isSetCommand = false;
            $scope.showAlert("Campaign", 'error', "Fail To Execute Command.");
        });
    };

    $scope.$watch(function () {
        return ShareData.BusinessUnit;
    }, function (newValue, oldValue) {
        if (newValue.toString().toLowerCase() != oldValue.toString().toLowerCase()) {
            load_default_data();
        }
    });
});
