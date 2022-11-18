using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Text.RegularExpressions;
using Staff.Portal.Interfaces;
using Staff.Portal.Models;
using Staff.Portal.Models.ServicePayLoad;
using Staff.Portal.Models.ServiceResponse;
using Staff.Portal.Models.Views;
using Staff.Portal.Service;
using Staff.Portal.Utilities.Constants;

namespace Staff.Portal.BizLayer
{
    public class Booking
    {

        public OrderDataResponse ProcessPostPaidBookingData(Session SessionEnt)
        {
            OrderDataPayload InOrderData = new OrderDataPayload();

            string ReportCode, _Products;
            StringBuilder _BenDataXml;
            List<Models.ServicePayLoad.Ben_details> Benlst;
            int _PayAmount;
            string[] BookingElements;

            GetBookingValues(SessionEnt, out ReportCode, out _Products, out _BenDataXml, out Benlst, out _PayAmount, out BookingElements);

            String[] BenInfoListElements = Regex.Split(SessionEnt.BenInfo, Symbols.DoubleTilde);
            String[] BenElements = Regex.Split(BenInfoListElements[1], Symbols.Comma);

            InOrderData.apiKey = SessionEnt.Key;
            InOrderData.portal = TextConstants.Staff;
            InOrderData.mobile = SessionEnt.Mobile;
            InOrderData.email = SessionEnt.Email;
            InOrderData.address = BookingElements[0];
            InOrderData.pincode = BookingElements[1];
            InOrderData.std = Default.StringValue;
            InOrderData.phoneNo = Default.StringValue;
            InOrderData.TSP = string.IsNullOrEmpty(SessionEnt.TSP) ? Default.StringValue : SessionEnt.TSP;
            InOrderData.serviceType = Utilities.Constants.ServiceType.HomeCollection;
            InOrderData.orderid = GetRandomAlphaNumeric();
            InOrderData.orderBy = BenElements[1];
            //InOrderData.remarks = Default.StringValue;
            InOrderData.reportCode = ReportCode;
            InOrderData.product = object.Equals(_Products.Substring(0, 1), Symbols.Comma) ? _Products.Substring(1, _Products.Length - 1) : _Products;
            InOrderData.rate = _PayAmount;
            InOrderData.hc = Default.IntegerValue;
            InOrderData.apptDate = BookingElements[2].Trim();
            InOrderData.discount = Default.IntegerValue;
            InOrderData.reports = object.Equals(SessionEnt.HardCopy, StatusConstants.Yes) ? Letters.Y : Letters.N;
            InOrderData.payType = TextConstants.POSTPAID;
            InOrderData.bencount = Convert.ToString(Benlst.Count);
            InOrderData.bendataxml = "<NewDataSet>" + Convert.ToString(_BenDataXml) + "</NewDataSet>";
            InOrderData.SpecialServiceType = SessionEnt.Servicetype;
            InOrderData.techniciandet = SessionEnt.techniciandet;
            InOrderData.ReportFlag = SessionEnt.SameDayReport;
            InOrderData.refCode = SessionEnt.UserId;
            InOrderData.margin = string.IsNullOrEmpty(SessionEnt.Margin) ? StringValues.Zero : Convert.ToString(int.Parse(SessionEnt.Margin) * Benlst.Count);
            InOrderData.passon = string.IsNullOrEmpty(SessionEnt.PassOn) ? Default.IntegerValue : Convert.ToInt32(SessionEnt.PassOn);
            InOrderData.sdcNo = string.IsNullOrEmpty(SessionEnt.Doctor) ? Default.StringValue : SessionEnt.Doctor;
            //InOrderData.ReachMeOn = ;
            string[] Data = SessionEnt.ReachMeOn.Split("~~");


            InOrderData.BookingType = SessionEnt.Remarks.Substring(SessionEnt.Remarks.IndexOf("BookingType:") + 12);


            InOrderData.Remarks = SessionEnt.Remarks.Substring(0, SessionEnt.Remarks.LastIndexOf("~BookingType:") + 1) + "~" + Data[0].ToString();
            InOrderData.authorize = SessionEnt.authorize;
            if (SessionEnt.CollectionType.ToUpper() == "COLLECTION CENTER")
            {
                InOrderData.orderMode = "COLLECTIONCENTER";
                InOrderData.GeoCoordinates = "";
                InOrderData.address = "";
            }
            else
            {
                InOrderData.GeoCoordinates = SessionEnt.Latitude + "," + SessionEnt.Longitude;
                InOrderData.orderMode = Data[1].ToString();
            }

            InOrderData.source = Data[2].ToString();

            InOrderData.CollectionType = SessionEnt.CollectionType.ToUpper();
            InOrderData.coupons = string.IsNullOrEmpty(SessionEnt.Coupon) ? Default.StringValue : SessionEnt.Coupon.StartsWith("CDE") ? SessionEnt.Coupon.Substring(3, SessionEnt.Coupon.Length - 3) : SessionEnt.Coupon;
            InOrderData.RefByDRId = SessionEnt.RefDoctorID;
            InOrderData.RefByDRName = SessionEnt.RefDoctorNAME;

            IOrder iOrder = new Order();
            return iOrder.PostOrder(SessionEnt.ServiceDNS, InOrderData, SessionEnt.accessToken);
        }

