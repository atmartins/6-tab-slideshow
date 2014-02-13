/* Modernizr 2.7.1 (Custom Build) | MIT & BSD
 * Build: http://modernizr.com/download/#-csstransitions-cssclasses-testprop-testallprops-domprefixes-load
 */
;window.Modernizr=function(a,b,c){function x(a){j.cssText=a}function y(a,b){return x(prefixes.join(a+";")+(b||""))}function z(a,b){return typeof a===b}function A(a,b){return!!~(""+a).indexOf(b)}function B(a,b){for(var d in a){var e=a[d];if(!A(e,"-")&&j[e]!==c)return b=="pfx"?e:!0}return!1}function C(a,b,d){for(var e in a){var f=b[a[e]];if(f!==c)return d===!1?a[e]:z(f,"function")?f.bind(d||b):f}return!1}function D(a,b,c){var d=a.charAt(0).toUpperCase()+a.slice(1),e=(a+" "+n.join(d+" ")+d).split(" ");return z(b,"string")||z(b,"undefined")?B(e,b):(e=(a+" "+o.join(d+" ")+d).split(" "),C(e,b,c))}var d="2.7.1",e={},f=!0,g=b.documentElement,h="modernizr",i=b.createElement(h),j=i.style,k,l={}.toString,m="Webkit Moz O ms",n=m.split(" "),o=m.toLowerCase().split(" "),p={},q={},r={},s=[],t=s.slice,u,v={}.hasOwnProperty,w;!z(v,"undefined")&&!z(v.call,"undefined")?w=function(a,b){return v.call(a,b)}:w=function(a,b){return b in a&&z(a.constructor.prototype[b],"undefined")},Function.prototype.bind||(Function.prototype.bind=function(b){var c=this;if(typeof c!="function")throw new TypeError;var d=t.call(arguments,1),e=function(){if(this instanceof e){var a=function(){};a.prototype=c.prototype;var f=new a,g=c.apply(f,d.concat(t.call(arguments)));return Object(g)===g?g:f}return c.apply(b,d.concat(t.call(arguments)))};return e}),p.csstransitions=function(){return D("transition")};for(var E in p)w(p,E)&&(u=E.toLowerCase(),e[u]=p[E](),s.push((e[u]?"":"no-")+u));return e.addTest=function(a,b){if(typeof a=="object")for(var d in a)w(a,d)&&e.addTest(d,a[d]);else{a=a.toLowerCase();if(e[a]!==c)return e;b=typeof b=="function"?b():b,typeof f!="undefined"&&f&&(g.className+=" "+(b?"":"no-")+a),e[a]=b}return e},x(""),i=k=null,e._version=d,e._domPrefixes=o,e._cssomPrefixes=n,e.testProp=function(a){return B([a])},e.testAllProps=D,g.className=g.className.replace(/(^|\s)no-js(\s|$)/,"$1$2")+(f?" js "+s.join(" "):""),e}(this,this.document),function(a,b,c){function d(a){return"[object Function]"==o.call(a)}function e(a){return"string"==typeof a}function f(){}function g(a){return!a||"loaded"==a||"complete"==a||"uninitialized"==a}function h(){var a=p.shift();q=1,a?a.t?m(function(){("c"==a.t?B.injectCss:B.injectJs)(a.s,0,a.a,a.x,a.e,1)},0):(a(),h()):q=0}function i(a,c,d,e,f,i,j){function k(b){if(!o&&g(l.readyState)&&(u.r=o=1,!q&&h(),l.onload=l.onreadystatechange=null,b)){"img"!=a&&m(function(){t.removeChild(l)},50);for(var d in y[c])y[c].hasOwnProperty(d)&&y[c][d].onload()}}var j=j||B.errorTimeout,l=b.createElement(a),o=0,r=0,u={t:d,s:c,e:f,a:i,x:j};1===y[c]&&(r=1,y[c]=[]),"object"==a?l.data=c:(l.src=c,l.type=a),l.width=l.height="0",l.onerror=l.onload=l.onreadystatechange=function(){k.call(this,r)},p.splice(e,0,u),"img"!=a&&(r||2===y[c]?(t.insertBefore(l,s?null:n),m(k,j)):y[c].push(l))}function j(a,b,c,d,f){return q=0,b=b||"j",e(a)?i("c"==b?v:u,a,b,this.i++,c,d,f):(p.splice(this.i++,0,a),1==p.length&&h()),this}function k(){var a=B;return a.loader={load:j,i:0},a}var l=b.documentElement,m=a.setTimeout,n=b.getElementsByTagName("script")[0],o={}.toString,p=[],q=0,r="MozAppearance"in l.style,s=r&&!!b.createRange().compareNode,t=s?l:n.parentNode,l=a.opera&&"[object Opera]"==o.call(a.opera),l=!!b.attachEvent&&!l,u=r?"object":l?"script":"img",v=l?"script":u,w=Array.isArray||function(a){return"[object Array]"==o.call(a)},x=[],y={},z={timeout:function(a,b){return b.length&&(a.timeout=b[0]),a}},A,B;B=function(a){function b(a){var a=a.split("!"),b=x.length,c=a.pop(),d=a.length,c={url:c,origUrl:c,prefixes:a},e,f,g;for(f=0;f<d;f++)g=a[f].split("="),(e=z[g.shift()])&&(c=e(c,g));for(f=0;f<b;f++)c=x[f](c);return c}function g(a,e,f,g,h){var i=b(a),j=i.autoCallback;i.url.split(".").pop().split("?").shift(),i.bypass||(e&&(e=d(e)?e:e[a]||e[g]||e[a.split("/").pop().split("?")[0]]),i.instead?i.instead(a,e,f,g,h):(y[i.url]?i.noexec=!0:y[i.url]=1,f.load(i.url,i.forceCSS||!i.forceJS&&"css"==i.url.split(".").pop().split("?").shift()?"c":c,i.noexec,i.attrs,i.timeout),(d(e)||d(j))&&f.load(function(){k(),e&&e(i.origUrl,h,g),j&&j(i.origUrl,h,g),y[i.url]=2})))}function h(a,b){function c(a,c){if(a){if(e(a))c||(j=function(){var a=[].slice.call(arguments);k.apply(this,a),l()}),g(a,j,b,0,h);else if(Object(a)===a)for(n in m=function(){var b=0,c;for(c in a)a.hasOwnProperty(c)&&b++;return b}(),a)a.hasOwnProperty(n)&&(!c&&!--m&&(d(j)?j=function(){var a=[].slice.call(arguments);k.apply(this,a),l()}:j[n]=function(a){return function(){var b=[].slice.call(arguments);a&&a.apply(this,b),l()}}(k[n])),g(a[n],j,b,n,h))}else!c&&l()}var h=!!a.test,i=a.load||a.both,j=a.callback||f,k=j,l=a.complete||f,m,n;c(h?a.yep:a.nope,!!i),i&&c(i)}var i,j,l=this.yepnope.loader;if(e(a))g(a,0,l,0);else if(w(a))for(i=0;i<a.length;i++)j=a[i],e(j)?g(j,0,l,0):w(j)?B(j):Object(j)===j&&h(j,l);else Object(a)===a&&h(a,l)},B.addPrefix=function(a,b){z[a]=b},B.addFilter=function(a){x.push(a)},B.errorTimeout=1e4,null==b.readyState&&b.addEventListener&&(b.readyState="loading",b.addEventListener("DOMContentLoaded",A=function(){b.removeEventListener("DOMContentLoaded",A,0),b.readyState="complete"},0)),a.yepnope=k(),a.yepnope.executeStack=h,a.yepnope.injectJs=function(a,c,d,e,i,j){var k=b.createElement("script"),l,o,e=e||B.errorTimeout;k.src=a;for(o in d)k.setAttribute(o,d[o]);c=j?h:c||f,k.onreadystatechange=k.onload=function(){!l&&g(k.readyState)&&(l=1,c(),k.onload=k.onreadystatechange=null)},m(function(){l||(l=1,c(1))},e),i?k.onload():n.parentNode.insertBefore(k,n)},a.yepnope.injectCss=function(a,c,d,e,g,i){var e=b.createElement("link"),j,c=i?h:c||f;e.href=a,e.rel="stylesheet",e.type="text/css";for(j in d)e.setAttribute(j,d[j]);g||(n.parentNode.insertBefore(e,n),m(c,0))}}(this,document),Modernizr.load=function(){yepnope.apply(window,[].slice.call(arguments,0))};

