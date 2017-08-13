
var deleted= [];


$('.fa-cog').on('click',function () {
	console.log('showing the side bar')
	
	$('aside').toggle(
	function() {
	    $(this).css('left', '0')
	}, function() {
	    $(this).css('left', '0')
	})
//	ev.stopPropagation();
})


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
}


//  add task function 
$(".fa-plus-square").on("click",function(){
		var newTask = $('input[type="text"]').val()
		var importance = $('select').val();
		$('input[type="text"]').val("");
		appending(newTask,importance);
		updateAvg();
})


//reset function
$('button[type="reset"]').on('click',function(ev){
	var arr = document.getElementsByTagName('li');
	var numOfEle = arr.length ;
	console.log('delete arr.length :' , numOfEle);
	while (numOfEle > 0){
		var del = $('#allList li:first-child');
		console.log('delete element ', del);
		deleteMe(del);
		numOfEle--;
	}
	updateAvg();
	ev.stopPropagation();	
})



function restore (){
	if(deleted.length !== 0 ){
		console.log('undo delete : ', deleted[deleted.length-1].value.split('-').join(' ') ,deleted[deleted.length-1].importance )
		appending(deleted[deleted.length-1].value.split('-').join(' ') ,deleted[deleted.length-1].importance );
		deleted.pop();
	} else {
		alert("nothing to undo");
	}
	updateAvg();
}

// undo delete function 
$('#undo').on('click',function(ev){
	restore();
	ev.stopPropagation();
})

$('#undo-all').on('click',function(ev){
	console.log('restoring :' , deleted.length , ' items');
	while (deleted.length > 0){
		restore();
	}
	updateAvg();
	ev.stopPropagation();	

})

function idCreator(){
	var n = 0;
	function num(){
		return n ++;
	}
	return num;
}
var newId = idCreator();

allUsers = [];


function user (){
	var obj = {};

	obj.id = newId();
	obj.name = 'default';
	obj.pass = 'password';
	obj.tasks = [];
	obj.deletedTasks = [];

	obj.showMyTasks = showMyTasks ;
	obj.changeUserName = changeUserName;
	obj.showDeletedTasks = showDeletedTasks;

	return obj;
}

// for user 
var showMyTasks = function (){
	
}
//for user 
var showDeletedTasks = function (){

}
//for user 
function changeUserName(){
	console.log('change user name function')
	var name = prompt('type new user name :');
	if (name !== undefined)
		this.name = name;
	$('nav span').text(this.name);
}

var addUser = function(){
	var obj = user();

	obj.name = prompt('type new user name :');
	obj.pass = prompt('type new password :');

	allUsers.push(obj);
	setUser(obj) ;
};


// change Current User
var setUser = function (obj){
	currentUser = obj ;
	$('nav span').text(currentUser.name);
}


//show modal of all users  
function showAllUsers (func){
	console.log('show all users functoin')
	$('tbody').text('');
	allUsers.forEach(function(ele){
		$('tbody').append('<tr data-val="'+ele.id+'"><td >'+ele.id+'</td><td>'+ele.name+'</td><td><button class="'+func+'">choose me</button></td></tr>');
	})
    $("#myModal").modal();
}


// the delete function 
$('tbody').on('click','.toDelete',function(){
	console.log('the delete function')
			var testPassword =prompt('enter password to log in :');
			var index = (search($(this).parent().parent().data('val'),1));
			if (index !== undefined){
				if (allUsers[index].pass === testPassword ){
					allUsers.splice(index,1);
				} else {
				alert("passwords didn't match");
				}
			} else { 
				console.log('error');
			}
})



// choose a user to delete 
var deleteUser = function(){

		showAllUsers("toDelete");
}


//search uding id , if i is passed return index , else return the object 
function search(ID,i){
	var returnMe ;
	console.log('search function for id :' , ID);
		allUsers.forEach(function(object,ind){
			if (ID === object.id){
				console.log('object found at index ',ind)
				if (i !== undefined){
					returnMe = ind;
				} else {
					returnMe = object ;
				}
			}
		})	
	return returnMe ;
}

$('tbody').on('click','.changeUser',function(){
		console.log('the change user function ..')
		var testPassword =(prompt('enter password to log in :'));
		var obj = search($(this).parent().parent().data('val'));
		if (obj !== undefined){
			if (obj.pass === testPassword ){
				setUser(obj);
			} else {
			alert("passwords didn't match");
			}
		} else { 
			console.log('error');
		}
})


//change current user 
function changeCurrentUser(ev){
	console.log('changeCurrentUser func')
	showAllUsers("changeUser");
}



var currentUser = user();
allUsers.push(currentUser);
setUser(currentUser)
