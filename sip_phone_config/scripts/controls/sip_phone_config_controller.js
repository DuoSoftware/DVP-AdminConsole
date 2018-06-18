mainApp.controller("sip_phone_config_controller",function ($scope, $rootScope, $filter, $stateParams, $anchorScroll,sipUserService,sipUserApiHandler) {
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
            $scope.ip_phones = response;
        }, function (error) {
            console.error(error);
            $scope.showAlert("SIP Phone", 'error','Fail To Get Phone List.');
            $scope.isTableLoading = false;
            return null;
        })
    };

    getPhoneConfigs();
    $scope.sipUsrList = [];
    var loadSipUsers = function () {
        sipUserApiHandler.getSIPUsers().then(function (data) {
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
        }, function (err) {
            console.error(err);
            $scope.showAlert('Error', 'error', 'Fail To Load Sip User List');
        });
    };
    loadSipUsers();
});