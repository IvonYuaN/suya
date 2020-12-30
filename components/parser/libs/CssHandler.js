/*
 解析和匹配 Css 的选择器
 github地址：https://github.com/jin-yufeng/Parser
 文档地址：https://jin-yufeng.github.io/Parser
 author：JinYufeng
*/
const config = require("./config.js");
class CssHandler {
	constructor(tagStyle = {}) {
		this.styles = Object.assign({}, tagStyle);
	};
	getStyle(data) {
		var style = '';
		data = data.replace(/<[sS][tT][yY][lL][eE][\s\S]*?>([\s\S]*?)<\/[sS][tT][yY][lL][eE][\s\S]*?>/g, function($, $1) {
			style += $1;
			return '';
		})
		this.styles = new CssParser(style, this.styles).parse();
		return data;
	};
	parseCss(css) {
		return new CssParser(css, {}, true).parse();
	};
	match(name, attrs) {
		var tmp, matched = ((tmp = this.styles[name]) ? (tmp + ';') : '');
		if (attrs.class) {
			var classes = attrs.class.split(' ');
			for (var i = 0; i < classes.length; i++)
				if (tmp = this.styles['.' + classes[i]])
					matched += (tmp + ';');
		}
		if (tmp = this.styles['#' + attrs.id])
			matched += tmp;
		return matched;
	};
}
module.exports = CssHandler;
class CssParser {
	constructor(data, tagStyle, api) {
		this.data = data;
		this.res = tagStyle;
		// 非 api 调用则加入 userAgentStyles
		if (!api)
			for (var item in config.userAgentStyles) {
				if (tagStyle[item]) tagStyle[item] = config.userAgentStyles[item] + ';' + tagStyle[item];
				else tagStyle[item] = config.userAgentStyles[item];
			}
		this._floor = 0;
		this._i = 0;
		this._list = [];
		this._comma = false;
		this._sectionStart = 0;
		this._state = this.Space;
	};
	parse() {
		for (; this._i < this.data.length; this._i++)
			this._state(this.data[this._i]);
		return this.res;
	};
	// 状态机
	Space(c) {
		if (c == '.' || c == '#' || (c >= 'a' && c <= 'z') || (c >= 'A' && c <= 'Z')) {
			this._sectionStart = this._i;
			this._state = this.StyleName;
		} else if (c == '/' && this.data[this._i + 1] == '*')
			this.Comment();
		else if (!config.blankChar[c] && c != ';')
			this._state = this.Ignore;
	};
	Comment() {
		this._i = this.data.indexOf("*/", this._i) + 1;
		if (!this._i) this._i = this.data.length;
		this._state = this.Space;
	};
	Ignore(c) {
		if (c == '{') this._floor++;
		else if (c == '}' && --this._floor <= 0) {
			this._list = [];
			this._state = this.Space;
		}
	};
	StyleName(c) {
		if (config.blankChar[c]) {
			this._list.push(this.data.substring(this._sectionStart, this._i));
			this._state = this.NameSpace;
		} else if (c == '{') {
			this._list.push(this.data.substring(this._sectionStart, this._i));
			this._floor = 1;
			this._sectionStart = this._i + 1;
			this.Content();
		} else if (c == ',') {
			this._list.push(this.data.substring(this._sectionStart, this._i));
			this._sectionStart = this._i + 1;
			this._comma = true;
		} else if (!(c >= 'a' && c <= 'z') && !(c >= 'A' && c <= 'Z') && !(c >= '0' && c <= '9') && c != '.' && c != '#' &&
			c != '-' && c != '_')
			this._state = this.Ignore;
	};
	NameSpace(c) {
		if (c == '{') {
			this._floor = 1;
			this._sectionStart = this._i + 1;
			this.Content();
		} else if (c == ',') {
			this._comma = true;
			this._sectionStart = this._i + 1;
			this._state = this.StyleName;
		} else if (!config.blankChar[c]) {
			if (this._comma) {
				this._state = this.StyleName;
				this._sectionStart = this._i;
				this._i--;
				this._comma = false;
			} else this._state = this.Ignore;
		}
	};
	Content() {
		this._i = this.data.indexOf('}', this._i);
		if (this._i == -1) this._i = this.data.length;
		// 去除空白符
		var content = this.data.substring(this._sectionStart, this._i).trim();
		for (var i = content.length, tmp = [content[--i]]; --i > 0;)
			if (!config.blankChar[content[i]] || !config.blankChar[tmp[0]])
				if ((content[i] == ';' || content[i] == ':') && config.blankChar[tmp[0]]) tmp[0] = content[i];
				else tmp.unshift(content[i]);
		tmp.unshift(content[0]);
		content = tmp.join('');
		for (var i = this._list.length; i--;)
			this.res[this._list[i]] = (this.res[this._list[i]] || '') + content;
		this._list = [];
		this._state = this.Space;
	}
}
