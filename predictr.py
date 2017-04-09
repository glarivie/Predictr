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

    def __learn_sentence(self, tokens: List[str]):
        """ Learn a full token sentence.

        Args:
            tokens: list of token to train
        """
        tokens = tokens[:-self.deep]
        base = self.ngrams
        for token in tokens:
            self.__update_gram(base, token)
            base = base[token]

    def learn(self, text: str):
        """ Learn the text corpus.

        Args:
            text: the learning corpus
        """
        token_sentences = self.__tokenize(text)
        for token_sentence in token_sentences:
            self.__learn_sentence(token_sentence)
            print(token_sentence)


@app.route('/learn', methods = ['POST'])
def learn():
    IA = learn.IA
    text = request.form['body']
    IA.learn(text)
    return '', 200


if __name__ == '__main__':
    IA = Markov(3)
    learn.IA = IA
    app.run('0.0.0.0', 5000)
    exit(os.EX_OK)
    with open(sys.argv[1]) as f:
        IA.learn(f.read())
