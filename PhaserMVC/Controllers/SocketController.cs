using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using Microsoft.Web.WebSockets;
using System.Web;
using System.Web.Script.Serialization;

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
            private static JavaScriptSerializer jser = new JavaScriptSerializer();
            private static WebSocketCollection clients = new WebSocketCollection();
            private string name;
            private static string messages;
            public PhaserWebSocketHandler opponent;

            public override void OnOpen()
            {                
                clients.Add(this);

                //launch a game
                if (clients.Count % 2 == 0)
                {
                    //player one, and setup opponents for ease of communication later
                    var playerOne = (PhaserWebSocketHandler)clients.ElementAt(clients.Count - 2);
                    playerOne.opponent = this;
                    opponent = playerOne;

                    //start game                    
                    playerOne.Send(jser.Serialize(new { action = "go"}));

                }
            }

            public override void OnMessage(string message)
            {
                if (message.Contains("action"))
                {
                    opponent.Send(message);
                }
                    
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