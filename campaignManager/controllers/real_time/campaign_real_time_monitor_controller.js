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
                    data:[{name: "ProfilesCount",value: $scope.ProfilesCount},{name:"ProfileLoaded", value:$scope.ProfileLoaded},{name: "ContactLoaded",value: $scope.ContactLoaded},{name:"ContactRejected",value:$scope.total_contact_rejected},{name: "ProfileRejected",value: $scope.ProfileRejected},{name: "Dialed",value: $scope.total_dialed},{name: "Dialing",value: $scope.total_dialings}]
                }]

            });*/

           myObject.data.datasets[0].data= [$scope.ProfilesCount,$scope.ProfileLoaded,$scope.ProfileRejected,$scope.ContactLoaded,$scope.total_contact_rejected,$scope.total_dialed,$scope.total_dialings]
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
                        $scope.total_dialings =  event.Message.CurrentCountParam1;
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
                        $scope.total_numbers =  event.Message.TotalCountParam1;
                        $scope.ProfileLoaded =  event.Message.TotalCountWindow;
                        setDonutData();
                    }
                }break;
                case "CAMPAIGNREJECTED:TotalCount":{
                    if(event.Message &&  event.eventName==="TotalCount"){
                        $scope.total_contact_rejected =  event.Message.TotalCountWindow;
                        setDonutData();
                    }
                }break;
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

    $scope.total_numbers = 0;
    $scope.total_dialed = 0;
    $scope.connected =  0;
    $scope.dialing =  0;
    var load_default_data = function () {
        $('#v_data_load').removeClass('display-none').addClass("v_data_loader");
        $('#v_data_grd').removeClass("qgrid").addClass('display-none');

        var method_list = [contactService.ProfilesCount($scope.campaignId),contactService.ProfileContactLoadedCount($scope.campaignId),contactService.ProfileContactRejectedCount($scope.campaignId),$scope.GetCampignCallList(),dashboardService.getCurrentCampaignCount("CAMPAIGNDIALING",$scope.campaignId),dashboardService.getCurrentCampaignCount("CAMPAIGNCONNECTED",$scope.campaignId)];

        var window_names = ["CAMPAIGNNUMBERSTAKEN","CAMPAIGNDIALING","CAMPAIGNREJECTED"];
        for (var i = 0; i < window_names.length; i++) {
            method_list.push(dashboardService.GetTotalCampaignCount(window_names[i],$scope.campaignId));
        }

        method_list.push(contactService.ProfileContactsCount($scope.campaignId));

        $q.all(method_list).then(function (resolveData) {
            if (resolveData) {
                $scope.total_numbers = resolveData[6];
                $scope.total_dialed =resolveData[7];
                $scope.connected = resolveData[5];
                $scope.dialing = resolveData[4];

                $scope.ProfilesCount = (resolveData[0].data && resolveData[0].data.IsSuccess)?resolveData[0].data.Result:0;
                $scope.ProfileRejected =(resolveData[2].data && resolveData[2].data.IsSuccess)?resolveData[2].data.Result:0;
                $scope.ProfileLoaded= resolveData[6];
                $scope.ContactLoaded =(resolveData[1].data && resolveData[1].data.IsSuccess)?resolveData[1].data.Result:0;
                $scope.total_contact_rejected= resolveData[8];
                $scope.total_dialings= resolveData[4];

                $scope.ContactCount =(resolveData[9].data && resolveData[9].data.IsSuccess)?resolveData[9].data.Result:0;

                $scope.echartDonutSetOption({
                    ResourceId:"ResourceId123",
                    // hide profile wise count till implement in dialer side,
                    /*data:[$scope.ProfilesCount,$scope.ProfileLoaded,$scope.ProfileRejected,$scope.ContactCount,$scope.ContactLoaded,$scope.total_contact_rejected,$scope.total_dialed,$scope.total_dialings]*/
                    data:[$scope.ProfilesCount,$scope.ProfileLoaded,$scope.ProfileRejected,$scope.ContactCount,$scope.ContactLoaded,$scope.total_contact_rejected,$scope.total_dialed,$scope.total_dialings]
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


    var theme = {
        color: [
            '#db4114', '#f8b01d', '#2ba89c', '#114858',
            '#9B59B6', '#8abb6f', '#759c6a', '#bfd3b7'
        ],
        title: {
            itemGap: 8,
            textStyle: {
                color: '#408829',
                fontFamily: 'Roboto',
                fontWeight: 300
            }
        },

        dataRange: {
            color: ['#1f610a', '#97b58d']
        },

        toolbox: {
            color: ['#408829', '#408829', '#408829', '#408829']
        },

        tooltip: {
            backgroundColor: 'rgba(0,0,0,0.5)',
            axisPointer: {
                type: 'line',
                lineStyle: {
                    color: '#408829',
                    type: 'dashed'
                },
                crossStyle: {
                    color: '#408829'
                },
                shadowStyle: {
                    color: 'rgba(200,200,200,0.3)'
                }
            }
        },

        dataZoom: {
            dataBackgroundColor: '#eee',
            fillerColor: 'rgba(64,136,41,0.2)',
            handleColor: '#408829'
        },
        grid: {
            borderWidth: 0
        },

        categoryAxis: {
            axisLine: {
                lineStyle: {
                    color: '#408829'
                }
            },
            splitLine: {
                lineStyle: {
                    color: ['#eee']
                }
            }
        },

        valueAxis: {
            axisLine: {
                lineStyle: {
                    color: '#408829'
                }
            },
            splitArea: {
                show: true,
                areaStyle: {
                    color: ['rgba(250,250,250,0.1)', 'rgba(200,200,200,0.1)']
                }
            },
            splitLine: {
                lineStyle: {
                    color: ['#eee']
                }
            }
        },
        timeline: {
            lineStyle: {
                color: '#408829'
            },
            controlStyle: {
                normal: {color: '#408829'},
                emphasis: {color: '#408829'}
            }
        },

        k: {
            itemStyle: {
                normal: {
                    color: '#68a54a',
                    color0: '#a9cba2',
                    lineStyle: {
                        width: 1,
                        color: '#408829',
                        color0: '#86b379'
                    }
                }
            }
        },
        map: {
            itemStyle: {
                normal: {
                    areaStyle: {
                        color: '#ddd'
                    },
                    label: {
                        textStyle: {
                            color: '#c12e34'
                        }
                    }
                },
                emphasis: {
                    areaStyle: {
                        color: '#99d2dd'
                    },
                    label: {
                        textStyle: {
                            color: '#c12e34'
                        }
                    }
                }
            }
        },
        force: {
            itemStyle: {
                normal: {
                    linkStyle: {
                        strokeColor: '#408829'
                    }
                }
            }
        },
        chord: {
            padding: 4,
            itemStyle: {
                normal: {
                    lineStyle: {
                        width: 1,
                        color: 'rgba(128, 128, 128, 0.5)'
                    },
                    chordStyle: {
                        lineStyle: {
                            width: 1,
                            color: 'rgba(128, 128, 128, 0.5)'
                        }
                    }
                },
                emphasis: {
                    lineStyle: {
                        width: 1,
                        color: 'rgba(128, 128, 128, 0.5)'
                    },
                    chordStyle: {
                        lineStyle: {
                            width: 1,
                            color: 'rgba(128, 128, 128, 0.5)'
                        }
                    }
                }
            }
        },
        gauge: {
            startAngle: 225,
            endAngle: -45,
            axisLine: {
                show: true,
                lineStyle: {
                    color: [[0.2, '#86b379'], [0.8, '#68a54a'], [1, '#408829']],
                    width: 8
                }
            },
            axisTick: {
                splitNumber: 10,
                length: 12,
                lineStyle: {
                    color: 'auto'
                }
            },
            axisLabel: {
                textStyle: {
                    color: 'auto'
                }
            },
            splitLine: {
                length: 18,
                lineStyle: {
                    color: 'auto'
                }
            },
            pointer: {
                length: '90%',
                color: 'auto'
            },
            title: {
                textStyle: {
                    color: '#333'
                }
            },
            detail: {
                textStyle: {
                    color: 'auto'
                }
            }
        },
        textStyle: {
            fontFamily: 'Arial, Verdana, sans-serif'
        }
    };
    var myObject = {};
    $scope.echartDonutSetOption = function (campaign) {

        var ctx = document.getElementById('campaignDataBarChart').getContext('2d');
        myObject ={
            type: 'bar',

            data: {
                /*labels: ['ProfilesCount','ProfileLoaded', 'ProfileRejected','ContactCount','ContactLoaded','ContactRejected', 'Dialed', 'Dialing'],*/
                labels: ['ContactCount','ContactLoaded','ContactRejected', 'Dialed', 'Dialing'],
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
        var myChart1 = new Chart(ctx, myObject)

    };

    $scope.echartDonutSetOption({
        ResourceId:"ResourceId123",
        ResourceName:"Campign",
        data:[0,0,0,0,0,0,0,0]
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
