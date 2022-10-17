# -*- coding: utf-8 -*-
"""
Odoo Proprietary License v1.0.

see License:
https://www.odoo.com/documentation/user/14.0/legal/licenses/licenses.html#odoo-apps
# Copyright ©2020 Bernard K. Too<bernard.too@optima.co.ke>
"""
import base64
import io
import logging
import time

from PIL import Image, ImageOps

from odoo import _, http
from odoo.addons.hw_escpos_network_printer.escpos import escpos as Escpos
from odoo.addons.hw_escpos_network_printer.escpos import exceptions as E
from odoo.addons.hw_escpos_network_printer.escpos import printer as Printer

from . import hw_escpos as hwEscpos

LOGGER = logging.getLogger(__name__)

# todo: add support for star commands in future
PRINTER_COMMANDS = {
    "star": {
        "center": b"\x1b\x1d\x61\x01",  # ESC GS a n
        "cut": b"\x1b\x64\x02",  # ESC d n
        "title": b"\x1b\x69\x01\x01%s\x1b\x69\x00\x00",  # ESC i n1 n2
        "drawers": [b"\x07", b"\x1a"],  # BEL & SUB
    },
    "escpos": {
        "center": b"\x1b\x61\x01",  # ESC a n
        "cut": b"\x1d\x56\x41\n",  # GS V m
        "title": b"\x1b\x21\x30%s\x1b\x21\x00",  # ESC ! n
        "drawers": [
            b"\x1b\x3d\x01",
            b"\x1b\x70\x00\x19\x19",
            b"\x1b\x70\x01\x19\x19",
        ],  # ESC = n then ESC p m t1 t2
    },
}


class Network(Printer.Network):
    """IP Network printer definition."""

    def _raw(self, msg):
        if isinstance(msg, str):
            msg = msg.encode()  # str to bytes
        self.device.sendall(msg)

    def escpos_commands(self, im):
        """Get the right ESC POS commands based on the image params."""
        width = int((im.width + 7) / 8)

        raster_send = b"\x1d\x76\x30\x00"
        max_slice_height = 255

        raster_data = b""
        dots = im.tobytes()
        while len(dots):
            im_slice = dots[: width * max_slice_height]
            slice_height = int(len(im_slice) / width)
            raster_data += (
                raster_send
                + width.to_bytes(2, "little")
                + slice_height.to_bytes(2, "little")
                + im_slice
            )
            dots = dots[width * max_slice_height :]

        return (
            PRINTER_COMMANDS["escpos"]["center"]
            + raster_data
            + PRINTER_COMMANDS["escpos"]["cut"]
        )

    def print_img_receipt(self, receipt):
        """Print the receipt in image format."""
        im = Image.open(io.BytesIO(receipt))

        # Convert to greyscale then to black and white
        im = im.convert("L")
        im = ImageOps.invert(im)
        im = im.convert("1")
        print_command = self.escpos_commands(im)
        self._raw(print_command)

    def open_cashbox(self):
        """Send signal to the current printer to open the connected cashbox."""
        # ESC = --> Set peripheral device
        self._raw(b"\x1b\x3d\x01")
        for drawer in [b"\x1b\x70\x00", b"\x1b\x70\x01"]:  # Kick pin 2 and 5
            command = drawer + b"\x19\x19"  # Pulse ON for 50ms then OFF  50ms
            self._raw(command)


