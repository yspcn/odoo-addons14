odoo.define('hw_escpos_network_printer.pos_ip_printer', function (require) {
  'use strict'

  var models = require('point_of_sale.models')
  var IPPrinter = require('hw_escpos_network_printer.IPPrinter')

  var posmodelSuper = models.PosModel.prototype
  models.PosModel = models.PosModel.extend({
    after_load_server_data: function () {
      var self = this
      return posmodelSuper.after_load_server_data.apply(this, arguments).then(function () {
        if (self.config.other_devices && self.config.iface_network_printer_ip_address && !self.config.epson_printer_ip) {
          self.proxy.printer = new IPPrinter(self.config.iface_network_printer_ip_address, self)
        }
      })
    }
  })
})
