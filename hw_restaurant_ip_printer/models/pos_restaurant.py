# -*- coding: utf-8 -*-
"""
See link below for License.

https://www.odoo.com/documentation/user/13.0/legal/licenses/licenses.html#odoo-apps.
"""


from odoo import fields, models


class RestaurantIPPrinter(models.Model):
    """Add IP printer fields."""

    _inherit = "restaurant.printer"

    printer_type = fields.Selection(
        selection_add=[("escpos_ip_printer", "Use an ESC/POS IP printer")]
    )
    restaurant_escpos_printer_ip = fields.Char(
        string="ESC/POS Printer IP Address",
        help="IP address of an ESC/POS kitchen/restaurnat/bar order printer.",
    )
