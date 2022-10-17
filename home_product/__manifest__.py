# -*- coding: utf-8 -*-
{
    'name': "Home Products",

    'summary': """
        Products in home page""",

    'description': """
       Products in home page
    """,

    'author': "",
    'website': "",

    'category': 'website',
    'version': '14.0.1.0.0',

    # any module necessary for this one to work correctly
    'depends': ['base','website','website_sale','contacts'],

    # always loaded
    'data': [
        'views/home_products.xml',
    ],

}
