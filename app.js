/**
 * Created by Veery Team on 5/27/2016.
 */


var mainApp = angular.module('veeryConsoleApp', ['ngAnimate', 'ngMessages', 'ui.bootstrap',
    'ui.router', 'ui.checkbox', 'angular-flot',
    'resourceProductivityServiceModule', 'ngTagsInput', 'authServiceModule', 'jlareau.pnotify',
    'easypiechart', 'mgcrea.ngStrap', 'angular.filter', 'fileServiceModule', 'angularFileUpload', 'download',
    'ngMessages', 'ngAudio', 'bw.paging', 'ngDragDrop', 'ui.knob', 'ui-rangeSlider',
    'AngularBootstrapTree',
    'jkuri.slimscroll',
    'base64',
    'dndLists',
    'angular-jwt',
    'angular-sly',
    'LocalStorageModule',
    'ngSanitize',
    'ngCsv',
    'com.2fdevs.videogular',
    'com.2fdevs.videogular.plugins.controls',
    'com.2fdevs.videogular.plugins.overlayplay',
    'com.2fdevs.videogular.plugins.poster', 'ui.bootstrap.datetimepicker', 'angularBootstrapNavTree', 'ui.bootstrap.accordion', 'yaru22.angular-timeago',
    'ui.bootstrap.pagination',
    'ui.grid', 'ui.grid.grouping', 'ui.grid.importer',
    'mgcrea.ngStrap',
    'btford.socket-io',
    'veeryNotificationMod', 'stripe-payment-tools',
    'datatables',
    'satellizer',
    'checklist-model',
    'vcRecaptcha',
    'angucomplete-alt',
    'angular-cron-jobs',
    'jsplumb',
    'ui.slimscroll',
    'ngImgCrop',
    'ngNumberPicker',
    'ui.calendar',
    'webcam',
    "chart.js",
    'schemaForm',
    'angular-timezone-selector',
    'ds.objectDiff', 'htmlToPdfSave',
    'ui.grid.selection'
]);


