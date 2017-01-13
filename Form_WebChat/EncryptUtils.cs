using System;
using System.Security.Cryptography;
using System.Text;

namespace Form_WebChat
{
    public class EncryptUtils
    {
        public static string EncryptByMD5(string input, string charset = "utf-8")
        {
            MD5 md5Hasher = MD5.Create();
            byte[] data = md5Hasher.ComputeHash(Encoding.GetEncoding(charset).GetBytes(input));

            return Convert.ToBase64String(data);
        }
        public static string EncryptByMD5(string prestr, string key, string charset = "utf-8")
        {
            var sb = new StringBuilder(32);

            prestr = prestr + key;

            MD5 md5 = new MD5CryptoServiceProvider();
            var arr = md5.ComputeHash(Encoding.GetEncoding(charset).GetBytes(prestr));
            foreach (var b in arr)
            {
                sb.Append(b.ToString("x").PadLeft(2, '0'));
            }

            return sb.ToString();
        }
    }

}
