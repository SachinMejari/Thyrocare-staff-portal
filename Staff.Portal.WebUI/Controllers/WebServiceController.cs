using System;
using System.Collections.Generic;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Staff.Portal.Interfaces;
using Staff.Portal.Models;
using Staff.Portal.Models.ServicePayLoad;
using Staff.Portal.Models.ServiceResponse;
using Staff.Portal.Models.Views;
using Staff.Portal.Service;
using Staff.Portal.Utilities.Constants;
using Staff.Portal.Utilities.Session;

namespace Staff.Portal.WebUI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class WebServiceController : ControllerBase
    {
        readonly IConfiguration _configuration;
        public WebServiceController(IConfiguration configuration)
        {
            _configuration = configuration;
        }

        [Route("~/api/SignIn")]
        [HttpPost]
        public LoginResponse SignIn(UserLogin objUser)
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
            return loginResponse;
        }

        private void CreateSession(Models.ServiceResponse.Login logindata)
        {
            HttpContext.Session.SetString(Variables.UserName, logindata.name);
            HttpContext.Session.SetString(Variables.UserType, logindata.userType);
            HttpContext.Session.SetString(Variables.Key, logindata.apiKey);
            HttpContext.Session.SetString(Variables.UserId, logindata.uId);
            HttpContext.Session.SetString(Variables.accessToken, logindata.accessToken);
            if (logindata.covidMessage != null && logindata.Status != false)
            {
                HttpContext.Session.SetString(Variables.CovidMessage, logindata.covidMessage);
                HttpContext.Session.SetString(Variables.Status, Convert.ToString(logindata.Status));
            }
        }

        [Route("~/api/CreateSession")]
        [HttpPost]
        public string CreateSession(SessionValues InSession)
        {
            HttpContext.Session.SetString(InSession.SessionName, InSession.SessionValue);
            return StatusConstants.Success;
        }

        [Route("~/api/Products")]
        [HttpPost]
        public Models.ServiceResponse.Products Products(ProductReq input)
        {
            var SrvDNS = HttpContext.Session.GetString(Variables.ServiceDNS);
            input.apiKey = HttpContext.Session.GetString(Variables.Key);
            if (!string.IsNullOrEmpty(input.Coupon))
            {
                if (input.CDE)
                    input.Coupon = "CDE" + input.Coupon;

                HttpContext.Session.SetString(Variables.Coupon, input.Coupon);
                HttpContext.Session.SetString(Variables.Mobile, string.Empty);

                
            }
            else
            {
                HttpContext.Session.SetString(Variables.Mobile, input.Mobile);
                HttpContext.Session.SetString(Variables.Coupon, string.Empty);
            }

            IProducts iProudcts = new Service.Products();
            return iProudcts.GetProductsInfo(SrvDNS, input, HttpContext.Session.GetString(Variables.accessToken));
        }

        [Route("~/api/lastAvailedDtl")]
        [HttpPost]
        public Models.ServiceResponse.lastAvailedRes lastAvailedDtl(lastAvailedReq input)
        {
            var SrvDNS = HttpContext.Session.GetString(Variables.ServiceDNS);
            input.ApiKey = HttpContext.Session.GetString(Variables.Key);


            ICustomer iCustomer = new Service.Customer();
            return iCustomer.lastAvailedDtl(SrvDNS, input, HttpContext.Session.GetString(Variables.accessToken));
        }
        [Route("~/api/CheckCoupon")]
        [HttpPost]
        public Models.ServiceResponse.CouponDtlRes CheckCoupon(CouponDtlReq input)
        {
            var SrvDNS = HttpContext.Session.GetString(Variables.ServiceDNS);
            input.ApiKey = HttpContext.Session.GetString(Variables.Key);

            ICoupon iCoupon = new Service.Coupon();
            return iCoupon.CheckCoupon(SrvDNS, input, HttpContext.Session.GetString(Variables.accessToken));
        }

        // To Create the Cart Session :
        [Route("~/api/AddCart")]
        [HttpPost]
        public string AddCart(Models.Cart InCart)
        {
            var CartSession = HttpContext.Session.GetString(Variables.Cart);
            string Cart = Symbols.DoubleTilde + InCart.code + Symbols.Hash + InCart.name + Symbols.Hash + InCart.rate + Symbols.Hash + InCart.type + Symbols.Hash + InCart.testcount + Symbols.Hash + InCart.fasting + Symbols.Hash + InCart.testname + Symbols.Hash + InCart.projectid;

            if (string.IsNullOrEmpty(CartSession))
            {
                HttpContext.Session.SetString(Variables.Cart, Cart);
            }
            else
            {
                if (CartSession.IndexOf(Cart) < 0)
                {
                    HttpContext.Session.SetString(Variables.Cart, CartSession + Cart);
                }
            }
            return HttpContext.Session.GetString(Variables.Cart);
        }

        // To Delete the Cart Session :
        [Route("~/api/DeleteCart")]
        [HttpDelete]
        public CartView DeleteCart(Models.Cart InCart)
        {
            var CartSession = Convert.ToString(HttpContext.Session.GetString(Variables.Cart));
            string Cart = Symbols.DoubleTilde + InCart.code + Symbols.Hash + InCart.name + Symbols.Hash + InCart.rate + Symbols.Hash + InCart.type + Symbols.Hash + InCart.testcount + Symbols.Hash + InCart.fasting + Symbols.Hash + InCart.testname + Symbols.Hash + InCart.projectid;
            Cart = CartSession.Replace(Cart, string.Empty);
            HttpContext.Session.SetString(Variables.Cart, Cart);

            Session SessionEnt = new Session()
            {
                ServiceDNS = HttpContext.Session.GetString(Variables.ServiceDNS),
                UserId = HttpContext.Session.GetString(Variables.UserId),
                Key = HttpContext.Session.GetString(Variables.Key),
                Cart = HttpContext.Session.GetString(Variables.Cart),
                UserType = HttpContext.Session.GetString(Variables.UserType),
                Mobile = HttpContext.Session.GetString(Variables.Mobile),
                accessToken = HttpContext.Session.GetString(Variables.accessToken)
            };

            HomeController ObjCartCont = new HomeController(_configuration);
            var CartData = ObjCartCont.LoadCartData(SessionEnt);

            HttpContext.Session.SetString(Variables.CartProducts, CartData.Products);
            HttpContext.Session.SetString(Variables.CartGrossAmout, CartData.GrossAmount);
            HttpContext.Session.SetString(Variables.CartPayableAmout, CartData.PayableAmout);

            return CartData;
        }
        [Route("~/api/ChangeBenCount")]
        [HttpDelete]
        public CartView ChangeBenCount(Models.Cart InCart)
        {
            //var CartSession = Convert.ToString(HttpContext.Session.GetString(Variables.Cart));
            //string Cart = Symbols.DoubleTilde + InCart.code + Symbols.Hash + InCart.name + Symbols.Hash + InCart.rate + Symbols.Hash + InCart.type + Symbols.Hash + InCart.testcount + Symbols.Hash + InCart.fasting + Symbols.Hash + InCart.testname + Symbols.Hash + InCart.projectid;
            //Cart = CartSession.Replace(Cart, string.Empty);
            //HttpContext.Session.SetString(Variables.Cart, Cart);
            HttpContext.Session.SetString("benCount", InCart.benCount);

            Session SessionEnt = new Session()
            {
                ServiceDNS = HttpContext.Session.GetString(Variables.ServiceDNS),
                UserId = HttpContext.Session.GetString(Variables.UserId),
                Key = HttpContext.Session.GetString(Variables.Key),
                Cart = HttpContext.Session.GetString(Variables.Cart),
                UserType = HttpContext.Session.GetString(Variables.UserType),
                Mobile = HttpContext.Session.GetString(Variables.Mobile),
                accessToken = HttpContext.Session.GetString(Variables.accessToken),
                benCount = HttpContext.Session.GetString("benCount"),
                Coupon = HttpContext.Session.GetString(Variables.Coupon),
                Email = InCart.email,
                CollectionType = InCart.collectionType
            };

            HomeController ObjCartCont = new HomeController(_configuration);
            var CartData = ObjCartCont.LoadCartData(SessionEnt);

            HttpContext.Session.SetString(Variables.CartProducts, CartData.Products);
            HttpContext.Session.SetString(Variables.CartGrossAmout, CartData.GrossAmount);
            HttpContext.Session.SetString(Variables.CartPayableAmout, CartData.PayableAmout);

            return CartData;
        }

        [Route("~/api/CheckPinServiceable")]
        [HttpPost]
        public PinCodeService CheckPinServiceable(PincodeReq input)
        {
            input.apiKey = HttpContext.Session.GetString(Variables.Key);
            IPincodeService iPincodeService = new PincodeService();
            return iPincodeService.CheckPinServiceable(HttpContext.Session.GetString(Variables.ServiceDNS), input, HttpContext.Session.GetString(Variables.accessToken));
        }

        [Route("~/api/BindDoctor")]
        [HttpPost]
        public RefDoctorListsRes BindDoctors(PincodeReq input)
        {
            RefDoctorListsRes resp = new RefDoctorListsRes();
            IPincodeService iPincodeService = new PincodeService();
            return iPincodeService.GetDoctorLists(input);
        }

        //Get Same As
        [Route("~/api/SameUserDtl")]
        [HttpGet]
        public ResponseBody GetSameUserDtl()
        {
            ResponseBody response = new ResponseBody();
            response.ResponseString = HttpContext.Session.GetString(Variables.UserName);
            return response;
        }

        // Get AppointmentSlots :
        [Route("~/api/AppointmentSlots/{pincode}/{appDate}/{Product}/{ProjectId}")]
        [HttpGet]
        public SlotRes GetAppointmentSlots(string pincode, string appDate,string Product, string ProjectId)
        {
            BizLayer.CheckOut ObjCheckout = new BizLayer.CheckOut();

            AppointmentReq input = new AppointmentReq();
            input.pincode = pincode;
            input.product = Product;
            input.projectId = ProjectId;
            input.date = appDate;
            input.apiKey = HttpContext.Session.GetString(Variables.Key);

            return ObjCheckout.GetAppointmentSlots(HttpContext.Session.GetString(Variables.ServiceDNS), input);
        }

        [Route("~/api/AddBeneficiarySession")]
        [HttpPost]
        public string AddBeneficiarySession(Models.Ben_details InBenData)
        {
            var BenInfoSession = HttpContext.Session.GetString(Variables.BenInfo);
            if (!string.IsNullOrEmpty(InBenData.DOB))
            {
                InBenData.Age = Convert.ToString((DateTime.Now.Date - Convert.ToDateTime(InBenData.DOB).Date).Days / 365);
            }

            string BenInfo = Symbols.DoubleTilde + InBenData.BenId + Symbols.Comma + InBenData.Name + Symbols.Comma + InBenData.Age + Symbols.Comma + InBenData.Gender;
            if (string.IsNullOrEmpty(BenInfoSession))
            {
                HttpContext.Session.SetString(Variables.BenInfo, BenInfo);
            }
            else
            {
                if (BenInfoSession.IndexOf(BenInfo) < 0)
                {
                    HttpContext.Session.SetString(Variables.BenInfo, BenInfoSession + BenInfo);
                }
            }
            return HttpContext.Session.GetString(Variables.BenInfo);
        }

        [Route("~/api/CovidCart")]
        [HttpPost]
        public CovidRateRes CovidCart(CovidRateReq input)
        {
            input.ApiKey = HttpContext.Session.GetString(Variables.Key);
            input.ServiceDNS = HttpContext.Session.GetString(Variables.ServiceDNS);

            ICart iCart = new Service.Cart();
            CovidRateRes response = iCart.CovidCart(input, HttpContext.Session.GetString(Variables.accessToken));
            if (response.RespId == StatusConstants.RES00001 && !string.IsNullOrEmpty(response.Rate))
            {
                HttpContext.Session.SetString(Variables.CartPayableAmout, response.Rate);
            }
            return response;
        }

        [Route("~/api/SpecialServiceType")]
        [HttpGet]
        public SpecialServiceTypeRes ServiType()
        {
            PincodeReq input = new PincodeReq();
            input.apiKey = HttpContext.Session.GetString(Variables.Key);
            input.accessToken = HttpContext.Session.GetString(Variables.accessToken);
            ISpecialServiceType iSpecialServiceType = new SpecialServiceType();
            return iSpecialServiceType.GetSpecialServiceType(HttpContext.Session.GetString(Variables.ServiceDNS), input);
        }


        [Route("~/api/GetUserType/{Mobile}")]
        [HttpGet]
        public GetUserType GetUserType(string Mobile)
        {
            ICart iCart = new Service.Cart();
            return iCart.GetUserType(Mobile);
        }

        [Route("~/api/ValidateEmail")]
        [HttpPost]
        public EmailRes EmailValidate(EmailReq Ereq)
        {

            Ereq.apiKey = HttpContext.Session.GetString(Variables.Key);
            Ereq.appId = "1";

            Dictionary<string, string> Header = new Dictionary<string, string>();
            Header["Authorization"] = "Bearer " + HttpContext.Session.GetString(Variables.accessToken);
            var SrvDNS = HttpContext.Session.GetString(Variables.ServiceDNS);

            ICustomer iCustomer = new Service.Customer();
            return iCustomer.ValidateEmail(SrvDNS, Ereq, Header);
        }

        [Route("~/api/CollectionPincode")]
        [HttpPost]
        public CollectionpinRes CollectionPincode(CollectionReq input)
        {
            input.ApiKey = HttpContext.Session.GetString(Variables.Key);
            input.ServiceDNS = HttpContext.Session.GetString(Variables.ServiceDNS);

            ICart iCart = new Service.Cart();
            CollectionpinRes response = iCart.CollectionPincode(input, HttpContext.Session.GetString(Variables.accessToken));
            if (!string.IsNullOrEmpty(HttpContext.Session.GetString(Variables.Coupon)))
            {
                response.RespId = "RES01001";
                response.Flag = false;
            }

            if (response.RespId == StatusConstants.RES00001)
            {
                HttpContext.Session.SetString(Variables.CollectionType, Convert.ToString(response.Flag));
            }
            return response;
        }

    }
}