mainApp.constant('moment', moment);
mainApp.run(['$anchorScroll', function ($anchorScroll) {
    $anchorScroll.yOffset = 50;   // always scroll by 50 extra pixels
}]);
//resourceservice.app.veery.cloud
var baseUrls = {
    'monitorrestapi': 'http://monitorrestapi.app.veery.cloud/DVP/API/1.0.0.0/MonitorRestAPI/',
    'UserServiceBaseUrl': 'http://userservice.app.veery.cloud/DVP/API/1.0.0.0/',
    //'UserServiceBaseUrl': 'http://192.168.0.132:3637/DVP/API/1.0.0.0/',
    'authServiceBaseUrl': 'http://userservice.app.veery.cloud/oauth/',
    'authProviderUrl': 'http://userservice.app.veery.cloud/',
    'resourceServiceBaseUrl': 'http://resourceservice.app.veery.cloud/DVP/API/1.0.0.0/ResourceManager/',
    'productivityServiceBaseUrl': 'http://productivityservice.app.veery.cloud/DVP/API/1.0.0.0/ResourceManager/',
    'ardsmonitoringBaseUrl': 'http://ardsmonitoring.app.veery.cloud/DVP/API/1.0.0.0/ARDS/',
    'fileServiceUrl': 'http://fileservice.app.veery.cloud/DVP/API/1.0.0.0/FileService/',
    'fileServiceInternalUrl': 'http://fileservice.app.veery.cloud/DVP/API/1.0.0.0/InternalFileService/',
    'clusterconfigUrl': 'http://clusterconfig.app.veery.cloud/DVP/API/1.0.0.0/CloudConfiguration/',
    'conferenceUrl': 'http://conference.app.veery.cloud/DVP/API/1.0.0.0/',
    'sipUserendpoint': 'http://sipuserendpointservice.app.veery.cloud/DVP/API/1.0.0.0/SipUser/',
    'pbxUrl': 'http://pbxservice.app.veery.cloud/DVP/API/1.0.0.0/PBXService/',
    'ticketUrl': 'http://liteticket.app.veery.cloud/DVP/API/1.0.0.0/',//http://liteticket.app.veery.cloud/DVP/API/1.0.0.0/',
    'dashBordUrl': 'http://dashboardservice.app.veery.cloud//',
    'autoattendantUrl': 'http://autoattendant.app.veery.cloud/DVP/API/1.0.0.0/',
    'TrunkServiceURL': 'http://phonenumbertrunkservice.app.veery.cloud/DVP/API/1.0.0.0/',
    'socialConnectorUrl': 'http://localhost:4647/DVP/API/1.0.0.0/Social/', //104.236.197.119
    'notification': 'http://notificationservice.app.veery.cloud/',
    'cdrProcessor': 'http://cdrprocessor.app.veery.cloud/DVP/API/1.0.0.0/CallCDR/',
    'scheduleWorker': 'http://scheduleworker.app.veery.cloud/DVP/API/1.0.0.0/',
    'qaModule': 'http://qamodule.app.veery.cloud/DVP/API/1.0.0.0/QAModule/',
    'limitHandlerUrl': 'http://limithandler.app.veery.cloud/DVP/API/1.0.0.0/',
    'templatesUrl': 'http://templates.app.veery.cloud/DVP/API/1.0.0.0/',
    'ardsLiteServiceUrl': 'http://ardsliteservice.app.veery.cloud/DVP/API/1.0.0.0/',
    'ruleServiceUrl': 'http://ruleservice.app.veery.cloud/DVP/API/1.0.0.0/',
    'appregistryServiceUrl': 'http://appregistry.app.veery.cloud/DVP/API/1.0.0.0/',
    'queuemusicServiceUrl': 'http://queuemusic.app.veery.cloud/DVP/API/1.0.0.0/',
    'voxboneApiUrl': 'http://voxboneapi.app1.veery.cloud/DVP/API/1.0.0.0/voxbone/',//voxboneapi.app1.veery.cloud
    'eventserviceUrl': 'http://eventservice.app.veery.cloud/DVP/API/1.0.0.0/',//eventservice.app.veery.cloud
    'walletUrl': 'http://localhost:3333/DVP/API/1.0.0.0/PaymentManager/',//104.236.197.119
    'cSatUrl': 'http://csatservice.app.veery.cloud/DVP/API/1.0/',  //csatservice.app.veery.cloud
    'campaignmanagerUrl': 'http://campaignmanager.app.veery.cloud/DVP/API/1.0.0.0/CampaignManager/', //campaignmanager.app.veery.cloud
    'softPhoneContactUrl': 'http://contacts.app.veery.cloud/DVP/API/1.0.0.0/ContactManager/',
    'dialerAPIUrl': 'http://dialerapi.app.veery.cloud/DVP/DialerAPI/'
};

mainApp.constant('baseUrls', baseUrls);
mainApp.constant('turnServers', [{url: "stun:stun.l.google.com:19302"}, {url: "stun:stun.counterpath.net:3478"}, {url: "stun:numb.viagenie.ca:3478"}]);

var applicationConfig = {
    'captchaEnable': false
};
mainApp.constant('applicationConfig', applicationConfig);


