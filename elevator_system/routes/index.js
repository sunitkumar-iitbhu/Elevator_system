var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
res.sendFile( __dirname + "/" + "hello1.html" );
//res.send('Hello World!');

  //res.render('index', { title: 'Express' });
});

var PriorityQueue = require('priorityqueuejs');
 
 
var queue_lifts_up =[];
for(var i=0;i<10;i++){
    queue_lifts_up.push(new PriorityQueue(function(a, b) {
    if(a.source==b.source) return b.destination-a.destination;
    return b.source-a.source;
}));
}
 
var queue_lifts_down =[];
for(var i=0;i<10;i++){
    queue_lifts_down.push(new PriorityQueue(function(a, b) {
    if(a.source==b.source) return a.destination-b.destination;
    return a.source-b.source;
}));
}
 
var lift_states=[];
for(var i=0;i<10;i++){
    lift_states.push({current_floor: 1,direction: 0, count: 0});
}
 
var time=[];
for(var i=0;i<10;i++){
	time.push(0);
}

function assignLift(source, destination){
	var reqState;
    if(destination>source) reqState=1;
    else if(destination<source)reqState=2;
    else reqState=0;
    for(var i=0;i<10;i++){
    	if(lift_states[i].direction==reqState){//console.log("hello");
    		var calc;
    		if(source<lift_states[i].current_floor) calc=9999;
    		else if(source==lift_states[i].current_floor){
    			calc=0;
    		}
    		else{
	    		calc=source-lift_states[i].current_floor;
	    		var incoming_people=0,outgoing_people;
	    		if(reqState==1){
	    			var item=queue_lifts_up[i];
	    			var myqueue=new PriorityQueue(function(a, b) {
					    if(a.source==b.source) return b.destination-a.destination;
					    return b.source-a.source;
					})

	    			var n=item.size();
	    			while(item.isEmpty()==false){
	    				var temp=item.deq();
	    				myqueue.enq(temp);
	    				if(temp.source<source){
	    					incoming_people++;
	    				}
	    				if(temp.destination<source){
	    					outgoing_people++;
	    				}
	    			}
	    			while(myqueue.isEmpty()==false){
	    				var temp=myqueue.deq();
	    				item.enq(temp);
	    			}
	    		}
	    		if(reqState==2){
	    			var item=queue_lifts_down[i];
	    			var myqueue=new PriorityQueue(function(a, b) {
					    if(a.source==b.source) return b.destination-a.destination;
					    return b.source-a.source;
					})
	    			var n=item.size();
	    			while(item.isEmpty()==false){
	    				var temp=item.deq();
	    				myqueue.enq(temp);
	    				if(temp.source>source){
	    					incoming_people++;
	    				}
	    				if(temp.destination>source){
	    					outgoing_people++;
	    				}
	    			}
	    			while(myqueue.isEmpty()==false){
	    				var temp=myqueue.deq();
	    				item.enq(temp);
	    			}
	    		}
	    		calc+=incoming_people+outgoing_people;
    		}
    		time[i]=calc;
    	}
    	else if(lift_states[i].direction==0){
    		if(lift_states[i].current_floor>source){
    			time[i]=lift_states[i].current_floor-source;
    		}
    		else{
    			time[i]=source-lift_states[i].current_floor;
    		}
    	}
    	else{
    		time[i]=9999;
    	}
    }
    var min=999,min_index=0;
    for(var i=0;i<10;i++){
    	//console.log("time "+i+" ="+time[i]);
    	if(min>time[i]){
    		min=time[i];
    		min_index=i;

    	}
    }
    return min_index;
}

function selectlift(source, destination)
{
    var reqState;
    if(destination>source) reqState=1;
    else if(destination<source)reqState=2;
    else reqState=0;
    var lift=assignLift(source,destination);  
    //console.log("assigning to lift:"+lift);                           //which one is the selected lift
    if(reqState==1){
        lift_states[lift].direction=1;
        lift_states[lift].count++;
        queue_lifts_up[lift].enq({ source: source, destination: destination});
    }
    else if(reqState==2){
        lift_states[lift].direction=2;
        lift_states[lift].count++;
        queue_lifts_down[lift].enq({ source: source, destination: destination});
    }
}
 

 
function gettingOut(){
    console.log("one person is getting out");
}
function goingIn(){
    console.log("one person is going In");
}
 var upcoming_passengers=[],initial_direction=[];
 for(var i=0;i<10;i++){
 	upcoming_passengers.push(0);
 	initial_direction.push(0);
 }
 var flag=false,flag2=false;
