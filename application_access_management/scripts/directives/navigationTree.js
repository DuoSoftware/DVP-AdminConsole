/**
 * Created by Rajinda on 6/13/2016.
 */

mainApp.directive("navigationtree", function ($filter, appAccessManageService) {

    return {
        restrict: "EA",
        scope: {
            navigation: '=',
            selectedConsole: '=',
            userName: '@?',
            consoleName: '@?',
            treeType: '@?',
            ownerAppMeta: '=',
            updateAction: '@?'
        },

        templateUrl: 'application_access_management/view/template/navigationTree.html',


        link: function (scope, element, attributes) {

            scope.vm = {};
            scope.vm.expandAll = expandAll;

            if(scope.treeType === undefined || scope.treeType == "Navigation"){
                scope.vm.data = newItem(0, scope.navigation.navigationName);

                var items = $filter('filter')(scope.selectedConsole.consoleNavigation.saveItem, {menuItem: scope.navigation.navigationName})

                /*Generate tree*/
                var id = 1;
                var rootSelected = true;
                angular.forEach(scope.navigation.resources, function (resource) {
                    var item1 = addChild(scope.vm.data, resource.scopeName, resource.feature);
                    var optionSelected = true;
                    angular.forEach(resource.actions, function (action) {
                        id++;
                        var child = addChild(item1, id, action);
                        if (items && items.length > 0 && items[0].menuAction) {
                            var menuItems = $filter('filter')(items[0].menuAction, {scope: resource.scopeName}, true);
                            if (menuItems[0])
                                child.isSelected = menuItems[0][action];
                        }
                        optionSelected = optionSelected && child.isSelected;
                    });

                    item1.isSelected = optionSelected;
                    rootSelected = rootSelected && item1.isSelected;
                    scope.vm.data.isSelected = rootSelected;
                    /*var read, write, del;
                    if (resource.actions.indexOf("read") > -1) {
                    id++;
                    read = addChild(item1, id, "Read");
                    }
                    if (resource.actions.indexOf("write") > -1) {
                    id++;
                    write = addChild(item1, id, "Write");
                    }
                    if (resource.actions.indexOf("delete") > -1) {
                    id++;
                    del = addChild(item1, id, "Delete");
                    }
                    if (items)
                    if (items.length != 0) {
                    var optionSelected = false;
                    angular.forEach(items[0].menuAction, function (action) {
                    if (read) {
                    read.isSelected = action.read;
                    optionSelected = action.read;
                    }
                    if (write) {
                    write.isSelected = action.write;
                    optionSelected = action.write && (read && read.isSelected);
                    }
                    if (del) {
                    del.isSelected = action.delete;
                    optionSelected = action.delete && (write && write.isSelected) && (read && read.isSelected);
                    }
                    //optionSelected = action.read ? true : (action.write ? true : action.delete)
                    });
                    if (optionSelected) {
                    item1.isSelected = true;
                    scope.vm.data.isSelected = true;
                    }
                    }*/
                });
            }else if(scope.treeType == "SharedResource"){

                scope.$watch('selectedConsole', function(selectedConsole) {
                    scope.vm.data = {};
                    scope.vm.data = newItem(0, scope.selectedConsole.consoleName);

                    /*Generate tree*/
                    var id = 1;
                    var rootSelected = true;
                    var ids = {};

                    try{
                        var resourceSharedWithUser = scope.ownerAppMeta.selectedUserMeta.sharedResources;
                    }catch(err){
                        var resourceSharedWithUser = {};
                    }
                     
                    if(scope.selectedConsole.consoleName in resourceSharedWithUser){
                        resourceSharedWithUser[scope.selectedConsole.consoleName].map(function(i){
                            ids[i['compID']] = true;
                        });
                    }

                    angular.forEach(scope.ownerAppMeta.sharedResources[scope.selectedConsole.consoleName], function (resource) {
                        var item1 = addChild(scope.vm.data, scope.selectedConsole.consoleName, resource.compName, resource);
                        var optionSelected = true;
                        
                        item1.isSelected = optionSelected && (resource.compID in ids);
                        rootSelected = rootSelected && item1.isSelected;
                        scope.vm.data.isSelected = rootSelected;
                    });
                  })
            }

            /*scope.vm.expandAll(scope.vm.data);*/

            function newItem(id, name, otherProps) {

                var otherProps = otherProps || {};

                return {
                    id: id,
                    name: name,
                    children: [],
                    isExpanded: false,
                    isSelected: false,
                    otherProps: otherProps
                };
            }

            function addChild(parent, id, name, otherProps) {
                var child = newItem(id, name, otherProps);
                child.parent = parent;
                parent.children.push(child);
                return child;
            }

            function expandAll(root, setting) {
                if (!setting) {
                    setting = !root.isExpanded;
                }
                root.isExpanded = setting;
                root.children.forEach(function (branch) {
                    expandAll(branch, setting);
                });
            }

            /** Kasun_Wijeratne_16_MARCH_2018
             * ------------------------------------------------------------------------------------*/
            // function selectAll(status) {
            // 	if(status){
            // 		angular.forEach(scope.selectedConsole.consoleNavigation, function (branch) {
            // 			branch
            // 		}
            // 	}
            // }
            /**------------------------------------------------------------------------------------
             * Kasun_Wijeratne_16_MARCH_2018 */


            scope.updateNavigation = function (navigationData) {
                try {
                    var editedMenus = {};
                    editedMenus = {
                        "menuItem": navigationData.name,//"navigationName": "ARDS_CONFIGURATION",
                        "menuAction": []
                    };
                    if (navigationData.isSelected) {
                        angular.forEach(navigationData.children, function (menu) {


                            var data = {
                                "scope": menu.id,//"scopeName": "requestmeta",
                                "read": false,
                                "write": false,
                                "delete": false
                            };
                            angular.forEach(menu.children, function (item) {
                                data[item.name.toLowerCase()] = item.isSelected;
                            });

                            editedMenus.menuAction.push(data);
                        });

                        appAccessManageService.AddSelectedNavigationToUser(scope.userName, scope.consoleName, editedMenus).then(function (response) {
                            if (response.IsSuccess) {
                                scope.showAlert("Info", "Info", "ok", navigationData.name + " Successfully Updated.")
                            }
                            else {
                                if (response.CustomMessage) {
                                    scope.showError("Error", response.CustomMessage);
                                }
                                else {
                                    scope.showError("Error", navigationData.name + " Failed To Update.");
                                }

                            }

                        }, function (error) {
                            scope.showError("Error", "Failed to Add Permissions[" + navigationData.name + "]");
                        });
                    }
                    else {
                        appAccessManageService.DeleteSelectedNavigationFrmUser(scope.userName, scope.consoleName, navigationData.name).then(function (response) {
                            if (response.IsSuccess) {
                                scope.showAlert("Info", "Info", "ok", navigationData.name + " Permissions Successfully Remove.")
                            }
                            else {
                                if (response.CustomMessage) {
                                    scope.showError("Error", response.CustomMessage);
                                }
                                else {
                                    scope.showError("Error", navigationData.name + " Fail To Update.");
                                }

                            }

                        }, function (error) {
                            scope.showError("Error", " Failed to Remove Permissions[" + navigationData.name + "]");
                        });
                    }
                }
                catch (ex) {
                    scope.showError("Error", "Failed to Add Permissions[" + navigationData.name + "]");
                    console.error(ex);
                }
            };

            scope.updateSharedResources = function(data){

                //get the user's current shared data and prepare to update...
                appAccessManageService.GetUserAppMeta(scope.userName).then(function (response) {
                    if (response.IsSuccess) {

                        //we start generating the update object when we have the user's current shared data object
                        var userAppMeta = response.Result || {};
                        var UserSharedResources = userAppMeta.sharedResources || {};

                        if (data.isSelected){
                            var sharedResObj = []; //generate update object..

                            angular.forEach(data.children, function (item) {
                                if(item.isSelected){
                                    sharedResObj.push(item.otherProps);
                                }
                            });          

                            //new shared object, replace the template object with new one..
                            //UserSharedResources["DIGIN_CONSOLE"] = []
                            UserSharedResources[data.name] = sharedResObj;

                            //set the user app meta to the new object
                            userAppMeta['sharedResources'] = UserSharedResources;
                        }else{
                            //delete the template from user's shared data..
                            delete UserSharedResources[data.name];
                            userAppMeta['sharedResources'] = UserSharedResources;
                        }

                        //update the user data....
                        appAccessManageService.UpdateUserAppMeta(scope.userName, userAppMeta).then(function (response) {
                            if (response.IsSuccess)
                                scope.showAlert("Info", "Info", "ok", "Shared resources / templates Successfully Updated.")
                            else {
                                if (response.CustomMessage)
                                    scope.showError("Error", response.CustomMessage);
                                else
                                    scope.showError("Error", "Failed To Update shared resources.");
                            }
                        }, function (error) {
                            scope.showError("Error", "Failed To Update shared resources");
                        });

                    } else {
                        if (response.CustomMessage)
                            scope.showError("Error", response.CustomMessage);
                        else
                            scope.showError("Error", "Failed to get user's shared resources.");
                    }
                }, 
                //error getting the user's data....
                function (error) {
                    scope.showError("Error", "Failed to set shared resources!");
                });
            }

            scope.showAlert = function (tittle, label, button, content) {

                new PNotify({
                    title: tittle,
                    text: content,
                    type: 'success',
                    styling: 'bootstrap3'
                });
            };
            scope.showError = function (tittle, content) {

                new PNotify({
                    title: tittle,
                    text: content,
                    type: 'error',
                    styling: 'bootstrap3'
                });
            };
        }

    }
});