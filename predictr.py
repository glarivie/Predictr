class markov():
    def __init__(self):
        self.ngrams = dict()

    def __update_grams(self, key, word):
        n = self.ngrams[key]['_n']
        if word not in self.ngrams[key]:
            self.ngrams[key][word] = 0
        for x in self.ngrams[key]:
            tmp = self.ngrams[key][x]
            self.ngrams[key][x] = (tmp * n + (1 if x == word else 0)) / (n + 1)
        self.ngrams[key]['_n'] = n + 1

    def learn(self, s):
        sentence = s.split(' ')
        for i in range(len(sentence) - 1):
            if sentence[i] in self.ngrams:
                self.__update_grams(sentence[i], sentence[i + 1])
            else:
                self.ngrams[sentence[i]] = {sentence[i + 1]: 1, '_n': 1}

    def predict(self, w):
        res = ('', 0)
        if w not in self.ngrams:
            return ''
        for x in self.ngrams[w]:
            if self.ngrams[w][x] > res[1] and x != '_n':
                res = (x, self.ngrams[w][x])
        return res[0]

    def show(self):
        print(self.ngrams)

if __name__ == '__main__':
    IA = markov()
    while True:
        line = input()
        if line.strip() == 'exit':
            print('done')
            exit()
        if line.strip() == 'show':
            print(IA.show())
            continue
        IA.learn(line.strip())
        print(IA.predict(line.strip().split(' ')[-1]))
