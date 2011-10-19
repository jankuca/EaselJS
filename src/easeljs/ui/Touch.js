/*
 * easel.Touch by Grant Skinner. Jul 4, 2011
 * Visit http://easeljs.com/ for documentation, updates and examples.
 *
 *
 * Copyright (c) 2011 Grant Skinner
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

goog.provide('easel.Touch');

/**
 * Global utility for working with touch enabled devices in EaselJS.
 * @class easel.Touch
 * @static
 */
easel.Touch = function() {
	throw "easel.Touch cannot be instantiated";
};

/**
 * Enables touch interaction for the specified EaselJS stage. This
 * currently only supports iOS, and simply maps single touch events
 * to the existing EaselJS mouse events.
 * @return {boolean} A boolean indicating whether touch is supported in the current environment.
 * @static
 */
easel.Touch.isSupported = function() {
	return ('ontouchstart' in window);
};

/**
 * Enables touch interaction for the specified EaselJS stage. This
 * currently only supports iOS, and simply maps single touch events
 * to the existing EaselJS mouse events.
 * @param {easel.Stage} stage The stage to enable touch on.
 * @static
 */
easel.Touch.enable = function(stage) {
	if (stage == null || !easel.Touch.isSupported()) { return; }
	var o = stage;

	// inject required properties on stage:
	o._primaryeasel.TouchId = -1;
	o._handleeasel.TouchMoveListener = null;

	// note that in the future we may need to disable the standard mouse event model before adding
	// these to prevent duplicate calls. It doesn't seem to be an issue with iOS devices though.
	o.canvas.addEventListener("touchstart", function(e) {
		easel.Touch._handleeasel.TouchStart(o,e);
	}, false);

	document.addEventListener("touchend", function(e) {
		easel.Touch._handleeasel.TouchEnd(o,e);
	}, false);
};

/**
 * @protected
 * @param {easel.Stage} stage
 * @param {easel.TouchEvent} e
 */
easel.Touch._handleeasel.TouchStart = function(stage,e) {
	e.preventDefault();

	if(stage._primaryeasel.TouchId != -1) {
		//we are already tracking an id
		return;
	}

	stage._handleeasel.TouchMoveListener = stage._handleeasel.TouchMoveListener || function(e){
		easel.Touch._handleeasel.TouchMove(stage,e);
	}

	//for touch we only need to listen to move events once a touch has started
	//on the canvas
	document.addEventListener("touchmove", stage._handleeasel.TouchMoveListener, false);

	var touch = e.changedeasel.Touches[0];
	stage._primaryeasel.TouchId = touch.identifier;
	stage._updateMousePosition(touch.pageX, touch.pageY);
	stage._handleMouseDown(touch);
};

/**
 * @protected
 * @param {easel.Stage} stage
 * @param {easel.TouchEvent} e
 */
easel.Touch._handleeasel.TouchMove = function(stage,e) {
	var touch = easel.Touch._findPrimaryeasel.Touch(stage,e.changedeasel.Touches);
	if(touch) {
		stage._handleMouseMove(touch);
	}
};

/**
 * @protected
 * @param {easel.Stage} stage
 * @param {easel.TouchEvent} e
 */
easel.Touch._handleeasel.TouchEnd = function(stage,e) {
	var touch = easel.Touch._findPrimaryeasel.Touch(stage,e.changedeasel.Touches);

	if(touch) {
		stage._primaryeasel.TouchId = -1;
		stage._handleMouseUp(touch);
		//stop listening for move events, until another new touch starts on the canvas
		document.removeEventListener("touchmove", stage._handleeasel.TouchMoveListener);
		stage._handleeasel.TouchMoveListener = null;
	}
};

/**
 * @protected
 * @param {easel.Stage} stage
 * @param {Array.<easel.Touch>} touches
 */
easel.Touch._findPrimaryeasel.Touch = function(stage,touches) {
	var l = touches.length;
	for(var i = 0; i < l; i++){
		var touch = touches[i];

		//find the primary touchPoint by id
		if(touch.identifier == stage._primaryeasel.TouchId) {
			return touch;
		}
	}
	return null;
};
