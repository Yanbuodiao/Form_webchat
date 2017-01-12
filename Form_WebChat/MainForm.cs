using System;
using System.Drawing;
using System.IO;
using System.Net;
using System.Security.Cryptography;
using System.Text;
using System.Windows.Forms;
using NPOI.HSSF.UserModel;
using NPOI.SS.Util;

namespace Form_WebChat
{
    public partial class MainForm : Form
    {
        static string userAgent = " Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/55.0.2883.87 Safari/537.36";
        static string strMPAccount = System.Configuration.ConfigurationManager.AppSettings["UserName"].Trim();
        static string strMPPassword = System.Configuration.ConfigurationManager.AppSettings["PWD"].Trim();
        static string strLoingMinutes = System.Configuration.ConfigurationManager.AppSettings["LoingMinutes"].Trim();
        static string appticket;
        static string binddalias;
        static CookieContainer Cookie_WebChat = new CookieContainer();//接收缓存
        static string token;
        System.Timers.Timer timer;
        public MainForm()
        {
            InitializeComponent();
        }

        private void MainForm_Load(object sender, EventArgs e)
        {

            //downloadFile(2, "");

            WeiXinRetInfo retinfo = webChatLogin();
            if (retinfo != null && retinfo.base_resp.ret == 0)
            {
                var allLoginResult = retinfo.redirect_url.Split('&');
                appticket = allLoginResult[3];
                binddalias = allLoginResult[4];
                lbl_summary.Text = "自动登录成功，请扫下面二维码进行认证";
                pictureBox1.Image = Image.FromStream(loadQR_code());
                timer = new System.Timers.Timer(3000);   //实例化Timer类，设置间隔时间为10000毫秒；   
                timer.Elapsed += (souce, ee) =>
                {
                    retinfo = loginQrCode();
                };
                timer.AutoReset = true;
                timer.Enabled = true;
            }
            else
            {
                lbl_summary.Text = "未登录成功！";
            }
        }

        private WeiXinRetInfo loginQrCode()
        {
            WeiXinRetInfo retinfo;
            var url = string.Format("https://mp.weixin.qq.com/cgi-bin/loginqrcode?action=ask&token=&lang=zh_CN&token=&lang=zh_CN&f=json&ajax=1&random={0}", Math.Round(new Random(Guid.NewGuid().GetHashCode()).NextDouble(), 15));
            HttpWebRequest logined_Request = (HttpWebRequest)WebRequest.Create(url);

            logined_Request.Accept = "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8";
            logined_Request.Headers.Add("Accept-Encoding", "gzip, deflate, sdch, br");
            logined_Request.Headers.Add("Accept-Language", "zh-CN,zh;q=0.8");
            logined_Request.Headers.Add("Cache-Control", "max-age=0");
            logined_Request.CookieContainer = Cookie_WebChat;
            logined_Request.Method = "GET";
            logined_Request.KeepAlive = true;
            logined_Request.UserAgent = userAgent;
            HttpWebResponse responseLogined = (HttpWebResponse)logined_Request.GetResponse();
            using (var ms = new MemoryStream())
            {
                responseLogined.GetResponseStream().CopyTo(ms);
                Cookie_WebChat = logined_Request.CookieContainer;
                var responseText = Encoding.UTF8.GetString(ms.ToArray());
                System.Diagnostics.Debug.WriteLine(responseText);
                retinfo = Newtonsoft.Json.JsonConvert.DeserializeObject<WeiXinRetInfo>(responseText);
                if (retinfo.status == 1)
                {
                    timer.Close();
                    if (getCookieAndToken())
                    {
                        lbl_summary.BeginInvoke(new MethodInvoker(() =>
                        {
                            lbl_summary.Text = "认证成功，开始下载数据并处理";
                            downAndHandleData();
                        }), null);
                    }
                    else
                    {
                        lbl_summary.BeginInvoke(new MethodInvoker(() => lbl_summary.Text = "认证失败"), null);
                    }
                }
            }
            return retinfo;
        }

        private WeiXinRetInfo webChatLogin()
        {
            string password = GetMd5Str32(strMPPassword).ToUpper();
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
            loginRequest.CookieContainer = Cookie_WebChat;
            loginRequest.Method = "POST";

            loginRequest.AllowAutoRedirect = true;
            loginRequest.KeepAlive = true;
            loginRequest.ContentLength = byteArray.Length;
            loginRequest.UserAgent = userAgent;

            Stream newStream = loginRequest.GetRequestStream();
            // Send the data.
            newStream.Write(byteArray, 0, byteArray.Length);    //写入参数
            newStream.Close();
            HttpWebResponse responseLogin = (HttpWebResponse)loginRequest.GetResponse();
            StreamReader srLogin = new StreamReader(responseLogin.GetResponseStream(), Encoding.Default);
            string textLogin = srLogin.ReadToEnd();
            Cookie_WebChat = loginRequest.CookieContainer;
            WeiXinRetInfo retinfo = Newtonsoft.Json.JsonConvert.DeserializeObject<WeiXinRetInfo>(textLogin);
            return retinfo;
        }

