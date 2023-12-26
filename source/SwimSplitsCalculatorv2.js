/* CALCULATION OF POTENTIAL TIMES */
var a = 0.0554
var b = 8.97
var c = 0.0012
/* In the calculator, the potential time is computed as follows: 
optimal_time = own_average_split / world_record_average_split
potential_time = optimal_time * (1 - (a*b+c))
*/




/* WORLD RECORDS DATABASE. CURRENT AS OF JUNE 2017 */ 
/* MANUAL UPDATES OF SPLITS REQUIRED HERE WHEN RECORDS ARE BROKEN */

/*---RECORDS START HERE---*/

world_record = []

/* Men Fly */
world_record["men-fly-50m"] = [22.72];
world_record["men-fly-100m"] = [23.41, 26.74];
world_record["men-fly-200m"] = [25.17, 28.59, 28.28, 29.33]; 

/* Men Back */
world_record["men-back-50m"] = [24.29];
world_record["men-back-100m"] = [25.25, 26.71]; 
world_record["men-back-200m"] = [26.96, 28.63, 28.9, 28.85]; 

/* Men Breast */
world_record["men-breast-50m"] = [26.69];
world_record["men-breast-100m"] = [27.68, 29.19]; 
world_record["men-breast-200m"] = [29.18, 32.62, 32.91, 33.17];

/*Men Freestyle */
world_record["men-free-50m"] = [21.06]; 
world_record["men-free-100m"] = [22.51, 29.41]; 
world_record["men-free-200m"] = [24.37, 26.43, 26.59, 26.93]; 
world_record["men-free-400m"] = [26.17, 28.28, 28.29, 28.5, 28.12, 28.16, 27.83, 27.49]; 
world_record["men-free-800m"] = [26.94, 28.26, 28.84, 28.51, 28.61, 28.71, 28.71, 28.21, 28.23, 28.26, 28.51, 28.57, 28.90, 28.77, 28.10, 25.99]; 
world_record["men-free-1500m"] = [27.09, 28.71, 29.46, 29.05, 29.35, 28.97, 29.53, 29.34, 29.23, 28.89, 29.26, 29.27, 29.25, 29.34, 29.41, 29.30, 29.49, 29.38, 29.46, 29.32, 29.42, 29.21, 29.54, 29.37, 29.17, 29.19, 29.39, 29.14, 27.81, 25.68]; 

/* Men IM */
world_record["men-im-200m"] = [24.89, 28.59, 33.03, 27.49]; 
world_record["men-im-400m"] = [25.73, 29.19, 31.37, 30.20, 34.77, 35.79, 28.94, 27.85]; 

/* Women Fly */
world_record["women-fly-50m"] = [25.52];
world_record["women-fly-100m"] = [26.54, 29.63]; 
world_record["women-fly-200m"] = [28.28, 31.77, 32.04, 31.45]; 

/* Women Back */
world_record["women-back-50m"] = [27.53];
world_record["women-back-100m"] = [28.36, 29.76]; 
world_record["women-back-200m"] = [29.66, 31.43, 31.72, 31.85]; 

/* Women Breast */
world_record["women-breast-50m"] = [29.68];
world_record["women-breast-100m"] = [30.39, 34.31]; 
world_record["women-breast-200m"] = [32.55, 35.84, 36.06, 36.18]; 

/*Women Freestyle */
world_record["women-free-50m"] = [23.76]; 
world_record["women-free-100m"] = [25.62, 27.04];
world_record["women-free-200m"] = [27.06, 28.51, 29.09, 29.19]; 
world_record["women-free-400m"] = [28.47, 29.94, 30.42, 30.42, 30.51, 30.71, 30.62, 29.92]; 
world_record["women-free-800m"] = [28.03, 29.95, 30.73, 30.71, 30.64, 30.70, 30.37, 30.85, 30.22, 30.74, 30.60, 30.76, 30.77, 30.37, 30.36, 30.85]; 
world_record["women-free-1500m"] = [28.37, 30.67, 30.64, 30.84, 30.91, 31.03, 31.18, 31.05, 31.24, 30.96, 31.20, 31.10, 31.10, 31.09, 30.99, 30.88, 30.90, 31.11, 31.01, 30.96, 30.88, 31.13, 31.00, 31.00, 31.14, 31.05, 31.09, 31.10, 30.84, 29.02]; 

