var fs = require('fs');
var nlp = require('compromise');

module.exports.summarize = function (article) {
	return new Promise(function (resolve, reject) {
		fs.readFile('stopwords.txt', 'utf8', function (err, stopwords) {
			if (err) reject(err);

			var textInfo = nlp(article);
			var stopArr = stopwords.split('\r\n');
			var allTerms = textInfo.terms().out('array');

			//probably could refactor to filter && get frequencies all in one shot
			//but let's get it working first.
			var terms = allTerms.filter(function (term) {
				return stopArr.indexOf(term) === -1;
			});

			var frequencies = {};
			terms.forEach(function (term) {
				if (frequencies[term]) {
					frequencies[term]++;
				}
				else {
					frequencies[term] = 1;
				}
			});

			// each sentence has weight equal to the sum of
			// the frequency of each word in the sentence,
			// ignoring stopwords
			var weights = [];
			var sentenceData = textInfo.sentences();
			var sentences = sentenceData.out('array');
			sentences.forEach(function (sentence) {
				var weight = 0;
				var sentTerms = nlp(sentence).terms().out('array');
				sentTerms.forEach(function (sentTerm) {
					if (terms.indexOf(sentTerm) > -1) {
						weight += frequencies[sentTerm];
					}
				});
				weights.push(weight);
			});
			// now weights is an array of the 'importance' of each sentence
			// the highest entry in the array means the sentence at that index
			// is most important, and so on

			// this can also be done better. BUT.
			// now we know the weight of the most important sentences, so
			// we can take the top entries in the sorted weight array
			// and search for their weights in the unsorted
			// and display the sentences at those "heaviest" indices
			var weightSort = weights.slice().sort(function (a,b) {
				return b - a;
			});

			var result = '';
			for (var i = 0; i < 3; i++) {
				var weight = weightSort[i];
				//this needs to be improved too -- what if duplicate weights?
				var index = weights.indexOf(weight);
				result += sentenceData.data()[index].text;
				result += '\r\n';
			}

			resolve(result);
		});
	});
};
