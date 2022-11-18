using Newtonsoft.Json;
using Staff.Portal.Interfaces;
using Staff.Portal.Models;
using Staff.Portal.Models.ServicePayLoad;
using Staff.Portal.Utilities.Constants;
using System;
using System.Collections.Generic;
using System.Text;

namespace Staff.Portal.Service
{
    public class Login: ILogin
    {
        public Models.ServiceResponse.Login GetValidateSignIn(string SrvDNS, UserLogin objUser)
        {
            var SrvData = new ServiceData();
            SrvData.Url = string.Format(APIUrls.Login, SrvDNS);
            SrvData.Method = APIConstants.APIMethodPOST;
            SrvData.Payload = JsonConvert.SerializeObject(objUser);
            Utilities.Service ObjSrv = new Utilities.Service();
            SrvData = ObjSrv.ConsumeService(SrvData);

            Models.ServiceResponse.Login loginResponse;
            if (string.IsNullOrEmpty(SrvData.Response))
            {
                loginResponse = new Models.ServiceResponse.Login();
            }
            else
            {
                loginResponse = JsonConvert.DeserializeObject<Models.ServiceResponse.Login>(SrvData.Response);
            }
            return loginResponse;
        }
    }
}