/**
 * The 6 Tab Slideshow
 * version 1.1
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

	//temp. mimic modernizr
	//var csstransitions = true;
	/*if(csstransitions){
		$('body').addClass('csstransitions');
	}*/
	
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
			&& (  ( isString(slide.indexup) && isString(slide.indexover) ) || ( isString(slide.index_line_1) && isString(slide.index_line_2) )  )
			&& isString(slide.slider)
			&& isString(slide.stampup)
			&& isString(slide.stampover)
			&& isString(slide.product_link)
			&& isNumber(slide.stamp_top_css)
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
			throw Error('Slideshow attempting to launch with invalid list of slides.');
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

		//cycle through all slides and attach event handlers
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
			
			this.$stamp[i].el.hover(
  				function(){
  					_this.animateStamp($(this), 1);
				},
				function() {
					_this.animateStamp($(this), 0.001);
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
		//Use jQuery animate
		//Move slide track to appropriate spot

		//CSS3:
		if(Modernizr.csstransitions){
			//this.$track.css('transition','all 1s');
			this.$track.css('top',-1*number*this.params.slideheight + 'px');	
		} else {
			//JS (no CSS3):
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

		//CSS3:
		if(Modernizr.csstransitions){
			//this.$track.css('transition','all 1s');
			$obj.css('left', pos + 'px');	
		} else {
			//JS (no CSS3):
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
	 * @description Animate the stamp off or on
	 * @param {int} - Slide number of the stamp in question (usually 1-6)
	 * @param {string} - state Either 'on' or 'off'
	 */
	Slideshow.prototype.animateStamp = function($obj, value){
		
		//CSS3:
		if(Modernizr.csstransitions){
			//this.$track.css('transition','all 1s');
			$obj.children('.sts-stamp-over').css('opacity', value);	
		} else {
			//JS (no CSS3):
			$obj.children('.sts-stamp-over').fadeTo('fast', value);
		}
	}


	/**
	 * Build the HTML for the index up and over.
	 * Determines if indices are an image (old style), or plain text (new)
	 * @since 1.1
	 * @param {object} slide object
	 * @param {object} slide number (1-6 usually)
	 * @return {string} HTML for the entire index up and over DOM elements (for one slide)
	 */
	Slideshow.prototype.buildIndices = function(slide, number){
		var html = '';
		if(slide.indexup && slide.indexover){
			//indices are declared as images in the slide definition (JSON) (old style)
			//TODO remove eventually
			html += '<div id="sts-index-'+number+'" data-number="'+number+'" class="sts-index">'
				html += _hm(_himg(slide.indexup), 'div', 'sts-index-up-'+number, 'sts-index-up');
				html += '<a href="' + slide.product_link + '">';
					html += _hm(_himg(slide.indexover), 'div', 'sts-index-over-'+number, 'sts-index-over');
				html += '</a>';
			html += '</div>';
		} else if(slide.index_line_1 && slide.index_line_2) {
			//indices are declared as text in the slide definition (JSON)
			html += '<div id="sts-index-'+number+'" data-number="'+number+'" class="sts-index">'
				html += _hm('<div class="line-1">' + slide.index_line_1 + '</div><div class="line-2">' + slide.index_line_2 + '</div>', 'div', 'sts-index-up-'+number, 'sts-index-up text');
				html += '<a href="' + slide.product_link + '">';
					html += _hm('<div class="line-1">' + slide.index_line_1 + '</div><div class="line-2">' + slide.index_line_2 + '</div>', 'div', 'sts-index-over-'+number, 'sts-index-over text');
				html += '</a>';
			html += '</div>';
		} else {
			throw Error('Incorrect indices for slide ' + number);
		}

		return html;
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
				html += this.buildIndices(this.slides[i], i);			
			}
			html += '</div><!-- /#sts-indices -->';
		
			html += '<div id="sts-slides">';
			for(var i = 1; i <= this.params.slidecount; i++){
				var s = '<div id="sts-slider-'+i+'" class="sts-slider">';
					s += '<a href="' + this.slides[i].product_link + '">';
						s += _himg(this.slides[i].slider);
					s += '</a>';
				
				s += '<div id="sts-stamp-'+i+'" class="sts-stamp" style="top:'+this.slides[i].stamp_top_css+'px">';
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
