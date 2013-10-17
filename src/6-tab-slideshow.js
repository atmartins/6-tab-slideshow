/**
 * The 6 Tab Slideshow
 * version 1.0
 * 
 * Author: Aaron Martins
 *
 * Requires jQuery 1.8.2+
 *
 * Full Instructions: http://aaronmartins.com/docs/6-tab-slideshow/
 *
 * @license
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
	if(! window.jQuery ){ throw new Error('Slideshow requires jQuery 1.8.2+'); };

	//Add the slideshow object to the window (global) scope
	window.Slideshow = Slideshow;

	//Helpful type checking functions
	function isUndefined(value){return typeof value === 'undefined';}
	function isDefined(value){return typeof value !== 'undefined';}
	function isString(value){return typeof value === 'string';}
	function isNumber(value){return typeof value === 'number';}
	function isObject(value){return value !== null && typeof value === 'object';}
	function isArray(value){return Object.prototype.toString.call(value) === '[object Array]';}
	function isBoolean(value){return typeof value === 'boolean';}

	// Add our one easing method to jQuery
	$.extend($.easing, {
	    easeOutQuart: function (x, t, b, c, d) {
	        return -c * ((t=t/d-1)*t*t*t - 1) + b;
	    }
	});

	/**
	 * @param {string} String to log
	 * @return {sideeffect} Logs string to console, avoiding IE errors
	 */
	function say(str){
		if ( window.console && window.console.log ) {
			console.log(str);
		}
	}

	/**
	 * @description Wraps content in the appropriate markup with the tag specified
	 *  Do not use for self-closing tags, like img, br or hr
	 *
	 * @param {string} The contents of the div
	 * @param {string} The tag, such as 'div'
	 * @param {string} The HTML id
	 * @param {string} The HTML class
	 * @param {string} An arbitrary string to include in the tag (optional)
	 * @return {string} HTML markup
	 */
	function _hm(contents, tag, _id, _class, _str){
		_id ? _id = ' id="'+_id+'"' : _id='';
		_class ? _class = ' class="'+_class+'"' : _class='';
		_str ? _str = ' '+_str : _str='';
		return '<'+tag+_id+_class+_str+'>'+contents+'</'+tag+'>';
	}

	/**
	 * @param {string} The image src
	 * @param {string} An arbitrary string to include in the tag
	 * @return {string} HTML image element
	 */
	function _himg(src, _str){
		_str ? _str = ' '+_str : _str='';
		return '<img src="'+src+'"'+_str+' />';
	}

	/**
	 * @type {boolean}
	 * @description jQuery.support.transition to verify that CSS3 transition 
	 *  is supported (or any of its browser-specific implementations)
	 */
	$.support.transition = (function(){ 
	    var thisBody = document.body || document.documentElement,
	    thisStyle = thisBody.style,
	    support = thisStyle.transition !== undefined || thisStyle.WebkitTransition !== undefined || thisStyle.MozTransition !== undefined || thisStyle.MsTransition !== undefined || thisStyle.OTransition !== undefined;
	    return support; 
	})();



	/**
	 * @description Slideshow object constructor
	 * @param {string} The ID of the HTML element to place the slideshow
	 */
	function Slideshow(_htmlId){
		_htmlId = _htmlId.replace("#", ""); //remove # if present
		this.$el = $('#' + _htmlId); //reference to jQuery object for slideshow DOM element
		if(this.$el.length == 0){
			// no element found
			throw new Error('Please provide a valid DOM element for the slideshow to populate. Pass an html ID.');
		}; 
	}

	/**
	 * @type {Object} Parameters for the slideshow object
	 */
	Slideshow.prototype.params = {
		//@type {string} version number
		version            : '1.0',

		//@type {boolean} after slideshow appears, set to true to prevent future calls to fadeIn.
		fadedIn            : false,
		
		//@type {number} The speed various items fade in/out at. milliseconds
		fadespeed          : 200,
		
		//@type {number} The index which is currently open
		indexcurrentlyopen : 0,
		
		//@type {number} The slot of pixels to slide the index when animating
		indexmovewidth     : 220,
		
		//@type {number} For future flexibility
		slidecount         : 6,
		
		//@type {number} slot of pixels (used to set up track)
		slideheight        : 455,
		
		//@type {number} the first slide to load
		slideToStartOn     : 1
	};

	/**
	 * @type {Array} Will contain slide objects (JSON)
	 */
	Slideshow.prototype.slides = [];

	/**
	 * @description Call this function after adding 6 or more slides
	 *  Defines several constants.
	 *  Also calls a few immediate functions (things needed before page load complete)
	 * @param {integer} Slot number between 1 and params.slidecount to start the slideshow on
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

	/**
	 * @type {Object}
	 * @description If any slides are requested by URL they're added to a queue and processed.
	 */
	Slideshow.prototype.Ajax = {
		// @type {Array} If any slides are requested by URL they're added to a queue and processed.
		queue : [],
		
		// @type {number} Number of ajax slides which have finished loading.
		queueComplete : 0,

		/**
		 * @description Add a url and slot number to the queue
		 * @param {string} The slide url
		 * @param {integer} Slot number between 1 and params.slidecount
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
		 * @description Empty the contents of the Ajax queue. Useful for unit testing
		 * @return {undefined}
		 */
		emptyQueue : function(){
			this.queue = [];
		},

		/**
		 * @description Return the URL for a slideshow slot.
		 * @param {number} Slot number between 1 and params.slidecount
		 * @return {string} Slide url
		 */
		getUrlBySlot : function(slot){
			var index = this.getIndexBySlot(slot);
			if(index > -1 && index !== 'undefined'){ //0 is falsy but a valid array index
				return this.queue[index].url;
			}
		},

		/**
		 * @description Return the queue index for a slideshow slot number, if exists in queue
		 * @param {number} Slot number between 1 and params.slidecount
		 * @return {number} Queue array index
		 */
		getIndexBySlot : function(slot){
			for(var i = 0; i < this.queue.length; i++){
				if(this.queue[i].slot == slot){
					return i;
				}
			}
		},

		/**
		 * @param {number} Slot number between 1 and params.slidecount
		 * @return {boolean} true if the given slot is reserved in our queue for a slide
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
		 * @description Load the slide objects via AJAX
		 *  When all are done, calls the callback and passes an array of slide objects to it
		 * @param {Object} Scope of the slideshow
		 * @param {Function} The callback function to call when queue is processed
		 * @return {boolean} false if the queue is empty, true if slides are being processed
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
		 * @description Get an individual slide via ajax
		 * @param {string} The json slide URL
		 * @param {number} Slot number between 1 and params.slidecount
		 * @param {Function} The callback function to call when queue is processed
		 * @param {Object} Scope of the slideshow
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
	 * @description Add a slide to the slideshow 
	 *
	 *  You may overload a spot.
	 *  For instance you may add a slide to slot 4 twice when adding slides.
	 *  The last slide added to a spot is used.
	 *
	 *  URL Method (string)
	 *  SAME DOMAIN ONLY
	 *  If passing a URL, the slide is added to a queue.
	 *  To add a slide via URL, usually you pass '/slides/slidename.json' as a parameter.
	 *
	 *  Object Method (object)
	 *  Pass a javascript object literal, or a JSON object as a parameter
	 *
	 *  Arrays
	 *  You may pass an array slides (using either method described above, URLs or Object literals)
	 *    ! You must also pass an array of slot numbers, not an integer.
	 *    Mixing array and non array arguments will result in an error.
	 *
	 * @param {string|Object|array} string: URL, Object: JSON object literal, or Array: of URL or Objects
	 * @param {number|array} slot number or array of slot numbers (which correlate to the array of JSON objects)
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
				//'slide' is actually a string here
				this.Ajax.addToQueue(slide[i], slot[i]); 
			};
			//add directly to slideshow.slides
			if(isObject(slide[i]) && isNumber(slot[i]) && ! isArray(slide[i]) ){
				this.addSlideObject(slide[i], slot[i]);		
			};
		}
	}

	/**
	 * @description Add a slide to the stack for the real slot
	 *  Use Slideshow.addSlide() to add slides
	 *
	 * @param {Object} The slide object literal
	 * @param {number} Slot number between 1 and params.slidecount
	 * @return undefined
	 */
	Slideshow.prototype.addSlideObject = function(slide, slot){
		this.slides[slot] = slide;
	}

	/**
	 * @description Returns a slide for the real slot
	 * @param {number} Slot number between 1 and params.slidecount
	 * @return {Object} A slide object
	 */
	Slideshow.prototype.getSlide = function(slot){
		return this.slides[slot];
	}

	/**
	 * @description Checks if a given object is a valid slideshow slide
	 * @param {Object}
	 * @return {boolean} True if slide is structured correctly
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
	 * @description Checks if we have the specified number of valid slides
	 *  (this.params.slidecount)
	 * @param {Array} Array of slide objects
	 * @return {boolean} True if all slides are valid
	 */
	Slideshow.prototype.allSlidesValid = function(slides){
		for(var i = 1; i <= this.params.slidecount; i++){
			if(!this.validSlide(slides[i])){
				return false;
			}
		}
		return true;
	}

/* =========================== Launch ========================== */

	/**
	 * @description The internal method to launch the actual slideshow.
	 *  Do not call this from your web page.
	 */
	Slideshow.prototype.launch = function(){
		say('slides should be resolved, launching slideshow');
		if(this.allSlidesValid(this.slides)){
			//build html and add to DOM
			this.$el.html(this.buildHtml());
			this.positionElements();
			this.attachHandlers();
			this.goToSlide(this.params.slideToStartOn);
			$('#sts-slideshow').fadeIn('fast'); //hack TODO remove
			$('.sts-stamp').fadeIn('fast'); //hack TODO remove
		} else {	
			throw new Error('Slideshow attempting to launch with invalid list of slides: ' + this.slides);
		};
	}

	/**
	 * @description Position various elements
	 */
	Slideshow.prototype.positionElements = function(){
		say('positionElements');
		$('#sts-slides').css('height', this.params.slideheight * this.params.slidecount + 'px');
		for(var i = 1; i <= this.params.slidecount; i++){
			$('#sts-slider-'+i).css('top', (this.params.slideheight * i) + 'px');
		}		
	}

	/**
	 * @description Attach mouse and other event handlers to various elements in DOM
	 *  Make several jQuery objects available class-wide
	 */
	Slideshow.prototype.attachHandlers = function(){
		say('attaching handlers');
		var _this = this;
		//calculate track height
		this.$track = $('#sts-slides');
		
		this.$index = [];
		this.$stamp = [];
		for(var i = 1; i <= this.params.slidecount; i++){
			this.$index[i] = {
				el: $('#sts-index-'+i),
				up: $('#sts-index-up-'+i),
				over:$('#sts-index-over-'+i)
			}
			this.$stamp[i] = {
				el: $('#sts-stamp-'+i),
				up: $('#sts-stamp-up-'+i),
				over:$('#sts-stamp-over-'+i)
			}
			$('.sts-index').hover(
  				function(){
  					//$(this).data("number");
					_this.goToSlide($(this).data("number"));
				}
			);
			this.$stamp[i].over.hover(
  				function(){
					$(this).fadeTo('fast',1);
				},
				function() {
    				$(this).fadeTo('fast',0.001);
  				}
			);
		}
	}

	/**
	 * @description Animate to a numbered slide.
	 * @param {number} Slot number between 1 and params.slidecount
	 */
	Slideshow.prototype.goToSlide = function(number){
		//dont animate if the slide is already open
		if(this.indexcurrentlyopen != number){
			say('going to slide ' + number);
			this.animateTrack(number);
			this.animateIndex(this.$index[number].over, 'open');
		}

		//set the current index number so we know it on the next goToSlide call
		this.indexcurrentlyopen = number;
	}

	/**
	 * @description Animate the track to show the appropriate slide
	 * @param {number} Slot number between 1 and params.slidecount
	 */
	Slideshow.prototype.animateTrack = function(number){
		if($.support.transition){
			//Use transit for CSS animations
			//Move slide track to appropriate spot
			this.$track.transition({ top: (-1*number*this.params.slideheight),queue: false }, 200);
		} else {
			//Use jQuery animate
			//Move slide track to appropriate spot
			this.$track.stop().animate({
				top: (-1*number*this.params.slideheight)
			}, {
				duration: 1000,
				queue: false,
				easing: "easeOutQuart"
			});
		}
	}

	/**
	 * @description Animate and index open or closed
	 * @param {Object} - $obj jQuery object reference
	 * @param {string} - state 'open' or 'close'
	 */
	Slideshow.prototype.animateIndex = function($obj, state){
		var pos; //pixel value to move to
		state == 'open' ? pos = 0 : pos = -220; //depends on open or close
		
		//only index 1 through 6 are relevant, 0 is a special case we use to avoid this call
		if(this.indexcurrentlyopen > 0){
			var temp = this.indexcurrentlyopen; //store value temporarily
			this.indexcurrentlyopen = 0; //avoid repeated calls
			this.animateIndex(this.$index[temp].over, 'close');
		}

		//if css transitions are available
		if($.support.transition){
			$obj.transition({ left: pos,queue: false }, 500, 'snap');
		} else {
			$obj.stop().animate({
				left: pos
			}, {
				duration: 500,
				queue: false,
				easing: "easeOutQuart"
			});		
		}
	}

	/**
	 * @description Build slideshow HTML and components
	 * @return {string} HTML for the slideshow
	 */
	Slideshow.prototype.buildHtml = function(){
		say('building html');
		say(this.slides);

		var html = '<div id="sts-slideshow">';
			html += '<div id="sts-indices">';
			for(var i = 1; i <= this.params.slidecount; i++){
				html += '<div id="sts-index-'+i+'" data-number="'+i+'" class="sts-index">'
					html += _hm(_himg(this.slides[i].indexup), 'div', 'sts-index-up-'+i, 'sts-index-up');
					s += '<a href="' + this.slides[i].product_link + '">';
						html += _hm(_himg(this.slides[i].indexover), 'div', 'sts-index-over-'+i, 'sts-index-over');
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
				
				s += '<div id="sts-stamp-'+i+'" class="sts-stamp" style="top:'+this.slides[i].stamp_top_css+'">';
					s += '<div id="sts-stamp-up-'+i+'" class="sts-stamp-up">';
						s += _himg(this.slides[i].stampup);
					s += '</div>';
					s += '<div id="sts-stamp-over-'+i+'"  class="sts-stamp-over">';
						s += '<a href="' + this.slides[i].product_link + '">';
							s += _himg(this.slides[i].stampover);
						s += '</a>';
					s += '</div>';
				s += '</div><!-- /.sts-stamp -->';
				s += '</div><!-- /#sts-slider-'+i+' -->';
				html += s;
			}
			html += '</div><!-- /#sts-slides -->';
		html += '</div><!-- /#sts-slideshow -->';
		return html;
	}

})( window, jQuery );
