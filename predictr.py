from typing import Union, Dict, List, Any
from flask_cors import CORS, cross_origin
from flask import Flask, request
import json
import sys
import re
import os

app = Flask(__name__)
CORS(app)

def foreach(fn, elems: Any):
    for elem in elems:
        fn(elem)

def exists(item: Any):
    return item

Ngram = int #Dict[str, Union[str, float, Dict[str, Union[str, float]]]]

class Markov():
    """ markov is the class engine for word prediction.

    the ngrams are stored in hashmap in wich we can navigate in order
    to predict the next word. The two main purpose of this class is to finish
    the current word with the 3 highest likely words and predict the next word.

    Attribute:
        ngrams: tree of the ngrams
        deep: the depth of the tree
    """

    def __init__(self, deep = 0):
        """ Constructor """
        self.ngrams = { '_n': 0 }
        self.deep = deep

    def __update_gram(self, base: Ngram, word: str):
        """ Update the gram.

        Args:
            base: the reference to the subtree to update
            word: the word to learn
        """
        n = base['_n']
        if word not in base:
            base[word] = { '_p': 0, '_n': 0 }
        # __update change the probabilty for all the words with inc the good word then normalize
        def __update(x): base[x]['_p'] = (base[x]['_p'] * n + (1 if x == word else 0)) / (n + 1)
        foreach(__update, base.keys() - {'_p', '_n'})
        base['_n'] += 1

    def __clean(self, word: str) -> str:
        """ Clean a word from ponctuation.

        Args:
            word: the word to treat

        Returns:
            the cleanned word
        """
        ponctuations = {',', '.', ':', ';'}
        for ponctuation in ponctuations:
            if word.startswith(ponctuation):
                word = word[1:]
            if word.endswith(ponctuation):
                word = word[:-1]
        return word

    def __tokenize(self, text: str) -> List[str]:
        """ Tokenize the corpus.

        Args:
            text: the corpus to tokenize.

        Returns:
            tokenized corpus.
        """
        sentences = re.split('\. |: |; ', text.replace('\n', ' '))
        tokens = [ list(filter(exists, map(self.__clean, sentence.split(' ')))) for sentence in sentences ]
        return list(filter(exists, tokens))

    def __find_gram(self, tokens: List[str]):
        """ Find the gram.
        """
        tokens = tokens[-(self.deep - 1):]
        print(tokens)
        base = self.ngrams
        for index, token in enumerate(tokens):
            if token not in base.keys():
                return self.__find_gram(tokens[index + 1:])
            base = base[token]
        return base


    def __learn_sentence(self, tokens: List[str]):
        """ Learn a full token sentence.

        Args:
            tokens: list of token to train
        """
        for up in range(1, self.deep + 1):
            for index in range(len(tokens) - up + 1):
                tmp_tokens = tokens[index:index + up]
                print(tmp_tokens)
                if not tmp_tokens:
                    continue
                base = self.ngrams
                for token in tmp_tokens[:-1]:
                    print('skip:', token)
                    base = base[token]
                print('up:', tmp_tokens[-1])
                self.__update_gram(base, tmp_tokens[-1])

    def learn(self, text: str):
        """ Learn the text corpus.

        Args:
            text: the learning corpus
        """
        token_sentences = self.__tokenize(text)
        for token_sentence in token_sentences:
            self.__learn_sentence(token_sentence)
            print(token_sentence)
        print(self.ngrams)

    def predict(self, text: str):
        token_sentences = self.__tokenize(text)
        token_sentence = token_sentences[-1]
        base = self.__find_gram(token_sentence)
        print(token_sentence[-1])
        print(base)
        tuple_proba = lambda x: (x, base[x]['_p'])
        res = sorted(map(tuple_proba, base.keys() - {'_n', '_p'}), key = lambda x: x[1], reverse = True)
        return [ word for word, proba in res[:3] ]


@app.route('/learn', methods = ['POST'])
def learn():
    print('form:', request.form)
    IA = learn.IA
    text = request.form['body']
    IA.learn(text)
    return '', 200


@app.route('/predict', methods = ['GET'])
def predict():
    IA = predict.IA
    print(request.args)
    text = request.args.get('body')
    if not text:
        return '', 418
    res = IA.predict(text)
    return json.dumps(res), 200


if __name__ == '__main__':
    IA = Markov(3)
    if len(sys.argv) > 2:
        with open(sys.argv[1]) as f:
            IA.learn(f.read())
    learn.IA = IA
    predict.IA = IA
    app.run('0.0.0.0', 5000)
    exit(os.EX_OK)