mainApp.config(["$httpProvider", "$stateProvider", "$urlRouterProvider", "$authProvider", "vcRecaptchaServiceProvider",
    function ($httpProvider, $stateProvider, $urlRouterProvider, $authProvider, vcRecaptchaServiceProvider) {

        var authProviderUrl = 'http://userservice.app.veery.cloud/auth/';
        //var authProviderUrl = 'http://192.168.0.132:3637/auth/';
        vcRecaptchaServiceProvider.setSiteKey('6LezaAsUAAAAAMbVGpjJPNm86i__8a38YO1rtXEI');

        //http://userservice.app.veery.cloud/
        //var authProviderUrl = 'http:192.168.1.16:3637/';
        $urlRouterProvider.otherwise('/login');

        /////////////////////////////////////////////////////////


        $authProvider.loginUrl = authProviderUrl + 'login';
        $authProvider.signupUrl = authProviderUrl + 'signup';


        $authProvider.facebook({
            url: authProviderUrl + 'facebook',
            clientId: '1237176756312189'
            //responseType: 'token'
        });

        $authProvider.google({
            url: authProviderUrl + 'google',
            clientId: '260058487091-ko7gcp33dijq6e3b8omgbg1f1nfh2nsk.apps.googleusercontent.com'
        });

        $authProvider.github({
            url: authProviderUrl + 'github',
            clientId: 'f725eae279e6727c68c7'
        });

        $authProvider.linkedin({
            clientId: 'LinkedIn Client ID'
        });

        $authProvider.instagram({
            clientId: 'Instagram Client ID'
        });

        $authProvider.yahoo({
            clientId: 'Yahoo Client ID / Consumer Key'
        });

        $authProvider.live({
            clientId: 'Microsoft Client ID'
        });

        $authProvider.twitch({
            clientId: 'Twitch Client ID'
        });

        $authProvider.bitbucket({
            clientId: 'Bitbucket Client ID'
        });

        $authProvider.spotify({
            clientId: 'Spotify Client ID'
        });

        // No additional setup required for Twitter

        $authProvider.oauth2({
            name: 'foursquare',
            url: '/auth/foursquare',
            clientId: 'Foursquare Client ID',
            redirectUri: window.location.origin,
            authorizationEndpoint: 'https://foursquare.com/oauth2/authenticate',
        });

        ///////////////////////////////////////////////////////////////////////////////
        $stateProvider.state("console", {
            url: "/console",
            templateUrl: "views/main-home.html",
            data: {
                requireLogin: true,
            }
        }).state('console.dashboard', {
            url: "/dashboard",
            templateUrl: "views/dashboard/dashboardContactCenter.html",
            data: {
                requireLogin: true,
                navigation: "DASHBOARD"

            }
        }).state('console.facebook', {
            url: "/social/facebook",
            templateUrl: "socialConnectors/views/socialFbConnector.html",
            controller: "socialFbConnectorController",
            data: {
                requireLogin: true,
                navigation: "FACEBOOK"
            }
        }).state('console.twitter', {
            url: "/social/twitter",
            templateUrl: "socialConnectors/views/socialTwitterConnector.html",
            controller: "socialTwitterConnectorController",
            data: {
                requireLogin: true,
                navigation: "TWITTER"
            }
        }).state('console.email', {
            url: "/social/email",
            templateUrl: "socialConnectors/views/emailConnector.html",
            controller: "emailConnectorController",
            data: {
                requireLogin: true,
                navigation: "TWITTER"
            }
        }).state('console.productivity', {
            url: "/productivity",
            templateUrl: "agent_productivity/view/agentProductivity.html",
            data: {
                requireLogin: true,
                navigation: "AGENT_PRODUCTIVITY"
            }
        }).state('console.filegallery', {
            url: "/filegallery",
            templateUrl: "file_gallery/view/fileList.html",
            controller: "FileListController",
            data: {
                requireLogin: true,
                navigation: "FILE_GALLERY"
            }
        }).state('console.fileupload', {
            url: "/fileupload",
            templateUrl: "file_gallery/view/fileAdd.html",
            controller: "FileEditController",
            data: {
                requireLogin: true,
                navigation: "FILE_UPLOAD"
            }
        }).state('console.attributes', {
            url: "/attributes",
            templateUrl: "attribute_application/partials/attributeList.html",
            controller: "attributeListController",
            data: {
                requireLogin: true,
                navigation: "ATTRIBUTES"
            }
        }).state('console.resources', {
            url: "/resources",
            templateUrl: "resource_application/partials/resourceList.html",
            controller: "resourceController",
            data: {
                requireLogin: true,
                navigation: "RESOURCES"
            }
        }).state('console.AgentStatus', {
            url: "/AgentStatus",
            templateUrl: "agent_status/view/agentStatusList.html",
            controller: "agentStatusController",
            data: {
                requireLogin: true,
                navigation: "AGENTSTATUSEVENT"
            }
        }).state('console.FormDesign', {
            url: "/FormDesign",
            templateUrl: "dynamicForm/view/formDesign.html",
            controller: "FormBuilderCtrl",
            data: {
                requireLogin: true,
                navigation: "DYNAMICFORM"
            }
        }).state('console.reportMail', {
            url: "/ReportMail",
            templateUrl: "views/reportEmailConfig/reportEmailConfig.html",
            controller: "emailReportCtrl",
            data: {
                requireLogin: true,
                navigation: "CDR"
            }
        }).state('console.auditTrailRep', {
            url: "/AuditTrailReport",
            templateUrl: "views/auditTrail/auditTrailReport.html",
            controller: "auditTrailReportCtrl",
            data: {
                requireLogin: true,
                navigation: "AUDITTRAIL"
            }
        }).state('console.qaRatingFormBuilder', {
            url: "/QAFormBuilder",
            templateUrl: "views/qaRating/questionFormDesigner.html",
            controller: "qaRatingCtrl",
            data: {
                requireLogin: true,
                navigation: "QUALITYASSUARANCE"
            }
        }).state('console.qaSubmission', {
            url: "/QAFormSubmission",
            templateUrl: "views/qaPaperSubmission/qaPaperSubmission.html",
            controller: "qaSubmissionCtrl",
            data: {
                requireLogin: true,
                navigation: "QUALITYASSUARANCE"
            }
        }).state('console.AgentProfileSummary', {
            url: "/AgentProfileSummary",
            templateUrl: "agent_status/view/agentProfileStatus.html",
            controller: "AgentSummaryController",
            data: {
                requireLogin: true,
                navigation: "RESOURCES"
            }
        }).state("console.applicationAccessManager", {
            url: "/applicationAccessManager/:username/:role",
            templateUrl: "application_access_management/view/appAccessManage.html",
            data: {
                requireLogin: true,
                navigation: "USERS"
            }
        }).state('login', {
            url: "/login",
            templateUrl: "auth/login.html",
            data: {
                requireLogin: false,

            }
        }).state('signUp', {
            url: "/signUp",
            templateUrl: "auth/signUp.html",
            data: {
                requireLogin: false
            }
        }).state('ResetPw', {
            url: "/resetPassword",
            templateUrl: "auth/resetPassword.html",
            data: {
                requireLogin: false
            }
        }).state("Reset", {
            url: "/reset/:token",
            templateUrl: "auth/reEnterPassword.html",
            data: {
                requireLogin: false,
            }
        }).state("Activate", {
            url: "/activate/:token",
            templateUrl: "auth/activateAccount.html",
            data: {
                requireLogin: false,
            }
        }).state('pricing', {
            url: "/pricing",
            templateUrl: "auth/pricing.html",
            data: {
                requireLogin: false
            }
        }).state('console.pricing', {
            url: "/Packages",
            templateUrl: "auth/pricing.html",
            data: {
                requireLogin: true,
                navigation: "PACKAGE_MANAGER"
            }
        }).state('console.credit', {
            url: "/Credit",
            templateUrl: "auth/Credit/buyCredit.html",
            controller: "creditController",
            data: {
                requireLogin: true,
                navigation: "PACKAGE_MANAGER"
            }
        }).state("console.cdr", {
            url: "/cdr",
            templateUrl: "views/cdr/call-cdr.html",
            data: {
                requireLogin: true,
                navigation: "CDR"

            }
        }).state("console.myNumbers", {
            url: "/myNumbers",
            templateUrl: "views/mynumbers/myNumbers.html",
            controller: "myNumbersCtrl",
            data: {
                requireLogin: true,
                navigation: "MY_NUMBERS"
            }
        }).state("console.sipuser", {
            url: "/sipuser",
            templateUrl: "views/sipuser/sipuser.html",
            controller: "sipUserCtrl",

            data: {
                requireLogin: true,
                navigation: "SIPUSER_CONFIGURATION"
            }

        }).state("console.userprofile", {
            url: "/userprofile/:username",
            templateUrl: "views/userprofile/userprofile.html",
            data: {
                requireLogin: true,
                navigation: "PROFILE"

            }
        }).state("console.users", {
            url: "/users",
            templateUrl: "views/user/userList.html",
            controller: "userListCtrl",
            data: {
                requireLogin: true,
                navigation: "USERS"
            }
        }).state("console.pbxuser", {
            url: "/pbxuser",
            templateUrl: "views/pbxuser/pbxuser.html",
            controller: "pbxCtrl",
            data: {
                requireLogin: true,
                navigation: "PABX_USER"
            }
        }).state("console.pbxadmin", {
            url: "/pbxadmin",
            templateUrl: "views/pabxAdmin/pabxCompanyConfig.html",
            controller: "pbxAdminCtrl",
            data: {
                requireLogin: true,
                navigation: "PABX_ADMIN"
            }
        }).state("console.autoattendance", {
            url: "/autoattendance",
            templateUrl: "views/auto-attendance/autoAttendanceList.html",
            controller: "autoattendancelistcontroller",
            data: {
                requireLogin: true,
                navigation: "AUTOATTENDANCE"
            }
        }).state('console.newautoattendance', {
            url: "/autoattendance/new",
            templateUrl: "views/auto-attendance/newAutoAttendance.html",
            controller: "newautoattendancecontroller",
            data: {
                requireLogin: true,
                navigation: "AUTOATTENDANCE"
            }
        }).state('console.editautoattendance', {
            url: "/autoattendance/edit",
            templateUrl: "views/auto-attendance/editAutoAttendance.html",
            controller: "editautoattendancecontroller",
            params: {
                aa: null
            },
            data: {
                requireLogin: true,
                navigation: "AUTOATTENDANCE"
            }
        }).state("console.ringGroup", {
            url: "/ringGroup",
            templateUrl: "views/ringGroup/ringGroup.html",
            controller: "ringGroupCtrl",
            data: {
                requireLogin: true,
                navigation: "RING_GROUP_CONFIGURATION"
            }
        }).state('console.callmonitor', {
            url: "/call-monitor",
            templateUrl: "views/call-monitor/callMonitor.html",
            controller: "callmonitorcntrl",
            data: {
                requireLogin: true,
                navigation: "CALL_MONITOR"
            }
        }).state('console.abandonCdr', {
            url: "/abandonCallReport",
            templateUrl: "views/cdr/abandonCallReport.html",
            controller: "abandonCallCdrCtrl",
            data: {
                requireLogin: true,
                navigation: "CDR"
            }
        }).state('console.realtime-queued', {
            url: "/realtime-queued",
            templateUrl: "views/real-time/queued.html",
            data: {
                requireLogin: true,
                navigation: "DASHBOARD"
            }
        }).state('console.phone', {
            url: "/call-phone",
            templateUrl: "views/call-monitor/phoneWidget.html",
            data: {
                requireLogin: true,
                navigation: "CALL_MONITOR"
            }
        }).state('console.rule', {
            url: "/rule/rules",
            templateUrl: "views/rule/ruleList.html",
            controller: "rulelistcontroller",
            data: {
                requireLogin: true,
                navigation: "RULES"
            }
        }).state('console.newrule', {
            url: "/rule/new-rule",
            templateUrl: "views/rule/newRule.html",
            controller: "newrulecontroller",
            data: {
                requireLogin: true,
                navigation: "RULES"
            }
        }).state('console.editrule', {
            url: "/rule/edit-rule?id",
            params: {id: null},
            templateUrl: "views/rule/newRule.html",
            controller: "newrulecontroller",
            data: {
                requireLogin: true,
                navigation: "RULES"
            }
        }).state('console.application', {
            url: "/applications",
            templateUrl: "views/app-registry/applications.html",
            controller: "applicationController",
            data: {
                requireLogin: true,
                navigation: "APPLICATIONS"
            }
        }).state('console.holdmusic', {
            url: "/holdmusic",
            templateUrl: "views/hold-music/holdmusic.html",
            controller: "holdMusicController",
            data: {
                requireLogin: true,
                navigation: "HOLD_MUSIC"
            }
        }).state('console.limits', {
            url: "/limits",
            templateUrl: "views/limit/Limits.html",
            controller: "limitController",
            data: {
                requireLogin: true,
                navigation: "LimitHandler"
            }
        }).state('console.conference', {
            url: "/conference",
            templateUrl: "conference_app/views/conferenceList.html",
            controller: "conferenceController",
            data: {
                requireLogin: true,
                navigation: "CONFERENCE"
            }
        })/*.state('console.conferencemonitor', {
         url: "/conference",
         templateUrl: "conference_app/views/conferenceMonitor.html",
         controller: "conferenceMonitorController",
         data: {
         requireLogin: true,
         navigation: "CONFERENCE"
         }
         })*/.state('console.queuesummary', {
            url: "/queuesummary",
            templateUrl: "views/queue-summary/queue-summary.html",
            controller: "queueSummaryController",
            data: {
                requireLogin: true,
                navigation: "CDR"
            }
        }).state('console.agentsummary', {
            url: "/agentsummary",
            templateUrl: "views/agent-productivity-summary/agentSummary.html",
            controller: "agentSummaryController",
            data: {
                requireLogin: true,
                navigation: "CDR"
            }
        }).state('console.AgentTblList', {
            url: "/AgentTblList",
            templateUrl: "agent_status/view/agentStatusTblList.html",
            controller: "agentStatusController",
            data: {
                requireLogin: true,
                navigation: "CDR"
            }
        }).state('console.extension', {
            url: "/extensions",
            templateUrl: "views/extension/extension.html",
            controller: "extensionController",
            data: {
                requireLogin: true,
                navigation: "EXTENSION"
            }
        }).state('console.ardsconfig', {
            url: "/ardsconfig",
            templateUrl: "views/ards-config/ardsconfig.html",
            controller: "ardsController",

            data: {
                requireLogin: true,
                navigation: "ARDS_CONFIGURATION"
            }

        }).state('console.myprofile', {
            url: "/myprofile",
            templateUrl: "views/myUserprofile/myUserprofile.html",

            data: {
                requireLogin: true,
                navigation: "MYPROFILE"
            }

        })
            .state('console.did', {
                url: "/didnumbers",
                templateUrl: "views/did/did.html",
                controller: "didController",
                data: {
                    requireLogin: true,
                    navigation: "DID"
                }
            })
            .state('console.scheduler', {
                url: "/schedules",
                templateUrl: "views/scheduler/schedule.html",
                controller: "scheduleController",
                data: {
                    requireLogin: true,
                    navigation: "SCHEDULER"
                }
            }).state('console.companyconfig', {
            url: "/companyconfiguration",
            templateUrl: "views/companyConfig/companyConfigMain.html",
            controller: "companyConfigController",
            data: {
                requireLogin: true,
                navigation: "COMPANY_CONFIGURATION"
            }
        }).state('console.translations', {
            url: "/translation",
            templateUrl: "views/translation/translations.html",
            controller: "translationController",
            data: {
                requireLogin: true,
                navigation: "TRANSLATIONS"
            }
        }).state('console.trigger', {
            url: "/trigger",
            templateUrl: "views/ticket-trigger/trigger.html",
            controller: "triggerController",
            data: {
                requireLogin: true,
                navigation: "TICKET_TRIGGER"
            }
        }).state("console.triggerConfiguration", {
            url: "/triggerConfiguration/:triggerId/:title",
            templateUrl: "views/ticket-trigger/configTrigger.html",
            controller: "triggerConfigController",
            data: {
                requireLogin: true,
                navigation: "TICKET_TRIGGER"
            }
        }).state('console.templatecreater', {
            url: "/templatecreater",
            templateUrl: "views/template-generator/templateview.html",
            controller: "templateController",
            data: {
                requireLogin: true,
                navigation: "TEMPLATEMAKER"
            }
        }).state('console.tagmanager', {
            url: "/tagmanager",
            templateUrl: "views/tag-manager/tagView.html",
            controller: "tagcontroller",
            data: {
                requireLogin: true,
                navigation: "TAGMANAGER"
            }
        }).state('console.callsummary', {
            url: "/callsummary",
            templateUrl: "views/cdr/callSummaryReport.html",
            controller: "callSummaryCtrl",
            data: {
                requireLogin: true,
                navigation: "CDR"
            }

        }).state('console.queueHourlySummary', {
            url: "/queueHourlySummary",
            templateUrl: "views/cdr/queueSummaryHourly.html",
            controller: "queueSummaryHourlyCtrl",
            data: {
                requireLogin: true,
                navigation: "CDR"
            }
        }).state('console.sla', {
            url: "/sla",
            templateUrl: "views/ticket-sla/sla.html",
            controller: "slaController",
            data: {
                requireLogin: true,
                navigation: "TICKET_SLA"
            }
        }).state("console.slaConfiguration", {
            url: "/slaConfiguration/:slaId/:title",
            templateUrl: "views/ticket-sla/configSla.html",
            controller: "slaConfigController",
            data: {
                requireLogin: true,
                navigation: "TICKET_SLA"
            }
        }).state("console.agentstatusevents", {
            url: "/agent_status_list",
            templateUrl: "views/cdr/agentStatusEventList.html",
            controller: "agentStatusListCtrl",
            data: {
                requireLogin: true,
                navigation: "CDR"
            }
        }).state("console.agentTicketDashboard", {
            url: "/agentTicketDashboard",
            templateUrl: "views/dashboard/dashboardTicket.html",
            controller: "agentStatusListCtrl",
            data: {
                requireLogin: true,
                navigation: "CDR"
            }
        }).state("console.ticketSummary", {
            url: "/ticketSummary",
            templateUrl: "views/ticket-reports/ticketSummary.html",
            controller: "ticketSummaryCtrl",
            data: {
                requireLogin: true,
                navigation: "CDR"
            }
        }).state("console.ticketDetailReport", {
            url: "/ticketDetailReport",
            templateUrl: "views/ticket-reports/ticketDetailReport.html",
            controller: "ticketDetailReportCtrl",
            data: {
                requireLogin: true,
                navigation: "CDR"
            }
        }).state("console.timeSheet", {
            url: "/timeSheet",
            templateUrl: "views/timeSheet/time-sheet.html",
            controller: "timeSheetCtrl",
            data: {
                requireLogin: true
            }
        }).state("console.createFilter", {
            url: "/createFilter",
            templateUrl: "views/ticket-trigger/create-filter.html",
            data: {
                requireLogin: true
            }
        }).state("console.caseConfiguration", {
            url: "/caseConfiguration",
            templateUrl: "views/ticket-case/caseConfig.html",
            controller: "caseConfigController",
            data: {
                requireLogin: true,
                navigation: "TICKET_SLA"
            }
        }).state("console.case", {
            url: "/case",
            templateUrl: "views/ticket-case/case.html",
            controller: "caseController",
            data: {
                requireLogin: true,
                navigation: "TICKET_SLA"
            }
        }).state("console.configCase", {
            url: "/configCase/:caseInfo/:title",
            templateUrl: "views/ticket-case/configCase.html",
            controller: "configCaseController",
            data: {
                requireLogin: true,
                navigation: "TICKET_SLA"
            }
        }).state('console.queueSlaBreakDown', {
            url: "/slabreakdown",
            templateUrl: "views/queue-slabreakdown/queue-slabreakdown.html",
            data: {
                requireLogin: true,
                navigation: "SLA_BREAKDOWN"
            }
        }).state('console.fileslotmaker', {
            url: "/fileslot",
            templateUrl: "views/fileSlotMaker/fileSlotMaker.html",
            controller: "fileSlotController",
            data: {
                requireLogin: true,
                navigation: "TICKET"
            }
        }).state('console.billingHistory', {
            url: "/billingHistory",
            templateUrl: "views/billing-history/billingHistory.html",
            controller: "billingHistoryController",

            data: {
                requireLogin: true,
                navigation: "PACKAGE_MANAGER"
            }
        }).state('console.ticketFlow', {
            url: "/ticketFlow",
            templateUrl: "views/flow/flowTest.html",
            data: {
                requireLogin: true,
                navigation: "SLA_BREAKDOWN"
            }
        }).state('console.ivrnodecount', {
            url: "/ivrNode",
            templateUrl: "ivr_node_count/view/ivrNodeCount.html",
            controller: "ivrNodeCountController",
            data: {
                requireLogin: true,
                navigation: "SLA_BREAKDOWN"
            }
        }).state('console.customersatisfaction', {
            url: "/customersatisfaction",
            templateUrl: "customerSatisfactions/view/cSat.html",
            controller: "cSatController",
            data: {
                requireLogin: true,
                navigation: "CSATREPORT"
            }
        }).state('console.acwdetails', {
            url: "/acwdetails",
            templateUrl: "views/acw-details/acwDetails.html",
            controller: "acwDetailController",
            data: {
                requireLogin: true,
                navigation: "ACWREPORT"
            }
        }).state('console.qaratingreporting', {
            url: "/qaratingreport",
            templateUrl: "views/qaRatingReport/qaRatingReport.html",
            controller: "qaRatingReportCtrl",
            data: {
                requireLogin: true,
                navigation: "QUALITYASSUARANCE"
            }
        }).state('console.missedcallreport', {
            url: "/missedcallreport",
            templateUrl: "views/agent-missedcall-details/missedCallDetails.html",
            controller: "agentMissedCallDetailController",
            data: {
                requireLogin: true,
                navigation: "MISSEDCALLREPORT"
            }
        }).state('console.campaign', {
            url: "/campaign",
            templateUrl: "campaignManager/campaignList.html",
            controller: "campaignController",
            data: {
                requireLogin: true,
                navigation: "CAMPAIGNMANAGER"
            }
        }).state('console.campaignmonitor', {
            url: "/campaignmonitor",
            templateUrl: "campaignManager/campaignMonitor.html",
            controller: "campaignMonitorController",
            data: {
                requireLogin: true,
                navigation: "CAMPAIGNMANAGER"
            }
        }).state('console.campaignnumberupload', {
            url: "/campaignnumberupload",
            templateUrl: "views/campaign-number-upload/numberUpload.html",
            controller: "numberUploadController",
            data: {
                requireLogin: true,
                navigation: "CAMPAIGNNUMBERS"
            }
        }).state('console.dncnumbermanage', {
            url: "/dncnumbermanage",
            templateUrl: "views/campaign-number-upload/dncList.html",
            controller: "numberDncController",
            data: {
                requireLogin: true,
                navigation: "CAMPAIGNNUMBERS"
            }
        }).state('console.contact-book', {
            url: "/contact-book",
            templateUrl: "views/softPhone/soft-phone-option.html",
            controller: "softPhoneCtrl",
            data: {
                requireLogin: true,
                navigation: "CAMPAIGNNUMBERS"
            }
        });
        //Todo shoud be change navigation
    }]);


