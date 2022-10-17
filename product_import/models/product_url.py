# -*- coding: utf-8 -*-
#############################################################################
#
#    Cybrosys Technologies Pvt. Ltd.
#
#    Copyright (C) 2019-TODAY Cybrosys Technologies(<https://www.cybrosys.com>).
#    Author: Mohammed Shahil MP @cybrosys(odoo@cybrosys.com)
#
#    You can modify it under the terms of the GNU AFFERO
#    GENERAL PUBLIC LICENSE (AGPL v3), Version 3.
#
#    This program is distributed in the hope that it will be useful,
#    but WITHOUT ANY WARRANTY; without even the implied warranty of
#    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
#    GNU AFFERO GENERAL PUBLIC LICENSE (AGPL v3) for more details.
#
#    You should have received a copy of the GNU AFFERO GENERAL PUBLIC LICENSE
#    (AGPL v3) along with this program.
#    If not, see <http://www.gnu.org/licenses/>.
#
#############################################################################
import requests
import base64
from odoo import models, fields, api
from odoo.tools import ImageProcess


class ProductImage(models.Model):
    _inherit = 'product.template'

    image_url = fields.Char(string='Image URL')

    @api.onchange('image_url')
    def _onchange_image_url(self):
        """ function to load image from URL """
        image = False
        headers = {
            'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_10_1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/39.0.2171.95 Safari/537.36'}
        if self.image_url:
            print(requests.get(self.image_url, headers=headers).content)
            image = base64.b64encode(requests.get(self.image_url, headers=headers).content)
        self.image_1920 = image

class ProductVariantImage(models.Model):
    _inherit = 'product.product'

    image_url = fields.Char(string='Image URL')

    @api.onchange('image_url')
    def _onchange_image_url(self):
        """ function to load image from URL in product variant"""
        image = False
        if self.image_url:
            image = base64.b64encode(requests.get(self.image_url).content)
        self.image_1920 = image