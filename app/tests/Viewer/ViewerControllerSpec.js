describe('ViewerController specs', function() {
	var ViewerController, $timeout;
	beforeEach(module('Reader'));

	beforeEach(inject(['$controller', '$timeout', '$rootScope', 
		function($controller, _$timeout, $rootScope) {
		ViewerController = $controller('ViewerController', 
			{$scope: $rootScope});
		$timeout = _$timeout;
	}]));

	it('exists', function() {
		expect(ViewerController).toBeTruthy();
	});

	it('has a current word', function() {
		expect(_.isString(ViewerController.currentWord)).toBe(true);
	});

	describe('play', function() {
		it('updates internal state', function() {
			ViewerController.play('word1 word2');
			expect(ViewerController.playing).toBe(true);
			expect(ViewerController.currentWord).toEqual('');
			expect(ViewerController.timeoutPromise).toBeTruthy();
		});

		it('updates current word after timeout', function() {
			ViewerController.play('word1 word2');
			$timeout.flush();
			expect(ViewerController.currentWord).toEqual('word1');
			expect(ViewerController.playing).toBe(true);
		});

		it('reads until there is no more words', inject(function(TextConsumer) {
			ViewerController.play('word1 word2');
			$timeout.flush();
			expect(ViewerController.currentWord).toEqual('word1');
			expect(ViewerController.playing).toBe(true);
			$timeout.flush();
			expect(ViewerController.currentWord).toEqual('word2');
			expect(ViewerController.playing).toBe(true);
			$timeout.flush();
			expect(ViewerController.currentWord).toEqual(TextConsumer.nextLine);
			expect(ViewerController.playing).toBe(true);
			$timeout.flush();
			expect(ViewerController.playing).toBe(false);
			expect(ViewerController.currentWord).toEqual('');
		}));
	});

	describe('pause and resume', function() {
		it('updates internal state on pause', function() {
			ViewerController.play('word1 word2');
			$timeout.flush();
			expect(ViewerController.currentWord).toEqual('word1');
			ViewerController.pause();
			expect(ViewerController.playing).toBe(false);
		});

		it('clears reading loop timeout', function() {
			ViewerController.play('word1 word2');
			$timeout.flush();
			expect(ViewerController.currentWord).toEqual('word1');
			ViewerController.pause();
			expect(function() {$timeout.flush();}).toThrow();
			expect(ViewerController.currentWord).toEqual('word1');
		});

		it('resume with timeout', function() {
			ViewerController.play('word1 word2');
			$timeout.flush();
			expect(ViewerController.currentWord).toEqual('word1');
			ViewerController.pause();
			expect(function() {$timeout.flush();}).toThrow();
			ViewerController.resume();
			$timeout.flush();
			expect(ViewerController.currentWord).toEqual('word2');
		});

		it('updates internal state on resume', function() {
			ViewerController.play('word1 word2');
			$timeout.flush();
			expect(ViewerController.currentWord).toEqual('word1');
			ViewerController.pause();
			expect(function() {$timeout.flush();}).toThrow();
			ViewerController.resume();
			expect(ViewerController.playing).toBe(true);
		});
	});
});