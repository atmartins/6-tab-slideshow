/**
 * The 6 Tab Slideshow
 * version 1.0
 * 
 * Author: Aaron Martins
 *
 * Requires jQuery 1.4.2+
 *
 * Full Instructions: http://aaronmartins.com/docs/6-tab-slideshow/
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 * http://www.apache.org/licenses/LICENSE-2.0
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

"use strict";

function say(str){
	if ( console && console.log ) {
		console.log(str);
	}
}

/* Slideshow object constructor */
function Slideshow(_htmlId){
	this.htmlId = _htmlId; //the DOM element to add the slideshow to
	this.$el = $('#' + _htmlId); //reference to jQuery object for slideshow DOM element
}

/* Parameters for the slideshow object */
Slideshow.prototype.params = {
	//after slideshow appears, set to true to prevent future calls to fadeIn.
	fadedIn            : false,
	//The speed various items fade in/out at. milliseconds
	fadespeed          : 200,
	//The index which is currently open
	indexcurrentlyopen : 0,
	//The slot of pixels to slide the index when animating
	indexmovewidth     : 220,
	//Leave at 6
	slidecount         : 6,
	//slot of pixels (used to set up track)
	slideheight        : 455
};

/* Will contain slide objects (JSON) */
Slideshow.prototype.slides = [];

/* If any slides are requested by URL they're added to a queue and processed. */
Slideshow.prototype.Ajax = {
	/* If any slides are requested by URL they're added to a queue and processed. */
	queue : [],
	
	/* number of ajax slides which have finished loading. */
	queueComplete : 0,

	/**
	 * Add a url and slot number to the queue
	 * @param string (the slide url)
	 * @param integer (the slot to place it in the slideshow, 1-6)
	 */
	addToQueue : function(slideUrl, slot){
		//Check if an object exists in the queue for this slot number
		if(this.inQueue(slot)){
			//overwrite current queue position. only one slide allowed per slot
			this.queue[this.getIndexBySlot(slot)] = {
				url:slideUrl,
				slot:slot
			};
		} else {
			//that slot is available; add to our queue
			this.queue.push({
				url:slideUrl,
				slot:slot
			});	
		}
	},

	/**
	 * Empty the contents of the Ajax queue.
	 * Useful for unit testing
	 */
	emptyQueue : function(){
		this.queue = [];
	},

	/**
	 * Return the URL for a slideshow slot.
	 * @param integer (slot, 1-6)
	 * @return string (slide url)
	 */
	getUrlBySlot : function(slot){
		var index = this.getIndexBySlot(slot);
		if(index > -1 && index !== 'undefined'){ //0 is falsy but a valid array index
			return this.queue[index].url;
		}
	},

	/**
	 * Return the queue index for a slideshow slot number, if exists in queue
	 * @param integer (slot, 1-6)
	 * @return integer (queue array index)
	 */
	getIndexBySlot : function(slot){
		for(var i = 0; i < this.queue.length; i++){
			if(this.queue[i].slot == slot){
				return i;
			}
		}
	},

	/**
	 * Return true if the given slot is reserved in our queue for a slide
	 */
	inQueue : function(slot){
		var isIn = false;
		for(var i = 0; i < this.queue.length; i++){
			if(this.queue[i].slot == slot){
				isIn = true;
			}
		}
		return isIn;
	},

	/**
	 * Load the slide objects via AJAX
	 * When all are done, calls the callback and passes an array of slide objects to it
	 */
	processQueue : function(scope, callback){
		say('processing queue')
		var slides = [];
		for(var i = 0; i < this.queue.length; i++){
			//var slotNum = this.queue[i].slot;
			//var slideUrl = this.queue[i].url;
			//this.getAjaxSlide(slideUrl, slotNum);
			this.getSlide(this.queue[i].url, callback, scope);
		}
		//return callback(slides); //call callback and pass array of valid slides to it
	},

	/**
	 * Get an individual slide via ajax
	 * @param string slideUrl
	 * @param int slotNum
	 */
	getSlide : function(slideUrl, callback, scope){
		$.ajax({
			url: slideUrl,
			cache: true,
			type:'GET',
			beforeSend: function( xhr ) {
				say('----ajaxing for slot ' + slideUrl);
			},
			success: function(data, status){
				say('------------ success: this URL: ' + slideUrl);

				
				//check if last
				//callback(data, status, scope.Ajax.queue);
				callback(data, status, scope.slides);
			}
		}).fail( function(e){
			throw new Error('failed to load slide');
			throw new Error(e);
		});

		//return {fakeslide:'hi'}; //TODO get actual slide object here
	}
};

