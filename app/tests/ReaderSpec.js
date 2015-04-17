describe('Reader module specs', function() {
	beforeEach(module('Reader'));

	it('has a version', inject(['version', function(version) {
		expect(version).toBeTruthy();
		expect(_.isString(version)).toBe(true);
	}]));

	it('provides underscore', inject(['underscore', function(customUnderscore) {
		expect(customUnderscore).toEqual(window._);
	}]));
});