var my=(function(){
	var mobile = ( navigator.userAgent.match
					(/(iPad|iPhone|iPod|Android|webOS|Windows Phone|BlackBerry)/i) ? true : false );
    var _bUseCurrentpage = false; // default useing new page
	var _bRestricted = false;
	var _flvPath = "video/flash";
	var _swfPath = "../lib/player_flv_maxi.swf";
	var _flshWindow = null;
	
 // var fontSize = $('#menu a:first').css('font-size');
 // alert(fontSize);
  	
    return 	{
	// helper functions:        
        useCurrentPage: function(bUseCurrentpage) { _bUseCurrentpage = bUseCurrentpage; },
        Restricted: function(bRestricted) { _bRestricted = bRestricted; },
        flashFilePath: function(flvPath) { _flvPath = flvPath; },
        swfFilePath: function(swfPath) { _swfPath = swfPath; },
        
	// main function:
        PlayMovie: function (elm, youTubeID)
        {
			var videoTitle = elm.innerHTML; // $('#'+vID).text();

			if (_bRestricted && mobile)
			{
				//top.location.href = youTubeID;
				var openWIn = window.open(youTubeID, videoTitle, "");
			}
			else // not mobile && _bRestricted
			{
				// Note: the vID must be identical to the flash file name minus the extention '.flv'.
				var swfPath = '"'+_swfPath+'"';
				if (_flvPath[_flvPath.length-1] != '/' && _flvPath[_flvPath.length-1] != '\\')
					_flvPath += '/';
				var flvValue = 'value=\"flv=' + _flvPath + elm.id + '.flv';
				flvValue += '.htm'; // overcome China server that doesn't allow flv extension MIME type

				if (flvValue.indexOf("file:") != -1) // find using file protocol:
					flvValue = flvValue.replace(/\/\//g, "/"); // replace "//" globally with "/"
				
				if (mobile)
				{
					swfPath  = 'http:\/\/www.youtube.com\/v\/' + youTubeID;	
					flvValue = swfPath;
				}
//alert(flvValue);
				flvValue +=  '\&width=854\&height=480\&autoplay=1\&autoload=1\&buffer=5' + //\&buffermessage=\\' +
						'\&title=' + videoTitle +
						'\&playercolor=464646\&loadingcolor=999898\&buttoncolor=ffffff\&buttonovercolor=dddcdc' +
						'\&slidercolor=ffffff\&sliderovercolor=dddcdc\&showvolume=1' +
						'\&showfullscreen=1\&playeralpha=100\&margin=0\&buffershowbg=0 \" />';
	
				var strFlashPlayer ='<object id="myPlayer" type="application/x-shockwave-flash"' +
								  ' data=' + swfPath + ' width="854" height="480" />' +
								  '<param name="movie" value=' + swfPath + ' />' +
								  '<param name="wmode" value="opaque" />' +
								  '<param name="allowFullScreen" value="true" />' +
								  '<param name="allowScriptAccess" value="sameDomain"/>' +
								  '<param name="quality" value="high"/>' +
								  '<param name="menu" value="true" />' +
								  '<param name="autoplay" value="false"/>' + 
								  '<param name="autoload" value="false"/>' +
								  '<param name="bgcolor" value="#000000" />' +
								  '<param name="FlashVars" ' + flvValue +
								   '</object>';
			
				// --------- play video in a new page: ----------------------------------------------------
				if (!_bUseCurrentpage)
				{
					_flshWindow = window.open('', 'VideoPage');
					var newPage = '<html><title>' + videoTitle + '</title>' +
						'<head><link rel="stylesheet" type="text/css" href="style.css" /></head>' + 
						'<body style="background-color : black;">';
					_flshWindow.document.open();
					_flshWindow.document.write(newPage);
					_flshWindow.document.writeln('<h1>' + videoTitle + '</h1> <br>');
					_flshWindow.document.writeln('<div id = "myVideo" style="margin-left: 12%; margin-top: 1%;">');
					_flshWindow.document.write(strFlashPlayer);
					_flshWindow.document.writeln('</div> </body></html>');
					_flshWindow.document.close();
					_flshWindow.focus();

//					_flshWindow.document.getElementById('myVideo').innerHTML = strFlashPlayer;
				}
				else
				{
					if (_flshWindow) // close the other video playing window
						_flshWindow.window.close();
						
					//------------------- play video in the current page: --------------------------------
					var container = $('.content');
					var vContainer = '<div id="myVideo"></div>';

					if (container)
					{
						container.empty();
						container.append(vContainer);
					}
					else
						$('body').append(vContainer);

					$('#myVideo').css({
						marginLeft: '10%',
						marginTop: '5%'	
					});
						
					//$('#myVideo').html( strFlashPlayer );
					document.getElementById('myVideo').innerHTML = strFlashPlayer;

//					$('body').css('background-image', 'url()');
				}
			} // end not mobile
		} // end playMovie
    } // end return
})();
    
    
    
    
    
    
    
    
    
    
    
    