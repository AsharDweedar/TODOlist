function setCookie(cname, cvalue, exdays = 365) {
    var d = new Date();
    d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
    var expires = "expires="+d.toUTCString();
    document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}

function  delCookie(cname) {
    
    setCookie(cname , "" , new Date());
}

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

function checkCookie(cname) {
    return (getCookie(cname) !== "") ; 
} 

//hide the aside on click 
$('body').on('click',':not(aside)',function(ev){
	if ($('aside').hasClass('here')){
		//console.log('hiding the side bar');
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

//show hide aside 
$('nav').on('click',function (ev) {
	$('aside').toggle(
	function() {
	    $(this).css('left', '0')
	}, function() {
	    $(this).css('left', '0')
	});
	$('aside').toggleClass('here');
	if ( $('aside').hasClass('here') ){
		//console.log('showing the side bar');
		$('.fa-cog').addClass('fa-spin');
	} else {
		//console.log('hiding the side bar');
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


function searchTasks (arr , $tag){
	var returnMe ;

	arr.forEach(function(object,ind){
		//console.log(object, ind)
		//console.log($tag.data('val'))

		if ( $tag.data('val').split('-').join(' ') === object.task){
			//console.log(object.task);
			//console.log('object found at index ',ind)
			returnMe = ind ;
		}
	})	
	return returnMe ;
}


/*
 $('.fa-trash::before').css('color', 'white');
 $('.fa-trash::before').css('font-size', '15px');
 
 $('.fa-times::before').css('color', 'white');
 $('.fa-times::before').css('font-size', '15px');
 
*/
//update average => assign value to progress tag
var updateAvg = function  (){
	//console.log('update AVG function')
	var all = document.getElementsByTagName('li').length;
	
	var doneTasks = 0;
	for (var c=0; c<currentUser.tasks.length;c++){
		////console.log('c=',c , '\ncurrentUser.tasks[c].done:',currentUser.tasks[c].done);
		if (currentUser.tasks[c].done){
			//console.log('inside condition');
			doneTasks++;
		}
	}

	var avg = (doneTasks / all ).toFixed(2);
	$('#sec').html("<div class='fa fa-bolt '>your progress :</div> <progress min='0' max='1' value='' ></progress>");
	$('progress').val(  isNaN(avg)? 0 : avg  );
}

function updateCSS (){
	$('.inComplete').css('color','#0c272c');
	$('.inComplete').css('text-decoration','none');
	$('.completed').css('color','darkgray');
	$('.completed').css('text-decoration','line-through');
   }




// done tasks function
$('ul').on("click",'.fa-thumbs-o-up',function(){
	if  ($('h1').hasClass('deletedMode')) {
		alert('restore item to mark as completed');
	} else {
		$(this).parent().toggleClass('completed');

		//change object connected to this tag

		//console.log(searchTasks(currentUser.tasks , $(this).parent()));
		//console.log(currentUser.tasks );

		currentUser.tasks[searchTasks(currentUser.tasks , $(this).parent())].done = $(this).parent().hasClass('completed');
		
		updateCSS();
		updateAvg();
	}
});


// delete for ever function
$('ul').on("click",'.fa-trash',function(){

	$(this).parent().fadeOut(500,function(){
		$(this).remove();
	})

	currentUser.deletedTasks.splice(searchTasks(currentUser.deletedTasks , $(this).parent()) , 1 ); 

	if (currentUser.deletedTasks.length === 0 ){
			$('#empty').show();
		}
		updateCSS();
});


// delete  a task function  => recieve a task taaaaag
//add it to deleted array and remove it from tasks array 
//handle showing\hiding it from the window 
function deleteMe ($dele){
	var deletedTask =  { task: $dele.data('val').split('-').join(' ') ,  importance: $dele.find('.imp').data('val') ,done: $dele.hasClass('completed') }  
	//console.log('delete a task function: ' , deletedTask )
	currentUser.deletedTasks.push( deletedTask );

	// this is to get the deleted tasks out of tasks arr ;
	var k ;
	for ( k=0;k<currentUser.tasks.length ; k++){
		if (JSON.stringify(deletedTask) === JSON.stringify(currentUser.tasks[k])){
			break;
		}
	}

	if (currentUser.tasks.length === 0  ){
		$('#empty').show();
	}

	currentUser.tasks.splice(k , 1 );

	$dele.remove();
	updateAvg();
}



// delete  event  => calls the restore or the delete function 
//handle showing the #empty paragraph 
$('ul').on("click",".fa-times",function(ev){
	//console.log('to delete event : ' ,$(this).parent().data('val'),$(this).parent().find('.imp').data('val'),$(this).parent().hasClass('completed') );

	var obj = {
		task : $(this).parent().data('val').split('-').join(' ') ,
		importance : $(this).parent().find('.imp').data('val'),
		done : $(this).parent().hasClass('completed') 
	}
	//deleted mode 
	if ( $('h1').hasClass('deletedMode') ){
		$(this).parent().fadeOut(500,restore ( obj ));
		if ( currentUser.deletedTasks.length === 0 ) {
			$('#empty').show();
		}
	} else { 

	//normal tasks mode 
		$(this).parent().fadeOut(500,deleteMe ($(this).parent()));
		if ( currentUser.tasks.length === 0 ) {
			$('#empty').show();
		}
	}

	ev.stopPropagation();
});



function appending(obj){
	var deletedMode = $('h1').hasClass('deletedMode') ;

	var leftFunctionality = (deletedMode?'restore':'delete' )
	var completedClass = (obj.done?'completed': '');
	var rightSympole =( deletedMode ? 'fa-trash'  : 'fa-thumbs-o-up');
	var rightFunctionality = (deletedMode? 'delete':'done' )

	$("ul").append("<li class='inComplete "+completedClass+"' data-val="+obj.task.split(' ').join('-')+"><i class='fa fa-times' style='font-size:10px'> "+leftFunctionality+" </i>" + obj.task  +  '<i class = "fa '+rightSympole+'" style="font-size:10px">'+rightFunctionality +' </i><strong class="imp" data-val="'+ obj.importance +'">'+obj.importance+'</strong></li>');
	updateCSS();
}



//  add task event and function 
//add to tasks array 
//handle viewing on window 
$("h1").on("click",'.fa-plus-square',function () {
	var newTask = $('#adder').val().trim() ;
	var importance =  $('select').val() ;

	currentUser.tasks.push({ task : newTask , importance : importance , done : false })
		$('#adder').val("");
		appending({task:newTask,importance:importance,done:false});
		updateAvg();
		$('#empty').hide();
});


//reset event and function
//send all tasks to deleted array 
$('button[type="reset"]').on('click',function(ev){
	var arr = document.getElementsByTagName('li');
	var numOfEle = arr.length ;
	//console.log('delete arr.length :' , numOfEle);
	while (numOfEle > 0){
		var $del = $('#allList li:first-child');
		//console.log('delete element ', $del.data('val'));
		deleteMe($del);
		numOfEle--;
	}
	updateAvg();
	ev.stopPropagation();	
})


//restore a task , recieve task info and add it to tasks arr , delete it from deleted arr 
function restore ( taskObj ){

	//console.log('restore function')
	var deleted = currentUser.deletedTasks ;

	//console.log('restor : ', taskObj )
	currentUser.tasks.push( taskObj )
		

	// this should be merged with search function and deleted later 
	// this is to get the deleted tasks out of tasks arr ;
	var k ;
	for ( k=0;k<deleted.length ; k++){
		if (JSON.stringify(taskObj) === JSON.stringify(deleted[k])){
			//console.log('found :', taskObj , 'at index = ' , k)
			break;
		}
	}
	currentUser.deletedTasks.splice( k,1 );
	if  (!($('h1').hasClass('deletedMode'))) {
		appending(taskObj);
		$('#empty').hide();
		
		//showDeletedTasks();
	} else {
		showDeletedTasks();
		//showMyTasks();
	}
}

// undo 'delete a task' event and function 
//call restore function
$('#undo').on('click',function(ev){
	//console.log('undo event ')
	var deleted = currentUser.deletedTasks ;
	var ind = deleted[deleted.length-1] ;
	if (deleted.length === 0 ){
		alert ('nothing to undo')
		return 'nothing to undo'
	}

	restore( ind );
	updateAvg();

	ev.stopPropagation();
})


// undo all event and function
//call restore function
$('#undo-all').on('click',function(ev){
	//console.log('restore all event')
	var deleted = currentUser.deletedTasks ;
	while (deleted.length > 0){
	var ind = deleted[deleted.length-1] ;
	//console.log('restoring :' , deleted.length , ' items');
		//debugger;
		//console.log('inside the while loop ',ind );
		restore(ind);
	}
	updateAvg();
	ev.stopPropagation();	
})


//create uniqe id each time 
function idCreator(){
	var n = 0;
	function num(){
		return n ++;
	}
	return num;
}


//id creatore for users 
var newId = idCreator();

//contain all users array 
allUsers = [];


//user object creatore 
function user (){
	var obj = {};

	obj.newTasksId = idCreator();

	obj.id = newId();
	obj.name = 'default';
	obj.pass = 'password';
	obj.tasks = [];
	obj.deletedTasks = [];
	//obj.doneTasks = doneTasks;

	obj.showMyTasks = showMyTasks ;
	obj.changeUserData = changeUserData;
	obj.changeUserName = changeUserName;
	obj.changeUserPassword= changeUserPassword;
	obj.showDeletedTasks = showDeletedTasks;

	return obj;
}




//show tasks in a spicific array 
var showTasks = function (arr , mode='delete') {
	if (arr.length === 0 ){
		$('#allList').html('');
		$('#empty').show();
		return 'no tasks to show';
	} else {
		$('#empty').hide();
		$('#allList').html('');
		for (var i=0 ; i < arr.length ; i++){
			appending( arr[i] );
		}
	}
}

// show tasks of current user 
var showMyTasks = function (){
	$('h1').text('MY TO DO LIST');
	$('h1').append('<i class="fa fa-plus-square" ></i>')

	//console.log('show my tasks function');
	$('#all>h1 , footer ').removeClass('deletedMode');
	$('select , footer button, #sec , #adder  ,h1 i').show();
	$('li span strong').html('');
	$('h1').css('text-align','left');
	$('h1').css('background','#1d5660');
	$('footer').css('background','#1d5660');

	showTasks(currentUser.tasks );

	if ($('li span').hasClass('fa-heart-o')) {
		$('li span').removeClass('fa-heart-o');
		$('li span').addClass('fa-times');
	}

	$('ul + p').css('color','green');
	$('ul + p').css('border-color','green');

	updateCSS();
	updateAvg();
}

//show deleted tasks for current user , enter deleted mode styles
var showDeletedTasks = function (){
	//console.log('show deleted tasks function');
	$('#all>h1 , footer').addClass('deletedMode');
	$('select , footer button , #sec , #adder ,h1 i').hide();
	$('h1').text('DELETED TASKS');
	$('h1').css('text-align','center');
	$('h1').css('background','red');
	$('footer').css('background','red');
	$('li span').css('font-size','13px');
	$('#undo-all').show();

	showTasks(currentUser.deletedTasks ,'restore');
	
	if ($('li span').hasClass('fa-times')) {
		$('li span').removeClass('fa-times');
		$('li span').addClass('fa-heart-o');
	}

	$('ul + p').css('color','red');
	$('ul + p').css('border-color','red');
	updateCSS();
}

//change 'current user' name inside the modal 'input tag' 
// 'this' means the user (this function is inside the user obj)
function changeUserName(){
	//console.log('change user name function')
	var name = $('#newName').val();
	if (name !== undefined)
		this.name = name;
	$('nav span#userName').text(this.name);
	 $('#newName').val('')
}

//change 'current user' password inside the modal 'input tag' 
// 'this' means the user (this function is inside the user obj)
function changeUserPassword(){
	//console.log('change user password function');
	if ($('#oldPass').val() === this.pass ){
		//console.log('passwords matched')
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

//show the 'change my data' modal : (for current user info)
function changeUserData (){
	//console.log('show the "change user data " function / showing modal');
	$('#oldPass').val('');
	$('#newPass').val('');
	$('#oldPass + p').hide();
	$("#myModal2").modal();
}


//add a new user function
var addUser = function(){
	//console.log('adding new user , new user function')
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
//recive a function for the button beside each user 
function showAllUsers (func){
	//console.log('show all users functoin')
	$('tbody').text('');
	allUsers.forEach(function(ele){
		$('tbody').append('<tr data-val=" '+ele.id+' " ><td style="padding-right:50px"> '+ele.id+' </td><td style="padding-right:50px"> '+ele.name+' </td><td><button class="'+func+'"> choose me </button></td></tr>');
	})
	
    $("#myModal").modal();
}

//style td for the table inside the 'all users modal' 
$('td').css('margin','10px')

// the delete  user event for the button inside the table if it have the class 'toDelete' ,  inside the 'all users' modal 
$('tbody').on('click','.toDelete',function(){
	//console.log('the delete user function');
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
			//console.log('error, user not found');
		}
})



// choose a user to delete 
//call show all users function with the class toDelete for the button of each user  
var deleteUser = function(){
		//console.log('delete user event ')
		showAllUsers("toDelete");
}


//search using id , if i is passed as a parameter return index , else return the object 
//reseve arr of obj with key called id 
function search(arr , ID ,i ){
	var returnMe ;
	//console.log('search function for id :' , ID);
	if (typeof ID === 'string'){
		ID = JSON.parse(ID);
	}
		arr.forEach(function(object,ind){
			if (ID === object.id){
				//console.log('object found at index ',ind)
				if (i !== undefined){
					returnMe = ind;
				} else {
					returnMe = object ;
				}
			}
		})	
	return returnMe ;
}

//change user event and function if the button of the table inside the modal of 'all users' has the class 'changeUser'
$('tbody').on('click','.changeUser',function(){
		//console.log('the change user event and function ..');
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
			//console.log('error');
		}
})


//change current user , the function to set the class of 'changeUser' to the button of 'all users' modal 
function changeCurrentUser(ev){
	//console.log('changeCurrentUser func')
	showAllUsers("changeUser");
}


$('li:hover span.fa-times').css('width','40px');



var currentUser = user();
allUsers.push(currentUser);
setUser(currentUser);

