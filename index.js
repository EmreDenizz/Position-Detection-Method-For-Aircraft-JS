/**
 * @author Emre Deniz <https://github.com/EmreDenizz>
*/

// initialize depth map
var mapSize = 8, depthMap = [], counter = 0, stepCounter = 0;
for(var i = 0; i < mapSize; i++){
    var row = [];
    var rowString = "<tr>"
    for(var j = 0; j < mapSize; j++){
        var depth = Math.floor((Math.random() * 100) + 2);
        row.push(depth);
        rowString = rowString + "<td id='depth_"+counter+"'>" + depth + "</td>";
        counter++;
    }
    depthMap.push(row);
    rowString = rowString + "</tr>";
    $("#depthTable").append(rowString);
}

// initialize real map
var realMap = [], counter = 0;
for(var i = 0; i < mapSize; i++){
    var row = [];
    var rowString = "<tr>"
    for(var j = 0; j < mapSize; j++){
        var possibility = (1.0 / parseFloat((mapSize-2) * (mapSize-2))).toFixed(4);
        if(i == 0 || j == 0 || i == mapSize-1 || j == mapSize-1) possibility = parseFloat(0).toFixed(4);

        row.push(possibility);
        rowString = rowString + "<td id='map_"+counter+"'><center><span>" + possibility + "</span></center></td>";
        counter++;
    }
    realMap.push(row);
    rowString = rowString + "</tr>";
    $("#realTable").append(rowString);
}

// initialize first random location
$("#step").html(stepCounter);
	
var positionR = Math.floor((Math.random() * (mapSize-2)) + 1);
var positionC = Math.floor((Math.random() * (mapSize-2)) + 1);

var position = positionR * mapSize + positionC;

var direction = decideDirection(positionR, positionC, 0);
var rotation = calculateRotation(direction);

$("#map_"+position).append('<img style="width: 37px; transform: rotate('+rotation+'deg);" src="images/plane.png"/>');

// function definitions
function move(){

    $("#step").html(++stepCounter);
    $("#step").html(stepCounter);

    $("#map_"+position+" img").remove();
    var positionArray = calculateMove(positionR, positionC, direction)
    positionR = positionArray[0];
    positionC = positionArray[1];
    position = positionR * mapSize + positionC;

    direction = decideDirection(positionR, positionC, direction);
    rotation = calculateRotation(direction);

    $("#map_"+position).append('<img style="width: 37px; transform: rotate('+rotation+'deg);" src="images/plane.png"/>');

    observe(positionR, positionC);
	
}

function observe(posR, posC){
	
    var initialDifferenceMap = [], differenceMap = [], deviation = [-0.3, 0.3], counter = 0;

    var c1 = depthMap[posR - 1][posC - 1] + deviation[Math.floor(Math.random() * 2)];
    var c2 = depthMap[posR - 1][posC] + deviation[Math.floor(Math.random() * 2)];
    var c3 = depthMap[posR - 1][posC + 1] + deviation[Math.floor(Math.random() * 2)];
    var c4 = depthMap[posR][posC - 1] + deviation[Math.floor(Math.random() * 2)];
    var c5 = depthMap[posR][posC] + deviation[Math.floor(Math.random() * 2)];
    var c6 = depthMap[posR][posC + 1] + deviation[Math.floor(Math.random() * 2)];
    var c7 = depthMap[posR + 1][posC - 1] + deviation[Math.floor(Math.random() * 2)];
    var c8 = depthMap[posR + 1][posC] + deviation[Math.floor(Math.random() * 2)];
    var c9 = depthMap[posR + 1][posC + 1] + deviation[Math.floor(Math.random() * 2)];
	
    var observeTotal = c1+c2+c3+c4+c5+c6+c7+c8+c9;
	
    var diffTotal = 0;
    var maxValue = 0;
    for(var i = 0; i < mapSize; i++){
        var row = [];
        for(var j = 0; j < mapSize; j++){
            var diff = 0;
            if(i == 0 || j == 0 || i == mapSize-1 || j == mapSize-1){
                diff = 0;
            }
            else{
                var total = depthMap[i - 1][j - 1] + depthMap[i - 1][j] + depthMap[i - 1][j + 1] + depthMap[i][j - 1] + depthMap[i][j] + 
                depthMap[i][j + 1] + depthMap[i + 1][j - 1] + depthMap[i + 1][j] + depthMap[i + 1][j + 1];
                diff = Math.abs(observeTotal - total);
                if(diff > maxValue) maxValue = diff;
            }
            row.push(diff);
        }
        initialDifferenceMap.push(row);
    }
	
    for(var i = 0; i < mapSize; i++){
        var temp = [];
        for(var j = 0; j < mapSize; j++){
            temp.push(0);
        }
        differenceMap.push(temp);
    }
	
    for(var i = 0; i < mapSize; i++){
        for(var j = 0; j < mapSize; j++){
            if(i == 0 || j == 0 || i == mapSize-1 || j == mapSize-1){
                continue;
            }
            diffTotal += maxValue / initialDifferenceMap[i][j];
            differenceMap[i][j] = parseFloat(parseFloat(maxValue) / parseFloat(initialDifferenceMap[i][j])).toFixed(4);;
        }
    }
	
    for(var i = 0; i < mapSize; i++){
        for(var j = 0; j < mapSize; j++){
            if(i == 0 || j == 0 || i == mapSize-1 || j == mapSize-1){
                counter++;
                continue;
            }
            var newValue = differenceMap[i][j] / diffTotal;
            realMap[i][j] = parseFloat(newValue).toFixed(4);
            $("#map_"+counter+" span").html(realMap[i][j]);
            counter++;
        }
    }
	
}

