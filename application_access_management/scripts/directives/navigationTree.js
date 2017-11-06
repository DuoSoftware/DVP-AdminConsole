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
            consoleName: '@?'
        },

        templateUrl: 'application_access_management/view/template/navigationTree.html',


        link: function (scope, element, attributes) {

            scope.vm = {};
            scope.vm.expandAll = expandAll;

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
                    if (items&&items.length > 0 && items[0].menuAction) {
                        var menuItems = $filter('filter')(items[0].menuAction, {scope: resource.scopeName},true);
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



            /*scope.vm.expandAll(scope.vm.data);*/

            function newItem(id, name) {
                return {
                    id: id,
                    name: name,
                    children: [],
                    isExpanded: false,
                    isSelected: false
                };
            }

            function addChild(parent, id, name) {
                var child = newItem(id, name);
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

            scope.updateNavigation = function (navigationData) {
                try {
                    var editedMenus = {};
                    editedMenus = {
                        "menuItem": navigationData.name,//"navigationName": "ARDS_CONFIGURATION",
                        "menuAction": []
                    };
                    if (navigationData.isSelected) {
                        angular.forEach(navigationData.children, function (menu) {
                            /*var data = {
                             "scope": menu.id,//"scopeName": "requestmeta",
                             "read": (menu.children["0"])? menu.children["0"].isSelected: false,
                             "write": (menu.children["1"])?menu.children["1"].isSelected: false,
                             "delete": (menu.children["2"])?menu.children["2"].isSelected: false
                             };*/

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
                                if(response.CustomMessage)
                                {
                                    scope.showError("Error",  response.CustomMessage);
                                }
                                else {
                                    scope.showError("Error",  navigationData.name + " Failed To Update.");
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
                                if(response.CustomMessage)
                                {
                                    scope.showError("Error", response.CustomMessage);
                                }
                                else
                                {
                                    scope.showError("Error", navigationData.name + " Fail To Update.");
                                }

                            }

                        }, function (error) {
                            scope.showError("Error"," Failed to Remove Permissions[" + navigationData.name + "]");
                        });
                    }
                }
                catch (ex) {
                    scope.showError("Error", "Failed to Add Permissions[" + navigationData.name + "]");
                    console.error(ex);
                }
            };

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
