using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace PhaserMVC.Controllers
{
    public class AdminController : Controller
    {
        // GET: Admin
        public ActionResult Index()
        {
            AdminView av = new AdminView();
            av.clientsConnected = PhaserMVC.Controllers.SocketController.PhaserWebSocketHandler.ConnectionCount();
            return View(av);
        }
    }

    public class AdminView
    {
        public int clientsConnected;

    }
}