const _ = require('lodash');
const ngrams = { _count: 0 };
const deep = 2;

const updateGram = (base, word) => {
	const n = base._count;
	if (!_.has(base, word)) {
		base[word] = { _probability: 0, _count: 0 };
	}
	for (let key of Object.keys(base)) {
		if (_.includes(['_probability', '_count'], key)) continue;
		const tmp = base[key]._probability;
		base[key]._probability = (tmp * n + (key === word ? 1 : 0)) / (n + 1);
	}
	base._count++;
};

const iterate = (base, sentence, index, number) => {
	if (number > index) number = index;
	while (number) {
		base = base[sentence[index - number]];
		number--;
	}
	return (base);
};

const deepLearn = (base, sentence, index, number) => {
	if (number > index) number = index;
	const tmp = iterate(base, sentence, index, number);
	updateGram(tmp, sentence[index]);
	if (number) deepLearn(base, sentence, index, number - 1);
};

const learn = str => {
	const sentence = str.split(' ');
	_.times(sentence.length, index => {
		deepLearn(ngrams, sentence, index, deep);
	});
};

const predict = (sentence) => {
	const index = sentence.length - 1;
	let res = ['', 0];
	const base = iterate(ngrams, sentence, index, deep - 1)[sentence[index]];
	for (let key of Object.keys(base)) {
		if (!_.includes(['_probability', '_count'], key) && base[key]._probability > res[1]) {
			res = [key, base[key]._probability];
		}
	}
	return res[0];
};

(() => {
	const test = 'a b c d';
	const predTo = 'a b c';
	const test2 = 'a b c e';
	const test3 = 'a b c e';
	const predTo2 = 'a b c';

	learn(test);
	if ('d' === predict(predTo.split(' '))) {
		console.log('test succesful');
	}
	learn(test2);
	learn(test3);
	if ('e' === predict(predTo.split(' '))) {
		console.log('test succesful');
	}
})();
