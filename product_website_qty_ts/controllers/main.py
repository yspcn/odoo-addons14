from odoo import fields, http, tools, _
from odoo.http import request
from odoo.addons.website_sale.controllers.main import WebsiteSale


class WebsiteSaleQty(WebsiteSale):

    @http.route(['/shop/cart/update'], type='http', auth="public", methods=['GET', 'POST'], website=True, csrf=False)
    def cart_update(self, product_id, add_qty=1, set_qty=0, **kw):
        product = request.env['product.product'].sudo().browse(int(product_id))
        qty_multiplier = product.product_tmpl_id.qty_multiplier or 1
        qty_min = product.product_tmpl_id.qty_min or 1
        qty_max = product.product_tmpl_id.qty_max or float('Inf')
        add_qty = int(add_qty)
        new_cart_qty = add_qty
        
        if add_qty < qty_max:
            if add_qty % qty_multiplier == 0 and qty_multiplier >= qty_min:
                new_cart_qty = add_qty
            else:
                if qty_multiplier < qty_min:
                    if add_qty < qty_min:
                        new_cart_qty = qty_min
                    else:
                        new_cart_qty = add_qty    
                else:
                    qty_operator = add_qty % qty_multiplier
                    qty_new = qty_multiplier - qty_operator
                    if qty_operator > 0:
                        new_cart_qty = add_qty + qty_new
        else:
            new_cart_qty = qty_max
        sale_order = request.website.sale_get_order()
        order_line = sale_order and sale_order._cart_find_product_line(int(product_id), **kw)[:1] or request.env["sale.order.line"]
        line_qty = order_line.product_uom_qty
        total_qty = line_qty+new_cart_qty
        if order_line and line_qty >= qty_max:
            new_cart_qty = 0
        elif total_qty >= qty_max:
            new_cart_qty = qty_max - line_qty

        if order_line and line_qty >= qty_min and add_qty == 1 and line_qty < qty_max:
            new_cart_qty = qty_multiplier or 1

        res = super(WebsiteSaleQty, self).cart_update(product_id=product_id, add_qty=new_cart_qty, set_qty=set_qty, **kw)
        return res
