using Form_WebChat.Modle;
using System;
using System.Collections.Generic;
using System.Drawing;
using System.IO;
using System.Linq;
using System.Net;
using System.Security.Cryptography;
using System.Text;
using System.Threading;
using System.Windows.Forms;

namespace Form_WebChat
{
    public partial class MainForm : Form
    {
        static string userAgent = " Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/55.0.2883.87 Safari/537.36";
        static string strMPAccount = System.Configuration.ConfigurationManager.AppSettings["UserName"].Trim();
        static string strMPPassword = System.Configuration.ConfigurationManager.AppSettings["PWD"].Trim();
        static int intervalMinutes = int.Parse(System.Configuration.ConfigurationManager.AppSettings["IntervalMinutes"].Trim());
        static string uploadURL = System.Configuration.ConfigurationManager.AppSettings["UploadURL"].Trim();
        static string appticket;
        static string binddalias;
        static CookieContainer Cookie_WebChat = new CookieContainer();//接收缓存
        static string token;
        static System.Timers.Timer timer;
        public MainForm()
        {
            InitializeComponent();
        }

        private void MainForm_Load(object sender, EventArgs e)
        {
            try
            {
                //WeiXinRetInfo retinfo = webChatLogin();
                //if (retinfo != null && retinfo.base_resp.ret == 0)
                //{
                //    var allLoginResult = retinfo.redirect_url.Split('&');
                //    appticket = allLoginResult[3];
                //    binddalias = allLoginResult[4];
                //    lbl_summary.Text = "自动登录成功，请扫下面二维码进行认证";
                //    showMessage("自动登录成功，请扫下面二维码进行认证");
                //    pictureBox1.Image = Image.FromStream(loadQR_code());
                //    timer = new System.Timers.Timer(3000);
                //    timer.Elapsed += (souce, ee) =>
                //    {
                //        retinfo = loginQrCode();
                //    };
                //    timer.AutoReset = true;
                //    timer.Enabled = true;
                //}
                //else
                //{
                //    lbl_summary.Text = "未登录成功！";
                //    showMessage("未登录成功");
                //}


                CustomerListModel.AvailableCustomerList.ForEach(p => { p.UpdateState = 1; p.UpdateTime = DateTime.Now; });

                CustomerListModel.SolidCache();

            }
            catch (Exception ex)
            {
                showMessage(string.Format("Error---{0}", ex.Message));
            }
        }

