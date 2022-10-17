# -*- coding: utf-8 -*-
{
    'name': "website_clone",

    'summary': """
        Cloning of old woocommerce website""",

    'description': """
        Cloning of old woocommerce website
    """,

    'author': "",
    'website': "",

    'category': 'website',
    'version': '14.0.1.0.0',

    # any module necessary for this one to work correctly
    'depends': ['base','website','website_sale','contacts'],

    # always loaded
    'data': [
        # 'security/ir.model.access.csv',
        'views/views.xml',
        'views/templates.xml',
        'views/customer_reg.xml',
    ],

}
