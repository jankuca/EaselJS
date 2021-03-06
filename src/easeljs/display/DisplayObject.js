/*
 * DisplayObject by Grant Skinner. Dec 5, 2010
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

goog.provide('easel.DisplayObject');

goog.require('easel.Filter');
goog.require('easel.Matrix2D');
goog.require('easel.Point');
goog.require('easel.UID');

/**
 * DisplayObject is an abstract class that should not be constructed directly. Instead construct subclasses such as
 * Sprite, Bitmap, and Shape. DisplayObject is the base class for all display classes in the CanvasDisplay library.
 * It defines the core properties and methods that are shared between all display objects.
 * @class DisplayObject
 * @constructor
 */
easel.DisplayObject = function() {
  this.initialize();
};;

/**
 * Suppresses errors generated when using features like hitTest, onPress/onClick, and getObjectsUnderPoint with cross
 * domain content
 * @property suppressCrossDomainErrors
 * @static
 * @type {boolean}
 * @default false
 */
easel.DisplayObject.suppressCrossDomainErrors = false;

/**
 * @property _hitTestCanvas
 * @type {HTMLCanvasElement}
 * @static
 * @protected
 */
easel.DisplayObject._hitTestCanvas = /** @type {HTMLCanvasElement} */ document.createElement("canvas");
easel.DisplayObject._hitTestCanvas.width = easel.DisplayObject._hitTestCanvas.height = 1;

/**
 * @property _hitTestContext
 * @type {CanvasRenderingContext2D}
 * @static
 * @protected
 */
easel.DisplayObject._hitTestContext = /** @type {CanvasRenderingContext2D} */ easel.DisplayObject._hitTestCanvas.getContext("2d");


/**
 * The alpha (transparency) for this display object. 0 is fully transparent, 1 is fully opaque.
 * @property alpha
 * @type {number}
 * @default 1
 */
easel.DisplayObject.prototype.alpha = 1;

/**
 * If a cache is active, this returns the canvas that holds the cached version of this display object. See cache()
 * for more information. READ-ONLY.
 * @property cacheCanvas
 * @type {HTMLCanvasElement}
 * @default null
 */
easel.DisplayObject.prototype.cacheCanvas = null;

/**
 * Unique ID for this display object. Makes display objects easier for some uses.
 * @property id
 * @type {number}
 * @default -1
 */
easel.DisplayObject.prototype.id = -1;

/**
 * Indicates whether to include this object when running Stage.getObjectsUnderPoint(). Setting this to true for
 * Sprites will cause the Sprite to be returned (not its children) regardless of whether it's mouseChildren property
 * is true.
 * @property mouseEnabled
 * @type {boolean}
 * @default true
 */
easel.DisplayObject.prototype.mouseEnabled = true;

/**
 * An optional name for this display object. Included in toString(). Useful for debugging.
 * @property name
 * @type {?string}
 * @default null
 */
easel.DisplayObject.prototype.name = null;

/**
 * A reference to the Sprite or Stage object that contains this display object, or null if it has not been added to
 * one. READ-ONLY.
 * @property parent
 * @type {?easel.DisplayObject}
 * @default null
 */
easel.DisplayObject.prototype.parent = null;

/**
 * The x offset for this display object's registration point. For example, to make a 100x100px Bitmap rotate around
 * it's center, you would set regX and regY to 50.
 * @property regX
 * @type {number}
 * @default 0
 */
easel.DisplayObject.prototype.regX = 0;

/**
 * The y offset for this display object's registration point. For example, to make a 100x100px Bitmap rotate around
 * it's center, you would set regX and regY to 50.
 * @property regY
 * @type {number}
 * @default 0
 */
easel.DisplayObject.prototype.regY = 0;

/**
 * The rotation in degrees for this display object.
 * @property rotation
 * @type {number}
 * @default 0
 */
easel.DisplayObject.prototype.rotation = 0;

/**
 * The factor to stretch this display object horizontally. For example, setting scaleX to 2 will stretch the display
 * object to twice it's nominal width.
 * @property scaleX
 * @type {number}
 * @default 1
 */
easel.DisplayObject.prototype.scaleX = 1;

/**
 * The factor to stretch this display object vertically. For example, setting scaleY to 0.5 will stretch the display
 * object to half it's nominal height.
 * @property scaleY
 * @type {number}
 * @default 1
 */
easel.DisplayObject.prototype.scaleY = 1;

/**
 * The factor to skew this display object horizontally.
 * @property skewX
 * @type {number}
 * @default 0
 */
easel.DisplayObject.prototype.skewX = 0;

