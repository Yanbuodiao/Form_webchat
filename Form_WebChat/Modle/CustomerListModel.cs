using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Web;
using System.Web.Caching;

namespace Form_WebChat
{
    public class CustomerListModel
    {
        #region 私有变量及方法

        static string customerListModelKey;
        static object lockObj = new object();
        static string filePath = string.Format(@"{0}\AppData\CustomerList.txt", System.Environment.CurrentDirectory);
        static CustomerListModel()
        {
            if (string.IsNullOrEmpty(customerListModelKey))
            {
                lock (lockObj)
                {
                    if (string.IsNullOrEmpty(customerListModelKey))
                    {
                        customerListModelKey = Guid.NewGuid().ToString();
                    }
                }
            }
        }

        static List<AdModel> availableCustomerList;
        public static List<AdModel> AvailableCustomerList
        {
            get
            {
                try
                {
                    if (availableCustomerList == null)
                    {
                        availableCustomerList = HttpRuntime.Cache[customerListModelKey] as List<AdModel>;
                        if (availableCustomerList == null)
                        {
                            if (System.IO.File.Exists(filePath))//如果缓存文件存在,直接从缓存文件加载
                            {
                                availableCustomerList = JsonHelper.DeserializeObject<List<AdModel>>(File.ReadAllText(filePath, Encoding.UTF8));
                            }
                            if (availableCustomerList == null)
                            {
                                availableCustomerList = new List<AdModel>();
                            }
                            CacheDependency dep = new CacheDependency(filePath);
                            //添加到缓存中
                            HttpRuntime.Cache.Insert(customerListModelKey,
                                availableCustomerList,
                                dep,
                                System.Web.Caching.Cache.NoAbsoluteExpiration,
                                System.Web.Caching.Cache.NoSlidingExpiration,
                                CacheItemPriority.High, null);
                        }
                    }
                    return availableCustomerList;
                }
                catch (Exception ex)
                {
                    throw;
                }
            }
        }

        public static void SolidCache()
        {
            HttpRuntime.Cache[customerListModelKey] = availableCustomerList;
            File.WriteAllText(filePath, JsonHelper.SerializeObject(availableCustomerList), Encoding.UTF8);
        }

        #endregion
    }
}
