# -*- coding: utf-8 -*-
from odoo import fields, models


class PosConfigNetworkPrinter(models.Model):
    """Add IP printer fields."""

    _inherit = "pos.config"

    iface_network_printer_ip_address = fields.Char(
        "Esc/POS Printer IP Address", size=45
    )
