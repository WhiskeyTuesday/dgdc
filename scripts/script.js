/* Vimeo Album Integration */
function loadAlbum(album,callback) {
	var albumURL = 'http://vimeo.com/api/v2/album/' + album + '/videos.json?callback=' + callback;
	var js = document.createElement('script');
	js.setAttribute('type', 'text/javascript');
	js.setAttribute('src', albumURL);
	document.getElementsByTagName('head').item(0).appendChild(js);
}
function displayAlbum(videos,containerID) {
	var container = document.getElementById(containerID);
	// container.innerHTML = '';

	var list = document.createElement('ul');
	list.setAttribute('class', 'list');
	for (var i = 0; i < videos.length; i++) {
		var thumb = document.createElement('img');
		thumb.setAttribute('src', videos[i].thumbnail_large);
		thumb.setAttribute('alt', videos[i].title);
		thumb.setAttribute('title', videos[i].title);
		thumb.setAttribute('width', '540');
		thumb.setAttribute('height', '270');

		var title = document.createElement('span');
		title.setAttribute('class', 'title');
		title.innerHTML = videos[i].title;

		var a = document.createElement('a');
		a.setAttribute('href', 'http://player.vimeo.com/video/'+videos[i].id+'?byline=0&amp;portrait=0&amp;color=ffffff&amp;autoplay=1');
		a.setAttribute('class', 'fancybox fancybox.iframe');
		a.setAttribute('title', videos[i].title);
		a.appendChild(thumb);
		a.appendChild(title);		
		
		/* Deprecated Description Functionality
		var span = document.createElement('span');
		span.setAttribute('class', 'description');
		span.innerHTML = videos[i].description;
		*/

		var li = document.createElement('li');
		li.appendChild(a);
		// Deprecated Description Inclusion
		// li.appendChild(span);
		list.appendChild(li);
	}
	container.appendChild(list);
	$("#"+containerID+" .fancybox").attr('rel', containerID).fancybox({fitToView:true,autoResize:true,mouseWheel:true,margin:[20,60,20,60],helpers:{buttons:{},title:{type:'inside'},thumbs:{width:50,height:50}}});
	$("#"+containerID).show();
	/*$("#"+containerID+" .list").imagesLoaded(function() {
		$("#"+containerID+" .list").masonry({
		  isFitWidth: true,
		  itemSelector: 'li'
		});
		$("#"+containerID+" .list").masonry('unbindResize');
	});*/
	
	if ($(document).width() > 680) {
		columns = 3;
	} else {
		columns = 2;
	}
	// initialize Isotope
	$("#"+containerID+" .list").imagesLoaded(function() {
		$("#"+containerID+" .list").isotope({
		  // options...
		  resizable: false, // disable normal resizing
		  // set columnWidth to a percentage of container width
		  masonry: { columnWidth: $("#"+containerID+" .list").width() / columns }
		});
	});

	// update columnWidth on window resize
	$(window).smartresize(function(){
		if ($(document).width() > 680) {
			columns = 3;
		} else {
			columns = 2;
		}
		$("#"+containerID+" .list").imagesLoaded(function() {
			$("#"+containerID+" .list").isotope({
	    		// update columnWidth to a percentage of container width
	    		masonry: { columnWidth: $("#"+containerID+" .list").width() / columns }
		  	});
		});
	});
}

function displayPhotoAlbum(flickrID,containerID) {
	var container = document.getElementById(containerID);
	var list = document.createElement('ul');
	list.setAttribute('class', 'photolist');
	container.appendChild(list);
	$.getJSON( "http://api.flickr.com/services/rest/?&method=flickr.photosets.getPhotos&api_key=5271fa0b8fc7f1a1a743aea86867b276&photoset_id=72157641847805375&format=json&jsoncallback=?", function( data ) {
		if (data.stat == "ok") {
			var photoset = data.photoset;
			for (var i = 0; i <= photoset.total; i++){
				var photo = photoset.photo[i];
				var farm = photo.farm;
				var server = photo.server;
				var id = photo.id;
				var secret = photo.secret;
				var title = photo.title;
				$('#'+containerID+' ul.photolist').append('<li><a class="fancybox fancybox.image" href="http://farm'+farm+'.staticflickr.com/'+server+'/'+id+'_'+secret+'_b.jpg" rel="photos" title="'+title+'"><img src="http://farm'+farm+'.staticflickr.com/'+server+'/'+id+'_'+secret+'_s.jpg" alt=""'+title+'" title=""'+title+'" /></a></li>');	
			}
			if (photoset.total == 100) {
				$('#'+containerID+' ul.photolist').append('<li><a href="http://www.flickr.com/photos/69044753@N03" title="David Goldberg Photos"><img src="images/more.jpg" alt="More Photos" title="More Flickr Photos" /></a></li>');
			}
		} else {
			$('#'+containerID+' ul.photolist').append('<p class="error">Error Loading Flickr Feed</p>');
		}
	});
	
	
	/* Deprecated jflickrfeed implementation
	$('#'+containerID+' ul.photolist').jflickrfeed({
		limit: 20,
		qstrings: {
			id: flickrID
		},
		itemTemplate: '<li><a class="fancybox fancybox.image" href="{{image_b}}" rel="photos" title="{{title}}"><img src="{{image_s}}" alt="{{title}}" title="{{title}}" /></a></li>'
	}, function (data) {
		$('#'+containerID+' ul.photolist').append('<li><a href="http://www.flickr.com/photos/69044753@N03" title="David Goldberg Photos"><img src="images/more.jpg" alt="More Photos" title="More Flickr Photos" /></a></li>');		
	});
	*/
	$("#"+containerID+" .fancybox").attr('rel', containerID).fancybox({fitToView:true,autoResize:true,mouseWheel:true,margin:[20,60,20,60],helpers:{buttons:{},title:{type:'inside'},thumbs:{width:50,height:50}}});
	$("#"+containerID).show();
}

