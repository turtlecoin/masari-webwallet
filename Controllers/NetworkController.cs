using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using WebWallet.Helpers;
using WebWallet.Models;

namespace WebWallet.Controllers
{
    [Route("api/[controller]")]
    public class NetworkController : Controller
    {
        public JsonResult Index()
        {
            var stats = RpcHelper.RequestJson<NetworkStats>("getlastblockheader").result.block_header;
            return new JsonResult(stats);
        }
    }
}