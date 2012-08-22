$(document).ready(function(){
	$("[data-validation = 'validate']").validate({
		//errorElement: "div",
		errorClass: "invalid",
		debug: true,
	
	  	errorPlacement: function(error, element) {
		    element.wrap("<span class='tooltip_container'/>");
		    error.insertAfter(element);
		},
		
		invalidHandler: function(form, validator) {
			
			$(validator.errorList[0].element).focus();
			
		},
		showErrors: function(errorMap, errorList) {
			var s = this.successList;
				if (s.length) {
					for (var i = 0; i < s.length; i++) {
						$(s[i]).closest(".control-group").removeClass("error");
						$(s[i]).attr("data-tooltip-message", null);
						$(s[i]).closest(".tooltip_container").find(".tooltip").hide();
					}
				}
				for (var k = 0; k < errorList.length; k++) {
					var errorField = $(errorList[k].element);

					errorField.closest(".control-group").addClass("error");
					errorField.attr("data-tooltip-message", errorList[k].message);

					var tooltipContainer = errorField.closest(".tooltip_container");
				}
				if (tooltipContainer.length == 0) {
						try {
							if (errorField.parent().hasClass("fake_input_container")) {
								errorField.parent().wrap('<span class="tooltip_container" />');
							} else {
								errorField.wrap('<span class="tooltip_container" />');
							}
						} catch (e) {
							// TODO: "NOT_FOUND_ERR: DOM Exception 8" - This happens when view event is set on button.click and not form.submit
							// TO INVESTIGATE
						}
						errorField.bind("keyup",function(){
							if($(this).hasClass("error") == false){
								$(this).closest(".hint_container").find(".pass_strength").show();
							}
						});
						errorField.focus(validation.showTooltip);
						errorField.blur(validation.hideTooltip);
						errorField.keypress(validation.hideTooltip);
						tooltipContainer = errorField.closest(".tooltip_container");
				}

		},
		invalidHandler: function(form, validator) {
					//focus on the first errorneous element  (that should trigger the error tooltip also)
					//on IE the element is blured right after the focus so we hack this with a setTimeout trick
					if($.browser.msie)
					{
						setTimeout(function(){
							$(validator.errorList[0].element).focus();
						},0);
					}
					else
					{
						$(validator.errorList[0].element).focus();
					}
				}	
	  	
	  	
	  
	  	
	});
});
var validation = {
	showTooltip: function(){
		var form = this;
		var message = $(this).attr("data-tooltip-message");
		if (typeof(message)!="undefined") {
			var errorTooltip = $('<div class="tooltip" />');

			var m = $('<div>' + message + '</div>').text();
			errorTooltip.html(m);
			$('<span class="triangle"></span>').appendTo(errorTooltip);
			if ($(this).closest(".tooltip_container").find(".tooltip").length == 0) {
				errorTooltip.appendTo($(this).closest(".tooltip_container"));
				errorTooltip.css({"display": "block"});
				$(this).closest(".tooltip_container").css({"position": ""});
				$(this).closest(".tooltip_container").css({"position": "relative"});
				
				$(this).closest(".tooltip_container").find(".tooltip").css({
					"bottom":$(this).closest(".tooltip_container").find("input").height()+15
				});
			}

			// hide hint if we have tooltip
			$(this).closest(".hint_container").find(".hint").hide();
			$("a", errorTooltip).mousedown(function() {
				form.aboutToClickOnTooltip = true;
			});
		}
	},

	hideTooltip: function() {
		if (this.aboutToClickOnTooltip) {
			this.aboutToClickOnTooltip = false;
		} else {
			$(this).closest(".tooltip_container").find(".tooltip").remove();
		}
	},

	isValid: function () {
		if (!this.initialized) {
			return true;
		} else {
		return $(this.formId).valid();
				
		}
	},
}
