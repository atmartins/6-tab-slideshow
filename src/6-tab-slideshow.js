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
(function( window, $, undefined ) {
	"use strict";

	//We must have the jQuery
	if(! window.jQuery ){ throw new Error('Slideshow requires jQuery 1.4.2+'); };

	//Add the slideshow object to the window (global) scope
	window.Slideshow = Slideshow;

	//Helpful functions
	function isUndefined(value){return typeof value === 'undefined';}
	function isDefined(value){return typeof value !== 'undefined';}
	function isString(value){return typeof value === 'string';}
	function isNumber(value){return typeof value === 'number';}
	function isObject(value){return value !== null && typeof value === 'object';}
	function isArray(value) {return toString.apply(value) === '[object Array]';}
	function isBoolean(value) {return typeof value === 'boolean';}

	//Avoid IE console
	function say(str){
		if ( console && console.log ) {
			console.log(str);
		}
	}

	/**
	 * Slideshow object constructor
	 * When creating a slideshow instance, pass the html ID
	 */
	function Slideshow(_htmlId){
		_htmlId = _htmlId.replace("#", ""); //remove # if present
		this.$el = $('#' + _htmlId); //reference to jQuery object for slideshow DOM element
		if(this.$el.length == 0){
			// no element found
			throw new Error('Please provide a valid DOM element for the slideshow to populate. Pass an html ID.');
		}; 
	}

	// Parameters for the slideshow object
	Slideshow.prototype.params = {
		version            : '1.0',

		//after slideshow appears, set to true to prevent future calls to fadeIn.
		fadedIn            : false,
		
		//The speed various items fade in/out at. milliseconds
		fadespeed          : 200,
		
		//The index which is currently open
		indexcurrentlyopen : 0,
		
		//The slot of pixels to slide the index when animating
		indexmovewidth     : 220,
		
		//For future flexibility
		slidecount         : 6,
		
		//slot of pixels (used to set up track)
		slideheight        : 455,
		
		//the first slide to load
		slideToStartOn     : 1
	};

	/* Will contain slide objects (JSON) */
	Slideshow.prototype.slides = [];

	/**
	 * Call this function after adding 6 or more slides
	 * Defines several constants.
	 * Also calls a few immediate functions (things needed before page load complete)
	 * @param int [slide to start the slideshow on]
	 */
	Slideshow.prototype.begin = function(slideToStartOn) {
		//doesn't return, loads ajax. 
		//when last ajax is done, callback function passed to this.Ajax.processQueue() is called.

		//optional, over-ride default slide to start on
		isNumber(slideToStartOn) ? this.params.slideToStartOn = slideToStartOn : '';

		//Attempt to process the Ajax queue. When done, run the callback
		//pass this scope so the Ajax callback has access to it
		//(and our callback function when it's called)
		var waitForSlides = this.Ajax.processQueue(this, function(data, status, rootScope){
			rootScope.launch();
		});

		//if the Ajax queue was empty, our callback won't get called
		//so we call it manually here
		if(!waitForSlides){
			this.launch();
		}
	}

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
		 * If the queue is empty, return false
		 * If slides are being processed, return true
		 */
		processQueue : function(scope, callback){
			if(this.queue.length < 1){
				return false;
			}
			say('processing queue')
			var slides = [];
			for(var i = 0; i < this.queue.length; i++){
				this.getSlide(this.queue[i].url, this.queue[i].slot, callback, scope);
			}
			return true;
		},

		/**
		 * Get an individual slide via ajax
		 * @param string slideUrl
		 * @param int slotNum
		 */
		getSlide : function(slideUrl, slot, callback, scope){
			$.ajax({
				url: slideUrl,
				cache: true,
				type:'GET',
				beforeSend: function( xhr ) {},
				success: function(data, status){
					//add the slide object to slideshow.slides
					scope.addSlide(data, slot);
					if(++scope.Ajax.queueComplete == scope.Ajax.queue.length ){
						callback(data, status, scope);
					}
				}
			}).fail( function(e){
				throw new Error('failed to load slide');
				throw new Error(e);
			});
		}
	};


	/**
	 * Add a slide to the slideshow 
	 *
	 * You may overload a spot.
	 * For instance you may add a slide to slot 4 twice when adding slides.
	 * The last slide added to a spot is used.
	 *
	 * URL Method (string)
	 * SAME DOMAIN ONLY
	 * If passing a URL, the slide is added to a queue.
	 * To add a slide via URL, usually you pass '/slides/slidename.json' as a parameter.
	 *
	 * Object Method (object)
	 * Pass a javascript object literal, or a JSON object as a parameter
	 *
	 * Arrays
	 * You may pass an array slides (using either method described above, URLs or Object literals)
	 *    ! You must also pass an array of slot numbers, not an integer.
	 *    Mixing array and non array arguments will result in an error.
	 *
	 * @param slide [mixed] ([string] URL, [object] JSON object, or [array] of URL or Objects)
	 * @param int [slot 1-6] or array of ints (which correlate to the array of JSON objects)
	 * @return undefined
	 */
	Slideshow.prototype.addSlide = function(slide, slot){
		//if not array, convert to array with single value for consistent handling
		if( ! isArray(slide)){ slide = [slide]; };
		if( ! isArray(slot)){ slot = [slot]; };

		//cycle through "slide" objects, and take appropriate action
		for(var i = 0; i < slide.length; i++){
			//add to ajax queue
			if(isString(slide[i]) && isNumber(slot[i])){
				//say("!A! Queueing URLs " + slide + " in slots " + slot);
				this.Ajax.addToQueue(slide[i], slot[i]); //'slide' is actually a string here
			};
			//add directly to slideshow.slides
			if(isObject(slide[i]) && isNumber(slot[i]) && ! isArray(slide[i]) ){
				//say('adding slide to slot ' + slot);
				/*if(! this.validSlide(slide[i])){
					throw new Error("Invalid slide. Attempting to add to slot " + slot[i]);
				}*/
				this.addSlideObject(slide[i], slot[i]);		
			};
		}
	}


	/**
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
			isObject(slide)
			&& isString(slide.alt)
			&& isString(slide.indexup)
			&& isString(slide.indexover)
			&& isString(slide.slider)
			&& isString(slide.stampup)
			&& isString(slide.stampover)
			&& isString(slide.product_link)
			&& isString(slide.stamp_top_css)
		);
	}


	/**
	 * Checks if we have the specified number of valid slides
	 * (default is 6, see this.params.slidecount)
	 * @param array of slide objects
	 * @return boolean [true if all slides are valid]
	 */
	Slideshow.prototype.allSlidesValid = function(slides){
		for(var i = 1; i <= this.params.slidecount; i++){
			if(!this.validSlide(slides[i])){
				return false;
			}
		}
		return true;
	}


	/**
	 * The internal method to launch the actual slideshow.
	 * Do not call this from your web page.
	 */
	Slideshow.prototype.launch = function(){
		say('slides should be resolved, launching slideshow');
		if(this.allSlidesValid(this.slides)){
			//say('all slides are valid, launching');

			//calculate track height
			this.params.trackheight = this.params.slideheight * this.params.slidecount;

			//build html and add to DOM
			this.$el.html(this.buildHtml());
			
			//TODO this.attachHandlers();
			//TODO this.fadeIn();
			$('#sts-slideshow').fadeIn('fast'); //hack TODO remove
			$('.sts-stamp').fadeIn('fast'); //hack TODO remove
		} else {	
			throw new Error('Slideshow attempting to launch with invalid list of slides: ' + this.slides);
		};
	}


	/**
	 * Build slideshow HTML and components
	 */
	Slideshow.prototype.buildHtml = function(){
		say('building html');
		say(this.slides);

		var html = '<div id="sts-slideshow">';
			html += '<div id="sts-indices">';
			for(var i = 1; i <= this.params.slidecount; i++){
				html += '<div id="sts-index-'+i+'" class="sts-index">'
					html += _hm(_himg(this.slides[i].indexup), 'div', '', 'sts-index-up');
					s += '<a href="' + this.slides[i].product_link + '">';
						html += _hm(_himg(this.slides[i].indexover), 'div', '', 'sts-index-over');
					s += '</a>';
				html += '</div>';
			}
			html += '</div><!-- /#sts-indices -->';
		
			html += '<div id="sts-slides">';
			for(var i = 1; i <= this.params.slidecount; i++){
				var s = '<div id="sts-slider-'+i+'" class="sts-slider">';
					s += '<a href="' + this.slides[i].product_link + '">';
						s += _himg(this.slides[i].slider);
					s += '</a>';
				s += '</div><!-- /#sts-slider-'+i+' -->';
				s += '<div class="sts-stamp" style="top:'+this.slides[i].stamp_top_css+'">';
					s += '<div class="sts-stamp-up">';
						s += _himg(this.slides[i].stampup);
					s += '</div>';
					s += '<div class="sts-stamp-over">';
						s += '<a href="' + this.slides[i].product_link + '">';
							s += _himg(this.slides[i].stampover);
						s += '</a>';
					s += '</div>';
				s += '</div><!-- /.sts-stamp -->';
					
				html += _hm(s, 'div', '', 'sts-slider');
			}
			html += '</div><!-- /#sts-slides -->';
		html += '</div><!-- /#sts-slideshow -->';
		return html;
	}

	/**
	 * _hm (html markup. two-part tags)
	 * @description Wraps content in the appropriate markup with the tag specified
	 * Do not use for self-closing tags, like img, br or hr
	 *
	 * @param string {contents} the contents of the div
	 * @param string {tag} the tag, such as 'div'
	 * @param string {_id} the HTML id
	 * @param string {_class} the HTML class
	 * @param string {_str} an arbitrary string to include in the tag
	 * @returns string {html markup}
	 */
	function _hm(contents, tag, _id, _class, _str){
		_id ? _id = ' id="'+_id+'"' : _id='';
		_class ? _class = ' class="'+_class+'"' : _class='';
		_str ? _str = ' '+_str : _str='';
		return '<'+tag+_id+_class+_str+'>'+contents+'</'+tag+'>';
	}

	function _himg(src, _str){
		_str ? _str = ' '+_str : _str='';
		return '<img src="'+src+'"'+_str+' />';
	}
})( window, jQuery );