function displayContact() {
	$("#content > div").hide();
	$("#contact").show();
	ga('send', {
	  'hitType': 'pageview',
	  'page': '/contact',
	  'title': 'Contact'
	});
}
function displayShorts(videos) {
	$("#content > div").hide();
	if($('#shorts .list').length > 0) {
		$("#shorts").show();
	} else {
		displayAlbum(videos,'shorts');
	}
	ga('send', {
	  'hitType': 'pageview',
	  'page': '/shorts',
	  'title': 'Shorts'
	});
}
function displayMusic(videos) {
	$("#content > div").hide();
	if($('#music .list').length > 0) {
		$("#music").show();
	} else {
		displayAlbum(videos,'music');
	}
	ga('send', {
	  'hitType': 'pageview',
	  'page': '/music',
	  'title': 'Music'
	});
}
function displayFashion(videos) {
	$("#content > div").hide();
	if($('#fashion .list').length > 0) {
		$("#fashion").show();
	} else {
		displayAlbum(videos,'fashion');
	}
	ga('send', {
	  'hitType': 'pageview',
	  'page': '/fashion',
	  'title': 'Fashion'
	});
}
function displayExperimental(videos) {
	$("#content > div").hide();
	if($('#experimental .list').length > 0) {
		$("#experimental").show();
	} else {
		displayAlbum(videos,'experimental');
	}
	ga('send', {
	  'hitType': 'pageview',
	  'page': '/experimental',
	  'title': 'Experimental'
	});
}
function displayCommercials(videos) {
	$("#content > div").hide();
	if($('#commercials .list').length > 0) {
		$("#commercials").show();
	} else {
		displayAlbum(videos,'commercials');
	}
	ga('send', {
	  'hitType': 'pageview',
	  'page': '/commercials',
	  'title': 'Commercials'
	});
}
function displayPhotos(flickrID) {
	$("#content > div").hide();
	if($('#photos .photolist').length > 0) {
		$("#photos").show();
	} else {
		displayPhotoAlbum(flickrID,'photos');
	}
	ga('send', {
	  'hitType': 'pageview',
	  'page': '/photos',
	  'title': 'Photos'
	});
}


