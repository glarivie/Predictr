## Predictr
Web browsers input suggestive autocomplete (Chrome and Firefox extensions)

![demo predictr](https://github.com/hqro/predictr/blob/master/demo/demo.png)

HOST: localhost
PORT: 5000

/predict
GET
return JSON<Array> { word:  score:}


/learn
POST
send STR tout le doc
