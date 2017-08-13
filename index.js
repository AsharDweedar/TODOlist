
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
	this.name = prompt('type new user name :');
	$('nav span').text(this.name);
}

var addUser = function(){
	var obj = user();

	obj.name = prompt('type new user name :');
	obj.pass = prompt('type new password :');

	allUsers.push(obj);
	$('nav span').text(obj.name);
	currentUser = obj ;
};




//show 
function showAllUsers (func){
	console.log('show all users functoin')
	$('tbody').text('');
	allUsers.forEach(function(ele){
		$('tbody').append('<tr><td>'+ele.id+'</td><td>'+ele.name+'</td><td><button onclick="'+func+'()">choose me</button></td></tr>');
	})
    $("#myModal").modal();
}



// choose a user to delete 
var deleteUser = function(){
	console.log('delete a user ')
	
	var userToDelete = prompt('type user id to delete :');
	console.log('userToDelete : ', userToDelete);

	var i = search(JSON.parse(userToDelete),1);
	

	if (i != undefined){
		var userName = allUsers[i].name;
		console.log('userName found : ',userName)
		var testPassword = prompt('you want to delete '+userName+'type user  password to complete :');
		if (allUsers[i].pass === testPassword){
			allUsers.splice(ind,1);
			alert ('user :'+userName + 'deleted')
		}
	} else {

		// if user wasn't found modal will show up to choose one to delete 

		alert('user id is not correct !!')
		showAllUsers(function(ev){
			console.log('the delete function')
			var testPassword =(prompt('enter password to log in :'));
			var ind = search(JSON.parse($(this).parent().parent().find('td')),1);
			if (ind !== undefined){
				if (allUsers[ind].pass === testPassword ){
					allUsers.splice(ind,1);
				} else {
				alert("passwords didn't match");
				}
			} else { 
				console.log('error');
			}
			ev.stopPropagation();
		});
	}
}



//search uding id , if i is passed return index , else return the object 
function search(ID,i){
	console.log('search function for id :', ID)
		allUsers.forEach(function(object,ind){
			if (ID == object.id){
				if (i !== undefined){
					return ind;
				} 
				return object ;
			}
		})	
}



//change current user 
function changeCurrentUser(ev){
	console.log('changeCurrentUser func')
	showAllUsers(function(ev){
		console.log('the change user function ..')
		var testPassword =(prompt('enter password to log in :'));
		var obj = search($(this).parent().parent().find('td'));
		if (obj !== undefined){
			if (obj.pass === testPassword ){
				currentUser = obj;
			} else {
			alert("passwords didn't match");
			}
		} else { 
			console.log('error');
		}
		ev.stopPropagation();
	});
}

var currentUser = user();
allUsers.push(currentUser);




