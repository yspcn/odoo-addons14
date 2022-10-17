# -*- coding: utf-8 -*-
# Copyright (C) Softhealer Technologies.

from odoo import models, fields, api
from io import BytesIO
import base64

try:
    import qrcode
except ImportError:
    qrcode = None


class ProductTemplate(models.Model):
    _inherit = "product.template"

    sh_qr_code = fields.Char(
        string="QR Code", related='product_variant_ids.sh_qr_code', readonly=False)
    sh_qr_code_img = fields.Binary(
        string="QR Code Image", related='product_variant_ids.sh_qr_code_img', readonly=False)

    @api.model
    def create(self, vals):
        res = super(ProductTemplate, self).create(vals)
        is_create_qr_code = self.env['ir.config_parameter'].sudo().get_param(
            'sh_product_qrcode_generator.is_sh_product_qrcode_generator_when_create')
        if is_create_qr_code:
            qr_sequence = self.env['ir.sequence'].next_by_code(
                'seq.sh_product_qrcode_generator')
            if qr_sequence:
                qr_code = qr_sequence
                qr = qrcode.QRCode(
                    version=1,
                    error_correction=qrcode.constants.ERROR_CORRECT_L,
                    box_size=10,
                    border=4,
                )
                qr.add_data(qr_code)
                qr.make(fit=True)

                img = qr.make_image()
                temp = BytesIO()
                img.save(temp, format="PNG")
                qr_code_image = base64.b64encode(temp.getvalue())

                res.sh_qr_code = qr_code
                res.sh_qr_code_img = qr_code_image

        return res

    @api.onchange('sh_qr_code')
    def onchange_sh_qr_code(self):
        if self:
            if self.sh_qr_code:
                qr_code = self.sh_qr_code
                qr = qrcode.QRCode(
                    version=1,
                    error_correction=qrcode.constants.ERROR_CORRECT_L,
                    box_size=10,
                    border=4,
                )
                qr.add_data(qr_code)
                qr.make(fit=True)

                img = qr.make_image()
                temp = BytesIO()
                img.save(temp, format="PNG")
                qr_code_image = base64.b64encode(temp.getvalue())

                self.sh_qr_code_img = qr_code_image                
                
            else:
                self.sh_qr_code = False
                self.sh_qr_code_img = False

        

class ProductProduct(models.Model):
    _inherit = "product.product"

    sh_qr_code = fields.Char(string="QR Code", copy=False)
    sh_qr_code_img = fields.Binary(string="QR Code Image", copy=False)

    @api.model
    def create(self, vals):
        res = super(ProductProduct, self).create(vals)
        is_create_qr_code = self.env['ir.config_parameter'].sudo().get_param(
            'sh_product_qrcode_generator.is_sh_product_qrcode_generator_when_create')
        if is_create_qr_code:
            qr_sequence = self.env['ir.sequence'].next_by_code(
                'seq.sh_product_qrcode_generator')
            if qr_sequence:
                qr_code = qr_sequence
                qr = qrcode.QRCode(
                    version=1,
                    error_correction=qrcode.constants.ERROR_CORRECT_L,
                    box_size=10,
                    border=4,
                )
                qr.add_data(qr_code)
                qr.make(fit=True)

                img = qr.make_image()
                temp = BytesIO()
                img.save(temp, format="PNG")
                qr_code_image = base64.b64encode(temp.getvalue())

                res.sh_qr_code = qr_code
                res.sh_qr_code_img = qr_code_image

        return res
    
    @api.onchange('sh_qr_code')
    def onchange_sh_qr_code(self):
        if self:
            if self.sh_qr_code:
                qr_code = self.sh_qr_code
                qr = qrcode.QRCode(
                    version=1,
                    error_correction=qrcode.constants.ERROR_CORRECT_L,
                    box_size=10,
                    border=4,
                )
                qr.add_data(qr_code)
                qr.make(fit=True)

                img = qr.make_image()
                temp = BytesIO()
                img.save(temp, format="PNG")
                qr_code_image = base64.b64encode(temp.getvalue())

                self.sh_qr_code_img = qr_code_image                
                
            else:
                self.sh_qr_code = False
                self.sh_qr_code_img = False    
