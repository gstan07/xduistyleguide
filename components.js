$(document).ready(function(){
//parse components
	$("[data-component]").each(function(){
		
		if(window["components"][$(this).data("component")]){
			window["components"][$(this).data("component")]($(this)); // succeeds
		}
		
	});
});
components = ({
		dropdown: function(el){
			el.chosen().change(function(){
				//if we have some options grouped under an optgroup,
				// display the optgroup label name on the selected result
				if($(this).find("option:selected").parent().is("optgroup")){
					var group_label = $(this).find("option:selected").parent().attr("label");
					var component_label = $("#"+$(this).attr("id")+"_chzn").find("a:first span");
					component_label.html("<strong>"+group_label+":</strong> "+$(this).find("option:selected").text());
				}

				//for quiet selectors, remove active state after the user selects something
				if($(el).attr("data-component-dropdown-mode") == "quiet"){
					$("#"+$(el).attr("id")+"_chzn").removeClass("chzn-container-active");
				}

				
			});
			$("#"+$(el).attr("id")+"_chzn").find("li.group-option").click(function(){
			//trigger the change event for the options under optgroup
			//so that we could display the optgroup label name even if the user
			//selects the same options (the selected one)				
				$(el).trigger("change");
			});

			//quiet selector
			if($(el).attr("data-component-dropdown-mode") == "quiet"){
				$("#"+$(el).attr("id")+"_chzn").addClass("quiet");
			}
			
			if($(el).attr("data-component-dropdown-mode") == "quiet"){
				
				//for quiet selectors, remove active state after the user selects something
				$("#"+$(el).attr("id")+"_chzn .active-result").click(function(){
					$("#"+$(el).attr("id")+"_chzn").removeClass("chzn-container-active");

				});
				
				//add active state on hover
				$("#"+$(el).attr("id")+"_chzn .chzn-single").hover(
					function(){
						$("#"+$(el).attr("id")+"_chzn").addClass("chzn-container-active");
						
					},
					function(){

						if($(this).hasClass("chzn-single-with-drop") == false){
							$("#"+$(el).attr("id")+"_chzn").removeClass("chzn-container-active");
						}
							
							
						
					}
				);
				
				
			}
			//no search field
			if($(el).attr("data-component-dropdown-search") == "disabled"){
				$("#"+$(el).attr("id")+"_chzn .chzn-search").hide();	
			}
			if($(el).attr("data-component-dropdown-width")){
				elid = $(el).attr("id");
				w = $(el).attr("data-component-dropdown-width");
				$("#"+elid+"_chzn").attr("style","width:"+w+"px!important");
				$("#"+elid+"_chzn .chzn-drop").css({
					"border-top":"1px solid #898989",
					"border-top-right-radius":2
				});
				
			}
			

		},
		popover: function(el){

			var isVisible = false;
			var clickedAway = false;

			el.popover({
				"trigger":el.data("popover-trigger"),
				"content":el.data("popover-content"),
				"title":el.attr("title") || el.data("popover-title"),
				"placement":el.data("popover-placement"),
			});
			if(el.data("popover-trigger") == "focus" || el.data("popover-trigger") == "click"){
				$(el).bind("focus click",function(e){
					$("[data-component = 'popover']").not(this).popover('hide');
					e.stopPropagation();
					e.preventDefault();
				});
			}
			
			$("body").bind("click.popover",function(){
				$("[data-component = 'popover']").popover('hide');
			});

			
		},
		sidebar: function(el){
			
			var sidebar_container = $('<div class="modal nonfloating sidebar"/>');
			sidebar_container.insertAfter(el);
			var accordeon_id = $(el).attr("id");
			$(el).attr("id","old_"+$(el).attr("id"));
			var accordion_container = $('<div class="accordion" id="'+accordeon_id+'"/>');
			accordion_container.appendTo(sidebar_container);
			//first level
			$(el).children("li").each(function(index){
				var heading = $('<div class="accordion-group"><div class="accordion-heading"><a data-toggle="collapse" data-parent="'+accordeon_id+'" class="accordion-toggle" href="#collapse'+index+'"></a></div></div>');
				heading.appendTo(accordion_container);
				heading.find(".accordion-toggle").html($(this).children("a").html());
				if($(this).children("a").hasClass("active")){
					heading.find(".accordion-toggle").addClass("active");
				 	heading.find(".accordion-toggle").find("i").addClass("icon-white");
				}
				//second level
				if($(this).find("ul").length>0){
					var second_level = $(' <div id="collapse'+index+'" class="accordion-body collapse" style="height: 0"><div class="accordion-inner"></div></div');
					second_level.insertAfter(heading.children(".accordion-heading"));
					second_level.find(".accordion-inner").html("<ul>"+$(this).children("ul").html()+"</ul>");
				}
				if($(this).children("a").hasClass("active")){
					heading.find(".accordion-body").addClass("in");
					heading.find(".accordion-body").css("height","auto");
				}
				
			});
			//removing the original UL
			$(el).remove();
			
			//adding active class to the clicked subitem
		  	$("#"+accordeon_id).click(function(){
		  		$(".sidebar ul a").removeClass("active");
		  		$(this).toggleClass("active");
		  	});
			//removing active class from former active sidebar element
			$("#"+accordeon_id).on('show', function () {
				$(this).find(".active").removeClass("active");
			  	$(this).find(".icon-white").removeClass("icon-white");
			});
		
			//activate accordion
			//$("div#"+accordeon_id).collapse();
		},
		collapsible_divider: function(el){
			
			
			$(el).click(function (e) {
				if($(this).find(".heading i").hasClass("icon-chevron-down")){
					$(this).find(".heading i").removeClass().addClass("icon-chevron-up")
				}
				else{
					$(this).find(".heading i").removeClass().addClass("icon-chevron-down")
				}
			});
		},
		filters: function(el){
			
			var curent_filters = {};

			$(el).find(".curent_filters .close").live("click",function(e){
				removeFilter(e);
				e.preventDefault();
			});
			$(el).find("[data-reset-filters='true']").hide();
			$(el).find("[data-reset-filters='true']").click(function(e){
				clearFilters();
				e.preventDefault();
			});

			$(el).find("[data-apply-filters='true']").click(function(e){
				$(el).find(".curent_filters").remove();
				parseFilters();
				e.preventDefault();
			});

			$("body").bind("click.filters",function(){
				$(".filterpanel",el).addClass("invisible");
			});

			$(el).find("[data-dismiss='modal']").click(function(e){
				$(this).closest(".filterpanel").addClass("invisible");
				e.preventDefault();
			});

			$(el).find(".filterpanel").click(function(e){
					e.stopPropagation();
			});
			
			$(el).find(".filterpanel form [data-component-filter-element]").change(function(){
				$(el).find(".filterpanel form").attr("data-changed","true");
			});

			$(el).find(".trigger").click(function(e){
				//show reset button if we have filters
				if($(".curent_filters",el).length > 0){
					$(el).find("[data-reset-filters='true']").show();	
				}
				$(el).find(".filterpanel").toggleClass("invisible");
				$(el).find(".filterpanel form").attr("data-changed","false");
				e.stopPropagation();
				e.preventDefault();
			});
			$(el).find(".filterpanel form").submit(function(){
				
				$(el).find(".curent_filters").remove();
				parseFilters();
				e.preventDefault();
			});
			
			var clearFilters = function(){
				
				
				$(el).find(".filterpanel form").attr("data-changed","false");
				$(el).find("[data-component-filter-element]").each(function(){
					switch($(this).attr("type")) {
			            case 'password':
						case 'select':
			            case 'text':
            			case 'textarea':
			                $(this).val('');
		                break;
			            case 'checkbox':
			            case 'radio':
			                this.checked = false;
			        }
			        if($(this).is("select")){
			        	$(this).val('');
			        	//in case we have a chosen component
			        	$(this).trigger("liszt:updated");
			        }
				});
				$(el).find(".filterpanel").addClass("invisible");
				if($(el).find(".curent_filters").length > 0){
					$(el).find(".curent_filters").remove();
					curent_filters = {};
   					$(el).trigger("filterChange",curent_filters);
				}
				
			}
			var parseFilters = function(){
				
				$(el).find(".filterpanel").addClass("invisible");
				var filterList = $('<ul class="curent_filters"/>');

				$(el).find("[data-component-filter-label]").each(function(){
					var filter_label = $(this).data("component-filter-label");
					var filter_value = "";
					var filter_element = $(this).find("[data-component-filter-element]:first").first();
					
					if(filter_element.is("select")){
						filter_value = filter_element.val();
					}
					else if(filter_element.attr("type") == "radio"){
						//get checked element
						el_name = filter_element.attr("name");
						filter_value = $("input[name='"+el_name+"']:checked",$(this)).val();
					}
					else if(filter_element.attr("type") == "checkbox"){
						//get checked element
						el_name = filter_element.attr("name");
						$("input[name='"+el_name+"']:checked",$(this)).each(function(){
							filter_value += $(this).val()+",";
						});
						filter_value = filter_value.slice(0,filter_value.length-1);
					}
					else{
						filter_value = filter_element.val();
					}
					
					//adding curent filter list

					if(filter_label != null && filter_value != null && filter_value != "" && typeof(filter_value)!="undefined"){
						filter_value = String(filter_value).replace(",",", ");
						curent_filters[filter_label] = filter_value;
						$('<li data-component-filter-label = "'+filter_label+'"><label class="filter_name">'+filter_label+': </label><label class="filter_value">'+filter_value+'</label><button class="close">&times;</a></li>').appendTo(filterList);
						filterList.insertAfter($(el).find(".heading"));
					}
				});

				//trigger filterChange event only if the form has changed
				if($(".curent_filters",el).length!=0 && $(".filterpanel form",el).attr("data-changed") == "true"){

					$(el).trigger("filterChange",curent_filters);	
				}
				
				

				
			}
			var removeFilter = function(e){
				filter_label = $(e.target).closest("li").data("component-filter-label");
				//reset filters form for the coresponent filter label
				filter_parent_group = $(".filterpanel",el).find("[data-component-filter-label = '"+filter_label+"']");
				filter_parent_group.find("[data-component-filter-element]").each(function(){
					 switch($(this).attr("type")) {
			            case 'password':
						case 'select':
			            case 'text':
            			case 'textarea':
			                $(this).val('');
		                break;
			            case 'checkbox':
			            case 'radio':
			                this.checked = false;
			        }
			        if($(this).is("select")){
			        	$(this).val('');
			        	//in case we have a chosen component
			        	$(this).trigger("liszt:updated");
			        }

				});
				$(e.target).closest("li").fadeOut("slow",function(){
					$(this).remove();
				});
				$(el).trigger("filterChange",curent_filters);

			}

		},
		hint: function(el){
			var icon = $(el).closest(".hint_container").find(".icon");
			

			if($(el).attr("data-component-hint-trigger") == "focus"){
				$(el).bind("click focus",function(e){
					$(".popover").hide();
					icon.popover("show");
					e.stopPropagation();
				});	
				$(el).bind("blur",function(e){
				
					icon.popover("hide");
					e.stopPropagation();
				});
			}
			
			
			icon.click(function(e){
				$(".popover").hide();
				$(this).popover("show");
				e.stopPropagation();
			});

			if($(el).attr("data-component-hint-visible") == "true"){
				console.log("show damn popover");
				icon.popover("toggle");

			}
			
		},
		daterange: function(el){
			
			if($(el).attr("data-component-daterange-width") == "auto"){
						
						el_chars_num = $(el).val().length;
						if(el_chars_num == 0){
							el_chars_num = $(el).attr("placeholder").length;
						}
						$(el).width(el_chars_num*8-15);
			}
			
			el.daterangepicker({
				'onChange':function(){
					if($(el).attr("data-component-daterange-width") == "auto"){

						el_chars_num = $(el).val().length;
						$(el).width((el_chars_num*8-15));
					}
				}
			}); 
		},
		modalTrigger: function(el){
			el.click(function(){
				$(el.attr("href")).modal({
					//backdrop:'static',
					//keyboard:false,
				});	
			});
			
		},
		tagsinput: function(el){
			
   			options = {
   				'width':'220px',
   				'defaultText':'+ add tags',
   			}
   			if($(el).attr("data-component-autocomplete_url")){
   				options["autocomplete_url"] = $(el).attr("data-component-autocomplete_url");		
   			}


			el.tagsInput(options);

			//simulating focus on input
			elid = $(el).attr("id");
			
			//clicking on the input should trigger container focus
			$("#"+elid+"_tag").bind("focus click",function(e){
				$(this).closest(".tagsinput").addClass("active");
				e.stopPropagation();
				
			});
			//$("input#"+elid+"_tag").attr("placeholder",$(this).attr("data-default"))
			$("input#"+elid+"_tag").blur(function(e){
				//$(this).attr("placeholder",$(this).attr("data-default"));
				$(this).closest(".tagsinput").removeClass("active");
				e.stopPropagation();

			});
			//clicking on the container should trigger container focus
			$("#"+elid+"_tagsinput").click(function(e){
				$(this).addClass("active");
				
				e.stopPropagation();
			});

			
			//porting click from label to the new input
			$("label[for='"+elid+"']").click(function(e){
				e.stopPropagation();
				e.preventDefault();


				$("input#"+$(this).attr("for")+"_tag").focus();
				
				
			});
			$("body").bind("click.tagsinput",function(e){
				$(".tagsinput").removeClass("active");
			});

		},

		grid:function(el){
			//adding check all functionality
			$("[data-component-grid-element ='checkall']",el).click(function(e){
				if($(this).is(":checked")){
					$("[data-component-grid-element ='rowcheck']",el).each(function(){
						if($(this).is(":checked") == false){
							//we trigger change because a checkbox don;t fire change when changed programaticaly
							//and we need this event later
							$(this).trigger("change");
						}
						$(this).attr('checked', true);
					});
				}
				else{

					$("[data-component-grid-element ='rowcheck']",el).each(function(){
						if($(this).is(":checked") == true){
							$(this).trigger("change");
						}
						$(this).attr('checked', false);
					});
				}
				checkBulkActions();
			});

			//adding inline editable functionality
			$("[data-component-grid-element ='inline-editable']",el).attr("title","Click to edit inline");
			//adding pencil icon
			$("[data-component-grid-element ='inline-editable']",el).closest("td").hover(function(){
				if($(this).find("input").length == 0){
					$("<i class='icon icon-pencil'></i>").insertAfter($(this).find("[data-component-grid-element ='inline-editable']"));
				}
			},
			function(){
				$(this).find(".icon-pencil").remove();
			});
			$("[data-component-grid-element ='inline-editable']",el).closest("td").click(function(e){
				$(this).find("[data-component-grid-element ='inline-editable']").trigger("click");
			});
			$("[data-component-grid-element ='inline-editable']",el).click(function(e){

				
				input = $('<input class="inline" value="'+$(this).text()+'"/>');
				el_length = $(this).text().length;
				$(this).closest("td").attr("data-initial-text",$(this).html());
				$(this).html(input);

				//$(el).find("input").width(el_length*9);

				$(this).find("input").focus();
				$(this).siblings(".icon-pencil").remove();

				$(this).find("input").blur(function(e){
					$(this).replaceWith($(this).val());
				});

				$(this).find("input").bind("keyup",function(e){
					if(e.keyCode == 13){
						//enter was pressed
						$(this).blur();
					}
					if(e.keyCode == 27){
						//escape was pressed. HALT!
						$(this).replaceWith($(this).closest("td").attr("data-initial-text"));

					}
				});

				$(this).find("input").bind("focus click",function(e){
					$(this).closest("td").attr("data-initial-text",$(this).val());
					e.stopPropagation();
					e.preventDefault();
				});
				e.stopPropagation();
				e.preventDefault();
			});
			$("[data-component-grid-element = 'rowcheck']",el).change(function(){
				$(this).closest("tr").toggleClass("selected");
				checkBulkActions();
			});
			
			//enabling bulk actions
			var checkBulkActions = function(el){
				if($("[data-component-grid-element = 'rowcheck']:checked",el).length > 0){
					$("[data-component-grid-element = 'bulk-actions-group'] .btn.disabled",el).removeClass("disabled").addClass("btn-primary");
				}
				else{
					$("[data-component-grid-element = 'bulk-actions-group'] .btn.btn-primary",el).removeClass("btn-[rimary").addClass("disabled");
				}	
			}

			//handling sortable rows
			if($(el).data("component-grid-sortable") == true){
				//adding the handle icon and show it on tr hover
				move_icon = $("<i class='icon icon-th' title = 'drag to sort'></icon>");
				move_icon.css({
					'visibility':'hidden',
					'cursor':'move',
					'opacity':.5,
					'width':5,
					'margin-right':3

				});
				
				//for some reason, prepending an element to the first td will make the
				//td very large, so do this little hack
				//getting initial width
				init_width = $("tr td:first-child,tr th:first-child",el).width();
				//prepending move icon
				$("tr td:first-child,tr th:first-child",el).prepend(move_icon);
				//setting the td width back to the original
				$("tr td:first-child,tr th:first-child",el).width(init_width+10);
				

				$("tbody tr",el).hover(function(){
					$(this).find(".icon-th").css({
						'visibility':'visible'
					});
				},function(){
					$(this).find(".icon-th").css({
						'visibility':'hidden'
					});
				});

				var fixHelper = function(e, ui) {
				    ui.children().each(function() {
				        $(this).width($(this).width());
				    });
				    return ui;
				};
				var forceHelper = function(e,ui) {
					$(".ui-state-highlight").html("<td colspan='4'>&nbsp;</td>");
				};
				$("tbody",el).sortable({
					 helper: fixHelper,
					 handle: ".icon-th",
					 axis: "y",
					 cursor: 'move',
					 placeholder: 'ui-state-highlight',
					 change: function(e, ui) {
         				forceHelper(e,ui);
      				}
				});
			}
			
		},
		spinner: function(el){

			$(el).spin({
			  lines: $(el).data("component-spinner-lines") || 13, // The number of lines to draw
			  length: $(el).data("component-spinner-length") || 5, // The length of each line
			  width: $(el).data("component-spinner-width") || 2, // The line thickness
			  radius: $(el).data("component-spinner-radius") || 7, // The radius of the inner circle
			  corners: $(el).data("component-spinner-corners") || 1, // Corner roundness (0..1)
			  rotate: $(el).data("component-spinner-rotate") || 0, // The rotation offset
			  color: $(el).data("component-spinner-color") || '#000', // #rgb or #rrggbb
			  speed:  $(el).data("component-spinner-speed") || 1, // Rounds per second
			  trail: $(el).data("component-spinner-trail") || 60, // Afterglow percentage
			  shadow: $(el).data("component-spinner-shadow") || false, // Whether to render a shadow
			  hwaccel: $(el).data("component-spinner-hwaccell") || false, // Whether to use hardware acceleration
			  className: $(el).data("component-spinner-classname") || 'spinner', // The CSS class to assign to the spinner
			  zIndex: $(el).data("component-spinner-zIndex") || 2e9, // The z-index (defaults to 2000000000)
			  top: $(el).data("component-spinner-top") || 10, // Top position relative to parent in px
			  left: $(el).data("component-spinner-left") || 10 // Left position relative to parent in px
			});
			
			
		},
		tooltip: function(el){
			options = {
				animation: !!$(el).attr("component-tooltip-animation") || false,
				placement: $(el).data("component-tooltip-placement") || 'top',
				selector: $(el).data("component-tooltip-selector") || false,
				title: $(el).data("component-tooltip-title") || "",
				trigger: $(el).data("component-tooltip-trigger") || 'hover',
				delay: $(el).data("component-tooltip-delay") || 0,
			}
			$(el).tooltip(options);
		},
		toggler: function(el){
			$(el).click(function(e){
				$($(el).attr("href")).toggleClass("hide");
				e.preventDefault();
			});
		},
		typeahead: function(el){
			$.component_source;
			if($(el).data("component-typeahead-source")){
				component_source = eval($(el).data("component-typeahead-source"));
			} else if($(el).data("component-typeahead-source-url")){
					$.get($(el).data("component-typeahead-source-url"),function(data){
					$.component_source = eval(data);
				});
			}
			$(el).typeahead({
				source:component_source,
			});
		},

		tree: function(el){
			$(el).dynatree();
			if($(el).data("component-tree-width")){
				$(".dynatree-container",$(el)).width($(el).data("component-tree-width"));
			}
			if($(el).data("component-tree-height")){
				$(".dynatree-container",$(el)).height($(el).data("component-tree-height"));
			}
		}

	});