/* Women IM */
world_record["women-im-200m"] = [27.30, 31.64, 36.70, 30.48]; 
world_record["women-im-400m"] = [28.33, 32.58, 34.10, 33.38, 37.23, 38.88, 31.18, 30.68];

/*---RECORDS STOP HERE---*/

var athletes_graphed = 0;
var long_distance_mode = false;
var show_labels = true;
var graph_in_progress = false;
var do_update_legend = true;

/* CREATE AND SAVE DATA FILES TO USERS COMPUTER */
/* Take in a string of input and makes a file */
function makeTextFile (text) {
	var textFile = null;
	var data = new Blob([text], {type: 'text/plain'});

	/* Since we are replacing a previously generated file we need to manually revoke the object URL to avoid memory leaks. */
	if (textFile !== null) {
	  window.URL.revokeObjectURL(textFile);
	}

	textFile = window.URL.createObjectURL(data);

	/* Return a URL to use as an href */
	return textFile;
};

/* Save an athlete's splits and computed data */
function save() {
	
	var last_name = document.getElementById("last_name").value;
	var first_name = document.getElementById("first_name").value;

	var gender = "";
	if(document.getElementById("male").checked == true)
		gender = "male";
	else if(document.getElementById("female").checked == true)
		gender = "female";
	else
		gender = "unknown";
		
	var stroke = document.getElementById("stroke").value;
	var distance = document.getElementById("distance_selector").value+"m";
	var year = document.getElementById("year").value;
	var month = document.getElementById("month").value;
	var day = document.getElementById("day").value;
	var time = document.getElementById("time").value;
	var link = document.createElement('a');
	link.setAttribute('download', last_name + '.' + first_name + '.' + stroke + '(' + distance + ').' 
					+ year + '.' + month + '.' + day + '.' + time + '.txt');
	var saveData = "";
	saveData += last_name;
	saveData += "\r\n";
	saveData += first_name;
	saveData += "\r\n";
	saveData += gender;
	saveData += "\r\n";
	saveData += stroke;
	saveData += "\r\n";
	saveData += distance;
	saveData += "\r\n";
	saveData += year;
	saveData += "\r\n";
	saveData += month;
	saveData += "\r\n";
	saveData += day;	
	saveData += "\r\n";
	saveData += time;
	saveData += "\r\n";
			
	saveData += "--\r\n";
	for(var i=50;i<=document.getElementById("distance_selector").value;i+=50)
	{
		saveData += document.getElementById("input"+i).value;
		saveData += "\r\n";
	}				
	
	
	link.href = makeTextFile(saveData);
	link.innerHTML = "SAVE";
	document.getElementById("save_button_container").innerHTML = "";
	document.getElementById("save_button_container").appendChild(link);
}

