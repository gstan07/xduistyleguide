	
	
	function htmlEncode(value){
	  return $('<div/>').text(value).html();
	}

	function htmlDecode(value){
	  return $('<div/>').html(value).text();
	}

	function SelectText(element) {
	    var doc = document;
	    var text = doc.getElementById(element);    
	    if (doc.body.createTextRange) {
	        var range = document.body.createTextRange();
	        range.moveToElementText(text);
	        range.select();
	    } else if (window.getSelection) {
	        var selection = window.getSelection();        
	        var range = document.createRange();
	        range.selectNodeContents(text);
	        selection.removeAllRanges();
	        selection.addRange(range);
	    }
	}

	$(document).ready(function(){

		if($("#"+window.location.hash.replace("#","")).length == 1){
			$("[data-section = 'true']").hide();
			obj.switchSection(window.location.hash.replace("#",""));
		}
		$("[data-sectionswitch]").click(function(e){
			obj.switchSection($(this).data("sectionswitch"));
			window.location.hash = $(this).data("sectionswitch");
			return false;
		});
		$("[data-modal-open]").click(function(){
			$("#"+$(this).data("modal-open")).modal("show");
			return false;
		});
		

		
		//grabbing code pieces to show later on	
		var codePieces = new Array();
		$("[data-getcode]").each(function(index){
			codePieces[$(this).attr("data-getcode")] = $("#"+$(this).attr("data-getcode")).html();							
		});	
			

		
		$("[data-getcode]").click(function(e){
			$(this).attr("title","Click to get code");
		
			codeToShow = $.trim(htmlEncode(codePieces[$(this).data("getcode")])).replace(/\t/g, ' ');
			$("#codeModal pre.prettyprint").html("<code>"+codeToShow+"</code>");
			prettyPrint();
			$("#codeModal").modal("show");
			
			
		});
		
		
		
		$("#selectAll").click(function(){
			//$(".prettyprint").select();
			SelectText("prettyprint");
		});
		
		
		prettyPrint();

	});
	
	
	
	



	obj = ({
	openModal: function(e){
		$("#myModal").modal("show");
		return false;
	},

	switchSection : function(sectionName){
		$("#navbar li").removeClass("active");
		$("[data-section = 'true']").hide();

		$("#"+sectionName+"[data-section = 'true']").show();
		//$($(e.target).closest("li").addClass("active"));
		$("#navbar a[data-sectionswitch='"+sectionName+"']").closest("li").addClass("active");
		
		return false;
	}
});