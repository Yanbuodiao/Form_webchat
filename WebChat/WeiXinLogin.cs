using System;
using System.IO;
using System.Net;
using System.Security.Cryptography;
using System.Text;

public class WeiXinLogin
{
    static string strMPAccount = System.Configuration.ConfigurationManager.AppSettings["UserName"].Trim();
    static string strMPPassword = System.Configuration.ConfigurationManager.AppSettings["PWD"].Trim();
    public static string strLoingMinutes = System.Configuration.ConfigurationManager.AppSettings["LoingMinutes"].Trim();

    //public static string MPCode = System.Configuration.ConfigurationManager.AppSettings["MPCode"].Trim();
    //public static string Token = System.Configuration.ConfigurationManager.AppSettings["Token"].Trim();

    /// <summary>
    /// MD5　32位加密
    /// </summary>
    /// <param name="str"></param>
    /// <returns></returns>
    static string GetMd5Str32(string str)
    {
        MD5CryptoServiceProvider md5Hasher = new MD5CryptoServiceProvider();
        // Convert the input string to a byte array and compute the hash.  
        char[] temp = str.ToCharArray();
        byte[] buf = new byte[temp.Length];
        for (int i = 0; i < temp.Length; i++)
        {
            buf[i] = (byte)temp[i];
        }
        byte[] data = md5Hasher.ComputeHash(buf);
        // Create a new Stringbuilder to collect the bytes  
        // and create a string.  
        StringBuilder sBuilder = new StringBuilder();
        // Loop through each byte of the hashed data   
        // and format each one as a hexadecimal string.  
        for (int i = 0; i < data.Length; i++)
        {
            sBuilder.Append(data[i].ToString("x2"));
        }
        // Return the hexadecimal string.  
        return sBuilder.ToString();
    }

    public static string ExecLogin()
    {
        if (null == WeiXinLogin.LoginInfo.LoginCookie || WeiXinLogin.LoginInfo.CreateDate.AddMinutes(Convert.ToInt32(WeiXinLogin.strLoingMinutes)) < DateTime.Now)
        {

            string password = GetMd5Str32(strMPPassword).ToUpper(); 
            string padata = "username=" + System.Web.HttpUtility.UrlEncode(strMPAccount) + "&pwd=" + password + "&imgcode=&f=json";
            string url = "https://mp.weixin.qq.com/cgi-bin/bizlogin?action=startlogin";//请求登录的URL
            try
            {
                CookieContainer cc = new CookieContainer();//接收缓存
                byte[] byteArray = Encoding.UTF8.GetBytes(padata); // 转化
                HttpWebRequest loginRequest = (HttpWebRequest)WebRequest.Create(url);

                loginRequest.Accept = "application/json, text/javascript, */*; q=0.01";
                loginRequest.Headers.Add("Accept-Encoding", "gzip, deflate");
                loginRequest.Headers.Add("Accept-Language", "zh-cn");
                loginRequest.Headers.Add("Cache-Control", "no-cache");
                loginRequest.ContentType = "application/x-www-form-urlencoded";
                loginRequest.Referer = "http://mp.weixin.qq.com/cgi-bin/loginpage?lang=zh_CN&t=wxm2-login";;
                loginRequest.Headers.Add("x-requested-with", "XMLHttpRequest");
                loginRequest.CookieContainer = cc;
                loginRequest.Method = "POST";

                loginRequest.AllowAutoRedirect = true;
                loginRequest.KeepAlive = true;
                loginRequest.ContentLength = byteArray.Length;
                loginRequest.UserAgent = "Mozilla/5.0 (Windows NT 6.1) AppleWebKit/537.17 (KHTML, like Gecko) Chrome/24.0.1312.57 Safari/537.17";

                Stream newStream = loginRequest.GetRequestStream();
                // Send the data.
                newStream.Write(byteArray, 0, byteArray.Length);    //写入参数
                newStream.Close();
                HttpWebResponse loginResponse = (HttpWebResponse)loginRequest.GetResponse();
                StreamReader srLogin = new StreamReader(loginResponse.GetResponseStream(), Encoding.Default);
                string textLogin = srLogin.ReadToEnd();
                cc = loginRequest.CookieContainer;
                WeiXinRetInfo retinfo = Newtonsoft.Json.JsonConvert.DeserializeObject<WeiXinRetInfo>(textLogin);
                if (retinfo != null && retinfo.base_resp.ret == 0)
                {
                    HttpWebRequest imgPageRequest = (HttpWebRequest)WebRequest.Create(string.Format("http://mp.weixin.qq.com{0}", retinfo.redirect_url));
                    imgPageRequest.CookieContainer = cc;
                    imgPageRequest.ContentType = "application/x-www-form-urlencoded";
                    imgPageRequest.Method = "Get";
                    imgPageRequest.KeepAlive = true;
                    imgPageRequest.Headers.Add("x-requested-with", "XMLHttpRequest");
                    imgPageRequest.UserAgent = "Mozilla/5.0 (Windows NT 6.1) AppleWebKit/537.17 (KHTML, like Gecko) Chrome/24.0.1312.57 Safari/537.17";

                    HttpWebResponse imageResponse = (HttpWebResponse)imgPageRequest.GetResponse();
                    StreamReader srImage = new StreamReader(imageResponse.GetResponseStream(), Encoding.UTF8);
                    string texImage = srImage.ReadToEnd();
                    return string.Format("http://mp.weixin.qq.com{0}", retinfo.redirect_url);
                }

                return null;
            }
            catch (Exception ex)
            {
                return null;
            }
        }
        else
        {
            return null;
        }
    }


    public static class LoginInfo
    {
        /// <summary>
        /// 登录后得到的令牌
        /// </summary>        
        public static string Token { get; set; }
        /// <summary>
        /// 登录后得到的cookie
        /// </summary>
        public static CookieContainer LoginCookie { get; set; }
        /// <summary>
        /// 创建时间
        /// </summary>
        public static DateTime CreateDate { get; set; }

    }
}
