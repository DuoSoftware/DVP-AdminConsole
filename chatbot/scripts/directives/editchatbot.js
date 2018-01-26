/**
 * Created by lakmini on 26/01/2018.
 */
mainApp.directive("editachatbot", function ($filter, $uibModal, chatbotService) {

    return {
        restrict: "EAA",
        scope: {
            botname: "=",
            botDesc: "=",
            'updatebot': '&',
            'reloadpage': '&'
        },

        templateUrl: 'chatbot/views/partials/editbotdetails.html',
        link: function (scope) {

            console.log(scope.botname);

        }
    }
})