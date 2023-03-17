# Explorer of the Tractatus Logico-Philosophicus 

A convenient representation of Ludwig Wittgenstein's logical and philosophical treatise. There is simple search engine, search field selection. The choice of one of three languages is presented: German, English, Russian.

The JSON representation is taken [here](https://github.com/Geurt/tractatus/blob/master/data/TLP.json) and expanded by adding the Russian language.

For example, to search for information in paragraphs `5.01, 5.02, 5.03` it is possible to use `5.0(1 2 3)` `5.0(1/2/3)` `5.0(1-3)` `5.0(1-2 3)`, `1, 2, 3, 4, 5, 6, 7 <=> (1-7).`

The search query has a form similar to a simple logical expression:
```
fact {and} proposition {and not} ( is {or} that )
```
To check the match of the expression with the text of the paragraph, you need to put false in the expression instead of search tokens if there is no token in the text, otherwise true, and calculate the expression.
Some like: `1 AND 0 AND NOT ( 0 OR 1 )` or just `1 * 0 * !(0 + 1)`

Try [here](https://mihahanya.github.io/TLP-explorer/)!
