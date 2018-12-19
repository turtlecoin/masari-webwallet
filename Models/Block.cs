using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace WebWallet.Models
{
    public class Block
    {
        public List<TxResp> transactions { get; set; }
    }
}
