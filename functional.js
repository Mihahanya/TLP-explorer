

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
				var translations = '<div class="translations" title="' + child.proposition.english.replaceAll(del_tags_reg, '') + '">ENG</div>' +
								   '<div class="translations" title="' + child.proposition.german.replaceAll (del_tags_reg, '') + '">DEU</div>' +
								   '<div class="translations" title="' + child.proposition.russian.replaceAll(del_tags_reg, '') + '">RUS</div>';
				

				if (child.children.length > 0) {
					res += '<li><span class="caret" name="' + child.proposition.number + '">' + number + item_text + '</span>'
					res += translations
					res += '<ul class="nested active">'
					
					res += tree_to_html(child, language) 
					res += '</ul></il>'
				}
				else {
					res += '<li><span name="' + child.proposition.number + '">' + number + item_text + '</span>'
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
					
					var ch = child
					delete ch.children
					res.push(ch)
				}
				else {
					var ch = child
					delete ch.children
					res.push(ch)
				}
			}
			else {
				res = res.concat(tree_to_par_arr(child))
			}
		}
	}

	return res
}

