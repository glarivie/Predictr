# Les trigrams seront enregistres en memoire de la maniere suivante
# 1 gram { 'w': 2-gram, '_n': nb_bigram, '_p': proba }
#    ---> 2 gram { 'w': 3-gram, '_n': nb_trigram, '_p': proba }
#            ---> 3 gram { '_p': proba }

# from flask import Flask
import json

# app = Flask(__name__)

class markov():
    """ markov is the class engine for word prediction.

    Attribute:
        ngrams: tree of the ngrams
        deep: the depth of the tree
    """

    def __init__(self, deep = 0):
         self.ngrams = { '_n': 0 } # contient les trigrams
         self.deep = deep

    def __update_gram(self, base, word):
        n = base['_n']
        if word not in base:
            base[word] = { '_p': 0, '_n': 0 }
        for x in base:
            if x == '_p' or x == '_n':
                continue
            tmp = base[x]['_p']
            base[x]['_p'] = (tmp * n + (1 if x == word else 0)) / (n + 1)
        base['_n'] += 1

    def __iterate(self, base, sentence, i, n):
        while n > i:
            n -= 1
        while n > 0:
            base = base[sentence[i - n]]
            n -= 1
        return (base)

    def __deep_learn(self, base, sentence, i, n):
        tmp_base = self.__iterate(base, sentence, i, n)
        self.__update_gram(tmp_base, sentence[i])
        if n > 0:
            self.__deep_learn(base, sentence, i, n - 1)

    def learn(self, s):
        sentence = s.split(' ')
        for i in range(len(sentence)):
            self.__deep_learn(self.ngrams, sentence, i, self.deep)

    def predict(self, sentence, i):
        res = ('', 0)
        base = self.__iterate(self.ngrams, sentence, i, self.deep - 1)
        print(base)
        base = base[sentence[i]]
        tuple_proba = lambda x: (x, base[x]['_p'])
        res = sorted(map(tuple_proba, base.keys() ^ {'_p', '_n'}), key = lambda x: x[1], reverse = True)
        return res[:5]
        for x in base:
            if x not in ['_p', '_n'] and base[x]['_p'] > res[1]:
                res = (x, base[x]['_p'])
        return res[:5]

    def show(self):
        print(self.ngrams)

# @app.route('/')
# def preditr():
#     markov = predictr.__markov


if __name__ == '__main__':
    IA = markov(2)
#    predictr.__markov = IA
    while True:
        line = input().strip()
        if line.strip() == 'exit':
            print('done')
            exit()
        if line.strip() == 'show':
            print(IA.show())
            continue
        IA.learn(line)
        tab = line.split(' ')
        print(IA.predict(tab, len(tab) - 1))
