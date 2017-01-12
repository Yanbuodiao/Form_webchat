public class WeiXinRetInfo
{
    public string redirect_url { get; set; }
    public Base_Resp base_resp { get; set; }
    public int status { get; set; }
    public int user_category { get; set; }
}

public class Base_Resp
{
    public string err_msg { get; set; }
    public int ret { get; set; }
}