
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
    var months = ['January','February','March','April','May','June','July','August','September','October','November','December']
    var date = new Date();
    $('#date').text(date.getDay()+ ' ' +months[date.getMonth()]+ ' ' +date.getFullYear()+ ' / ' + date.getHours()+' : ' +date.getMinutes()+' : ' + date.getSeconds());
},1000)



//var doneTasks = 0;
var updateAvg = function  (){
	var all = document.getElementsByTagName('li').length;
	var avg = currentUser.doneTasks+"/"+all;
	$('#sec').html("<div>you finished : " + avg +" of your tasks .</div>")
}

    


// done tasks function

$('ul').on("click",'.fa-thumbs-o-up',function(){
	if  ($('h1').hasClass('deletedMode')) {
		alert('restore item to mark as completed')
	} else {
		$(this).parent().toggleClass('completed');
		if ($(this).parent().hasClass('completed')){
			currentUser.doneTasks++;
		} else {
			currentUser.doneTasks--;
		}
		
		updateAvg();
	}
});

// delete function 
function deleteMe ($dele){

	var deletedTask =  { task: $dele.data('val').split('-').join(' ') ,  importance: $dele.find('i.imp').data('val')  }  
	console.log('delete function: ' , deletedTask )
	currentUser.deletedTasks.push( deletedTask );


	// this should be merged with search function and deleted later 
	// this is to get the deleted tasks out of tasks arr ;
	var k ;
	for ( k=0;k<currentUser.tasks.length ; k++){
		if (JSON.stringify(deletedTask) === JSON.stringify(currentUser.tasks[k])){
			break;
		}
	}


	currentUser.tasks.splice(k , 1 );

		if ($dele.hasClass('completed')){
			currentUser.doneTasks -- ;
		}
		$dele.remove();
		updateAvg();
}


// delete  event 
$('ul').on("click","span",function(ev){
	console.log('to delete event : ', $(this).parent());

	if ( $('h1').hasClass('deletedMode') ){
		restore ($(this).parent().data('val').split('-').join(' ') ,$(this).parent().find('i.imp').data('val')  )
	} else {
		$(this).parent().fadeOut(500,deleteMe ($(this).parent()));
	}

	ev.stopPropagation();
});



function appending(task,importance){
			$("ul").append("<li class='inComplete' data-val="+task.split(' ').join('-')+"><span class='fa fa-times'></span> " + task  +  '<i class = "fa fa-thumbs-o-up"> </i><i class="imp" data-val="'+ importance +'">'+importance+'</i></li>')
}



//  add task function 
$(".fa-plus-square").on("click",function () {
	var newTask = $('#adder').val() ;
	var importance =  $('select').val() ;

	currentUser.tasks.push({ task : newTask , importance : importance })
		$('#adder').val("");
		appending(newTask,importance);
		updateAvg();

});


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



function restore (task , importance ){
	console.log('restore function')
	var deleted = currentUser.deletedTasks ;
	var taskObj =  {  task :task ,importance : importance  };
		console.log('restor : ', taskObj )
		currentUser.tasks.push(  taskObj  )
		

		// this should be merged with search function and deleted later 
		// this is to get the deleted tasks out of tasks arr ;
		var k ;
		for ( k=0;k<deleted.length ; k++){
			if (JSON.stringify(taskObj) === JSON.stringify(deleted[k])){
				console.log('found :', taskObj , 'at k = ' , k)
				break;
			}
		}

		currentUser.deletedTasks.splice( k,1 );
		if (! ($('h1').hasClass('deletedMode'))  ){
			appending(taskObj.task , taskObj.importance );
		} else {
			showDeletedTasks();
		}
}

// undo delete function 
$('#undo').on('click',function(ev){
	console.log('undo event ')
	var deleted = currentUser.deletedTasks ;
	if (deleted.length === 0 ){
		alert ('nothing to undo')
		return 'nothing to undo'
	}

	restore( deleted[deleted.length-1].task , deleted[deleted.length-1].importance  );
	updateAvg();
	ev.stopPropagation();
})


