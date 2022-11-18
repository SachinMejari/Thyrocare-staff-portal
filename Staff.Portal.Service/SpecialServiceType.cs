using Newtonsoft.Json;
using Staff.Portal.Interfaces;
using Staff.Portal.Models;
using Staff.Portal.Models.ServicePayLoad;
using Staff.Portal.Models.ServiceResponse;
using Staff.Portal.Utilities.Constants;
using System;
using System.Collections.Generic;

namespace Staff.Portal.Service
{
    public class SpecialServiceType: ISpecialServiceType
    {
        public SpecialServiceTypeRes GetSpecialServiceType(string SrvDNS, PincodeReq input)
        {
            var SrvData = new ServiceData();
            SrvData.Url = string.Format(APIUrls.SpecialServiceType, SrvDNS);
            SrvData.Method = APIConstants.APIMethodPOST;
            SrvData.Header = new System.Collections.Generic.Dictionary<string, string>();
            SrvData.Header.Add("Authorization", "Bearer " + input.accessToken);
            SrvData.Payload = JsonConvert.SerializeObject(input);
            Utilities.Service ObjSrv = new Utilities.Service();
            SrvData = ObjSrv.ConsumeService(SrvData);

            SpecialServiceTypeRes Response;
            try
            {
                if (string.IsNullOrEmpty(SrvData.Response))
                {
                    Response = new SpecialServiceTypeRes();
                }
                else
                {
                    Response = JsonConvert.DeserializeObject<SpecialServiceTypeRes>(SrvData.Response);
                }
            }
            catch (Exception ex)
            {
                Response = null;
            }
            return Response;
        }
    }
}
