$(function() // must wrap all the code inside the ready function
{			// in order for them to function:
	var mobile = ( navigator.userAgent.match
					(/(iPad|iPhone|iPod|Android|webOS|Windows Phone|BlackBerry)/i) ? true : false );
	var browser = navigator.appName;
	var myUrl = $(location).attr('href').replace('#','');
	if (myUrl.indexOf("files:") == -1)
		myUrl = myUrl.substring(0, myUrl.lastIndexOf('/')+1); // include trailing '/'
	
	// for //"Microsoft Internet Explorer":
	var mediumFontSize = $(window).width()/5/10;     //  "18";
	var bannerHeight = "60";
	var bgrdPosition = "45% -25%";
	var videoPath = myUrl + "flash/";
	var mrTop = "-6";
	var mrBottom = "4";
	
	my.swfFilePath(myUrl + "lib/player_flv_maxi.swf");
	backHistory.contentDiv = ".content";
	
	if (browser == 'Netscape' && !mobile) // for FireFox or Chrome
	{
//		mediumFontSize = "22";
		bannerHeight = "100"; 
		bgrdPosition = "45% -25%";
		mrTop = "-4";
		mrBottom = "4";
	}
//	alert("mediumFontSize = " + mediumFontSize + "browser = " + browser);
	var smMediumFontSize = mediumFontSize * 4 / 5; //- 4;
	
	$('body').css
	({
		'background-position': bgrdPosition
	});
		
	$('#banner').css
	({'height': bannerHeight
	});
	
	$('#list').css
	({'font-size': '8pt'
	});

	$('#menu a').css 
	({
		fontSize: mediumFontSize + "px"
	});
	$('#menu ul li a').css
	({
		fontSize: smMediumFontSize + "px"
	});
	//alert("a font size = " + $('#menu a').css('font-size'));
  
  	$('.content').css
	({
		fontSize: smMediumFontSize + "px",
	 	marginTop: mrTop + "%",
		marginBottom: mrBottom + "%"
	});
  	$('.content a').css
	({
		fontSize: mediumFontSize + "px",
	});

	$('#menu li ul').css
	({
		display: "none",
		left: "auto"
	});
	
	//-----------------------------------------------
	// hover action:
	//-----------------------------------------------
	var hideSpeed = "slow";
	if (mobile)
		hideSpeed = "fast";
	
	$('#menu li').hover
	(
		function() // enter:
		{
			$(this)
				.find('ul')
				.stop(true, true) // clearQueue=true and gotoEnd=true so stp any other queued animation
									// and go straight to the fully slideDown state.
				.show();	//slideDown('fast'); //
		}, 
	
		function() // exit:
		{
			$(this)
				.find('ul')
				.stop(true, true)
				.fadeOut(hideSpeed); //slideUp(hideSpeed);	//
		}
	);
	
	// -------- accordion item handling: -------
	$('.accordion li')
	.hide(); //slideUp(hideSpeed);

	$('.accordion').hover
	(
		function() // enter:
		{
			$(this) // process next level elements
				.children('ul').children('li') // limit to first level li only, use .find('li) for all levels
				.stop(true, true) // clearQueue=true and gotoEnd=true so stp any other queued animation
									// and go straight to the fully slideDown state.
				.slideDown('fast'); //show();	//

			$(this) // process current level elements
//				.siblings().filter(':not(:first)') // leave the 1st element visible
				.stop(true, true) // clearQueue=true and gotoEnd=true so stp any other queued animation
									// and go straight to the fully slideDown state.
				.slideDown('fast'); //show();	//
		}, 
	
		function() // exit:
		{
			$(this)
				.find('li')
//				.filter(':not(:first)') // leave the 1st child element visible
				.stop(true, true)
				.slideUp(); //hideSpeed);	//fadeOut(hideSpeed);
		}
	);

/*	// -------- replace CSS style of hiding content with code: -------
	$('.content').css //showHideDiv
	({
		'left': "auto"
	});
	$('.content').children().css //showHideDiv
	({
		display: "none"
	});
*/
	//-----------------------------------------------
	// load video html page according to vPath
	// or directly play video according to id:
	//-----------------------------------------------
//	var lastShowId = "";

	$('.video a').click
	( 
		function() 
		{ 
			$('body').css({	'background-image':"url('')" }); // hide background

			var vpathID = $(this).attr('vPath'); //"2013"; // debug
			var path = "htm/" + vpathID + ".htm";
			$('.content').load(myUrl+path); // + " body");

			my.flashFilePath(videoPath); // + vpathID);
			my.useCurrentPage(false);

			if ($(this).attr('id') && vpathID)
			{
				my.useCurrentPage(true);
				my.PlayMovie(this, $(this).attr('utubeId') );
			}
//			alert("vPath = " + vpathID);
			
			return false;
			
		} // end fucntion()
	); // end $('.video a').click

	//----------------------------------------------------------------------------
	//----------------------------------------------------------------------------
	function	galleryHandler()
	{
		var pPath = $(this).attr('pPath');
		if (!pPath)
			return false;
		
		var path = "images/" + pPath;
//		path = path.replace(/\//g, "\\");
/*
		var imgLst = null;
		// $.post doesn't work - because the return data needs to be stored in php $_session data,
		// 		otherwise when the php function is done, the return data is lost:			
		$.get(myUrl+"lib/dir_list.php", 
				{dir:path},	// request data to the server
				function(result, status)  {
					if (result)				//"result" contains a json encoded array
						gallery.display(path, result);
				}, 'json' // specify return data type from server
			); 
*/
//		$.getJSON(path + "/list.json", 
		$.getJSON(path + "/list.json.htm", // this is to overcome the china server that doesn't support JSON mime type
			function(data) { //this._imgLst2010; //imgLst;
				gallery.display(path, data.sod);
			}
		).error(function(jqXhr, textStatus, error) {
			        alert("ERROR: " + textStatus + ", " + error);
				});

		return false;
	};
	
	//-----------------------------------------------
	$('.photo a').on('click', galleryHandler);

	//-----------------------------------------------
	// change content according to pageID:
	//-----------------------------------------------
	$('.showFolderPage a').click
	( 
		function() 
		{
			var filename = $(this).attr('id');

			var dirPath = $(this).attr('dPath'); // direct element has hign priority
			if (!dirPath) // then parent element:
				dirPath = $(this).parent().parent().attr('dPath');
			
			if (!filename || !dirPath)
				return;	// might be accordion click
			
			$('body').css({	'background-image':"url('')" }); // hide background
			
			if (dirPath == "Reunion")
				filename = dirPath + filename;
			else if (dirPath == "service")
			{
				if ( $(this).attr('class')) // == "blog")
					dirPath += "/" + $(this).attr('class'); //"/blog";
			}				
			var path = "htm/"+dirPath+"/" + filename + ".htm";
	
			//backHistory.bNewClick = true;
			backHistory.checkDirection();
			backHistory.backstack.push(myUrl+path); // store history for browser back button
			
	//		var filename = "Reunion"+$(this).attr('id'); //"2013"; // debug
	//		var path = "htm/reunion/" + filename + ".htm";
			$('.content').load(myUrl+path /*,
							function(response, status, xhr) {
								if (status == "error") 
									$('.content').html("load error: " + xhr.status + " " + xhr.statusText);
							} */
							);

			// warning: in order for the class attribute such as "showFolderPage" to be detected,
			// it has to be part of a's parent element attribute
			//		 (or the grand parent of the a elelment):
			//
			$('.content').on('click', '.showFolderPage a', loadFileHandler);
			$('.content').on('click', '.photo a', galleryHandler);
		}
	);
	
	function loadFileHandler() 
	{
		var filename = $(this).attr('id');
		var dirPath = $(this).attr('dPath');
		if (filename && dirPath)
		{
			var path = "htm/" + dirPath + "/" + filename + ".htm";
	
//			backHistory.bNewClick = true;
			backHistory.backstack.push(myUrl+path); // store history for browser back button

			$('.content').load(myUrl+path);
		}
	}

	//-----------------------------------------------
	// change content according to pageID:
	//-----------------------------------------------
	$('.showHide').click
	( 
		function() 
		{ 
			var pageID = $(this).attr('hPath'); 
	//		alert("hPath = " + pageID);

			if (pageID)
			{
				$('body').css
				({
					'background-image':"url('')"
				});
				var path = "htm/" + pageID + ".htm";
				$('.content').load(myUrl+path); // + " body");
			}
//			alert($(this).attr('id'));
/*
			$(lastShowId).hide();
			$('.content').css
			({
				'background-color': "#dddddd" //"gray"
			});
			
			lastShowId = '#' + $(this).attr('ct_id'); // + 'Div'; 
			$(lastShowId).css
			({
				'margin-left': "2%",
				'margin-top': "1%"
			});
*/			
/*
			$.ajax({
				url: myUrl+path, //$(location).attr('href')+"/video/2013.htm",	//'http://example.com,
				dataType: 'html',
				success: function(data) // parameter data is server processed data according to dataType
				{
					//if (data != null)
						//alert(data);	
					//replace content div with the source html's body:
				//	var src	  = $(data).find('body').html();
					alert(myUrl + "\n" + path+ "\n" + src);		
				//	$('.content').html(src); //$(data).filter('.body').html());
					
					//$('#destination2').html($(data).filter('#source2').html());
					
					$('.content').load(data 'body');
				}
			});	// end ajax
*/
//			$(lastShowId).show(); 

			return false;
			
		} // end fucntion()
	); // end $('.showHide').click

/* 
	$('<input type="button" value="toggle" id ="toggleButton">')
		.insertAfter('#menu');
	
	$('#toggleButton').click
	(
		function()
		{	//alert("button clicked!"); 
			$('#menu').toggle();
		}
	)
	
	$('#menu').animate
	(
		{	padding: '30px' 	// horizantal movement
//			fontSize: '30px'	// vertical movement
		},
		2000
	);
*/	
}) 
