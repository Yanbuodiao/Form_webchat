using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Web;
using System.Web.Caching;

namespace Form_WebChat
{
    public class ADListModel
    {
        #region 私有变量及方法

        static string downLoadFilesMenuKey;
        static object lockObj = new object();
        static ADListModel()
        {
            if (string.IsNullOrEmpty(downLoadFilesMenuKey))
            {
                lock (lockObj)
                {
                    if (string.IsNullOrEmpty(downLoadFilesMenuKey))
                    {
                        downLoadFilesMenuKey = Guid.NewGuid().ToString();
                    }
                }
            }
        }
        public static List<downLoadFileModel> AvailableADList
        {
            get
            {
                try
                {
                    var availableDownLoadFiles = HttpRuntime.Cache[downLoadFilesMenuKey] as List<downLoadFileModel>;
                    if (availableDownLoadFiles == null)
                    {
                        string path = System.Environment.CurrentDirectory + @"\AppData\ADList.xml";
                        if (System.IO.File.Exists(path))//如果缓存文件存在,直接从缓存文件加载
                        {
                            availableDownLoadFiles = XmlHelper.XmlDeserializeFromFile<List<downLoadFileModel>>(path, Encoding.UTF8);
                        }
                        CacheDependency dep = new CacheDependency(path);
                        //添加到缓存中
                        HttpRuntime.Cache.Insert(downLoadFilesMenuKey,
                            availableDownLoadFiles,
                            dep,
                            System.Web.Caching.Cache.NoAbsoluteExpiration,
                            System.Web.Caching.Cache.NoSlidingExpiration,
                            CacheItemPriority.High, null);
                    }
                    return availableDownLoadFiles;
                }
                catch (Exception ex)
                {
                    throw;
                }
            }
        }

        #endregion
    }
}
