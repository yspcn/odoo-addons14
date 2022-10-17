# -*- coding: utf-8 -*-
#############################################################################
#
#    Cybrosys Technologies Pvt. Ltd.
#
#    Copyright (C) 2019-TODAY Cybrosys Technologies(<https://www.cybrosys.com>).
#    Author: Mohammed Shahil MP @cybrosys(odoo@cybrosys.com)
#
#    You can modify it under the terms of the GNU AFFERO
#    GENERAL PUBLIC LICENSE (AGPL v3), Version 3.
#
#    This program is distributed in the hope that it will be useful,
#    but WITHOUT ANY WARRANTY; without even the implied warranty of
#    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
#    GNU AFFERO GENERAL PUBLIC LICENSE (AGPL v3) for more details.
#
#    You should have received a copy of the GNU AFFERO GENERAL PUBLIC LICENSE
#    (AGPL v3) along with this program.
#    If not, see <http://www.gnu.org/licenses/>.
#
#############################################################################
import tempfile
import binascii
import base64
import certifi
import urllib3
import xlrd
from odoo.exceptions import Warning
from odoo import models, fields, _
import requests

class ProductImport(models.Model):

    _name = 'product.import'

    file = fields.Binary(string="Upload File")
    file_name = fields.Char(string="File Name")
    option = fields.Selection([
        ('csv', 'CSV'),
        ('xlsx', 'XLSX')], default='csv')

    def import_file(self):
        """ function to import product details from csv and xlsx file """
        if self.option == 'csv':
            try:
                product_temp_data = self.env['product.template'].search([])
                file = base64.b64decode(self.file)
                file_string = file.decode('utf-8')
                file_string = file_string.split('\n')
                http = urllib3.PoolManager(cert_reqs='CERT_REQUIRED',
                                           ca_certs=certifi.where())
            except:
                raise Warning(_("Please choose the correct file!"))

            firstline = True
            for file_item in file_string:
                if firstline:
                    firstline = False
                    continue
                print("jbkjn ", file_item)
                if file_item:
                    # print("jbkjn ", file_item.split(",")[1])
                    product_temp = self.env['product.template'].search([('name', '=', file_item.split(",")[4])])
                    #product_temp = self.env['product.template'].search([('default_code', '=', file_item.split(",")[3])])
                    print("pr",product_temp)
                    print("dnf")
                    link = file_item.split(",")[1]
                    print("ssss", link)
                    headers = {
                        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_10_1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/39.0.2171.95 Safari/537.36'}

                    # # image_response = http.request('GET', link)
                    # # image_thumbnail = base64.b64encode(requests.get(link, headers=headers).content)
                    # if not product_temp.id:
                    #     if file_item.split(",")[2]:
                    #         if "http://" in file_item.split(",")[8] or "https://" in file_item.split(",")[8]:
                    #             link = file_item.split(",")[8]
                    #             # image_response = http.request('GET', link)
                    #             image_thumbnail = base64.b64encode(requests.get(link, headers=headers).content)
                    #             product_name = {
                    #                 'name': file_item.split(",")[2],
                    #                 'type': 'product',
                    #                 # 'barcode': file_item.split(",")[2],
                    #                 'list_price': file_item.split(",")[7],
                    #                 'image_1920': image_thumbnail,
                    #             }
                    #             product_line = product_temp_data.create(product_name)
                    if product_temp.id:
                        # if product_temp.image_1920:
                        #
                        #     product_temp.write({
                        #
                        #         'default_code': file_item.split(",")[1],
                        #     })
                        #
                        # else:
                        if "http://" in file_item.split(",")[1] or "https://" in file_item.split(",")[1]:
                            image_thumbnail = base64.b64encode(requests.get(link, headers=headers).content)

                            product_temp.write({

                                'image_1920': image_thumbnail,
                                # 'default_code': file_item.split(",")[1],
                            })