/**
 * The factor to skew this display object vertically.
 * @property skewY
 * @type {number}
 * @default 0
 */
easel.DisplayObject.prototype.skewY = 0;

/**
 * A shadow object that defines the shadow to render on this display object. Set to null to remove a shadow. If
 * null, this property is inherited from the parent container.
 * @property shadow
 * @type {?easel.Shadow}
 * @default null
 */
easel.DisplayObject.prototype.shadow = null;

/**
 * Indicates whether this display object should be rendered to the canvas and included when running
 * Stage.getObjectsUnderPoint().
 * @property visible
 * @type {boolean}
 * @default true
 */
easel.DisplayObject.prototype.visible = true;

/**
 * The x (horizontal) position of the display object, relative to its parent.
 * @property x
 * @type {number}
 * @default 0
 */
easel.DisplayObject.prototype.x = 0;

/** The y (vertical) position of the display object, relative to its parent.
 * @property y
 * @type {number}
 * @default 0
 */
easel.DisplayObject.prototype.y = 0;

/**
 * The composite operation indicates how the pixels of this display object will be composited with the elements
 * behind it. If null, this property is inherited from the parent container. For more information, read the
 * <a href="http://www.whatwg.org/specs/web-apps/current-work/multipage/the-canvas-element.html#compositing">
 * whatwg spec on compositing</a>.
 * @property compositeOperation
 * @type {?string}
 * @default null
 */
easel.DisplayObject.prototype.compositeOperation = null;

/**
 * Indicates whether the display object should have it's x & y position rounded prior to drawing it to stage.
 * This only applies if the enclosing stage has snapPixelsEnabled set to true, and the display object's composite
 * transform does not include any scaling, rotation, or skewing. The snapToPixel property is true by default for
 * Bitmap and BitmapSequence instances, and false for all other display objects.
 * @property snapToPixel
 * @type {boolean}
 * @default false
 */
easel.DisplayObject.prototype.snapToPixel = false;

/**
 * The onPress callback is called when the user presses down on their mouse over this display object. The handler
 * is passed a single param containing the corresponding MouseEvent instance. You can subscribe to the onMouseMove
 * and onMouseUp callbacks of the event object to receive these events until the user releases the mouse button.
 * If an onPress handler is set on a container, it will receive the event if any of its children are clicked.
 * @event onPress
 * @param {?easel.MouseEvent} event MouseEvent with information about the event.
 */
easel.DisplayObject.prototype.onPress = null;

/**
 * The onClick callback is called when the user presses down on and then releases the mouse button over this
 * display object. The handler is passed a single param containing the corresponding MouseEvent instance. If an
 * onClick handler is set on a container, it will receive the event if any of its children are clicked.
 * @event onClick
 * @param {?easel.MouseEvent} event MouseEvent with information about the event.
 */
easel.DisplayObject.prototype.onClick = null;

/**
 * The onDoubleClick callback is called when the user double clicks over this display object. The handler is
 * passed a single param containing the corresponding MouseEvent instance. If an onDoubleClick handler is set
 * on a container, it will receive the event if any of its children are clicked.
 * @event onDoubleClick
 * @param {?easel.MouseEvent} event MouseEvent with information about the event.
 */
easel.DisplayObject.prototype.onDoubleClick = null;

/**
 * The onMouseOver callback is called when the user rolls over the display object. You must enable this event using
 * stage.enableMouseOver(). The handler is passed a single param containing the corresponding MouseEvent instance.
 * @event onMouseOver
 * @param {?easel.MouseEvent} event MouseEvent with information about the event.
 */
easel.DisplayObject.prototype.onMouseOver = null;

/**
 * The onMouseOut callback is called when the user rolls off of the display object. You must enable this event using
 * stage.enableMouseOver(). The handler is passed a single param containing the corresponding MouseEvent instance.
 * @event onMouseOut
 * @param {?easel.MouseEvent} event MouseEvent with information about the event.
 */
easel.DisplayObject.prototype.onMouseOut = null;

/**
 * The tick callback is called on each display object on stage whenever the stage updates.
 * This occurs immediately before the rendering (draw) pass.
 * @event tick
 */
easel.DisplayObject.prototype.tick = null;

/**
 * An array of Filter objects to apply to this display object. Filters are only applied / updated when cache() or
 * updateCache() is called on the display object, and only apply to the area that is cached.
 * @property filters
 * @type {Array.<easel.Filter>}
 * @default null
 */
easel.DisplayObject.prototype.filters = null;

// private properties:

/**
 * @property _cacheOffsetX
 * @protected
 * @type {number}
 * @default 0
 */
