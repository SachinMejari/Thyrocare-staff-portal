using Staff.Portal.Models;
using Staff.Portal.Utilities.Constants;
using System.IO;
using System.Net;
using System.Text;
using System.Collections.Generic;
using System;
using System.Linq;

namespace Staff.Portal.Utilities
{
    public class Service
    {
        public ServiceData ConsumeService(ServiceData SrvData)
        {
            var request = WebRequest.Create(SrvData.Url) as HttpWebRequest;
            request.Method = SrvData.Method;

            if (SrvData.Header != null)
            {
                foreach (KeyValuePair<string, string> item in SrvData.Header)
                {
                    request.Headers.Add(item.Key, item.Value); 
                }
            }

            if (!request.Headers.AllKeys.Contains("Content-Type"))
            {
                request.Headers.Add("Content-Type", "application/json");
            }

            if (SrvData.Method.IndexOf(APIConstants.APIMethodPOST) > -1)
            {

                Stream dataStream = request.GetRequestStream();
                byte[] byteArray = Encoding.UTF8.GetBytes(SrvData.Payload);
                dataStream.Write(byteArray, 0, byteArray.Length);
                dataStream.Close();
            }
            request.ContentType = APIConstants.APIContentType;
            try
            {
                using (var r = request.GetResponse() as HttpWebResponse)
                {
                    SrvData.StatusCode = r.StatusCode;
                    if (object.Equals(r.StatusCode, HttpStatusCode.OK))
                    {
                        SrvData.Response = new StreamReader(r.GetResponseStream()).ReadToEnd();                        
                    }
                }
            }
            catch (WebException ex)
            {
                //SrvData.Response = null;
                SrvData.Response = new StreamReader(ex.Response.GetResponseStream()).ReadToEnd();
                SrvData.StatusCode = HttpStatusCode.InternalServerError;
            }
            return SrvData;
        }
    }
}
