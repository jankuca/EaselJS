/*
 * easel.Ticker by Grant Skinner. Dec 5, 2010
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

goog.provide('easel.Ticker');

// constructor:
/**
 * The easel.Ticker class uses a static interface (ex. easel.Ticker.getPaused()) and should not be instantiated.
 * Provides a centralized tick or heartbeat broadcast at a set interval. Listeners can subscribe
 * to the tick event to be notified when a set time interval has elapsed.
 * Note that the interval that the tick event is called is a target interval, and may be broadcast
 * at a slower interval during times of high CPU load.
 * @class easel.Ticker
 * @static
 */
easel.Ticker = function() {
	throw new Error("easel.Ticker cannot be instantiated.");
};;
	
easel.Ticker.useInterval = true;

/**
 * Event broadcast  once each tick / interval. The interval is specified via the 
 * .setInterval(ms) or setFPS methods.
 * @event tick
 * @param {number} timeElapsed The time elapsed in milliseconds since the last tick event.
 */	

// private static properties:


/** 
 * @property _listeners
 * @type {?Array.<Object>}
 * @protected 
 */
easel.Ticker._listeners = null;

/** 
 * @property _pauseable
 * @type {?Array.<boolean>}
 * @protected 
 */
easel.Ticker._pauseable = null;

/** 
 * @property _paused
 * @type {boolean}
 * @protected 
 */
easel.Ticker._paused = false;

/** 
 * @property _inited
 * @type {boolean}
 * @protected 
 */
easel.Ticker._inited = false;

/** 
 * @property _startTime
 * @type {number}
 * @protected 
 */
easel.Ticker._startTime = 0;

/** 
 * @property _pausedTime
 * @type {number}
 * @protected 
 */
easel.Ticker._pausedTime=0;

/** 
 * Number of ticks that have passed
 * @property _ticks
 * @type {number}
 * @protected 
 */
easel.Ticker._ticks = 0;

/**
 * Number of ticks that have passed while easel.Ticker has been paused
 * @property _pausedeasel.Tickers
 * @type {number}
 * @protected 
 */
easel.Ticker._pausedeasel.Tickers = 0;

/** 
 * @property _interval
 * @type {number}
 * @protected 
 */
easel.Ticker._interval = 50; // READ-ONLY

/** 
 * @property _lastTime
 * @type {number}
 * @protected 
 */
easel.Ticker._lastTime = 0;

/** 
 * @property _times
 * @type {Array.<number>}
 * @protected 
 */
easel.Ticker._times = null;

/** 
 * @property _tickTimes
 * @type {Array.<number>}
 * @protected 
 */
easel.Ticker._tickTimes = null;

/** 
 * @property _rafActive
 * @type {boolean}
 * @protected 
 */
easel.Ticker._rafActive = false;


// public static methods:
/**
 * Adds a listener for the tick event. The listener object must expose a .tick() method, 
 * which will be called once each tick / interval. The interval is specified via the 
 * .setInterval(ms) method.
 * The exposed tick method is passed a single parameter, which include the elapsed time between the 
 * previous tick and the current one.
 * @static
 * @param {!Object} o The object to add as a listener.
 * @param {boolean} pauseable If false, the listener will continue to have tick called 
 * even when easel.Ticker is paused via easel.Ticker.pause(). Default is true.
 */
easel.Ticker.addListener = function(o, pauseable) {
	if (!easel.Ticker._inited) { easel.Ticker.init(); }
	easel.Ticker.removeListener(o);
	easel.Ticker._pauseable[easel.Ticker._listeners.length] = (pauseable == null) ? true : pauseable;
	easel.Ticker._listeners.push(o);
};

/**
 * Initializes or resets the timer, clearing all associated listeners and fps measuring data, starting the tick.
 * This is called automatically when the first listener is added.
 * @static
 */
easel.Ticker.init = function() {
	easel.Ticker._inited = true;
	easel.Ticker._times = [];
	easel.Ticker._tickTimes = [];
	easel.Ticker._pauseable = [];
	easel.Ticker._listeners = [];
	easel.Ticker._times.push(easel.Ticker._startTime = easel.Ticker._getTime());
	easel.Ticker.setInterval(easel.Ticker._interval);
};

/**
 * Removes the specified listener.
 * @static
 * @param {!Object} o The object to remove from listening from the tick event.
 */
easel.Ticker.removeListener = function(o) {
	if (easel.Ticker._listeners == null) { return; }
	var index = easel.Ticker._listeners.indexOf(o);
	if (index != -1) {
		easel.Ticker._listeners.splice(index, 1);
		easel.Ticker._pauseable.splice(index, 1);
	}
};

/**
 * Removes all listeners.
 * @static
 */
easel.Ticker.removeAllListeners = function() {
	easel.Ticker._listeners = [];
	easel.Ticker._pauseable = [];
};

/**
 * Sets the target time (in milliseconds) between ticks. Default is 50 (20 FPS).
 * Note actual time between ticks may be more than requested depending on CPU load.
 * @static
 * @param {number} interval Time in milliseconds between ticks. Default value is 50.
 */
easel.Ticker.setInterval = function(interval) {
	easel.Ticker._lastTime = easel.Ticker._getTime();
	easel.Ticker._interval = interval;
	if (!easel.Ticker.useInterval) {
		var f = window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame ||
				  window.oRequestAnimationFrame || window.msRequestAnimationFrame;
		if (f) {
			f(easel.Ticker._handleAF);
			easel.Ticker._rafFunction = f;
			return;
		}
	}
	setTimeout(easel.Ticker._handleTimeout, interval);
};