easel.DisplayObject.prototype._cacheOffsetX = 0;

/**
 * @property _cacheOffsetY
 * @protected
 * @type {number}
 * @default 0
 */
easel.DisplayObject.prototype._cacheOffsetY = 0;

/**
 * @property _matrix
 * @protected
 * @type {easel.Matrix2D}
 * @default 1
 */
easel.DisplayObject.prototype._matrix = null;

// constructor:
// separated so it can be easily addressed in subclasses:

/**
 * Initialization method.
 * @protected
 */
easel.DisplayObject.prototype.initialize = function() {
	this.id = easel.UID.get();
	this._matrix = new easel.Matrix2D();
};

// public methods:
/**
 * Returns true or false indicating whether the display object would be visible if drawn to a canvas.
 * This does not account for whether it would be visible within the boundaries of the stage.
 * NOTE: This method is mainly for internal use, though it may be useful for advanced uses.
 * @return {boolean} Boolean indicating whether the display object would be visible if drawn to a canvas
 */
easel.DisplayObject.prototype.isVisible = function() {
	return this.visible && this.alpha > 0 && this.scaleX != 0 && this.scaleY != 0;
};

/**
 * Draws the display object into the specified context ignoring it's visible, alpha, shadow, and transform.
 * Returns true if the draw was handled (useful for overriding functionality).
 * NOTE: This method is mainly for internal use, though it may be useful for advanced uses.
 * @param {CanvasRenderingContext2D|Object} ctx The canvas 2D context object to draw into.
 * @param {boolean=} ignoreCache Indicates whether the draw operation should ignore any current cache.
 * For example, used for drawing the cache (to prevent it from simply drawing an existing cache back
 * into itself).
 */
easel.DisplayObject.prototype.draw = function(ctx, ignoreCache) {
	if (ignoreCache || !this.cacheCanvas) { return false; }
	ctx.drawImage(this.cacheCanvas, this._cacheOffsetX, this._cacheOffsetY);
	return true;
};

/**
 * Draws the display object into a new canvas, which is then used for subsequent draws. For complex content
 * that does not change frequently (ex. a Sprite with many children that do not move, or a complex vector Shape),
 * this can provide for much faster rendering because the content does not need to be re-rendered each tick. The
 * cached display object can be moved, rotated, faded, etc freely, however if it's content changes, you must manually
 * update the cache by calling updateCache() or cache() again. You must specify the cache area via the x, y, w,
 * and h parameters. This defines the rectangle that will be rendered and cached using this display object's
 * coordinates. For example if you defined a Shape that drew a circle at 0, 0 with a radius of 25, you could call
 * myShape.cache(-25, -25, 50, 50) to cache the full shape.
 * @param {number} x The x coordinate origin for the cache region.
 * @param {number} y The y coordinate origin for the cache region.
 * @param {number} width The width of the cache region.
 * @param {number} height The height of the cache region.
 */
easel.DisplayObject.prototype.cache = function(x, y, width, height) {
	// draw to canvas.
	if (this.cacheCanvas == null) { this.cacheCanvas = /** @type {HTMLCanvasElement} */ document.createElement("canvas"); }
	var ctx = /** @type {CanvasRenderingContext2D} */ this.cacheCanvas.getContext("2d");
	this.cacheCanvas.width = width;
	this.cacheCanvas.height = height;
	ctx.setTransform(1, 0, 0, 1, -x, -y);
	ctx.clearRect(0, 0, width+1, height+1); // because some browsers don't properly clear if the width/height remain the same.
	this.draw(ctx, true);
	this._cacheOffsetX = x;
	this._cacheOffsetY = y;
	this._applyFilters();
};

/**
 * Redraws the display object to its cache. Calling updateCache without an active cache will throw an error.
 * If compositeOperation is null the current cache will be cleared prior to drawing. Otherwise the display object
 * will be drawn over the existing cache using the specified compositeOperation.
 * @param {string} compositeOperation The compositeOperation to use, or null to clear the cache and redraw it.
 * <a href="http://www.whatwg.org/specs/web-apps/current-work/multipage/the-canvas-element.html#compositing">
 * whatwg spec on compositing</a>.
 */
easel.DisplayObject.prototype.updateCache = function(compositeOperation) {
	if (this.cacheCanvas == null) { throw "cache() must be called before updateCache()"; }
	var ctx = this.cacheCanvas.getContext("2d");
	ctx.setTransform(1, 0, 0, 1, -this._cacheOffsetX, -this._cacheOffsetY);
	if (!compositeOperation) { ctx.clearRect(0, 0, this.cacheCanvas.width+1, this.cacheCanvas.height+1); }
	else { ctx.globalCompositeOperation = compositeOperation; }
	this.draw(ctx, true);
	if (compositeOperation) { ctx.globalCompositeOperation = "source-over"; }
	this._applyFilters();
};

