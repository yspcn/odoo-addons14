# -*- coding: utf-8 -*-
# Part of Softhealer Technologies.
{
    "name": "Import Purchase Order from CSV/Excel file",
    "author": "Softhealer Technologies",
    "website": "https://www.softhealer.com",
    "support": "support@softhealer.com",
    "category": "Purchases",
    "summary": "Import Purchase Order Lines from CSV,Import Purchase Order Lines from Excel, Import RFQ Lines From CSV Module, Import RFQ Lines From Excel,Import PO Lines From CSV,import PO Lines From XLS, purchase order from XLSX Odoo",
    "description": """
    
This module is useful to import Purchase Order from CSV/Excel. You can import custom fields from CSV or Excel.

 Import Purchase Order Lines From CSV Odoo, Import Purchase Order Lines From excel Odoo
 Import RFQ Lines From CSV Module, Import RFQ Lines From Excel, Import Purchase Order Lines From CSV, Import Purchase Order Lines From Excel, Import PO Lines From CSV, Import PO Lines From Excel, Import Request For quotation Lines From CSV, Import Purchase Order Lines From XLS XLSX Odoo.
 Import RFQ Lines From CSV Module, Import RFQ Lines From Excel App, Import PO Lines From CSV, import PO Lines From XLS XLSX Odoo.
  Importar líneas de orden de compra de CSV Odoo, Importar líneas de orden de compra de Excel Odoo
Importar líneas de RFQ desde el módulo CSV, Importar líneas de RFQ desde Excel, Importar líneas de orden de compra desde CSV, Importar líneas de orden de compra desde Excel, Importar líneas de PO desde CSV, Importar líneas de PO desde Excel, Solicitud de importación para líneas de presupuesto desde CSV, Importar orden de compra Líneas de XLS XLSX Odoo.
 Importe líneas RFQ desde el módulo CSV, importe líneas RFQ desde la aplicación Excel, importe líneas PO desde CSV, importe líneas PO desde XLS XLSX Odoo.

                    """,
    "version": "14.0.1",
    "depends": [
        "sh_message",
        "purchase"
    ],
    "application": True,
    "data": [
        'security/import_po_security.xml',
        'security/ir.model.access.csv',
        'wizard/import_po_wizard.xml',
        'views/purchase_view.xml',
    ],
    'external_dependencies': {
        'python': ['xlrd'],
    },
    "images": ["static/description/background.png", ],
    "live_test_url": "https://youtu.be/Dx_0flM7o8c",
    "license": "OPL-1",
    "auto_install": False,
    "installable": True,
    "price": 15,
    "currency": "EUR"
}
