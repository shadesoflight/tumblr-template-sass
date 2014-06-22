/**
 * Album Photoset
 * Object responsible for building and outputting a photo album.
 *
 * @param {jQuery object} $photoset
 *  photoset dom object.  i.e. $('.photoset') or $(this) inside of tumblrPhotoset extension
 * @property {string} layout   Numeric representation of image to row mapping
 *  i.e. if "321" were the layout, 3 would be the number of images on the first row,
 *  2 on the second, and 1 image on the last row.means be 3 rows, 3 images in the first
 *  row, 2 in the second, 1 in the third resulting in a total of 6 images
 *
 * Inspired by: https://github.com/PixelUnion/Extended-Tumblr-Photoset
 * Licensed under the MIT license
 */

var albumPhotoset = {
  /**
   * Callbacks
   * every property is a list of methods, property names being the events that trigger the methods
   */
  callbacks: {},

  /**
   * Init
   * Setup our album photoset
   * @param $photoset
   */
  init: function ($photoset) {
    this.layout = JSON.stringify($photoset.data('layout')).split('');
    this.$photosetImages = $photoset.find('img.photo');
    this.$photoset = $photoset;
  },

  /**
   * Register Event Handler
   * Assign a callback to an event
   * @param callback
   */
  registerEventHandler: function (event, callback) {
    cosole.debug('registering ' + event + ' callback', callback);
    if (this.callbacks.hasOwnProperty(event)) {
      this.callbacks.event.push(callback);
    } else {
      this.callbacks[event] = [callback];
    }
  },

  /**
   * Trigger Event
   * Execute callbacks for a given event
   * @param string event
   */
  triggerEvent: function (event) {
    cosole.log('triggered event ' + event);
    if (! this.callbacks.hasOwnProperty(event)) {
      return;
    }

    callbacks = this.callbacks[event];
    for (var callbackCounter = 0; callbackCounter < callbacks.length; callbackCounter++) {
      var callback = callbacks[callbackCounter];
      callback(this);
    }
  },

  /**
   * Render
   * builds out the rows and columns of our album photoset based on the photoset's data-layout property
   */
  render: function() {
    // imagePositionPointer determines where we start in the array of images for each row
    var imagePositionPointer = 0;

    this.triggerEvent('pre-render');
    for (var rowCounter = 0; rowCounter < this.layout.length; rowCounter++) { // each row

      this.triggerEvent('pre-row');
      // numImagesInRow is the current row's image count
      var numImagesInRow = parseInt(this.layout[rowCounter]);

      // row is the jcreate the row dom
      var $row = $('<ul class="medium-block-grid-' + numImagesInRow + '"></ul>');


      // build out and append to our row each image item
      for (var rowImageCounter = imagePositionPointer;
           rowImageCounter < (numImagesInRow + imagePositionPointer);
           rowImageCounter++
        ) { // each row image
        $image = $('<li></li>');
        $image.append(this.$photosetImages[rowImageCounter]);

        // @todo implement hover
        // .on("mouseenter", function() { $(this).find('.rollover').css("visibility", "visible"); } )
        // .on("mouseleave", function() { $(this).find('.rollover').css("visibility", "hidden"); } );
        // if hover enabled, every other image is the onMouseOver for the image prior
        // if no hover, simply add each image to the row dom
        $row.append($image);
      }

      // determine where we start in the array of images for the next row
      imagePositionPointer += numImagesInRow;
      this.$photoset.append($row);
    } // end row loop
  } // end render()
};
module.exports = albumPhotoset;