mainApp.filter('durationFilter', function () {
    return function (value) {
        var durationObj = moment.duration(value);
        return durationObj._data.days + 'd::' + durationObj._data.hours + 'h::' + durationObj._data.minutes + 'm::' + durationObj._data.seconds + 's';

    }
});


//main console directive
//menu Collapse

// TODO: This is some kind of easy fix, maybe we can improve this
var setContentHeight = function () {
    // reset height
    $RIGHT_COL.css('min-height', $(window).height());


    var bodyHeight = $BODY.outerHeight(),
        footerHeight = $BODY.hasClass('footer_fixed') ? 0 : $FOOTER.height(),
        leftColHeight = $LEFT_COL.eq(1).height() + $SIDEBAR_FOOTER.height(),
        contentHeight = bodyHeight < leftColHeight ? leftColHeight : bodyHeight;
    // normalize content
    contentHeight -= $NAV_MENU.height() + footerHeight;
    $RIGHT_COL.css('min-height', contentHeight);
};


mainApp.directive('datepicker', function () {
    return {
        restrict: "A",
        require: "ngModel",
        link: function (scope, elem, attrs, ngModelCtrl) {
            var updateModel = function (dateText) {
                scope.$apply(function () {
                    ngModelCtrl.$setViewValue(dateText);
                });
            };
            var options = {
                dateFormat: "yy-mm-dd",
                onSelect: function (dateText) {
                    updateModel(dateText);
                }
            };
            elem.datepicker(options);
        }
    }
});


mainApp.constant('config', {
    Auth_API: 'http://userservice.162.243.230.46.xip.io/',
    appVersion: 1.0,
    client_Id_secret: 'ae849240-2c6d-11e6-b274-a9eec7dab26b:6145813102144258048'
});


mainApp.run(function ($rootScope, loginService, $location, $auth, $state) {

    $rootScope.$on('$stateChangeStart', function (event, toState, toParams) {
        var requireLogin = toState.data.requireLogin;

        var navigation = toState.data.navigation;


        if (navigation) {
            if (!loginService.checkNavigation(navigation)) {
                event.preventDefault();
                return;
            }
        }

        if (requireLogin) {
            if (!$auth.isAuthenticated()) {
                event.preventDefault();
                //$state.go("login");
            }
            // get me a login modal!
        }

    });

});

