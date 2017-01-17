using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Form_WebChat
{
    public class AdModel
    {
        public string CName { get; set; }
        public string AdId { get; set; }
        public string CustomerName { get; set; }
        public string Sex { get; set; }
        public string TelePhone { get; set; }
        public string Age { get; set; }
        public string City { get; set; }
        public string Remark { get; set; }
        public int UpdateState { get; set; }
        public DateTime UpdateTime { get; set; }
    }
}
