define(['lib/jquery', 'comm/communicator', 'comm/fieldInfo'], function ($, Communicator, FieldInfo) {
    var MingleCommunicator = (function (_super) {
        MingleCommunicator.prototype = Object.create(_super.prototype);
        function MingleCommunicator(settings) {
            _super.call(this, settings);
            this.Url = function () {
                return 'http://localhost:3000/api/v1/mingle_bugs/';
            };
            this.SecurityToken = '';
            this.UserId = '';
        }
        MingleCommunicator.prototype.getIdFromUrl = function (url) {
            var slashPos = url.lastIndexOf('/');
            return url.substring(slashPos + 1);
        };
        MingleCommunicator.prototype.authenticate = function () {
            
        };
        MingleCommunicator.prototype.test = function () {
            return this.loadProjects();
        };
        MingleCommunicator.prototype.loadProjects = function () {
            var self = this;
            return {Id: 1, Name: 'your_first_project'};/*this.ajax(this.Url() + 'list_projects', {}, 'GET').then(function (data) {
                return $.map(data.QueryResult.Results, function (item) {
                    return {Id: self.getIdFromUrl(item._ref), Name: item._refObjectName};
                });
            });*/
        };
        MingleCommunicator.prototype.search = function (query) {
            var self = this;
            var mingleQuery = '(Name contains "' + query + '")';
            return this.ajax(this.Url() + 'defect?query=' + encodeURIComponent(rallyQuery), {}, 'GET').then(function (data) {
                return $.map(data.QueryResult.Results, function (item) {
                    return {Id: self.getIdFromUrl(item._ref), Name: item._refObjectName};
                });
            });
        };
        MingleCommunicator.prototype.getFields = function () {
            var fields = {
                project: new FieldInfo({Caption: 'Project'})
            };
            var self = this;
            /*self.loadProjects().done(function (data) {
                    fields.project.Options(data);
            });*/
            return fields;
        };
        MingleCommunicator.prototype.create = function (title, description, fields, fileContent) {
            var data = {
                project: fields.project.Value(),
                bug_name: title,
                bug_description: description,
                image_data: fileContent
            };
            console.log(data);
            console.log(this.Url());
            return jQuery.post(this.Url(), data).then(function (result) {
            	console.log("Result: " + JSON.stringify(result));
                return {Id: result};
            });
        };
        MingleCommunicator.prototype.attach = function (issueId, fileContent) {
            
        };
        MingleCommunicator.prototype.comment = function (issueId, comment) {
            var data = {conversationpost: {
                Artifact: 'artifact/' + issueId,
                Text: comment,
                User: 'user/' + this.UserId
            }};
            return this.ajax(this.Url() + 'conversationpost/create?key=' + this.SecurityToken, data);
        };
        MingleCommunicator.prototype.getRedirectUrl = function (issueId, fields) {
            _super.prototype.getRedirectUrl.call(this, issueId, fields);
            return 'https://testingbugsnap.mingle.thoughtworks.com/projects/your_first_project/cards/' + issueId;
        };
        MingleCommunicator.prototype.ajax = function(url, data, method) {
            var deferred = $.Deferred();
            var xhr = new XMLHttpRequest();
            xhr.open((method || 'POST'), url, true, this.Login(), this.Password());
            xhr.setRequestHeader('Content-Type', 'application/json');
            xhr.setRequestHeader('Accept', 'application/json');
            xhr.onreadystatechange = function() {
                if (xhr.readyState == 4) {
                    if (xhr.status == 200) {
                        try {
                            var result = JSON.parse(xhr.responseText);
                            if (result['CreateResult'] && result.CreateResult.Errors.length > 0) {
                                console.log(result.CreateResult.Errors);
                                deferred.reject(result.CreateResult.Errors);
                            } else {
                                deferred.resolve(result);
                            }
                        } catch (e) {
                            deferred.resolve(xhr.responseText);
                        }
                    } else {
                        if(!xhr.statusText || xhr.statusText == 'timeout' || xhr.statusText == "Not Found") {
                            deferred.reject('Unable to connect to Rally at standard URL.');
                        } else {
                            deferred.reject('Unable to login using supplied credentials.');
                        }
                    }
                }
            };
            xhr.send(JSON.stringify(data));
            return deferred.promise();
        };
        return MingleCommunicator;
    })(Communicator);
    return MingleCommunicator;
});