class EscposDriver(hwEscpos.EscposDriver):
    """ESC/POS Drivers for IP Printer."""

    def __init__(self, ip, port):
        """IP address and port required to connect to printer."""
        hwEscpos.EscposDriver.__init__(self)
        self.ip = ip
        self.port = int(port)

    def connected_network_devices(self):
        """Define the printer to connect to."""
        connected = {"ip": self.ip, "port": self.port}
        return connected

    def get_escpos_printer(self):
        """Get the IP printer paramters."""
        printers = None
        if self.ip and self.port:
            printers = self.connected_network_devices()
            if printers:
                print_dev = Network(printers["ip"], printers["port"])
                peer = print_dev.device.getpeername()
                self.set_status(
                    "connected",
                    "Connected to printer: %s on port %s" % (peer[0], peer[1]),
                )
                return print_dev
        else:
            printers = self.connected_usb_devices()
            if printers:
                print_dev = Printer.Usb(printers[0]["vendor"], printers[0]["product"])
                self.set_status(
                    "connected",
                    "Connected to %s (in=0x%02x,out=0x%02x)"
                    % (printers[0]["name"], print_dev.in_ep, print_dev.out_ep),
                )
                return print_dev
        return None

    def run(self):
        """Do the printing job. Override to add python 3 compatibility."""
        printer = None
        if not Escpos:
            LOGGER.error(
                "ESC/POS cannot initialize, please verify system dependencies."
            )
            return
        no_error = True
        while no_error:
            try:
                timestamp, task, data = self.queue.get(True)

                printer = self.get_escpos_printer()

                if printer is None:
                    if task != "status":
                        self.queue.put((timestamp, task, data))
                    no_error = False
                    time.sleep(5)
                    continue
                elif task == "receipt":
                    if timestamp >= time.time() - 1 * 60 * 60:
                        self.print_receipt_body(printer, data)
                        printer.cut()
                elif task == "xml_receipt":
                    if timestamp >= time.time() - 1 * 60 * 60:
                        printer.receipt(data)
                elif task == "img_receipt":
                    if timestamp >= time.time() - 1 * 60 * 60:
                        printer.print_img_receipt(base64.decodebytes(data))
                elif task == "cashbox":
                    if timestamp >= time.time() - 12:
                        printer.open_cashbox()
                elif task == "printstatus":
                    self.print_status(printer)
                elif task == "status":
                    pass
                no_error = False

            except E.NoDeviceError as e:
                LOGGER.info("No device found %s", e)
            except E.HandleDeviceError as e:
                LOGGER.info(
                    "Impossible to handle the device due \
                            to previous error %s",
                    e,
                )
            except E.TicketNotPrinted as e:
                LOGGER.info(
                    "The ticket does not seems to have been \
                            fully printed % s",
                    e,
                )
            except E.NoStatusError as e:
                LOGGER.info("Impossible to get the printer status %s", e)
            except Exception as e:
                self.set_status("disconnected", e)
            finally:
                self.ip = None
                self.port = None
                if no_error:
                    self.queue.put((timestamp, task, data))
                if printer:
                    printer.device.close()

    def set_status(self, status, message=None):
        """Set the status of the printer."""
        if not isinstance(message, str):  # python3 compatibility
            message = "%s" % message
        if status == self.status["status"]:
            if message is not None and (
                len(self.status["messages"]) == 0
                or message != self.status["messages"][-1]
            ):
                self.status["messages"].append(message)
        else:
            self.status["status"] = status
            if message:
                self.status["messages"] = [message]
            else:
                self.status["messages"] = []
        if status == "error" and message:
            LOGGER.warning(
                "IP ESC/POS Printer [%s:%s] Error: %s", self.ip, self.port, message
            )
        elif status == "disconnected" and message:
            LOGGER.warning(
                "IP ESC/POS Printer [%s:%s] Disconnected: %s",
                self.ip,
                self.port,
                message,
            )
        else:
            LOGGER.info("%s: %s", status, message)


class EscposProxy(hwEscpos.EscposProxy):
    """Routes for printing using IP printer."""

    @http.route("/hw_net_printer/open_cashbox", type="json", auth="none", cors="*")
    def open_cashbox(self, **params):
        """Open cashbox for cash payment menthod."""
        LOGGER.info("ESC/POS: OPEN CASH DRAWER......")
        msg = _("Could not open cashbox.")
        ip = params.get("ip") or "127.0.0.1"
        port = params.get("port") or 9100
        try:
            driver = EscposDriver(ip, port)
            driver.push_task("cashbox")
        except Exception as e:
            msg += (" IP: %s, Port: %s. %s", ip, port, e)
            LOGGER.warning("ESC/POS: %s", msg)
            return {"result": False, "message": e or ""}
        else:
            return {"result": True, "message": "cashbox opened"}

    @http.route("/hw_net_printer/print_img_receipt", type="json", auth="none", cors="*")
    def print_img_receipt(self, **params):
        """Receipt printing method."""
        LOGGER.info("ESC/POS: PRINT IMG RECEIPT USING NETWORK PRINTER......")
        msg = _("Could not print using the configured printer.")
        ip = params.get("ip") or "127.0.0.1"
        port = params.get("port") or 9100
        try:
            driver = EscposDriver(ip, port)
            img = params.get("receipt")
            if isinstance(img, str):
                img = img.encode()
            driver.push_task("img_receipt", img)
        except Exception as e:
            msg += (" IP: %s, Port: %s. %s", ip, port, e)
            LOGGER.warning("ESC/POS: %s", msg)
            return {"result": False, "message": [e] or [""]}
        else:  # No exception
            while driver.status.get("status") not in (
                "connected",
                "error",
                "disconnected",
            ):
                status = driver.status
                if status.get("status") in ("connected", "error", "disconnected"):
                    return self._handle_printer_status(status)
            # finally handle status 'connected', 'error', 'disconnected'
            return self._handle_printer_status(driver.status)

    def _handle_printer_status(self, status):
        """Return correct format for status for javascript print module."""
        if status.get("status") == "connected":
            return {
                "result": True,
                "message": "Connected and ready to print",
            }
        if status.get("status") in ("error", "disconnected"):
            return {
                "result": False,
                "message": status.get("messages", []),
            }
