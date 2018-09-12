using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using WebWallet.Helpers;
using WebWallet.Models;

namespace WebWallet.Controllers
{
    [Route("api/[controller]")]
    public class SendRawTxController : Controller
    {
        [HttpPost]
        public JsonResult Index([FromForm] string value)
        {
            var x = value;
            var args = new Dictionary<string, object>();
            args.Add("tx_as_hex", value);
            var response = RpcHelper.Request<RawTxResp>("sendrawtransaction", args);
            return new JsonResult(response);
        }
    }
}