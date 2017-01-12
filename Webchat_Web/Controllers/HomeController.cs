using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Net;
using System.Text;
using System.Web;
using System.Web.Mvc;

namespace Webchat_Web.Controllers
{
    public class HomeController : Controller
    {
        static string strMPAccount = System.Configuration.ConfigurationManager.AppSettings["UserName"].Trim();
        static string strMPPassword = System.Configuration.ConfigurationManager.AppSettings["PWD"].Trim();
        static string strLoingMinutes = System.Configuration.ConfigurationManager.AppSettings["LoingMinutes"].Trim();
        // GET: Home
        public ActionResult Index()
        {
            if (null == WeiXinLogin.LoginInfo.LoginCookie || WeiXinLogin.LoginInfo.CreateDate.AddMinutes(Convert.ToInt32(WeiXinLogin.strLoingMinutes)) < DateTime.Now)
            {
                try
                {
                    WeiXinRetInfo retinfo = webChatLogin();
                    if (retinfo != null && retinfo.base_resp.ret == 0)
                    {
                        ViewBag.Message = "自动登录成功，请扫下面二维码";
                    }
                    else
                    {
                        ViewBag.Message = "未登录成功！";
                    }
                }
                catch (Exception ex)
                {
                    ViewBag.Message = ex.Message;
                }
            }
            return View();
        }

        public ActionResult LoadQRCode()
        {
            return File(loadQR_code(), "image/jpg");
        }
        public ActionResult QueryLogin()
        {
            var url = string.Format("https://mp.weixin.qq.com/cgi-bin/loginqrcode?action=ask&token=&lang=zh_CN&token=&lang=zh_CN&f=json&ajax=1&random={0}", new Random().Next(1, 1000));
            HttpWebRequest logined_Request = (HttpWebRequest)WebRequest.Create(url);

            logined_Request.Accept = "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8";
            logined_Request.Headers.Add("Accept-Encoding", "gzip, deflate, sdch, br");
            logined_Request.Headers.Add("Accept-Language", "zh-CN,zh;q=0.8");
            logined_Request.Headers.Add("Cache-Control", "max-age=0");
            logined_Request.CookieContainer = StaticHelper.Cookie_WebChat;
            logined_Request.Method = "GET";
            logined_Request.KeepAlive = true;
            logined_Request.UserAgent = "Mozilla/5.0 (Windows NT 6.1) AppleWebKit/537.17 (KHTML, like Gecko) Chrome/24.0.1312.57 Safari/537.17";
            HttpWebResponse responseLogined = (HttpWebResponse)logined_Request.GetResponse();
            using (var ms = new MemoryStream())
            {
                responseLogined.GetResponseStream().CopyTo(ms);
                StaticHelper.Cookie_WebChat = logined_Request.CookieContainer;
                var responseText = Encoding.UTF8.GetString(ms.ToArray());
                System.Diagnostics.Debug.WriteLine(responseText);
                return Content(responseText);
            }
        }
        public ActionResult Handle()
        {
            getCookieAndToken();
            return Content("aa");
        }

        private WeiXinRetInfo webChatLogin()
        {
            string password = WeiXinLogin.GetMd5Str32(strMPPassword).ToUpper();
            string padata = "username=" + System.Web.HttpUtility.UrlEncode(strMPAccount) + "&pwd=" + password + "&imgcode=&f=json";
            string url = "https://mp.weixin.qq.com/cgi-bin/bizlogin?action=startlogin";//请求登录的URL
            byte[] byteArray = Encoding.UTF8.GetBytes(padata); // 转化
            HttpWebRequest loginRequest = (HttpWebRequest)WebRequest.Create(url);

            loginRequest.Accept = "application/json, text/javascript, */*; q=0.01";
            loginRequest.Headers.Add("Accept-Encoding", "gzip, deflate");
            loginRequest.Headers.Add("Accept-Language", "zh-cn");
            loginRequest.Headers.Add("Cache-Control", "no-cache");
            loginRequest.ContentType = "application/x-www-form-urlencoded";
            loginRequest.Referer = "http://mp.weixin.qq.com/cgi-bin/loginpage?lang=zh_CN&t=wxm2-login"; ;
            loginRequest.Headers.Add("x-requested-with", "XMLHttpRequest");
            loginRequest.CookieContainer = StaticHelper.Cookie_WebChat;
            loginRequest.Method = "POST";

            loginRequest.AllowAutoRedirect = true;
            loginRequest.KeepAlive = true;
            loginRequest.ContentLength = byteArray.Length;
            loginRequest.UserAgent = "Mozilla/5.0 (Windows NT 6.1) AppleWebKit/537.17 (KHTML, like Gecko) Chrome/24.0.1312.57 Safari/537.17";

            Stream newStream = loginRequest.GetRequestStream();
            // Send the data.
            newStream.Write(byteArray, 0, byteArray.Length);    //写入参数
            newStream.Close();
            HttpWebResponse responseLogin = (HttpWebResponse)loginRequest.GetResponse();
            StreamReader srLogin = new StreamReader(responseLogin.GetResponseStream(), Encoding.Default);
            string textLogin = srLogin.ReadToEnd();
            StaticHelper.Cookie_WebChat = loginRequest.CookieContainer;
            WeiXinRetInfo retinfo = Newtonsoft.Json.JsonConvert.DeserializeObject<WeiXinRetInfo>(textLogin);
            return retinfo;
        }