        private Random random = new Random();
        public string GetRandomAlphaNumeric()
        {
            var chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
            return new string(chars.Select(c => chars[random.Next(chars.Length)]).Take(8).ToArray());
        }
        private static void GetBookingValues(Session SessionEnt, out string ReportCode, out string _Products, out StringBuilder _BenDataXml, out List<Models.ServicePayLoad.Ben_details> Benlst, out int _PayAmount, out string[] BookingElements)
        {
            StringBuilder StrBuildProducts = new StringBuilder(Default.StringValue);
            StringBuilder StrReportCode = new StringBuilder(Default.StringValue);
            String[] CartListElements = Regex.Split(SessionEnt.Cart, Symbols.DoubleTilde);

            foreach (var CartListItem in CartListElements)
            {
                if (!string.IsNullOrEmpty(CartListItem))
                {
                    String[] CartElements = Regex.Split(CartListItem, Symbols.Hash);
                    if (CartElements[3].IndexOf(TestTypes.OFFER) > -1)
                    {
                        StrReportCode.Append(Symbols.Comma + CartElements[7]);
                        StrBuildProducts.Append(Symbols.Comma + CartElements[6]);
                    }
                    else if (CartElements[3].IndexOf(TestTypes.TEST) > -1)
                    {
                        StrBuildProducts.Append(Symbols.Comma + CartElements[0]);
                    }
                    else
                    {
                        StrBuildProducts.Append(Symbols.Comma + CartElements[1]);
                    }
                }
            }

            ReportCode = Convert.ToString(StrReportCode);
            if (!string.IsNullOrEmpty(ReportCode))
            {
                ReportCode = object.Equals(ReportCode.Substring(0, 1), Symbols.Comma) ? ReportCode.Substring(1, ReportCode.Length - 1) : ReportCode;
            }
            _Products = Convert.ToString(StrBuildProducts);
            String[] BenInfoListElements = Regex.Split(SessionEnt.BenInfo, Symbols.DoubleTilde);
            _BenDataXml = new StringBuilder(Default.StringValue);
            Benlst = new List<Models.ServicePayLoad.Ben_details>();
            foreach (var BenListItem in BenInfoListElements)
            {
                if (!string.IsNullOrEmpty(BenListItem))
                {
                    String[] BenElements = Regex.Split(BenListItem, Symbols.Comma);
                    Models.ServicePayLoad.Ben_details ObjBen = new Models.ServicePayLoad.Ben_details();
                    ObjBen.Name = BenElements[1];
                    ObjBen.Age = BenElements[2];
                    ObjBen.Gender = BenElements[3];
                    _BenDataXml.Append("<Ben_details><Name>" + ObjBen.Name + "</Name><Age>" + ObjBen.Age + "</Age><Gender>" + ObjBen.Gender + "</Gender></Ben_details>");
                    Benlst.Add(ObjBen);
                }
            }
            //if (SessionEnt.Credit == "Y")
            //{
            //    _PayAmount = (Convert.ToInt32(SessionEnt.CartPayableAmout) + ((Benlst.Count - 1) * 50));//need to modify
            //}
            //else
            //{

            //_PayAmount = (Convert.ToInt32(SessionEnt.CartPayableAmout) * Benlst.Count);
            if (_Products.Contains("COVID-19"))
            {
                _PayAmount = (Convert.ToInt32(SessionEnt.CartPayableAmout) * Benlst.Count);
            }
            else if (SessionEnt.CollectionType == "COLLECTION CENTER")
            {
                _PayAmount = ((Convert.ToInt32(SessionEnt.CartPayableAmout) - Convert.ToInt32(SessionEnt.chcCharges)) * Benlst.Count);
            }
            else
            {
                //_PayAmount = ((Convert.ToInt32(SessionEnt.CartPayableAmout) - Convert.ToInt32(SessionEnt.chcCharges)) * Benlst.Count) + ((Benlst.Count - 1) * 100 + Convert.ToInt32(SessionEnt.chcCharges));
                _PayAmount = Convert.ToInt32(SessionEnt.CartPayableAmout);
            }

            //_PayAmount = 20;
            //}


            _PayAmount += (object.Equals(SessionEnt.HardCopy, StatusConstants.Yes) ? NumbericConstants.HardCopyRate : 0);

            BookingElements = Regex.Split(SessionEnt.Bookingcheckoutinfo, Symbols.DoubleTilde);
        }

        public BookingSummary PrepareBookingSummaryView(OrderDataResponse Response) => new BookingSummary()
        {
            OrderDate = DateTime.Now.ToString(DateFormats.DD_MM_YYYY),
            OrderNo = Response.RefOrderId,
            PaymentMode = Response.PayType,
            ReportHardcopy = Response.ReportHardCopy,
            Fasting = Response.Fasting,
            Appointment = Response.Appointment,
            Beneficiaries = Response.orderResponseDetails.postOrderDataResponse,
            Tests = Response.Product,
            Mobile = Response.Mobile,
            Email = Response.Email,
            Address = Response.Address,
            PaymentStatus = Convert.ToString(Response.PaymentStatus),
            CustomerRate = Response.CustomerRate,
            BookedBy = Response.BookedBy,
            QR = Response.QR,
            CollectionCenters = Response.CollectionCenters

        };
    }
}
