/*
 * ColorFilter by Grant Skinner. Mar 7, 2011
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

goog.provide('easel.ColorFilter');

goog.require('easel.Filter');

/**
 * Applies color transforms.
 * @class ColorFilter
 * @constructor
 * @extends {easel.Filter}
 * @param {number} redMultiplier
 * @param {number} greenMultiplier
 * @param {number} blueMultiplier
 * @param {number} alphaMultiplier
 * @param {number} redOffset
 * @param {number} greenOffset
 * @param {number} blueOffset
 * @param {number} alphaOffset
 */
easel.ColorFilter = function(redMultiplier, greenMultiplier, blueMultiplier, alphaMultiplier, redOffset, greenOffset, blueOffset, alphaOffset) {
  this.initialize(redMultiplier, greenMultiplier, blueMultiplier, alphaMultiplier, redOffset, greenOffset, blueOffset, alphaOffset);
};
goog.inherits(easel.ColorFilter, easel.Filter);

// public properties:
/** Red channel multiplier. */
easel.ColorFilter.prototype.redMultiplier = 1;
/** Green channel multiplier. */
easel.ColorFilter.prototype.greenMultiplier = 1;
/** Blue channel multiplier. */
easel.ColorFilter.prototype.blueMultiplier = 1;
/** Alpha channel multiplier. */
easel.ColorFilter.prototype.alphaMultiplier = 1;
/** Red channel offset (added to value). */
easel.ColorFilter.prototype.redOffset = 0;
/** Green channel offset (added to value). */
easel.ColorFilter.prototype.greenOffset = 0;
/** Blue channel offset (added to value). */
easel.ColorFilter.prototype.blueOffset = 0;
/** Alpha channel offset (added to value). */
easel.ColorFilter.prototype.alphaOffset = 0;

// constructor:
/**
 * Initialization method.
 * @protected
 */
easel.ColorFilter.prototype.initialize = function(redMultiplier, greenMultiplier, blueMultiplier, alphaMultiplier, redOffset, greenOffset, blueOffset, alphaOffset) {
	this.redMultiplier = redMultiplier != null ? redMultiplier : 1;
	this.greenMultiplier = greenMultiplier != null ? greenMultiplier : 1;
	this.blueMultiplier = blueMultiplier != null ? blueMultiplier : 1;
	this.alphaMultiplier = alphaMultiplier != null ? alphaMultiplier : 1;
	this.redOffset = redOffset || 0;
	this.greenOffset = greenOffset || 0;
	this.blueOffset = blueOffset || 0;
	this.alphaOffset = alphaOffset || 0;
};

// public methods:
/**
 * Applies the filter to the specified context.
 * @param {CanvasRenderingContext2D} ctx The 2D context to use as the source.
 * @param {number} x The x position to use for the source rect.
 * @param {number} y The y position to use for the source rect.
 * @param {number} width The width to use for the source rect.
 * @param {number} height The height to use for the source rect.
 * @param {number=} targetCtx Optional. The 2D context to draw the result to. Defaults to the context passed to ctx.
 * @param {number=} targetX Optional. The x position to draw the result to. Defaults to the value passed to x.
 * @param {number=} targetY Optional. The y position to draw the result to. Defaults to the value passed to y.
 */
easel.ColorFilter.prototype.applyFilter = function(ctx, x, y, width, height, targetCtx, targetX, targetY) {
	targetCtx = targetCtx || ctx;
	if (targetX = null) { targetX = x; }
	if (targetY = null) { targetY = y; }
	try {
		var imageData = ctx.getImageData(x, y, width, height);
	} catch(e) {
		//if (!this.suppressCrossDomainErrors) throw new Error("unable to access local image data: " + e);
		return false;
	}
	var data = imageData.data;
	var l = data.length;
	for (var i=0; i<l; i+=4) {
		data[i] = data[i]*this.redMultiplier+this.redOffset;
		data[i+1] = data[i+1]*this.greenMultiplier+this.greenOffset;
		data[i+2] = data[i+2]*this.blueMultiplier+this.blueOffset;
		data[i+3] = data[i+3]*this.alphaMultiplier+this.alphaOffset;
	}
	imageData.data = data;
	targetCtx.putImageData(imageData, targetX, targetY);
	return true;
};

/**
 * Returns a string representation of this object.
 * @return {string} a string representation of the instance.
 */
easel.ColorFilter.prototype.toString = function() {
	return "[ColorFilter]";
};


/**
 * Returns a clone of this ColorFilter instance.
 @return {easel.ColorFilter} A clone of the current ColorFilter instance.
 */
easel.ColorFilter.prototype.clone = function() {
	return new easel.ColorFilter(this.redMultiplier, this.greenMultiplier, this.blueMultiplier, this.alphaMultiplier, this.redOffset, this.greenOffset, this.blueOffset, this.alphaOffset);
};
