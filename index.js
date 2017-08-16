function setCookie(cname, cvalue, exdays) {
    var d = new Date();
    d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
    var expires = "expires="+d.toUTCString();
    document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}
/*function setCookie(cname, cvalue, exdays) {
    var d = new Date();
    d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
    var expires = "expires="+d.toUTCString();
    document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}
*/
function getCookie(cname) {
    var name = cname + "=";
    var ca = document.cookie.split(';');
    for(var i = 0; i < ca.length; i++) {
        var c = ca[i];
        // i think trim here works insted of the while loop 
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
        }
    }
    return "";
}



$('body').on('click',':not(aside)',function(ev){
	if ($('aside').hasClass('here')){
		console.log('hiding the side bar');
		$('aside').toggle(
		function() {
		    $(this).css('left', '0')
		}, function() {
		    $(this).css('left', '0')
		});
		$('aside').toggleClass('here');
		$('.fa-cog').removeClass('fa-spin');
	}
	ev.stopPropagation();
})

$('nav').on('click',function (ev) {
	$('aside').toggle(
	function() {
	    $(this).css('left', '0')
	}, function() {
	    $(this).css('left', '0')
	});
	$('aside').toggleClass('here');
	if ( $('aside').hasClass('here') ){
		console.log('showing the side bar');
		$('.fa-cog').addClass('fa-spin');
	} else {
		console.log('hiding the side bar');
		$('.fa-cog').removeClass('fa-spin');
	}
	ev.stopPropagation();
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
	var avg = (currentUser.doneTasks / all ).toFixed(2);
	$('#sec').html("<div class='fa fa-bolt '>your progress : <progress min='0' max='1' value=''></div>");
	$('progress').val(avg);
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

// delete  a task function 
function deleteMe ($dele){
	var deletedTask =  { task: $dele.data('val').split('-').join(' ') ,  importance: $dele.find('.imp').data('val')  }  
	console.log('delete a task function: ' , deletedTask )
	currentUser.deletedTasks.push( deletedTask );


	// this should be merged with search function and deleted later 
	// this is to get the deleted tasks out of tasks arr ;
	var k ;
	for ( k=0;k<currentUser.tasks.length ; k++){
		if (JSON.stringify(deletedTask) === JSON.stringify(currentUser.tasks[k])){
			break;
		}
	}

	
	if (currentUser.tasks.length === 0  ){
		$('#empty').show();
	}		//return 'no tasks to show';
	 

	currentUser.tasks.splice(k , 1 );

		if ($dele.hasClass('completed')){
			currentUser.doneTasks -- ;
		}
		$dele.remove();
		//currentUser.showMyTasks();
		updateAvg();
}


// delete  event 
$('ul').on("click",".fa-times",function(ev){
	console.log('to delete event : ' ,$(this).parent().data('val'),$(this).parent().find('.imp').data('val'));

	if ( $('h1').hasClass('deletedMode') ){
		$(this).parent().fadeOut(500,restore ($(this).parent().data('val').split('-').join(' ') ,$(this).parent().find('.imp').data('val')  ));
		if ( currentUser.deletedTasks.length === 0 ) {
			console.log('deletedTasks.length === 0 ');
			$('#empty').show();
		}
	} else {
		$(this).parent().fadeOut(500,deleteMe ($(this).parent()));
		if ( currentUser.tasks.length === 0 ) {
			console.log('tasks.length === 0');
			$('#empty').show();
		}
	}

	ev.stopPropagation();
});



function appending(task,importance,mode='delete'){
			$("ul").append("<li class='inComplete' data-val="+task.split(' ').join('-')+"><i class='fa fa-times del-restore' style='font-size:10px'> "+mode+" </i>" + task  +  '<i class = "fa fa-thumbs-o-up"> </i><strong class="imp" data-val="'+ importance +'">'+importance+'</strong></li>')
}



//  add task function 
$("h1").on("click",'.fa-plus-square',function () {
	var newTask = $('#adder').val() ;
	var importance =  $('select').val() ;

	currentUser.tasks.push({ task : newTask , importance : importance })
		$('#adder').val("");
		appending(newTask,importance);
		updateAvg();
		$('#empty').hide();
		//currentUser.showMyTasks();

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
				console.log('found :', taskObj , 'at index = ' , k)
				break;
			}
		}

		currentUser.deletedTasks.splice( k,1 );
		if  (!($('h1').hasClass('deletedMode'))) {
			appending(taskObj.task , taskObj.importance );
			$('#empty').hide();
			
			//showDeletedTasks();
		} else {
			showDeletedTasks();
			//showMyTasks();
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
	obj.tasks = [];
	obj.deletedTasks = [];
	obj.doneTasks = 0;

	obj.showMyTasks = showMyTasks ;
	obj.changeUserData = changeUserData;
	obj.changeUserName = changeUserName;
	obj.changeUserPassword= changeUserPassword;
	obj.showDeletedTasks = showDeletedTasks;

	return obj;
}

var showTasks = function (arr , mode='delete') {
	if (arr.length === 0 ){
		$('#allList').html('');
		$('#empty').show();
		return 'no tasks to show';
	} else {
		$('#empty').hide();
		$('#allList').html('');
		for (var i=0 ; i < arr.length ; i++){
			appending( arr[i].task , arr[i].importance , mode );
		}
	}
}

// for user 
var showMyTasks = function (){
	$('h1').text('MY TO DO LIST');
	$('h1').append('<i class="fa fa-plus-square" ></i>')
	console.log('show my tasks function');
	$('#all>h1 , footer ').removeClass('deletedMode');
	$('select , footer button, #sec , #adder  ,h1 i').show();
	/*$('li span').toggleClass('fa-times');*/
	$('li span strong').html('');
	$('h1').css('text-align','left');
	$('h1').css('background','#1d5660');
	$('footer').css('background','#1d5660');
	/*$('.del-restore').text('');*/
	showTasks(currentUser.tasks );
	if (  $('li span').hasClass('fa-heart-o')  )   
	{
		$('li span').removeClass('fa-heart-o');
		$('li span').addClass('fa-times');
	}
	/*$('li span').css('width','0px');*/
	$('ul + p').css('color','green');
	$('ul + p').css('border-color','green');
	updateAvg();
}
//for user 
var showDeletedTasks = function (){
	console.log('show deleted tasks function');
	$('#all>h1 , footer').addClass('deletedMode');
	$('select , footer button , #sec , #adder ,h1 i').hide();
/*	$('li span').toggleClass('fa-times');
*/	$('h1').text('DELETED TASKS');
	$('h1').css('text-align','center');
	$('h1').css('background','red');
	$('footer').css('background','red');
	//$('li span').css('width','100px');
	$('li span').css('font-size','13px');
	/*$('li span').css('padding-top','10px');*/
/*	$('#del-restore').css('font-size','10px');
*/	$('#undo-all').show();
	showTasks(currentUser.deletedTasks ,'restore');
	// $('.del-restore').text('restore');
	if ($('li span').hasClass('fa-times')) {
		$('li span').removeClass('fa-times');
		$('li span').addClass('fa-heart-o');
	}
	$('ul + p').css('color','red');
	$('ul + p').css('border-color','red');
	/*.fa-thumbs-o-up*/
}
/*
$('#del-restore').css('font-size','5px') ;

*/
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
	console.log('change user password function');
	if ($('#oldPass').val() === this.pass ){
		console.log('passwords matched')
		this.pass = $('#newPass').val();
		$('#oldPass + p').text('password changed');
		$('#oldPass + p').css('color','green');
		$('#oldPass + p').show();

		$('#oldPass').val('');
		$('#newPass').val('');

	} else {
			$('#oldPass + p').text('incorrect password , please re-type old password correctly, you typed : " '+ $('#oldPass').val() + ' "');
			$('#oldPass + p').css('color','red');
			$('#oldPass + p').show();
			return 'old password didn\'t change';

	}
	
}


//for user
//change my data modal :
function changeUserData (){
	console.log('show the "change user data " function / showing modal');
	$('#oldPass').val('');
	$('#newPass').val('');
	$('#oldPass + p').hide();
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

	$('#userName').text(currentUser.name);
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

// the delete  user function 
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

 $('li:hover span.fa-times').css('width','40px');



var currentUser = user();
allUsers.push(currentUser);
setUser(currentUser)

