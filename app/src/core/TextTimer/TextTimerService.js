angular.module('Reader')
	.factory('TextTimer', [
	'underscore', 
	'TextConsumer', 
	function(_, TextConsumer) {
		var TextTimer = {};

		TextTimer.defaultConfig = {
			'wpm': 200,
			'longWordLength': 8,
			'exceedingCharactersFactor': 0.05,
			'sentencePauseCharacters': ',:()@#',
			'sentencePauseFactor': 0.35,
			'sentenceBreakCharacters': '.!?;',
			'sentenceBreakFactor': 0.5,
			'nextLineFactor': 0.9
		};

		TextTimer.minute = 60000;

		TextTimer.calculateLongWord = function(word, config) {
			if(word.length > config.longWordLength) {
				var diff = word.length - config.longWordLength;
				return diff * config.exceedingCharactersFactor;
			}
			return 0;
		};

		TextTimer.calculateSentencePause = function(word, config) {
			var pauseRegex = TextConsumer.generateSplitterRegex(
				config.sentencePauseCharacters);

			if(word.search(pauseRegex) !== -1) {
				return config.sentencePauseFactor;
			}
			return 0;
		};

		TextTimer.calculateSentenceBreak = function(word, config) {
			var breakRegex = TextConsumer.generateSplitterRegex(
				config.sentenceBreakCharacters);

			if(word.search(breakRegex) !== -1) {
				return config.sentenceBreakFactor;
			}
			return 0;
		};

		TextTimer.calculate = function(word, config) {
			config = _.extend(TextTimer.defaultConfig, config);

			var factor = 1.0;
			if(word == TextConsumer.nextLine) {
				factor += config.nextLineFactor;
			} else {
				factor += TextTimer.calculateLongWord(word, config);
				factor += TextTimer.calculateSentencePause(word, config);
				factor += TextTimer.calculateSentenceBreak(word, config);
			}

			return (TextTimer.minute / config.wpm) * factor;
		};

		return TextTimer;
	}]);