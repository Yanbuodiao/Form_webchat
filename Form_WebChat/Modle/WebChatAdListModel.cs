using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Form_WebChat.Modle
{
    public class WebChatAdListModel
    {
        public Base_RespModel base_resp { get; set; }
        public ConfModel conf { get; set; }
        public List<Detial> list { get; set; }
    }
    public class ConfModel
    {
        public int page { get; set; }
        public int total_page { get; set; }
    }
    public class Campaign{
       public string cid {get;set;}        
      public string cname{get;set;}
    }

    public class Detial
    {
        public Campaign campaign { get; set; }
    }
    public class Base_RespModel
    {
        public string msg { get; set; }
        public int ret { get; set; }
    }
}
