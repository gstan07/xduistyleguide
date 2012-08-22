$(document).ready(function(){
	$("[data-validation = 'validate']").validate({
		//debug: true,
	  	invalidHandler: function(form, validator) {
	  	},
	  	showErrors: function(errorMap, errorList) {
    		
	  		var s = this.successList;
			if (s.length) {
				for (var i = 0; i < s.length; i++) {
					$(s[i]).closest(".control-group").removeClass("error");
					$(s[i]).attr("data-tooltip-message", null);
					$(s[i]).siblings(".validation_tooltip").hide();
				}
			}
			var er = this.errorList;
			if(er.length)
			{
	    		for(var i = 0; i<er.length; i++){
	    			
	    			$(er[i].element).closest(".control-group").addClass("error");

	    			$(er[i].element).attr("data-error-message",er[i].message);
	    			
	    			if($(er[i].element).closest(".tooltip_container").length == 0){
	    				$(er[i].element).wrap('<span class="tooltip_container"/>');
	    			}
	    			
	    			if($(er[i].element).siblings(".validation_tooltip").length == 0){
	   					validation.addTooltip(er[i].element);
	    			}
	    			$(er[i].element).keypress(validation.updateTooltip($(er[i].element)));
	    			//$(er[i].element).bind("focus",validation.showTooltip($(er[i].element)))
	    		}
	    		if($(er[0].element).closest("form").find(".validation_tooltip:visible").length == 0){
	    				$(er[0].element).siblings(".validation_tooltip").show();	
	    		}
	    			
    		}
    		
 		}
	});
});
validation = {
	addTooltip: function(el){
			tooltip = $('<div class="popover top validation_tooltip"/>');
			tooltip.append($('<div class="arrow"/>'));
			tooltip.append($('<p data-role="error-message"/>'));
			$("[data-role='error-message']",tooltip).html($(el).attr("data-error-message"));
			tooltip.insertAfter($(el));
			tooltip.css({
				top:-1*$(el).closest(".tooltip_container").outerHeight()*3,
			});
			tooltip.hide();
	},
	updateTooltip: function(el){
		$(el).siblings(".validation_tooltip").find("[data-role='error-message']").html($(el).attr("data-error-message"));
	},
	showTooltip: function(el){
		$(el).closest("form").find(".validation_tooltip").hide();
		$(el).siblings(".validation_tooltip").show();
	}
};
