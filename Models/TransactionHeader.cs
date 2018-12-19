using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace WebWallet.Models
{
    public class TransactionHeader
    {
        public string hash { get; set; }
        public int height { get; set; }
    }
}
