using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace WebWallet.Models
{
    public class BlockJsonResp
    {
        public BlockJsonResult result { get; set; }
    }

    public class BlockResp
    {
        public List<Block> blocks { get; set; }
    }

    public class BlockJsonResult {
        public BlockJsonBlock block { get; set; }
    }

    public class BlockJsonBlock {
        public List<BlockJsonTransaction> transactions { get; set;}
    }

    public class BlockJsonTransaction {
        public string hash { get; set; }
    }
}
