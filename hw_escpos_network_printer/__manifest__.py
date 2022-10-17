# -*- coding: utf-8 -*-
{
    "name": "IP Network Printer Drivers (ESC/POS)",
    "support": "support@optima.co.ke",
    "license": "OPL-1",
    "price": 129,
    "currency": "EUR",
    "summary": """
        Print POS Receipts & Tickets using ESCPOS IP network printer. Works
        without IoT Box""",
    "description": """
IP Network Printer Drivers (ESCPOS) for POS Printing
=======================================================
Stable drivers for ESCPOS based ticket and receipt printers
for Odoo POS. Works without IoT Box.

* Allows you to connect and print  directly from ESCPOS IP printer either via WLAN or LAN

* All you need to know is the IP address and port of your IP based printer, default port is 9100.

* Compatible with a wide range of ESCPOS printers in the market.

* Supported character sets:
    cp437,
    cp850,
    cp852,
    cp857,
    cp858,
    cp860,
    cp863,
    cp865,
    cp866,
    cp862,
    cp720,
    cp936,
    iso8859_2,
    iso8859_7,
    iso8859_9,
    cp1254,
    cp1255,
    cp1256,
    cp1257,
    cp1258,
    katakana

* You can switch back to other tiypes of printers supported by Odoo such as USB printer if necessary

* You can connect to as many printers as you want.

    """,
    "author": "Optima ICT Service LTD",
    "website": "http://www.optima.co.ke",
    # Categories can be used to filter modules in modules listing
    # Check https://github.com/odoo/odoo/blob/11.0/odoo/addons/base/module/module_data.xml
    # for the full list
    "category": "Point of Sale",
    "version": "14.0.0.1.5",
    # any module necessary for this one to work correctly
    "depends": ["point_of_sale"],
    "external_dependencies": {"python": ["netifaces", "pyusb"]},
    # always loaded
    "images": ["static/description/main.gif"],
    "data": [
        # 'security/ir.model.access.csv',
        "views/pos_config_views.xml",
        "views/templates.xml",
    ],
    # only loaded in demonstration mode
    "demo": [],
    "application": True,
}