function calculateMove(posR, posC, dir){
	
    var pR = 0, pC = 0;

    if(dir == "N") { pR = posR - 1; pC = posC}
    else if(dir == "E") { pC = posC + 1; pR = posR}
    else if(dir == "S") { pR = posR + 1; pC = posC }
    else if(dir == "W") { pC = posC - 1; pR = posR }

    return [pR, pC];
	
}

function decideDirection(posR, posC, curDir){
	
    var directions = ["N", "E", "S", "W"];
    var directionSouthEast = ["S", "E"];
    var directionSouthWest = ["S", "W"];
    var directionNorthEast = ["N", "E"];
    var directionNorthWest = ["N", "W"];
    var directionEastSouthWest = ["E", "S", "W"];
    var directionNorthEastSouth = ["N", "E", "S"];
    var directionNorthEastWest = ["N", "E", "W"];
    var directionNorthSouthWest = ["N", "S", "W"];
	
    var directionEastWest = ["E", "W"];
    var directionNorthSouth = ["N", "S"];

    var dir = "";
	
    if(posR == 1 && posC == 1){
        if(curDir == 0) dir = directionSouthEast[Math.floor(Math.random() * 2)];
        else if(curDir == "N") dir = "E";
        else if(curDir == "W") dir = "S";
    }

    else if(posR == 1 && posC == mapSize-2){
        if(curDir == 0) dir = directionSouthWest[Math.floor(Math.random() * 2)];
        else if(curDir == "N") dir = "W";
        else if(curDir == "E") dir = "S";
    }

    else if(posR == mapSize-2 && posC == 1){
        if(curDir == 0) dir = directionNorthEast[Math.floor(Math.random() * 2)];
        else if(curDir == "S") dir = "E";
        else if(curDir == "W") dir = "N";
    }

    else if(posR == mapSize-2 && posC == mapSize-2){
        if(curDir == 0) dir = directionNorthWest[Math.floor(Math.random() * 2)];
        else if(curDir == "S") dir = "W";
        else if(curDir == "E") dir = "N";
    }

    else if(posR == 1){
        if(curDir == 0) dir = directionEastSouthWest[Math.floor(Math.random() * 3)];
        else if(curDir == "N") dir = directionEastWest[Math.floor(Math.random() * 2)];
        else if(curDir == "E") dir = directionSouthEast[Math.floor(Math.random() * 2)];
        else if(curDir == "W") dir = directionSouthWest[Math.floor(Math.random() * 2)];
    }

    else if(posC == 1){
        if(curDir == 0) dir = directionNorthEastSouth[Math.floor(Math.random() * 3)];
        else if(curDir == "W") dir = directionNorthSouth[Math.floor(Math.random() * 2)];
        else if(curDir == "N") dir = directionNorthEast[Math.floor(Math.random() * 2)];
        else if(curDir == "S") dir = directionSouthEast[Math.floor(Math.random() * 2)];
    }

    else if(posR == mapSize-2){
        if(curDir == 0) dir = directionNorthEastWest[Math.floor(Math.random() * 3)];
        else if(curDir == "S") dir = directionEastWest[Math.floor(Math.random() * 2)];
        else if(curDir == "E") dir = directionNorthEast[Math.floor(Math.random() * 2)];
        else if(curDir == "W") dir = directionNorthWest[Math.floor(Math.random() * 2)];
    }

    else if(posC == mapSize-2){
        if(curDir == 0) dir = directionNorthSouthWest[Math.floor(Math.random() * 3)];
        else if(curDir == "E") dir = directionNorthSouth[Math.floor(Math.random() * 2)];
        else if(curDir == "N") dir = directionNorthWest[Math.floor(Math.random() * 2)];
        else if(curDir == "S") dir = directionSouthWest[Math.floor(Math.random() * 2)];
    }

    else{
        if(curDir == 0) dir = directions[Math.floor(Math.random() * 4)];
        else if(curDir == "N") dir = directionNorthEastWest[Math.floor(Math.random() * 3)];
        else if(curDir == "E") dir = directionNorthEastSouth[Math.floor(Math.random() * 3)];
        else if(curDir == "S") dir = directionEastSouthWest[Math.floor(Math.random() * 3)];
        else if(curDir == "W") dir = directionNorthSouthWest[Math.floor(Math.random() * 3)];
    }

    return dir;
	
}

function calculateRotation(dir){

    var rotations = [-90, 0, 90, 180];
    var directions = ["N", "E", "S", "W"];
    var index = 0;

    if(dir == "N") index = 0;
    else if(dir == "E") index = 1;
    else if(dir == "S") index = 2;
    else if(dir == "W") index = 3;

    return rotations[index];
	
}