/**
	Relies on URLConnection.js
	
	This can be called before or after the document has loaded.
	
	
	
	var dashboarder = new Dashboarder(document.getElementById("dashboardTable"))
	dashboarder.addBuild("HydroXphereContinuous", "Meet Central", "https://heliumfoot.net/dashboard/hydroxphere/itms-services://?action=download-manifest&url=https://heliumfoot.net/dashboard/hydroxphere/HydroXphereContinuous.plist", "iOS", "Latest Development", "http://heliumfoot.net:8080/job/HydroXphereContinuous/lastCompletedBuild/testReport/")
	
	
**/
function Dashboarder(tableElement, evenCSSClass, oddCSSClass) {
	this.tableElement = tableElement;
	this.evenCSSClass = evenCSSClass || "pure-table-even";
	this.oddCSSClass = oddCSSClass || "pure-table-odd";
	
	this.urlConnection = new URLConnection();
}

Dashboarder.prototype.addBuild = function(jobName, appName, appURL, platform, description, environment, testsURL) {
	
	var self = this;
	
	//create the function to add the table row that will also make an ajax call to get the build time.
	var buildFunction = function() {
		var tr = self.table.insertRow();
		var isEvenRow = self.table.rows.length % 2 == 0;
		tr.className = isEvenRow ? self.evenCSSClass : self.oddCSSClass
		var appLink = "<a href=\""+appURL+"\">"+appName+"</a>"
	
		self.addCellWithHTML(tr,appLink);
		var dateTD = self.addCellWithHTML(tr,"Loading...");
		dateTD.id = jobName;
		self.addCellWithHTML(tr, platform);
		self.addCellWithHTML(tr, description);
		self.addCellWithHTML(tr, environment);
	
		var testsLink = testsURL ? "<a href=\""+testsURL+"\">"+Tests+"</a>":"None Yet";
		self.addCellWithHTML(tr, testsLink);
	
		//request buildTime
		self.urlConnection.get(jobName + "/builddate.txt", function(responseText) {
			document.getElementById(jobName).innerHTML = responseText;
		});
	} 
	
	//determine if we need to call the build function now or attach it to the onload handler
	if(document.readyState === "complete") {
		buildFunction();
	} else {
		var currentOnload = document.onload;
		document.onload = function() {
			if (currentOnload) {
				currentOnload();
			}
			buildFunction();
		}
	}
}

Dashboarder.prototype.addCellWithHTML = function(tr, html) {
	var td = tr.insertCell();
	td.setAttribute("valign","top");
	td.innerHTML = html;
 	return td;
}

