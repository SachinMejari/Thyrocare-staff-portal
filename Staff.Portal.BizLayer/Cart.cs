using Staff.Portal.Interfaces;
using Staff.Portal.Models;
using Staff.Portal.Models.ServiceResponse;
using Staff.Portal.Models.Views;
using Staff.Portal.Service;
using Staff.Portal.Utilities.Constants;
using System;
using System.Collections.Generic;
using System.Text;
using System.Text.RegularExpressions;
using Staff.Portal.Utilities.Session;

namespace Staff.Portal.BizLayer
{
    public class Cart
    {
        public CartView PrepareCartData(Session SessionEnt)
        {
            List<Models.Cart> lstCart = new List<Models.Cart>();
            String[] CartListElements = Regex.Split(SessionEnt.Cart, Symbols.DoubleTilde);

            StringBuilder StrProducts = new StringBuilder(Default.StringValue);
            StringBuilder StrRates = new StringBuilder(Default.StringValue);

            foreach (var CartListItem in CartListElements)
            {
                if (!string.IsNullOrEmpty(CartListItem))
                {

                    Models.Cart ObjCart = new Models.Cart();
                    String[] CartElements = Regex.Split(CartListItem, Symbols.Hash);

                    int _TestCount = NumbericConstants.MinmumTestsCount;
                    Int32.TryParse(CartElements[4], out _TestCount);
                    if (object.Equals(_TestCount, 0)) { _TestCount++; }

                    ObjCart.code = CartElements[0];
                    ObjCart.name = CartElements[1];
                    ObjCart.rate = CartElements[2];
                    ObjCart.type = CartElements[3];
                    ObjCart.testcount = Convert.ToString(_TestCount);
                    ObjCart.fasting = CartElements[5];
                    ObjCart.testname = CartElements[6];
                    ObjCart.projectid = CartElements[7];
                    StrProducts.Append(Symbols.Comma + ((ObjCart.type.IndexOf(TestTypes.OFFER) > -1 || ObjCart.type.IndexOf(TestTypes.TEST) > -1) ? ObjCart.code : ObjCart.name));
                    StrRates.Append(Symbols.Comma + ObjCart.rate);
                    lstCart.Add(ObjCart);
                }
            }

            var _products = Convert.ToString(StrProducts);
            var _rates = Convert.ToString(StrRates);

            ICart iCart = new Service.Cart();
            ViewCart viewCart = new ViewCart();
            if (string.IsNullOrEmpty(SessionEnt.Coupon))
            {
                var ViewCartData = new Models.ServicePayLoad.ViewCart()
                {
                    apiKey= SessionEnt.Key,
                    ServiceDNS = SessionEnt.ServiceDNS,
                    Product = string.IsNullOrEmpty(_products) ? string.Empty : _products.Substring(1, (_products.Length - 1)),
                    Rates = string.IsNullOrEmpty(_rates) ? string.Empty : _rates.Substring(1, (_rates.Length - 1)),
                    UserType = string.IsNullOrEmpty(SessionEnt.UserType) ? TextConstants.Staff : SessionEnt.UserType,
                    Mobile = string.IsNullOrEmpty(SessionEnt.Mobile) ? TextConstants.DefaultMobile : SessionEnt.Mobile,
                    BenCount = string.IsNullOrEmpty(SessionEnt.benCount)?StringValues.One: SessionEnt.benCount,
                    Report=StatusConstants.No,
                    ClientType= TextConstants.Public,
                    email = string.IsNullOrEmpty(SessionEnt.Email) ? string.Empty : SessionEnt.Email,
                    collectionType = string.IsNullOrEmpty(SessionEnt.CollectionType) ? string.Empty : SessionEnt.CollectionType
                };
                
                viewCart = iCart.GetViewCart(ViewCartData, SessionEnt.accessToken);
            }
            else if (SessionEnt.Coupon != null)
            {
                var ViewCartData = new Models.ServicePayLoad.ViewCart()
                {
                    apiKey = SessionEnt.Key,
                    ServiceDNS = SessionEnt.ServiceDNS,
                    Products = string.IsNullOrEmpty(_products) ? string.Empty : _products.Substring(1, (_products.Length - 1)),
                    Rates = string.IsNullOrEmpty(_rates) ? string.Empty : _rates.Substring(1, (_rates.Length - 1)),
                    UserType = string.IsNullOrEmpty(SessionEnt.UserType) ? TextConstants.Staff : SessionEnt.UserType,
                    Mobile = string.IsNullOrEmpty(SessionEnt.Mobile) ? TextConstants.DefaultMobile : SessionEnt.Mobile,
                    BenCount = string.IsNullOrEmpty(SessionEnt.benCount) ? StringValues.One : SessionEnt.benCount,
                    Report = StatusConstants.No,
                    Coupon = SessionEnt.Coupon,
                    email = string.IsNullOrEmpty(SessionEnt.Email) ? string.Empty : SessionEnt.Email,
                    collectionType = string.IsNullOrEmpty(SessionEnt.CollectionType) ? string.Empty : SessionEnt.CollectionType
                };

                viewCart = iCart.GetViewCartCoupon(ViewCartData, SessionEnt.accessToken);
            }

            return new CartView()
            {
                lstCart = lstCart,
                Products = string.IsNullOrEmpty(viewCart.PRODUCT) ? string.Empty: viewCart.PRODUCT,
                GrossAmount = string.IsNullOrEmpty(viewCart.PAYABLE) ? StringValues.Zero : viewCart.PAYABLE,
                Discount = string.IsNullOrEmpty(viewCart.LOYALTYDISCOUNT) ? Default.IntegerValue :  Convert.ToInt32(viewCart.LOYALTYDISCOUNT),
                PayableAmout = string.IsNullOrEmpty(viewCart.PAYABLE) ? StringValues.Zero : viewCart.PAYABLE,
                HardCopyRate = NumbericConstants.HardCopyRate,
                isPrepaidAllow= string.IsNullOrEmpty(viewCart.isPrepaidAllow)?"N": viewCart.isPrepaidAllow,
                CMLT= viewCart.CMLT,
                Note = string.IsNullOrEmpty(viewCart.NOTE) ? string.Empty : viewCart.NOTE,
                Margin= string.IsNullOrEmpty(viewCart.MARGIN) ? StringValues.Zero : viewCart.MARGIN,
                PassOn = string.IsNullOrEmpty(viewCart.PASSON) ? StringValues.Zero : viewCart.PASSON,
                RefCode = string.IsNullOrEmpty(viewCart.RefCode) ? Default.StringValue : viewCart.RefCode,
                RespId = viewCart.RESPID,
                Response = viewCart.RESPONSE,
                Credit= viewCart.Credit,
                COLLECTCHARGES= string.IsNullOrEmpty(viewCart.COLLECTCHARGES) ? StringValues.Zero : viewCart.COLLECTCHARGES,
                chcCharges = viewCart.chcCharges,
                chcLabel = viewCart.chcLabel,
                allowedBookingsDays=viewCart.allowedBookingsDays

            };
        }
    }
}