        private WeiXinRetInfo loginQrCode()
        {
            try
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
                    showMessage("查询二维码认证状态");
#if DEBUG
                    System.Diagnostics.Debug.WriteLine(responseText);
#endif
                    retinfo = Newtonsoft.Json.JsonConvert.DeserializeObject<WeiXinRetInfo>(responseText);
                    if (retinfo.status == 1)
                    {
                        timer.Stop();
                        if (getCookieAndToken())
                        {
                            lbl_summary.BeginInvoke(new MethodInvoker(() =>
                            {
                                lbl_summary.Text = "认证成功，开始下载数据并处理";
                                showMessage("认证成功，开始下载数据并处理");
                                pictureBox1.Visible = false;
                                ThreadPool.QueueUserWorkItem(_ =>
                                {
                                    downAndHandleData();
                                });
                            }), null);
                        }
                        else
                        {
                            showMessage("认证失败");
                            lbl_summary.BeginInvoke(new MethodInvoker(() => lbl_summary.Text = "认证失败"), null);
                        }
                        timer.Close();
                    }
                }
                return retinfo;
            }
            catch (Exception ex)
            {
                showMessage(string.Format("Error---{0}", ex.Message));
                return null;
            }
        }

        private WeiXinRetInfo webChatLogin()
        {
            try
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
                showMessage("开始自动登录");
                StreamReader srLogin = new StreamReader(responseLogin.GetResponseStream(), Encoding.Default);
                string textLogin = srLogin.ReadToEnd();
                Cookie_WebChat = loginRequest.CookieContainer;
                WeiXinRetInfo retinfo = Newtonsoft.Json.JsonConvert.DeserializeObject<WeiXinRetInfo>(textLogin);
                return retinfo;
            }
            catch (Exception ex)
            {
                showMessage(string.Format("Error---{0}", ex.Message));
                return null;
            }
        }

        private Stream loadQR_code()
        {
            try
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
                showMessage("认证二维码下载成功");
                return ms;
            }
            catch (Exception ex)
            {
                showMessage(string.Format("Error---{0}", ex.Message));
                return new MemoryStream();
            }
        }

        private bool getCookieAndToken()
        {
            try
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
#if DEBUG
                    System.Diagnostics.Debug.WriteLine(responseText);
#endif
                    WeiXinRetInfo retinfo = Newtonsoft.Json.JsonConvert.DeserializeObject<WeiXinRetInfo>(responseText);
                    if (retinfo != null && !string.IsNullOrEmpty(retinfo.redirect_url))
                    {
                        //token = retinfo.redirect_url.Split('&')[1].Split('=')[1];
                        token = retinfo.redirect_url.Split('&')[2].Split('=')[1];
                        showMessage("token获取成功，开始数据下载及处理");
                        return true;
                    }
                    else
                    {
                        return getCookieAndToken();
                    }
                }
            }
            catch (Exception ex)
            {
                showMessage(string.Format("Error---{0}", ex.Message));
                return false;
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

        private List<AdModel> downloadFile(int qid, string cname, string adId)
        {
            try
            {
                var downloadURL = string.Format("https://mp.weixin.qq.com/promotion/snsdelivery/snsstat?action=download_ques&qid={0}&cname={1}&token={2}", qid, cname, token);
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
#if DEBUG
                    System.Diagnostics.Debug.WriteLine(responseText);
#endif

                    if (tempResult == null)
                    {
                        var customerDatas = responseText.Split(new string[] { "\n" }, StringSplitOptions.None).Where(c => !c.StartsWith("﻿姓名")).ToList();
                        var dataResult = customerDatas.Select(e =>
                        {
                            if (!string.IsNullOrWhiteSpace(e))
                            {
                                var row = e.Split(',');
                                if (row.Count() >= 4)
                                {
                                    var adModel = new AdModel
                                    {
                                        CName = cname,
                                        CustomerName = row[0],
                                        Sex = row[1],
                                        TelePhone = row[2],
                                        Age = row[3],
                                        AdId = adId,
                                        City = cname.Substring(0, 2),
                                    };
                                    adModel.Remark = string.Format("{0}--{1}--{2}--{3}", cname
                                        , row.Count() > 3 ? row[3] : ""
                                        , row.Count() > 4 ? row[4] : ""
                                        , row.Count() > 5 ? row[5] : "");
                                    return adModel;
                                }
                            }
                            return null;
                        }).Where(t => t != null).ToList();

                        showMessage(string.Format("下载成功了{0}条数据", dataResult.Count));
                        return dataResult;
                    }
                    return null;
                };
            }
            catch (Exception ex)
            {
                showMessage(string.Format("Error---{0}", ex.Message));
                return null;
            }
        }

        private void downAndHandleData()
        {
            try
            {
                while (true)
                {
                    var IncrementalList = new List<AdModel>();
                    var time = DateTime.Now;
                    getAllADs();
                    ADListModel.AvailableADList.ForEach(e =>
                    {
                        if (e.qid > 0)
                        {
                            var tempList = downloadFile(e.qid, e.cname, e.ADID);
                            tempList.ForEach(c =>
                            {
                                if (!CustomerListModel.AvailableCustomerList.Any(p => (p.AdId == c.AdId &&
                                    p.CustomerName == c.CustomerName &&
                                    p.Sex == c.Sex &&
                                    p.TelePhone == c.TelePhone)))
                                {
                                    CustomerListModel.AvailableCustomerList.Add(c);
                                    IncrementalList.Add(c);
                                }
                            });
                        }
                    });
                    showMessage(string.Format("本次下载完毕，新下载了{0}条数据", IncrementalList.Count));
                    uploadData(time);
                    CustomerListModel.SolidCache();
                    showMessage(string.Format("本次处理完毕，下载在{0}分钟后开始下次下载和处理数据", intervalMinutes));
                    Thread.Sleep(intervalMinutes * 60 * 1000);
                }
            }
            catch (Exception ex)
            {
                showMessage(string.Format("Error---{0}", ex.Message));
            }
        }

        private void uploadData(DateTime time)
        {
            try
            {
                var allData = CustomerListModel.AvailableCustomerList.Where(e => e.UpdateState == 0).Select(e => new UpLoadContent
                    {
                        city = e.City,
                        sex = e.Sex,
                        name = e.CustomerName,
                        phone = e.TelePhone,
                        remark = e.CName,
                    }).ToList();
                var index = 0;
                var size = 10;
                var maxIndex = allData.Count / size + 1;
                showMessage(string.Format("开始上传数据"));
                while (index < maxIndex)
                {
                    using (var webClient = new WebClient())
                    {
                        var uploadModel = new UpLoadModel();
                        uploadModel.time = time.ToString("yyyy-MM-dd HH:mm:ss");
                        uploadModel.content = allData.Skip(index * size).Take(size).ToList();
                        var uploadStr = JsonHelper.SerializeObject(uploadModel);
                        var responseBytes = webClient.UploadData(uploadURL, "Post", Encoding.UTF8.GetBytes(uploadStr));
                        var responseText = Encoding.UTF8.GetString(responseBytes);
                        var adDetail = JsonHelper.DeserializeObject<UpdateReturnModel>(responseText);
#if DEBUG
                        System.Diagnostics.Debug.WriteLine(index);
#endif
                        if (adDetail != null)
                        {
                            if (adDetail.status == "200")
                            {
                                CustomerListModel.AvailableCustomerList.Where(e => e.UpdateState == 0).ToList().ForEach(p =>
                                {
                                    p.UpdateState = 1;
                                    p.UpdateTime = DateTime.Now;
                                });
                                showMessage(string.Format("本次上传成功了{0}条数据", uploadModel.content.Count));
                            }
                            if (adDetail.status == "400")
                            {
                                CustomerListModel.AvailableCustomerList.Where(e => e.UpdateState == 0).ToList().ForEach(p =>
                                {
                                    if (!adDetail.list.Any(t => t == p.TelePhone))
                                    {
                                        p.UpdateState = 1;
                                        p.UpdateTime = DateTime.Now;
                                    }
                                });
                                showMessage(string.Format("本次上传成功了{0}条数据；失败了{0}条数据", uploadModel.content.Count - adDetail.list.Count, adDetail.list.Count));
                            }
                        }
                        index++;
                    }
                }
            }
            catch (Exception ex)
            {
                showMessage(string.Format("Error---{0}", ex.Message));
                throw;
            }
        }

        private void getAllADs()
        {
            var pageIndex = 1;
            var maxPage = 1;
            try
            {
                showMessage(string.Format("开始刷新广告列表"));
                while (pageIndex <= maxPage)
                {
                    var downloadURL = string.Format("https://mp.weixin.qq.com/promotion/snsdelivery/sns_advert_mgr?page={0}&page_size=6&action=list&status=6&begin_time=1468944000&end_time=1500048000&list_type=2&token={1}&appid=&_={2}", pageIndex, token, "");
                    HttpWebRequest AdRequests = (HttpWebRequest)WebRequest.Create(downloadURL);
                    AdRequests.Accept = "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8";
                    AdRequests.Timeout = 60 * 1000;
                    AdRequests.Headers.Add("Accept-Encoding", "gzip, deflate, sdch, br");
                    AdRequests.Headers.Add("Accept-Language", "zh-CN,zh;q=0.8");
                    AdRequests.Headers.Add("Cache-Control", "max-age=0");
                    AdRequests.CookieContainer = Cookie_WebChat;
                    AdRequests.Method = "GET";
                    AdRequests.KeepAlive = true;
                    AdRequests.UserAgent = "Mozilla/5.0 (Windows NT 6.1) AppleWebKit/537.17 (KHTML, like Gecko) Chrome/24.0.1312.57 Safari/537.17";
                    HttpWebResponse responseFile = (HttpWebResponse)AdRequests.GetResponse();
                    using (var ms = new MemoryStream())
                    {
                        responseFile.GetResponseStream().CopyTo(ms);
                        Cookie_WebChat = AdRequests.CookieContainer;
                        var responseText = Encoding.UTF8.GetString(ms.ToArray());
                        var adList = JsonHelper.DeserializeObject<WebChatAdListModel>(responseText);
                        if (adList != null)
                        {
                            if (adList.conf != null)
                            {
                                maxPage = adList.conf.total_page;
                            }
                            if (adList.list != null)
                            {
                                adList.list.ForEach(c =>
                                {
                                    if (c.campaign != null && !ADListModel.AvailableADList.Any(p => p.ADID == c.campaign.cid))
                                    {
                                        ADListModel.AvailableADList.Add(new downLoadFileModel
                                        {
                                            ADID = c.campaign.cid,
                                            cname = c.campaign.cname,
                                        });
                                    }
                                });
                            }
                            pageIndex++;
                        }
#if DEBUG
                        System.Diagnostics.Debug.WriteLine(responseText);
#endif
                    };
                }
                showMessage(string.Format("开始刷新广告的pid"));
                ADListModel.AvailableADList.ForEach(j =>
                {
                    if (j.qid == 0)
                    {
                        j.qid = getPid(j.ADID);
                    }
                });
                showMessage(string.Format("刷新广告的pid完毕"));
                ADListModel.SolidCache();
                showMessage(string.Format("刷新广告列表完毕"));
            }
            catch (Exception ex)
            {
                showMessage(string.Format("Error---{0}", ex.Message));
            }
        }

        private int getPid(string adID)
        {
            try
            {
                var downloadURL = string.Format("https://mp.weixin.qq.com/promotion/snsdelivery/sns_advert_mgr?action=creative_detail&cid={0}&token={1}&appid=&_={2}", adID, token, "");
                HttpWebRequest AdRequests = (HttpWebRequest)WebRequest.Create(downloadURL);
                AdRequests.Accept = "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8";
                AdRequests.Timeout = 60 * 1000;
                AdRequests.Headers.Add("Accept-Encoding", "gzip, deflate, sdch, br");
                AdRequests.Headers.Add("Accept-Language", "zh-CN,zh;q=0.8");
                AdRequests.Headers.Add("Cache-Control", "max-age=0");
                AdRequests.CookieContainer = Cookie_WebChat;
                AdRequests.Method = "GET";
                AdRequests.KeepAlive = true;
                AdRequests.UserAgent = "Mozilla/5.0 (Windows NT 6.1) AppleWebKit/537.17 (KHTML, like Gecko) Chrome/24.0.1312.57 Safari/537.17";
                HttpWebResponse responseFile = (HttpWebResponse)AdRequests.GetResponse();
                using (var ms = new MemoryStream())
                {
                    responseFile.GetResponseStream().CopyTo(ms);
                    Cookie_WebChat = AdRequests.CookieContainer;
                    var responseText = Encoding.UTF8.GetString(ms.ToArray());
                    var adDetail = JsonHelper.DeserializeObject<ADDetailModel>(responseText);
#if DEBUG
                    System.Diagnostics.Debug.WriteLine(responseText);
#endif

                    if (adDetail != null && adDetail.questionnaire != null)
                    {
                        return adDetail.questionnaire.qid;
                    }
                    return 0;
                };
            }
            catch (Exception ex)
            {
                showMessage(string.Format("Error---{0}", ex.Message));
                return 0;
            }
        }

        private void showMessage(string msg)
        {
            richTextBox1.BeginInvoke(new MethodInvoker(() =>
            {
                richTextBox1.AppendText(string.Format("{0}---{1}\r\n", DateTime.Now.ToString("yy-MM-dd hh:mm:ss"), msg));
                var maxlenth = 200;
                if (richTextBox1.Lines.Length > maxlenth)
                {
                    string[] sLines = richTextBox1.Lines;
                    var outLineLenghth = sLines.Length - maxlenth;
                    string[] sNewLines = new string[maxlenth];
                    Array.Copy(sLines, outLineLenghth, sNewLines, 0, maxlenth);
                    richTextBox1.Lines = sNewLines;

                }

                richTextBox1.SelectionStart = richTextBox1.TextLength;
                richTextBox1.Focus();
            }), null);
        }
    }
}
