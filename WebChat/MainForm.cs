using SimpleBrowser;
using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Data;
using System.Diagnostics;
using System.Drawing;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Windows.Forms;

namespace WebChat
{
    public partial class MainForm : Form
    {
        private void Form1_Load(object sender, EventArgs e)
        {
            ////WebKit.WebKitBrowser browser = new WebKit.WebKitBrowser();
            ////browser.Dock = DockStyle.Fill;
            ////this.Controls.Add(browser);
            ////browser.Navigate(System.Configuration.ConfigurationManager.AppSettings["LoginURL"].Trim());
            //webBrowser1.Document.Cookie = "";
            var browser = new Browser();
        }
    }
}
