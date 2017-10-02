/**
 * Created by Pawan on 9/26/2017.
 */
mainApp.directive("editqsettings", function ($filter,$uibModal,queueSettingsBackendService) {

    return {
        restrict: "EAA",
        scope: {
            setting: "=",
            'reloadpage':'&',
            'reloadrecords':'&'
        },

        templateUrl: 'views/queue-settings-config/partials/editQueueSettings.html',

        link: function (scope) {

            console.log(scope.setting);
            scope.attributeGroups=[];
            scope.NewattributeGroups=[];
            scope.editMode=false;

            scope.attributeGroup;
            scope.editQueueSetting = function () {
                scope.editMode = !scope.editMode;

            }

            scope.showConfirm = function (tittle, label, okbutton, cancelbutton, content, OkCallback, CancelCallBack, okObj) {

                (new PNotify({
                    title: tittle,
                    text: content,
                    icon: 'glyphicon glyphicon-question-sign',
                    hide: false,
                    confirm: {
                        confirm: true
                    },
                    buttons: {
                        closer: false,
                        sticker: false
                    },
                    history: {
                        history: false
                    }
                })).get().on('pnotify.confirm', function () {
                    OkCallback("confirm");
                }).on('pnotify.cancel', function () {

                });

            };
            scope.showAlert = function (title,content,type) {

                new PNotify({
                    title: title,
                    text: content,
                    type: type,
                    styling: 'bootstrap3'
                });
            };

            scope.removeSettingRecord= function (recordID) {


                scope.showConfirm("Delete Queue Setting", "Delete", "ok", "cancel", "Do you want to delete " + recordID, function (obj) {

                    queueSettingsBackendService.deleteSettingRecord(recordID).then(function (response) {

                        if(response.data.IsSuccess)
                        {
                            scope.showAlert("Success","Queue Setting record removed successfully",'success');
                            scope.reloadpage();
                        }
                        else
                        {
                            scope.showAlert("Error","Queue Setting record removing failed",'error');
                            console.log("Error in deleting Queue setting record");
                        }
                    }, function (error) {
                        scope.showAlert("Error","Queue Setting record removing failed",'error');
                        console.log("Exception in deleting ueue setting record"+error);
                    });

                }, function () {

                }, recordID)





            };
            
            scope.UpdateQueueSettings = function () {

                queueSettingsBackendService.UpdateQueueSettings(scope.setting.RecordID,scope.setting).then(function (response) {
                    if(!response.data.IsSuccess)
                    {
                        scope.showAlert("Error","Error in updating Queue Setting : "+scope.setting.RecordID,"error");
                    }
                    else {
                        scope.showAlert("Success","Successfully updated Queue Setting : "+scope.setting.RecordID,"success");
                        scope.reloadrecords();
                        scope.editQueueSetting();
                    }
                },function (error) {
                    scope.showAlert("Error","Error in updating Queue Setting : "+scope.setting.RecordID,"error");
                })
                
            };






        }

    }
});