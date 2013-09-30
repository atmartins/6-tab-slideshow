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

(function($){
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
		//Debug mode
		DEBUG              : false,
		//after slideshow appears, set to true to prevent future calls to fadeIn.
		fadedIn            : false,
		//The speed various items fade in/out at. milliseconds
		fadespeed          : 200,
		//The index which is currently open
		indexcurrentlyopen : 0,
		//The number of pixels to slide the index when animating
		indexmovewidth     : 220,
		//Leave at 6
		slidecount         : 6,
		//Number of pixels (used to set up track)
		slideheight        : 455,
	};

	/* Will contain slide objects (JSON) */
	Slideshow.prototype.slides = [];

	/* If any slides are requested by URL they're added to a queue and processed. */
	Slideshow.prototype.slidesAjaxQueue = [];

	/* Number of ajax slides which have finished loading. */
	Slideshow.prototype.slidesAjaxQueueComplete = 0;

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
		
		this.getAjaxSlides();	
	}

	Slideshow.prototype.launch = function(){
		say('slides should be resolved, launching app');
		//--All slides ready to use at this point--
		
		say(slideshow.slides);
		//say(slideshow.getSlide(1).alt);
		//say(slideshow.getSlide(5).alt);
	}

	/**
	 * Loads any Ajax slides
	 * When all are finished, calls the callback.
	 *
	 * @return array of needed slide objects {url, number}
	 */
	Slideshow.prototype.getAjaxSlides = function(){
		var _this = this;
		for(var i = 0; i < _this.slidesAjaxQueue.length; i++){
			var slotNum = _this.slidesAjaxQueue[i].number;
			var slideUrl = _this.slidesAjaxQueue[i].url
			
			say('slide in queue '+ i + ' going into slot ' + slotNum);
			this.getAjaxSlide(slideUrl, slotNum);
		}
	}

	/**
	 * Get an individual slide via ajax
	 * @param string slideUrl
	 * @param int slotNum
	 */
	Slideshow.prototype.getAjaxSlide = function(slideUrl, slotNum){
		var slideshow = this;
		$.ajax({
			url: slideUrl,
			cache: true,
			type:'GET',
			beforeSend: function( xhr ) {
				say('----ajaxing for slot ' + slotNum + ' ' + slideUrl);
			}
		})
		.done( function( data ) {
			say('------------ success: this URL: ' + this.url);
			//say('this slot num from URL: ' + _this.ajaxGetNumberFromQueue(this.url));
			//add the slide to the stack at the proper place (number)
			//because the success function does not inherit the proper scope,
			//we must look up the proper number for our slide
			slideshow.addSlide(data, slideshow.ajaxGetNumberFromQueue(this.url), true); //true to avoid deregistration
			slideshow.slidesAjaxQueueComplete++; //another request complete
			slideshow.ajaxSlideComplete(); //check if this was the last slide (if so, launches slideshow)
		}).fail( function(e){
			throw new Error('failed to load slide');
			throw new Error(e);
			say(e);
		});
	}

	/* Return the "number" property from the object in the ajax queue for a given URL */
	Slideshow.prototype.ajaxGetNumberFromQueue = function(url){
		say('checking number for '+url);
		for(var i = 0; i < this.slidesAjaxQueue.length; i++){
			if( this.slidesAjaxQueue[i].url === url ){
				say('ajaxGetNumberFromQueue found number:'+this.slidesAjaxQueue[i].number);
				return this.slidesAjaxQueue[i].number;
			};
		}
	}

	/**
	 * Remove a slide from the Ajax queue (by slide number not array index)
	 */
	Slideshow.prototype.ajaxDeregisterSlide = function(number){
		//say('deregistering ' + number);
		for(var i = 0; i < this.slidesAjaxQueue.length; i++){
			if( this.slidesAjaxQueue[i].number === number ){
				say('ajaxDeregisterSlide deregistering number:'+this.slidesAjaxQueue[i].number);
				
				say('ajaxDeregisterSlide found at index:'+i);
				this.slidesAjaxQueue.splice(i, 1);
				//say(this.slidesAjaxQueue);
			};
		}
	}

	/**
	 * Checks if the ajax queue is empty
	 * If queue is empty, launch the slideshow
	 *
	 */
	Slideshow.prototype.ajaxSlideComplete = function(){
		if(this.slidesAjaxQueue.length == this.slidesAjaxQueueComplete){
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
	 * @param int [number 1-6] or array of ints (which correlate to the array of JSON objects)
	 * @param bool [register] if true, the slide will NOT be deregistered (useful on AJAX completion)
	 * @return undefined
	 */
	Slideshow.prototype.addSlide = function(slide, number, register){

		if(typeof slide === "string" && typeof number === "number"){
			say("registering slide URL");
			this.slidesAjaxQueue.push({
				url:slide,
				number:number
			});
			//this.addSlideObject({resolveUrl:slideUrl},number); //don't get the slide until slideshow is ready to launch
			return;
		};
		if(Array.isArray(slide) && Array.isArray(number)){
			//TODO deregister slides from queue before proceeding (in case attempting to schedule or overwrite)
			//say("adding slides from array");
			for(var i = 0; i < slide.length; i++){
				if(!register){
					this.ajaxDeregisterSlide(number[i]);	
				}
				this.addSlideObject(slide[i],number[i]);
			}
			return;
		};
		if(typeof slide === "object" && typeof number === "number" && ! Array.isArray(slide) ){
			//TODO deregister slide from queue before proceeding (in case attempting to schedule or overwrite)
			//say("adding slide from individual object");
			if(!register){
				this.ajaxDeregisterSlide(number);	
			}			
			this.addSlideObject(slide,number);
			return;
		};
		throw new Error("Unable to add slide object(s). Incorrect type combination." + slide + number);
	}

	/**
	 * Private
	 * Add a slide to the stack for the real number
	 * Use Slideshow.addSlide() to add slides
	 *
	 * @param object [slide object]
	 * @param int [number 1-6]
	 * @return undefined
	 */
	Slideshow.prototype.addSlideObject = function(slide, number){
		//say('adding slide with alt text ' + slide.alt + ' at slot ' + number);
		this.slides[number] = slide;
	}

	/**
	 * Returns a slide for the real number
	 * @param int [number 1-6]
	 * @return object [slide object]
	 */
	Slideshow.prototype.getSlide = function(number){
		return this.slides[number - 1];
	}





	var slideshow = new Slideshow('myslideshow');

	var desert = {
		"alt" : "desert slide", 
		"indexup" : "/images/desert_index-up.png", 
		"indexover" : "/images/desert_index-over.png",
		"slider" : "/images/desert_slider.png",
		"stampup" : "/images/desert_stamp-up.png",
		"stampover" : "/images/desert_stamp-over.png",
		"product_link" : "http://aaronmartins.com",
		"stamp_top_css" : "260px"
	}

	var multipleSlides = [{
		"alt" : "mountain slide", 
		"indexup" : "/images/mountain_index-up.png", 
		"indexover" : "/images/mountain_index-over.png",
		"slider" : "/images/mountain_slider.png",
		"stampup" : "/images/mountain_stamp-up.png",
		"stampover" : "/images/mountain_stamp-over.png",
		"product_link" : "http://aaronmartins.com",
		"stamp_top_css" : "260px"
	},{
		"alt" : "lake slide", 
		"indexup" : "/images/lake_index-up.png", 
		"indexover" : "/images/lake_index-over.png",
		"slider" : "/images/lake_slider.png",
		"stampup" : "/images/lake_stamp-up.png",
		"stampover" : "/images/lake_stamp-over.png",
		"product_link" : "http://aaronmartins.com",
		"stamp_top_css" : "260px"
	}];

	slideshow.addSlide(multipleSlides, [4,2]);
	slideshow.addSlide(desert, 5);
	slideshow.addSlide("slides/ocean.json", 1);
	//slideshow.addSlide("http://uoduckstore.com/promotions/2013/09/test.json", 3);
	slideshow.addSlide("slides/forest.json", 3);
	//slideshow.addSlide(mySlide, 3);
	slideshow.addSlide({
		"alt" : "rainforest slide", 
		"indexup" : "/images/rainforest_index-up.png", 
		"indexover" : "/images/rainforest_index-over.png",
		"slider" : "/images/rainforest_slider.png",
		"stampup" : "/images/rainforest_stamp-up.png",
		"stampover" : "/images/rainforest_stamp-over.png",
		"product_link" : "http://aaronmartins.com",
		"stamp_top_css" : "260px"
	},6);
	slideshow.addSlide({
		"alt" : "rainforest slide", 
		"indexup" : "/images/rainforest_index-up.png", 
		"indexover" : "/images/rainforest_index-over.png",
		"slider" : "/images/rainforest_slider.png",
		"stampup" : "/images/rainforest_stamp-up.png",
		"stampover" : "/images/rainforest_stamp-over.png",
		"product_link" : "http://aaronmartins.com",
		"stamp_top_css" : "260px"
	},1);
	slideshow.addSlide("slides/forest.json",1); //redeclaring an ajax slide doesn't over-ride
	slideshow.begin(4);
	


})(jQuery);










