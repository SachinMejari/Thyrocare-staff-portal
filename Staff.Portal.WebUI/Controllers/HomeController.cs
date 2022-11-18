using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Security.Cryptography;
using System.Text;
using System.Text.RegularExpressions;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using Newtonsoft.Json;
using Staff.Portal.BizLayer;
using Staff.Portal.Interfaces;
using Staff.Portal.Models;
using Staff.Portal.Models.ServicePayLoad;
using Staff.Portal.Models.ServiceResponse;
using Staff.Portal.Models.Views;
using Staff.Portal.Utilities.Constants;
using Staff.Portal.Utilities.Session;

namespace Staff.Portal.WebUI.Controllers
{
    public class HomeController : Controller
    {
        //private readonly ILogger<HomeController> _logger;

        //public HomeController(ILogger<HomeController> logger)
        //{
        //    _logger = logger;
        //}
        readonly IConfiguration _configuration;
        public HomeController(IConfiguration configuration)
        {
            _configuration = configuration;
        }

        public IActionResult TestMenu()
        {
            if (HttpContext.Request.Query.Count != 0)
            {
                if (HttpContext.Session.GetString(Variables.ServiceDNS) == null)
                {
                    HttpContext.Session.SetString(Variables.ServiceDNS, Convert.ToString(_configuration.GetSection("ServiceUrls")["ServiceDNS"]) + Convert.ToString(_configuration.GetSection("ServiceUrls")["ServiceVD"]));
                }
                string val = Decrypt(HttpContext.Request.Query["Key"].ToString());
                if (!string.IsNullOrEmpty(val))
                {
                    var para = val.Split(',');
                    UserLogin UserC = new UserLogin();
                    UserC.UserName = para[0].ToString();
                    UserC.Password = para[1].ToString();

                    SignInAuto(UserC);
                }
            }

            if (string.IsNullOrEmpty(HttpContext.Session.GetString(Variables.UserId)))
            {
                return RedirectToAction("Index", "Login");
            }
            if (TempData["ErrorMessage"] != null)
            {
                ViewBag.ErroMessage = TempData["ErrorMessage"] as string;
            }
            return View();
        }


        public CartView LoadCartData(Session SessionEnt)
        {
            BizLayer.Cart ObjCart = new BizLayer.Cart();
            var CartData = ObjCart.PrepareCartData(SessionEnt);
            return CartData;
        }
        public IActionResult Checkout()
        {
            if (string.IsNullOrEmpty(HttpContext.Session.GetString(Variables.UserId)))
            {
                return RedirectToAction("Index", "Login");
            }
            if (string.IsNullOrEmpty(HttpContext.Session.GetString(Variables.Cart)))
            {
                return RedirectToAction("TestMenu", "Home");
            }

            ViewBag.ErrorMsg = string.Empty;
            var CheckoutData = CheckOutData();
            if (CheckoutData.Cart.RespId != StatusConstants.RES00001)
            {
                TempData["ErrorMessage"] = CheckoutData.Cart.Response;
                return RedirectToAction("TestMenu", "Home");
            }
            else
            {
                return View("Checkout", CheckoutData);
            }

            //return View("Checkout", CheckOutData());
        }

