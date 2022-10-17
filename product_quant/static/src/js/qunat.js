odoo.define('product_quant.qunat', function (require) {
'use strict';

var core = require('web.core');
var config = require('web.config');
var publicWidget = require('web.public.widget');
var VariantMixin = require('sale.VariantMixin');
var wSaleUtils = require('website_sale.utils');
const wUtils = require('website.utils');
require("web.zoomodoo");
require('website_sale.website_sale');

publicWidget.registry.WebsiteSale.include({


    events: _.extend({}, VariantMixin.events || {}, {
        'change form .js_product:first input[name="add_qty"]': '_onChangeAddQuantity',
        'mouseup .js_publish': '_onMouseupPublish',
        'touchend .js_publish': '_onMouseupPublish',
        'change .oe_cart input.js_quantity[data-product-id]': '_onChangeCartQuantity',
        'click .oe_cart a.js_add_suggested_products': '_onClickSuggestedProduct',
        'click a.js_add_cart_json': '_onClickAddCartJSON',
        'click .a-submit': '_onClickSubmit',
        'change form.js_attributes input, form.js_attributes select': '_onChangeAttribute',
        'mouseup form.js_add_cart_json label': '_onMouseupAddCartLabel',
        'touchend form.js_add_cart_json label': '_onMouseupAddCartLabel',
        'click .show_coupon': '_onClickShowCoupon',
        'submit .o_wsale_products_searchbar_form': '_onSubmitSaleSearch',
        'change select[name="country_id"]': '_onChangeCountry',
        'change #shipping_use_same': '_onChangeShippingUseSame',
        'click .toggle_summary': '_onToggleSummary',
        'click #add_to_cart, #buy_now, #products_grid .o_wsale_product_btn .a-submit': 'async _onClickAdd',
        'click input.js_product_change': 'onChangeVariant',
        'change .js_main_product [data-attribute_exclusions]': 'onChangeVariant',
        'change oe_optional_products_modal [data-attribute_exclusions]': 'onChangeVariant',
        'click .a-submit_new': '_onClickSubmitnew',
    }),

//events: {
//
//
//'click .a-submit_new': '_onClickSubmitnew',
//
//
//},

    _onClickSubmitnew: function (ev, forceSubmit) {
        var form = $(ev.currentTarget).closest('form')
        var qty = parseInt(form.find('input[name="add_qty"]').val())
        if ($(ev.currentTarget).is('#add_to_cart, #products_grid .a-submit') && !forceSubmit) {
            return;
        }
        var $aSubmit = $(ev.currentTarget);
        if (!ev.isDefaultPrevented() && !$aSubmit.is(".disabled")) {
            ev.preventDefault();
            $aSubmit.closest('form').submit();
        }
        if ($aSubmit.hasClass('a-submit-disable')){
            $aSubmit.addClass("disabled");
        }
        if ($aSubmit.hasClass('a-submit-loading')){
            var loading = '<span class="fa fa-cog fa-spin"/>';
            var fa_span = $aSubmit.find('span[class*="fa"]');
            if (fa_span.length){
                fa_span.replaceWith(loading);
            } else {
                $aSubmit.append(loading);
            }
        }

         var $qtyNavBar = $(".my_cart_quantity");
         var init_cart_qty = parseInt($qtyNavBar[0].textContent)
         var total_qty = init_cart_qty+qty
        _.each($qtyNavBar, function (qty) {
            var $qty = $(qty);
            $qty.parents('li:first').removeClass('d-none');
            $qty.html(total_qty).hide().fadeIn(600);
        });
        alert("Product Added Successfully")
        form.find('input[name="add_qty"]').val(1)
        if (form.find('a[title="Shopping cart"]').css("background-color")=="rgb(165, 128, 109)"){

            form.find('a[title="Shopping cart"]').css('background-color','#82b735 !important;');
        }else{

            form.find('a[title="Shopping cart"]').css('background-color','#a5806d;');
        }

    },



});

















});
