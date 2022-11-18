using Newtonsoft.Json;
using System;
using Staff.Portal.Interfaces;
using Staff.Portal.Models;
using Staff.Portal.Models.ServicePayLoad;
using Staff.Portal.Utilities.Constants;

namespace Staff.Portal.Service
{
    public class Products : IProducts
    {
     
        public Models.ServiceResponse.Products GetProductsInfo(string SrvDNS, ProductReq input, string accessToken)
        {
            var SrvData = new ServiceData();
            SrvData.Url = string.Format(APIUrls.GetProducts, SrvDNS);
            SrvData.Method = APIConstants.APIMethodPOST;
            SrvData.Header = new System.Collections.Generic.Dictionary<string, string>();
            SrvData.Header.Add("Authorization", "Bearer " + accessToken);
            SrvData.Payload = JsonConvert.SerializeObject(input);
            Utilities.Service ObjSrv = new Utilities.Service();
            SrvData = ObjSrv.ConsumeService(SrvData);
            
            Models.ServiceResponse.Products products;
            try
            {
                if (string.IsNullOrEmpty(SrvData.Response))
                {
                    products = new Models.ServiceResponse.Products();
                }
                else
                {
                    products = JsonConvert.DeserializeObject<Models.ServiceResponse.Products>(SrvData.Response);
                }
            }
            catch (Exception ex)
            {
                products = null;
            }
            return products;
        }
        
    }
}
