angular.module('Reader')
	.controller('ViewerController', [
	'$scope',
	'$timeout',
	'underscore', 
	'TextTimer', 
	'TextConsumer',
	function($scope, $timeout, _, TextTimer, TextConsumer) {

		$scope.playing = false;
		$scope.timeoutPromise = null;
		$scope.currentWord = '';
		$scope.iterator = null;
		$scope.config = {};
		$scope.timerConfig = {};

		$scope.wpm = '250 WPM';
		$scope.wpms = [];
		for(var i = 50; i < 800; i += 50) {
			$scope.wpms.push(i + " WPM");
		}

		$scope.$watch('wpm', function(val) {
			if(val) {
				var num = val.replace(/[^\d]/g, '');
				$scope.timerConfig.wpm = +num;
			}
		});

		// Milliseconds
		$scope.readingTimeOffset = 500;

		var finishReading = function() {
			$scope.playing = false;
			$scope.timeoutPromise = null;
			$scope.currentWord = '';
			$scope.iterator = null;

			if($scope.minimizeOnFinish) {
				window.win.minimize();
			}
		};

		var readingLoop = function() {
			if($scope.iterator && $scope.iterator.hasNext()) {
				$scope.$apply(function() {
					$scope.currentWord = $scope.iterator.next();
					$scope.timeoutPromise = $timeout(readingLoop,
						TextTimer.calculate($scope.currentWord, $scope.timerConfig));
				});
			} else {
				$scope.$apply(function() {
					finishReading();
				});
			}
		};

		$scope.play = function(content) {
			if($scope.timeoutPromise != null) {
				$timeout.cancel($scope.timeoutPromise);
			}
			$scope.playing = true;
			$scope.currentWord = '';
			$scope.iterator = new TextConsumer.Iterator(
				TextConsumer.split(content, $scope.config));
			$scope.timeoutPromise = $timeout(readingLoop, $scope.readingTimeOffset);
		};

		$scope.togglePlay = function() {
			if($scope.playing) {
				$scope.pause();
			} else {
				if($scope.iterator === null) {
					$scope.playFromClipboard();
				} else {
					$scope.resume();
				}
			}
		};

		$scope.playFromClipboard = function() {
			var content = window.clipboard.get('text');
			$scope.play(content);
		};

		// This function is called with double Ctrl-C
		window.showAndReadFromClipboard = function() {
			window.win.setPosition('center');
			window.win.focus();
			$scope.playFromClipboard();
		};

		window.tryPauseReading = function() {
			$scope.$apply(function() {
				$scope.togglePlay();
			});
		};

		$scope.pause = function() {
			$scope.playing = false;
			$timeout.cancel($scope.timeoutPromise);
		};

		$scope.resume = function() {
			$scope.playing = true;
			$scope.timeoutPromise = $timeout(readingLoop, $scope.readingTimeOffset);
		};

		$scope.increaseFont = function() {
			var fontSize = $('.content div').css('font-size');
			fontSize = +(fontSize.replace(/[^\d]/g, ''));
			fontSize += 2;
			$('.content div').css('font-size', fontSize + 'px');
		};

		$scope.decreaseFont = function() {
			var fontSize = $('.content div').css('font-size');
			fontSize = +(fontSize.replace(/[^\d]/g, ''));
			fontSize -= 2;
			$('.content div').css('font-size', fontSize + 'px');
		};

		return $scope;
	}]);