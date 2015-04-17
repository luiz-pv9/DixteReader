describe('Viewer directive specs', function() {
	beforeEach(module('Reader'));
	var elm, scope;

	beforeEach(inject(['$compile', '$rootScope', 
		function($compile, $rootScope) {
			scope = $rootScope;
			elm = angular.element('<viewer word="word"></viewer>');
			$compile(elm)(scope);
			scope.$digest();
	}]));

	it('has an isolated scope', function() {
		expect(elm.isolateScope()).toBeTruthy();
	});

	describe('dom elements', function() {
		it('has a top border', function() {
			expect(elm.find('div.top-border').length).toBe(1);
		});

		it('has a bottom border', function() {
			expect(elm.find('div.bottom-border').length).toBe(1);
		});

		it('has a top indicator', function() {
			expect(elm.find('div.top-indicator').length).toBe(1);
		});

		it('has a bottom indicator', function() {
			expect(elm.find('div.bottom-indicator').length).toBe(1);
		});

		it('has a content div', function() {
			expect(elm.find('div.content').length).toBe(1);
		});

		it('has a before-red div inside content', function() {
			expect(elm.find('div.content').find('div.before-red').length)
				.toBe(1);
		});

		it('has a red div inside content', function() {
			expect(elm.find('div.content').find('div.red').length)
				.toBe(1);
		});

		it('has an after-red div inside content', function() {
			expect(elm.find('div.content').find('div.after-red').length)
				.toBe(1);
		});
	});

	describe('finding the red part of the word', function() {
		it('red point of single character words', function() {
			scope.word = 'a';
			elm.scope().$apply();
			expect(elm.isolateScope().beforeRed).toEqual('');
			expect(elm.isolateScope().red).toEqual('a');
			expect(elm.isolateScope().afterRed).toEqual('');
		});

		it('red point of two characters words', function() {
			scope.word = 'ab';
			elm.scope().$apply();
			expect(elm.isolateScope().beforeRed).toEqual('a');
			expect(elm.isolateScope().red).toEqual('b');
			expect(elm.isolateScope().afterRed).toEqual('');
		});

		it('red point of three characters words', function() {
			scope.word = 'abc';
			elm.scope().$apply();
			expect(elm.isolateScope().beforeRed).toEqual('a');
			expect(elm.isolateScope().red).toEqual('b');
			expect(elm.isolateScope().afterRed).toEqual('c');
		});

		it('red point of more than three characters words', function() {
			scope.word = 'abcd';
			elm.scope().$apply();
			expect(elm.isolateScope().beforeRed).toEqual('ab');
			expect(elm.isolateScope().red).toEqual('c');
			expect(elm.isolateScope().afterRed).toEqual('d');

			scope.word = 'abcdef';
			elm.scope().$apply();
			expect(elm.isolateScope().beforeRed).toEqual('ab');
			expect(elm.isolateScope().red).toEqual('c');
			expect(elm.isolateScope().afterRed).toEqual('def');
		});
	});
});