        private CheckoutData CheckOutData()
        {
            Session SessionEnt = CreateSession();

            var CartData = LoadCartData(SessionEnt);

            HttpContext.Session.SetString(Variables.CartProducts, CartData.Products);
            HttpContext.Session.SetString(Variables.CartGrossAmout, CartData.GrossAmount);
            HttpContext.Session.SetString(Variables.CartPayableAmout, CartData.PayableAmout);
            HttpContext.Session.SetString(Variables.BenInfo, Default.StringValue);
            HttpContext.Session.SetString(Variables.Note, CartData.Note);
            HttpContext.Session.SetString("CMLT", string.IsNullOrEmpty(CartData.CMLT) ? "0" : CartData.CMLT);
            //HttpContext.Session.SetString("CMLT", null);
            HttpContext.Session.SetString(Variables.isPrepaidAllow, CartData.isPrepaidAllow);
            HttpContext.Session.SetString(Variables.Margin, CartData.Margin);
            HttpContext.Session.SetString(Variables.PassOn, CartData.PassOn);
            HttpContext.Session.SetString(Variables.Credit, string.IsNullOrEmpty(CartData.Credit) ? "N" : CartData.Credit);
            HttpContext.Session.SetString(Variables.chcCharges, CartData.chcCharges);

            CheckoutData ReturnModel = new CheckoutData();
            ReturnModel.Cart = CartData;


            if (!string.IsNullOrEmpty(HttpContext.Session.GetString(Variables.Coupon)))
            {
                ICart iCart = new Service.Cart();
                if (!HttpContext.Session.GetString(Variables.Coupon).StartsWith("CDE"))
                {
                    TXDoctorsRes DoctorList = iCart.TXDoctors(HttpContext.Session.GetString(Variables.Coupon));
                    if (!string.IsNullOrEmpty(DoctorList.RespId) && DoctorList.RespId == "RES0000")
                    {
                        ReturnModel.Doctors = DoctorList.Doctors;
                    }
                }
            }

            return ReturnModel;
        }

        public IActionResult BookingDetails()
        {
            var BookingInfo = HttpContext.Session.GetString(Variables.BookingInfo);
            if (string.IsNullOrEmpty(BookingInfo))
            {
                return RedirectToAction("Index", "Home");
            }
            var OutBookingInfo = JsonConvert.DeserializeObject<BookingSummary>(BookingInfo);

            return View("BookingDetails", OutBookingInfo);
        }
        public IActionResult Booking()
        {
             if (string.IsNullOrEmpty(HttpContext.Session.GetString(Variables.UserId)))
            {
                return RedirectToAction("Index", "Login");
            }
            if (string.IsNullOrEmpty(HttpContext.Session.GetString(Variables.Cart)))
            {
                return RedirectToAction("TestMenu", "Home");
            }

            Session SessionEnt = CreateSession();
            if (string.IsNullOrEmpty(SessionEnt.Key))
            {
                SessionEnt.Key = HttpContext.Session.GetString(Variables.Key);
            }

            Booking ObjBooking = new Booking();

            OrderDataResponse Response = ObjBooking.ProcessPostPaidBookingData(SessionEnt);
            if (string.IsNullOrEmpty(Response.OrderNo))
            {
                return RedirectBackToCheckOut(SessionEnt.Bookingcheckoutinfo, Response.Response);
            }
            else
            {
                Response.Appointment = Appointment(SessionEnt);
                SessionCleanUp();
                if (Response.CollectionType == "COLLECTION CENTER")
                {
                    return View("KioskSummary", ObjBooking.PrepareBookingSummaryView(Response));
                }
                else {
                    return View("BookingDetails", ObjBooking.PrepareBookingSummaryView(Response));
                }
            }

        }

        private IActionResult RedirectBackToCheckOut(string INBookingInfo, string InErrorMsg)
        {
            string[] BookingElements = Regex.Split(INBookingInfo, Symbols.DoubleTilde);

            ViewBag.ErrorMsg = InErrorMsg;
            ViewBag.Address = BookingElements[0];
            ViewBag.Pincode = BookingElements[1];

            return View("Checkout", CheckOutData());
        }

        private string Appointment(Session SessionEnt)
        {
            String[] BookingElements = Regex.Split(SessionEnt.Bookingcheckoutinfo, Symbols.DoubleTilde);
            return BookingElements[2];
        }

