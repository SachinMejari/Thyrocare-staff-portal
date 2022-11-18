namespace Staff.Portal.Utilities.Constants
{
    public class APIUrls
    {
        //public const string Login = "{0}/common.svc/{1}/{2}/WTC/public/login";
        public const string Login = "{0}/Login/Login";
        //public const string Registration = "{0}/Common.svc/registration";        
        public const string Registration = "{0}/UserMaster/Registration";

        //public const string GenerateLoginOtp = "{0}/common.svc/{1}/Login";
        //public const string ValidateLoginOtp = "{0}/common.svc/{1}/{2}/WTC/public/type/Login";
        public const string ValidateLoginOtp = "{0}/Login/OTPLogin";

        //public const string Otp = "{0}/COMMON.svc/otp";
        public const string Otp = "{0}/OTP/New_Generate_OTP";
        public const string ValidateOtp = "{0}/OTP/ValidateOTP";
        //public const string GetProducts = "{0}/master.svc/yLZ4cKcEgPsnZn1s9b9FHhR9cUbO4AdM0z3fvmKQjiw=/{1}/ProductsB2C";
        public const string GetProducts = "{0}/ProductsMaster/StaffProducts";
        //public const string GetProfileDescription = "{0}/ORDER.svc/Profile_Data/TestDetails";
        public const string GetProfileDescription = "{0}/ProductsMaster/ProductDescription";
        public const string GetTestDescription = "https://b2capis.thyrocare.com/API/B2B/COMMON.svc/Details";

        public const string LastAvailedDtl = "{0}/Customer/LastAvailedDtl";

        //public const string GetBeneficiaries = "{0}/COMMON.svc/{1}/view/{2}/public/ViewBeneficiaries";
        public const string GetBeneficiaries = "{0}/Beneficiary/ViewBeneficiaries";
        //public const string UpdateBeneficiaries = "{0}/COMMON.svc/UpdateBeneficiaries";
        public const string UpdateBeneficiaries = "{0}/Beneficiary/UpdateBeneficiaries";

        //public const string ViewCart = "{0}/order.svc/yLZ4cKcEgPsnZn1s9b9FHhR9cUbO4AdM0z3fvmKQjiw=/{1}/{2}/{3}/{4}/1/NO/0/ViewCart_WTC";
        public const string ViewCart = "{0}/CartMaster/ViewCart_WTC";
        //public const string ViewCartCoupon = "{0}/order.svc/vKWapkNMsEX6B7AETIKuF6OmUQAmVblKO83XdYbAJJI=/{1}/{2}/{3}/{4}/{5}/NO/0/{6}/COUPON_ViewCart_B2C";
        public const string ViewCartCoupon = "{0}/CartMaster/CouponViewCartDTL";
        //public const string PostOrderData = "{0}/ORDER.svc/Postorderdata_b2c";
        public const string PostOrderData = "{0}/BookingMaster/ThyroAppBooking";

        //public const string GetSlot = "https://techso.thyrocare.cloud/TechsoAPI/api/Masters/DisplaySubSlotMasters/{0}/{1}";
        public const string GetSlot = "{0}/TechsoApi/GetAppointmentSlots";
        public const string CovidSlot = "{0}/TechsoApi/GetAppointmentSlotsforProducts";

        public const string FixAppointment = "https://techso.thyrocare.cloud/TechsoApi/api/OrderAllocation/FixAppointmentSlot";

        //public const string OrderSummary = "{0}/Order.svc/{1}/{2}/PUBLIC/BookingSummary";
        public const string OrderSummary = "{0}/BookingMaster/BookingSummary";
        //public const string OrderDetails = "{0}/Order.svc/{1}/{2}/{3}/all/OrderSummary";
        public const string OrderDetails = "{0}/OrderSummary/OrderSummary";

        public const string Receipt = "{0}/ORDER.svc/{1}/B2C_Payment_Receipt";//No need to change
        public const string ReportDownload = "{0}/ORDER.svc/{1}/REPORTDETAILS/all/pdf/{2}/Myreport?start=0&length=20";//No need to change

        //public const string UpdateProfile = "{0}/COMMON.svc/UpdateProfile";
        public const string UpdateProfile = "{0}/Login/UpdateProfile";
        //public const string GetProfile = "{0}/COMMON.svc/{1}/mobile/{2}/viewprofile";
        public const string GetProfile = "{0}/UserMaster/ViewProfile";
        public const string MyReport = "{0}/order.svc/{1}/{2}/{3}/{4}/{5}/Myreport";//No need to change
        //public const string MostBookedTests = "{0}/ORDER.svc/GetTop12Profiles";
        public const string MostBookedTests = "{0}/ProductsMaster/MostBookedProfiles";
        //public const string NewProfiles = "{0}/ORDER.svc/newProfiles";
        public const string NewProfiles = "{0}/ProductsMaster/newProfiles";
        //public const string ContactUs = "{0}/Order.svc/PostContactUs";
        public const string ContactUs = "{0}/Feedback/PostContactUs";

        public const string CreatePrepaidOrder = "{0}/ORDER.svc/OnlinePaymentMasterB2C";
        //public const string PaymentLog  = "{0}/PaymentGateway.svc/PaymentLog";

        public const string GenerateTransID = "{0}/ORDER.svc/GenerateTransID";
        //public const string GetOrderTranStatus = "{0}/ORDER.svc/{1}/GetOrderTranStatus";
        public const string GetOrderTranStatus = "{0}/PaymentMaster/GetOrderTranStatus";
        //public const string ConvertToPostPaidOrder = "{0}/ORDER.svc/PostorderstatusBuffer";
        public const string ConvertToPostPaidOrder = "{0}/OrderMaster/PostOrderStatusBuffer";

        public const string ReceiptPrint = "https://techso.thyrocare.cloud/TechSoAPI/AutoReceipt/{0}.pdf";

        public const string PrescriptionUpload = "http://api.nueclear.com/WebAPI/api/Aayushman/Booking";

        public const string BtechRegistration = "https://b2capi.thyrocare.com/api/SugarSo/api/Registration/PostRegistrationBtech";

        //public const string LeadGenerate = "{0}/ORDER.svc/PostLeadGen";
        public const string LeadGenerate = "{0}/Customer​/PostLeadGen";

        //public const string CheckPincodeService = "{0}/order.svc/AH1M7bMkchHFEJGqdqS4HXDenkDlo)NJ9gnfuK1S6tqO0fYdZvSRrDvN13WGwCSS/{1}/PincodeAvailability";
        public const string CheckPincodeService = "{0}/TechsoApi/PincodeAvailability";
        public const string GetDoctorLists = "http://b2capi.thyrocare.com/API/BDN/api/Persuasion/GetDoctors/{0}";

        //public const string ForgetPwd = "{0}/COMMON.svc/forgetPassword";
        //public const string ResetPwd = "{0}/COMMON.svc/ResetPassword";
        public const string ResetPwd = "{0}/Login/PasswordMaster";

        //public const string Rebook = "{0}/ORDER.svc/{1}/Rebook";
        public const string Rebook = "{0}/ProductsMaster​/ReBook";
        //public const string News = "{0}/COMMON.svc/GetNEWS";
        public const string News = "{0}/News/GetNEWS";

        public const string GetVoucher = "http://xp-voucher-dev-sg-v1.sg-s1.cloudhub.io/api/vouchers/ETX_001-{0}";
        public const string AuthVoucher = "http://xp-voucher-dev-sg-v1.sg-s1.cloudhub.io/api/transactions?return_vouchers_info=true";

        public const string SpecialServiceType = "{0}/CommonServices/GetServiceTypes";
     
        //public const string PostOrderDataPromo = "{0}/ORDER.svc/PostorderdataPromo";
        public const string PostOrderDataPromo = "{0}/BookingMaster/LeadBooking";

        //public const string GetCustomerAddress = "{0}/ORDER.svc/{1}/{2}/GetCustomerAddress";
        public const string GetCustomerAddress = "{0}/UserMaster/CustomerAddress";

        //public const string ProductSuggestion = "{0}/ORDER.svc/yLZ4cKcEgPsnZn1s9b9FHhR9cUbO4AdM0z3fvmKQjiw=/{1}/0/9312456874/PUBLIC/ThyronomicsOffer_B2C";

        //public const string WTCBanner = "{0}/ORDER.svc/WTCBanner";
        public const string WTCBanner = "{0}/CommonServices/WTCBanner";

        public const string CheckCoupon = "{0}/CouponMaster/VerifyStaffCoupon";

        public const string CovidCart = "{0}/Covid/CovidRate";

        public const string TXDoctors = "https://b2capi.thyrocare.com/APIs/ORDER.svc/{0}/TXDoctors";
        public const string UserType = "https://b2capi.thyrocare.com/APIs/ORDER.svc/{0}/getClientType";
        //public const string UserType = "http://localhost:56689/ORDER.svc/{0}/getUserType";

        public const string EmailValidation = "{0}/CommonServices/EmailValidate";

        public const string CollectionType = "{0}/CommonServices/PincodewiseCollectionPoint";


    }
}   
