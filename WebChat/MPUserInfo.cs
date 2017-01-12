using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

public class MPUserInfo
{
    private DateTime _subscribedate;

    private int _unsubscribe;

    public int unsubscribe
    {
        get { return _unsubscribe; }
        set { _unsubscribe = value; }
    }

    public DateTime subscribedate
    {
        get { return _subscribedate; }
        set { _subscribedate = value; }
    }
    private string _usercode;

    public string usercode
    {
        get { return _usercode; }
        set { _usercode = value; }
    }
    
    private string _groupid;

    public string groupid
    {
        get { return _groupid; }
        set { _groupid = value; }
    }

    private string _fakeId;

    public string fakeid
    {
        get { return _fakeId; }
        set { _fakeId = value; }
    }
    private string _nickName;

    public string nickname
    {
        get { return _nickName; }
        set { _nickName = value; }
    }
    private string _remarkname;

    public string remarkname
    {
        get { return _remarkname; }
        set { _remarkname = value; }
    }
}