/**
 * Returns the current target time between ticks, as set with setInterval.
 * @static
 * @return {number} The current target interval in milliseconds between tick events.
 */
easel.Ticker.getInterval = function() {
	return easel.Ticker._interval;
};

/**
 * Sets the target frame rate in frames per second (FPS). For example, with an interval of 40, getFPS() will 
 * return 25 (1000ms per second divided by 40 ms per tick = 25fps).
 * @static
 * @param {number} value Target number of ticks broadcast per second.
 */	
easel.Ticker.setFPS = function(value) {
	easel.Ticker.setInterval(1000/value);
};

/**
 * Returns the target frame rate in frames per second (FPS). For example, with an 
 * interval of 40, getFPS() will return 25 (1000ms per second divided by 40 ms per tick = 25fps).
 * @static
 * @return {number} The current target number of frames / ticks broadcast per second.
 */
easel.Ticker.getFPS = function() {
	return 1000/easel.Ticker._interval;
};

/**
 * Returns the actual frames / ticks per second.
 * @static
 * @param {number} ticks Optional. The number of previous ticks over which to measure the actual 
 * frames / ticks per second.
 * @return {number} The actual frames / ticks per second. Depending on performance, this may differ
 * from the target frames per second.
 */
easel.Ticker.getMeasuredFPS = function(ticks) {
	if (easel.Ticker._times.length < 2) { return -1; }
	
	// by default, calculate fps for the past 1/2 second:
	if (ticks == null) { ticks = easel.Ticker.getFPS()>>1; }
	ticks = Math.min(easel.Ticker._times.length-1, ticks);
	return 1000/((easel.Ticker._times[0]-easel.Ticker._times[ticks])/ticks);
};

/**
 * While easel.Ticker is paused, pausable listeners are not ticked. See addListener for more information.
 * @static
 * @param {boolean} value Indicates whether to pause (true) or unpause (false) easel.Ticker.
 */
easel.Ticker.setPaused = function(value) {
	easel.Ticker._paused = value;
};

/**
 * Returns a boolean indicating whether easel.Ticker is currently paused, as set with setPaused.
 * @static
 * @return {boolean} Whether the easel.Ticker is currently paused.
 */
easel.Ticker.getPaused = function() {
	return easel.Ticker._paused;
};

/**
 * Returns the number of milliseconds that have elapsed since the first tick event listener was added to
 * easel.Ticker. For example, you could use this in a time synchronized animation to determine the exact amount of 
 * time that has elapsed.
 * @static
 * @param {boolean} pauseable Indicates whether to include time elapsed
 * while easel.Ticker was paused. If false only time elapsed while easel.Ticker is not paused will be returned.
 * If true, the value returned will be total time elapsed since the first tick event listener was added.
 * @return {number} Number of milliseconds that have elapsed since easel.Ticker was begun.
 */
easel.Ticker.getTime = function(pauseable) {
	return easel.Ticker._getTime() - easel.Ticker._startTime - (pauseable ? easel.Ticker._pausedTime : 0);
};

/**
 * Returns the number of ticks that have been broadcast by easel.Ticker.
 * @static
 * @param {boolean} pauseable Indicates whether to include ticks that would have been broadcast
 * while easel.Ticker was paused. If false only tick events broadcast while easel.Ticker is not paused will be returned.
 * If true, tick events that would have been broadcast while easel.Ticker was paused will be included in the return
 * value. The default value is false.
 * @return {number} of ticks that have been broadcast.
 */
easel.Ticker.getTicks = function(pauseable) {
	return  easel.Ticker._ticks - (pauseable ?easel.Ticker._pausedeasel.Tickers : 0);
};

// private static methods:
/**
 * @protected
 */
easel.Ticker._handleAF = function(timeStamp) {
	console.log(easel.Ticker._rafFunction);
	if (timeStamp - easel.Ticker._lastTime >= easel.Ticker._interval-1) {
		easel.Ticker._tick();
	}
	var f = window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame ||
				  window.oRequestAnimationFrame || window.msRequestAnimationFrame;
	f(easel.Ticker._handleAF, easel.Ticker.animationTarget);
};

/**
 * @protected
 */
easel.Ticker._handleTimeout = function() {
	easel.Ticker._tick();
	setTimeout(easel.Ticker._handleTimeout, easel.Ticker._interval);
};

/**
 * @protected
 */
easel.Ticker._tick = function() {
	easel.Ticker._ticks++;
	
	var time = easel.Ticker._getTime();
	var elapsedTime = time-easel.Ticker._lastTime;
	var paused = easel.Ticker._paused;
	
	if (paused) {
		easel.Ticker._pausedeasel.Tickers++;
		easel.Ticker._pausedTime += elapsedTime;
	}
	easel.Ticker._lastTime = time;
	
	var pauseable = easel.Ticker._pauseable;
	var listeners = easel.Ticker._listeners.slice();
	var l = listeners ? listeners.length : 0;
	for (var i=0; i<l; i++) {
		var p = pauseable[i];
		var listener = listeners[i];
		if (listener == null || (paused && p) || listener.tick == null) { continue; }
		listener.tick(elapsedTime);
	}
	
	easel.Ticker._tickTimes.unshift(easel.Ticker._getTime()-time);
	while (easel.Ticker._tickTimes.length > 100) { easel.Ticker._tickTimes.pop(); }
	
	easel.Ticker._times.unshift(time);
	while (easel.Ticker._times.length > 100) { easel.Ticker._times.pop(); }
};

/**
 * @protected
 */
easel.Ticker._getTime = function() {
	return new Date().getTime();
};
