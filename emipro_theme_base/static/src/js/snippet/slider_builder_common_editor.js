odoo.define('slider.builder.common.editor', function (require) {
'use strict';

    var ajax = require('web.ajax');
	var publicWidget = require('web.public.widget');

	publicWidget.registry.sliderEditorCommonEpt = publicWidget.Widget.extend({
        selector: "#wrapwrap",
    	disabledInEditableMode: false,
		edit_events: {
			/* Common Methods For Category, Brand And Product Slider */
			'click .js_category_brand_snippet,.js_slider_snippet' : 'initSliderView', // Show The Configuration Popup
			'click .js-configuration-selection' : '_onClickProductSelection', // Configuration Section
			'click .js-layout-selection' : '_onClickLayoutSelection', // UI Layout Section
			'click .slider_style_option a,.slider_sort_option a,.slider_filter_option a' : '_activeAndPreview', // Change the Preview while changing the Style
			'click .js-save-config' : '_clickSaveConfiguration', // Save The Configuration
			'click .js-next-btn' : '_clickNext', // Display Layout Section
			'change .ui-configuration .limit' : '_onChangeLimit',// Change the preview while changing the limit
			'keydown .ui-configuration .limit' : '_onKeydownLimit',// Don't allow to add number manually
			'click .configure-sub-header .user_guide' : '_onClickUserGuide',// Don't allow to add number manually
			/* Common Methods For Category, Brand And Product Slider */

			/* Product Slider Methods */
			'click .product-config-content':'_onClickConfigContent', //Select the product slider type
			'click .product-config-icon' : '_onClickConfigIcon', // Configuration icon
			'keyup .js_input_item' : '_onKeyupInput', // Product search
			'click .js_item_box' : '_onClickBox',
			'click .js_item_box .product-close' : '_onClickBoxClose',
			'click .js_slider_type' : '_onClickSliderType', // Clicking on slider style (list,grid,slider)
			/* Product Slider Methods */

			/* Brand, Category slider method */
            'click .category_brand_option .js_item_data': '_onClickCategoryBrand', // Toggle active class
            'click .category_brand_option .js_load_more_button': '_onClickLoadmore', // Load more category or Brand
		},
		/*  Product Slider Methods  */
		_onClickConfigContent: function (ev) {
			$(".div_sort_by").hide()
			$('.product-config-content,.product-configure').removeClass('active')
            $(ev.currentTarget).addClass('active')
            $(".product-configure").removeClass('d-none')
            name= $(ev.currentTarget).attr('data-value')
            this.sliderTarget.attr("data-name",name)
            if (name === 'custom-domain' || name === 'brand-slider' || name === 'category-slider'){
            	$(".product_configure_model .div_sort_by").show()
            } else {
                if(!$('.layout-configure .slider_limit_option').length) {
                    $('.product_ui_configure_template .js-conf-bottom').hide();
                }
            }
            this.loadProductSection()
		},
		//Change the preview while changing in (Wishlist,add to cart,quick-view etc.)
		_onClickConfigIcon : function(ev){
			$(ev.currentTarget).toggleClass('active')
			this.getSliderPreview()
		},
		_onClickBoxClose: function(ev){
			$(ev.currentTarget).parents('.product-main').remove();
		},
		_onClickBox: function(ev){
			$('.js_input_item').focus();
		},
		_onKeyupInput: function(ev){
			var val = $(ev.currentTarget).val()
			if(val.length == 0){
				$("#js_item").empty().removeClass('show')
			}
			if(val.length >= 1 && ev.keyCode  != 13){
                var product_ids = [];
                $('li.js_items').each(function(){
                      product_ids.push($(this).val());
                });
                this.appendData(val,product_ids)
                var child_height = $('.product_slider_configure_template').height();
                var parent_height = $('.slider-configure').height() + 60;
                if(child_height > parent_height) {
                    $(this).parents('.product-box').addClass('custom-height')
                }
			}
		},
		appendData: function(key,exclude_products){
			var max = $('.ui-configure input[name="limit"]').attr('max') || this.limit
			max = parseInt(max)
			if(exclude_products.length >= max){
				$("#js_item").empty().removeClass('show')
				alert("You Can't Add the more products")
				return
			}
			ajax.jsonRpc('/get-suggested-products', 'call',{'key':key,'exclude_products':exclude_products}).then(function(data) {
				$("#js_item").empty().removeClass('show')
				$('#js_item').addClass('dropdown-menu show')
				$("#js_item").html(data)
				// Add the product as list item
				$(".input-item-link").on('click',async function (ev) {
					var val = $(this).attr('data-item_id');
					var name = $(this).attr('data-item_name');
					$(".js_new_item").after('<li class="js_items products media align-items-center product-main" value ='+val+' data-item_id ='+val+'>'+$(this).html()+'</li>');
					$('.js_input_item').val('')
					$("#js_item").empty().removeClass('show')
				});
            })
		},
		_onClickLoadmore: function(ev){
			ev.preventDefault();
			var target = ev.currentTarget
			var loaded_items = $(ev.currentTarget).attr('loaded_items')
			var items_count = $(ev.currentTarget).attr('items_count') || 0
			var item_ids = this.sliderTarget.attr('data-item_ids') || false;
			var name = this.sliderTarget.attr("data-name") || false;
			ajax.jsonRpc('/load-more-category-brand', 'call',{'name':name,'loaded_items':loaded_items,'item_ids':item_ids}).then(function(data) {
				if(data && data.response){
					$('.item_data').append(data.response)
					$(target).attr('loaded_items',data.loaded_items)
					if(data.loaded_items >= parseInt(items_count)){
					  $(target).addClass('d-none')
					}
				}
				else{
				$(target).addClass('d-none')
				}
            })
		},
		loadProductSection: function(){
			var self = this
			var name = self.sliderTarget.attr("data-name") || false;
			var target = self.sliderTarget
			var limit = self.limit
			$('.js-layout-selection,.js-next-btn').removeClass('disabled')
			ajax.jsonRpc('/get-product-list', 'call',{'name': name, 'limit': limit}).then(function(data) {
				if (data && data.error){
					data.error && $('.js-layout-selection,.js-next-btn').addClass('disabled')
				}
				if(data){
					$(".product-configure-section").html(data.template_data)
					$(function() {
						$(".js_item_box").sortable({
							items: "li:not(.js_new_item)",
							containment: "parent",
							scrollSpeed: 100
						});
						$(".js_item_box").disableSelection();
					});
					$('.category-discount input[type="checkbox"]').on('click', function(ev) {
						ev.stopImmediatePropagation();
						var checked = (ev.currentTarget.checked) ? false : true;
						ev.currentTarget.checked=(checked) ? false : checked.toString();
					});
					if (name == 'custom-domain')
					{
						var filter_id = target.attr('data-filter_id');
						if($('.slider_filter_option  .dropdown-item[data-filter="'+filter_id +'"]').length > 0){
							$('.slider_filter_option  .dropdown-item[data-filter="'+filter_id +'"]').trigger('click')
						}
						else{
							$('.slider_filter_option .dropdown-item').first().click();
						}
					}
					if (name == 'product-category-discount'){
						var item_ids = target.attr('data-item_ids') || false;
						var discount_policy = target.attr('data-discount_policy')
						if(item_ids.length){
							item_ids = item_ids.split(',').map(function(e) {return +parseInt(e)})
							$('.slider_category_list').val(item_ids).click()
						}
						else {
							$(".slider_category_list").val($(".slider_category_list option:first").val());
						}
						if(discount_policy == 'discounts') {
							$('.category-discount input:checkbox').click()
						}
					}
					if (name == 'manual-configuration'){
						var item_ids = target.attr('data-item_ids') || false;
						item_ids && self.displayProducts(item_ids)
					}
				}
            });
		},
		displayProducts: function(item_ids){
			item_ids = item_ids.split(',').map(function(e) {return +parseInt(e)})
        	ajax.jsonRpc('/get-products-of-slider', 'call' , {'item_ids': item_ids,}).then(function(data) {
            	if (data){
            		$(".js_new_item").after(data)
                }
           })
		},

		/*  Product Slider Methods  */
		// Initialize and display the slider
		initSliderView: function(ev,show_popup) {
			if (!show_popup){
				return
			}
			$('.cus_theme_loader_layout').removeClass('d-none')
			$("#product_configure_model_main").empty()
			this.sliderTarget = $(ev.currentTarget) || false
			var name = $(ev.currentTarget).attr("name") || false;
			/** set limit for products if exclude from slider style */
			this.limit = 20
			if (this.sliderTarget.data('exclude')) {
			    var exclude = this.sliderTarget.data("exclude") || false;
			    exclude = exclude ? exclude.split(',') : [];
			    if($.inArray('data-limit', exclude) >= 0) {
			        this.limit = this.sliderTarget.data('limit');
			    }
			}
			this.showPopup()
        },

        // Category Slider Popup
		showPopup: function () {
			var self = this
			var name = self.sliderTarget.attr("name") || false;
			var item_ids = self.sliderTarget.attr('data-item_ids') || false;
			var limit = self.limit;
			var exclude = self.sliderTarget.data("exclude") || false;
			exclude = exclude ? exclude.split(',') : [];
			ajax.jsonRpc('/get-slider-builder-popup','call',{'name' : name,'item_ids':item_ids, 'exclude':exclude, 'limit':limit, }).then(function(data) {
				$("#product_configure_model_main").html(data)
				$('.cus_theme_loader_layout').addClass('d-none')
				$('#product_configure_model').modal('show');
				name = name === 'product-slider'? $('.product_configure_model .product-config-content').first().attr('data-value'): name
				$('#product_configure_model').on('shown.bs.modal', function (ev) {
                	$('.product_configure_model .slider-configure').click()
                	$('.product_configure_model h4').first().click()
                })
                if($('.product_configure_model .product-config-content').length > 0){
                	$('.product_configure_model .product-config-content[data-value="'+name+'"]').click()
                }
                $('.ui-configuration input[type="checkbox"]').on('click', function(ev) {
					ev.stopImmediatePropagation();
					var checked = (ev.currentTarget.checked) ? false : true;
					ev.currentTarget.checked=(checked) ? false : checked.toString();
					self.getSliderPreview()
				});

				var item_ids = self.sliderTarget.attr('data-item_ids') || false;
				var style = self.sliderTarget.attr('data-style') || false;
				var sort_by = self.sliderTarget.attr('data-sort_by') || false;
				var limit = self.sliderTarget.attr('data-limit') || '10';
				var product_count = self.sliderTarget.attr('data-product_count') || false; discount_policy
                item_ids = item_ids ? item_ids.split(',').map(function(e) {return +parseInt(e)}) : item_ids
                style ? $(".product_configure_model .slider_style_option a[data-style='"+style+"']").first().click() : $(".product_configure_model .slider_style_option a").first().click()
                sort_by && $(".product_configure_model .slider_sort_option a[data-sort_by='"+sort_by+"']").first().click()
                $('.product_configure_model input[name="limit"]').val(limit)
                // Brand And Category Slider
                if(name === 'brand-slider' || name === 'category-slider'){
                	if(item_ids && item_ids.length > 0) {
                		$('.category_brand_option .category_brand_selection').removeClass('active')
						$('.category_brand_option .category_brand_selection').each(function(i, obj) {
							if(item_ids.includes(parseInt($(this).attr('item-id')))){
									$(this).addClass('active')
							}
						});
						if(product_count === '1') {
							$('.product_configure_model input[name="product_count"]').prop("checked", true);
						}
                	} else {
                		$('.category_brand_option .category_brand_selection').first().click()
						$('.product_configure_model .slider_items_list').val($('.product_configure_model .slider_items_list option').first().val()).click()
						$(".product_configure_model .slider_style_option a").first().click()
					}
                } else {
					var discount_policy = self.sliderTarget.attr('data-discount_policy') || false;
					var ui_option = self.sliderTarget.attr('data-ui_option') || false;
					var slider_type = self.sliderTarget.attr('data-slider_type') || $('.product_ui_configure_template .slider_style_option a').first().attr('data-slider_type');
					// If User Edit the slider Then Add that as selected
					if($('.product_ui_configure_template .js_slider_type.disabled[data-slider_type="'+slider_type+'"]').length > 0 ){
						var style = $('.product_ui_configure_template .slider_style_option a').first().attr('data-slider_type')
						$('.product_ui_configure_template .js_slider_type[data-slider_type="'+style+'"]').click()
					} else {
						$('.product_ui_configure_template .js_slider_type[data-slider_type="'+slider_type+'"]').trigger('click',{'not_change_style':true})
					}

                    if(style){
                        $('.slider-ui-icon .product-config-icon').removeClass('active')
                        if (ui_option){
                            ui_option = ui_option.split(',')
                            $('.slider-ui-icon .product-config-icon').each(function(i, obj) {
                                if(ui_option.includes($(this).data('value'))){
                                    $(this).addClass('active')
                                }
                            });
                        }
                    }
					discount_policy && discount_policy === 'discount' ? $('.product_configure_model input[name="discount_policy"]').prop("checked", true) : $('.product_configure_model input[name="discount_policy"]').prop("checked", false)
					$('.product_ui_configure_template .js_style_type[data-slider_type="'+slider_type+'"]').addClass('active')
                }
			});
		},

		// Show the configuration section
		_onClickProductSelection: function (ev) {
			$('.configure-selection').removeClass('active')
			$('.product_configure_model .js-next-btn').removeClass('d-none')
			$('.product_configure_model .js-save-config').addClass('d-none')
            $(ev.currentTarget).addClass('active')
            $('.product_ui_configure_template').hide();
            $('.product_slider_configure_template').show();
		},
		// Show the UI section
		_clickNext: function(ev) {
			$('.product_configure_model .js-layout-selection').click()
		},

        // Show the UI section
		_onClickLayoutSelection: function (ev) {
			var self =  this
			$('.configure-selection').removeClass('active')
			$('.product_configure_model .js-next-btn').addClass('d-none')
			$('.product_configure_model .js-save-config').removeClass('d-none')
            $(ev.currentTarget).addClass('active')
            $('.product_slider_configure_template').hide();
            $('.product_ui_configure_template').show();
			$(".product_configure_model .slider_style_option a.active").click()
			if(!$('.layout-configure .slider_style_option').length) {
                self.getSliderPreview();
            }
		},

		// Change the slider type
		_onClickSliderType: function (ev,not_change_style=false) {
			$('.slider_style_option a').hide()
			$('.js_slider_type').removeClass('active')
			$(ev.currentTarget).addClass('active')
            var val =$(ev.currentTarget).attr('data-slider_type')
			$(".slider_style_option a[data-slider_type='"+val+"']").show()
			! not_change_style && $(".slider_style_option a[data-slider_type='"+val+"']").first().click()
			! not_change_style && this.getSliderPreview()
		},
		// Toggle class active for category and brand selection
		_onClickCategoryBrand: function(ev) {
			var target = this.sliderTarget
			var name = target.attr('data-name')
			var item_ids = this.getItemIds(name)
			var max = $('.ui-configure input[name="limit"]').attr('max') || 20
			max = parseInt(max)
			if(item_ids && item_ids.length >= max && !$(ev.currentTarget).hasClass('active')){
				alert("You Can't Select the more Item(s)")
				return
			}
		    $(ev.currentTarget).toggleClass('active')

		},
		_onChangeLimit : function(ev){
			this.getSliderPreview()
		},
		_onKeydownLimit : function(ev){
			if ($.inArray(ev.keyCode,[38,40]) == -1){
				ev.preventDefault();
			}
		},
		_onClickUserGuide: function(ev) {
		    var link = $(ev.currentTarget).attr('href');
		    window.open(link, '_blank');
		},
		// Display Preview
		_activeAndPreview: function (ev) {
			$(ev.currentTarget).parentsUntil( ".slider-dropdown" ).find("a").removeClass('active');
            $(ev.currentTarget).addClass('active');
            $(ev.currentTarget).parentsUntil( ".dropdown_div" ).find('.slider-dropdown-button').text($(ev.currentTarget).text());
            this.getSliderPreview()
		},

		// Save Configuration
		_clickSaveConfiguration: function (ev) {
			ev.preventDefault();
			this.SaveSliderConfiguration()
		},
		// Save Configuration For the Category and Brand Slider
		SaveSliderConfiguration : function(){
			var self = this;
			var target = this.sliderTarget
			var name = target.attr('data-name')
			var exclude = target.data('exclude') || false;
			var attributes = ["data-item_ids","data-slider_type","data-style","data-sort_by","data-limit","data-ui_option","data-product_count","data-discount_policy"]
			if (exclude) {
			    exclude = exclude.split(',');
                attributes = attributes.filter( function( el ) {
                    return !exclude.includes( el );
                });
            }
            attributes = attributes.toString().replace(/,/g, " ")
			target.removeAttr(attributes)
            var item_ids = this.getItemIds(name)
            var style = $('.slider_style_option a.active').attr('data-style') || false
            var slider_type = $('.product_ui_configure_template .js_slider_type.active').attr('data-slider_type') || false
            var sort_by = $('.slider_sort_option a.active').attr('data-sort_by') || false
            var limit = $('.product_ui_configure_template input[name="limit"]').val() || false
            var ui_option = [];
            $('.product_ui_configure_template .product-config-icon.active').each(function(){
                   ui_option.push($(this).data('value'));
            });
            item_ids.length > 0 && target.attr("data-item_ids", item_ids);
            style && target.attr("data-style", style);
            ui_option.length > 0 && target.attr("data-ui_option", ui_option);
            slider_type && target.attr("data-slider_type", slider_type);
            sort_by && target.attr("data-sort_by", sort_by);
            limit && target.attr("data-limit", limit);
            target.attr("name", name);
            $('.ui-configuration input[name="product_count"]').length > 0 && target.attr("data-product_count",$('.ui-configuration input[name="product_count"]:checked').length > 0 ? '1':'0')
            $('.category-discount input[type="checkbox"]').length > 0 && target.attr("data-discount_policy",$('.category-discount input[type="checkbox"]:checked').length > 0 ? 'discounts':'products')
            $('#product_configure_model').modal('hide');
		},
		getItemIds: function(name){
			var item_ids = []
			if (name === 'manual-configuration'){
            	$('.product-box .products').each(function(){
                     item_ids.push($(this).attr('data-item_id'));
                });
            }
            if (name === 'product-category-discount'){
            	item_ids = $('.category-discount .slider_category_list').val()
            }
            if (name === 'custom-domain'){
            	item_ids = $(".slider_filter_option .dropdown-item.active").attr('data-filter')
            }
            if(name === 'brand-slider' || name === 'category-slider'){
            	$('.category_brand_option .category_brand_selection.active').each(function(){
                     item_ids.push($(this).attr('item-id'));
                });
            }
            return item_ids
		},

		// Show Slider Preview
		getSliderPreview : function(){
			var self = this
			var name = this.sliderTarget.attr("data-name") || false;
			var style = $('.ui-configuration .slider_style_option a.active').attr('data-style')
			if(!$('.layout-configure .slider_style_option').length) {
                style = this.sliderTarget.attr("data-style") || false;
            }
			var slider_type = $('.product_ui_configure_template .js_slider_type.active').attr('data-slider_type') || false
			var item_ids = this.getItemIds(name)
            var sort_by = $('.slider_sort_option a.active').attr('data-sort_by')
            var limit = $('.ui-configuration input[name="limit"]').val()
            if(!$('.layout-configure .slider_limit_option').length) {
                limit = this.sliderTarget.attr("data-limit") || false;
            }
            var product_count = $('.ui-configuration input[name="product_count"]:checked').length > 0 ? '1':'0'
            var discount_policy = $('.category-discount input[type="checkbox"]').length>0 ? $('.category-discount input[type="checkbox"]:checked').length > 0 ? 'discounts':'products' : false
            var ui_option = [];
            $('.product_ui_configure_template .product-config-icon.active').each(function(){
                   ui_option.push($(this).data('value'));
            });
            var params =  {
                'name':name,
                'style':style,
                'item_ids':item_ids,
                'sort_by':sort_by,
                'limit':limit,
                'product_count':product_count,
            }
            slider_type ? params['slider_type'] = slider_type : false
            discount_policy ? params['discount_policy'] = discount_policy :false
            ui_option ? params['ui_options'] = ui_option :false
        	if(name === 'brand-slider' || name === 'category-slider'){
				ajax.jsonRpc('/slider/category-brand-render', 'call',params).then(function (data) {
					$(".product-configure-section-preview").html(data)
					$(".product-configure-section-preview").find('.slider_edit_msg').toggleClass('d-none', true);
					$('.category_carousel,.brand_carousel').owlCarousel({
						loop: false,
						rewind: true,
						margin: 10,
						rtl : false,
						nav: true,
						lazyLoad:true,
						dots: false,
						autoplay: true,
						autoplayTimeout: 4000,
						navText : ['<i class="fa fa-angle-left"></i>','<i class="fa fa-angle-right"></i>'],
						autoplayHoverPause:true,
						items: 6,
						responsive: {
							775: {
								items:3,
							},
						}
					});
					if($('#id_lazyload').length) {
                        $("img.lazyload").lazyload();
                    }
				})
        	}
            else{
            	if(name !== 'custom-domain'){
            		params['sort_by'] = false
            	}
				ajax.jsonRpc('/slider/render', 'call',params).then(function (data) {
					$(".product-configure-section-preview").html(data)
					$(".product-configure-section-preview").find('.slider_edit_msg').toggleClass('d-none', true);
					var owl_rtl = false;
                    if ($('#wrapwrap').hasClass('o_rtl')) {
                        owl_rtl = true;
                    }
					$('.te_product_slider_1, .te_slider_style_2_right_pannel, .te_product_slider_5, .te_slider_style_6').owlCarousel({
                        loop: false,
                        rtl: owl_rtl,
                        margin: 10,
                        nav: true,
                        lazyLoad:true,
                        dots: false,
                        navText : ['<i class="fa fa-angle-left"></i>','<i class="fa fa-angle-right"></i>'],
                        autoplay: $('.te_auto_play_value span').text() == "True" ? true : false,
                        autoplayTimeout: 4000,
                        autoplayHoverPause:true,
                        items: 4,
                        responsive: {
                            0: {
                                items: 1,
                            },
                            576: {
                                items: 1,
                            },
                            991: {
                                items: 2,
                            },
                            1200: {
                                items: 2,
                            },
                        },
                    });
                    $('.te_product_slider_4').owlCarousel({
                        loop: false,
                        rtl: owl_rtl,
                        margin: 10,
                        nav: true,
                        lazyLoad:true,
                        dots: false,
                        navText : ['<i class="fa fa-angle-left"></i>','<i class="fa fa-angle-right"></i>'],
                        autoplay: $('.te_auto_play_value span').text() == "True" ? true : false,
                        autoplayTimeout: 4000,
                        autoplayHoverPause:true,
                        items: 1,
                        responsive: {
                            991: {
                                items: 1,
                            },
                            1200: {
                                items: 1,
                            },
                        },
                    });
                    $('.te_product_slider_banner').each(function(index) {
                        var $items = $(this);
                        var items = $items.find(".item").length;
                        $items.owlCarousel({
                            loop: true,
                            rtl: owl_rtl,
                            nav: false,
                            lazyLoad:true,
                            autoplay: true,
                            autoplayTimeout: 4000,
                            autoplayHoverPause:true,
                            items: items > 1 ? true : false,
                        });
                    });
                    $('.te_slider_style_7, .te_slider_style_8').each(function(index) {
                        var $items = $(this);
                        var items = $items.find(".product-rows").length;
                        $items.owlCarousel({
                            rtl: owl_rtl,
                            nav: false,
                            lazyLoad:true,
                            autoplay: true,
                            autoplayTimeout: 4000,
                            autoplayHoverPause:true,
                            loop: items > 1 ? true : false,
                            items: 1,
                            itemClass: 'owl-item container-fluid',
                        });
                    });
                    if($('#id_lazyload').length) {
                        $("img.lazyload").lazyload();
                    }
				});
            }
		},
	});
	return publicWidget.registry.sliderEditorCommonEpt;
});