/* RETRIEVE FILE FROM USERS COMPUTER AND LOAD ITS DATA INTO CALCULATOR*/
/* Function to load data */
var top5_file = "";
function openFile(event) {
	var input = event.target;
	var filename = input.files[0]['name'];
	var name_parts = filename.split('.');
	var file_last_part = name_parts[name_parts.length - 1];
	if(file_last_part == "txt") {
		var reader = new FileReader();
		reader.onload = function() {
			var text = reader.result;
			var parts = text.split("\n");
			var last = parts[0].trim();
			var first = parts[1].trim();
			var gender = parts[2].trim();
			var stroke = parts[3].trim();
			var dist = parts[4].trim();
			var year = parts[5].trim();
			var month = parts[6].trim();
			var day = parts[7].trim();
			var hour = parts[8].trim();
			
			document.getElementById("first_name").value = first;
			document.getElementById("last_name").value = last;
			document.getElementById("year").value = year;
			document.getElementById("month").value = month;
			document.getElementById("day").value = day;
			if(hour < 12)
			{
				hour = 1;
			}
			else if(hour < 18)
			{
				hour = 2;
			}
			else
			{
				hour = 3;
			}
				
			
			document.getElementById("time").selectedIndex = hour; //parseInt(hour.substr(0, hour.length-2)) ;
			
			
	/* INDEX DISTANCE */			
			/* Extract from "dist" variable the actual distance & then divide by 50 */
			if(dist == "50m")
				document.getElementById("distance_selector").selectedIndex = 1;
			else if(dist == "100m")
				document.getElementById("distance_selector").selectedIndex = 2;
			else if(dist == "200m")
				document.getElementById("distance_selector").selectedIndex = 3;
			else if(dist == "400m")
				document.getElementById("distance_selector").selectedIndex = 4;
			else if(dist == "800m")
				document.getElementById("distance_selector").selectedIndex = 5;
			else if(dist == "1500m")
				document.getElementById("distance_selector").selectedIndex = 6;	

	/* INDEX STROKE */	
			if(stroke == "fly")
				document.getElementById("stroke").selectedIndex = 1;
			else if(stroke == "back")
				document.getElementById("stroke").selectedIndex = 2;
			else if(stroke == "breast")
				document.getElementById("stroke").selectedIndex = 3;
			else if(stroke == "free")
				document.getElementById("stroke").selectedIndex = 4;
			else if(stroke == "im")
				document.getElementById("stroke").selectedIndex = 5;
			else
				alert("Unknown stroke: " + stroke);

	/* INDEX GENDER */	
			if(gender == "male")
				document.getElementById("male").checked = true;
			else if(gender == "female")
				document.getElementById("female").checked = true;
			dist = dist.substring(0, dist.length - 1);
			selectDistance();
			setup_graph();
			
			for(var i=50;i<=dist;i+=50)
			{
				document.getElementById("input"+i).value = parts[9+i/50].trim();
				console.log(parts[9+i/50].trim());
			}
			draw();

		} /* end of reader function */
		reader.readAsText(input.files[0]);

	} /*end of if txt */

	else if(file_last_part == "top5") {
		console.log("found a top5 file");
		top5_file = filename.substring(0, filename.length-5);
		document.getElementById("loaded_top5_file").value = top5_file;
		var reader = new FileReader();
		reader.onload = function() {
			var text = reader.result;
			var lines = text.split("\n");
			for(i=0;i<lines.length;i+=1) {
				var parts = lines[i].split(" / ");
				if(parts.length != 2) {
					continue;
				}
				var event = parts[0];
				var splits_string = parts[1];
				var event_parts = event.split(" ");
				if(event_parts[0] == "MENS") {
					var gender = "men-";
				}
				else if(event_parts[0] == "WOMENS") {
					var gender = "women-";
				}
				else {
					console.log("gender undefined");
				}
				var distance = event_parts[1] + "m";

				if(event_parts[3] == "BUTTERFLY") {
					var stroke = "fly-";
				}
				else if(event_parts[3] == "BREASTSTROKE") {
					var stroke = "breast-";
				}
				else if(event_parts[3] == "BACKSTROKE") {
					var stroke = "back-";
				}
				else if(event_parts[3] == "FREESTYLE") {
					var stroke = "free-";
				}
				else if(event_parts[3] == "IM") {
					var stroke = "im-"
				}
				else {
					console.log("stroke undefined");
				}



				var splits = splits_string.split(", ");
				var formatted_splits = [];
				for(j=0;j<splits.length;j+=1) {
					var temp_ = parseFloat(splits[j]);
					formatted_splits.push(temp_);
				}
				world_record[gender + stroke + distance] = formatted_splits;
			}

		}
		reader.readAsText(input.files[0]);


	}

	else {
		console.log("couldn't read " + file_last_part + " type file");
	}

	
} /* end of openFile function */


function clear_graph_data(){
	dataBank = [];
}

/* START OF D3.JS*/

// define dimensions of graph
var m = [80, 80, 80, 80]; // margins
var w = 800 - m[1] - m[3]; // width
var h = 400 - m[0] - m[2]; // height

var incorperatedLines = [];


var positions = [0,-50,0,-50,0,-50,0,-50,0,-50,0,-50]
var colors = ['red', 'blue', 'green', 'magenta', 'orange', 'brown','red', 'blue', 'green', 'magenta', 'orange', 'brown'];

var dataBank = [];

