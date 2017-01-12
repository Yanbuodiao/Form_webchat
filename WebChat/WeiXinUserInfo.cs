using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

public class WeixinSingleMessage
{
    public string fileId { get; set; }
    public string source { get; set; }
    public string fakeId { get; set; }
    public string hasReply { get; set; }
    public string nickName { get; set; }
    public string remarkName { get; set; }
    public string dateTime { get; set; }
    public string icon { get; set; }
    public string content { get; set; }
    public string playLength { get; set; }
    public string length { get; set; }
    public string source1 { get; set; }
    public string starred { get; set; }
    public string subtype { get; set; }
    public string status { get; set; }
    public string showType { get; set; }
    public string desc { get; set; }
    public string title { get; set; }
    public string appName { get; set; }
    public string contentUrl { get; set; }
    public string bcardNickName { get; set; }
    public string bcardUserName { get; set; }
    public string bcardFakeId { get; set; }
    public string id { get; set; }
    public string type { get; set; }
}
public class WeiXinGroupInfo
{
    public string id { get; set; }
    public string name { get; set; }
    public string cnt { get; set; }
}
public class WeiXinUserInfo
{
    private string _group_id;

    public string group_id
    {
        get { return _group_id; }
        set { _group_id = value; }
    }

    private string _id;

    public string id
    {
        get { return _id; }
        set { _id = value; }
    }
    private string _nick_name;

    public string nick_name
    {
        get { return _nick_name; }
        set { _nick_name = value; }
    }
    private string _remark_name;

    public string remark_name
    {
        get { return _remark_name; }
        set { _remark_name = value; }
    }

}
