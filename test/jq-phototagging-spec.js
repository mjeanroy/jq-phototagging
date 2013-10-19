describe("jQuery PhotoTagging Test Suite", function() {

  beforeEach(function() {
    this.$fixtures = $('<div><img src="#" /></div>');
    this.$img = this.$fixtures.find('img');

    this.tag = {
      id: 1,
      name: 'my tag',
      foo: 'bar',
      x: 5,
      y: 15,
      width: 20,
      height: 10,
      imgWidth: 100,
      imgHeight: 80
    };

    spyOn($.fn, 'remove').andCallThrough();
    spyOn($.fn, 'addClass').andCallThrough();
    spyOn($.fn, 'removeClass').andCallThrough();
    spyOn($.fn, 'css').andCallThrough();
    spyOn($.fn, 'wrap').andCallThrough();
    spyOn($.fn, 'unwrap').andCallThrough();
    spyOn($.fn, 'width').andCallThrough();
    spyOn($.fn, 'height').andCallThrough();
    spyOn($.fn, 'html').andCallThrough();
    spyOn($.fn, 'on').andCallThrough();
    spyOn($.fn, 'off').andCallThrough();
  });

  describe("jQuery Phototagging: initialization", function() {
    it("should have default options", function() {
      var defaults = jQuery.fn.jqPhotoTagging.options;
      expect(defaults).toBeDefined();
      expect(defaults).toEqual({
        width: 100,
        height: 100,
        tags: [],
        $tags: null,
        label: jasmine.any(Function),
        tagSize: jasmine.any(Function),
        imgSize: jasmine.any(Function),
        ratio: jasmine.any(Function),
        onLoaded: jasmine.any(Function),
        onInitialized: jasmine.any(Function)
      });
    });

    it("should initialize with custom options", function() {
      this.$img.jqPhotoTagging({
        width: 50,
        height: 50
      });

      // trigger images loaded event
      this.$img.trigger('load');

      var $photo = this.$img.data('jqPhotoTagging');
      expect($photo.$img).toBeDefined();
      expect($photo.$img[0]).toEqual(this.$img[0]);

      expect($photo).toBeDefined();
      expect($photo.opts).toBeDefined();
      expect($photo.opts).toEqual({
        width: 50,
        height: 50,
        tags: [],
        $tags: null,
        label: jasmine.any(Function),
        tagSize: jasmine.any(Function),
        imgSize: jasmine.any(Function),
        ratio: jasmine.any(Function),
        onLoaded: jasmine.any(Function),
        onInitialized: jasmine.any(Function)
      });

      var defaults = jQuery.fn.jqPhotoTagging.options;
      expect(defaults).toBeDefined();
      expect(defaults).toEqual({
        width: 100,
        height: 100,
        tags: [],
        $tags: null,
        label: jasmine.any(Function),
        tagSize: jasmine.any(Function),
        imgSize: jasmine.any(Function),
        ratio: jasmine.any(Function),
        onLoaded: jasmine.any(Function),
        onInitialized: jasmine.any(Function)
      });
    });

    it("should generate html", function() {
      var onInitialized = jasmine.createSpy('onInitialized');
      var onLoaded = jasmine.createSpy('onLoaded');

      this.$img.jqPhotoTagging({
        width: 50,
        height: 50,
        tags: [this.tag],
        onInitialized: onInitialized,
        onLoaded: onLoaded
      });

      // trigger images loaded event
      this.$img.trigger('load');

      var $photo = this.$img.data('jqPhotoTagging');
      expect($photo.$img).toBeDefined();
      expect($photo.$img.get(0)).toEqual(this.$img.get(0));

      var $wrapper = this.$img.parent();
      expect($wrapper).toBeDefined();
      expect($wrapper.length).toBe(1);
      expect($wrapper.hasClass('jq-phototagging-wrapper')).toBe(true);
      expect($wrapper.get(0)).not.toEqual(this.$fixtures.get(0));
      expect($wrapper.get(0)).toEqual($photo.$wrapper.get(0));

      var $tags = this.$img.next();
      expect($tags).toBeDefined();
      expect($tags.length).toBe(1);
      expect($tags.hasClass('jq-phototagging-tags')).toBe(true);
      expect($tags.html).toHaveBeenCalledWith('');
      expect($tags.get(0)).toEqual(this.$fixtures.find('ul').get(0));
      expect($tags.get(0)).toEqual($photo.$tags.get(0));

      var $boxes = $tags.next();
      expect($boxes).toBeDefined();
      expect($boxes.length).toBe(1);
      expect($boxes.hasClass('jq-phototagging-tag-boxes')).toBe(true);
      expect($boxes.get(0).tagName).toBe('DIV');

      var $lis = $tags.find('li');
      expect($lis).toBeDefined();
      expect($lis.length).toBe(1);

      var $tag1 = $lis.eq(0);
      expect($tag1.hasClass('jq-phototagging-tag')).toBe(true);
      expect($tag1.html()).toBe('my tag');

      var $box1 = $boxes.find('div');
      expect($box1).toBeDefined();
      expect($box1.length).toBe(1);
      expect($box1.hasClass('jq-phototagging-tag-box')).toBe(true);

      expect(onInitialized).toHaveBeenCalledWith($photo.$wrapper);
      expect(onLoaded).toHaveBeenCalledWith($photo.tags, $photo.$tags);
    });
  });

  describe("jQuery Phototagging: behavior", function() {
    beforeEach(function() {
      this.$img.jqPhotoTagging({
        width: 50,
        height: 50
      });

      // trigger images loaded event
      this.$img.trigger('load');

      this.$photo = this.$img.data('jqPhotoTagging');
      this.$boxes = this.$photo.$boxes;
      this.$tags = this.$photo.$tags;
    });

    describe("User Events", function() {
      beforeEach(function() {
        var tags = [
          { id: 1 }
        ];
        this.$photo.appendTags(tags);
      });

      it("should bind user events", function() {
        expect(this.$tags.on).toHaveBeenCalledWith('mouseenter.jqphototagging', 'li', jasmine.any(Function));
        expect(this.$tags.on).toHaveBeenCalledWith('mouseleave.jqphototagging', 'li', jasmine.any(Function));
      });

      it("should show boxes when user is hover tag name", function() {
        var $li = this.$tags.find('li');
        var $box = this.$boxes.find('div');
        $li.trigger('mouseenter');
        expect($box.hasClass('jq-phototagging-visible')).toBe(true);
      });

      it("should hide boxes when user is not hover tag name", function() {
        var $li = this.$tags.find('li');
        var $box = this.$boxes.find('div');
        $box.addClass('jq-phototagging-visible');

        $li.trigger('mouseleave');
        expect($box.hasClass('jq-phototagging-visible')).toBe(false);
      });
    });

    describe("Tag Append", function() {
      it("should append tags", function() {
        spyOn(this.$photo, 'appendTag');
        var tags = [
          { id: 1 },
          { id: 2 }
        ];

        this.$photo.appendTags(tags);
        expect(this.$photo.appendTag).toHaveBeenCalledWith(tags[0]);
        expect(this.$photo.appendTag).toHaveBeenCalledWith(tags[1]);
      });

      it("should append a unique tag", function() {
        spyOn(this.$photo, 'appendTag');
        var tag = { id: 1 };

        this.$photo.appendTags(tag);
        expect(this.$photo.appendTag).toHaveBeenCalledWith(tag);
      });

      it("should append tag", function() {
        var ratio = 2;
        var $imgWidth = this.tag.imgWidth / ratio;
        var $imgHeight = this.tag.imgHeight / ratio;
        this.$photo.$img.width.andReturn($imgWidth);
        this.$photo.$img.height.andReturn($imgHeight);

        this.$photo.appendTag(this.tag);

        var $box = this.$boxes.find('div');
        expect($box).toBeDefined();
        expect($box.length).toBe(1);
        expect($box.hasClass('jq-phototagging-tag-box')).toBe(true);
        expect($box.attr('id')).toBeDefined();
        expect($box.attr('id')).not.toBe('');

        var widthTag = this.tag.width / ratio;
        var heightTag = this.tag.height / ratio;
        var xTag = this.tag.x / ratio;
        var yTag = this.tag.y / ratio;
        expect($box.css('left')).toBe(xTag + 'px');
        expect($box.css('top')).toBe(yTag + 'px');
        expect($box.css('width')).toBe(widthTag + 'px');
        expect($box.css('height')).toBe(heightTag + 'px');

        var $tag = this.$tags.find('li');
        expect($tag).toBeDefined();
        expect($tag.length).toBe(1);
        expect($tag.hasClass('jq-phototagging-tag')).toBe(true);
        expect($tag.attr('data-id')).toBeDefined();
        expect($tag.attr('data-id')).not.toBe('');
        expect($tag.attr('data-id')).toBe($box.attr('id'));
      });

      it("should append tag using custom size functions", function() {
        this.$photo.opts.imgSize = jasmine.createSpy('imgSize').andReturn({
          width: 100,
          height: 100
        });

        this.$photo.opts.tagSize = jasmine.createSpy('tagSize').andReturn({
          x: 0,
          y: 0,
          width: 50,
          height: 50
        });

        this.$photo.$img.width.andReturn(100);
        this.$photo.$img.height.andReturn(100);

        this.$photo.appendTag(this.tag);

        var $box = this.$boxes.find('div');
        expect($box.css('left')).toBe('0px');
        expect($box.css('top')).toBe('0px');
        expect($box.css('width')).toBe('50px');
        expect($box.css('height')).toBe('50px');

        expect(this.$photo.opts.imgSize).toHaveBeenCalledWith(this.tag);
        expect(this.$photo.opts.tagSize).toHaveBeenCalledWith(this.tag);
      });
    });

    describe("Tag Rendering", function() {
      it("should render default attribute of tag", function() {
        var label = this.$photo.renderTag(this.tag);
        expect(label).toBe('my tag');
      });

      it("should render other attribute of tag", function() {
        this.$photo.opts.label = 'foo';
        var label = this.$photo.renderTag(this.tag);
        expect(label).toBe('bar');
      });

      it("should render attribute with a custom function", function() {
        this.$photo.opts.label = jasmine.createSpy('label').andReturn('foobar');
        var label = this.$photo.renderTag(this.tag);
        expect(label).toBe('foobar');
        expect(this.$photo.opts.label).toHaveBeenCalledWith(this.tag, null);
      });
    });

    describe('Destroy', function() {
      it("should unbind user events", function() {
        var $tags = this.$photo.$tags;
        this.$photo.unbind();
        expect($tags.off).toHaveBeenCalledWith('.jqphototagging');
      });

      it("should destroy plugin", function() {
        var $tags = this.$photo.$tags;
        var $wrapper = this.$photo.$wrapper;

        this.$photo.destroy();
        expect($wrapper.unwrap).toHaveBeenCalled();
        expect($tags.remove).toHaveBeenCalled();
        expect($tags.off).toHaveBeenCalledWith('.jqphototagging');

        expect(this.$photo.$img).toBe(null);
        expect(this.$photo.$tags).toBe(null);
        expect(this.$photo.$wrapper).toBe(null);
        expect(this.$photo.opts).toBe(null);
        expect(this.$photo.tags).toBe(null);
      });

      it("should destroy plugin and clear jquery cache", function() {
        spyOn(this.$photo, 'destroy');
        this.$img.jqPhotoTagging().destroy();
        expect(this.$photo.destroy).toHaveBeenCalled();
        expect(this.$img.data('jqPhotoTagging')).toBeUndefined();
      });
    });
  });
});