function incorporateLineAndRedraw(data, athlete_name) {

	athletes_graphed += 1;
	update_legend(athlete_name);

	if(long_distance_mode == true) {
		w = 1000;
		var input_section_main = document.getElementById("input_section_main");
		input_section_main.style.top = '350px';
		input_section_main.style.position = 'absolute';
		document.getElementById("container").style.border = "0px solid black"

	}

	incorperatedLines.push([data, athlete_name]);


	// dataBank = [ swimmer1,  [swimmer2   ]
	// swimmers = [ [50, 29.3], [100, 31.6], [150, 29.7], [200, 28.9]]
	// dataBank = [ [ [50, 29.3], [100, 31.6], [150, 29.7], [200, 28.9]], [ [50, 29.3], [100, 31.6], [150, 29.7], [200, 28.9]] ]
	dataBank.push(data);
	var xmin = dataBank[0][0][0]
	var xmax = dataBank[0][0][0]
	var ymin = dataBank[0][0][1];
	var ymax = dataBank[0][0][1];
	for(var i=0;i<dataBank.length;i++) {
		var swimmer = dataBank[i];
		for(var lap=0;lap<swimmer.length;lap++) {
			var splits = swimmer[lap];
			var meters = splits[0];
			var seconds = splits[1];
			if(meters > xmax) {
				xmax = meters;
			}
			if(seconds > ymax) {
				ymax = seconds;
			}
			if(seconds < ymin) {
				ymin = seconds;
			}
		}
	}

	var xdomain = [xmin, xmax];
	var ydomain = [0.98*ymin, 1.02*ymax];

	var x = d3.scale.linear().domain(xdomain).range([0, w]);
	var y = d3.scale.linear().domain(ydomain).range([h, 0]);

	var line = d3.svg.line()
		.x(function(d,i) { 
			return x(d[0]); 
		})
		.y(function(d) { 
			return y(d[1]); 
		})

	document.getElementById("graph").innerHTML = "";
	var graph = d3.select("#graph").append("svg:svg")
		      .attr("width", w + m[1] + m[3])
		      .attr("height", h + m[0] + m[2])
		    .append("svg:g")
		      .attr("transform", "translate(" + m[3] + "," + m[0] + ")");
	for(var i=0;i<dataBank.length;i++) {
		var data1 = dataBank[i];
		graph.append("g").selectAll("circle")
		    .data(data1)
		    .enter()
		    .append("circle")
		    .attr("r", 4)
		    .attr("cx", function(d) {
		        return x(d[0])
		    })
		    .attr("cy", function(d) {
		        return y(d[1])
		    })
		    .attr("fill", colors[i])
		    .attr("stroke", colors[i]);

		if(show_labels == true)
		{
			graph.append("g").selectAll("text")
			    .data(data1)
			    .enter()
			    .append("text")
			    .attr("x", function(d) {
			        return x(d[0]) + positions[i]
			    })
			    .attr("y", function(d) {
			        return y(d[1])-7
			    })
			    .attr("fill", colors[i])
			    .text(function(d) {
			        return d[1]+"%"
			    })
		}


		graph.append("svg:path").attr("d", line(data1)).attr("stroke", colors[i]);

	}

	
	var xAxis = d3.svg.axis().ticks(dataBank[0].length).scale(x).tickSize(-h).tickSubdivide(false);


	 graph.append("svg:g")
		      .attr("class", "x axis")
		      .attr("transform", "translate(0," + h + ")")
		      .call(xAxis);



	var yAxisLeft = d3.svg.axis().scale(y).ticks(4).orient("left");

	graph.append("svg:g")
		      .attr("class", "y axis")
		      .attr("transform", "translate(-25,0)")
		      .call(yAxisLeft);
		
}

/* END OF D3.JS */





/* DRAW DYNAMIC GRAPH */		
/* Make x and y axis tick amounts in black and give the entire graph a white background */	
var clear_color = "white";
var line_color = "black";

/* Set height and width of graph portion of calculator  */
var graph_width = 800;
var graph_height = 400;

/* Set variable for x axis ticks of graph initially to 0 and then later vary based on total swim distance */	
var swim_distance = 0;

/* Set variables for y axis ticks of graph to the following fixed amounts */	
var low = 90;
var high = 110;

/* Draw graph */
function setup_graph() {
	var width_unit = (graph_width-100)*50/swim_distance;
	var height_unit = (graph_height-100)/(high-low);
	var font_height = 8;
}




