# -*- coding: utf-8 -*-
# Part of Softhealer Technologies.
{
    "name": "Import Bill of Materials from CSV/Excel file",
    "author": "Softhealer Technologies",
    "website": "https://www.softhealer.com",
    "support": "support@softhealer.com",
    "category": "Manufacturing",
    "summary": "bill of materials from csv app, import bill of materials excel, import BOM from xls, bill of materials from xlsx odoo, import bills, import bill of material Odoo",
    "description": """This module useful to import Bill of Materials from csv/excel. """,
    "version": "14.0.1",
    "depends": [
        "sh_message",
        "mrp"
    ],
    "application": True,
    "data": [
        "security/import_bom_security.xml",
        "security/ir.model.access.csv",
        "wizard/import_bom_wizard.xml",
        "views/mrp_view.xml",

    ],
    "external_dependencies": {
        "python": ["xlrd"],
    },
    "images": ["static/description/background.png", ],
    "live_test_url": "https://youtu.be/kIaaIoUO5HI",
    "auto_install": False,
    "license": "OPL-1",
    "installable": True,
    "price": 25,
    "currency": "EUR"
}