        private byte[] loadQR_code()
        {
            var url = string.Format("https://mp.weixin.qq.com/cgi-bin/loginqrcode?action=getqrcode&param=4300&rd={0}", new Random().Next(1, 1000));
            HttpWebRequest QR_CodeRequest = (HttpWebRequest)WebRequest.Create(url);

            QR_CodeRequest.Accept = "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8";
            QR_CodeRequest.Headers.Add("Accept-Encoding", "gzip, deflate, sdch, br");
            QR_CodeRequest.Headers.Add("Accept-Language", "zh-CN,zh;q=0.8");
            QR_CodeRequest.Headers.Add("Cache-Control", "max-age=0");
            QR_CodeRequest.CookieContainer = StaticHelper.Cookie_WebChat;
            QR_CodeRequest.Method = "GET";
            QR_CodeRequest.KeepAlive = true;
            QR_CodeRequest.UserAgent = "Mozilla/5.0 (Windows NT 6.1) AppleWebKit/537.17 (KHTML, like Gecko) Chrome/24.0.1312.57 Safari/537.17";
            HttpWebResponse responseLogin = (HttpWebResponse)QR_CodeRequest.GetResponse();
            using (var ms = new MemoryStream())
            {
                responseLogin.GetResponseStream().CopyTo(ms);
                StaticHelper.Cookie_WebChat = QR_CodeRequest.CookieContainer;
                return ms.ToArray();
            }
        }

        private void getCookieAndToken()
        {
            var url = string.Format("https://mp.weixin.qq.com/cgi-bin/bizlogin?action=login&token=&lang=zh_CN ");
            var postStr = "token=&lang=zh_CN&f=json&ajax=1&random=0.5862220782551877";
            byte[] byteArray = Encoding.UTF8.GetBytes(postStr); // 转化
            HttpWebRequest token_Request = (HttpWebRequest)WebRequest.Create(url);

            token_Request.Accept = "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8";
            token_Request.Headers.Add("Accept-Encoding", "gzip, deflate, sdch, br");
            token_Request.Headers.Add("Accept-Language", "zh-CN,zh;q=0.8");
            token_Request.Headers.Add("Cache-Control", "max-age=0");
            token_Request.CookieContainer = StaticHelper.Cookie_WebChat;
            token_Request.Method = "POST";
            token_Request.KeepAlive = true;
            token_Request.UserAgent = "Mozilla/5.0 (Windows NT 6.1) AppleWebKit/537.17 (KHTML, like Gecko) Chrome/24.0.1312.57 Safari/537.17";

            Stream newStream = token_Request.GetRequestStream();
            // Send the data.
            newStream.Write(byteArray, 0, byteArray.Length);    //写入参数
            newStream.Close();

            HttpWebResponse responseLogined = (HttpWebResponse)token_Request.GetResponse();
            using (var ms = new MemoryStream())
            {
                responseLogined.GetResponseStream().CopyTo(ms);
                StaticHelper.Cookie_WebChat = token_Request.CookieContainer;
                var responseText = Encoding.UTF8.GetString(ms.ToArray());
                System.Diagnostics.Debug.WriteLine(responseText);
                WeiXinRetInfo retinfo = Newtonsoft.Json.JsonConvert.DeserializeObject<WeiXinRetInfo>(responseText);
            }
        }
    }
}