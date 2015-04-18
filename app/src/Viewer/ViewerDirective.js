angular.module('Reader')
	.directive('viewer', [
	'underscore', 
	'TextConsumer', 
	function(_, TextConsumer) {
		var template = [
			'<div class="viewer-area">',
				'<div class="top-border"></div>',
				'<div class="top-indicator"></div>',
				'<div class="content">',
					'<div class="before-red"></div>',
					'<div class="red"></div>',
					'<div class="after-red"></div>',
				'</div>',
				'<div class="bottom-indicator"></div>',
				'<div class="bottom-border"></div>',
			'</div>'
		].join('');

		return {
			restrict: 'AE',
			scope: {
				word: '='
			},
			template: template,
			link: function(scope, elm, attrs) {

				var $beforeRed = elm.find('.before-red');
				var $red = elm.find('.red');
				var $afterRed = elm.find('.after-red');

				$(window).resize(function() {
					var windowHeight = $(window).height();
					var toolbarHeight = $('.toolbar').height();
					elm.find('.viewer-area').css('height', windowHeight - toolbarHeight - 60 + "px");
				});

				scope.clearWordParts = function() {
					scope.beforeRed = '';
					scope.red = '';
					scope.afterRed = '';
					$beforeRed.html('&nbsp;');
					$red.html('');
					$afterRed.html('');
				};

				scope.clearWordParts();

				var adjustToWindowSize = function() {
					var width = elm.find('.content').width();
					scope.middle = width / 4;
					elm.find('.top-border').css('height', '40px');
					elm.find('.top-indicator').css('margin-left', scope.middle);
					elm.find('.bottom-indicator').css('margin-left', scope.middle);
				};

				var adjustContentPositions = function() {
					$beforeRed.html(scope.beforeRed || '&nbsp;');
					$red.html(scope.red);
					$afterRed.html(scope.afterRed);

					var redWidth = $red.width();
					$beforeRed.css('margin-left', scope.middle - $beforeRed.width() - (redWidth/2));
				};

				scope.$watch('word', function() {
					scope.clearWordParts();	
					if(scope.word && scope.word.length) {
						if(scope.word == TextConsumer.nextLine) {
							scope.red = '~~~';
						} else {
							if(scope.word.length == 1) {
								scope.red = scope.word;
							} else if(scope.word.length == 2) {
								scope.beforeRed = scope.word.charAt(0);
								scope.red = scope.word.charAt(1);
							} else if(scope.word.length == 3) {
								scope.beforeRed = scope.word.charAt(0);
								scope.red = scope.word.charAt(1);
								scope.afterRed = scope.word.charAt(2);
							} else {
								scope.beforeRed = scope.word.substring(0, 2);
								scope.red = scope.word.charAt(2);
								scope.afterRed = scope.word.substring(3, 
									scope.word.length);
							}
						}
						adjustToWindowSize();
						adjustContentPositions();
					}
				});
			}
		};
	}]);