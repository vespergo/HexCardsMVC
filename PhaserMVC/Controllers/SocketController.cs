using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using Microsoft.Web.WebSockets;
using System.Web;
using System.Web.Script.Serialization;
using System.Threading.Tasks;

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
            private static WebSocketCollection allClients = new WebSocketCollection();
            private static List<PhaserWebSocketHandler> clientsWaiting = new List<PhaserWebSocketHandler>();

            private string name;

            public PhaserWebSocketHandler opponent;

            public override void OnOpen()
            {
                allClients.Add(this);

                //launch a game
                if (clientsWaiting.Count > 0)
                {
                    //remove the waiting client and start up a game
                    var playerOne = clientsWaiting[0];
                    clientsWaiting.Remove(playerOne);

                    //player one, and setup opponents for ease of communication later
                    playerOne.opponent = this;
                    opponent = playerOne;

                    //start game, sending the go signal to the first player                    
                    playerOne.Send(jser.Serialize(new { action = "startgame", player = 1 }));
                    this.Send(jser.Serialize(new { action = "startgame", player = 2 }));
                }
                else //OR wait for opponent
                {
                    clientsWaiting.Add(this);
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
                allClients.Remove(this);
                if (clientsWaiting.Contains(this)) clientsWaiting.Remove(this);
            }


            //admin area
            public static int ConnectionCount()
            {
                return allClients.Count;
            }
        }

    }
}