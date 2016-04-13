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

function displayHome() {
	$("#content > div").hide();
	$("#home").show();
	ga('send', {
	  'hitType': 'pageview',
	  'page': '/home',
	  'title': 'Home'
	});
}

function displayCommercial(videos) {
	$("#content > div").hide();
	if($('#commercial.list').length > 0) {
		$("#commercial").show();
	} else {
		displayAlbum(videos,'commercial');
	}
	ga('send', {
	  'hitType': 'pageview',
	  'page': '/commercial',
	  'title': 'Commercial'
	});
}

function displayNarrative(videos) {
	$("#content > div").hide();
	if($('#narrative.list').length > 0) {
		$("#narrative").show();
	} else {
		displayAlbum(videos,'narrative');
	}
	ga('send', {
	  'hitType': 'pageview',
	  'page': '/narrative',
	  'title': 'Narrative'
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
		if (window.location.hash == '#home') {
			$("#menu .links").removeClass("selected");
			$('.tinynav option').removeAttr("selected");		
			$("#menu .home.links").addClass("selected");
			$('.tinynav').val("#home").attr("selected","selected");
			displayHome();
		} else if (window.location.hash == '#commercial') {
			$("#menu .links").removeClass("selected");
			$('.tinynav option').removeAttr("selected");		
			$("#menu .commercial.links").addClass("selected");
			$('.tinynav').val("#commercial").attr("selected","selected");
			var album = '3881699';
			var callback = 'displayCommercial';
			loadAlbum(album,callback);
		} else if (window.location.hash == '#narrative') {
			$("#menu .links").removeClass("selected");
			$('.tinynav option').removeAttr("selected");		
			$("#menu .narrative.links").addClass("selected");
			$('.tinynav').val("#narrative").attr("selected","selected");
			var album = '3881698';
			var callback = 'displayNarrative';
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
	$("#menu .home.links").click(function () { 
		$('.tinynav').val("#home").attr("selected","selected");
		displayHome();
	});	
	$("#menu .commercial.links").click(function () {
		$('.tinynav').val("#commercial").attr("selected","selected");
		var album = '3881699';
		var callback = 'displayCommercial';
		loadAlbum(album,callback);
	});
	$("#menu .narrative.links").click(function () {
		$('.tinynav').val("#narrative").attr("selected","selected");
		var album = '3881698';
		var callback = 'displayNarrative';
		loadAlbum(album,callback);	
	});
	$("#menu .photos.links").click(function () {
		$('.tinynav').val("#photos").attr("selected","selected");
		var flickrID = "69044753@N03";
		displayPhotos(flickrID);
	});
	$(".tinynav").change( function() {
		if ($(this).val() == '#home'){
			displayHome();
			loadAlbum(album,callback);
		} else if ($(this).val() == '#commercial'){
			var album = '3881699';
			var callback = 'displayCommercial';
			loadAlbum(album,callback);
		} else if ($(this).val() == '#narrative'){
			var album = '3881698';
			var callback = 'displayNarrative';
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
