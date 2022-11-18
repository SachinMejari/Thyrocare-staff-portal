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
    public class Coupon: ICoupon
    {
        public CouponDtlRes CheckCoupon(string SrvDNS, CouponDtlReq input, string accessToken)
        {
            var SrvData = new ServiceData();
            SrvData.Url = string.Format(APIUrls.CheckCoupon, SrvDNS);
            SrvData.Method = APIConstants.APIMethodPOST;
            SrvData.Header = new System.Collections.Generic.Dictionary<string, string>();
            SrvData.Header.Add("Authorization", "Bearer " + accessToken);
            SrvData.Payload = JsonConvert.SerializeObject(input);
            Utilities.Service ObjSrv = new Utilities.Service();
            SrvData = ObjSrv.ConsumeService(SrvData);

            CouponDtlRes couponDtl;
            try
            {
                if (string.IsNullOrEmpty(SrvData.Response))
                {
                    couponDtl = new CouponDtlRes();
                }
                else
                {
                    couponDtl = JsonConvert.DeserializeObject<CouponDtlRes>(SrvData.Response);
                }
            }
            catch (Exception ex)
            {
                couponDtl = null;
            }
            return couponDtl;
        }
    }
}