function draw() {
	/* ALERT USER TO ANY MISSING DATA NEEDED FOR CALCULATIONS  */
	if(document.getElementById("distance_selector").value == 0)
	{
		alert("Please select a distance!");
		return;
	}
	if(document.getElementById("stroke").value == 0)
	{
		alert("Please select a stroke!");
		return;
	}
	var AthleteName = document.getElementById("first_name").value + " " + document.getElementById("last_name").value + "'s Splits";


	//console.log("SHOW LABELS IS " + show_labels);

	//read data out of inputs and put data into corresponding cumulative section
	var past_cumulative = 0;
	for(var dist=50;dist<=swim_distance;dist+=50) {
		var input = document.getElementById("input"+dist).value;
		var cumulative = parseFloat(input) + past_cumulative;
		var past_cumulative = cumulative;
		document.getElementById("cumulative"+dist).value = cumulative;
	}
	
	
	/* OPTIMAL SPLIT PERCENTAGES */ 	

	var width_unit = (graph_width-100)*50/swim_distance;
	var height_unit = (graph_height-100)/(high-low);
	

	
	
	
	/* Calculate the average of the splits */
	var own_average = 30.93;
	var own_total = 0;
	var own_count = 0;
	for(var dist=50;dist<=swim_distance;dist+=50) {
		var time = document.getElementById("input"+dist).value;
		own_total += parseFloat(time);
		own_count += 1;
	}
	own_average = own_total/own_count;

	
	/* Obtain data */
	var distance = document.getElementById("distance_selector").value + "m";
	
	var gender_tag = "";
	if( document.getElementById("female").checked == true )
		gender_tag = "women";
	else if(document.getElementById("male").checked == true)
		gender_tag = "men";
	else {
		alert("Please select a gender!");
		return;
	}
	var stroke = document.getElementById("stroke").value;
	var selected = gender_tag + "-" + stroke + "-" + distance;

	var wr_total = 0;
	for(var i=0;i<world_record[selected].length; i++)
	{
		wr_total = wr_total + world_record[selected][i];
	}
	var wr_avg = wr_total/world_record[selected].length;

						
	var wr_index = 0;
	/* Use own-average to find the max & min of the graph */
	low = 200;
	high = 0;
	for(var dist=50;dist<=swim_distance;dist+=50) {
		var perc = own_average/document.getElementById("input"+dist).value*100.0;
		var wr_perc = wr_avg/world_record[selected][wr_index]*100.0;
		if(perc > high)
			high = perc;
		if(wr_perc > high)
			high = wr_perc;
		if(perc < low)
			low = perc;
		if(wr_perc < low)
			low = wr_perc;
		wr_index = wr_index + 1;
	}
	low = Math.floor(low);
	high = Math.ceil(high);
	
	/* World Record Percentages */

	setup_graph();


	/* My athlete percentages */	
	wr_index = 0;
	var wr_x = 50 + (50/50)*width_unit;
	
	var wr_perc = wr_avg/world_record[selected][wr_index]*100.0;
	var wr_y = graph_height - 50 - height_unit*(wr_perc-low);
	var wr_old_x = wr_x;
	var wr_old_y = wr_y;
	scores_for_d3 = [];
	var potential_total = 0;
	for(var dist=50;dist<=swim_distance;dist+=50) {
	
		var wr_x = 50 + (dist/50)*width_unit;
		var wr_perc = wr_avg/world_record[selected][wr_index]*100.0;
		var wr_y = graph_height - 50 - height_unit*(wr_perc-low);
		perc_rounded = wr_perc;
		perc_rounded *= 100;
		perc_rounded = parseInt(perc_rounded);
		perc_rounded /= 100.0;
		scores_for_d3.push([dist,perc_rounded]);

		var opt = own_average/wr_perc * 100.0;
		var pot = opt - (opt/100.0*(a*b+c));
		document.getElementById("potential"+dist).innerHTML = pot.toFixed(2); //parseFloat(parseInt(pot*100)/100.0).toFixed(2);
		potential_total += pot;
		
		wr_old_x = wr_x;
		wr_old_y = wr_y;
		wr_index = wr_index + 1;
	}
	if(athletes_graphed == 0) {
		incorporateLineAndRedraw(scores_for_d3,"Optimal Splits"); // graphing optimal splits
	}




	var x = 50 + (50/50)*width_unit;
	var perc = own_average/document.getElementById("input"+50).value*100.0;
	var y = graph_height - 50 - height_unit*(perc-low);
	var old_x = x;
	var old_y = y;
	var perc_rounded = 0;
	var scores_for_d3 = [];
	for(var dist=50;dist<=swim_distance;dist+=50) {
		var x = 50 + (dist/50)*width_unit;
		var perc = own_average/document.getElementById("input"+dist).value*100.0;
		var y = graph_height - 50 - height_unit*(perc-low);
		perc_rounded = perc;
		perc_rounded *= 100;
		perc_rounded = parseInt(perc_rounded);
		perc_rounded /= 100.0;
		scores_for_d3.push([dist,perc_rounded]);
		
		
	}
	incorporateLineAndRedraw(scores_for_d3,AthleteName); // graphing actual splits



		
	/* My athlete's potential time */


	/* Put actual and potential time of athlete into standard time form */
	var own_total_minutes = parseInt( own_total/60 );
	var potential_total_minutes = parseInt( potential_total/60 );
	var own_seconds = (own_total-own_total_minutes*60);
	var potential_seconds = (potential_total-potential_total_minutes*60);
	if(own_seconds < 10) {
		own_seconds = "0" + own_seconds.toFixed(2);
	}
	else {
		own_seconds = own_seconds.toFixed(2);
	}
	if(potential_seconds < 10) {
		potential_seconds = "0" + potential_seconds.toFixed(2);
	}
	else {
		potential_seconds = potential_seconds.toFixed(2);
	}
	var own_output = "" + own_total_minutes + ":" + own_seconds;
	var potential_output = "" + potential_total_minutes + ":" + potential_seconds;
	document.getElementById("input_total").innerHTML = own_output;
	document.getElementById("potential_total").innerHTML = potential_output;
					
	save();

	document.getElementById("loaded_top5_file").value = top5_file;
} 


