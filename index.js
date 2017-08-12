
var deleted= [];


// time display function 
setInterval( function(){
    var months = [    'January','February','March'    ,'April'    ,'May'    ,'June'    ,'July',    'August',    'September'    ,'October',    'November'    ,'December']
    var date = new Date();
    $('#date').text(date.getDay()+ ' ' +months[date.getMonth()]+ ' ' +date.getFullYear()+' => ' + date.getHours()+' : ' +date.getMinutes()+' : ' + date.getSeconds());
},1000)



var doneTasks = 0;
var updateAvg = function  (){
	var all = document.getElementsByTagName('li').length;
	var avg = doneTasks+"/"+all;
	$('#sec').html("<div>you finished : " + avg +" of your tasks .</div>")
}

    


// done tasks function

$('ul').on("click",'.fa-thumbs-o-up',function(){
	$(this).parent().toggleClass('completed');
	if ($(this).parent().hasClass('completed')){
		doneTasks++;
	} else {
		doneTasks--;
	}
	
	updateAvg();
});

// delete function 
function deleteMe ($dele){
	console.log('delete function passed value ',$dele);
	console.log('delete function: ' ,$dele.data('val'),$dele.find('i.imp').data('val'))
	deleted.push( { value: $dele.data('val') ,  importance: $dele.find('i.imp').data('val')  } );
		if ($dele.hasClass('completed')){
			doneTasks -- ;
		}
		$dele.remove();
		updateAvg();
}


// delete  event 
$('ul').on("click","span",function(ev){
	console.log('to delete event : ', $(this).parent());
	$(this).parent().fadeOut(500,deleteMe ($(this).parent()));
	ev.stopPropagation();
});



function appending(task,importance){
			$("ul").append("<li class='inComplete' data-val="+task.split(' ').join('-')+"><span class='fa fa-times'></span> " + task  +  '<i class = "fa fa-thumbs-o-up"> </i><i class="imp" data-val="'+ importance +'">'+importance+'</i></li>')
			updateAvg();
}


//  add task function 
$(".fa-plus-square").on("click",function(){
		var newTask = $('input[type="text"]').val()
		var importance = $('select').val();
		$('input[type="text"]').val("");
		appending(newTask,importance);
})


//reset function
$('button[type="reset"]').on('click',function(ev){
	var arr = document.getElementsByTagName('li');
	console.log('delete arr.length :' ,arr.length);
	while (arr.length > 0){
		
		deleteMe($('#allList li:first-child'));
		//console.log('delete element ', del);
		//console.log('typeof element ',typeof del);
		arr = document.getElementsByTagName('li');
	}
	updateAvg();
	ev.stopPropagation();	
})


// undo delete function 
$('#undo').on('click',function(){
	if(deleted.length !== 0 ){
		console.log('undo delete : ', deleted[deleted.length-1].value.split('-').join(' ') ,deleted[deleted.length-1].importance )
		appending(deleted[deleted.length-1].value.split('-').join(' ') ,deleted[deleted.length-1].importance );
		deleted.pop();
	} else {
		alert("nothing to undo");
	}
	
})

