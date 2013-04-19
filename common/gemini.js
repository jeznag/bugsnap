define(['js/jquery'], function ($) {
    var GeminiCommunicator = (function () {
        function GeminiCommunicator() {
            if(window.navigator.userAgent.indexOf('Firefox') != -1) { // add options page for FF later
                this.geminiUrl = "http://rysenkocomp.dlinkddns.com/gemini/api/";
                this.geminiUsername = window.btoa('manager:e44knrbhxb'); // user:apikey
            } else {
                this.geminiUrl = localStorage["GeminiUrl"]+ "/api/";
                this.geminiUsername = window.btoa(localStorage["UserName"] + ':' + localStorage["APIKey"]); // user:apikey
            }
        }
        GeminiCommunicator.prototype.search = function (query) {
           var options = {
                url: this.geminiUrl + "items/filtered",
                type: "POST",
                data: {
                    SearchKeywords: query,
                    IncludeClosed: "false",
                    Projects: "ALL",
					MaxItemsToReturn: 10
                },
                headers: { "Authorization": "Basic " + this.geminiUsername }
            };
			if(!isNaN(query)) {
				options.url = this.geminiUrl + "items/" + query;
				options.type = "GET";
				options.data = null;
			}
			else if(query.length < 3) {
				return null;
			}
            return $.ajax(options);
        };
        GeminiCommunicator.prototype.comment = function (projectId, issueId, comment) {
            return $.ajax({
                url: this.geminiUrl + "items/" + issueId + "/comments",
                type: "POST",
                data: {
                    ProjectId: projectId,
                    IssueId: issueId,
                    UserId: "1",
                    Comment: comment
                },
                headers: { "Authorization": "Basic " + this.geminiUsername }
            });
        };
        GeminiCommunicator.prototype.attach = function (projectId, issueId, fileContent) {
            return $.ajax({
                url: this.geminiUrl + "items/" + issueId + "/attachments",
                type: "POST",
                data: JSON.stringify({
                    ProjectId: projectId,
                    IssueId: issueId,
                    Name: "screenshot.png",
                    ContentType: "image/png",
                    Content: fileContent
                }),
                processData: false,
                contentType: 'application/json',
                headers: { "Authorization": "Basic " + this.geminiUsername }
            });
        };
        return GeminiCommunicator;
    })();
    return GeminiCommunicator;
});