describe("Slideshow", function() {
  var slideshow;
  
  beforeEach(function() {
    slideshow = new Slideshow('test-id');
  });

  it("should have the correct HTML Id", function() {
    expect(slideshow.htmlId).toEqual('test-id');
  });



 describe("add slide by URL", function() {
    beforeEach(function() {
      slideshow.addSlide("example/slides/forest.json",4); //redeclaring an ajax slide doesn't over-ride
      //player.pause();
    });

    it("should have one slide URL in the queue", function() {
      expect(slideshow.Ajax.queue.length).toEqual(1);
    });
    it("should have a URL property which matches our test arg", function() {
      expect(slideshow.Ajax.getUrlBySlot(4)).toEqual("example/slides/forest.json");
    });
    it("should have queue index 0", function() {
      expect(slideshow.Ajax.getIndexBySlot(4)).toEqual(0);
    });
    
/*
it("should have one slide URL in the queue", function() {
      expect(slideshow.Ajax.queue.length).toEqual(1);
    });
    
    it("should be possible to resume", function() {
      player.resume();
      expect(player.isPlaying).toBeTruthy();
      expect(player.currentlyPlayingSong).toEqual(song);
    });
 */
  });
  
  /*describe("overwrite slide by URL", function() {
    beforeEach(function() {
      //slideshow.addSlide("example/slides/forest.json",4); //redeclaring an ajax slide doesn't over-ride
      slideshow.addSlide("example/slides/ocean.json",4); //redeclaring an ajax slide doesn't over-ride
      //player.pause();
    });

    it("should have one slide URL in the queue", function() {
      expect(slideshow.Ajax.queue.length).toEqual(2);
    });
    
  });*/

/*
  // demonstrates use of spies to intercept and test method calls
  it("tells the current song if the user has made it a favorite", function() {
    spyOn(song, 'persistFavoriteStatus');

    player.play(song);
    player.makeFavorite();

    expect(song.persistFavoriteStatus).toHaveBeenCalledWith(true);
  });

  //demonstrates use of expected exceptions
  describe("#resume", function() {
    it("should throw an exception if song is already playing", function() {
      player.play(song);

      expect(function() {
        player.resume();
      }).toThrow("song is already playing");
    });
  });*/
});
