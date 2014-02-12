(function($) {
	function confirmation(btn, input, password) {
		$(input).val("none")
		$(input).on('keyup change', function() {
			if ($(input).val() === password) {
				$(btn).removeAttr("disabled");
			} else {
				$(btn).attr("disabled", "disabled");
			}
		});
	}
	$.confirmation = confirmation;
})(jQuery);
