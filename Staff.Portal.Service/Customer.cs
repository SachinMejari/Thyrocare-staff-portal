using Newtonsoft.Json;
using Staff.Portal.Interfaces;
using Staff.Portal.Models;
using Staff.Portal.Models.ServicePayLoad;
using Staff.Portal.Models.ServiceResponse;
using Staff.Portal.Utilities.Constants;
using System;
using System.Collections.Generic;
using System.Text;

namespace Staff.Portal.Service
{
    public class Customer:ICustomer
    {
        public lastAvailedRes lastAvailedDtl(string SrvDNS, lastAvailedReq input, string accessToken)
        {
            var SrvData = new ServiceData();
            SrvData.Url = string.Format(APIUrls.LastAvailedDtl, SrvDNS);
            SrvData.Method = APIConstants.APIMethodPOST;
            SrvData.Header = new System.Collections.Generic.Dictionary<string, string>();
            SrvData.Header.Add("Authorization", "Bearer " + accessToken);
            SrvData.Payload = JsonConvert.SerializeObject(input);
            Utilities.Service ObjSrv = new Utilities.Service();
            SrvData = ObjSrv.ConsumeService(SrvData);

            lastAvailedRes availedRes;
            try
            {
                if (string.IsNullOrEmpty(SrvData.Response))
                {
                    availedRes = new lastAvailedRes();
                }
                else
                {
                    availedRes = JsonConvert.DeserializeObject<lastAvailedRes>(SrvData.Response);
                }
            }
            catch (Exception ex)
            {
                availedRes = null;
            }
            return availedRes;
        }
        public EmailRes ValidateEmail(string SrvDns, EmailReq EmailReq, Dictionary<string, string> Header)
        {
            EmailRes EmailRes;

            var SrvData = new ServiceData();
            SrvData.Url = string.Format(APIUrls.EmailValidation, SrvDns);
            SrvData.Method = APIConstants.APIMethodPOST;
            SrvData.Payload = JsonConvert.SerializeObject(EmailReq);
            SrvData.Header = Header;
            Utilities.Service ObjSrv = new Utilities.Service();
            SrvData = ObjSrv.ConsumeService(SrvData);
            if (string.IsNullOrEmpty(SrvData.Response))
            {
                EmailRes = new EmailRes();
            }
            else
            {
                EmailRes = JsonConvert.DeserializeObject<EmailRes>(SrvData.Response);
            }

            return EmailRes;
        }

    }
}
