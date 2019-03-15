mainApp.controller("campaign_real_time_monitor_controller", function ($scope, $compile, $uibModal, $filter, $location, $log, $anchorScroll, campaignService, uiGridConstants, subscribeServices, queueMonitorService) {

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
            width: '15%'
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
            //$scope.grid1Api = gridApi;
        }
    };

    $scope.queues = {test: "dasdas"};

    // implement with data array. need test concurrency issue. if any case use key value pair
    subscribeServices.subscribeDashboard('dashboard', function (event) {
        console.debug(event);
        if(event.roomName ==="DIALER:RealTimeCampaignEvents"){
           /*var cam_obj =  $scope.gridQOptions.data.filter(x => x.CampaignId === event.Message.CampaignId);*/
           var cam_obj =  $scope.gridQOptions.data.find(x => x.CampaignId === event.Message.CampaignId);
           console.info(cam_obj);
           switch (event.eventName){
               case "UPDATE_CAMPAIGN":{
                   if(cam_obj)
                   cam_obj.OperationalStatus = event.Message.OperationalStatus;
                   break;
               }
               case "NEW_CAMPAIGN":{
                   if(!cam_obj)
                   $scope.gridQOptions.data.push(event.Message);
                   break;
               }
               case "REMOVE_CAMPAIGN":{
                   if(cam_obj)
                   {var index = $scope.gridQOptions.data.indexOf(cam_obj);
                   $scope.gridQOptions.data.splice(index, 1);}
                   break;
               }
            }
        };
    });

    $scope.isProgress = false;
    $scope.GetCampignCallList = function () {
        $('#v_data_load').removeClass('display-none').addClass("v_data_loader");
        $('#v_data_grd').removeClass("qgrid").addClass('display-none');
        campaignService.GetCampignCallList().then(function (response) {
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

});
