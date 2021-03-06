/*
 * Bitmap by Grant Skinner. Dec 5, 2010
 * Visit http://easeljs.com/ for documentation, updates and examples.
 *
 *
 * Copyright (c) 2010 Grant Skinner
 * 
 * Permission is hereby granted, free of charge, to any person
 * obtaining a copy of this software and associated documentation
 * files (the "Software"), to deal in the Software without
 * restriction, including without limitation the rights to use,
 * copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the
 * Software is furnished to do so, subject to the following
 * conditions:
 * 
 * The above copyright notice and this permission notice shall be
 * included in all copies or substantial portions of the Software.
 * 
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
 * EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES
 * OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
 * NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT
 * HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY,
 * WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
 * FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR
 * OTHER DEALINGS IN THE SOFTWARE.
 */

/**
 * The Easel Javascript library provides a retained graphics mode for canvas 
 * including a full, hierarchical display list, a core interaction model, and 
 * helper classes to make working with Canvas much easier.
 */

goog.provide('easel.Bitmap');

goog.require('easel.DisplayObject');

/**
 * A Bitmap represents an Image, Canvas, or Video in the display list.
 * @class Bitmap
 * @extends {easel.DisplayObject}
 * @constructor
 * @param {Image | HTMLCanvasElement | HTMLVideoElement | string} imageOrUri The source object or URI to an image to display. This can be either an Image, Canvas, or Video object, or a string URI to an image file to load and use. If it is a URI, a new Image object will be constructed and assigned to the .image property.
 */
easel.Bitmap = function(imageOrUri) {
	goog.base(this);
  this.initialize(imageOrUri);
};;
goog.inherits(easel.Bitmap, easel.DisplayObject);

// public properties:
/**
 * The image to render. This can be an Image, a Canvas, or a Video.
 * @property image
 * @type {Image | HTMLCanvasElement | HTMLVideoElement}
 */
easel.Bitmap.prototype.image = null;

/**
 * Whether or not the Bitmap should be draw to the canvas at whole pixel coordinates.
 * @property snapToPixel
 * @type {boolean}
 * @default true
 */
easel.Bitmap.prototype.snapToPixel = true;

// constructor:

/** 
 * Initialization method.
 * @protected
 */
easel.Bitmap.prototype.initialize = function(imageOrUri) {
	easel.DisplayObject.prototype.initialize.call(this);
	if (typeof imageOrUri == "string") {
		this.image = new Image();
		this.image.src = imageOrUri;
	} else {
		this.image = imageOrUri;
	}
};;

// public methods:

/**
 * Returns true or false indicating whether the display object would be visible if drawn to a canvas.
 * This does not account for whether it would be visible within the boundaries of the stage.
 * NOTE: This method is mainly for internal use, though it may be useful for advanced uses.
 * @return {boolean} Boolean indicating whether the display object would be visible if drawn to a canvas
 */
easel.Bitmap.prototype.isVisible = function() {
	return this.visible && this.alpha > 0 && this.scaleX != 0 && this.scaleY != 0 && this.image && (this.image.complete || this.image.getContext);
};;

/**
 * Draws the display object into the specified context ignoring it's visible, alpha, shadow, and transform.
 * Returns true if the draw was handled (useful for overriding functionality).
 * NOTE: This method is mainly for internal use, though it may be useful for advanced uses.
 * @param {CanvasRenderingContext2D} ctx The canvas 2D context object to draw into.
 * @param {boolean} ignoreCache Indicates whether the draw operation should ignore any current cache. 
 * For example, used for drawing the cache (to prevent it from simply drawing an existing cache back
 * into itself).
 */
easel.Bitmap.prototype.draw = function(ctx, ignoreCache) {
	if (easel.DisplayObject.prototype.draw.call(this, ctx, ignoreCache)) { return true; }
	ctx.drawImage(this.image, 0, 0);
	return true;
};;

//Note, the doc sections below document using the specified APIs (from DisplayObject)  from
//Bitmap. This is why they have no method implementations.

/**
 * Because the content of a Bitmap is already in a simple format, cache is unnecessary for Bitmap instances.
 * You should not cache Bitmap instances as it can degrade performance.
 */

/**
 * Because the content of a Bitmap is already in a simple format, cache is unnecessary for Bitmap instances.
 * You should not cache Bitmap instances as it can degrade performance.
 */

/**
 * Because the content of a Bitmap is already in a simple format, cache is unnecessary for Bitmap instances.
 * You should not cache Bitmap instances as it can degrade performance.
 */

/**
 * Returns a clone of the Bitmap instance.
 * @return {easel.Bitmap} a clone of the Bitmap instance.
 */
easel.Bitmap.prototype.clone = function() {
	var o = new Bitmap(this.image);
	this.cloneProps(o);
	return o;
};;

/**
 * Returns a string representation of this object.
 * @return {string} a string representation of the instance.
 */
easel.Bitmap.prototype.toString = function() {
	return "[Bitmap (name=" + this.name +")]";
};;
