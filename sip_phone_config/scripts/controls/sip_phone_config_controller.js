mainApp.controller("sip_phone_config_controller", function ($scope, $rootScope, $filter, $stateParams, $anchorScroll, $q, sipUserService, sipUserApiHandler) {
    $anchorScroll();

    $scope.showAlert = function (tittle, type, content) {
        new PNotify({
            title: tittle,
            text: content,
            type: type,
            styling: 'bootstrap3'
        });
    };

    $scope.isTableLoading = false;
    $scope.ip_phones = [];
    var getPhoneConfigs = function () {
        return sipUserService.getPhoneConfigs().then(function (response) {
            return response;
        }, function (error) {
            console.error(error);
            $scope.showAlert("SIP Phone", 'error', 'Fail To Get Phone List.');
            $scope.isTableLoading = false;
            return null;
        })
    };


    $scope.sipUsrList = [];
    var loadSipUsers = function () {
        return sipUserApiHandler.getSIPUsers().then(function (data) {
            return data;
        }, function (err) {
            console.error(err);
            $scope.showAlert('Error', 'error', 'Fail To Load Sip User List');
            return null;
        });
    };

    $scope.isLoadingCompany = false;
    $scope.loadData = function () {
        $scope.isLoadingCompany = true;
        $scope.ip_phones = [];
        $scope.sipUsrList = [];
        $q.all([
            getPhoneConfigs(),
            loadSipUsers()
        ]).then(function (value) {
            $scope.ip_phones = value[0];
            var data = value[1];
            if (data.IsSuccess) {
                $scope.sipUsrList = data.Result;
                /*if ($scope.sipUsrList.length > 0) {
                    $scope.FormState = 'New';
                    $scope.SipUsernameDisplay = $scope.sipUsrList[0].SipUsername;
                    //$scope.onEditPressed($scope.sipUsrList[0].SipUsername);
                }

                if ($scope.sipUsrList.length == 0) {
                    $scope.FormState = 'Cancel';
                    $scope.SipUsernameDisplay = 'NEW SIP USER';
                }
                $scope.total = data.Result.length;*/
            }
            $scope.isLoadingCompany = false;
        }, function (err) {
            console.log(err);
            $scope.isLoadingCompany = false;
        });
    };
    $scope.loadData();
});