function func()
{
    var liftNumber;
    for(liftNumber=0;liftNumber<10;liftNumber++){
    	if(queue_lifts_down[liftNumber].isEmpty()&&queue_lifts_up[liftNumber].isEmpty()){
    		lift_states[liftNumber].direction=0;
    	}
    	
    	if(lift_states[liftNumber].direction==1){
    		initial_direction[liftNumber]=1;
    		var item=queue_lifts_up[liftNumber].peek();
    		if(lift_states[liftNumber].current_floor<item.source){
	            lift_states[liftNumber].current_floor++;
	            //console.log("current floor of " +liftNumber+" is "+lift_states[liftNumber].current_floor);
	        	while(item.destination<=lift_states[liftNumber].current_floor){
	                queue_lifts_up[liftNumber].deq();
	                lift_states[liftNumber].count--;
	                if(queue_lifts_up[liftNumber].isEmpty()===true){
	                	//console.log("point1");
	                    lift_states[liftNumber].direction===0;
	                    break;
	                }
	            }
            }
            var n=queue_lifts_up[liftNumber].size();
            if(flag==true){
            	console.log("current floor of the lift is"+lift_states[liftNumber].current_floor);
            	lift_states[liftNumber].current_floor++;
            	flag=false;
            	flag2=true;
            }
            //console.log("size of temp is "+n);
            var temp=queue_lifts_up[liftNumber];
            var myqueue=new PriorityQueue(function(a, b) {
			    if(a.source==b.source) return b.destination-a.destination;
			    return b.source-a.source;
			})

            while(queue_lifts_up[liftNumber].isEmpty()==false){
            	var intemp=queue_lifts_up[liftNumber].deq();
            	myqueue.enq(intemp);
            	if(intemp.source==lift_states[liftNumber].current_floor){
            		upcoming_passengers[liftNumber]++;
            	}
            }
            //console.log("upcoming_passengers value is"+upcoming_passengers+"initial_direction is "+initial_direction);
            while(myqueue.isEmpty()==false){
            	var intemp=myqueue.deq();
            	queue_lifts_up[liftNumber].enq(intemp);
            }
            if(upcoming_passengers[liftNumber]>0){
            	lift_states[liftNumber].direction=0;
            	initial_direction[liftNumber]=1;
            }
            if(lift_states[liftNumber].current_floor>=item.source){
            	if(upcoming_passengers[liftNumber]==0)
            	lift_states[liftNumber].current_floor++;
            	if(flag2==true){
            		flag2=false;
            		lift_states[liftNumber].current_floor--;
            	}
            	while(item.destination<=lift_states[liftNumber].current_floor){
	                queue_lifts_up[liftNumber].deq();
	                lift_states[liftNumber].count--;
	                if(queue_lifts_up[liftNumber].isEmpty()===true){
	                    lift_states[liftNumber].direction===0;
	                    break;
	                }
	            }
            }
    	}

    	else if(lift_states[liftNumber].direction==2){
    		initial_direction[liftNumber]=2;
    		var item=queue_lifts_down[liftNumber].peek();
    		if(lift_states[liftNumber].current_floor>item.source){
	            lift_states[liftNumber].current_floor--;
	        	while(item.destination>=lift_states[liftNumber].current_floor){
	                queue_lifts_down[liftNumber].deq();
	                lift_states[liftNumber].count--;
	                if(queue_lifts_down[liftNumber].isEmpty()===true){
	                    lift_states[liftNumber].direction===0;
	                    break;
	                }
	            }
            }
            var n=queue_lifts_down[liftNumber].size();
            //console.log("size of temp is "+n);
            var temp=queue_lifts_down[liftNumber];
            var myqueue=new PriorityQueue(function(a, b) {
			    if(a.source==b.source) return b.destination-a.destination;
			    return b.source-a.source;
			})

            while(temp.isEmpty()==false){
            	var intemp=temp.deq();
            	myqueue.enq(intemp);
            	if(intemp.source==lift_states[liftNumber].current_floor){
            		upcoming_passengers[liftNumber]++;
            	}
            }
            while(myqueue.isEmpty()==false){
            	var intemp=myqueue.deq();
            	temp.enq(intemp);
            }
            if(upcoming_passengers[liftNumber]>0){
            	lift_states[liftNumber].direction=0;
            	initial_direction=2;
            }
            if(lift_states[liftNumber].current_floor<=item.source){
            	if(upcoming_passengers[liftNumber]==0)
            	lift_states[liftNumber].current_floor--;

            	while(item.destination>=lift_states[liftNumber].current_floor){
	                queue_lifts_down[liftNumber].deq();
	                lift_states[liftNumber].count--;
	                if(queue_lifts_down[liftNumber].isEmpty()===true){
	                    lift_states[liftNumber].direction===0;
	                    break;
	                }
	            }
            }
    	}
        else{
            if(upcoming_passengers[liftNumber]>0){
            	upcoming_passengers[liftNumber]--;
            	//console.log("upcoming_passengers value is"+upcoming_passengers+"initial_direction is "+initial_direction);
            	if(upcoming_passengers[liftNumber]==0){
            		flag=true;
            		lift_states[liftNumber].direction=initial_direction[liftNumber];
            		//console.log("direction of the lift updated back"+liftNumber);
            	}
            }
        }
    }
}
 
var interval = setInterval(func,1000);



 var elevatorNumber;
 var userid;
 var direction;

router.get('/getLift/', function (req, res) {

  var source=req.query.source;
  var destination=req.query.destination;

  console.log("log:"+source+destination);

selectlift(source, destination);
//var response = { 'lift_states':lift_states}
  //res.send(JSON.stringify(response));
  /*
 //calculation
 elevatorNumber = 2;
 userid = 1;
 direction = 'up';
 //-------

 response = { 'elevatorNumber':elevatorNumber, 'userid':userid, 'direction':direction};
 res.send(JSON.stringify(response));*/

});

router.get('/getElevatorInfo/', function (req, res) {

var response = { 'lift_states':lift_states };
  res.send(JSON.stringify(response));
  /*
 //calculation
 elevatorNumber = 2;
 userid = 1;
 direction = 'up';
 //-------

 response = { 'elevatorNumber':elevatorNumber, 'userid':userid, 'direction':direction};
 res.send(JSON.stringify(response));*/

});

router.get('/getCurrentFloor/', function (req, res) {

  var source=req.query.source;
  var destination=req.query.destination;

  console.log("log:"+source+destination);


 //calculation
 /*elevatorNumber = 2;
 userid = 1;
 direction = 'up';
 //-------
 var currentFloor= source;
 var myVar = setInterval(function(){ 
 	currentFloor++;
 	if(currentFloor==destination)
 		{
            clearInterval(myVar);
        }     
 },1000);*/

});



module.exports = router;