$(document).ready(function() {
	$('html').addClass('js');
	$("#menu ul").tinyNav();
	if (window.location.hash) {
		if (window.location.hash == '#contact') {
			$("#menu .links").removeClass("selected");
			$('.tinynav option').removeAttr("selected");		
			$("#menu .contact.links").addClass("selected");
			$('.tinynav').val("#contact").attr("selected","selected");
			displayContact();
		} else if (window.location.hash == '#shorts') {
			$("#menu .links").removeClass("selected");
			$('.tinynav option').removeAttr("selected");		
			$("#menu .shorts.links").addClass("selected");
			$('.tinynav').val("#shorts").attr("selected","selected");
			var album = '2487190';
			var callback = 'displayShorts';
			loadAlbum(album,callback);
		} else if (window.location.hash == '#music') {
			$("#menu .links").removeClass("selected");
			$('.tinynav option').removeAttr("selected");		
			$("#menu .music.links").addClass("selected");
			$('.tinynav').val("#music").attr("selected","selected");
			var album = '2487202';
			var callback = 'displayMusic';
			loadAlbum(album,callback);
		} else if (window.location.hash == '#fashion') {
			$("#menu .links").removeClass("selected");
			$('.tinynav option').removeAttr("selected");		
			$("#menu .fashion.links").addClass("selected");
			$('.tinynav').val("#fashion").attr("selected","selected");
			var album = '2487205';
			var callback = 'displayFashion';
			loadAlbum(album,callback);		
		} else if (window.location.hash == '#experimental') {
			$("#menu .links").removeClass("selected");
			$('.tinynav option').removeAttr("selected");		
			$("#menu .experimental.links").addClass("selected");
			$('.tinynav').val("#experimental").attr("selected","selected");
			var album = '2487207';
			var callback = 'displayExperimental';
			loadAlbum(album,callback);	
		} else if (window.location.hash == '#commercials') {
			$("#menu .links").removeClass("selected");
			$('.tinynav option').removeAttr("selected");		
			$("#menu .commercials.links").addClass("selected");
			$('.tinynav').val("#commercials").attr("selected","selected");
			var album = '2487208';
			var callback = 'displayCommercials';
			loadAlbum(album,callback);
		} else if (window.location.hash == '#photos') {
			$("#menu .links").removeClass("selected");
			$('.tinynav option').removeAttr("selected");		
			$("#menu .photos.links").addClass("selected");
			$('.tinynav').val("#photos").attr("selected","selected");
			var flickrID = "69044753@N03";
			displayPhotos(flickrID);
		}
	}
	$("#menu .links").click(function () {
		$("#menu .links").removeClass("selected");
		$(this).addClass("selected");
		$('.tinynav option').removeAttr("selected");		
	});
	$("#menu .contact.links").click(function () { 
		$('.tinynav').val("#contact").attr("selected","selected");
		displayContact();
	});	
	$("#menu .shorts.links").click(function () {
		$('.tinynav').val("#shorts").attr("selected","selected");
		var album = '2487190';
		var callback = 'displayShorts';
		loadAlbum(album,callback);
	});
	$("#menu .music.links").click(function () {
		$('.tinynav').val("#music").attr("selected","selected");
		var album = '2487202';
		var callback = 'displayMusic';
		loadAlbum(album,callback);
	});
	$("#menu .fashion.links").click(function () {
		$('.tinynav').val("#fashion").attr("selected","selected");
		var album = '2487205';
		var callback = 'displayFashion';
		loadAlbum(album,callback);		
	});
	$("#menu .experimental.links").click(function () {
		$('.tinynav').val("#experimental").attr("selected","selected");
		var album = '2487207';
		var callback = 'displayExperimental';
		loadAlbum(album,callback);	
	});
	$("#menu .commercials.links").click(function () {
		$('.tinynav').val("#commercials").attr("selected","selected");
		var album = '2487208';
		var callback = 'displayCommercials';
		loadAlbum(album,callback);
	});
	$("#menu .photos.links").click(function () {
		$('.tinynav').val("#photos").attr("selected","selected");
		var flickrID = "69044753@N03";
		displayPhotos(flickrID);
	});
	$(".tinynav").change( function() {
		if ($(this).val() == '#contact'){
			displayContact();
		} else if ($(this).val() == '#shorts'){
			var album = '2487190';
			var callback = 'displayShorts';
			loadAlbum(album,callback);
		} else if ($(this).val() == '#music'){
			var album = '2487202';
			var callback = 'displayMusic';
			loadAlbum(album,callback);
		} else if ($(this).val() == '#fashion'){
			var album = '2487205';
			var callback = 'displayFashion';
			loadAlbum(album,callback);
		} else if ($(this).val() == '#experimental'){
			var album = '2487207';
			var callback = 'displayExperimental';
			loadAlbum(album,callback);
		} else if ($(this).val() == '#commercials'){
			var album = '2487208';
			var callback = 'displayCommercials';
			loadAlbum(album,callback);
		} else if ($(this).val() == '#photos'){
			var flickrID = "69044753@N03";
			displayPhotos(flickrID);
		}
		$("#menu .links").removeClass("selected");
		$($(this).val().replace("#", ".")).addClass("selected");
	});
});

window.addEventListener('load', function() {
  window.setTimeout(function() {
    var bubble = new google.bookmarkbubble.Bubble();
    var parameter = 'bmb=1';

    bubble.hasHashParameter = function() { return window.location.hash.indexOf(parameter) != -1; };
    bubble.setHashParameter = function() { if (!this.hasHashParameter()) { window.location.hash += parameter; } };
    bubble.getViewportHeight = function() { return window.innerHeight; };
    bubble.getViewportScrollY = function() { return window.pageYOffset; };
    bubble.registerScrollHandler = function(handler) { window.addEventListener('scroll', handler, false); };
    bubble.deregisterScrollHandler = function(handler) { window.removeEventListener('scroll', handler, false); };

    bubble.showIfAllowed();
  }, 1000);
}, false);
