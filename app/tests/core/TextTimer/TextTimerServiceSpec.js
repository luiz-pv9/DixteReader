describe('TextTimer service specs', function() {
	var TextTimer;
	beforeEach(module('Reader'));

	beforeEach(inject(['TextTimer', function(_TextTimer) {
		TextTimer = _TextTimer;
	}]));

	it('exists', function() {
		expect(TextTimer).toBeTruthy();
	});

	it('has a default config', function() {
		expect(_.isObject(TextTimer.defaultConfig)).toBe(true);
	});

	it('has a minute time in milliseconds', function() {
		expect(TextTimer.minute).toEqual(60000);
	});

	describe('Time for word', function() {
		var config;
		beforeEach(function() {
			config = {
			};
		});

		it('time for a short word', function() {
			expect(TextTimer.calculate('aaa', config)).toEqual(
				TextTimer.minute / 200);
		});

		it('time for a short word with different wpm', function() {
			config.wpm = 250;
			expect(TextTimer.calculate('aaa', config)).toEqual(
				TextTimer.minute / 250);
		});

		it('time for a long word', function() {
			config.longWordLength = 4;
			config.exceedingCharactersFactor = 0.05;
			expect(TextTimer.calculate('1234', config)).toEqual(
				TextTimer.calculate('123', config));

			expect(TextTimer.calculate('12345', config)).toBeGreaterThan(
				TextTimer.calculate('1234', config));

			expect(TextTimer.calculate('123456', config)).toBeGreaterThan(
				TextTimer.calculate('12345', config));

			expect(TextTimer.calculate('abcde', config)).toEqual(
				TextTimer.calculate('12345', config));
		});

		it('time for word with sentence pause', function() {
			config.sentencePauseCharacters = ',:()@#';
			config.sentencePauseFactor = 0.35;

			expect(TextTimer.calculate('afo,')).toBeGreaterThan(
				TextTimer.calculate('afo'));

			expect(TextTimer.calculate('aba@aba')).toBeGreaterThan(
				TextTimer.calculate('abaaba'));

			expect(TextTimer.calculate('aba@aba,')).not.toBeGreaterThan(
				TextTimer.calculate('aba@aba'));
		});

		it('time for sentence break', function() {
			config.sentenceBreakCharacters = '.!?;';
			config.sentenceBreakFactor = 0.5;
			expect(TextTimer.calculate('afo.')).toBeGreaterThan(
				TextTimer.calculate('afo'));

			expect(TextTimer.calculate('afo.')).toBeGreaterThan(
				TextTimer.calculate('afo,'));

			expect(TextTimer.calculate('a,fo.')).toBeGreaterThan(
				TextTimer.calculate('afo.'));

			expect(TextTimer.calculate('afo..')).not.toBeGreaterThan(
				TextTimer.calculate('afo.'));
		});

		it('time for next line', inject(function(TextConsumer) {
			config.nextLineFactor = 0.9;
			expect(TextTimer.calculate(TextConsumer.nextLine)).toEqual(
				(TextTimer.minute / 200) * 1.9);
		}));
	});
});