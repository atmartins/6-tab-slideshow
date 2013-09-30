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

//(function($){
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
			var inQueue = this.getIndexBySlot(slot);
			if(inQueue){
				//overwrite current queue position. only one slide allowed
				this.queue[inQueue] = {
					url:slideUrl,
					slot:slot
				};
			} else {
				this.queue.push({
					url:slideUrl,
					slot:slot
				});	
			}
		},

		/**
		 * Return the URL for a slideshow slot.
		 * @param integer (slot, 1-6)
		 * @return string (slide url)
		 */
		getUrlBySlot : function(slot){
			var index = this.getIndexBySlot(slot);
			if(index > -1 && index != 'undefined'){ //0 is falsy but a valid array index
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
				if(this.queue[i]){
					return i;
				}
			}
		}
	};



	/**
	 * Loads any Ajax slides
	 * When all are finished, calls the callback.
	 *
	 * @return array of needed slide objects {url, slot}
	 */
	Slideshow.prototype.getAjaxSlides = function(){
		var _this = this;
		for(var i = 0; i < _this.Ajax.queue.length; i++){
			var slotNum = _this.Ajax.queue[i].slot;
			var slideUrl = _this.Ajax.queue[i].url			
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
			//say('this slot num from URL: ' + _this.ajaxGetslotFromQueue(this.url));
			//add the slide to the stack at the proper place (slot)
			//because the success function does not inherit the proper scope,
			//we must look up the proper slot for our slide
			slideshow.addSlide(data, slideshow.ajaxGetslotFromQueue(this.url));
			slideshow.ajax.queueComplete++; //another request complete
			slideshow.ajaxSlideComplete(); //check if this was the last slide (if so, launches slideshow)
		}).fail( function(e){
			throw new Error('failed to load slide');
			throw new Error(e);
			say(e);
		});
	}

	/* Return the "slot" property from the object in the ajax queue for a given URL */
	Slideshow.prototype.ajaxGetslotFromQueue = function(url){
		say('checking slot for '+url);
		for(var i = 0; i < this.Ajax.queue.length; i++){
			if( this.Ajax.queue[i].url === url ){
				say('ajaxGetslotFromQueue found slot:'+this.Ajax.queue[i].slot);
				return this.Ajax.queue[i].slot;
			};
		}
	}

	/**
	 * Remove a slide from the Ajax queue (by slide slot not array index)
	
	Slideshow.prototype.ajaxDeregisterSlide = function(slot){
		//say('deregistering ' + slot);
		for(var i = 0; i < this.Ajax.queue.length; i++){
			if( this.Ajax.queue[i].slot === slot ){
				say('ajaxDeregisterSlide deregistering slot:'+this.Ajax.queue[i].slot);
				
				say('ajaxDeregisterSlide found at index:'+i);
				this.Ajax.queue.splice(i, 1);
				//say(this.Ajax.queue);
			};
		}
	} */

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
		if(typeof slide === "string" && typeof slot === "number"){
			say("!A! registering slide URL for slot " + slot);
			this.Ajax.addToQueue(slide, slot); //slide is actually a URL here
			return;
		};
		if(Array.isArray(slide) && Array.isArray(slot)){
			//TODO deregister slides from queue before proceeding (in case attempting to schedule or overwrite)
			say("!A! Adding slides from array in slots " + slot);
			for(var i = 0; i < slide.length; i++){
				this.addSlideObject(slide[i],slot[i]);
			}
			return;
		};
		if(typeof slide === "object" && typeof slot === "number" && ! Array.isArray(slide) ){
			//TODO deregister slide from queue before proceeding (in case attempting to schedule or overwrite)
			say("!A! Adding slide from individual object in slot " + slot);
			this.addSlideObject(slide,slot);
			return;
		};
		throw new Error("!A! Unable to add slide object(s). Incorrect type combination: " + slide + " slot: "+ slot);
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
		return this.slides[slot - 1];
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
		
		this.getAjaxSlides();	
	}

	Slideshow.prototype.launch = function(){
		say('slides should be resolved, launching app');
		//--All slides ready to use at this point--
		
		say(slideshow.slides);
		//say(slideshow.getSlide(1).alt);
		//say(slideshow.getSlide(5).alt);
	}


/*
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
	
*/

//})(jQuery);

