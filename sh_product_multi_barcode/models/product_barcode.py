# -*- coding: utf-8 -*-
# Copyright (C) Softhealer Technologies.

from odoo import models, fields, api


class ShProductTemplate(models.Model):
    _inherit = 'product.template'

    barcode_line_ids = fields.One2many(
        related='product_variant_ids.barcode_line_ids', readonly=False)


class ShProduct(models.Model):
    _inherit = 'product.product'

    barcode_line_ids = fields.One2many(
        'product.template.barcode', 'product_id', 'Barcode Lines')

    @api.model
    def _name_search(self, name, args=None, operator='ilike', limit=100, name_get_uid=None):
        res = super(ShProduct, self)._name_search(name=name, args=args,
                                                  operator=operator, limit=limit, name_get_uid=name_get_uid)
        mutli_barcode_search = list(self._search(
            [('barcode_line_ids', '=', name)] + args, limit=limit, access_rights_uid=name_get_uid))
        if mutli_barcode_search:
            return res + mutli_barcode_search
        return res


class ShProductBarcode(models.Model):
    _name = 'product.template.barcode'
    _description = "Product Barcode"

    product_id = fields.Many2one('product.product', 'Product')
    name = fields.Char("Barcode", required=True)
