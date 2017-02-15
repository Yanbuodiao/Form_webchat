using Form_WebChat.Modle;
using System;
using System.Collections.Generic;
using System.Configuration;
using System.Drawing;
using System.IO;
using System.Linq;
using System.Net;
using System.Net.Mail;
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
        static int timeoutMinutes = int.Parse(System.Configuration.ConfigurationManager.AppSettings["TimeOutMinutes"].Trim());
        static string uploadURL = System.Configuration.ConfigurationManager.AppSettings["UploadURL"].Trim();
        static string sendMSGURL = System.Configuration.ConfigurationManager.AppSettings["SendMSGURL"].Trim();
        static string appticket;
        static string binddalias;
        static CookieContainer Cookie_WebChat = new CookieContainer();//接收缓存
        static string token;
        static System.Timers.Timer timer;
        static bool haveSendMSg;
        public MainForm()
        {
            InitializeComponent();
        }

        private void MainForm_Load(object sender, EventArgs e)
        {
            try
            {
                WeiXinRetInfo retinfo = webChatLogin();
                if (retinfo != null && retinfo.base_resp.ret == 0)
                {
                    var allLoginResult = retinfo.redirect_url.Split('&');
                    appticket = allLoginResult[3];
                    binddalias = allLoginResult[4];
                    lbl_summary.Text = "自动登录成功，请扫下面二维码进行认证";
                    showMessage("自动登录成功，请扫下面二维码进行认证");
                    pictureBox1.Image = Image.FromStream(loadQR_code());
                    timer = new System.Timers.Timer(3000);
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
                    showMessage("未登录成功");
                }
            }
            catch (Exception ex)
            {
                var msgStr = string.Format("Error---自动登录---{0}", ex.Message);
                showMessage(msgStr);
                sendMessage(msgStr);
            }
        }

        private WeiXinRetInfo loginQrCode()
        {
            try
            {
                WeiXinRetInfo retinfo;
                var url = string.Format("https://mp.weixin.qq.com/cgi-bin/loginqrcode?action=ask&token=&lang=zh_CN&token=&lang=zh_CN&f=json&ajax=1&random={0}", Math.Round(new Random(Guid.NewGuid().GetHashCode()).NextDouble(), 15));
                HttpWebRequest request = (HttpWebRequest)WebRequest.Create(url);

                request.Timeout = timeoutMinutes * 60 * 1000;
                request.Accept = "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8";
                request.Headers.Add("Accept-Encoding", "gzip, deflate, sdch, br");
                request.Headers.Add("Accept-Language", "zh-CN,zh;q=0.8");
                request.Headers.Add("Cache-Control", "max-age=0");
                request.CookieContainer = Cookie_WebChat;
                request.Method = "GET";
                request.KeepAlive = true;
                request.UserAgent = userAgent;
                using (HttpWebResponse responseLogined = (HttpWebResponse)request.GetResponse())
                {
                    using (var ms = new MemoryStream())
                    {
                        responseLogined.GetResponseStream().CopyTo(ms);
                        Cookie_WebChat = request.CookieContainer;
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
                }
                return retinfo;
            }
            catch (Exception ex)
            {
                var msgStr = string.Format("Error---二维码认证---{0}", ex.Message);
                showMessage(msgStr);
                sendMessage(msgStr);
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
                HttpWebRequest request = (HttpWebRequest)WebRequest.Create(url);
                request.Timeout = timeoutMinutes * 60 * 1000;
                request.Accept = "application/json, text/javascript, */*; q=0.01";
                request.Headers.Add("Accept-Encoding", "gzip, deflate");
                request.Headers.Add("Accept-Language", "zh-cn");
                request.Headers.Add("Cache-Control", "no-cache");
                request.ContentType = "application/x-www-form-urlencoded";
                request.Referer = "http://mp.weixin.qq.com/cgi-bin/loginpage?lang=zh_CN&t=wxm2-login"; ;
                request.Headers.Add("x-requested-with", "XMLHttpRequest");
                request.CookieContainer = Cookie_WebChat;
                request.Method = "POST";

                request.AllowAutoRedirect = true;
                request.KeepAlive = true;
                request.ContentLength = byteArray.Length;
                request.UserAgent = userAgent;

                Stream newStream = request.GetRequestStream();
                // Send the data.
                newStream.Write(byteArray, 0, byteArray.Length);    //写入参数
                newStream.Close();
                using (HttpWebResponse responseLogin = (HttpWebResponse)request.GetResponse())
                {
                    showMessage("开始自动登录");
                    StreamReader srLogin = new StreamReader(responseLogin.GetResponseStream(), Encoding.Default);
                    string textLogin = srLogin.ReadToEnd();
                    Cookie_WebChat = request.CookieContainer;
                    WeiXinRetInfo retinfo = Newtonsoft.Json.JsonConvert.DeserializeObject<WeiXinRetInfo>(textLogin);
                    return retinfo;
                }
            }
            catch (Exception ex)
            {
                var msgStr = string.Format("Error---自动登录---{0}", ex.Message);
                showMessage(msgStr);
                sendMessage(msgStr);
                return null;
            }
        }

        private Stream loadQR_code()
        {
            try
            {
                var url = string.Format("https://mp.weixin.qq.com/cgi-bin/loginqrcode?action=getqrcode&param=4300&rd={0}", new Random().Next(1, 1000));
                HttpWebRequest request = (HttpWebRequest)WebRequest.Create(url);
                request.Timeout = timeoutMinutes * 60 * 1000;
                request.Accept = "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8";
                request.Headers.Add("Accept-Encoding", "gzip, deflate, sdch, br");
                request.Headers.Add("Accept-Language", "zh-CN,zh;q=0.8");
                request.Headers.Add("Cache-Control", "max-age=0");
                request.CookieContainer = Cookie_WebChat;
                request.Method = "GET";
                request.KeepAlive = true;
                request.UserAgent = "Mozilla/5.0 (Windows NT 6.1) AppleWebKit/537.17 (KHTML, like Gecko) Chrome/24.0.1312.57 Safari/537.17";
                HttpWebResponse responseLogin = (HttpWebResponse)request.GetResponse();
                var ms = new MemoryStream();
                responseLogin.GetResponseStream().CopyTo(ms);
                Cookie_WebChat = request.CookieContainer;
                showMessage("认证二维码下载成功");
                return ms;
            }
            catch (Exception ex)
            {
                var msgStr = string.Format("Error---下载认证二维码---{0}", ex.Message);
                showMessage(msgStr);
                sendMessage(msgStr);
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
                HttpWebRequest request = (HttpWebRequest)WebRequest.Create(url);

                request.Timeout = timeoutMinutes * 60 * 1000;
                request.Accept = "application/json, text/javascript, */*; q=0.01";
                request.Headers.Add("Accept-Encoding", "gzip, deflate, sdch, br");
                request.Headers.Add("Accept-Language", "zh-CN,zh;q=0.8");
                request.Referer = string.Format("https://mp.weixin.qq.com/cgi-bin/readtemplate?t=user/validate_wx_tmpl&lang=zh_CN&account={0}&{1}&{2}&wx_protect=1&bind_app_type=1&grey=1", System.Web.HttpUtility.UrlEncode(strMPAccount), appticket, binddalias);
                request.CookieContainer = Cookie_WebChat;
                request.Method = "POST";
                request.KeepAlive = true;
                request.UserAgent = userAgent;

                Stream newStream = request.GetRequestStream();
                newStream.Write(byteArray, 0, byteArray.Length);
                newStream.Close();

                using (HttpWebResponse responseLogined = (HttpWebResponse)request.GetResponse())
                {
                    using (var ms = new MemoryStream())
                    {
                        responseLogined.GetResponseStream().CopyTo(ms);
                        Cookie_WebChat = request.CookieContainer;
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
            }
            catch (Exception ex)
            {
                var msgStr = string.Format("Error---获取登录token---{0}", ex.Message);
                showMessage(msgStr);
                sendMessage(msgStr);
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
                Thread.Sleep(randomSeconde());
                var downloadURL = string.Format("https://mp.weixin.qq.com/promotion/snsdelivery/snsstat?action=download_ques&qid={0}&cname={1}&token={2}", qid, cname, token);
                HttpWebRequest request = (HttpWebRequest)WebRequest.Create(downloadURL);
                request.Timeout = timeoutMinutes * 60 * 1000;
                request.Accept = "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8";
                request.Headers.Add("Accept-Encoding", "gzip, deflate, sdch, br");
                request.Headers.Add("Accept-Language", "zh-CN,zh;q=0.8");
                request.Headers.Add("Cache-Control", "max-age=0");
                request.CookieContainer = Cookie_WebChat;
                request.Method = "GET";
                request.KeepAlive = true;
                request.UserAgent = "Mozilla/5.0 (Windows NT 6.1) AppleWebKit/537.17 (KHTML, like Gecko) Chrome/24.0.1312.57 Safari/537.17";
                using (HttpWebResponse responseFile = (HttpWebResponse)request.GetResponse())
                {
                    using (var ms = new MemoryStream())
                    {
                        responseFile.GetResponseStream().CopyTo(ms);
                        Cookie_WebChat = request.CookieContainer;
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
                        var msgStr = string.Format("下载文件---Error---腾讯接口发生变化，未解析数据");
                        showMessage(msgStr);
                        return new List<AdModel>();
                    }
                }
            }
            catch (Exception ex)
            {
                var msgStr = string.Format("下载文件---Error---{0}", ex.Message);
                showMessage(msgStr);
                sendMessage(msgStr);
                return new List<AdModel>();
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
                    refreshCookie();
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
                var msgStr = string.Format("Error---下载处理数据---{0}", ex.Message);
                showMessage(msgStr);
                sendMessage(msgStr);
            }
        }

        private int randomSeconde()
        {
            var second = new Random(Guid.NewGuid().GetHashCode()).Next(2, 5);
            showMessage(string.Format("随机等待{0}秒钟", second));
            return second * 1000;
        }

        private void refreshCookie()
        {
            try
            {
                showMessage("刷新登录Cookie");
                var downloadURL = string.Format("https://mp.weixin.qq.com/cgi-bin/home?t=home/index&lang=zh_CN&token={0}", token);
                HttpWebRequest request = (HttpWebRequest)WebRequest.Create(downloadURL);
                request.Timeout = timeoutMinutes * 60 * 1000;
                request.Accept = "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8";
                request.Headers.Add("Accept-Encoding", "gzip, deflate, sdch, br");
                request.Headers.Add("Accept-Language", "zh-CN,zh;q=0.8");
                request.Headers.Add("Cache-Control", "max-age=0");
                request.CookieContainer = Cookie_WebChat;
                request.Method = "GET";
                request.KeepAlive = true;
                request.UserAgent = "Mozilla/5.0 (Windows NT 6.1) AppleWebKit/537.17 (KHTML, like Gecko) Chrome/24.0.1312.57 Safari/537.17";
                using (HttpWebResponse responseFile = (HttpWebResponse)request.GetResponse())
                {
                    Cookie_WebChat = request.CookieContainer;
                }
            }
            catch (Exception ex)
            {
                var msgStr = string.Format("Error---刷新登陆Cookie---{0}", ex.Message);
                showMessage(msgStr);
                sendMessage(msgStr);
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
                                CustomerListModel.AvailableCustomerList.Where(e => e.UpdateState == 0 && uploadModel.content.Any(x => x.phone == e.TelePhone)).ToList().ForEach(p =>
                                {
                                    p.UpdateState = 1;
                                    p.UpdateTime = DateTime.Now;
                                });
                                showMessage(string.Format("本次第{0}次上传，成功了{1}条数据", index + 1, uploadModel.content.Count));
                            }
                            if (adDetail.status == "400")
                            {
                                CustomerListModel.AvailableCustomerList.Where(e => e.UpdateState == 0 && uploadModel.content.Any(x => x.phone == e.TelePhone)).ToList().ForEach(p =>
                                {
                                    if (!adDetail.list.Any(t => t == p.TelePhone))
                                    {
                                        p.UpdateState = 1;
                                        p.UpdateTime = DateTime.Now;
                                    }
                                });
                                showMessage(string.Format("本次第{0}次上传，成功了{1}条数据；失败了{2}条数据", index + 1, uploadModel.content.Count - adDetail.list.Count, adDetail.list.Count));
                            }
                        }
                        index++;
                    }
                }
            }
            catch (Exception ex)
            {
                var msgStr = string.Format("Error---上传数据---{0}", ex.Message);
                showMessage(msgStr);
                sendMessage(msgStr);
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
                    Thread.Sleep(randomSeconde());
                    showMessage(string.Format("刷新第{0}页的广告", pageIndex));
                    var downloadURL = string.Format("https://mp.weixin.qq.com/promotion/snsdelivery/sns_advert_mgr?page={0}&page_size=6&action=list&status=6&begin_time=1468944000&end_time=1500048000&list_type=2&token={1}&appid=&_={2}", pageIndex, token, "");
                    HttpWebRequest request = (HttpWebRequest)WebRequest.Create(downloadURL);
                    request.Timeout = timeoutMinutes * 60 * 1000;
                    request.Accept = "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8";
                    request.Headers.Add("Accept-Encoding", "gzip, deflate, sdch, br");
                    request.Headers.Add("Accept-Language", "zh-CN,zh;q=0.8");
                    request.Headers.Add("Cache-Control", "max-age=0");
                    request.CookieContainer = Cookie_WebChat;
                    request.Method = "GET";
                    request.KeepAlive = true;
                    request.UserAgent = "Mozilla/5.0 (Windows NT 6.1) AppleWebKit/537.17 (KHTML, like Gecko) Chrome/24.0.1312.57 Safari/537.17";
                    using (HttpWebResponse responseFile = (HttpWebResponse)request.GetResponse())
                    {
                        using (var ms = new MemoryStream())
                        {
                            responseFile.GetResponseStream().CopyTo(ms);
                            Cookie_WebChat = request.CookieContainer;
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
                            j.qid = getPid(j.ADID, j.cname);
                        }
                    });
                    showMessage(string.Format("刷新广告的pid完毕"));
                    ADListModel.SolidCache();
                    showMessage(string.Format("刷新广告列表完毕"));
                }
            }
            catch (Exception ex)
            {
                var msgStr = string.Format("Error---获得广告列表---{0}", ex.Message);
                showMessage(msgStr);
                sendMessage(msgStr);
            }
        }

        private int getPid(string adID, string cname)
        {
            try
            {
                Thread.Sleep(randomSeconde());
                showMessage(string.Format("刷新广告'{0}'的qid", cname));
                var downloadURL = string.Format("https://mp.weixin.qq.com/promotion/snsdelivery/sns_advert_mgr?action=creative_detail&cid={0}&token={1}&appid=&_={2}", adID, token, "");
                HttpWebRequest request = (HttpWebRequest)WebRequest.Create(downloadURL);
                request.Timeout = timeoutMinutes * 60 * 1000;
                request.Accept = "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8";
                request.Headers.Add("Accept-Encoding", "gzip, deflate, sdch, br");
                request.Headers.Add("Accept-Language", "zh-CN,zh;q=0.8");
                request.Headers.Add("Cache-Control", "max-age=0");
                request.CookieContainer = Cookie_WebChat;
                request.Method = "GET";
                request.KeepAlive = true;
                request.UserAgent = "Mozilla/5.0 (Windows NT 6.1) AppleWebKit/537.17 (KHTML, like Gecko) Chrome/24.0.1312.57 Safari/537.17";
                using (HttpWebResponse responseFile = (HttpWebResponse)request.GetResponse())
                {
                    using (var ms = new MemoryStream())
                    {
                        responseFile.GetResponseStream().CopyTo(ms);
                        Cookie_WebChat = request.CookieContainer;
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
                    }
                }
            }
            catch (Exception ex)
            {
                var msgStr = string.Format("Error---获取qid---{0}", ex.Message);
                showMessage(msgStr);
                sendMessage(msgStr);
                return 0;
            }
        }

        private void showMessage(string msg)
        {
            richTextBox1.BeginInvoke(new MethodInvoker(() =>
            {
                richTextBox1.AppendText(string.Format("{0}---{1}\r\n", DateTime.Now.ToString("yy-MM-dd HH:mm:ss"), msg));
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

        private void sendMessage(string msg)
        {
            try
            {
                if (!haveSendMSg)
                {
                    var model = new SendMSGModel { time = DateTime.Now.ToString("yyyy-MM-dd HH:mm:ss"), explain = msg };
                    using (var webClient = new WebClient())
                    {
                        var uploadStr = JsonHelper.SerializeObject(model);
                        var responseBytes = webClient.UploadData(sendMSGURL, "Post", Encoding.UTF8.GetBytes(uploadStr));
                        var responseText = Encoding.UTF8.GetString(responseBytes);
                        showMessage("发送报警短信完毕");
                    }
                    haveSendMSg = true;
                }
                else
                {
                    showMessage("已经发送过报警短信，不再发送");
                }
            }
            catch (Exception ex)
            {
                var msgStr = string.Format("Error---发送短信---{0}", ex.Message);
                showMessage(msgStr);
            }

        }
    }
}
