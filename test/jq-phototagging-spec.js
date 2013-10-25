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
    spyOn($.fn, 'focus').andCallThrough();
    spyOn($.fn, 'show').andCallThrough();
    spyOn($.fn, 'hide').andCallThrough();
    spyOn($.fn, 'fadeOut').andCallThrough();
    spyOn($.fn, 'val').andCallThrough();
    spyOn($.fn, 'offset').andCallThrough();
    spyOn($.fn, 'scrollTop').andCallThrough();
    spyOn($.fn, 'scrollLeft').andCallThrough();
  });

  describe("jQuery Phototagging: initialization", function() {
    it("should have default options", function() {
      var defaults = jQuery.fn.jqPhotoTagging.options;
      expect(defaults).toBeDefined();
      expect(defaults).toEqual({
        width: 100,
        height: 100,
        readOnly: false,
        url: '',
        method: 'POST',
        dataType: 'json',
        tags: [],
        $tags: null,
        label: jasmine.any(Function),
        tagSize: jasmine.any(Function),
        imgSize: jasmine.any(Function),
        ratio: jasmine.any(Function),
        resultFn: jasmine.any(Function),
        paramsFn: jasmine.any(Function),
        onLoaded: jasmine.any(Function),
        onShown: jasmine.any(Function),
        onHidden: jasmine.any(Function),
        onInitialized: jasmine.any(Function),
        onSavedSuccess: jasmine.any(Function),
        onSavedFailed: jasmine.any(Function)
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
        readOnly: false,
        url: '',
        method: 'POST',
        dataType: 'json',
        tags: [],
        $tags: null,
        label: jasmine.any(Function),
        tagSize: jasmine.any(Function),
        imgSize: jasmine.any(Function),
        ratio: jasmine.any(Function),
        resultFn: jasmine.any(Function),
        paramsFn: jasmine.any(Function),
        onLoaded: jasmine.any(Function),
        onShown: jasmine.any(Function),
        onHidden: jasmine.any(Function),
        onInitialized: jasmine.any(Function),
        onSavedSuccess: jasmine.any(Function),
        onSavedFailed: jasmine.any(Function)
      });

      var defaults = jQuery.fn.jqPhotoTagging.options;
      expect(defaults).toBeDefined();
      expect(defaults).toEqual({
        width: 100,
        height: 100,
        readOnly: false,
        url: '',
        method: 'POST',
        dataType: 'json',
        tags: [],
        $tags: null,
        label: jasmine.any(Function),
        tagSize: jasmine.any(Function),
        imgSize: jasmine.any(Function),
        ratio: jasmine.any(Function),
        resultFn: jasmine.any(Function),
        paramsFn: jasmine.any(Function),
        onLoaded: jasmine.any(Function),
        onShown: jasmine.any(Function),
        onHidden: jasmine.any(Function),
        onInitialized: jasmine.any(Function),
        onSavedSuccess: jasmine.any(Function),
        onSavedFailed: jasmine.any(Function)
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
      expect($wrapper.hasClass('jq-phototagging-readonly')).toBe(false);
      expect($wrapper.get(0)).not.toEqual(this.$fixtures.get(0));
      expect($wrapper.get(0)).toEqual($photo.$wrapper.get(0));

      var $tags = this.$img.next();
      expect($tags).toBeDefined();
      expect($tags.length).toBe(1);
      expect($tags.get(0)).toEqual(this.$fixtures.find('ul').get(0));
      expect($tags.get(0)).toEqual($photo.$tags.get(0));

      var $boxes = $tags.next();
      expect($boxes).toBeDefined();

      var $form = $boxes.next();
      expect($form).toBeDefined();
      expect($form.length).toBe(1);
      expect($form.hasClass('jq-phototagging-form')).toBe(true);
      expect($form.get(0)).toEqual(this.$fixtures.find('form').get(0));
      expect($form.get(0)).toEqual($photo.$form.get(0));

      var $box = $form.find('div');
      expect($box).toBeDefined();
      expect($box.length).toBe(1);
      expect($box.hasClass('jq-phototagging-form-box')).toBe(true);

      var $input = $form.find('input');
      expect($input).toBeDefined();
      expect($input.length).toBe(1);
      expect($input.get(0)).toEqual(this.$fixtures.find('input').get(0));

      expect(onInitialized).toHaveBeenCalledWith($photo.$wrapper, $photo.$form);
      expect(onLoaded).toHaveBeenCalledWith($photo.tags, $photo.$tags);
    });

    it("should generate html (readonly)", function() {
      var onInitialized = jasmine.createSpy('onInitialized');
      var onLoaded = jasmine.createSpy('onLoaded');

      this.$img.jqPhotoTagging({
        width: 50,
        height: 50,
        readOnly: true,
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
      expect($wrapper.hasClass('jq-phototagging-readonly')).toBe(true);
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

      var $box1 = $boxes.find('> div');
      expect($box1).toBeDefined();
      expect($box1.length).toBe(1);
      expect($box1.hasClass('jq-phototagging-tag-box')).toBe(true);

      var $divBox1 = $box1.find('> div');
      expect($divBox1).toBeDefined();
      expect($divBox1.length).toBe(1);

      var $spanBox1 = $box1.find('> div');
      expect($spanBox1).toBeDefined();
      expect($spanBox1.length).toBe(1);

      var $form = $wrapper.find('form');
      expect($form).toBeDefined();
      expect($form.length).toBe(0);
      expect($photo.$form).toBeUndefined();
      expect($photo.$box).toBeUndefined();
      expect($photo.$input).toBeUndefined();

      expect(onInitialized).toHaveBeenCalledWith($photo.$wrapper, undefined);
      expect(onLoaded).toHaveBeenCalledWith($photo.tags, $photo.$tags);
    });

    it("should initialize plugin with needed variable when form is not readonly", function() {
      this.$img.jqPhotoTagging();

      var $photo = this.$img.data('jqPhotoTagging');
      expect($photo.fx).toBe(0);
      expect($photo.x).toBe(0);
      expect($photo.y).toBe(0);
      expect($photo.width).toBe(100);
      expect($photo.height).toBe(100);
      expect($photo.$ids).toEqual({});

      expect($photo.$imgWidth).toBeUndefined();
      expect($photo.$imgHeight).toBeUndefined();

      // trigger images loaded event
      spyOn($photo, 'computeSize').andCallThrough();
      this.$img.trigger('load');

      expect($photo.computeSize).toHaveBeenCalled();
      expect($photo.$imgWidth).toBeDefined();
      expect($photo.$imgHeight).toBeDefined();
    });

    it("should call val of plugin", function() {
      this.$img.jqPhotoTagging();

      var $photo = this.$img.data('jqPhotoTagging');
      spyOn($photo, 'val');

      var result = this.$img.jqPhotoTagging().val('foobar');
      expect(result).toBe(this.$img.jqPhotoTagging());
      expect($photo.val).toHaveBeenCalledWith('foobar');
    });

    it("should call val of plugin with a string parameter", function() {
      this.$img.jqPhotoTagging();

      var $photo = this.$img.data('jqPhotoTagging');
      spyOn($photo, 'val');

      var result = this.$img.jqPhotoTagging('val', 'foobar');
      expect(result).toBe(this.$img.jqPhotoTagging());
      expect($photo.val).toHaveBeenCalledWith('foobar');
    });

    it("should get val of plugin", function() {
      this.$img.jqPhotoTagging();

      var $photo = this.$img.data('jqPhotoTagging');
      spyOn($photo, 'val').andReturn('foobar');

      var value = this.$img.jqPhotoTagging().val();
      expect($photo.val).toHaveBeenCalled();
      expect(value).toBe('foobar');
    });

    it("should submit tag", function() {
      this.$img.jqPhotoTagging();

      var $photo = this.$img.data('jqPhotoTagging');
      spyOn($photo, 'submitForm');
      spyOn($photo, 'val').andReturn('foobar');

      var result = this.$img.jqPhotoTagging().submit();
      expect($photo.val).toHaveBeenCalled();
      expect($photo.submitForm).toHaveBeenCalledWith('foobar');
      expect(result).toBe(this.$img.jqPhotoTagging());
    });

    it("should submit tag with a string parameter", function() {
      this.$img.jqPhotoTagging();

      var $photo = this.$img.data('jqPhotoTagging');
      spyOn($photo, 'submitForm');
      spyOn($photo, 'val').andReturn('foobar');

      var result = this.$img.jqPhotoTagging('submit');
      expect($photo.val).toHaveBeenCalled();
      expect($photo.submitForm).toHaveBeenCalledWith('foobar');
      expect(result).toBe(this.$img.jqPhotoTagging());
    });

    it("should set value and submit tag", function() {
      this.$img.jqPhotoTagging();

      var $photo = this.$img.data('jqPhotoTagging');
      spyOn($photo, 'submitForm');
      spyOn($photo, 'val').andReturn('foobar');

      var result = this.$img.jqPhotoTagging().submit('foobar');
      expect($photo.val).toHaveBeenCalledWith('foobar');
      expect($photo.submitForm).toHaveBeenCalledWith('foobar');
      expect(result).toBe(this.$img.jqPhotoTagging());
    });

    it("should set value and submit tag with a string parameter", function() {
      this.$img.jqPhotoTagging();

      var $photo = this.$img.data('jqPhotoTagging');
      spyOn($photo, 'submitForm');
      spyOn($photo, 'val').andReturn('foobar');

      var result = this.$img.jqPhotoTagging('submit', 'foobar');
      expect($photo.val).toHaveBeenCalledWith('foobar');
      expect($photo.submitForm).toHaveBeenCalledWith('foobar');
      expect(result).toBe(this.$img.jqPhotoTagging());
    });

    it("should set tag value and submit tag", function() {
      this.$img.jqPhotoTagging();

      var $photo = this.$img.data('jqPhotoTagging');
      spyOn($photo, 'submitForm');
      spyOn($photo, 'val').andReturn('foobar');

      var tag = {
        name: 'foobar'
      };

      var result = this.$img.jqPhotoTagging().submit(tag);
      expect($photo.val).toHaveBeenCalledWith(tag);
      expect($photo.submitForm).toHaveBeenCalledWith('foobar');
      expect(result).toBe(this.$img.jqPhotoTagging());
    });

    it("should set tag value and submit tag with a string parameter", function() {
      this.$img.jqPhotoTagging();

      var $photo = this.$img.data('jqPhotoTagging');
      spyOn($photo, 'submitForm');
      spyOn($photo, 'val').andReturn('foobar');

      var tag = {
        name: 'foobar'
      };

      var result = this.$img.jqPhotoTagging('submit', tag);
      expect($photo.val).toHaveBeenCalledWith(tag);
      expect($photo.submitForm).toHaveBeenCalledWith('foobar');
      expect(result).toBe(this.$img.jqPhotoTagging());
    });

    it("should get current position", function() {
      this.$img.jqPhotoTagging();

      var $photo = this.$img.data('jqPhotoTagging');

      var position = {
        x: 0,
        y: 0
      };

      spyOn($photo, 'position').andReturn(position);

      var result = this.$img.jqPhotoTagging().position();
      expect($photo.position).toHaveBeenCalledWith();
      expect(result).toBe(position);
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
      this.$box = this.$photo.$box;
      this.$boxes = this.$photo.$boxes;
      this.$tags = this.$photo.$tags;
      this.$form = this.$photo.$form;
      this.$input = this.$photo.$input;
      this.$iconRemove = this.$photo.$iconRemove;
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

        expect(this.$img.on).toHaveBeenCalledWith('click.jqphototagging', jasmine.any(Function));
        expect(this.$form.on).toHaveBeenCalledWith('submit.jqphototagging', jasmine.any(Function));
        expect(this.$input.on).toHaveBeenCalledWith('keyup.jqphototagging', jasmine.any(Function));
        expect(this.$iconRemove.on).toHaveBeenCalledWith('click.jqphototagging', jasmine.any(Function));
      });

      it("should not bind user events on form when tag is readonly", function() {
        this.$tags.on.reset();
        this.$img.on.reset();
        this.$form.on.reset();
        this.$input.on.reset();

        this.$photo.$form = undefined;
        this.$photo.bind();
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

      it("should hide form when user press escape key in input", function() {
        spyOn(this.$photo, 'hideForm');

        var event = jQuery.Event('keyup');
        event.keyCode = 27;
        this.$input.trigger(event);
        expect(this.$photo.hideForm).toHaveBeenCalled();
      });

      it("should hide form when user click on remove icon", function() {
        spyOn(this.$photo, 'hideForm');

        this.$iconRemove.trigger('click');
        expect(this.$photo.hideForm).toHaveBeenCalled();
      });
    });

    describe("Compute Size", function() {
      it("should compute size with form", function() {
        this.$photo.width = 20;
        spyOn(this.$photo.$img, 'outerHeight').andReturn(100);
        spyOn(this.$photo.$img, 'outerWidth').andReturn(200);

        spyOn(this.$photo.$form, 'outerHeight').andReturn(50);
        spyOn(this.$photo.$form, 'outerWidth').andReturn(60);

        this.$photo.computeSize();
        expect(this.$photo.$imgHeight).toBe(100);
        expect(this.$photo.$imgWidth).toBe(200);
        expect(this.$photo.formWidth).toBe(60);
        expect(this.$photo.formHeight).toBe(50);
        expect(this.$photo.marginWidth).toBe(20);
      });

      it("should compute size without form", function() {
        this.$photo.$form = undefined;
        spyOn(this.$photo.$img, 'outerHeight').andReturn(100);
        spyOn(this.$photo.$img, 'outerWidth').andReturn(200);

        this.$photo.computeSize();
        expect(this.$photo.$imgHeight).toBe(100);
        expect(this.$photo.$imgWidth).toBe(200);
        expect(this.$photo.formWidth).toBe(0);
        expect(this.$photo.formHeight).toBe(0);
        expect(this.$photo.marginWidth).toBe(0);
      });
    });

    describe("Tag Form", function() {
      beforeEach(function() {
        this.xhr = jasmine.createSpyObj('xhr', ['done', 'fail', 'always']);
        spyOn($, 'ajax').andReturn(this.xhr);

        this.$photo.opts.url = '/foo';

        this.$photo.$imgWidth = 800;
        this.$photo.$imgHeight = 500;
        this.$photo.width = 100;
        this.$photo.height = 100;
        this.$photo.marginWidth = 0;
        this.$photo.formWidth = this.$photo.width;

        spyOn(this.$photo, 'appendTags').andCallThrough();
        spyOn(this.$photo, 'hideForm').andCallThrough();

        this.tag = {
          name: 'foobar',
          x: 10,
          y: 20,
          width: 100,
          height: 200,
          imgWidth: 50,
          imgHeight: 60
        };

        spyOn(this.$photo.opts, 'onShown');
        spyOn(this.$photo.opts, 'onHidden');
      });

      it("should show form if user click on image", function() {
        this.$photo.formWidth = 50;
        this.$photo.formHeight = 100;

        $.fn.offset.andReturn({
          top: 50,
          left: 100
        });

        $.fn.scrollTop.andReturn(10);
        $.fn.scrollLeft.andReturn(30);

        var event = jQuery.Event('click');
        event.clientX = 200;
        event.clientY = 150;

        spyOn(this.$photo, 'showForm');

        this.$img.trigger(event);

        // Expected x = clientX - (offset.left - scrollLeft) - formWidth / 2
        //            = 200 - (100 - 30) - (50 / 2) = 105
        // Expected y = clientY - (offset.top - scrollTop) - formHeight / 2
        //            = 150 - (50 - 10) - (100 / 2) = 60

        expect(this.$photo.showForm).toHaveBeenCalledWith(105, 60);
        expect($.fn.offset).toHaveBeenCalled();
        expect($.fn.scrollTop).toHaveBeenCalled();
        expect($.fn.scrollLeft).toHaveBeenCalled();
      });

      it("should submit form if user submit a value", function() {
        spyOn(this.$photo, 'submitForm');
        this.$input.val('foobar');
        this.$form.trigger('submit');
        expect(this.$photo.submitForm).toHaveBeenCalledWith('foobar');
      });

      it("should not submit form if user does not submit a value", function() {
        this.$input.val('');
        this.$form.trigger('submit');
        expect($.ajax).not.toHaveBeenCalled();
      });

      it("should not submit form if user submit spaces", function() {
        this.$input.val('  ');
        this.$form.trigger('submit');
        expect($.ajax).not.toHaveBeenCalled();
      });

      it("should show form at given position when form width is equal to box width", function() {
        var x = 400;
        var y = 200;

        this.$photo.showForm(x, y);

        expect(this.$photo.fx).toBe(400);
        expect(this.$photo.x).toBe(400);
        expect(this.$photo.y).toBe(200);
        expect(this.$form.css).toHaveBeenCalledWith({
          top: 200,
          left: 400
        });

        expect(this.$box.hasClass('jq-phototagging-left')).toBe(false);
        expect(this.$box.hasClass('jq-phototagging-right')).toBe(false);
        expect(this.$form.show).toHaveBeenCalled();
        expect(this.$input.focus).toHaveBeenCalled();

        expect(this.$photo.opts.onShown).toHaveBeenCalledWith({
          x : 400,
          y : 200,
          width : 100,
          height : 100,
          imgWidth : 800,
          imgHeight : 500
        });
      });

      it("should show form at given position when form width is greater than box width", function() {
        this.$photo.marginWidth = 25;
        this.$photo.formWidth = this.$photo.width + (this.$photo.marginWidth * 2);

        this.$photo.showForm(300, 200);

        expect(this.$photo.fx).toBe(300);
        expect(this.$photo.x).toBe(325);
        expect(this.$photo.y).toBe(200);
        expect(this.$form.css).toHaveBeenCalledWith({
          top: 200,
          left: 300
        });

        expect(this.$box.hasClass('jq-phototagging-left')).toBe(false);
        expect(this.$box.hasClass('jq-phototagging-right')).toBe(false);
        expect(this.$form.show).toHaveBeenCalled();
        expect(this.$input.focus).toHaveBeenCalled();

        expect(this.$photo.opts.onShown).toHaveBeenCalledWith({
          x : 325,
          y : 200,
          width : 100,
          height : 100,
          imgWidth : 800,
          imgHeight : 500
        });
      });

      it("should show form aligned on the left when form is at the left of image (out of bounds)", function() {
        this.$photo.showForm(-5, 200);

        expect(this.$photo.fx).toBe(0);
        expect(this.$photo.x).toBe(0);
        expect(this.$photo.y).toBe(200);
        expect(this.$form.css).toHaveBeenCalledWith({
          top: 200,
          left: 0
        });

        expect(this.$box.hasClass('jq-phototagging-left')).toBe(true);
        expect(this.$box.hasClass('jq-phototagging-right')).toBe(false);
        expect(this.$form.show).toHaveBeenCalled();
        expect(this.$input.focus).toHaveBeenCalled();

        expect(this.$photo.opts.onShown).toHaveBeenCalledWith({
          x : 0,
          y : 200,
          width : 100,
          height : 100,
          imgWidth : 800,
          imgHeight : 500
        });
      });

      it("should show form aligned on the right when form is at the right of image (out of bounds)", function() {
        this.$photo.showForm(780, 200);

        expect(this.$photo.fx).toBe(700);
        expect(this.$photo.x).toBe(700);
        expect(this.$photo.y).toBe(200);
        expect(this.$form.css).toHaveBeenCalledWith({
          top: 200,
          left: 700
        });

        expect(this.$box.hasClass('jq-phototagging-left')).toBe(false);
        expect(this.$box.hasClass('jq-phototagging-right')).toBe(true);
        expect(this.$form.show).toHaveBeenCalled();
        expect(this.$input.focus).toHaveBeenCalled();

        expect(this.$photo.opts.onShown).toHaveBeenCalledWith({
          x : 700,
          y : 200,
          width : 100,
          height : 100,
          imgWidth : 800,
          imgHeight : 500
        });
      });

      it("should show form aligned at the top when form is at the top of image (out of bounds)", function() {
        this.$photo.showForm(300, -10);

        expect(this.$photo.fx).toBe(300);
        expect(this.$photo.x).toBe(300);
        expect(this.$photo.y).toBe(0);
        expect(this.$form.css).toHaveBeenCalledWith({
          top: 0,
          left: 300
        });

        expect(this.$box.hasClass('jq-phototagging-left')).toBe(false);
        expect(this.$box.hasClass('jq-phototagging-right')).toBe(false);
        expect(this.$form.show).toHaveBeenCalled();
        expect(this.$input.focus).toHaveBeenCalled();

        expect(this.$photo.opts.onShown).toHaveBeenCalledWith({
          x : 300,
          y : 0,
          width : 100,
          height : 100,
          imgWidth : 800,
          imgHeight : 500
        });
      });

      it("should show form aligned at the bottom when form is at the bottom of image (out of bounds)", function() {
        this.$photo.showForm(300, 480);

        expect(this.$photo.fx).toBe(300);
        expect(this.$photo.x).toBe(300);
        expect(this.$photo.y).toBe(400);
        expect(this.$form.css).toHaveBeenCalledWith({
          top: 400,
          left: 300
        });

        expect(this.$box.hasClass('jq-phototagging-left')).toBe(false);
        expect(this.$box.hasClass('jq-phototagging-right')).toBe(false);
        expect(this.$form.show).toHaveBeenCalled();
        expect(this.$input.focus).toHaveBeenCalled();

        expect(this.$photo.opts.onShown).toHaveBeenCalledWith({
          x : 300,
          y : 400,
          width : 100,
          height : 100,
          imgWidth : 800,
          imgHeight : 500
        });
      });

      it("should hide form", function() {
        this.$form.addClass('jq-phototagging-visible');
        this.$photo.hideForm();
        expect(this.$form.fadeOut).toHaveBeenCalled();
        expect(this.$photo.opts.onHidden).toHaveBeenCalled();
      });

      it("should not submit if form is submitting", function() {
        this.$photo.$submitting = true;
        this.$photo.submitForm('foobar');
        expect($.ajax).not.toHaveBeenCalled();
      });

      it("should submit form", function() {
        this.$photo.x = 10;
        this.$photo.y = 20;
        this.$photo.width = 100;
        this.$photo.height = 200;
        this.$photo.$imgWidth = 50;
        this.$photo.$imgHeight = 60;

        this.$photo.submitForm('foobar');
        expect($.ajax).toHaveBeenCalledWith({
          url: '/foo',
          type: 'POST',
          data: {
            value: 'foobar',
            x: 10,
            y: 20,
            width: 100,
            height: 200,
            imgWidth: 50,
            imgHeight: 60
          },
          dataType: 'json'
        });

        expect(this.$photo.$submitting).toBe(true);

        expect(this.xhr.done).toHaveBeenCalledWith(jasmine.any(Function));
        expect(this.xhr.fail).toHaveBeenCalledWith(jasmine.any(Function));
        expect(this.xhr.always).toHaveBeenCalledWith(jasmine.any(Function));

        this.$photo.opts.onSavedFailed = jasmine.createSpy('onSavedFailed');
        this.xhr.fail.argsForCall[0][0]();
        expect(this.$photo.opts.onSavedFailed).toHaveBeenCalled();
        expect(this.$photo.$submitting).toBe(true);

        this.$photo.opts.onSavedSuccess = jasmine.createSpy('onSavedSuccess');
        this.xhr.done.argsForCall[0][0](this.tag);
        expect(this.$photo.opts.onSavedSuccess).toHaveBeenCalledWith(this.tag);
        expect(this.$photo.appendTags).toHaveBeenCalledWith(this.tag);
        expect(this.$photo.hideForm).toHaveBeenCalled();
        expect(this.$input.val).toHaveBeenCalledWith('');
        expect(this.$photo.$submitting).toBe(true);

        this.xhr.always.argsForCall[0][0]();
        expect(this.$photo.$submitting).toBe(false);
      });

      it("should submit form with custom parameters", function() {
        spyOn(this.$photo.opts, 'paramsFn').andCallFake(function(param) {
          delete param.value;
          return {
            name: 'foo'
          };
        });

        this.$photo.x = 10;
        this.$photo.y = 20;
        this.$photo.width = 100;
        this.$photo.height = 200;
        this.$photo.$imgWidth = 50;
        this.$photo.$imgHeight = 60;

        this.$photo.submitForm('foobar');
        expect(this.$photo.opts.paramsFn).toHaveBeenCalled();
        expect($.ajax).toHaveBeenCalledWith({
          url: '/foo',
          type: 'POST',
          data: {
            x: 10,
            y: 20,
            width: 100,
            height: 200,
            imgWidth: 50,
            imgHeight: 60,
            name: 'foo'
          },
          dataType: 'json'
        });
      });

      it("should submit form and transform result tag", function() {
        spyOn(this.$photo.opts, 'resultFn').andCallFake(function(result) {
          result.x += 10;
          result.y += 10;
          return result;
        });

        this.$photo.submitForm('foobar');

        expect($.ajax).toHaveBeenCalled();
        expect(this.xhr.done).toHaveBeenCalledWith(jasmine.any(Function));
        expect(this.xhr.fail).toHaveBeenCalledWith(jasmine.any(Function));
        expect(this.xhr.always).toHaveBeenCalledWith(jasmine.any(Function));

        this.xhr.done.argsForCall[0][0](this.tag);
        expect(this.$photo.opts.resultFn).toHaveBeenCalledWith(this.tag);
        expect(this.$photo.appendTags).toHaveBeenCalledWith({
          name: 'foobar',
          x: 20,
          y: 30,
          width: 100,
          height: 200,
          imgWidth: 50,
          imgHeight: 60
        });
      });

      it("should set value", function() {
        this.$photo.val('foobar');

        expect(this.$photo.$input.val).toHaveBeenCalledWith('foobar');
        expect(this.$photo.$input.val()).toBe('foobar');
      });

      it("should set trimmed value", function() {
        this.$photo.val(' foobar ');

        expect(this.$photo.$input.val).toHaveBeenCalledWith('foobar');
        expect(this.$photo.$input.val()).toBe('foobar');
      });

      it("should set value from tag object", function() {
        var tag = {
          name: 'foobar'
        };

        this.$photo.val(tag);

        expect(this.$photo.$input.val).toHaveBeenCalledWith('foobar');
        expect(this.$photo.$input.val()).toBe('foobar');
      });

      it("should get value", function() {
        this.$photo.$input.val('foobar');
        var value = this.$photo.val();
        expect(value).toBe('foobar');
      });

      it("should get trimmed value", function() {
        this.$photo.$input.val(' foobar ');
        var value = this.$photo.val();
        expect(value).toBe('foobar');
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

        var $box = this.$boxes.find('> div');
        expect($box).toBeDefined();
        expect($box.length).toBe(1);
        expect($box.hasClass('jq-phototagging-tag-box')).toBe(true);

        var $divBox = $box.find('> div');
        expect($divBox).toBeDefined();
        expect($divBox.length).toBe(1);

        var $spanBox = $box.find('> span');
        expect($spanBox).toBeDefined();
        expect($spanBox.length).toBe(1);
        expect($spanBox.html()).toBe('my tag');

        var $id = $box.attr('id');
        expect($id).toBeDefined();
        expect($id).not.toBe('');
        expect(this.$photo.$ids[$id]).toBe(true);

        var widthTag = this.tag.width / ratio;
        var heightTag = this.tag.height / ratio;
        var xTag = this.tag.x / ratio;
        var yTag = this.tag.y / ratio;
        expect($box.css('left')).toBe(xTag + 'px');
        expect($box.css('top')).toBe(yTag + 'px');
        expect($box.css('width')).toBe(widthTag + 'px');
        expect($divBox.css('height')).toBe(heightTag + 'px');

        var $tag = this.$tags.find('li');
        expect($tag).toBeDefined();
        expect($tag.length).toBe(1);
        expect($tag.html()).toBe('my tag');
        expect($tag.hasClass('jq-phototagging-tag')).toBe(true);
        expect($tag.attr('data-id')).toBeDefined();
        expect($tag.attr('data-id')).not.toBe('');
        expect($tag.attr('data-id')).toBe($id);
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

        var $box = this.$boxes.find('> div');
        var $divBox = $box.find('> div');
        var $spanBox = $box.find('> span');

        expect($box.css('left')).toBe('0px');
        expect($box.css('top')).toBe('0px');
        expect($box.css('width')).toBe('50px');
        expect($divBox.css('height')).toBe('50px');
        expect($spanBox.html()).toBe('my tag');

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
        var $form = this.$photo.$form;
        var $img = this.$photo.$img;
        var $iconRemove = this.$photo.$iconRemove;

        this.$photo.unbind();
        expect($tags.off).toHaveBeenCalledWith('.jqphototagging');
        expect($form.off).toHaveBeenCalledWith('.jqphototagging');
        expect($img.off).toHaveBeenCalledWith('.jqphototagging');
        expect($iconRemove.off).toHaveBeenCalledWith('.jqphototagging');
      });

      it("should unbind user events without form", function() {
        var $tags = this.$photo.$tags;
        this.$photo.$form = undefined;

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