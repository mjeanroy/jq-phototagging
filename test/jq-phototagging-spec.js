describe("jQuery PhotoTagging Test Suite", function() {

  beforeEach(function() {
    this.$fixtures = $('<div><img src="#" /></div>');
    this.$img = this.$fixtures.find('img');
  });

  describe("jQuery Phototagging: initialization", function() {
    it("should have default options", function() {
      var defaults = jQuery.fn.jqPhotoTagging.options;
      expect(defaults).toBeDefined();
      expect(defaults).toEqual({
        width: 100,
        height: 100
      });
    });

    it("should initialize with custom options", function() {
      this.$img.jqPhotoTagging({
        width: 50,
        height: 50
      });

      var $photo = this.$img.data('jqPhotoTagging');
      expect($photo.$img).toBeDefined();
      expect($photo.$img[0]).toEqual(this.$img[0]);

      expect($photo).toBeDefined();
      expect($photo.opts).toBeDefined();
      expect($photo.opts).toEqual({
        width: 50,
        height: 50
      });

      var defaults = jQuery.fn.jqPhotoTagging.options;
      expect(defaults).toBeDefined();
      expect(defaults).toEqual({
        width: 100,
        height: 100
      });
    });

  });
});