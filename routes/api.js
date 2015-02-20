var util = require('util');
var exec = require('child_process').exec;
var sleep = require('sleep');
var request = require('request');




var switch_data = [
{
	id: 0, url: '/switches/0', "name": 'Lamp 1', script: '/usr/bin/tdtool', parameter: "-f" ,status: true, switch_id: 1
},
{
	id: 1, url: '/switches/1', "name": 'Lamp 2', script: '/usr/bin/tdtool', parameter: "-n", status: true, switch_id: 2
}	
];

var camera = [
{
	"id": "0", "url": "http://192.168.1.12/image/jpeg.cgi", "description": "Garage camera"
},
{
	"id": "1", "url": "http://192.168.1.14/image/jpeg.cgi", "description": "Front door camera"
}
]

// GET
exports.switches = function (req, res) {
	console.log('Getting switches.');
	//getSwitches();
	var switches = [];
	res.json(switch_data)
}

/*
exports.camera = function (req, res) {
	var id = req.params.id;
	var url = camera[id].url;
	if (id >= 0 && id <= camera.length) {
		console.log('Getting image from Camera id: ' + id + " on URL: " + url);
		request.get(url).pipe(res);
	}
}
*/

// PUT
exports.editSwitch = function (req, res) {
	var id = req.params.id;
	if (id >= 0 && id <= switch_data.length) {
		console.log('Switch Status of switch with id: ' + id + " to " + req.body.cmd)
		var script = switch_data[id].script;
		var switch_id = switch_data[id].switch_id;
		switchStatus(script,req.body.cmd,switch_id);
		switch_data[id].status = req.body.status;
		res.sendStatus(200);
	} else {
		res.json(404);
	}
};

// Functions
function switchStatus(script,status,switch_id) {
	var execString = script + " " + status + " " + switch_id;
	console.log("Executing: " + execString);
	exec(execString, puts);
	sleep.sleep(1)
}


function getSwitches() { 
	
	var result = '';
	var switchScript = '/usr/bin/tdtool -l';
	
	var processResult = function(stdout) {
		var lines = stdout.toString().split('\n');
		var results = new Array();
		lines.forEach(function(line) {
			var parts = line.split('\t');
			console.log(parts);
			results[parts[0], parts[1], parts[2]];
		});
		
		console.log(results);
	}
	
	console.log(switchScript);
	var child = exec(switchScript, function(err, stdout, stderr) {
		if(err) {
			console.log("command failed");
		} else {
			console.log(stdout);
			processResult(stdout);
		}
	});
}


function puts(error, stdout, stderr) {
	console.log(stdout);
	//util.puts(stdout);
	console.warn("Executing Done");
}