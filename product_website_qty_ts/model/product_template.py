from odoo import fields, models ,api ,_
from odoo.exceptions import ValidationError

class ProductTemplate(models.Model):
    _inherit = "product.template"

    qty_multiplier = fields.Integer('Product Quantity Multiplier',help="Multiplies quantity of the product", default=1)
    qty_max = fields.Integer('Maximum Product Quantity',help="Maximum quantity of the product", default=0)
    qty_min = fields.Integer('Minimum Product Quantity',help="Minimum quantity of the product", default=0)

    @api.constrains('qty_multiplier','qty_max','qty_min')
    def _check_amount(self):
        for record in self:
            if record.qty_multiplier > 1 and record.qty_min > 0:
                if record.qty_min % record.qty_multiplier != 0:
                    raise ValidationError(_('Minimum quantity must be 0 or in multiplication of multiplier quantity'))
                if record.qty_max % record.qty_multiplier != 0:
                    raise ValidationError(_('Maximum quantity must be 0 or in multiplication of multiplier quantity'))