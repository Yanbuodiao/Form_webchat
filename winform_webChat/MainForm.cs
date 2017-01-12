using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Data;
using System.Drawing;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Windows.Forms;
using winform_webChat.Model;

namespace winform_webChat
{
    public partial class MainForm : Form
    {
        public MainForm()
        {
            InitializeComponent();
        }
        WebKit.WebKitBrowser browser;
        string token;
        string loginURL = System.Configuration.ConfigurationManager.AppSettings["LoginURL"].Trim();
        string uName = System.Configuration.ConfigurationManager.AppSettings["UserName"].Trim();
        string pWD = System.Configuration.ConfigurationManager.AppSettings["PWD"].Trim();
        int currentIndex;
        string lastURL;
        private void Form1_Load(object sender, EventArgs e)
        {
            var aa = ADListModel.AvailableADList;


            browser = new WebKit.WebKitBrowser();
            browser.UserAgent = "Mozilla/5.0 (Windows NT 6.1) AppleWebKit/537.17 (KHTML, like Gecko) Chrome/24.0.1312.57 Safari/537.17";
            browser.Dock = DockStyle.Fill;
            this.Controls.Add(browser);
            browser.Navigate(loginURL);
            browser.DocumentCompleted += new WebBrowserDocumentCompletedEventHandler(browser_DocumentCompleted);
            browser.AllowDownloads = true;
            browser.DownloadBegin += browser_DownloadBegin;
        }

        void browser_DownloadBegin(object sender, WebKit.FileDownloadBeginEventArgs e)
        {
        }
        void browser_DocumentCompleted(object sender, WebBrowserDocumentCompletedEventArgs e)
        {
            var bb = browser.StringByEvaluatingJavaScriptFromString("document.cookie");
            var send = sender as WebKit.WebKitBrowser;
            var loginedURL = "https://mp.weixin.qq.com/cgi-bin/home?t=home/index&lang=zh_CN&token=";
            if (e.Url.ToString() == loginURL)
            {
                browser.Document.GetElementById("account").SetAttribute("value", uName);
                browser.Document.GetElementById("pwd").SetAttribute("value", pWD);
                var aat = string.Format("var _elm = document.getElementById('loginBt');var _evt = document.createEvent('MouseEvents');_evt.initEvent('click', true,true);_elm.dispatchEvent(_evt);");
                browser.StringByEvaluatingJavaScriptFromString(aat);
                return;
            }
            if (e.Url.ToString().StartsWith(loginedURL))
            {
                browser.Enabled = false;
                token = e.Url.ToString().Split('&').LastOrDefault().Split('=')[1];
                if (currentIndex < ADListModel.AvailableADList.Count)
                {
                    var currentModel = ADListModel.AvailableADList[currentIndex];
                    if (currentModel != null)
                    {
                        if (currentModel.qid > 0)
                        {
                            downloadFile(currentModel.qid, currentModel.cname);
                        }
                        else
                        {
                            getDetial(currentModel.ADID);
                        }
                    }
                    else
                    {
                        currentIndex++;
                    }
                    return;
                }
            }
            if (e.Url.ToString() == lastURL)
            {

            }
        }

        void getDetial(string adID)
        {
            //var detialURL = string.Format("https://mp.weixin.qq.com/cgi-bin/frame?t=ad_system/common_frame&t1=moments/manage&token={0}#detail_{1}", token, adID);

            var detialURL = string.Format("http://localhost:32461/filetest/index", token, adID);
            lastURL = detialURL;
            browser.Navigate(detialURL);
        }

        void downloadFile(int qid, string cname)
        {
            var downloadURL = string.Format("https://mp.weixin.qq.com/promotion/snsdelivery/snsstat?action=download_ques&qid={0}&cname={1}&token={2}", qid, cname, token);
            lastURL = downloadURL;
            browser.Navigate(downloadURL);
        }
        void BuildData()
        {
            var data = new List<downLoadFileModel> { new downLoadFileModel{
                ADID="1602791872",
                cname="昆明同德年前免费学",
                qid=15777
            },
            new downLoadFileModel{
                ADID="1602897622",
                cname="绵阳中心-90天免费学",
                qid=172408
            },
            new downLoadFileModel{
                ADID="1602813942",
                cname="昆明同德1月12.28",
                qid=161313
            },
            };
            var xmlStr = XmlHelper.XmlSerialize(data, Encoding.UTF8);
        }
    }
}