/**
 * Checks if the ajax queue is empty
 * If queue is empty, launch the slideshow
 *
 */
Slideshow.prototype.ajaxSlideComplete = function(){
	if(this.Ajax.queue.length == this.ajax.queueComplete){
		this.launch(); //launch the slideshow
	}
}

/**
 * Add a slide to the slideshow 
 * If passing a URL, the slide is only "registered"
 * See Slideshow.resolveSlides() for more info
 *
 * You may overload a spot.
 * For instance you may add a slide to slot 4 twice when adding slides.
 * The last slide added to a spot is used.
 *
 * @param slide [mixed] ([string] URL, [object] JSON object, or [array] array of JSON objects)
 * @param int [slot 1-6] or array of ints (which correlate to the array of JSON objects)
 * @param bool [register] if true, the slide will NOT be deregistered (useful on AJAX completion)
 * @return undefined
 */
Slideshow.prototype.addSlide = function(slide, slot){
	if( ! Array.isArray(slide)){
		slide = [slide];
	}
	if( ! Array.isArray(slot)){
		slot = [slot];
	}

	for(var i = 0; i < slide.length; i++){
		if(typeof slide[i] === "string" && typeof slot[i] === "number"){
			//say("!A! Queueing URLs " + slide + " in slots " + slot);
			this.Ajax.addToQueue(slide[i], slot[i]); //slide is actually a URL here
		};
		if(typeof slide[i] === "object" && typeof slot[i] === "number" && ! Array.isArray(slide[i]) ){
			if(! this.validSlide(slide[i])){
				throw new Error("Invalid slide. Attempting to add to slot " + slot[i]);
			}
			this.addSlideObject(slide[i], slot[i]);		
		};
	}
}

/**
 * Private
 * Add a slide to the stack for the real slot
 * Use Slideshow.addSlide() to add slides
 *
 * @param object [slide object]
 * @param int [slot 1-6]
 * @return undefined
 */
Slideshow.prototype.addSlideObject = function(slide, slot){
	//say('adding slide with alt text ' + slide.alt + ' at slot ' + slot);
	this.slides[slot] = slide;
}

/**
 * Returns a slide for the real slot
 * @param int [slot 1-6]
 * @return object [slide object]
 */
Slideshow.prototype.getSlide = function(slot){
	return this.slides[slot];
}

/**
 * Checks if a given object is a valid slideshow slide
 * @param object
 * @return boolean [true if slide is valid]
 */
Slideshow.prototype.validSlide = function(slide){
	return (
		typeof slide === "object"
		&& typeof slide.alt           === "string"
		&& typeof slide.indexup       === "string"
		&& typeof slide.indexover     === "string"
		&& typeof slide.slider        === "string"
		&& typeof slide.stampup       === "string"
		&& typeof slide.stampover     === "string"
		&& typeof slide.product_link  === "string"
		&& typeof slide.stamp_top_css === "string"
	);
}

/**
 * Defines several constants.
 * Also calls a few immediate functions (things needed before page load complete)
 * @param int [slide to start the slideshow on]
 */
Slideshow.prototype.begin = function(_slidetostarton) {
	this.params.trackheight = this.params.slideheight * this.params.slidecount;
	this.params.slidetostarton = _slidetostarton || 1; //default 1
	//say('Slideshow initiating');
	//say('starting with slide: ' + this.params.slidetostarton);
	//say('trackheight: ' + this.params.trackheight);
	
	this.Ajax.processQueue(this, function(data, status, scope){
		//say('this slot num from URL: ' + _this.ajaxGetslotFromQueue(this.url));
		//add the slide to the stack at the proper place (slot)
		//because the success function does not inherit the proper scope,
		//we must look up the proper slot for our slide
		//slideshow.addSlide(data, slideshow.ajaxGetslotFromQueue(this.url));
		//slideshow.ajax.queueComplete++; //another request complete
		//slideshow.ajaxSlideComplete(); //check if this was the last slide (if so, launches slideshow)
		//Slideshow.slides.push({test:'hi'});
		console.log(data);
		console.log(status);
		console.log(scope);
	});
	//doesn't return, loads ajax. 
	//when last ajax is done, callback function passed to this.Ajax.processQueue() is called.
}

Slideshow.prototype.launch = function(){
	say('slides should be resolved, launching app');
	say(this.slides);
}


