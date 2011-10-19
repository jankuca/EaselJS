/*
 * Point by Grant Skinner. Dec 5, 2010
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

goog.provide('easel.Point');

/**
 * Represents a point on a 2 dimensional x / y coordinate system.
 * @class Point
 * @constructor
 * @param {number} x X position. Default is 0.
 * @param {number} y Y position. Default is 0.
 */
easel.Point = function(x, y) {
  this.initialize(x, y);
};
	
// public properties:

/** 
 * X position. 
 * @property x
 * @type {number}
 */
easel.Point.prototype.x = 0;

/** 
 * Y position. 
 * @property y
 * @type {number}
 */
easel.Point.prototype.y = 0;

// constructor:
/** 
 * Initialization method.
 * @protected
 */
easel.Point.prototype.initialize = function(x, y) {
	this.x = (x == null ? 0 : x);
	this.y = (y == null ? 0 : y);
};

// public methods:
/**
 * Returns a clone of the Point instance.
 * @return {easel.Point} a clone of the Point instance.
 */
easel.Point.prototype.clone = function() {
	return new easel.Point(this.x, this.y);
};

/**
 * Returns a string representation of this object.
 * @return {string} a string representation of the instance.
 */
easel.Point.prototype.toString = function() {
	return "[Point (x="+this.x+" y="+this.y+")]";
};
