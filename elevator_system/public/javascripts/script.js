
$(document).ready(function() {
	
});
function test(source, destination){
	alert("Hello"+source+","+destination);
	$.get('/getLift/',{ 'source':source, 'destination':destination },function(data){
		alert(data);
		//data = $.parseJSON(data);
		 
	});
}



