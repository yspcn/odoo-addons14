# -*- coding: utf-8 -*-
# Part of Softhealer Technologies.

from odoo import models


class SaleOrder(models.Model):
    _inherit = "sale.order"

    def sh_import_sol(self):
        if self:
            action = self.env.ref(
                'sh_import_sol.sh_import_sol_action').read()[0]
            return action