// undo all event 
$('#undo-all').on('click',function(ev){
	var deleted = currentUser.deletedTasks ;
	console.log('restoring :' , deleted.length , ' items');
	while (deleted.length > 0){
		restore(deleted[deleted.length-1].task , deleted[deleted.length-1].importance);
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

	obj.newTasksId = idCreator();

	obj.id = newId();
	obj.name = 'default';
	obj.pass = 'password';
	obj.tasks = [{task : 'the first task is here' , importance : 'important'}];
	obj.deletedTasks = [];
	obj.doneTasks = 0;

	obj.showMyTasks = showMyTasks ;
	obj.changeUserData = changeUserData;
	obj.changeUserName = changeUserName;
	obj.changeUserPassword= changeUserPassword;
	obj.showDeletedTasks = showDeletedTasks;

	return obj;
}

var showTasks = function (arr) {
	$('#allList').html('');
	for (var i=0 ; i < arr.length ; i++){
		appending( arr[i].task , arr[i].importance );
	}
}

// for user 
var showMyTasks = function (){
	console.log('show my tasks function');
	$('#all>h1 , footer ').removeClass('deletedMode');
	$('select , footer button, #sec , #adder  ,h1 i').show();
	$('li span').toggleClass('fa-times');
	$('li span').html('');
	$('h1').css('text-align','left');
	showTasks(currentUser.tasks );
	/*$('li span').css('width','0px');*/
	updateAvg();
}
//for user 
var showDeletedTasks = function (){
	console.log('show deleted tasks function');
	$('#all>h1 , footer').addClass('deletedMode');
	$('select , footer button , #sec , #adder ,h1 i').hide();
	/*$('li span').toggleClass('fa-times');*/
	$('h1').css('text-align','center');
	$('li span').html('restor me');
	$('li span').css('width','40px');
	$('#undo-all').show();
	showTasks(currentUser.deletedTasks );
	/*.fa-thumbs-o-up*/
}
//for user 
function changeUserName(){
	console.log('change user name function')
	var name = $('#newName').val();
	if (name !== undefined)
		this.name = name;
	$('nav span').text(this.name);
	 $('#newName').val('')
}
//for user 
function changeUserPassword(){
	console.log('change user password function')
	if ($('#oldPass').val() === this.pass ){
		this.pass = $('#newPass').val();
	} else {
			alert('invalid old password')
	}
	$('#oldPass').val('');
	$('#newPass').val('');
}


//for user
//change my data modal :
function changeUserData (){
	console.log('show user data function / showing modal');
	$("#myModal2").modal();
}


//add user function
var addUser = function(){
	console.log('adding new user , new user function')
	var obj = user();
	obj.name = prompt('type new user name :');
	if (obj.name === null){
		return 'creating a new account canceled';
	}
	obj.pass = prompt('type new password :');

	allUsers.push(obj);
	setUser(obj) ;
};


// change Current User
var setUser = function (obj){
	currentUser = obj ;

	showMyTasks();

	$('nav span').text(currentUser.name);
}


//show modal of all users  
function showAllUsers (func){
	console.log('show all users functoin')
	$('tbody').text('');
	allUsers.forEach(function(ele){
		$('tbody').append('<tr data-val=" '+ele.id+' " ><td style="padding-right:50px"> '+ele.id+' </td><td style="padding-right:50px"> '+ele.name+' </td><td><button class="'+func+'"> choose me </button></td></tr>');
	})
	
    $("#myModal").modal();
}
$('td').css('margin','10px')

// the delete function 
$('tbody').on('click','.toDelete',function(){
	console.log('the delete user function');
	if ($(this).parent().parent().data('val') === currentUser.id){
		alert('you can\'t delete current user ');
		return 'un-allowed attempt';
	}
		var testPassword =prompt('enter password for chosen user  :');
		var index = (search(allUsers , $(this).parent().parent().data('val'),1));
		if (index !== undefined){
			if (allUsers[index].pass === testPassword ){
				allUsers.splice(index,1);
				showAllUsers( 'toDelete' );
			} else {
				alert("passwords didn't match");
			}
		} else { 
			console.log('error, user not found');
		}
})



// choose a user to delete 
var deleteUser = function(){
		console.log('delete user event ')
		showAllUsers("toDelete");
}


//search using id , if i is passed as a parameter return index , else return the object 
//reseve arr of obj with key called id 
function search(arr , ID,i){
	var returnMe ;
	console.log('search function for id :' , ID);
	if (typeof ID === 'string'){
		ID = JSON.parse(ID);
	}
		arr.forEach(function(object,ind){
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

//change user event  and function
$('tbody').on('click','.changeUser',function(){
		console.log('the change user event and function ..');
		var obj = search(allUsers , $(this).parent().parent().data('val'));
		if (currentUser === obj){
			return 'you are already logged in';
		}
		var testPassword =(prompt('enter password to log in :'));
		
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