        private Stream loadQR_code()
        {
            var url = string.Format("https://mp.weixin.qq.com/cgi-bin/loginqrcode?action=getqrcode&param=4300&rd={0}", new Random().Next(1, 1000));
            HttpWebRequest QR_CodeRequest = (HttpWebRequest)WebRequest.Create(url);

            QR_CodeRequest.Accept = "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8";
            QR_CodeRequest.Headers.Add("Accept-Encoding", "gzip, deflate, sdch, br");
            QR_CodeRequest.Headers.Add("Accept-Language", "zh-CN,zh;q=0.8");
            QR_CodeRequest.Headers.Add("Cache-Control", "max-age=0");
            QR_CodeRequest.CookieContainer = Cookie_WebChat;
            QR_CodeRequest.Method = "GET";
            QR_CodeRequest.KeepAlive = true;
            QR_CodeRequest.UserAgent = "Mozilla/5.0 (Windows NT 6.1) AppleWebKit/537.17 (KHTML, like Gecko) Chrome/24.0.1312.57 Safari/537.17";
            HttpWebResponse responseLogin = (HttpWebResponse)QR_CodeRequest.GetResponse();
            var ms = new MemoryStream();
            responseLogin.GetResponseStream().CopyTo(ms);
            Cookie_WebChat = QR_CodeRequest.CookieContainer;
            return ms;
        }

        private bool getCookieAndToken()
        {
            var url = string.Format("https://mp.weixin.qq.com/cgi-bin/bizlogin?action=login&token=&lang=zh_CN ");
            var postStr = "token=&lang=zh_CN&f=json&ajax=1&random=" + Math.Round(new Random(Guid.NewGuid().GetHashCode()).NextDouble(), 15);
            byte[] byteArray = Encoding.UTF8.GetBytes(postStr); // 转化
            HttpWebRequest token_Request = (HttpWebRequest)WebRequest.Create(url);

            token_Request.Accept = "application/json, text/javascript, */*; q=0.01";
            token_Request.Headers.Add("Accept-Encoding", "gzip, deflate, sdch, br");
            token_Request.Headers.Add("Accept-Language", "zh-CN,zh;q=0.8");
            token_Request.Referer = string.Format("https://mp.weixin.qq.com/cgi-bin/readtemplate?t=user/validate_wx_tmpl&lang=zh_CN&account={0}&{1}&{2}&wx_protect=1&bind_app_type=1&grey=1", System.Web.HttpUtility.UrlEncode(strMPAccount), appticket, binddalias);
            token_Request.CookieContainer = Cookie_WebChat;
            token_Request.Method = "POST";
            token_Request.KeepAlive = true;
            token_Request.UserAgent = userAgent;

            Stream newStream = token_Request.GetRequestStream();
            // Send the data.
            newStream.Write(byteArray, 0, byteArray.Length);    //写入参数
            newStream.Close();

            HttpWebResponse responseLogined = (HttpWebResponse)token_Request.GetResponse();
            using (var ms = new MemoryStream())
            {
                responseLogined.GetResponseStream().CopyTo(ms);
                Cookie_WebChat = token_Request.CookieContainer;
                var responseText = Encoding.UTF8.GetString(ms.ToArray());
                System.Diagnostics.Debug.WriteLine(responseText);
                WeiXinRetInfo retinfo = Newtonsoft.Json.JsonConvert.DeserializeObject<WeiXinRetInfo>(responseText);
                if (retinfo != null && !string.IsNullOrEmpty(retinfo.redirect_url))
                {
                    token = retinfo.redirect_url.Split('&')[1].Split('=')[1];
                    return true;
                }
                else
                {
                    return getCookieAndToken();
                }
            }
        }

        private static string GetMd5Str32(string str)
        {
            MD5CryptoServiceProvider md5Hasher = new MD5CryptoServiceProvider();
            char[] temp = str.ToCharArray();
            byte[] buf = new byte[temp.Length];
            for (int i = 0; i < temp.Length; i++)
            {
                buf[i] = (byte)temp[i];
            }
            byte[] data = md5Hasher.ComputeHash(buf);
            StringBuilder sBuilder = new StringBuilder();
            for (int i = 0; i < data.Length; i++)
            {
                sBuilder.Append(data[i].ToString("x2"));
            }
            return sBuilder.ToString();
        }

        private void downloadFile(int qid, string cname)
        {
            try
            {
                var downloadURL = string.Format("https://mp.weixin.qq.com/promotion/snsdelivery/snsstat?action=download_ques&qid={0}&cname={1}&token={2}", qid, cname, token);
                //var downloadURL = string.Format("http://localhost:32461/filetest/index");


                HttpWebRequest fileRequest = (HttpWebRequest)WebRequest.Create(downloadURL);

                fileRequest.Accept = "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8";
                fileRequest.Headers.Add("Accept-Encoding", "gzip, deflate, sdch, br");
                fileRequest.Headers.Add("Accept-Language", "zh-CN,zh;q=0.8");
                fileRequest.Headers.Add("Cache-Control", "max-age=0");
                fileRequest.CookieContainer = Cookie_WebChat;
                fileRequest.Method = "GET";
                fileRequest.KeepAlive = true;
                fileRequest.UserAgent = "Mozilla/5.0 (Windows NT 6.1) AppleWebKit/537.17 (KHTML, like Gecko) Chrome/24.0.1312.57 Safari/537.17";
                HttpWebResponse responseFile = (HttpWebResponse)fileRequest.GetResponse();
                using (var ms = new MemoryStream())
                {
                    responseFile.GetResponseStream().CopyTo(ms);
                    Cookie_WebChat = fileRequest.CookieContainer;
                    var responseText = Encoding.UTF8.GetString(ms.ToArray());
                    var tempResult = XmlHelper.XmlDeserialize<WeiXinRetInfo>(responseText, Encoding.UTF8);
                    System.Diagnostics.Debug.WriteLine(responseText);
                };
            }
            catch (Exception ex)
            {

            }
        }

        private void downAndHandleData()
        {

            ADListModel.AvailableADList.ForEach(e =>
            {
                downloadFile(e.qid, e.cname);
            });
        }
    }
}