        private Session CreateSession()
        {
            return new Session()
            {
                ServiceDNS = HttpContext.Session.GetString(Variables.ServiceDNS),
                Key = HttpContext.Session.GetString(Variables.Key),
                UserId = HttpContext.Session.GetString(Variables.UserId),
                Mobile = HttpContext.Session.GetString(Variables.Mobile),
                Email = HttpContext.Session.GetString(Variables.Email),
                //UserName = HttpContext.Session.GetString(Variables.UserName),
                UserType = HttpContext.Session.GetString(Variables.UserType),
                Bookingcheckoutinfo = HttpContext.Session.GetString(Variables.Bookingcheckoutinfo),
                Cart = HttpContext.Session.GetString(Variables.Cart),
                HardCopy = HttpContext.Session.GetString(Variables.HardCopy),
                BenInfo = HttpContext.Session.GetString(Variables.BenInfo),
                CartPayableAmout = HttpContext.Session.GetString(Variables.CartPayableAmout),
                OrderType = HttpContext.Session.GetString(Variables.OrderType),
                //Address = HttpContext.Session.GetString(Variables.Address),
                Servicetype = HttpContext.Session.GetString(Variables.Servicetype),
                techniciandet = HttpContext.Session.GetString(Variables.techniciandet),
                Coupon = HttpContext.Session.GetString(Variables.Coupon),
                Margin = HttpContext.Session.GetString(Variables.Margin),
                PassOn = HttpContext.Session.GetString(Variables.PassOn),
                //RefCode = HttpContext.Session.GetString(Variables.RefCode)
                ReachMeOn = HttpContext.Session.GetString(Variables.ReachMeOn),
                Remarks = HttpContext.Session.GetString(Variables.Remarks),
                authorize = HttpContext.Session.GetString(Variables.authorize),
                Latitude = HttpContext.Session.GetString(Variables.Latitude),
                Longitude = HttpContext.Session.GetString(Variables.Longitude),
                TSP = HttpContext.Session.GetString(Variables.TSP),
                Credit = HttpContext.Session.GetString(Variables.Credit),
                accessToken = HttpContext.Session.GetString(Variables.accessToken),
                SameDayReport = HttpContext.Session.GetString(Variables.SameDayReport),
                Doctor= HttpContext.Session.GetString(Variables.Doctor),
                RefDoctorID = HttpContext.Session.GetString(Variables.DoctorID),
                RefDoctorNAME = HttpContext.Session.GetString(Variables.DoctorName),
                CollectionType = HttpContext.Session.GetString(Variables.CollectionType),
                chcCharges = HttpContext.Session.GetString(Variables.chcCharges)
            };
        }

        private void SessionCleanUp()
        {
            HttpContext.Session.SetString(Variables.Cart, Default.StringValue);
            HttpContext.Session.SetString(Variables.BenInfo, Default.StringValue);
            HttpContext.Session.SetString(Variables.OrderId, Default.StringValue);
            HttpContext.Session.SetString(Variables.OrderInfo, Default.StringValue);
            HttpContext.Session.SetString(Variables.HardCopy, Default.StringValue);
            HttpContext.Session.SetString(Variables.OrderType, Default.StringValue);
            HttpContext.Session.SetString(Variables.TransactionID, Default.StringValue);
            HttpContext.Session.SetString(Variables.BookingInfo, Default.StringValue);
            HttpContext.Session.SetString(Variables.CartProducts, Default.StringValue);
            HttpContext.Session.SetString(Variables.CartGrossAmout, Default.StringValue);
            HttpContext.Session.SetString(Variables.CartPayableAmout, Default.StringValue);
            HttpContext.Session.SetString(Variables.Bookingcheckoutinfo, Default.StringValue);
            HttpContext.Session.SetString(Variables.Margin, Default.StringValue);
            HttpContext.Session.SetString(Variables.PassOn, Default.StringValue);
            HttpContext.Session.SetString(Variables.Coupon, Default.StringValue);
            //HttpContext.Session.SetString(Variables.RefCode, Default.StringValue);
            HttpContext.Session.SetString(Variables.Mobile, Default.StringValue);
            HttpContext.Session.SetString(Variables.Email, Default.StringValue);
            HttpContext.Session.SetString(Variables.TSP, Default.StringValue);
            HttpContext.Session.SetString(Variables.Credit, Default.StringValue);
            HttpContext.Session.SetString(Variables.Servicetype, Default.StringValue);
            HttpContext.Session.SetString(Variables.techniciandet, Default.StringValue);
            HttpContext.Session.SetString(Variables.ReachMeOn, Default.StringValue);
            HttpContext.Session.SetString(Variables.Remarks, Default.StringValue);
            HttpContext.Session.SetString(Variables.authorize, Default.StringValue);
            HttpContext.Session.SetString(Variables.Latitude, Default.StringValue);
            HttpContext.Session.SetString(Variables.Longitude, Default.StringValue);
            HttpContext.Session.SetString(Variables.SameDayReport, Default.StringValue);
            HttpContext.Session.SetString(Variables.Doctor, Default.StringValue);
            HttpContext.Session.SetString(Variables.DoctorID, Default.StringValue);
            HttpContext.Session.SetString(Variables.DoctorName, Default.StringValue);
            HttpContext.Session.SetString(Variables.CollectionType, Default.StringValue);
            HttpContext.Session.SetString(Variables.chcCharges, Default.StringValue);
            HttpContext.Session.SetString("benCount", Default.StringValue);
        }


