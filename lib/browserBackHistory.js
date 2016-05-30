var backHistory = // gallery widget name space:
{
	//-------------------------------------------------------
	// handle browser back button:
	//-------------------------------------------------------
	backstack : [],
	bNewClick : false,
	contentDiv: null,
	
	checkDirection: function() {
		if (backHistory.bNewClick)
			backHistory.bNewClick = false;
	},
	
	handler: $(window).bind('hashchange', function() { // can't detect forward arrow change though
			// Eventually alert the user describing what happened
		if (!backHistory.bNewClick) // only go back when it is not a new click	
		{
			if (backHistory.backstack.length > 1)// && backstack[backstack.length - 2] == newHash) {	
			{	// Back button was probably pressed
				backHistory.backstack.pop(); // pop the current one
			//else
			//	backstack.push(newHash);	
			//	window.location.hash = backstack.pop();
	
	//			$('.content').load(backHistory.backstack.pop()); // get the last one
				var lastPage = backHistory.backstack.pop();
				if ($(backHistory.contentDiv))
					$(backHistory.contentDiv).load(lastPage); // get the last one
				
				backHistory.backstack.push(lastPage); // save for next pop
				backHistory.bNewClick = true;
			}
		}
//		else
//			backHistory.bNewClick = false; // reset the new click
	}),
/*	
	if (backstack.length == 0 || window.location.hash != backstack[backstack.length])
		backstack.push(window.location.hash);

	var hash = window.location.hash;
    if (window.location.hash != hash) {
        hash = window.location.hash;
*/	
	
}