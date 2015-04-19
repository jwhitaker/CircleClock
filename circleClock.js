(function() {
	"use strict";

	function CircleClock(canvasElement) {
		var EDGE_RATIO = 0.05,
			SPACING_RATIO = 0.025,
			BAR_RATIO = 0.05;

		this.c = document.getElementById(canvasElement);
		this.ctx = this.c.getContext("2d");

		this.centreX = this.c.width / 2;
		this.centreY = this.c.height / 2;
		this.formattedWidth = this.c.width > this.c.height ? this.c.height : this.c.width;

		this.edgePadding = this.formattedWidth * EDGE_RATIO;
		this.spacingSize = this.formattedWidth * SPACING_RATIO;
		this.barSize = this.formattedWidth * BAR_RATIO;

		this.outerRadiusStart = (this.formattedWidth / 2) - this.edgePadding;

		this.circleAngle = 2 * Math.PI;
		this.startAngle = (3 * Math.PI) / 2;

		this.components = [];
		this.buildComponents();
	}

	CircleClock.prototype.buildComponents = function() {
		this.createComponent("#ff3019", function(date) {
			return 60
		}, function(date) {
			return date.getSeconds() + (date.getMilliseconds() / 1000);
		});

		this.createComponent("#99daff", function(date) {
			return 60;
		}, function(date) {
			return date.getMinutes() + (date.getSeconds() / 60);
		});

		this.createComponent("#f1e767", function(date) {
			return 12;
		}, function(date) {
			var hour = date.getHours() >= 12 ? date.getHours() - 12 : date.getHours();
			hour = hour + (date.getMinutes() / 60);

			return hour;
		});

		this.createComponent("#fac695", function(date) {
			var lastDayOfMonth = new Date(date.getYear(), date.getMonth() + 1, 0);
			return lastDayOfMonth.getDate();
		}, function(date) {
			return date.getDate();
		});

		this.createComponent("#c9de96", function(date) {
			return 11;
		}, function(date) {
			return date.getMonth();
		});
	}

	CircleClock.prototype.createComponent = function(colour1, maxValue, currentValue) {
		var outerRad,
			innerRad;

		if (this.components.length === 0) {
			outerRad = this.outerRadiusStart;
		} else {
			outerRad = this.components[this.components.length - 1].innerRadius - this.spacingSize;
		}

		innerRad = outerRad - this.barSize;

		this.components.push({
			outerRadius: outerRad,
			innerRadius: innerRad,
			colour1: colour1,
			maxValue: maxValue,
			currentValue: currentValue
		})
	}

	CircleClock.prototype.drawArc = function(outerRadius, innerRadius, startAngle, endAngle, colour1) {
		this.ctx.beginPath();
		this.ctx.arc(this.centreX, this.centreY, outerRadius, startAngle, endAngle, false);
		this.ctx.arc(this.centreX, this.centreY, innerRadius, endAngle, startAngle, true);
		this.ctx.closePath();

		this.ctx.fillStyle = colour1;
		this.ctx.fill();
	}

	CircleClock.prototype.drawTimeRemainingArc = function(outerRadius, innerRadius) {
		this.drawArc(outerRadius - (this.spacingSize / 2), innerRadius + (this.spacingSize / 2), 0, this.circleAngle, "#eeeeee");
	}

	CircleClock.prototype.drawTimeComponent = function(date, component) {
		var currentValue = component.currentValue(date),
			maxValue = component.maxValue(date),
			timeAngle = this.circleAngle * (currentValue / maxValue),
			endAngle = this.startAngle + timeAngle;

		this.drawTimeRemainingArc(component.outerRadius, component.innerRadius);

		if (currentValue > 0) {
			this.drawArc(component.outerRadius, component.innerRadius, this.startAngle, endAngle, component.colour1);
		}
	}

	CircleClock.prototype.drawTime = function(date) {
		this.ctx.clearRect(0, 0, this.c.width, this.c.height);

		for(var i = 0; i < this.components.length; i++) {
			var component = this.components[i];

			this.drawTimeComponent(date, component);
		}
	}

	CircleClock.prototype.start = function() {
		var self = this,
			timeout = setInterval(function() {
				self.drawTime(new Date());
			}, 1);
	}

	window.CircleClock = CircleClock;
})();