        public void SignInAuto(UserLogin objUser)
        {
            var loginResponse = new LoginResponse();
            var SrvDNS = HttpContext.Session.GetString(Variables.ServiceDNS);

            objUser.userType = TextConstants.Staff;
            objUser.portalType = TextConstants.Wtc;

            ILogin iSignIn = new Service.Login();
            Models.ServiceResponse.Login logindata = iSignIn.GetValidateSignIn(SrvDNS, objUser);
            if (!string.IsNullOrEmpty(logindata.apiKey))
            {
                CreateSession(logindata);
                loginResponse.UserCredential = StatusConstants.Success;
                loginResponse.RespId = logindata.respId;
                loginResponse.Response = logindata.response;
            }
            else
            {
                loginResponse.UserCredential = StatusConstants.Invalid;
                loginResponse.RespId = logindata.respId;
                loginResponse.Response = logindata.response;
            }
        }

        public static string key = "456as4d6a73a2fghHJS4865a87932d(d4586qzxxiwopdGKQPGT712lsa4d4sadas8";
        public static string Decrypt(string cipherText)
        {
            try
            {
                TripleDESCryptoServiceProvider objDESCrypto = new TripleDESCryptoServiceProvider();
                MD5CryptoServiceProvider objHashMD5 = new MD5CryptoServiceProvider();
                byte[] byteHash, byteBuff;
                string strTempKey = key;
                byteHash = objHashMD5.ComputeHash(ASCIIEncoding.ASCII.GetBytes(strTempKey));
                objHashMD5 = null;
                objDESCrypto.Key = byteHash;
                objDESCrypto.Mode = CipherMode.ECB; //CBC, CFB
                byteBuff = Convert.FromBase64String(cipherText);
                string strDecrypted = ASCIIEncoding.ASCII.GetString(objDESCrypto.CreateDecryptor().TransformFinalBlock(byteBuff, 0, byteBuff.Length));
                objDESCrypto = null;
                return strDecrypted;
            }
            catch (Exception ex)
            {
                return "";
            }
        }

        public static string Encrypt(string clearText)
        {
            try
            {
                TripleDESCryptoServiceProvider objDESCrypto = new TripleDESCryptoServiceProvider();
                MD5CryptoServiceProvider objHashMD5 = new MD5CryptoServiceProvider();
                byte[] byteHash, byteBuff;
                string strTempKey = key;
                byteHash = objHashMD5.ComputeHash(ASCIIEncoding.ASCII.GetBytes(strTempKey));
                objHashMD5 = null;
                objDESCrypto.Key = byteHash;
                objDESCrypto.Mode = CipherMode.ECB; //CBC, CFB
                byteBuff = ASCIIEncoding.ASCII.GetBytes(clearText);
                return Convert.ToBase64String(objDESCrypto.CreateEncryptor().TransformFinalBlock(byteBuff, 0, byteBuff.Length));
            }
            catch (Exception ex)
            {
                return "";
            }
        }
        private void CreateSession(Models.ServiceResponse.Login logindata)
        {
            HttpContext.Session.SetString(Variables.UserName, logindata.name);
            HttpContext.Session.SetString(Variables.UserType, logindata.userType);
            HttpContext.Session.SetString(Variables.Key, logindata.apiKey);
            HttpContext.Session.SetString(Variables.UserId, logindata.uId);
            HttpContext.Session.SetString(Variables.accessToken, logindata.accessToken);
        }
    }
}
