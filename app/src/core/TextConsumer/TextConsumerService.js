angular.module('Reader')
	.factory('TextConsumer', ['underscore', function(_) {
		var TextConsumer = {};

		TextConsumer.nextLine = '$NEXT_LINE$';

		TextConsumer.defaultConfig = {
			'longWordLength': 15,
			'splitCharacters': '-',
			'sentenceBreakCharacters': '.!?;'
		};

		TextConsumer.isLongWord = function(word, config) {
			if(!_.isNumber(config.longWordLength) || !_.isString(word)) {
				return false;
			}
			return config.longWordLength <= word.length;
		};

		TextConsumer.splitLongWord = function(word, config) {
			if(!TextConsumer.isLongWord(word, config)) {
				return [word];
			}
			var numberOfParts = parseInt(Math.ceil((word.length + 1.0) / config.longWordLength));
			var splitAmount = parseInt(Math.ceil(word.length * 1.0 / numberOfParts));
			var currentIndex = 0;
			var parts = [];
			while(numberOfParts > 0) {
				numberOfParts -= 1;
				var part = word.substring(currentIndex, splitAmount);
				if(numberOfParts > 0) {
					part += '-';
				}
				parts.push(part);
				currentIndex = splitAmount;
				splitAmount *= 2;
			}
			return parts;
		};

		TextConsumer.generateSplitterRegex = function(characters, flags) {
			var regex = '([';
			for(var i = 0; i < characters.length; i++) {
				regex += '\\' + characters.charAt(i);
			}
			regex += '])';
			return new RegExp(regex, flags);
		};

		TextConsumer.splitByCharacters = function(word, config) {
			var splitter = TextConsumer.generateSplitterRegex(
				config.splitCharacters);

			var parts = word.split(splitter);
			var joinedParts = [];

			if(parts.length == 0) {
				return parts;
			} else {
				for(var i = 0; i < parts.length; i += 2) {
					if(i+1 < parts.length) {
						joinedParts.push(parts[i] + parts[i+1]);
					} else {
						joinedParts.push(parts[i]);
					}
				}
				return joinedParts;
			}
		};

		TextConsumer.split = function(content, config) {
			config = _.extend(TextConsumer.defaultConfig, config);

			var split = [];

			var _assignWord = function(word) {
				_.each(TextConsumer.splitByCharacters(word, config), 
					function(part) {
						split = split.concat(TextConsumer.splitLongWord(part, 
							config));
					});

				var regex = TextConsumer.generateSplitterRegex(
					config.sentenceBreakCharacters);

				if(word.search(regex) !== -1) {
					split.push('');
				}
			};

			var _assignNextLine = function() {
				split.push(TextConsumer.nextLine);
			};

			var lines = content.split(/\r\n?|\n/);
			_.each(lines, function(line) {
				var words = line.split(/\s/);
				_.each(words, function(word) {
					if(word.length > 0) {
						_assignWord(word);
					}
				});
				_assignNextLine();
			});
			return split;
		};

		TextConsumer.Iterator = function(words) {	
			this.words = words;
			this.currentIndex = 0;

			this.hasNext = function() {
				return this.currentIndex < this.words.length;
			};

			this.next = function() {
				var word = this.words[this.currentIndex];
				this.currentIndex++;
				return word;
			};
		};

		return TextConsumer;
	}]);