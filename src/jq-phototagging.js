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

(function(window, undefined) {

  'use strict';

  (function(factory) {

    if (typeof define === 'function' && define.amd) {
      // AMD. Register as an anonymous module.
      define(['jquery'], factory);
    } else {
      // Browser globals
      factory(jQuery);
    }

  }(function($) {

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

    /**
     * Css class added on icon used to remove tags.
     * @type {string}
     * @const
     */
    var CSS_ICON_REMOVE = 'icon-remove icon-white';

    /** No op function */
    var noop = function() {
    };

    /** Function that return true. */
    var returnTrue = function() {
      return true;
    };

    /** Function that return parameter */
    var identity = function(obj) {
      return obj;
    };

    /**
     * Check if an object is defined (i.e. is not null or undefined).
     * @returns {boolean} true if object is defined, false otherwise.
     */
    var isDefined = function(obj) {
      return obj !== undefined && obj !== null;
    };

    /**
     * Check if string starts with a given pattern.
     * @param {string} str String to check.
     * @param {string} start Start pattern.
     * @returns {*} True if string starts with given pattern, false otherwise.
     */
    var startsWith = function(str, start) {
      if (String.prototype.startsWith) {
        return str.startsWith(start);
      } else {
        return str.indexOf(start) === 0;
      }
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
          var that = this;
          // cached images don't fire load sometimes, so we reset src.
          if (that.complete || that.complete === undefined) {
            var src = that.src;
            // webkit hack from http://groups.google.com/group/jquery-dev/browse_thread/thread/eee6ab7b2da50e1f
            // data uri bypasses webkit log warning (thx doug jones)
            that.src = blank;
            that.src = src;
          }
        });
    };

    /**
     * Get data attribute value of dom element.
     * @param {jQuery} $obj jQuery element.
     * @param {string} data Data attribute name (without 'data-')
     * @returns {string} Data attribute value or undefined if data attribute is not set.
     */
    var data = function($obj, data) {
      var value = $obj.attr('data-' + data);
      if (value === '') {
        value = undefined;
      }
      return value;
    };

    /**
     * Plugin.
     * @param img Image.
     * @param options Initialization options.
     * @constructor
     */
    var PhotoTagging = function(img, options) {
      var that = this;

      that.$img = $(img);

      // Override options with data attributes
      that.opts = $.extend({}, options, that.readDatas());

      // Position of form used to tag images
      that.fx = 0;

      // Default width of box used to tag images
      that.width = options.width;
      that.height = options.height;

      // Position of tag
      // May be different than position of form (if form is larger
      // than a tag)
      that.x = 0;
      that.y = 0;

      that.$ids = {};
      that.tags = [];
    };

    PhotoTagging.prototype = {
      /** Initialize plugin */
      init: function() {
        var that = this;
        var $img = that.$img;

        // Add css class on image
        $img.addClass(CSS_IMG);

        // Wrap image (to get relative position position)
        var $wrapper = $('<div></div>').addClass(CSS_WRAPPER);
        $img.wrap($wrapper);
        $wrapper = $img.parent();

        // Generate list of tags
        var $tags = that.opts.$tags;
        if ($tags) {
          $tags = $($tags);
          if ($tags.length > 0) {
            if ($tags.get(0).tagName !== 'UL') {
              $tags = $('<ul></ul>').appendTo($tags);
            }

            $tags.addClass(CSS_TAGS);
          }
        }

        // Generate boxes wrapper to show squares in images
        var $boxes = $('<div></div>')
          .addClass(CSS_TAG_BOXES)
          .appendTo($wrapper);

        that.$wrapper = $wrapper;
        that.$tags = $tags || $('<ul></ul>');
        that.$boxes = $boxes;

        that.appendForm();

        if (that.readOnly()) {
          $wrapper.addClass(CSS_RO);
        }

        that.opts.onInitialized.call(that, that.$wrapper, that.$form);

        imageLoaded(
          that.$img,
          that.onLoaded,
          that
        );
      },

      /**
       * Read data attributes used to initialize plugin.
       * @return {object} Initialization object initialized with data attributes.
       */
      readDatas: function() {
        var datas = {};
        var $img = this.$img;

        datas.width = data($img, 'width');
        datas.height = data($img, 'height');
        datas.url = data($img, 'url');
        datas.method = data($img, 'method');
        datas.dataType = data($img, 'data-type');
        datas.saveContentType = data($img, 'save-content-type');
        datas.readOnly = data($img, 'read-only');
        datas.label = data($img, 'label');
        datas.$tags = data($img, 'tags');

        if (isDefined(datas.width)) {
          datas.width = parseFloat(datas.width);
        }
        if (isDefined(datas.height)) {
          datas.height = parseFloat(datas.height);
        }
        if (isDefined(datas.readOnly)) {
          datas.readOnly = datas.readOnly === 'true';
        }

        return datas;
      },

      /** Append form used to tag image */
      appendForm: function() {
        var that = this;

        var $form = $('<form></form>')
          .addClass(CSS_FORM)
          .appendTo(that.$wrapper);

        var $box = $('<div></div>')
          .addClass(CSS_FORM_BOX)
          .css({
            width: that.width,
            height: that.height
          })
          .appendTo($form);

        var $input = $('<input type="text"/>')
          .appendTo($form);

        var $iconRemove = $('<i></i>')
          .addClass(CSS_ICON_REMOVE)
          .appendTo($box);

        that.$form = $form;
        that.$input = $input;
        that.$box = $box;
        that.$iconRemove = $iconRemove;
      },

      /** Remove form used to tag picture */
      removeForm: function() {
        var that = this;
        that.$iconRemove.remove();
        that.$input.remove();
        that.$box.remove();
        that.$form.remove();
      },

      /** Toggle read only flag (i.e. remove/append form) */
      toggleReadOnly: function() {
        var that = this;

        that.opts.readOnly = !that.opts.readOnly;

        if (that.opts.readOnly) {
          that.hideForm();
          that.$wrapper.addClass(CSS_RO);
        } else {
          that.$wrapper.removeClass(CSS_RO);
        }
      },

      /**
       * Set readonly flag.
       * @param {boolean?} value New value for readonly flag.
       * @returns {boolean?} Value of flag if no parameter is given.
       */
      readOnly: function(value) {
        if (!isDefined(value)) {
          return this.opts.readOnly;
        } else if (this.opts.readOnly !== value) {
          this.toggleReadOnly();
        }
      },

      /** Called when image is fully loaded */
      onLoaded: function() {
        var that = this;

        that.computeSize();

        that.$tags.html('');
        that.appendTags(that.opts.tags || []);
        that.opts.onLoaded.call(that, that.tags, that.$tags);

        that.bind();
      },

      /** Refresh size of image and size of form */
      computeSize: function() {
        var that = this;

        var formWidth = 0;
        var formHeight = 0;
        var marginWidth = 0;
        var $img = that.$img;
        var $form = that.$form;

        that.$imgHeight = $img.outerHeight();
        that.$imgWidth = $img.outerWidth();

        if ($form) {
          formWidth = $form.outerWidth();
          formHeight = $form.outerHeight();

          marginWidth = (formWidth - that.width) / 2;
          if (marginWidth < 0) {
            marginWidth = 0;
          }
        }

        that.marginWidth = marginWidth;
        that.formWidth = formWidth;
        that.formHeight = formHeight;
      },

      /** Bind user events. */
      bind: function() {
        var that = this;

        that.$tags.on('mouseenter' + NAMESPACE, 'li', function() {
          var $this = $(this);
          var id = $this.attr('data-id');
          that.$boxes.find('#' + id).addClass(CSS_VISIBLE);
        });

        that.$tags.on('mouseleave' + NAMESPACE, 'li', function() {
          that.$boxes.find('div').removeClass(CSS_VISIBLE);
        });

        that.bindForm();
      },

      /** Bind user events on form */
      bindForm: function() {
        var that = this;

        that.$img.on('click' + NAMESPACE, function(e) {
          if (!that.readOnly()) {
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
          }
        });

        that.$form.on('submit' + NAMESPACE, function(e) {
          e.preventDefault();
          that.submit(that.val());
        });

        that.$input.on('keyup' + NAMESPACE, function(e) {
          if (e.keyCode === 27) {
            // Escape key is pressed, hide form
            that.hideForm();
          }
        });

        that.$iconRemove.on('click' + NAMESPACE, function(e) {
          that.hideForm();
        });
      },

      /** Unbind events used to tag image */
      unbindForm: function() {
        this.$img.off('click' + NAMESPACE);
        this.$form.unbind(NAMESPACE);
        this.$iconRemove.off(NAMESPACE);
      },

      /**
       * Get current value of input or change value in input.
       * @param {string|object?} value Value to set in input.
       * @return {string|Phototagging} Current value or this.
       */
      val: function(value) {
        if (isDefined(value)) {
          var str = typeof value === 'string' || value instanceof $ ?
            value :
            this.renderTag(value);

          if (str instanceof $) {
            str = str.text();
          }

          this.$input.val($.trim(str));
        }
        return $.trim(this.$input.val());
      },

      /** Display form used to type a new tag. */
      showForm: function(fx, fy) {
        var that = this;

        // Fix form position in image
        var formWidth = that.formWidth;

        // Fix box position in image
        var width = that.width;
        var height = that.height;

        // Keep local variable
        var $box = that.$box;
        var $form = that.$form;
        var $imgWidth = that.$imgWidth;
        var $imgHeight = that.$imgHeight;

        // Remove 'left', 'right' css
        $box
          .removeClass(CSS_LEFT)
          .removeClass(CSS_RIGHT);

        var x = fx + that.marginWidth;
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

        that.fx = fx;
        that.x = x;
        that.y = y;

        $form.css({
          left: fx,
          top: fy
        });

        $form.show();
        that.$input.focus();
        that.opts.onShown.call(that, that.position());
      },

      /** Hide form used to type a new tag. */
      hideForm: function() {
        var that = this;
        that.$form.fadeOut('fast');
        that.clear();
        that.opts.onHidden.call(that);
      },

      /** Clear input used to tag picture */
      clear: function() {
        this.val('');
        this.opts.onClear.call(this);
      },

      /**
       * Save a new tag.
       * @param {string} value Value of tag.
       */
      submit: function(value) {
        var that = this;
        if (value && !that.$submitting) {
          value = that.val(value);

          that.$submitting = true;

          var params = that.params(value);

          // Check validity
          if (!that.opts.isValid.call(that, value, params)) {
            that.$submitting = false;
            return;
          }

          var contentType = that.opts.saveContentType;
          if (startsWith(contentType, 'application/json') && JSON && JSON.stringify) {
            params = JSON.stringify(params);
          }

          var xhr = $.ajax({
            url: that.opts.url,
            type: that.opts.method,
            data: params,
            dataType: that.opts.dataType,
            contentType: contentType
          });

          xhr.done(function(data) {
            that.opts.onSavedSuccess.apply(that, arguments);

            // Hide form
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
        var defaultParams = this.position();
        defaultParams.value = value;

        var custom = this.opts.paramsFn.call(this, defaultParams);
        return $.extend(defaultParams, custom);
      },

      /**
       * Get position of current tag form.
       * @returns {object} Tag form position.
       */
      position: function() {
        var that = this;
        return {
          x: that.x,
          y: that.y,
          width: that.width,
          height: that.height,
          imgWidth: that.$imgWidth,
          imgHeight: that.$imgHeight
        };
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
        var that = this;
        var opts = that.opts;

        var imgSize = opts.imgSize.call(tag, tag);
        var tagSize = opts.tagSize.call(tag, tag);
        var ratio = opts.ratio.call(tag, imgSize, tagSize, that.$img);

        var id = uniqId(that.$ids);
        that.$ids[id] = true;

        var width = ratio.width;

        var $tagBox = $('<div></div>')
          .addClass(CSS_TAG_BOX)
          .attr('id', id)
          .css({
            width: width,
            top: ratio.y,
            left: ratio.x
          })
          .appendTo(that.$boxes);

        $('<div></div>')
          .css({
            height: ratio.height
          })
          .appendTo($tagBox);

        var label = that.renderTag(tag);
        var str = label;
        if (str instanceof $) {
          str = str.text();
        }

        $('<span></span>')
          .html(str)
          .appendTo($tagBox);

        var $li = $('<li></li>')
          .addClass(CSS_TAG)
          .attr('data-id', id)
          .html(label);

        that.$tags.append($li);
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
        var that = this;

        that.opts.onDestroyed.call(that);

        that.unbind();
        that.removeForm();
        that.$tags.remove();
        that.$img.unwrap();

        for (var i in that) {
          if (that.hasOwnProperty(i)) {
            that[i] = null;
          }
        }
      }
    };

    $.fn.jqPhotoTagging = function(options) {
      var that = this;
      var $that = $(this);

      /** Destroy plugin */
      that.destroy = function() {
        $that.data(PLUGIN_NAME).destroy();
        $that.removeData(PLUGIN_NAME);
      };

      /**
       * Get/Set value in input.
       * @param {string?} value Value to set (if defined).
       * @returns this object if parameter is set, input's value otherwise.
       */
      that.val = function(value) {
        var plugin = $that.data(PLUGIN_NAME);
        if (isDefined(value)) {
          plugin.val(value);
          return this;
        }
        return plugin.val();
      };

      /**
       * Submit form with given value (optionnal).
       * @param {string|object?} value Value to submit (optionnal, default will be current value).
       * @returns this object.
       */
      that.submit = function(value) {
        var plugin = $that.data(PLUGIN_NAME);
        if (isDefined(value)) {
          plugin.val(value);
        }
        plugin.submit(plugin.val());
        return this;
      };

      /**
       * Get position of tag form.
       * @returns {object} Position of form.
       */
      that.position = function() {
        return $that.data(PLUGIN_NAME).position();
      };

      /**
       * Get/Set read only flag.
       * @param {boolean?} value Value to set (optional).
       * @returns {boolean|this} Value of flag (if no parameter is given) or this object.
       */
      that.readOnly = function(value) {
        if (isDefined(value)) {
          $that.data(PLUGIN_NAME).readOnly(!!value);
          return this;
        }
        return $that.data(PLUGIN_NAME).readOnly();
      };

      /**
       * Toggle value of readonly flag.
       * @returns this object.
       */
      that.toggleReadOnly = function() {
        $that.data(PLUGIN_NAME).toggleReadOnly();
        return this;
      };

      var args = arguments;
      return that.each(function() {
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

        if (args.length > 0 && typeof args[0] === 'string') {
          that[args[0]].apply(that, Array.prototype.slice.call(args, 1));
        }
      });

    };

    $.fn.jqPhotoTagging.options = {
      width: 100,
      height: 100,
      url: '',
      method: 'POST',
      dataType: 'json',
      saveContentType: 'application/x-www-form-urlencoded; charset=UTF-8',
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
      onDestroyed: noop,
      isValid: returnTrue,
      onShown: noop,
      onHidden: noop,
      onClear: noop,
      onSavedSuccess: noop,
      onSavedFailed: noop
    };

  }));
})(window, void 0);
