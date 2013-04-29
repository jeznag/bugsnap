require.config({
    paths: {
        'jquery': 'js/jquery',
        'knockout': 'js/knockout',
        'raphael': 'js/raphael',
        'md5': 'js/md5'
    },
    shim: {
        'js/jquery.validate': ['jquery'],
        'js/jquery.ui': ['jquery']
    }
});
define(['js/jquery', 'js/knockout', 'js/raphael', 'js/jquery.ui', 'js/jquery.validate', 'js/md5'], function ($, ko, Raphael) {

    
    var OptionsPageViewModel = (function () {
        function OptionsPageViewModel(options) {
            this.Parent = options.Parent;
            this.GeminiUrl = ko.observable(localStorage["GeminiUrl"]);
            this.UserName = ko.observable(localStorage["UserName"]);
            var pwd = localStorage["AuthString"];
            pwd = pwd != null ? pwd.substring(0, localStorage["passwordLength"] - 1): '';
            this.Password = ko.observable(pwd);
            this.APIKey = ko.observable(localStorage["APIKey"]);
            this.init();
        }
        OptionsPageViewModel.prototype.init = function () {
            var self = this;
            $("input[type=button], a, button").button();
            $("#method").buttonset();
            $("#password").hide();
            $('input[name=method]').change(
                function() {
                    if($('input[name=method]:checked').val() == 'Password') {
                        $("#password").show();
                        $("#apiKey").hide();
                    }
                    else {
                        $("#password").hide();
                        $("#apiKey").show();
                    }
                    
                }
            );
        };
        OptionsPageViewModel.prototype.test = function () {
            if($("#optionsForm").valid()) {
                var deferred = $.Deferred();
                var xhr = new XMLHttpRequest();
                var self = this;
                xhr.open('GET', this.GeminiUrl() + "/api/users/username/" + this.UserName(), true);
                xhr.setRequestHeader('Accept', "*/*", false);
                if(window.navigator.userAgent.indexOf('Firefox') == -1){
                    xhr.setRequestHeader('Authorization', 'Basic ' + window.btoa(this.UserName() + ':' + this.APIKey()));
                    xhr.setRequestHeader('Content-Type', 'application/json');
                }
                xhr.onreadystatechange = function() {
                    if (xhr.readyState == 4 && xhr.status == 200) {
                        $(".confirmationMessage").stop().hide().text("Successfully connected to Gemini!").fadeIn(400, function() {
                            $(this).delay(1700).fadeOut(400);
                        });
                    } else if (xhr.readyState == 4 && xhr.status != 200) {
                        if(xhr.statusText == 'timeout' || xhr.statusText == "Not Found") {
                            //TODO: Try Gemini4
                            var xhr4 = new XMLHttpRequest();
                            xhr4.open('GET', self.GeminiUrl() + '/api/projects.ashx/projects?format=json&gemini-username-token='
                                + window.btoa(self.UserName()) + '&gemini-api-token=' + window.btoa(self.APIKey()));
                            xhr4.onreadystatechange = function () {
                                if (xhr4.readyState == 4 && xhr4.status == 200) {
                                    //
                                } else if (xhr4.readyState == 4 && xhr4.status != 200) {
                                    $(".confirmationMessage").stop().hide().text("Unable to connect to Gemini at specified URL.").fadeIn(400, function() {
                                        $(this).delay(1700).fadeOut(400);
                                    });
                                }
                            }
                            xhr4.send();
                        }
                        if(xhr.statusText == "Forbidden") {
                            $(".confirmationMessage").stop().hide().text("Unable to login using supplied credentials.").fadeIn(400, function() {
                                $(this).delay(1700).fadeOut(400);
                            });
                        }
                    }
                };
                xhr.send();
                return deferred.promise();
            }
        };
        OptionsPageViewModel.prototype.save = function () {
            if($("#optionsForm").valid()) {
                if($('input[name=method]:checked').val() != 'Password') {
                    localStorage["AuthMethod"] = "apikey";
                    localStorage["GeminiUrl"] = this.GeminiUrl();
                    localStorage["UserName"] = this.UserName();
                    localStorage["APIKey"] = this.APIKey();
                }
                else {
                    localStorage["AuthMethod"] = "password";
                    localStorage["GeminiUrl"] = this.GeminiUrl();
                    localStorage["UserName"] = this.UserName();
                    var authString = md5(this.Password());
                    localStorage["passwordLength"] = this.Password().length;
                    localStorage["APIKey"] = this.APIKey();
                    localStorage["AuthString"] = authString;
                }
                $(".confirmationMessage").stop().hide().text("Options saved.").fadeIn(400, function() {
                        $(this).delay(1000).fadeOut(400);
                    });
            }
        };
        return OptionsPageViewModel;
    })();
    
    var PageViewModel = (function () {
        function PageViewModel() {
            this.OptionsPage = new OptionsPageViewModel({Parent: this});
        }
        return PageViewModel;
    })();
    ko.applyBindings(new PageViewModel());
});