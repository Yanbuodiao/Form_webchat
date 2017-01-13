using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Form_WebChat.Modle
{
    public class UpLoadModel
    {
        public string code
        {
            get
            {
                var sinStr = string.Format("metenGG123{0}",time);
                return EncryptUtils.EncryptByMD5(sinStr, "", "utf-8");
            }
        }
        public string time { get; set; }
        public List<UpLoadContent> content { get; set; }

    }
    public class UpLoadContent
    {
        public string name { get; set; }
        public string city { get; set; }
        public string phone { get; set; }
        public string sex { get; set; }
        public string remark { get; set; }
    }
}
