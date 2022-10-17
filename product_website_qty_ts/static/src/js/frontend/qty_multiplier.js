odoo.define('product_website_qty_ts.qty_multiplier', function(require) {
    'use strict';

    var sAnimations = require('website.content.snippets.animation');
    var publicWidget = require('web.public.widget');
    var VariantMixin = require('sale.VariantMixin');
    var WebsiteSale = new sAnimations.registry.WebsiteSale();

    publicWidget.registry.WebsiteSale.include({
        _onClickAddCartJSON: function (ev) {
            ev.preventDefault();
            var $link = $(ev.currentTarget);
            var $input = $link.closest('.input-group').find("input");
            var $inputval = parseInt($input.val());
            var min = parseFloat($input.data("min") || 0);
            var maxval;
            if($link.parents('.td-qty').length > 0) {
                maxval = $link.parents('.td-qty').find('#qty_max').val();
            } else {
                maxval = $link.parents('#product_details').find('#qty_max').val();
            }
            var max = parseFloat($input.data("max") || Infinity);
            if(maxval) {
                var max = parseFloat($input.data("max") || maxval);
            }
            var qty_multiplier = 0;
            if($link.parents('.td-qty').length > 0) {
                qty_multiplier = parseInt($link.parents('.td-qty').find('#qty_multiplier').val());
                min = parseInt($link.parents('.td-qty').find('#qty_min').val() || 0);
            } else {
                qty_multiplier = parseInt($link.parents('#product_details').find('#qty_multiplier').val());
            }
            if ($inputval < max) {
                if(parseInt($input.val()%qty_multiplier) == 0) {
                    $inputval;
                } else {
                    var qty_operator = parseInt($input.val()%qty_multiplier);
                    var qty_new = qty_multiplier - qty_operator;
                    if(qty_multiplier > min && $inputval < min) {
                        $inputval = $inputval + qty_new;
                    } else {
                        $inputval = min;
                    }
                    $link.closest('.input-group').find("input").val($inputval);
                }
            } else {
                $inputval = max;
            }
            var previousQty = parseFloat($input.val() || 0, 10);
            var quantity = ($link.has(".fa-minus").length ? -qty_multiplier : qty_multiplier) + previousQty;
            var newQty = quantity > min ? (quantity < max ? quantity : max) : min;
            if($link.parents('.td-qty').length > 0) {
                if($link.parent().hasClass('input-group-prepend')) {
                    if(previousQty == min) {
                        newQty = 0;
                    }
                }
            }
            if (newQty !== previousQty) {
                $input.val(newQty).trigger('change');
            }
            return false;
        },
    });

    $(document).on('blur', '.quantity', function(event) {
        var $link = $(event.currentTarget);
        var $input = $link.closest('.input-group').find("input");
        var $inputval = parseInt($input.val());
        var min = parseFloat($input.data("min") || 0);
        var maxval;
        if($link.parents('.td-qty').length > 0) {
            maxval = $link.parents('.td-qty').find('#qty_max').val();
        } else {
            maxval = $link.parents('#product_details').find('#qty_max').val();
        }
        var max = parseFloat($input.data("max") || Infinity);
        if(maxval) {
            var max = parseFloat($input.data("max") || maxval);
        }
        var qty_multiplier = 0;
        if($link.parents('.td-qty').length > 0) {
            qty_multiplier = parseInt($link.parents('.td-qty').find('#qty_multiplier').val());
            min = parseInt($link.parents('.td-qty').find('#qty_min').val());
        } else {
            qty_multiplier = parseInt($link.parents('#product_details').find('#qty_multiplier').val());
        }

        if ($inputval < max) {
            if(parseInt($input.val()%qty_multiplier) == 0 && qty_multiplier >= min) {
                $inputval;
                if($link.parents('#product_details').length > 0) {
                    if($inputval == 0) {
                        if (qty_multiplier < min) {
                            $inputval = min;
                        } else {
                            $inputval = qty_multiplier;
                        }
                    }
                }
            } else {
                if(qty_multiplier < min && $inputval < min) {
                    if($link.parents('.td-qty').length > 0) {
                        if(qty_multiplier == 1 && $inputval == 0) {
                            $inputval = 0;
                        } else {
                            $inputval = min;
                        }
                    } else {
                        $inputval = min;
                    }
                } else {
                    var qty_operator = parseInt($input.val()%qty_multiplier);
                    var qty_new = qty_multiplier - qty_operator;
                    if (qty_operator > 0 ){
                        $inputval = $inputval + qty_new;    
                    }
                }
                $link.closest('.input-group').find("input").val($inputval);
            }
        } else {
            $inputval = max;
        }
        var previousQty = parseFloat($input.val() || 0, 10);
        var quantity = ($link.has(".fa-minus").length ? -qty_multiplier : qty_multiplier) + previousQty;
        var newQty = quantity > min ? (quantity < max ? quantity : max) : min;
        if($link.parents('.td-qty').length > 0) {
            if($link.parent().hasClass('input-group-prepend')) {
                if(previousQty == min) {
                    $inputval = 0;
                }
            }
        }
        $input.val($inputval).trigger('change');
        return false;
    });
});
