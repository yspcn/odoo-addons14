from odoo import http
from odoo.http import request


class AboutUs(http.Controller):
    @http.route('/aboutus', type='http', auth='public', website=True)
    def about_us(self , **kwargs):

        return request.render('website_clone.aboutus', {})

    @http.route('/terms', type='http', auth='public', website=True)
    def terms(self, **kwargs):

        return request.render('website_clone.terms', {})

    @http.route('/faq', type='http', auth='public', website=True)
    def faq(self, **kwargs):
        return request.render('website_clone.faq', {})

    @http.route('/sela_cust_register', type='http', auth='public', website=True)
    def cust_register(self, **post):
        partner = request.env['res.partner'].sudo().search([])

        if post and request.httprequest.method == 'POST':
            post.update({
                'country_id': int(post.get('country_id')),
                'state_id': int(post.get('state_id')),
            })
            partner.create(post)
            return request.render('website_clone.register_form_success', {})

        countries = request.env['res.country'].sudo().search([])
        states = request.env['res.country.state'].sudo().search([])
        values = {

            'countries': countries,
            'states': states,
        }
        return request.render('website_clone.cust_reg', values)


