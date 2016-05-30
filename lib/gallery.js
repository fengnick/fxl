var gallery = // gallery widget name space:
{
	scroll: false,
	width: 1024,
	innerWidth:0,
	path: "",
	imgLst: null,
	timer: false,
	
	// methods:
	
	offset: function()
	{
		var left = gallery.content.position().left;
		var photoLeftBound = parseInt($('#photos').css('left').replace("px", ""), 10); //0
		var photoRtBound = parseInt($('#photos').css('left').replace("px", ""), 10) + $('#photos').width();
		var slideStep = gallery.width / 2;
		
		$('#left').css('color', 'white');
		$('#right').css('color', 'white');
		
		if (gallery.scroll == '>')
		{
			if (left <= -photoLeftBound)
			{
				left += slideStep;
			}
		    else
				$('#left').css('color', 'gray');
		}
		else // scroll to the left (arrow point to the right):
		{
			if (gallery.innerWidth > $('#photos').width()
				&& left <= photoLeftBound
				&& photoRtBound < left + gallery.innerWidth)
			{
				left -= slideStep;
			}
		    else
				$('#right').css('color', 'gray');
		}	
		return left + "px";
	},

	slide: function()
	{
		//if (gallery.timer)
		//	clearTimeout(gallery.timer);
			
		if (gallery.scroll)
		{
			$(gallery.content)
				.stop(true, true) // clear out pending animation
				.animate({left: gallery.offset()}, 700); // half sec animation
			
			//gallery.timer = setTimerout(gallery.slide, 1000); // auto slide each second
		}
	},

	direction: function(e)
	{
		//x = e.pageX; // - which.offset().left;
		
		// change this to left / right arrow button hover:
		gallery.scroll = (e.pageX <= gallery.width / 2) ? ">" : "<";
	},

	init: function()
	{
		$('.arrow') // left or right arrow hover event handler:
			.mouseout( function() { gallery.scroll = false; } )
		//	.mousemove( function(e) { gallery.direction(e); } )
			.mouseover( function(e) { 
					gallery.direction(e); 
					gallery.slide(); // initiate the slide, should move into mousemove?
				} )
	},
	
	zoomPhoto: function(imglist)
	{
		gallery.init();
		imglist.mouseover( // show the picture that mouse is hovered on the big-picture panel:
				function(e) { gallery.showBigPhoto(this); })
				
		$('#return') // return button is clicked, destroy the overlay screen:
			.click( function() { 
				$('#overlay').children().remove();
				$('#overlay').remove();
        		$('body').css('overflow-y', 'visible');
			})
	},

	// ------------------------------------------------------------
	// img_li: DOM attributes of the image that is to be shown
	// ------------------------------------------------------------
	showBigPhoto: function(img_li)
	{
		
		var endPath = img_li.src.lastIndexOf("/") + 1;
		var picPath = img_li.src.substr(0, endPath) + "src/" + img_li.src.substr(endPath);
		
		$('#pic_panel')
			.empty()
			.append($('<img id = "pic" >').prop('src', picPath)) //img_li.src))

		// show the picture as big as possitble:
		// 	- if picture is extra wide, use width to specity dimension,
		// 	  otherewise use hight.
		//
		var picH = $('#pic_panel').height() * 0.95;
		if (img_li.width / img_li.height * picH > $('#pic_panel').width())
		{
			$('#pic').prop('width', $('#pic_panel').width());
			$('#pic').prop('height', $('#pic_panel').width() / img_li.width * img_li.height);
		}
		else
		{
			$('#pic').prop('height', picH);
			$('#pic').prop('width', img_li.width / img_li.height * picH);
		}
		
		// put picture in the middle of the panel:
		var left = ($('#pic_panel').width() - $('#pic').width()) / 2;
		var top = ($('#pic_panel').height() - $('#pic').height()) / 2;
		
		$('#pic_panel').css('margin-top', top)
					.css('margin-left', left);
					
		$('#pic_title').html(img_li.title);
	},
		
	buildImgList: function() //path, imgLst)
	{
		if ($('#photos') != null)
				$('#photos').empty();
				
		// build image list on top of the screen:			
		var page =  '<ul id="photos_inner">';
		var pageEnd = '</ul>'; 

		$.each(gallery.imgLst, function(key, val) // each val = pair of image name & titile
		{
			$.each(val, function(imgName, title) // separate the pair:
			{
				page += '<li><img height=' + $('#photos').height()
//						+ ' src=' + gallery.path + '/' + val + '>'
						+ ' src=' + gallery.path + '/' + imgName // + '>'
						+ ' title=' + title + '>'
						+ '<span style="font-size:2px">" "</span></li>'; // gap between pictures
				
			})
		});
		
		page += pageEnd;
		$(page).appendTo('#photos');
		
		gallery.innerWidth = 0; // clean the size
		$('#photos_inner img').each(function(){
				gallery.innerWidth += $(this).width(); // +"px" ?
		})

		gallery.content = $("#photos_inner");
		gallery.innerWidth += $("#photos").css('left').replace("px", "") * 2;
		gallery.content.css("width", gallery.innerWidth);

		if (gallery.timer) // this is the timer call, clear the timer:
		{
			if (gallery.reload == 1)
				gallery.showBigPhoto($('#photos_inner li img')[0]); // show first picture on the big-picture panel

			if (gallery.reload++ >= 4)
			{
				clearTimeout(gallery.timer);
				gallery.zoomPhoto($('#photos_inner li img'));
			}
		}
	},

	display: function(path, imgLst)
	{
		gallery.path = path;
		gallery.imgLst = imgLst;
		
		// hide scrollbars
		$('body').css('overflow-y', 'hidden');
//        document.ontouchmove = false; // disable scrolling
		
		// popup overlay screen:
		$('<div id = "overlay"></div>')
			.css('top', $(document).scrollTop()) // use the current scrollTop position
			.css('opacity', '0') // start overlay with fully transparent
			.animate({'opacity': '1.1'}, 'slow') // change gradually to half transparent
			.appendTo('body');

		// insert left, right and return buttons on the overlay:
		$('<div class = "arrow" id = "left"> < </div>'
		  +'<div class = "arrow" id = "right"> > </div>'
		  +'<a href="#" id = "a_return"><img id = "return" title = "&#36864;&#20986; exit" src= "images/btnExit.jpg"></a>')
			.appendTo('#overlay');
		
		// insert phtos and photos_inner divs on the overlay:
		$('<div id = "photos"></div>')
			.appendTo('#overlay');

		$('<div id = "pic_panel"></div>')
			.appendTo('#overlay');
			
		$('<div id = "pic_title"></div>')
			.appendTo('#overlay');

		var panelW = $('#pic_panel').width();

		gallery.width = panelW;
		
		// pre load image list
		gallery.reload = 0;
		gallery.buildImgList(); //path, imgLst);
		gallery.timer = setInterval(gallery.buildImgList, 500); // reload image list again half sec later
	}
}