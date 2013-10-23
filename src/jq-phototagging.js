/**
 * The MIT License (MIT)
 *
 * Copyright (c) 2013 Mickael Jeanroy
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy of
 * this software and associated documentation files (the "Software"), to deal in
 * the Software without restriction, including without limitation the rights to
 * use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of
 * the Software, and to permit persons to whom the Software is furnished to do so,
 * subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS
 * FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR
 * COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER
 * IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN
 * CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */

(function($) {

  'use strict';

  /**
   * Plugin name.
   * @type {string}
   * @const
   */
  var PLUGIN_NAME = 'jqPhotoTagging';

  /**
   * Namespace used for user-events.
   * @type {string}
   * @const
   */
  var NAMESPACE = '.jqphototagging';

  /**
   * Prefix used on each css classes.
   * @type {string}
   * @const
   */
  var CSS_PREFIX = 'jq-phototagging-';

  /**
   * Css class added on images.
   * @type {string}
   * @const
   */
  var CSS_IMG = CSS_PREFIX + 'img';

  /**
   * Css class added on main wrapper.
   * @type {string}
   * @const
   */
  var CSS_WRAPPER = CSS_PREFIX + 'wrapper';

  /**
   * Css class added on boxes wrapper.
   * @type {string}
   * @const
   */
  var CSS_TAG_BOXES = CSS_PREFIX + 'tag-boxes';

  /**
   * Css class added on each box displayed on image.
   * @type {string}
   * @const
   */
  var CSS_TAG_BOX = CSS_PREFIX + 'tag-box';

  /**
   * Css class added on tag's wrapper.
   * @type {string}
   * @const
   */
  var CSS_TAGS = CSS_PREFIX + 'tags';

  /**
   * Css class added on each tag displayed in the list.
   * @type {string}
   * @const
   */
  var CSS_TAG = CSS_PREFIX + 'tag';

  /**
   * Css class added on box to make it visible.
   * @type {string}
   * @const
   */
  var CSS_VISIBLE = CSS_PREFIX + 'visible';

  /**
   * Css class added on form used to type new tag.
   * @type {string}
   * @const
   */
  var CSS_FORM = CSS_PREFIX + 'form';

  /**
   * Css class added on box displayed in form used to type new tag.
   * @type {string}
   * @const
   */
  var CSS_FORM_BOX = CSS_PREFIX + 'form-box';

  /**
   * Css class added when box is displayed at the right side of tag form.
   * @type {string}
   * @const
   */
  var CSS_RIGHT = CSS_PREFIX + 'right';

  /**
   * Css class added when box is displayed at the left side of tag form.
   * @type {string}
   * @const
   */
  var CSS_LEFT = CSS_PREFIX + 'left';

  /**
   * Css class added on wrapper when image is read-only (cannot add new tag).
   * @type {string}
   * @const
   */
  var CSS_RO = CSS_PREFIX + 'readonly';

  /** No op function */
  var noop = function() {
  };

  /** Function that return parameter */
  var identity = function(obj) {
    return obj;
  };

  /** Generate a unique id */
  var uniqId = function($ids) {
    var exist = true;
    var $id = '';
    while (exist) {
      $id = Math.round(new Date().getTime() + (Math.random() * 100));
      $id = $id.toString();
      exist = $ids.hasOwnProperty($id) || $('#' + $id).length > 0;
    }
    return $id;
  };

  /**
   * Render label of a tag.
   * @param {object} obj Tag object.
   * @param {string} attr Attribute of tag to return.
   * @returns {*|string} Label.
   */
  var renderAttribute = function(obj, attr) {
    var field = attr || 'name';
    return obj[field] || '';
  };

  /**
   * Get size of tag.
   * @param {object} tag Tag object.
   * @returns {{x: number, y: number, width: number, height: number}} Size with position.
   */
  var tagSize = function(tag) {
    return {
      x: tag.x,
      y: tag.y,
      width: tag.width,
      height: tag.height
    };
  };

  /**
   * Get original size of tag's image.
   * @param {object} tag Tag object.
   * @returns {{width: number, height: number}}
   */
  var imgSize = function(tag) {
    return {
      width: tag.imgWidth,
      height: tag.imgHeight
    };
  };

  /**
   * Compute tag size relative to current size image (resize tag to keep ratio).
   * @param {{width: number, height: number}} sizeImg Original Size image.
   * @param {{x: number, y: number, width: number, height: number}} sizeTag Tag size.
   * @param {jQuery} $img Image.
   * @returns {{x: number, y: number, width: number, height: number}} Size.
   */
  var ratio = function(sizeImg, sizeTag, $img) {
    var currentSize = {
      width: $img.width(),
      height: $img.height()
    };

    var ratioWidth = sizeImg.width / currentSize.width;
    var ratioHeight = sizeImg.height / currentSize.height;

    return {
      x: sizeTag.x / ratioWidth,
      y: sizeTag.y / ratioHeight,
      width: sizeTag.width / ratioWidth,
      height: sizeTag.height / ratioHeight
    };
  };

  // Thanks Paul Irish
  // https://gist.github.com/paulirish/268257
  // mit license
  var imageLoaded = function($img, callback, context) {
    var blank = 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///ywAAAAAAQABAAACAUwAOw==';

    $img
      .bind('load.imgloaded', function() {
        $img.unbind('load.imgloaded');
        callback.call(context);
      })
      .each(function() {
        // cached images don't fire load sometimes, so we reset src.
        if (this.complete || this.complete === undefined) {
          var src = this.src;
          // webkit hack from http://groups.google.com/group/jquery-dev/browse_thread/thread/eee6ab7b2da50e1f
          // data uri bypasses webkit log warning (thx doug jones)
          this.src = blank;
          this.src = src;
        }
      });
  };

  /**
   * Plugin.
   * @param img Image.
   * @param options Initialization options.
   * @constructor
   */
  var PhotoTagging = function(img, options) {
    this.$img = $(img);
    this.opts = options;

    // Position of form used to tag images
    this.fx = 0;

    // Default width of box used to tag images
    this.width = options.width;
    this.height = options.height;

    // Position of tag
    // May be different than position of form (if form is larger
    // than a tag)
    this.x = 0;
    this.y = 0;

    this.$ids = {};
    this.tags = [];
  };

  PhotoTagging.prototype = {
    /** Initialize plugin */
    init: function() {
      var $img = this.$img;

      // Add css class on image
      $img.addClass(CSS_IMG);

      // Wrap image (to get relative position position)
      var $wrapper = $('<div></div>').addClass(CSS_WRAPPER);
      $img.wrap($wrapper);
      $wrapper = $img.parent();

      // Generate list of tags
      var $tags = this.opts.$tags;
      if (!$tags) {
        $tags = $('<ul></ul>');
        $wrapper.append($tags);
      }

      $tags = $($tags);
      if ($tags.get(0).tagName !== 'UL') {
        $tags = $('<ul></ul>').appendTo($tags);
      }

      $tags.addClass(CSS_TAGS);

      // Generate boxes wrapper to show squares in images
      var $boxes = $('<div></div>')
        .addClass(CSS_TAG_BOXES)
        .appendTo($wrapper);

      this.$wrapper = $wrapper;
      this.$tags = $tags;
      this.$boxes = $boxes;

      if (!this.opts.readOnly) {
        // Append form used to tag image
        this.appendForm();
      }
      else {
        $wrapper.addClass(CSS_RO);
      }

      this.opts.onInitialized.call(this, this.$wrapper, this.$form);

      imageLoaded(
        this.$img,
        this.onLoaded,
        this
      );
    },

    /** Append form used to tag image */
    appendForm: function() {
      var $form = $('<form></form>')
        .addClass(CSS_FORM)
        .appendTo(this.$wrapper);

      var $box = $('<div></div>')
        .addClass(CSS_FORM_BOX)
        .css({
          width: this.width,
          height: this.height
        })
        .appendTo($form);

      var $input = $('<input type="text"/>')
        .appendTo($form);

      this.$form = $form;
      this.$input = $input;
      this.$box = $box;
    },

    /** Called when image is fully loaded */
    onLoaded: function() {
      this.computeSize();

      this.$tags.html('');
      this.appendTags(this.opts.tags || []);
      this.opts.onLoaded.call(this, this.tags, this.$tags);

      this.bind();
    },

    /** Refresh size of image and size of form */
    computeSize: function() {
      this.$imgHeight = this.$img.outerHeight();
      this.$imgWidth = this.$img.outerWidth();

      var formWidth = 0;
      var formHeight = 0;
      var marginWidth = 0;

      if (this.$form) {
        formWidth = this.$form.outerWidth();
        formHeight = this.$form.outerHeight();

        marginWidth = (formWidth - this.width) / 2;
        if (marginWidth < 0) {
          marginWidth = 0;
        }
      }

      this.marginWidth = marginWidth;
      this.formWidth = formWidth;
      this.formHeight = formHeight;
    },

    /** Bind user events. */
    bind: function() {
      var that = this;

      this.$tags.on('mouseenter' + NAMESPACE, 'li', function() {
        var $this = $(this);
        var id = $this.attr('data-id');
        that.$boxes.find('#' + id).addClass(CSS_VISIBLE);
      });

      this.$tags.on('mouseleave' + NAMESPACE, 'li', function() {
        that.$boxes.find('div').removeClass(CSS_VISIBLE);
      });

      this.bindForm();
    },

    /** Bind user events on form */
    bindForm: function() {
      if (this.$form) {
        var that = this;

        this.$img.on('click' + NAMESPACE, function(e) {
          e.stopPropagation();

          var $this = $(this);
          var $window = $(window);
          var offset = $this.offset();
          var top = offset.top - $window.scrollTop();
          var left = offset.left - $window.scrollLeft();

          var width = that.formWidth / 2;
          var height = that.formHeight / 2;

          var x = e.clientX - left - width;
          var y = e.clientY - top - height;

          that.showForm(x, y);
        });

        this.$form.on('submit' + NAMESPACE, function(e) {
          e.preventDefault();
          var val = $.trim(that.$input.val());
          if (val) {
            that.submitForm(val);
          }
        });

        this.$input.on('keyup' + NAMESPACE, function(e) {
          if (e.keyCode === 27) {
            // Escape key is pressed, hide form
            that.hideForm();
          }
        });
      }
    },

    /** Unbind events used to tag image */
    unbindForm: function() {
      this.$img.off('click' + NAMESPACE);
      this.$form.unbind(NAMESPACE);
    },

    /** Display form used to type a new tag. */
    showForm: function(fx, fy) {
      // Fix form position in image
      var formWidth = this.formWidth;

      // Fix box position in image
      var width = this.width;
      var height = this.height;

      // Keep local variable
      var $box = this.$box;
      var $imgWidth = this.$imgWidth;
      var $imgHeight = this.$imgHeight;

      // Remove 'left', 'right' css
      $box
        .removeClass(CSS_LEFT)
        .removeClass(CSS_RIGHT);

      var x = fx + this.marginWidth;
      var y = fy;

      // If form is on the left
      if (fx < 0) {
        fx = 0;
        x = 0;
        $box.addClass(CSS_LEFT);
      }

      // If form is at the bottom
      if (fy < 0) {
        fy = 0;
        y = 0;
      }

      var x2 = fx + formWidth;
      var y2 = fy + height;

      // If form is on the right
      if (x2 > $imgWidth) {
        fx = $imgWidth - formWidth;
        x = $imgWidth - width;
        $box.addClass(CSS_RIGHT);
      }

      // If form is at the top
      if (y2 > $imgHeight) {
        fy = $imgHeight - height;
        y = $imgHeight - height;
      }

      this.fx = fx;
      this.x = x;
      this.y = y;

      this.$form.css({
        left: fx,
        top: fy
      });

      this.$form.addClass(CSS_VISIBLE);
      this.$input.focus();
    },

    /** Hide form used to type a new tag. */
    hideForm: function() {
      this.$form.removeClass(CSS_VISIBLE);
    },

    /**
     * Save a new tag.
     * @param {string} value Value of tag.
     */
    submitForm: function(value) {
      if (!this.$submitting) {
        this.$submitting = true;

        var params = this.params(value);

        var xhr = $.ajax({
          url: this.opts.url,
          type: this.opts.method,
          data: params,
          dataType: this.opts.dataType
        });

        var that = this;

        xhr.done(function(data) {
          that.opts.onSavedSuccess.apply(that, arguments);

          // Hide form
          that.$input.val('');
          that.hideForm();

          // Append tag
          var tag = that.opts.resultFn.call(that, data);
          that.appendTags(tag);
        });

        xhr.fail(function() {
          that.opts.onSavedFailed.apply(that, arguments);
        });

        xhr.always(function() {
          that.$submitting = false;
        });
      }
    },

    /**
     * Build parameters send to save a new tag.
     * @param {string} value Name of tag.
     * @returns {object} Parameter object.
     */
    params: function(value) {
      var defaultParams = {
        value: value,
        x: this.x,
        y: this.y,
        width: this.width,
        height: this.height,
        imgWidth: this.$imgWidth,
        imgHeight: this.$imgHeight
      };
      var custom = this.opts.paramsFn.call(this, defaultParams);
      return $.extend(defaultParams, custom);
    },

    /**
     * Append tags to html.
     * @param {array|object} tags Tags to append.
     */
    appendTags: function(tags) {
      if (!$.isArray(tags)) {
        tags = [tags];
      }
      this.tags = this.tags.concat(tags);
      for (var i = 0, ln = tags.length; i < ln; ++i) {
        this.appendTag(tags[i]);
      }
    },

    /**
     * Append a tag (generate html).
     * @param {object} tag Tag to append.
     */
    appendTag: function(tag) {
      var imgSize = this.opts.imgSize.call(tag, tag);
      var tagSize = this.opts.tagSize.call(tag, tag);
      var ratio = this.opts.ratio.call(tag, imgSize, tagSize, this.$img);

      var id = uniqId(this.$ids);
      this.$ids[id] = true;

      $('<div></div>')
        .addClass(CSS_TAG_BOX)
        .attr('id', id)
        .css({
          left: ratio.x,
          top: ratio.y,
          width: ratio.width,
          height: ratio.height
        })
        .appendTo(this.$boxes);

      var $li = $('<li></li>')
        .addClass(CSS_TAG)
        .attr('data-id', id)
        .html(this.renderTag(tag));

      this.$tags.append($li);
    },

    /**
     * Generate a tag label.
     * @param {object} tag
     * @returns {string} Tag label.
     */
    renderTag: function(tag) {
      var fn = this.opts.label;
      var attr = null;
      if (!$.isFunction(fn)) {
        attr = fn;
        fn = renderAttribute;
      }
      return fn.call(null, tag, attr);
    },

    /** Unbind user events. */
    unbind: function() {
      this.$tags.off(NAMESPACE);
      if (this.$form) {
        this.unbindForm();
      }
    },

    /** Destroy phototagging object */
    destroy: function() {
      this.unbind();
      this.$tags.remove();
      this.$wrapper.unwrap();

      if (this.$form) {
        this.$input.remove();
        this.$form.remove();
      }

      for (var i in this) {
        if (this.hasOwnProperty(i)) {
          this[i] = null;
        }
      }
    }
  };

  $.fn.jqPhotoTagging = function(options) {

    /** Destroy plugin */
    this.destroy = function() {
      var $this = $(this);
      $this.data(PLUGIN_NAME).destroy();
      $this.removeData(PLUGIN_NAME);
    };

    return this.each(function() {
      var $this = $(this);
      var plugin = $this.data(PLUGIN_NAME);
      if (!plugin) {
        var opts = $.extend({}, $.fn.jqPhotoTagging.options);
        if (typeof options === 'object') {
          opts = $.extend(opts, options);
        }
        plugin = new PhotoTagging($this, opts);
        plugin.init();
      }
      $this.data(PLUGIN_NAME, plugin);
    });

  };

  $.fn.jqPhotoTagging.options = {
    width: 100,
    height: 100,
    url: '',
    method: 'POST',
    dataType: 'json',
    readOnly: false,
    label: renderAttribute,
    tagSize: tagSize,
    imgSize: imgSize,
    ratio: ratio,
    tags: [],
    $tags: null,
    paramsFn: identity,
    resultFn: identity,
    onInitialized: noop,
    onLoaded: noop,
    onSavedSuccess: noop,
    onSavedFailed: noop
  };

})(jQuery);