/*console.log('hello');
function changeTaskDecoration() {
	console.log('hi')
	if ($(this).parent().css('fontWeight') !==  'bold') {
		console.log('if ')
		$(this).css('fontWeight' ,'bold');
	} else {
		console.log('else')
		$(this).css('fontWeight' , 'normal');
		$(this).css('color' , 'blue');
	}
}*/

var deleted= [];



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

    



$('ul').on("click",'.fa-thumbs-o-up',function(){
	$(this).parent().toggleClass('completed');
	if ($(this).parent().hasClass('completed')){
		doneTasks++;
	} else {
		doneTasks--;
	}
	
	updateAvg();
});


$('ul').on("click","span",function (ev){
	$(this).parent().fadeOut(500,function(){ 
		deleted.push( { value: $(this).data('val') ,  importance: $(this).find('i.imp').data('val')  } );
		if ($(this).hasClass('completed')){
			doneTasks -- ;
		}
		$(this).remove();

		updateAvg();
	})
	
	ev.stopPropagation();
});

function appending(task,importance){
			$("ul").append("<li class='inComplete' data-val="+task.split(' ').join('-')+"><span class='fa fa-times'></span> " + task  +  '<i class = "fa fa-thumbs-o-up"> </i><i class="imp" data-val="'+ importance +'">'+importance+'</i></li>')
			updateAvg();
}

$(".fa-plus-square").on("click",function(){

		var newTask = $('input[type="text"]').val()
		var importance = $('select').val();
		$('input[type="text"]').val("");
		appending(newTask,importance);
})

$('button[type="reset"]').on('click',function(ev){
	$('ul').text('');
})


$('#undo').on('click',function(){
    
	if(deleted.length !== 0 ){
		appending(deleted[deleted.length-1].value.split('-').join(' ') ,deleted[deleted.length-1].importance );
		deleted.pop();
	} else {
		alert("nothing to undo");
	}
})


