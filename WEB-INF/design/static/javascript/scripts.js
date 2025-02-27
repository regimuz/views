//if (window.location.protocol != "https:") window.location.href = "https:" + window.location.href.substring(window.location.protocol.length);
(function($) {
    $.fn.toggleDisabled = function(){
        return this.each(function(){
            this.disabled = !this.disabled;
        });
    };
})(jQuery);
var monthes = [
               "1 месяц",
               "2 месяца",
               "3 месяца",
               "4 месяца",
               "5 месяцев",
               "6 месяцев",
               "7 месяцев",
               "8 месяцев",
               "9 месяцев",
               "10 месяцев",
               "11 месяцев",
               "12 месяцев",
               ];
var monthlycost = 0;
jQuery(document).ready(function () {
	$('div.row_externaldata_subject').editable(siteurl+'external/apply', {width:"100%", cssclass : 'editable', type: 'textarea',cancel: 'Cancel',submit: 'OK',tooltip: 'Click to edit...'});
	$(".datepicker").datepicker({
		changeMonth:true,
		changeYear:true,
		dateFormat: "yy-mm-dd",
		dayNamesMin: ["Вс", "Пн", "Вт", "Ср", "Чт", "Пт", "Сб"],
		firstDay: 1,
		monthNamesShort: ["Январь", "Февраль", "Март", "Апрель", "Май", "Июнь", "Июль", "Август", "Сентябрь", "Октябрь", "Ноябрь", "Декабрь"]
	});
	$("a.updateCaptcha, img.captchaImg, a.capchRefresh").click(function (e) {
		e.preventDefault();
		$("img.captchaImg").attr('src', $("img.captchaImg").attr('src')+'?'+Math.random());
	});

	$("h2.title").each(function (i, el){
		var string = $(this).text().trim().toLowerCase();
		$(this).text(string.charAt(0).toUpperCase() + string.slice(1));
	});
//	$(".carousel-continuous").sliderkit({
//		auto:false,
//		circular:true,
//		shownavitems:4,
//		scroll:1,
//		//navcontinuous: true,
//		scrollspeed: 700,
//		mousewheel:true,
//		scrolleasing: "linear"
//	});
	
	$("a.editLine").click(function (e) {
		e.preventDefault();
		$("table.zoneTable#showLine"+$(this).attr('rel')+",table.zoneTable#editLine"+$(this).attr('rel')).toggle();
	});
	$("a.closeNotification").click(function (e) {
		e.preventDefault();
		var div = $("div#"+$(this).attr("rel"));
		$.get($(this).attr("href"), function () {
			div.slideUp();
		});
	});
	//$("input#_birthday_id").datepicker({changeYear: true,changeMonth: true, yearRange: "-60:-16", dateFormat: "yy.mm.dd"});
	//$("input#_passportExpired_id").datepicker({changeYear: true,changeMonth: true, yearRange: ":+50", dateFormat: "yy.mm.dd"});
	//$("input#_verifiedTill_id").datepicker({changeYear: true,changeMonth: true, yearRange: ":+50", dateFormat: "yy.mm.dd"});
	
	$("input.toggleAccess").change(function () {
		var select = $(this).siblings("select");
		select.siblings("div.selectArea").remove();
		select.removeClass("outtaHere");
		select.toggleDisabled();
		
		var div = $(this).siblings("div#ext"+$(this).val());
		div.toggle();
	});
	
	
	$("select#_tarif_id,select#monthesContainer").change(function () {
		$("div#tarifDescription").load(siteurl+"whmpackages/"+$("select#_tarif_id").val()+"?ajaxed=true&monthes="+$("select#monthesContainer").val());
		$.getJSON(siteurl+"whmpackages/json/"+$("select#_tarif_id").val(), function (object) {
			$("input#_cost_id").val(object.cost);
			monthlycost = object.whmPackageDescription.monthlycost;
			var tmpMonth = $("select#monthesContainer").val();
			$("select#monthesContainer").html("");
			var options = "";
			if (object.whmPackageDescription.monthlyenabled) {
				for (var i = 1; i <= 12; i++) {
					if (i==tmpMonth)
						options += '<option value="' + (i) + '" selected="selected">' + monthes[i-1] + '</option>';
					else
						options += '<option value="' + (i) + '">' + monthes[i-1] + '</option>';
				}
			} else {
				options += '<option value="12">1 год</option>';
			}
			//
			$("select#monthesContainer").html(options);
			$("select#monthesContainer").siblings("div.selectArea").remove();
			$("select#monthesContainer").removeClass("outtaHere");
			$("select#monthesContainer").removeClass("outtaHere");
			
		});
	});
	$("select#monthesContainer").change(function () {
		//alert($(this).val()+"  "+monthlycost);
		$("#monthlyCostTitle").html("Цена: "+(monthlycost*$(this).val())+", срок: "+$(this).find("option:selected").text());
	});
	
	
	$(".zoneTable select#_type_id").change(function () {
		//alert('ok');
		$("td.addonFields input").hide();
		switch ($(this).val()) {
			case "A":
				$("td.addonFields input#_address_id").show();
				break;
			case "CNAME":
				$("td.addonFields input#_cname_id").show();
				break;
			case "MX":
				$("td.addonFields input#_preference_id").show();
				$("td.addonFields input#_exchange_id").show();
				break;
			case "TXT":
				$("td.addonFields input#_txtdata_id").show();
				break;
		}
	});
	$(".zoneTable select#_type_id").attr("autocomplete", "off");

	$("input.validateDomain").blur(function () {
		if ($(this).val()!="") {
			$.get(siteurl+"domains/isBusy", {domain:$(this).val()}, function (data) {
				if (data) {
					$("div.validatorDomain").html("<span class='error'>Домен занят!</span>");
				} else {
					$("div.validatorDomain").html("");
				}
			}, "json");
		}
	});
	$("input#_nameserver1_id,input#_nameserver2_id,input#_nameserver3_id,input#_nameserver4_id").blur(function () {
		var obj = $(this);
		if ($(this).val()!="") {
			$.get(siteurl+"nameservers/exists", {name:obj.val()}, function (data) {
				var targetClass = obj.attr("name").replace("nameserver","");
				if (data) {
					$("div.validatorNameserver"+targetClass).html("");
				} else {
					$("div.validatorNameserver"+targetClass).html("<span class='error'>Сервер не найден! <a href='"+siteurl+"nameservers?form"+"' target='_blank'>Создать</a></span>");
				}
			}, "json");
		}
	});
	
	$("ul#technical select,ul#owner select,ul#admin select,ul#payment select").live("change", function () {
		var obj = $(this).parents("ul:first");
		var selector = $(this);
		obj.children("li:not(:first)").each(function () {$(this).remove();});
		$("ul#hiddenContainer").remove();
		$("<ul id='hiddenContainer'></ul>").appendTo('body').hide().load(siteurl+"contacts/"+selector.find("option[selected]").attr("value")+"?ajaxed="+$(this).parents("ul:first").attr("id")+" ul li", function () {
			//alert($("ul#hiddenContainer").html());
			$("ul#hiddenContainer").html();
			obj.append($("ul#hiddenContainer").html());
			$('.nth li:nth-child(odd)').addClass('odd');
			$(obj).find("a.editContact").attr("href", siteurl+"contacts/"+selector.find("option[selected]").attr("value")+"?form");
		});
	});

	$("a.setFalse").click(function (e) {
		e.preventDefault();
		$("input#_cType_id").val("false");
		$("input#_contactType_id").val("p");
	});
	$("a.setTrue").click(function (e) {
		e.preventDefault();
		$("input#_cType_id").val("true");
		$("input#_contactType_id").val("l");
	});
	
	if ($("select#_user_id").length && $("select#_tarif_id").length) {
		$("select#_user_id").change(function () {
			$("select#_tarif_id").html('<option>Loading...</option>').removeClass("outtaHere");
			$("select#_tarif_id").siblings("div.selectArea").remove();
			$.getJSON(siteurl+"whmpackages", { find:'ByUser', user:$(this).val() }, function(j){
				var options = "<option value=''>----------</option>";
				for (var i = 0; i < j.length; i++) {
					options += '<option value="' + j[i].id + '">' + j[i].title + '</option>';
				}
				$("select#_tarif_id").html(options);
				
			});
		});
	}
	
	if ($("select#_country_id").length && $("select#_region_id").length && $("select#_city_id").length) {
		$("select#_country_id").change(function () {
			$("select#_region_id").html('<option>Loading...</option>').removeClass("outtaHere");
			$("select#_region_id").siblings("div.selectArea").remove();
			$("select#_city_id").html('<option></option>').removeClass("outtaHere");
			$("select#_city_id").siblings("div.selectArea").remove();
			$.getJSON(siteurl+"regions", { find:'ByCountry', country:$(this).val() }, function(j){
				var options = "<option value=''>----------</option>";
				for (var i = 0; i < j.length; i++) {
					options += '<option value="' + j[i].id + '">' + j[i].name + '</option>';
				}
				$("select#_region_id").html(options);sslcert
				
			});
		});
		$("select#_region_id").change(function () {
			$("select#_city_id").html('<option>Loading...</option>').removeClass("outtaHere");
			$.getJSON(siteurl+"citys", { find:'ByRegion', region:$(this).val() }, function(j){
				var options = "<option value=''>----------</option>";
				for (var i = 0; i < j.length; i++) {
					options += '<option value="' + j[i].id + '">' + j[i].name + '</option>';
				}
				$("select#_city_id").html(options);
				$("select#_city_id").siblings("div.selectArea").remove();
				
			});
		});
	}
	
	$('.left_content').append("<div class='ourGraphLeft'></div>");
	//all parts
	
	if ($.cookie('auth')!=1) {
		$('#buyHosting').click(function () {
			window.location.href="authorization.html";
		});
	}
	else {
		$('#buyHosting').click(function () {
			window.location.href="order_hosting.html";
		});
	};

	//$('div.notification').load('parts/notification.html');
	//$('div.admin_right_content').load('parts/admin_nav.html');
	
	$('a.delete_icon').click(function(e) {
		return confirm("Вы действительно хотите это сделать?");
	});
	$('a.delegateUrl').each(function () {
		$(this).attr('href', $(this).attr('href')+"&ajaxed=true");
	});
	$('a.delegateUrl').fancybox();
	
/*
	 $('.delete_icon').click(function(e) {
			e.preventDefault();
			$(this).parents('li').remove();
			if ($('.all_imgs ul li').length == 0) {
				 $('.all_imgs').parents('.the_files_cont').addClass('nullFiles');
			}
			$('.nullFiles').remove();
			if($('.my_files > div').length == 1) {
				$('.dommens_title').after("<div class='no_file'>У вас нет ни одного файла! Добавьте <a href='my_files_add_file.html'>файл.</a></div>");
			}
			if ( $('.domen_list > ul > li').length == 0) {
				$('.domen_list').remove();
			};
		 });
*/
	
	var imgsrc = $('.domains-bg-block').find('.hover-imgs-list');
	imgsrc.find('li:first-child').addClass('hover');
	$('.term-list li:first-child a').addClass('hover');
	var price = $('.prices-list');
	$('.prices-list li:first-child').addClass('hover');

	$('.term-list li a').each(function() {
		$(this).hover(function() {
			var c = $(this).parent().attr('class');
			$(this).addClass('hover');
			$(this).parent().prevAll().find('a').removeClass('hover');
			$(this).parent().nextAll().find('a').removeClass('hover');
			// alert(c);
			imgsrc.find('li').each(function() {
				var c2 = $(this).attr('class');
				if(c2 == c) {
					$(this).addClass('hover');
					$(this).prevAll().removeClass('hover');
					$(this).nextAll().removeClass('hover');
				}
			});

			price.find('li').each(function() {
				var c2 = $(this).attr('class');
				if(c2 == c) {
					$(this).addClass('hover');
					$(this).prevAll().removeClass('hover');
					$(this).nextAll().removeClass('hover');
				}
			});
			
		});
	});
	
	//childs in the page order-hosting
	 $('.the_tarif_info_in > ul > li:nth-child(odd), .the_list  > li:nth-child(odd)').addClass('odd');
	 $('.the_tarif_info_in > ul > li > div:nth-child(1)').addClass('first');
	 $('.the_tarif_info_in > ul > li > div:nth-child(2)').addClass('second');
	 $('.the_tarif_info_in > ul > li > div:nth-child(3)').addClass('third');
	 $('.order_hosting_the_tarifs  ul > li > div:nth-child(1)').addClass('first');
	 $('.order_hosting_the_tarifs  ul > li > div:nth-child(2)').addClass('second');
	 $('.order_hosting_the_tarifs  ul > li > div:nth-child(3)').addClass('third');
	 $('.order_hosting_the_tarifs  ul > li > div:nth-child(4)').addClass('fourth');
	 $('.order_hosting_the_tarifs  ul > li > div:nth-child(5)').addClass('fifth');
	 $('.order_hosting_the_tarifs  ul > li > div:nth-child(6)').addClass('sixth');
	 $('.order_hosting_the_tarifs  ul > li > div:nth-child(7)').addClass('seventh');
	 $('.order_hosting_the_tarifs  ul > li > div:nth-child(8)').addClass('eighth');
	 $('.my_domens .the_list li:nth-child(odd)').addClass('even');
	 $('tr:nth-child(odd)').addClass('odd even');
	/* $('.my_domens .the_list li > div:nth-child(1)').addClass('domen_id');
	 $('.my_domens .the_list li > div:nth-child(2)').addClass('domen_name');
	 $('.my_domens .the_list li > div:nth-child(3)').addClass('domen_owner');
	 $('.my_domens .the_list li > div:nth-child(4)').addClass('domen_status');
	 $('.my_domens .the_list li > div:nth-child(5)').addClass('domen_activ');
	 $('.my_domens .the_list li > div:nth-child(6)').addClass('domen_end');
	 $('.my_domens .the_list li > div:nth-child(7)').addClass('domen_options');*/
	 $('.domens_payment .the_list li:nth-child(odd)').addClass('even');
	 /*$('.domens_payment .the_list li > div:nth-child(1)').addClass('domen_id');
	 $('.domens_payment .the_list li > div:nth-child(2)').addClass('domen_name');
	 $('.domens_payment .the_list li > div:nth-child(3)').addClass('domen_owner');
	 $('.domens_payment .the_list li > div:nth-child(4)').addClass('domen_status');
	 $('.domens_payment .the_list li > div:nth-child(5)').addClass('domen_end');
	 $('.domens_payment .the_list li > div:nth-child(6)').addClass('domen_options');*/
	 $('.my_contacts .the_list li:nth-child(odd)').addClass('even');
	 /*$('.my_contacts .the_list li > div:nth-child(1)').addClass('domen_id');
	 $('.my_contacts .the_list li > div:nth-child(2)').addClass('domen_name');
	 $('.my_contacts .the_list li > div:nth-child(3)').addClass('domen_owner');
	 $('.my_contacts .the_list li > div:nth-child(4)').addClass('domen_activ');
	 $('.my_contacts .the_list li > div:nth-child(5)').addClass('domen_options');*/
	 $('.my_contacts_main .the_list li:first-child').find('.domen_options a:nth-child(2)').remove();
	 $('.my_contacts .the_list li:first-child').find('.domen_options a:nth-child(1)').removeClass('fleft');
	 $('.static_cont .the_list li:nth-child(odd)').addClass('odd');
	 $('.static_cont .the_list li > div:first-child, .domen_list_head ul li:first-child').addClass('first_child');
	 $('.static_cont .the_list li > div:nth-child(2), .domen_list_head ul li:nth-child(2)').addClass('second_child');
	 $('.static_cont .the_list li > div:nth-child(3), .domen_list_head ul li:nth-child(3)').addClass('third_child');
	 $('.static_cont .the_list li > div:nth-child(4), .domen_list_head ul li:nth-child(4)').addClass('fourth_child');
	 $('.last_actions_domen_list .the_list li:nth-child(odd)').addClass('odd');
	 $('.last_actions_domen_list .the_list li div:first-child, .domen_list_head ul li:first-child').addClass('first_child');
	 $('.the_notifications li:last-child').css('border-bottom', 'none');
	 $('.nth li:nth-child(odd)').addClass('odd');
	 /*$('.contracts .the_list li:nth-child(odd)').addClass('even');
	 $('.contracts .the_list li > div:nth-child(1)').addClass('domen_id');
	 $('.contracts .the_list li > div:nth-child(2)').addClass('domen_name');
	 $('.contracts .the_list li > div:nth-child(3)').addClass('domen_owner');
	 $('.contracts .the_list li > div:nth-child(4)').addClass('domen_status');
	 $('.contracts .the_list li > div:nth-child(5)').addClass('domen_end');
	 $('.contracts .the_list li > div:nth-child(6)').addClass('domen_options');*/
	 $('.show_internal_box .internalPanel > div:nth-child(odd)').addClass('odd');
	 if ($('.domen_list_head').length>1) {
		 $('.domen_list_head').each(function () {
			 var lile = $(this).find('.table_chapka > li').length;
			 $(this).find('.table_chapka > li').each(function () {
				 $(this).css('width', Math.round(90/lile)+"%");
			 });
			 $(this).next(".the_list").find('.listRow').each(function () {
				 //alert($(this).html());
				 $(this).find('div:not(.utilbox)').css('width', Math.round(90/lile)+"%");
			 });
		 });
	 } else if ($('.domen_list_head').length==1) {
         var lile = $('.table_chapka > li').length;
         $('.table_chapka > li, .listRow > div:not(.utilbox)').css('width', Math.round(90/lile)+"%");
	 }
	 
	 var dWidth = $('.domens_cont').width();
	 if(dWidth < 720) {
		 $('.hosting-list-cont').addClass('display');
	 }
	 else {
		 $('.hosting-list-cont').removeClass('display');
	 }
	 $(window).resize(function() {
		 var dWidth = $('.domens_cont').width();
		 if(dWidth < 720) {
			 $('.hosting-list-cont').addClass('display');
		 }
		 if (dWidth > 720) {
			 $('.hosting-list-cont').removeClass('display');
		 }
	 });
	 
	 $('.contact_info').find('select').addClass('drop_contacts');
	 
	 //rotate files
	 $('#rote_left').click(function (e) {
			e.preventDefault();
			$('#rotate').rotate(-90); 
		});
		$('#rote_right').click(function (e) {
			e.preventDefault();
			$('#rotate').rotate(+90);       									
		});
	//fancybox
	$('.fancy').fancybox({
		"autoDimensions":false,
		titlePosition:'outside'
	});
//text gradient for all pages	
	$('.gradient2').gradientText({
    	colors: ['#290909', '#FF3636']
	});
	//loader 
	$("a.loader").click(function (e) {
		e.preventDefault();
		runLoad($(this).attr('rel'), $(this).attr('href'), $(this).attr('action'));
	})	;
	//TABS
	$( "#add_domen_tabs" ).tabs({
		active:'0',
		show:"clip", //'blind', 'bounce', 'clip', 'drop', 'explode', 'fold', 'highlight',
		//'puff', 'pulsate', 'scale', 'shake', 'size', 'slide', 'transfer'.
		}); 
	$('.the_owner_contacts > .domen_list_head').find('a').click(function(e) {
		e.preventDefault();
	});
//vertical slider 
		$("input[type=text],input[type=password],input[type=search],textarea").focus(function (){
			$(this).addClass('focus');
		}).blur(function (){
			$(this).removeClass('focus');
		});
	function initAccordion () {
		 //accordion
		 $('.help_cont_in li > a:first-child').click(function (e) {
				e.preventDefault();
				$('.help_cont_in li div.opened').each(function () {$(this).removeClass("opened");});
				var div = $(this).next("div");
				div.addClass("opened");
				$('.help_cont_in li div:not(.opened)').each(function () {$(this).slideUp();});
				div.slideToggle();
			});
	}
	function initFancy () {
		//fancybox
		$('.fancy').fancybox({
			"autoDimensions":false,
			titlePosition:'outside'
		});
	}
	function initNotice () {
		//$('div.notification').load('parts/notification.html');
	}
	function runLoad(target, link, action) {
		$(target).fadeTo(0, 0.2);
		if (action=='load')
			$(target).load(link).delay(800);
		else if (action=='append') {
			$.get(link, function (data) {
				$(target).delay(800).append(data);
			});
		} else if (action=='prepend') {
			$.get(link, function (data) {
				$(target).prepend(data).delay(800);
			});
		}
		$(target).delay(800).fadeTo(0, 1);
	}
});
function reloadContacts() {
	$("select#_contact_id, select#_customer_id").html('<option>Loading...</option>');
	$.getJSON(siteurl+"contacts/listJson", { user:$("input#userSelect").val(), size:10000 }, function(j){
		var options = "";
		for (var i = 0; i < j.length; i++) {
			options += '<option value="' + j[i].id + '">' + j[i].contactName+ ', '+ j[i].organization + '</option>';
		}
		$("select#_contact_id, select#_customer_id").siblings("div.selectArea").remove();
		$("select#_contact_id, select#_customer_id").html(options).removeClass("outtaHere");
	});
}
