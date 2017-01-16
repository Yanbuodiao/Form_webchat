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
        static string path = System.Environment.CurrentDirectory + @"\AppData\ADList.xml";
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

        private static List<downLoadFileModel> availableADList;
        public static List<downLoadFileModel> AvailableADList
        {
            get
            {
                try
                {
                    if (AvailableADList == null)
                    {
                        availableADList = HttpRuntime.Cache[downLoadFilesMenuKey] as List<downLoadFileModel>;
                        if (availableADList == null)
                        {
                            if (System.IO.File.Exists(path))//如果缓存文件存在,直接从缓存文件加载
                            {
                                availableADList = XmlHelper.XmlDeserializeFromFile<List<downLoadFileModel>>(path, Encoding.UTF8);
                            }
                            if (availableADList == null)
                            {
                                availableADList = new List<downLoadFileModel>();
                            }
                            CacheDependency dep = new CacheDependency(path);
                            //添加到缓存中
                            HttpRuntime.Cache.Insert(downLoadFilesMenuKey,
                                availableADList,
                                dep,
                                System.Web.Caching.Cache.NoAbsoluteExpiration,
                                System.Web.Caching.Cache.NoSlidingExpiration,
                                CacheItemPriority.High, null);
                        }
                    }
                    return availableADList;
                }
                catch (Exception ex)
                {
                    throw;
                }
            }
        }

        public static void SolidCache()
        {
            HttpRuntime.Cache[downLoadFilesMenuKey] = availableADList;
            XmlHelper.XmlSerializeToFile(availableADList, path, Encoding.UTF8);
        }
        #endregion
    }
}