//end of draw function











// takes input distance and transfers it into the splits box
function updateSplits() {

	// for i from 50 to swim_distance (including swim_distance)
	// (for right now) set "input"+i 's value to 1
	for(var dist=50;dist<=swim_distance;dist+=50) {
		var thisTime = document.getElementById("cumulative"+dist).value;
		thisTimeParts = thisTime.split(":");
		if(thisTimeParts.length == 2) {
			var cumulative_seconds = parseFloat(thisTimeParts[1]);
			cumulative_seconds *= 100;
			cumulative_seconds2 = parseInt(cumulative_seconds);
			cumulative_seconds2 /= 100.0;
			thisTime = (parseInt(thisTimeParts[0]) * 60) + cumulative_seconds2;
		} 
		if(dist == 50) {
			document.getElementById("input" + dist).value = thisTime;
			var prevTime = thisTime;
		}
		else {
			console.log(prevTime);
			console.log(thisTime - prevTime > 0);
			if(thisTime - prevTime > 0) {
				document.getElementById("input" + dist).value = thisTime - prevTime;
			}
			else {
				document.getElementById("input" + dist).value = "";
			}
			prevTime = thisTime;
		}
	}

}

function update_legend(athlete_name){
	if(do_update_legend == true){
		document.getElementById("graph_legend").innerHTML += '<h5 style="color:'+ colors[athletes_graphed-1] +';">-- '+ athlete_name +' -- </h5>';
	}


}
function update_checkbox(){
	show_labels = document.getElementById("labels_checkbox").checked;
	 /* if(athletes_graphed > 0){
		if(graph_in_progress == false) {
			document.getElementById("graph").innerHTML = '<div id="graph" class="aGraph" style="position:absolute;top:80px;left:0; float:left;"></div>';
			athletes_graphed = 0;
			clear_graph_data();
			var lines_to_draw = incorperatedLines.length-1;
			for(var i=0;i<=lines_to_draw;i+=1)
			{
				do_update_legend = false;
				incorporateLineAndRedraw(incorperatedLines[i][0],incorperatedLines[i][1]);
				do_update_legend = true;
			}
			console.log("drawn");
		} 
	} */
}