/**
 * Clears the current cache. See cache() for more information.
 */
easel.DisplayObject.prototype.uncache = function() {
	this.cacheCanvas = null;
	this._cacheOffsetX = this._cacheOffsetY = 0;
};

/**
 * Returns the stage that this display object will be rendered on, or null if it has not been added to one.
 * @return {easel.Stage} The Stage instance that the display object is a descendent of. null if the DisplayObject has not
 * been added to a Stage.
 */
easel.DisplayObject.prototype.getStage = function() {
	var o = this;
	while (o.parent) {
		o = o.parent;
	}
	if (o instanceof easel.Stage) { return o; }
	return null;
};

/**
 * Transforms the specified x and y position from the coordinate space of the display object
 * to the global (stage) coordinate space. For example, this could be used to position an HTML label
 * over a specific point on a nested display object. Returns a Point instance with x and y properties
 * correlating to the transformed coordinates on the stage.
 * @param {number} x The x position in the source display object to transform.
 * @param {number} y The y position in the source display object to transform.
 * @return {easel.Point} A Point instance with x and y properties correlating to the transformed coordinates
 * on the stage.
 */
easel.DisplayObject.prototype.localToGlobal = function(x, y) {
	var mtx = this.getConcatenatedMatrix(this._matrix);
	if (mtx == null) { return null; }
	mtx.append(1, 0, 0, 1, x, y);
	return new easel.Point(mtx.tx, mtx.ty);
};

/**
 * Transforms the specified x and y position from the global (stage) coordinate space to the
 * coordinate space of the display object. For example, this could be used to determine
 * the current mouse position within the display object. Returns a Point instance with x and y properties
 * correlating to the transformed position in the display object's coordinate space.
 * @param {number} x The x position on the stage to transform.
 * @param {number} y The y position on the stage to transform.
 * @return {easel.Point} A Point instance with x and y properties correlating to the transformed position in the
 * display object's coordinate space.
 */
easel.DisplayObject.prototype.globalToLocal = function(x, y) {
	var mtx = this.getConcatenatedMatrix(this._matrix);
	if (mtx == null) { return null; }
	mtx.invert();
	mtx.append(1, 0, 0, 1, x, y);
	return new easel.Point(mtx.tx, mtx.ty);
};

/**
 * Transforms the specified x and y position from the coordinate space of this display object to the
 * coordinate space of the target display object. Returns a Point instance with x and y properties
 * correlating to the transformed position in the target's coordinate space. Effectively the same as calling
 * var pt = this.localToGlobal(x, y); pt = target.globalToLocal(pt.x, pt.y);
 * @param {number} x The x position in the source display object to transform.
 * @param {number} y The y position on the stage to transform.
 * @param {easel.DisplayObject} target The target display object to which the coordinates will be transformed.
 * @return {easel.Point} Returns a Point instance with x and y properties correlating to the transformed position
 * in the target's coordinate space.
 */
easel.DisplayObject.prototype.localToLocal = function(x, y, target) {
	var pt = this.localToGlobal(x, y);
	return target.globalToLocal(pt.x, pt.y);
};

/**
 * Shortcut method to quickly set the transform properties on the display object. All parameters are optional.
 * Omitted parameters will have the default value set (ex. 0 for x/y, 1 for scaleX/Y).
 * @param {number} x
 * @param {number} y
 * @param {number} scaleX
 * @param {number} scaleY
 * @param {number} rotation
 * @param {number} skewX
 * @param {number} skewY
 * @param {number} regX
 * @param {number} regY
 */
easel.DisplayObject.prototype.setTransform = function(x, y, scaleX, scaleY, rotation, skewX, skewY, regX, regY) {
	this.x = x || 0;
	this.y = y || 0;
	this.scaleX = scaleX == null ? 1 : scaleX;
	this.scaleY = scaleY == null ? 1 : scaleY;
	this.rotation = rotation || 0;
	this.skewX = skewX || 0;
	this.skewY = skewY || 0;
	this.regX = regX || 0;
	this.regY = regY || 0;
};

/**
 * Generates a concatenated Matrix2D object representing the combined transform of
 * the display object and all of its parent Containers up to the highest level ancestor
 * (usually the stage). This can be used to transform positions between coordinate spaces,
 * such as with localToGlobal and globalToLocal.
 * @param {easel.Matrix2D} mtx Optional. A Matrix2D object to populate with the calculated values. If null, a new
 * Matrix object is returned.
 * @return {easel.Matrix2D} a concatenated Matrix2D object representing the combined transform of
 * the display object and all of its parent Containers up to the highest level ancestor (usually the stage).
 */
