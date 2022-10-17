odoo.define('hw_escpos_network_printer.IPPrinter', function (require) {
  'use strict'

  var core = require('web.core')
  var session = require('web.session')
  var PrinterMixin = require('point_of_sale.Printer').PrinterMixin
  const { Gui } = require('point_of_sale.Gui')
  var _t = core._t

  var IPPrinter = core.Class.extend(PrinterMixin, {
    init: function (ip, pos) {
      PrinterMixin.init.call(this, arguments)
      this.pos = pos
      this.IPPrinterDevice = {}
      this.IPPrinterDevice.ip = ip.trim() !== '' ? ip.split(':').slice(0, 1)[0] : '127.0.0.1'
      this.IPPrinterDevice.port = (ip.indexOf(':') > 0 && ip.split(':').slice(-1)[0] !== '') ? ip.split(':').slice(-1)[0] : '9100'
    },

    /**
     * @override
     */
    open_cashbox: function () {
      var self = this
      if (!_.isEmpty(this.IPPrinterDevice)) {
        return session.rpc('/hw_net_printer/open_cashbox', { ip: this.IPPrinterDevice.ip, port: this.IPPrinterDevice.port }, { shadow: true })
          .then(self._onIPPrinterActionResult.bind(self)).guardedCatch(self._onIPPrinterActionFail.bind(self))
      } else {
        return this._super.appy(this, arguments)
      }
    },

    /**
     * @override
     */
    send_printing_job: function (img) {
      var self = this
      if (!_.isEmpty(this.IPPrinterDevice)) {
        return session.rpc('/hw_net_printer/print_img_receipt', { ip: this.IPPrinterDevice.ip, port: this.IPPrinterDevice.port, receipt: img }, { shadow: true })
          .then(self._onIPPrinterActionResult.bind(self)).catch(self._onIPPrinterActionFail.bind(self))
      } else {
        return this._super.apply(this, arguments)
      }
    },

    // --------------------------------------------------------------------------
    // IP Printer Handlers
    // --------------------------------------------------------------------------
    //
    _onIPPrinterActionResult: function (data) {
      if (this.pos && data.result === false) {
        Gui.showPopup('ErrorPopup', {
          title: _t('Connection To Network POS Printer Failed') + ' [' + this.IPPrinterDevice.ip + ':' + this.IPPrinterDevice.port + ']',
          body: data.message[0]
        })
      }
      // this line is basically to prevent default error message from showing up
      return { result: true, message: data.message[0] }
    },

    _onIPPrinterActionFail: function () {
      if (this.pos) {
        Gui.showPopup('ErrorPopup', {
          title: _t('Connection To Network POS Printer Failed') + ' [' + this.IPPrinterDevice.ip + ':' + this.IPPrinterDevice.port + ']',
          body: _t('Please check if there is connectivitiy to backend POS server.')
        })
      }
      // this line is basically to prevent default error message from showing up
      return { result: true, message: 'No connection to backend' }
    }
  })

  return IPPrinter
})
