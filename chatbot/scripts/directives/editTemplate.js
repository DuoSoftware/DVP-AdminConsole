/**
 * Created by Shehan on 26/1/2018.
 */
mainApp.directive("edittemplate", function ($filter,$uibModal,appBackendService) {

    return {
        restrict: "EAA",
        scope: {
            template: "=",
            templateList: "=",
            'updateApplication': '&',
            'reloadpage':'&'
        },

        templateUrl: 'chatbot/views/partials/editTemplate.html',

        link: function (scope) {

            scope.showAlert = function (title,content,type) {

                new PNotify({
                    title: title,
                    text: content,
                    type: type,
                    styling: 'bootstrap3'
                });
            };

        }

    }
});