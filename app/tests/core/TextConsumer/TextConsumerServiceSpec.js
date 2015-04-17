describe('TextConsumerService specs', function() {
	var TextConsumer;

	beforeEach(module('Reader'));

	beforeEach(inject(['TextConsumer', function(_TextConsumer) {
		TextConsumer = _TextConsumer;
	}]));

	it('exists', function() {
		expect(TextConsumer).toBeTruthy();
	});

	it('has a default config hash', function() {
		expect(_.isObject(TextConsumer.defaultConfig)).toBe(true);
	});

	describe('is long word', function() {
		it('returns true for words with equal or greater length', function() {
			expect(TextConsumer.isLongWord('aaa', {longWordLength: 3}))
				.toBe(true);

			expect(TextConsumer.isLongWord('aaaa', {longWordLength: 3}))
				.toBe(true);
		});

		it('returns false for words smaller than the length', function() {
			expect(TextConsumer.isLongWord('aa', {longWordLength: 3}))
				.toBe(false);

			expect(TextConsumer.isLongWord('a', {longWordLength: 3}))
				.toBe(false);
		});

		it('returns false for non string or null values', function() {
			expect(TextConsumer.isLongWord('', {longWordLength: 3}))
				.toBe(false);

			expect(TextConsumer.isLongWord(123, {longWordLength: 3}))
				.toBe(false);

			expect(TextConsumer.isLongWord(null, {longWordLength: 3}))
				.toBe(false);
		});
	});

	describe('splitting long word', function() {
		it('split short word', function() {
			var split = TextConsumer.splitLongWord('aaa', {longWordLength: 4});
			expect(split).toEqual(['aaa']);
		});

		it('split word in two parts', function() {
			var split = TextConsumer.splitLongWord('aaaa', {longWordLength: 4});
			expect(split).toEqual(['aa-', 'aa']);
		});

		it('split word in multiple parts', function() {
			var split = TextConsumer.splitLongWord('aaaaaaaa', 
				{longWordLength: 4});

			expect(split).toEqual(['aaa-', 'aaa-', 'aa']);
		});
	});

	describe('splitter regex', function() {
		it('generate splitter for single characters', function() {
			var regex = TextConsumer.generateSplitterRegex('-');
			expect(regex.toString()).toEqual('/([\\-])/');
		});

		it('generate splitter for multiple characters', function() {
			var regex = TextConsumer.generateSplitterRegex('-*:');
			expect(regex.toString()).toEqual('/([\\-\\*\\:])/');
		});
	});

	describe('split by characters', function() {
		it('splits the word by the specified characters', function() {
			var split = TextConsumer.splitByCharacters('aa-aa', 
				{splitCharacters: '-'});
			expect(split).toEqual(['aa-', 'aa']);
		});

		it('splits the word by multiple characters', function() {
			var split = TextConsumer.splitByCharacters('aa-a/a', 
				{splitCharacters: '-/'});
			expect(split).toEqual(['aa-', 'a/', 'a']);
		});
	});

	describe('splitting text', function() {
		var config;

		beforeEach(function() {
			config = {};
		});

		it('splits on empty space', function() {
			var split = TextConsumer.split('word1 word2', config);
			expect(split).toEqual(['word1', 'word2', TextConsumer.nextLine]);
		});

		it('ignores empty words', function() {
			var split = TextConsumer.split('  word1  word2   ', config);
			expect(split).toEqual(['word1', 'word2', TextConsumer.nextLine]);
		});

		it('splits long words', function() {
			config.longWordLength = 4;
			var split = TextConsumer.split('aaaa', config);
			expect(split).toEqual(['aa-', 'aa', TextConsumer.nextLine]);
		});

		it('split long words in the middle of a sentence', function() {
			config.longWordLength = 4;
			var split = TextConsumer.split('bb aaaaa ccc', config);
			expect(split).toEqual(['bb', 'aaa-', 'aa', 'ccc', 
				TextConsumer.nextLine]);
		});

		it('split by characters', function() {
			config.splitCharacters = '-';
			var split = TextConsumer.split('a-aaa', config);
			expect(split).toEqual(['a-', 'aaa', TextConsumer.nextLine]);
		});

		it('split by characters in the middle of a sentence', function() {
			config.splitCharacters = '-';
			var split = TextConsumer.split('bb aa-a cc');
			expect(split).toEqual(['bb', 'aa-', 'a', 'cc', 
				TextConsumer.nextLine]);
		});

		it('adds an empty word after a sentence break', function() {
			config.sentenceBreakCharacters = '.!?;';
			var split = TextConsumer.split('aaa bb. cc');
			expect(split).toEqual(['aaa', 'bb.', '', 'cc', 
				TextConsumer.nextLine]);
		});

		it('doesnt add empty word in the middle of a splitted word', 
			function() {
			config.sentenceBreakCharacters = '.!?;';
			var split = TextConsumer.split('aaa.aa bb cc');
			expect(split).toEqual(['aaa.aa', '', 'bb', 'cc', 
				TextConsumer.nextLine]);
		});
	});

	describe('Iterator', function() {
		it('assigns words as instance variable', function() {
			var iterator = new TextConsumer.Iterator(['a', 'b']);
			expect(iterator.words).toEqual(['a', 'b']);
		});

		it('has a current index', function() {
			var iterator = new TextConsumer.Iterator(['a', 'b']);
			expect(iterator.currentIndex).toEqual(0);
		});

		describe('hasNext', function() {
			it('returns true if the next index still has a word', function() {
				var iterator = new TextConsumer.Iterator(['1', '2']);
				iterator.currentIndex = 0;
				expect(iterator.hasNext()).toBe(true);
				iterator.currentIndex = 1;
				expect(iterator.hasNext()).toBe(true);
			});

			it('returns false if the next index doesnt have a word', 
				function() {
				var iterator = new TextConsumer.Iterator(['1', '2']);
				iterator.currentIndex = 2
				expect(iterator.hasNext()).toBe(false);
			});
		});

		describe('next', function() {
			it('return the word at the current index', function() {
				var iterator = new TextConsumer.Iterator(['1', '2']);
				expect(iterator.next()).toEqual('1');
				expect(iterator.next()).toEqual('2');
			});

			it('increments the current index', function() {
				var iterator = new TextConsumer.Iterator(['1', '2']);
				expect(iterator.currentIndex).toBe(0);
				iterator.next();
				expect(iterator.currentIndex).toBe(1);
				iterator.next();
				expect(iterator.currentIndex).toBe(2);
			});

			it('returns false on hasNext when reaching the last word', 
				function() {
				var iterator = new TextConsumer.Iterator(
					TextConsumer.split("word1 word2"));

				expect(iterator.hasNext()).toBe(true);
				expect(iterator.next()).toEqual("word1");
				expect(iterator.hasNext()).toBe(true);
				expect(iterator.next()).toEqual("word2");
				expect(iterator.hasNext()).toBe(true);
				expect(iterator.next()).toEqual(TextConsumer.nextLine);
				expect(iterator.hasNext()).toBe(false);
			});
		});
	});
});