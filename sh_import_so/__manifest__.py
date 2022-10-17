# -*- coding: utf-8 -*-
# Part of Softhealer Technologies.
{
    "name": "Import Sale Order from CSV/Excel file",
    "author": "Softhealer Technologies",
    "website": "https://www.softhealer.com",
    "support": "support@softhealer.com",
    "category": "Sales",
    "summary": "import quotation from csv,import quote from excel, import so from csv, import so from excel, import sales order, import sale order from xlsx odoo",
    "description": """
    
 This module useful to import sale order from csv/excel. 
import quotation lines fromcsv, import quotationline fromexcel, import so lines from csvmodule, import so lines from excel app, importsolinefrom xls xlsx odoo
     

                    """,
    "version": "14.0.1",
    "depends": [
        "sale_management",
        "sh_message",
    ],
    "application": True,
    "data": [
        'security/import_so_security.xml',
        'security/ir.model.access.csv',
        'wizard/import_so_wizard.xml',
        'views/sale_view.xml',
    ],
    'external_dependencies': {
        'python': ['xlrd'],
    },
    "images": ["static/description/background.png", ],
    "live_test_url": "https://youtu.be/sYoLJBs1OsY",
    "license": "OPL-1",
    "auto_install": False,
    "installable": True,
    "price": 20,
    "currency": "EUR"
}
