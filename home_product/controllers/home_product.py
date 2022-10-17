from odoo import http
from odoo.http import request
from odoo.addons.website.controllers.main import Website
from odoo.addons.website_sale.controllers.main import TableCompute
from odoo.addons.website.controllers.main import QueryURL


class WebsiteSaleInherit(Website):
    @http.route('/', type='http', auth="public", website=True, sitemap=True)
    def index(self, **kw):
        # prefetch all menus (it will prefetch website.page too)
        top_menu = request.website.menu_id

        homepage = request.website.homepage_id
        if homepage and (
                homepage.sudo().is_visible or request.env.user.has_group('base.group_user')) and homepage.url != '/':
            return request.env['ir.http'].reroute(homepage.url)

        website_page = request.env['ir.http']._serve_page()
        if website_page:
            # return website_page
            url = "/"
            category = request.env['product.public.category']
            pager = request.website.pager(url=url, total=12, page=0, step=12, scope=7, url_args={})
            product_main = request.env['product.template'].sudo().search([('is_published', '=', True),('public_categ_ids.name', 'like', 'Feature product')], order="create_date desc", limit=12)
            if product_main:
                products = product_main
            else:
                products = request.env['product.template'].sudo().search([('is_published', '=', True)], order="create_date desc", limit=12)
            keep = QueryURL('/shop', category=category and int(category), search='', attrib=[],
                            order={})

            values = {

                'pager': pager,

                'products': products,
                'bins': TableCompute().process(products, 12, 6),
                'ppg': 12,
                'ppr': 6,
                'keep': keep,

            }

            return request.render("home_product.home_products", values)

        else:
            first_menu = top_menu and top_menu.child_id and top_menu.child_id.filtered(lambda menu: menu.is_visible)
            if first_menu and first_menu[0].url not in ('/', '', '#') and \
                    (not (first_menu[0].url.startswith(('/?', '/#', ' ')))):
                return request.redirect(first_menu[0].url)

        raise request.not_found()