function selectDistance() {
	swim_distance = document.getElementById("distance_selector").value;
	
	/*if(swim_distance >= 800); {
		long_distance_mode = true;
	} */

	var input_contents = '<div class="column"><div class="column_part">Distance</div><div class="column_part">Time</div><div class="column_part">Splits</div><div class="column_part">Optimal</div><br>';
	
	/* Make another input column for 1500m splits*/
	for(var i=50;i<=swim_distance;i+=50)
	{
		//if(i == 850) {
		//	input_contents += '</div><div class="column">';
		//}
		input_contents += ' ' 
				+ '<div class="column_part">' + i + 'm  ' + '</div>'
				+ '<div class="column_part"><input type="text" id="cumulative'+i+'" size="3" onkeyup="updateSplits()"></div>  ' 
				+ '<div class="column_part" id="splits'+i+'" style="display: inline-block;"><input type="text" id="input'+i+'" size="3" readonly></div>'
				+ '<div class="column_part" id="potential'+i+'" style="display: inline-block;">____</div>';
				
		input_contents += '<br>';
	}
	
	
	
	// input_contents += '<hr>Actual and Potential Times: <div id="input_total" size="2">____</div> ';
	// input_contents += '--  <div id="potential_total" style="display: inline-block;">____</div><br>';
  
  input_contents += '<br><table border="0" style="text-align: center; margin: auto;"><tr> <td>Top5 File</td> <td>Labels</td> <td><button onclick="draw()">Compute and Graph</button></td> </tr>';
	input_contents += '<tr> <td><input id="loaded_top5_file" size="10" readonly></td> <td><input id="labels_checkbox" type="checkbox" checked="checked" onchange="update_checkbox()"></td> <td></td> </tr>';
    input_contents += '<tr> <td>Actual</td> <td>Potential</td> <td><button onclick="set_goal_time()">Set Goal Time</button></td> </tr>';
    input_contents += ' <tr> <td><div id="input_total" size="2">____</div></td> <td><div id="potential_total" style="display: inline-block;">____</div></td> <td><div><input type="text" id="goal_time" size="8"></div></td> </tr>';
	// input_contents += '<br>Potential Formula: <div id="potential_total" style="display: inline-block;">____</div>';
	
	
	input_contents += '</div>';
	document.getElementById("input_section").innerHTML = input_contents;
	graph_in_progress = true;
	document.getElementById("labels_checkbox").checked = show_labels;
	graph_in_progress = false;
}

/* Scale just the optimal splits to reach the goal time*/
function set_goal_time()
{
	// Check that a stroke and gender have been selected first
	if(document.getElementById("stroke").value == 0)
	{
		alert("Please select a stroke!");
		return;
	}
	if( !(document.getElementById("female").checked || document.getElementById("male").checked) )
	{
		alert("Please select a gender!");
		return;
	}
	// Fill out splits and graph if necessary
	var haveSplits = true;
	for(var dist=50;dist<=swim_distance;dist+=50) {
		var thisTime = document.getElementById("input"+dist);
		if (thisTime.value.trim() == "")
		{
			thisTime.value = 30.0;
			haveSplits = false;
		}
	  }
	if (!haveSplits)
	{
		draw();
	}

  var goal_time = document.getElementById("goal_time").value;
  // Convert time to seconds if necessary
  thisTimeParts = goal_time.split(":");
  if(thisTimeParts.length == 2) {
    var cumulative_seconds = parseFloat(thisTimeParts[1]);
    goal_time = (parseInt(thisTimeParts[0]) * 60) + cumulative_seconds;
  }
  var potential_time = document.getElementById("potential_total").textContent;
  // Convert time to seconds if necessary
  thisTimeParts = potential_time.split(":");
  if(thisTimeParts.length == 2) {
    var cumulative_seconds = parseFloat(thisTimeParts[1]);
    potential_time = (parseInt(thisTimeParts[0]) * 60) + cumulative_seconds;
  }
  
  // Divide by optimal time to get scalar ratio
  var scalar_ratio = goal_time / potential_time
  
  // change the elements in optimal splits table
  var input_section = document.getElementById("input_section");
  var fourthColumn = input_section.children[0].children[3];
  fourthColumn.textContent = "Goal";
  
  for(var dist=50;dist<=swim_distance;dist+=50) {
		var thisTime = document.getElementById("potential"+dist);
    thisTime.textContent = (parseFloat(thisTime.textContent) * scalar_ratio).toFixed(2);
  }
  
  
  console.log(scalar_ratio);
}

/* Set the select options for calculator inputs from 50 to 1500 meters in increments of 50m */ 
window.onload = function()
{
	var distances = [50, 100, 200, 400, 800, 1500];
	for(var index=0;index<distances.length;index++) {
	//for(var i=50;i<=1500;i+=50)
	//{
		var i = distances[index];
		document.getElementById("distance_selector").innerHTML += '<option value="'+i+'">'+i+'m</option>';
	}

	document.getElementById("distance_selector").onchange = function() 
	{
		selectDistance();
		document.getElementById("loaded_top5_file").value = top5_file;
		setup_graph();
	}
}