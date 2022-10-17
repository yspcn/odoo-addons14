# -*- coding: utf-8 -*-
{
    'name': "product_quant",

    'summary': """
        Controll Product Quantity""",

    'description': """
        Can select the quantity
    """,

    'category': 'E-commerce',
    'version': '14.0.1.0.0',

    # any module necessary for this one to work correctly
    'depends': ['base','website_sale'],

    # always loaded
    'data': [
        'views/views.xml',
        'views/templates.xml',
    ],

}
