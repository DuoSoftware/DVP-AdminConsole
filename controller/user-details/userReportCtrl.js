/**
 * Created by Marlon on 3/2/2019.
 */
(function(){

var app =angular.module('veeryConsoleApp');

var userReportCtrl = function ($scope, $filter, $q, $uibModal, uiGridConstants, loginService, userProfileApiAccess, ShareData) {

    $scope.showAlert = function (title, type, content) {
        ngNotify.set(content, {
            position: 'top',
            sticky: true,
            duration: 3000,
            type: type
        });
    };


    userProfileApiAccess.getUserGroups().then(function (response) {
        if (response.Result) {
            $scope.userGroupData = response.Result.map(function (item) {
                return {
                    groupId: item._id,
                    groupName: item.name
                };
            });
        }
    });


    var data = [];
    var process =  function(item) {
        var deferred = $q.defer();
        loginService.LoadUserByBusinessUnit(item.unitName).then(function (response) {
            if (response) {

                response.map(function (user) {
                    if (user.user_meta !== undefined) {  //ignore wrong data

                        var groupName = '-';
                        $scope.userGroupData.some(function (el) {
                            if (el.groupId === user.group) {
                                groupName = el.groupName;
                                return true;
                            }
                        });

                        if (user.veeryaccount === undefined){
                            user.veeryaccount = {};
                            user.veeryaccount.contact = '-';
                        }

                        var userobj = {
                                        buName: item.unitName,
                                        username: user.username,
                                        createdDate: user.created_at,
                                        updatedDate: user.updated_at,
                                        role: user.user_meta.role,
                                        groupName: groupName,
                                        sipAccount: user.veeryaccount.contact
                                    };
                        if ($scope.roleFilter !== undefined && $scope.roleFilter.length > 0) {
                            $scope.roleFilter.some(function (el) {
                                if (el.role === user.user_meta.role) {
                                    data.push(userobj);
                                }
                            });

                        }
                        else {
                            data.push(userobj);
                        }
                }
                });
                deferred.resolve(true);
            }
            else{
                deferred.resolve(false);
            }

        });
        return deferred.promise;
    };

    $scope.getUserDetails = function (){
        $scope.isTableLoading = 0;
        data = [];
        loginService.LoadBusinessUnits(ShareData.MyProfile._id).then(function (response) {
            if (response) {

                var promises = response.map(function (item) {
                    return process(item)
                    });

                $q.all(promises).then(
                    function (res) {
                        if(res) {
                            $scope.gridQOptions.data = data;
                            $scope.isTableLoading = 1;
                        }
                    }
                );

            }});

    };

    $scope.userList = [];

    $scope.roleFilterData = [{'role':'admin'},{'role':'agent'},{'role':'supervisor'}];

    $scope.querySearchRoles = function (query) {
        if (query === "*" || query === "") {
            if ($scope.roleFilterData) {
                return $scope.roleFilterData;
            }
            else {
                return [];
            }

        }
        else {
            if ($scope.roleFilterData) {
                var filteredArr = $scope.roleFilterData.filter(function (item) {
                    //var regEx = "^(" + query + ")";

                    if (item.role) {
                        return item.role.match(query);
                    }
                    else {
                        return false;
                    }

                });

                return filteredArr;
            }
            else {
                return [];
            }
        }

    };


    $scope.getTableHeight = function () {
        var rowHeight = 30; // row height
        var headerHeight = 50; // header height
        return {
            height: (($scope.gridQOptions.data.length + 2) * rowHeight + headerHeight) + "px"
        };
    };

    $scope.gridQOptions = {
        enableSorting: true,
        enableFiltering: true,
        enableExpandable: true,
        enableColumnResizing: true,
        enableRowSelection: true,
        enableRowHeaderSelection: false,
        multiSelect: false,
        modifierKeysToMultiSelect: false,
        noUnselect: false, enableHorizontalScrollbar: true,
        columnDefs: [
            {
                enableFiltering: true,
                width: '150',
                name: 'Business Unit',
                field: 'buName',
                grouping: { groupPriority: 1 },
                sort: {
                    direction: uiGridConstants.ASC,
                    priority: 0,
                },
                headerTooltip: 'Business Unit'
            },
            {
                enableFiltering: false,
                width: '100',
                name: 'Role ',
                field: 'role',
                grouping: { groupPriority: 2 },
                sort: {
                    direction: uiGridConstants.ASC,
                    priority: 1,
                },
                headerTooltip: 'Role'
            },
            {
                enableFiltering: false,
                width: '100',
                name: 'User Group ',
                field: 'groupName',
                headerTooltip: 'User Group',
                sort: {
                    direction: uiGridConstants.ASC,
                    priority: 2,
                },
            },
             {
                enableFiltering: true,
                width: '150',
                name: 'User',
                field: 'username',
                headerTooltip: 'User',
                sort: {
                     direction: uiGridConstants.ASC,
                     priority: 3,
                 },
            },
            {
                enableFiltering: true,
                width: '100',
                name: 'SIP Account',
                field: 'sipAccount',
                headerTooltip: 'SIP Account'
            },
            {
                enableFiltering: false,
                width: '150',
                name: 'Created Date',
                field: 'createdDate',
                headerTooltip: 'Created Date',
                cellClass: 'table-time',
                cellTemplate: "<div>{{row.entity.createdDate| date:'MM/dd/yyyy'}}</div>"
            }, {
                enableFiltering: false,
                width: '150',
                name: 'Updated Date',
                field: 'updatedDate',
                headerTooltip: 'Updated Date',
                cellClass: 'table-time',
                cellTemplate: "<div>{{row.entity.updatedDate| date:'MM/dd/yyyy'}}</div>"
            }
        ],
        data: [],
        onRegisterApi: function (gridApi) {
            $scope.grid1Api = gridApi;
        }
    };

};
    app.controller('userReportCtrl', userReportCtrl);

}());