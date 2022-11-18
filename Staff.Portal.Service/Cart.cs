using Newtonsoft.Json;
using Staff.Portal.Interfaces;
using Staff.Portal.Models;
using Staff.Portal.Models.ServiceResponse;
using Staff.Portal.Utilities.Constants;
using System;

namespace Staff.Portal.Service
{
    public class Cart : ICart
    {
        public ViewCart GetViewCart(Models.ServicePayLoad.ViewCart InViewCart, string accessToken)
        {
            var SrvData = new ServiceData();
            SrvData.Url = string.Format(APIUrls.ViewCart, InViewCart.ServiceDNS);
            SrvData.Method = APIConstants.APIMethodPOST;
            SrvData.Header = new System.Collections.Generic.Dictionary<string, string>();
            SrvData.Header.Add("Authorization", "Bearer " + accessToken);
            SrvData.Payload = JsonConvert.SerializeObject(InViewCart);
            Utilities.Service ObjSrv = new Utilities.Service();
            SrvData = ObjSrv.ConsumeService(SrvData);

            ViewCart CartResponse;
            if (string.IsNullOrEmpty(SrvData.Response))
            {
                CartResponse = new ViewCart();
            }
            else
            {
                try
                {
                    CartResponse = JsonConvert.DeserializeObject<ViewCart>(SrvData.Response);
                }
                catch (Exception ex)
                {
                    CartResponse = new ViewCart();
                }
            }
            return CartResponse;
        }

        public ViewCart GetViewCartCoupon(Models.ServicePayLoad.ViewCart InViewCart, string accessToken)
        {
            var SrvData = new ServiceData();
            SrvData.Url = string.Format(APIUrls.ViewCartCoupon, InViewCart.ServiceDNS);
            SrvData.Method = APIConstants.APIMethodPOST;
            SrvData.Header = new System.Collections.Generic.Dictionary<string, string>();
            SrvData.Header.Add("Authorization", "Bearer " + accessToken);
            SrvData.Payload = JsonConvert.SerializeObject(InViewCart);
            Utilities.Service ObjSrv = new Utilities.Service();
            SrvData = ObjSrv.ConsumeService(SrvData);

            ViewCart CartResponse;
            if (string.IsNullOrEmpty(SrvData.Response))
            {
                CartResponse = new ViewCart();
            }
            else
            {
                try
                {
                    CartResponse = JsonConvert.DeserializeObject<ViewCart>(SrvData.Response);
                }
                catch (Exception ex)
                {
                    CartResponse = new ViewCart();
                }
            }
            return CartResponse;
        }

        public CovidRateRes CovidCart(Models.ServicePayLoad.CovidRateReq rateReq, string accessToken)
        {
            var SrvData = new ServiceData();
            SrvData.Url = string.Format(APIUrls.CovidCart, rateReq.ServiceDNS);
            SrvData.Method = APIConstants.APIMethodPOST;
            SrvData.Header = new System.Collections.Generic.Dictionary<string, string>();
            SrvData.Header.Add("Authorization", "Bearer " + accessToken);
            SrvData.Payload = JsonConvert.SerializeObject(rateReq);
            Utilities.Service ObjSrv = new Utilities.Service();
            SrvData = ObjSrv.ConsumeService(SrvData);

            CovidRateRes CartResponse;
            if (string.IsNullOrEmpty(SrvData.Response))
            {
                CartResponse = new CovidRateRes();
            }
            else
            {
                try
                {
                    CartResponse = JsonConvert.DeserializeObject<CovidRateRes>(SrvData.Response);
                }
                catch (Exception ex)
                {
                    CartResponse = new CovidRateRes();
                }
            }
            return CartResponse;
        }

        public CollectionpinRes CollectionPincode(Models.ServicePayLoad.CollectionReq rateReq, string accessToken)
        {
            var SrvData = new ServiceData();
            SrvData.Url = string.Format(APIUrls.CollectionType, rateReq.ServiceDNS);
            SrvData.Method = APIConstants.APIMethodPOST;
            SrvData.Header = new System.Collections.Generic.Dictionary<string, string>();
            SrvData.Header.Add("Authorization", "Bearer " + accessToken);
            SrvData.Payload = JsonConvert.SerializeObject(rateReq);
            Utilities.Service ObjSrv = new Utilities.Service();
            SrvData = ObjSrv.ConsumeService(SrvData);

            CollectionpinRes CartResponse;
            if (string.IsNullOrEmpty(SrvData.Response))
            {
                CartResponse = new CollectionpinRes();
            }
            else
            {
                try
                {
                    CartResponse = JsonConvert.DeserializeObject<CollectionpinRes>(SrvData.Response);
                }
                catch (Exception ex)
                {
                    CartResponse = new CollectionpinRes();
                }
            }
            return CartResponse;
        }

        public TXDoctorsRes TXDoctors(string Coupon)
        {
            var SrvData = new ServiceData();
            SrvData.Url = string.Format(APIUrls.TXDoctors, Coupon);
            SrvData.Method = APIConstants.APIMethodGET;

            Utilities.Service ObjSrv = new Utilities.Service();
            SrvData = ObjSrv.ConsumeService(SrvData);

            TXDoctorsRes response;
            if (string.IsNullOrEmpty(SrvData.Response))
            {
                response = new TXDoctorsRes();
            }
            else
            {
                response = JsonConvert.DeserializeObject<TXDoctorsRes>(SrvData.Response);
            }
            return response;
        }

        public GetUserType GetUserType(string Mobile)
        {
            var SrvData = new ServiceData();
            SrvData.Url = string.Format(APIUrls.UserType, Mobile);
            SrvData.Method = APIConstants.APIMethodGET;

            Utilities.Service ObjSrv = new Utilities.Service();
            SrvData = ObjSrv.ConsumeService(SrvData);

            GetUserType response;
            if (string.IsNullOrEmpty(SrvData.Response))
            {
                response = new GetUserType();
            }
            else
            {
                response = JsonConvert.DeserializeObject<GetUserType>(SrvData.Response);
            }
            return response;
        }
    }
}