easel.DisplayObject.prototype.getConcatenatedMatrix = function(mtx) {
	if (mtx) { mtx.identity(); }
	else { mtx = new easel.Matrix2D(); }
	var target = this;
	while (target != null) {
		mtx.prependTransform(target.x, target.y, target.scaleX, target.scaleY, target.rotation, target.skewX,
								target.skewY, target.regX, target.regY);
		mtx.prependProperties(target.alpha, target.shadow, target.compositeOperation);
		target = target.parent;
	}
	return mtx;
};

/**
 * Tests whether the display object intersects the specified local point (ie. draws a pixel with alpha > 0 at
 * the specified position). This ignores the alpha, shadow and compositeOperation of the display object, and all
 * transform properties including regX/Y.
 * @param {number} x The x position to check in the display object's local coordinates.
 * @param {number} y The y position to check in the display object's local coordinates.
 * @return {boolean} A Boolean indicting whether a visible portion of the DisplayObject intersect the specified
 * local Point.
 */
easel.DisplayObject.prototype.hitTest = function(x, y) {
	var ctx = easel.DisplayObject._hitTestContext;
	var canvas = easel.DisplayObject._hitTestCanvas;

	ctx.setTransform(1,  0, 0, 1, -x, -y);
	this.draw(ctx);

	var hit = this._testHit(ctx);

	canvas.width = 0;
	canvas.width = 1;
	return hit;
};

/**
 * Returns a clone of this DisplayObject. Some properties that are specific to this instance's current context are
 * reverted to their defaults (for example .parent).
 * @param {*=} option For child methods
 * @return {easel.DisplayObject} A clone of the current DisplayObject instance.
 */
easel.DisplayObject.prototype.clone = function(option) {
	var o = new easel.DisplayObject();
	this.cloneProps(o);
	return o;
};

/**
 * Returns a string representation of this object.
 * @return {string} a string representation of the instance.
 */
easel.DisplayObject.prototype.toString = function() {
	return "[DisplayObject (name="+  this.name +")]";
};

// private methods:

// separated so it can be used more easily in subclasses:
/**
 * @protected
 * @param {easel.DisplayObject} o The DisplayObject instance which will have properties from the current DisplayObject
 * instance copied into.
 */
easel.DisplayObject.prototype.cloneProps = function(o) {
	o.alpha = this.alpha;
	o.name = this.name;
	o.regX = this.regX;
	o.regY = this.regY;
	o.rotation = this.rotation;
	o.scaleX = this.scaleX;
	o.scaleY = this.scaleY;
	o.shadow = this.shadow;
	o.skewX = this.skewX;
	o.skewY = this.skewY;
	o.visible = this.visible;
	o.x  = this.x;
	o.y = this.y;
	o.mouseEnabled = this.mouseEnabled;
	o.compositeOperation = this.compositeOperation;
};

/**
 * @protected
 * @param {CanvasRenderingContext2D} ctx
 * @param {easel.Shadow} shadow
 */
easel.DisplayObject.prototype.applyShadow = function(ctx, shadow) {
	shadow = shadow || easel.Shadow.identity;
	ctx.shadowColor = shadow.color;
	ctx.shadowOffsetX = shadow.offsetX;
	ctx.shadowOffsetY = shadow.offsetY;
	ctx.shadowBlur = shadow.blur;
};

/**
 * @protected
 * @param {CanvasRenderingContext2D} ctx
 * @return {boolean}
 */
easel.DisplayObject.prototype._testHit = function(ctx) {
	try {
		var hit = ctx.getImageData(0, 0, 1, 1).data[3] > 1;
	} catch (e) {
		if (!easel.DisplayObject.suppressCrossDomainErrors) {
			throw "An error has occured. This is most likely due to security restrictions on reading canvas pixel " +
			"data with local or cross-domain images.";
		}
	}
	return hit;
};

/**
 * @protected
 */
easel.DisplayObject.prototype._applyFilters = function() {
	if (!this.filters || this.filters.length == 0 || !this.cacheCanvas) { return; }
	var l = this.filters.length;
	var ctx = /** @type {CanvasRenderingContext2D} */ this.cacheCanvas.getContext("2d");
	var w = this.cacheCanvas.width;
	var h = this.cacheCanvas.height;
	for (var i=0; i<l; i++) {
		this.filters[i].applyFilter(ctx, 0, 0, w, h);
	}
};
