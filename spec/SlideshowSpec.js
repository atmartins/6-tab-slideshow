describe("Slideshow", function() {
  var slideshow;
  
  beforeEach(function() {
    slideshow = new Slideshow('test-id');
  });

  it("should have the correct HTML Id", function() {
    expect(slideshow.htmlId).toEqual('test-id');
  });

  describe("Ajax - add slide by passing a URL", function() {
    beforeEach(function() {
      slideshow.addSlide("example/slides/forest.json",4); //redeclaring an ajax slide doesn't over-ride
    });

    afterEach(function() {
      slideshow.Ajax.queue = [];
    });

    it("should have one slide URL in the queue", function() {
      expect(slideshow.Ajax.queue.length).toEqual(1);
    });

    it("should have a URL property of type string", function() {
      expect(slideshow.Ajax.getUrlBySlot(4)).toEqual(jasmine.any(String));
    });

    it("should have slot 4 queue index 0", function() {
      expect(slideshow.Ajax.getIndexBySlot(4)).toEqual(0);
    });

    it("should have one slide URL in the queue after multiple test calls", function() {
      expect(slideshow.Ajax.queue.length).toEqual(1);
    });

    it("should return true when checking if a slot number is in the queue (e.g. slot 4 is in queue?)", function() {
      expect(slideshow.Ajax.inQueue(4)).toEqual(true);
    }); 
  });


  describe("Ajax - overwrite queue by passing two slides on same slot", function() {
    beforeEach(function() {
      slideshow.addSlide("example/slides/forest.json",4);
      slideshow.addSlide("example/slides/ocean.json",4); //attempt to add a slide in the same slot
    });

    afterEach(function() {
       slideshow.Ajax.queue = [];
    });
    
    it("should have slot 4 return an index of 0 in the queue array", function() {
      expect(slideshow.Ajax.getIndexBySlot(4)).toEqual(0);
    });
    
    it("should have index 0 occupied by a slide for slot 4", function() {
      expect(slideshow.Ajax.getIndexBySlot(4)).toEqual(0);
    });

    it("should have only one slide in the queue", function() {     
      expect(slideshow.Ajax.queue.length).toEqual(1);
    });
  });

  describe("Ajax - add two slide urls with an array", function() {
    beforeEach(function() {
      slideshow.addSlide(
        ["example/slides/forest.json","example/slides/ocean.json"],
        [3,4]
      );
    });

    afterEach(function() {
       slideshow.Ajax.queue = [];
    });
    
    it("should have index 0 occupied by a slide for slot 3", function() {
      expect(slideshow.Ajax.getIndexBySlot(3)).toEqual(0);
    });
    
    it("should have index 1 occupied by a slide for slot 4", function() {
      expect(slideshow.Ajax.getIndexBySlot(4)).toEqual(1);
    });
  });

  /*
  describe("Ajax -process Ajax queue", function() {
    beforeEach(function() {
      slideshow.addSlide(
        ["example/slides/forest.json","example/slides/ocean.json"],
        [3,4]
      );
    });

    afterEach(function() {
    
    });

    it("should call the provided callback function and pass slide objects to it", function() {
      expect(
        slideshow.Ajax.processQueue(
          function(slides){
            return slideshow.validSlide(slides[0]);
            //return slides;
          })
      ).toEqual(true);
    });
  });

*/

  describe("Slideshow begin", function() {
    beforeEach(function() {
     
    });

    afterEach(function() {
    
    });

    it("should process ajax slides", function() {
      expect(slideshow.begin(1)).toEqual(true);
    });
  });




  describe("add slide by passing an Object", function() {
    beforeEach(function() {
      slideshow.addSlide({
        "alt" : "rainforest slide", 
        "indexup" : "/images/rainforest_index-up.png", 
        "indexover" : "/images/rainforest_index-over.png",
        "slider" : "/images/rainforest_slider.png",
        "stampup" : "/images/rainforest_stamp-up.png",
        "stampover" : "/images/rainforest_stamp-over.png",
        "product_link" : "http://aaronmartins.com",
        "stamp_top_css" : "260px"
      },2);
    });

    afterEach(function() {
      slideshow.slides = [];
    });

    it("should return a Slide Object when queried", function() {
      expect(slideshow.getSlide(2)).toEqual(jasmine.any(Object));
    });
    it("should be a valid Slide Object", function() {
      expect(
        slideshow.validSlide(
          slideshow.getSlide(2)
        )
      ).toEqual(true);
    });
  });

  

});
