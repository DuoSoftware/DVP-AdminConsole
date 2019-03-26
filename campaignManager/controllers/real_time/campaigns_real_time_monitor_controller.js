mainApp.filter('stringdateToDateTime', [function () {
    return function (date) {
        return new Date(date)
    };
}]);

mainApp.controller("campaigns_real_time_monitor_controller", function ($state,$scope, $q, $compile, $uibModal, $filter, $location, $log, $anchorScroll, campaignService, uiGridConstants, subscribeServices, dashboardService,ShareData,contactService) {

    $anchorScroll();
    $scope.showAlert = function (tittle, type, content) {
        new PNotify({
            title: tittle,
            text: content,
            type: type,
            styling: 'bootstrap3'
        });
    };

    //$filter('date')(date, format, timezone)

    var startTimeTemplate = "<div>{{row.entity.StartTime|stringdateToDateTime| date:'yyyy-MM-dd HH:mm:ss'}}</div>";
    var endTimeTimeTemplate = "<div>{{row.entity.EndTime|stringdateToDateTime| date:'yyyy-MM-dd HH:mm:ss'}}</div>";

    var viewTemplate =  '<i class="fa fa-external-link cursor-pointer" ng-click="grid.appScope.view_campaign(grid, row)" title="More Details"></i>';
    /*var viewTemplate =  '<div class="campaign-edit-btn" title="More Details" ng-click="grid.appScope.view_campaign(grid, row)"><i class="ti-more-alt" title="More Details"></i></div>';*/

    $scope.view_campaign = function(grid,row) {
        $state.go('console.campaigndashboard', {campaignid: row.entity.CampaignId,campaignname:row.entity.CampaignName});
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

    $scope.height_px = "500px !important";
    $scope.getTableHeight = function() {
        return $scope.height_px;
       /* var rowHeight = 30; // your row height
        var headerHeight = 30; // your header height
        $scope.height_px = ($scope.gridQOptions.data.length * rowHeight + headerHeight) + "px !important";
        return {
            height: ($scope.gridQOptions.data.length * rowHeight + headerHeight) + "px"
        };*/
    };

    $scope.gridQOptions = {
        enableFiltering: true,
        enableSorting: true,
        enableRowSelection: true,
        enableRowHeaderSelection: true,
        multiSelect: true,
        modifierKeysToMultiSelect: false,
        noUnselect: false,showGridFooter:true,
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
            },{
                enableSorting: true, enableFiltering: false,
                name: '',
                field: 'CampaignId',
                headerTooltip: 'View',
                cellTemplate: viewTemplate,
                cellClass: 'table-time',
                width: '50'
            }],
        data: [{test: "loading"}],
        onRegisterApi: function (gridApi) {
            $scope.grid1Api = gridApi;
            /*gridApi.selection.on.rowSelectionChanged($scope, function (row) {
                if (row.isSelected) {
                    $state.go('console.campaigndashboard', {campaignid: row.entity.CampaignId,campaignname:row.entity.CampaignName});
                }
            });*/
        }
    };

    $scope.queues = {test: "dasdas"};

    $scope.campaign_details ={};


    var setDonutData =function () {
        try{
            myObject.setOption({
                series: [{
                    data:[{name: "ProfilesCount",value: $scope.ProfilesCount},{name:"ProfileLoaded", value:$scope.ProfileLoaded},{name: "ContactLoaded",value: $scope.ContactLoaded},{name:"ContactRejected",value:$scope.total_contact_rejected},{name: "ProfileRejected",value: $scope.ProfileRejected},{name: "Dialed",value: $scope.total_dialed},{name: "Dialing",value: $scope.total_dialings}]
                }]
            });
        }catch(ex){
            console.log(ex);
        }
    };

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
                            {$scope.gridQOptions.data.push(event.Message);
                                $scope.getTableHeight();}
                            break;
                        }
                        case "REMOVE_CAMPAIGN": {
                            if (cam_obj) {
                                var index = $scope.gridQOptions.data.indexOf(cam_obj);
                                $scope.gridQOptions.data.splice(index, 1);
                                $scope.getTableHeight();
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
                        setDonutData();
                    }
                }break;

                case "CAMPAIGNDIALING:TotalCount":{
                    if(event.Message &&  event.eventName==="TotalCount"){
                        $scope.total_dialed =  event.Message.TotalCountWindow;
                        setDonutData();
                    }
                }break;
                case "CAMPAIGNNUMBERSTAKEN:TotalCount":{
                    if(event.Message &&  event.eventName==="TotalCount"){
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
    $scope.total_contact_rejected = 0;
    var load_default_data = function () {
        $('#v_data_load').removeClass('display-none').addClass("v_data_loader");
        $('#v_data_grd').removeClass("qgrid").addClass('display-none');

        /*var method_list = [$scope.GetOngoinCampignList("ALL"), dashboardService.getCurrentCampaignCount("TOTALCAMPAIGNDIALING")];

        var window_names = ["TOTALCAMPAIGNANSWERED", "TOTALCAMPAIGNDIALED", "TOTALCAMPAIGNCONNECTED"];
        for (var i = 0; i < window_names.length; i++) {
            method_list.push(dashboardService.GetTotalCampaignCount(window_names[i]));
        }*/

        var method_list = [contactService.ProfilesCount(),contactService.ProfileContactLoadedCount(),contactService.ProfileContactRejectedCount(),$scope.GetOngoinCampignList("ALL"),dashboardService.getCurrentCampaignCount("CAMPAIGNDIALING",null),dashboardService.getCurrentCampaignCount("CAMPAIGNCONNECTED",null)];

        var window_names = ["CAMPAIGNDIALING","CAMPAIGNCONNECTED","CAMPAIGNNUMBERSTAKEN","CAMPAIGNREJECTED"];//CAMPAIGNNUMBERSTAKEN
        for (var i = 0; i < window_names.length; i++) {
            method_list.push(dashboardService.GetTotalCampaignCount(window_names[i],null));
        }

        $q.all(method_list).then(function (resolveData) {
            if (resolveData) {
                $scope.total_dialings = resolveData[4];
                $scope.total_answered =resolveData[7];
                $scope.total_dialed = resolveData[6];
                $scope.total_connected = resolveData[5];



                $scope.ProfilesCount = (resolveData[0].data && resolveData[0].data.IsSuccess)?resolveData[0].data.Result:0;
                $scope.ProfileRejected =(resolveData[2].data && resolveData[2].data.IsSuccess)?resolveData[2].data.Result:0;
                $scope.ProfileLoaded= resolveData[8];
                $scope.ContactLoaded =(resolveData[1].data && resolveData[1].data.IsSuccess)?resolveData[1].data.Result:0;
                $scope.total_contact_rejected= resolveData[9];

                $scope.echartDonutSetOption({
                    ResourceId:"ResourceId123",
                    data:[{name: "ProfilesCount",value: $scope.ProfilesCount},{name:"ProfileLoaded", value:$scope.ProfileLoaded},{name: "ProfileRejected",value: $scope.ProfileRejected},{name: "ContactLoaded",value: $scope.ContactLoaded},{name:"ContactRejected",value:$scope.total_contact_rejected},{name: "Dialed",value: $scope.total_dialed},{name: "Dialing",value: $scope.total_dialings}]
                    //'ProfilesCount', 'Dialed', 'ContactLoaded', 'ProfileRejected', 'Dialing'
                });
            }

            $('#v_data_load').addClass('display-none');
            $('#v_data_grd').removeClass('display-none').addClass("qgrid");
        }).catch(function (err) {
            console.error(err);
            $scope.showAlert("Load Users", "error", "Fail To Get User List.");
        });
    };




    var myObject ={};
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
    $scope.echartDonutSetOption = function (campaign) {
        myObject = echarts.init(document.getElementById(campaign.ResourceId), theme);
        myObject.setOption({
            title: {
                show: true,
                //text: ResourceName,
                textStyle: {
                    fontSize: 18,
                    fontWeight: 'bolder',
                    color: '#333',
                    fontFamily: 'Ubuntu-Regular'
                }
            },
            tooltip: {
                trigger: 'item',
                formatter: "{a} <br/>{b} : {c} ({d}%)",
            },
            calculable: true,
            legend: {
                x: 'center',
                y: 'bottom',
                data: ['ProfilesCount','ProfileLoaded', 'ProfileRejected','ContactLoaded','ContactRejected', 'Dialed', 'Dialing']
            },
            toolbox: {
                show: true,
                feature: {
                    mark: {show: true},
                    //dataView : {show: true, readOnly: false},
                    magicType: {
                        show: true,
                        type: ['pie', 'funnel'],
                        option: {
                            funnel: {
                                x: '10%',
                                width: '50%',
                                funnelAlign: 'center',
                                max: 1548
                            }
                        }
                    },
                    restore: {
                        show: false,
                        title: "Restore"
                    },
                    saveAsImage: {
                        show: false,
                        title: "Save As Image"
                    }
                }
            },
            series: [{
                name: 'Campaigns',
                type: 'pie',
                radius: ['35%', '55%'],
                itemStyle: {
                    normal: {
                        label: {
                            show: true
                        },
                        labelLine: {
                            show: true
                        }
                    },
                    emphasis: {
                        label: {
                            show: true,
                            position: 'center',
                            textStyle: {
                                fontSize: '14',
                                fontWeight: 'normal'
                            }
                        }
                    }
                },
                data: campaign.data
            }]
        });
    };

    $scope.echartDonutSetOption({
        ResourceId:"ResourceId123",
        data:[{name: "ProfilesCount",value:0},{name: ",ProfileLoaded",value: 0},{name: "ProfileRejected",value: 0},{name: "ContactLoaded",value: 0},{name:"ContactRejected",value:0},{name: "Dialed",value: 0},{name: "Dialing",value: 0}]
        //'ProfilesCount', 'Dialed', 'ContactLoaded', 'ProfileRejected', 'Dialing'
    });

    /*var load_donut_data = function () {
        var method_list = [contactService.ProfileContactsCount(),contactService.ProfileContactDialedCount(),contactService.ProfileContactLoadedCount(),contactService.ProfileContactRejectedCount(),contactService.ProfileContactDailingCount()];
        $q.all(method_list).then(function (resolveData) {
            if (resolveData) {
                $scope.echartDonutSetOption({
                    ResourceId:"ResourceId123",
                    data:[{name: "ProfilesCount",value: (resolveData[0].data && resolveData[0].data.IsSuccess)?resolveData[0].data.Result:0},{name: "Dialed",value: (resolveData[1].data && resolveData[1].data.IsSuccess)?resolveData[1].data.Result:0},{name: "ContactLoaded",value: (resolveData[2].data && resolveData[2].data.IsSuccess)?resolveData[2].data.Result:0},{name: "ProfileRejected",value: (resolveData[3].data && resolveData[3].data.IsSuccess)?resolveData[3].data.Result:0},{name: "Dialing",value: (resolveData[4].data && resolveData[4].data.IsSuccess)?resolveData[4].data.Result:0}]
                    //'ProfilesCount', 'Dialed', 'ContactLoaded', 'ProfileRejected', 'Dialing'
                });
            }

        }).catch(function (err) {
            console.error(err);
            $scope.showAlert("Load Users", "error", "Fail To Get User List.");
        });
    };
    load_donut_data();*/

    load_default_data();

    $scope.$watch(function () {
        return ShareData.BusinessUnit;
    }, function (newValue, oldValue) {
        if (newValue.toString().toLowerCase() != oldValue.toString().toLowerCase()) {
            load_default_data();
        }
    });
});
