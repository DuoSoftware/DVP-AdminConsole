/**
 * Created by Heshan.i on 1/13/2017.
 */

(function(){

    var app =angular.module('veeryConsoleApp');

    var acwDetailController = function($scope, $state, $timeout, acwDetailApiAccess, resourceService, cdrApiHandler, loginService) {

        $scope.pagination = {
            currentPage : 1
        };

        $scope.obj = {
            startDay: moment().format("YYYY-MM-DD"),
            endDay: moment().format("YYYY-MM-DD")
        };

		$scope.onDateChange = function () {

			if (moment($scope.obj.startDay, "YYYY-MM-DD").isValid() && moment($scope.obj.endDay, "YYYY-MM-DD").isValid()) {
				/** Kasun_Wijeratne_5_MARCH_2018
				 * ----------------------------------------*/
				var sd = new Date($scope.obj.startDay);
				var ed = new Date($scope.obj.endDay);
				var msd = moment(sd);
				var med = moment(ed);
				if(sd && ed){
					var dif = med.diff(msd, 'days');
					if(dif > 30){
						$scope.showAlert("Invalid End Date", 'error', "End Date should not exceed 30 days from Start Date");
						$scope.obj.endDay = $scope.obj.startDay;
					}else{
						$scope.dateValid = true;
					}
				}
				/** ----------------------------------------
				 * Kasun_Wijeratne_5_MARCH_2018*/
			}
			else {
				$scope.dateValid = false;
			}
		};

        $scope.startTime = '12:00 AM';
        $scope.endTime = '11:59 PM';

        $scope.qList = [];

        $scope.showTable = false;

        $scope.cancelDownload = true;
        $scope.buttonClass = 'fa fa-file-text';
        $scope.fileDownloadState = 'RESET';
        $scope.currentCSVFilename = '';
        $scope.DownloadButtonName = 'CSV';

        $scope.downloadPress = function () {
            $scope.fileDownloadState = 'RESET';
            $scope.DownloadButtonName = 'CSV';
            $scope.cancelDownload = true;
            $scope.buttonClass = 'fa fa-file-text';
        };

        var checkFileReady = function (fileName) {
            if ($scope.cancelDownload) {
                $scope.fileDownloadState = 'RESET';
                $scope.DownloadButtonName = 'CSV';
                $scope.buttonClass = 'fa fa-file-text';
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
                                $scope.buttonClass = 'fa fa-file-text';
                            }
                            else {
                                $scope.fileDownloadState = 'RESET';
                                $scope.DownloadButtonName = 'CSV';
                                $scope.cancelDownload = true;
                                $scope.buttonClass = 'fa fa-file-text';
                            }


                        }
                    }
                    else {
                        $scope.fileDownloadState = 'RESET';
                        $scope.DownloadButtonName = 'CSV';
                        $scope.cancelDownload = true;
                        $scope.buttonClass = 'fa fa-file-text';
                        $scope.showAlert('CDR Download', 'warn', 'No CDR Records found for downloading');
                    }

                }).catch(function (err) {
                    $scope.fileDownloadState = 'RESET';
                    $scope.DownloadButtonName = 'CSV';
                    $scope.cancelDownload = true;
                    $scope.buttonClass = 'fa fa-file-text';
                    $scope.showAlert('CDR Download', 'error', 'Error occurred while preparing file');
                });
            }

        };

        $scope.processDownloadRequest = function()
        {
            if ($scope.DownloadButtonName === 'CSV') {
                $scope.cancelDownload = false;
                $scope.buttonClass = 'fa fa-spinner fa-spin';
            }
            else {
                $scope.cancelDownload = true;
                $scope.buttonClass = 'fa fa-file-text';
            }

            $scope.DownloadButtonName = 'PROCESSING';

            var st = moment($scope.startTime, ["h:mm A"]).format("HH:mm");
            var et = moment($scope.endTime, ["h:mm A"]).format("HH:mm");
            var momentTz = moment.parseZone(new Date()).format('Z');
            momentTz = momentTz.replace("+", "%2B");

            var startDate = $scope.obj.startDay + ' ' + st + ':00' + momentTz;
            var endDate = $scope.obj.endDay + ' ' + et + ':59' + momentTz;

            acwDetailApiAccess.getAllAcwRecords($scope.obj.resourceId, startDate, endDate, $scope.skillFilter).then(function(response){
                if(response.IsSuccess)
                {
                    var downloadFilename = response.Result;

                    checkFileReady(downloadFilename);
                }
                else
                {
                    $scope.showAlert('Error', 'error', 'Error occurred while loading cdr records');
                    $scope.fileDownloadState = 'RESET';
                    $scope.DownloadButtonName = 'CSV';
                    $scope.cancelDownload = true;
                    $scope.buttonClass = 'fa fa-file-text';
                }
            }, function(err){
                loginService.isCheckResponse(err);
                $scope.showAlert('Error', 'error', 'Error occurred while loading cdr records');
                $scope.fileDownloadState = 'RESET';
                $scope.DownloadButtonName = 'CSV';
                $scope.cancelDownload = true;
                $scope.buttonClass = 'fa fa-file-text';
            });
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

        $scope.getResourceDetails = function(){
            acwDetailApiAccess.GetResourceDetails().then(function(response){
                if(response.IsSuccess)
                {
                    $scope.resourceDetails = response.Result;
                }
                else
                {
                    var errMsg = response.CustomMessage;

                    if(response.Exception)
                    {
                        errMsg = response.Exception.Message;
                    }
                    $scope.showAlert('ACW Details', errMsg, 'error');
                }
            }, function(err){
                loginService.isCheckResponse(err);
                var errMsg = "Error occurred while loading resource details";
                if(err.statusText)
                {
                    errMsg = err.statusText;
                }
                $scope.showAlert('ACW Details', errMsg, 'error');
            });
        };

        $scope.getAcwSummery = function(){
            $scope.showTable = false;
            $scope.totalAcwSessions = 0;
            $scope.totalAcwTime = 0;
            $scope.averageAcwTime = 0;

            $scope.showPaging = false;

            $scope.pageSize = 20;


            $scope.obj.isTableLoading = 0;

            $scope.allAcwRecords = [];


            var st = moment($scope.startTime, ["h:mm A"]).format("HH:mm");
            var et = moment($scope.endTime, ["h:mm A"]).format("HH:mm");
            $scope.obj.isTableLoading = 0;
            var momentTz = moment.parseZone(new Date()).format('Z');
            momentTz = momentTz.replace("+", "%2B");

            var startDate = $scope.obj.startDay + ' ' + st + ':00' + momentTz;
            var endDate = $scope.obj.endDay + ' ' + et + ':59' + momentTz;

            acwDetailApiAccess.GetAcwSummeryDetails($scope.obj.resourceId, startDate, endDate, $scope.skillFilter).then(function(response){
                if(response.IsSuccess)
                {
                    if(response.Result) {
                        $scope.totalAcwSessions = response.Result.TotalAcwSessions?response.Result.TotalAcwSessions:0;
                        $scope.totalAcwTime = response.Result.TotalAcwTime?parseInt(response.Result.TotalAcwTime):0;
                        $scope.averageAcwTime = response.Result.AverageAcwTime?parseFloat(response.Result.AverageAcwTime).toFixed(2):0;

                        var durationObj = moment.duration($scope.totalAcwTime*1000);
                        if(durationObj._data.days>0){
                            $scope.timeStr = durationObj._data.days+'d '+durationObj._data.hours+'h:'+durationObj._data.minutes+'m:'+durationObj._data.seconds+'s';
                        }else{
                            $scope.timeStr = durationObj._data.hours+'h:'+durationObj._data.minutes+'m:'+durationObj._data.seconds+'s';
                        }
                        $scope.getAcwRecords();
                    }

                }
                else
                {
                    var errMsg = response.CustomMessage;

                    if(response.Exception)
                    {
                        errMsg = response.Exception.Message;
                    }
                    $scope.showAlert('ACW Details', errMsg, 'error');
                }
            }, function(err){
                loginService.isCheckResponse(err);
                var errMsg = "Error occurred while loading ACW records";
                if(err.statusText)
                {
                    errMsg = err.statusText;
                }
                $scope.showAlert('ACW Details', errMsg, 'error');
            });
        };

        $scope.getAcwRecords = function(){
            //$scope.currentPage = pageNo + 1;
            $scope.showTable = false;
            var st = moment($scope.startTime, ["h:mm A"]).format("HH:mm");
            var et = moment($scope.endTime, ["h:mm A"]).format("HH:mm");
            var momentTz = moment.parseZone(new Date()).format('Z');
            momentTz = momentTz.replace("+", "%2B");

            var startDate = $scope.obj.startDay + ' ' + st + ':00' + momentTz;
            var endDate = $scope.obj.endDay + ' ' + et + ':59' + momentTz;

            acwDetailApiAccess.GetAcwRecords($scope.obj.resourceId, $scope.pagination.currentPage, $scope.pageSize, startDate, endDate, $scope.skillFilter).then(function(response){
                if(response.IsSuccess)
                {
                    $scope.showTable = true;
                    $scope.allAcwRecords = response.Result;
                    /*$scope.acwRecords = response.Result;*/
                    var sessionIds = [];
                    $scope.obj.isTableLoading = 1;
                    if($scope.allAcwRecords && $scope.allAcwRecords.length > 0){


                        if($scope.allAcwRecords.length < $scope.pageSize){
                            $scope.showPaging = false;
                        }else{
                            $scope.showPaging = true;
                        }
                    }else{
                        $scope.obj.isTableLoading = 1;
                        $scope.showPaging = false;
                    }
                }
                else
                {
                    var errMsg = response.CustomMessage;

                    if(response.Exception)
                    {
                        errMsg = response.Exception.Message;
                    }
                    $scope.showAlert('ACW Details', errMsg, 'error');
                }
            }, function(err){
                loginService.isCheckResponse(err);
                var errMsg = "Error occurred while loading ACW records";
                if(err.statusText)
                {
                    errMsg = err.statusText;
                }
                $scope.showAlert('ACW Details', errMsg, 'error');
            });
        };


        $scope.getResourceDetails();

    };

    app.controller('acwDetailController', acwDetailController);
}());