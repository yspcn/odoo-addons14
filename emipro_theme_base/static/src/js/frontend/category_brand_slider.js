//----------------------------------------------------
// Dynamic Brand Category Slider Snippet
//----------------------------------------------------
odoo.define('website_category_brand_slider.front_js', function (require) {
    'use strict';
    var publicWidget = require('web.public.widget');
    var ajax = require("web.ajax");
    publicWidget.registry.js_category_brand_snippet = publicWidget.Widget.extend({
        selector: '.js_category_brand_snippet',
        start: function () {
            this.redrow();
        },
        stop: function () {
            this.clean();
        },
        redrow: function (debug) {
            this.clean(debug);
            this.build(debug);
        },
        destroy: function () {
        	this.$el.find('.slider_body').toggleClass('d-none', true);
        	this.$el.find('.slider_edit_msg').toggleClass('d-none', false);
        	this._clearContent();
        	this._super.apply(this, arguments);
    	},
        _clearContent: function () {
			const $dynamicSnippetTemplate = this.$el.find('.slider_body');
			if ($dynamicSnippetTemplate) {
				$dynamicSnippetTemplate.html('');
			}
    	},
        clean: function (debug) {
            this.$target.empty();
        },
        build: function (debug) {
            var self = this;
            var item_ids = self.$target.attr("data-item_ids");
            var name = self.$target.attr("name");
            var style = self.$target.attr('data-style')
            var sort_by = self.$target.attr('data-sort_by')
            var limit = self.$target.attr('data-limit')
            var product_count = self.$target.attr('data-product_count')

            var params =  {
            'name':name,
            'style':style,
            'item_ids':item_ids,
            'sort_by':sort_by,
            'limit':limit,
            'product_count':product_count,
            }
            // Render category and brand slider
            ajax.jsonRpc('/slider/category-brand-render', 'call',params).then(function (data) {
                $(self.$target).html(data);
				self.$target.find('.slider_edit_msg').toggleClass('d-none', true);
                $('.brand_slider_template_3 .brand_carousel').each(function(index) {
                    var $items = $(this);
                    var items = $items.find(".item").length;
                    $items.owlCarousel({
                        loop: items > 3 ? true : false,
                        margin: 10,
                        rtl : false,
                        nav: true,
                        lazyLoad:true,
                        dots: false,
                        autoplay: true,
                        autoplayTimeout: 4000,
                        navText : ['<i class="fa fa-angle-left"></i>','<i class="fa fa-angle-right"></i>'],
                        autoplayHoverPause:true,
                        items: 3,
                        responsive:{
                            0: {
                                items: 2,
                                loop: items > 2 ? true : false,
                            },
                            576: {
                                items: 3,
                                loop: items > 3 ? true : false,
                            },
                            992: {
                                items: 2,
                                loop: items > 2 ? true : false,
                            },
                            1300: {
                                items: 3,
                                loop: items > 3 ? true : false,
                            }
                        }
                    });
                })

                $('.category_carousel,.brand_carousel').each(function(index) {
                    var $items = $(this);
                    var items = $items.find(".item").length;
                    $items.owlCarousel({
                        loop: items > 6 ? true : false,
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
                            0: {
                                items: 2,
                                loop: items > 2 ? true : false,
                            },
                            576: {
                                items: 3,
                                loop: items > 3 ? true : false,
                            },
                            991: {
                                items: 4,
                                loop: items > 4 ? true : false,
                            },
                            1200: {
                                items: 6,
                                loop: items > 6 ? true : false,
                            }
                        }
                    });
                })
                if($('#id_lazyload').length) {
                    $("img.lazyload").lazyload();
                }
            })
        },
    })
})