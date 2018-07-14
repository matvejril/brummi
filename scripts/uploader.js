function Uploader(selector) {
	var that = this;
	this.$parent = $(selector);
	if (this.$parent[0]) {
		this.init(that);
	}
}

Uploader.prototype.init = function (that) {
	this.elems = {
		$input: this.$parent.find('[data-upload-input]'),
		$text: this.$parent.find('[data-upload-text]')
	};

	this.elems.$input.on('change', function(e) {
		that.changeText(e);
	})
};

Uploader.prototype.changeText = function(e) {
	e.preventDefault();
	var files = this.elems.$input.get(0).files;

	if (files.length) {
		files = files[0];
		this.elems.$text.text(files.name);
	} else {
		this.elems.$text.text(this.$parent.data('upload-default'));
	}
};

module.exports = Uploader;
