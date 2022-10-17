odoo.define('hw_restaurant_ip_printer.multiprint', function (require) {
  'use strict'

  var models = require('point_of_sale.models')
  var IPPrinter = require('hw_escpos_network_printer.IPPrinter')

  require('pos_restaurant.multiprint')

  models.load_fields('restaurant.printer', ['restaurant_escpos_printer_ip'])

  var superPosmodel = models.PosModel.prototype

  models.PosModel = models.PosModel.extend({
    create_printer: function (config) {
      if (config.printer_type === 'escpos_ip_printer') {
        return new IPPrinter(config.restaurant_escpos_printer_ip, this)
      } else {
        return superPosmodel.create_printer.apply(this, arguments)
      }
    }
  })
})
