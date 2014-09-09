using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using Microsoft.Web.WebSockets;
using System.Web;

namespace PhaserMVC.Controllers
{
    public class SocketController : ApiController
    {
        public HttpResponseMessage Get()
        {
            HttpContext.Current.AcceptWebSocketRequest(new PhaserWebSocketHandler());
            return Request.CreateResponse(HttpStatusCode.SwitchingProtocols);
        }

        public class PhaserWebSocketHandler : WebSocketHandler
        {

            private static WebSocketCollection clients = new WebSocketCollection();
            private string name;
            private static string messages;

            public override void OnOpen()
            {                
                clients.Add(this);
            }

            public override void OnMessage(string message)
            {
                messages += message;
                clients.ElementAt(0).Send("This message was recieved: " + message);
            }

            public override void OnClose()
            {
                clients.Remove(this);
            }

        }

        class WebSocketMsg
        {
            public string action;
            public Move move;
        }

        class Move
        {
            public int[] values;
            public int location;
        }
    }
}