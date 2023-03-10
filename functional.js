

function to_par_number(str) {
	var number = str[0] + '.'
	if (str.length > 1) number += str.slice(1) + '. '
	else number += ' '

	return number
}


function tree_to_html(tree, language) {
	var res = '';

	var key, count = 0;
	for (key in tree.children) {
		if (tree.children.hasOwnProperty(key)) {
			const child = tree.children[key]
			if (child == null) continue

			if (child.hasOwnProperty('proposition')) {
				
				var number = to_par_number(child.proposition.number)
				
				var item_text;
				if (language == 'eng') item_text = child.proposition.english
				if (language == 'deu') item_text = child.proposition.german
				if (language == 'rus') item_text = child.proposition.russian

				var del_tags_reg = new RegExp(/\<.*\>|\n/, 'g')
				var translations = 
					'<div class="translations" title="' + child.proposition.english.replaceAll(del_tags_reg, '') + '">ENG</div>' +
					'<div class="translations" title="' + child.proposition.german.replaceAll (del_tags_reg, '') + '">DEU</div>' +
					'<div class="translations" title="' + child.proposition.russian.replaceAll(del_tags_reg, '') + '">RUS</div>';
				

				if (child.children.length > 0) {
					res += '<li><span class="paragraph caret" name="' + child.proposition.number + '">' + number + item_text + '</span>'
					res += translations
					res += '<ul class="nested">'
					// res += '<ul class="nested active">'
					
					res += tree_to_html(child, language) 
					res += '</ul></il>'
				}
				else {
					res += '<li><span class="paragraph" name="' + child.proposition.number + '">' + number + item_text + '</span>'
					res += translations
					res += '</il>'
				}
			}
			else {
				res += tree_to_html(child, language)
			}
		}
	}

	return res
}

function tree_to_par_arr(tree) {
	var res = []

	var key, count = 0;
	for (key in tree.children) {
		if (tree.children.hasOwnProperty(key)) {
			const child = tree.children[key]
			if (child == null) continue

			if (child.hasOwnProperty('proposition')) {
				if (child.children.length > 0) {
					res = res.concat(tree_to_par_arr(child))
				}

				var ch = child
				delete ch.children

				var del_tags_reg = new RegExp(/\<.*\>/, 'g')
				ch.proposition['english_clear'] = ch.proposition.english.replaceAll(del_tags_reg, '').toLowerCase()
				ch.proposition['german_clear'] =  ch.proposition.german .replaceAll(del_tags_reg, '').toLowerCase()
				ch.proposition['russian_clear'] = ch.proposition.russian.replaceAll(del_tags_reg, '').toLowerCase()
				
				res.push(ch)
			}
			else {
				res = res.concat(tree_to_par_arr(child))
			}
		}
	}

	return res
}

function search_paragraphs(pars, expr, lang) {
	var numbers = []

	for (const par of pars) {
		var text;
		if (lang == 'eng') text = par.proposition.english_clear
		if (lang == 'deu') text = par.proposition.german_clear
		if (lang == 'rus') text = par.proposition.russian_clear

		if (text.search(expr.toLowerCase()) != -1) numbers.push(par.number)
	}

	return numbers
}

