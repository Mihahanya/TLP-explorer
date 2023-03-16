

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
					'<div class="translations" data-tooltip="' + child.proposition.english.replaceAll(del_tags_reg, '') + '">ENG</div>' +
					'<div class="translations" data-tooltip="' + child.proposition.german.replaceAll (del_tags_reg, '') + '">DEU</div>' +
					'<div class="translations" data-tooltip="' + child.proposition.russian.replaceAll(del_tags_reg, '') + '">RUS</div>';
				

				if (child.children.length > 0) {
					res += `<li name="${child.proposition.number}"><span class="paragraph caret" name="${child.proposition.number}">${number + item_text}</span>`
					res += translations
					res += '<ul class="nested">'
					// res += '<ul class="nested active">'
					
					res += tree_to_html(child, language) 
					res += '</ul></il>'
				}
				else {
					res += `<li name="${child.proposition.number}"><span class="paragraph" name="${child.proposition.number}">${number + item_text}</span>`
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
	if (expr == '') return [];

	expr = expr.toLowerCase()
		.replaceAll(new RegExp(/\{and/, 'g'), '{AND')
		.replaceAll(new RegExp(/\{or/, 'g'), '{OR')
		.replaceAll(new RegExp(/not\}/, 'g'), 'NOT}')

	search_tokens = expr.split(/\s?[\{\}\(\)]\s?/)
		.filter(e => e != '')
		.filter((_, i) => i % 2 == 0) 	// world {and} ( the {or} not ) {or} is -> ['world', 'the', 'not', 'is']

	var numbers = []

	for (const par of pars) {
		var text;
		if (lang == 'eng') text = par.proposition.english_clear
		if (lang == 'deu') text = par.proposition.german_clear
		if (lang == 'rus') text = par.proposition.russian_clear
		text = text.toLowerCase()

		var checking_expr = expr
		for (const t of search_tokens) {
			checking_expr = checking_expr.replace(t, +(text.search(t) != -1))
		}
		checking_expr = checking_expr
			.replaceAll('{AND', '*').replaceAll('{OR', '+').replaceAll('NOT}', '!')
			.replaceAll(new RegExp(/\{|\}/, 'g'), '')

		// All of that ^ is translating some like:
		// world {and} ( the {or} not ) {or} is -> 0 * ( 1 + 0 ) + 1

		try {
			if (eval(checking_expr)) numbers.push(par.number)
		}
		catch {
			return null
		}
	}

	return numbers
}


function exec_field_expr(expr) 
{
	function replace_enums(str) {
		var new_str = ''
		for (var i=0; i < str.length-1; i++) {
			if (str[i+1] == '-') {
				if (+str[i] > +str[i+2] || !/^\d\d$/.test(str[i]+str[i+2])) return null

				for (var n=+str[i]; n <= +str[i+2]; n++) 
					new_str += n
				
				i += 2
			}
			else {
				new_str += str[i]
			}
		}
		return new_str + str[str.length-1]
	}

	if (expr.length > 2 && expr[expr.length-1] == '.') expr = expr.slice(0, -1) 	// 1.21. -> 1.21

	expr = replace_enums(expr) 		// 3.26(1-3) -> 3.26(123)
	if (expr == null) return null 

	var number_match = expr.match(/^\d\.(\d+)?/) 			// 3.26(123) -> 3.26
	var enums_match = expr.match(/\(((\d[\s\/]*)+)\)$/) 	// 3.26(123) -> (123)
	
	if (number_match == null && enums_match == null) return null
	
	if (number_match == null) number_match = ['']
	if (enums_match == null) enums_match = ['', ['']]

	if (number_match[0].length + enums_match[0].length != expr.length) return null
		
	var search_field_nums = []
	for (const n of enums_match[1]) {
		if (n != ' ' && n != '/') {
			var number;
			if (number_match == null) number = ''
			else number = number_match[0].replace('.', '')
			search_field_nums.push(number + n)
		}
	}

	return search_field_nums
}
