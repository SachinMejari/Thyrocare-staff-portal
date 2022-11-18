using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Staff.Portal.Utilities.Constants;
using Staff.Portal.Utilities.Session;

namespace Staff.Portal.WebUI.Controllers
{
    public class LoginController : Controller
    {
        readonly IConfiguration _configuration;
        public LoginController(IConfiguration configuration)
        {
            _configuration = configuration;
        }

        public IActionResult Index()
        {
            HttpContext.Session.SetString(Variables.ServiceDNS, Convert.ToString(_configuration.GetSection("ServiceUrls")["ServiceDNS"]) + Convert.ToString(_configuration.GetSection("ServiceUrls")["ServiceVD"]));

            if (!string.IsNullOrEmpty(HttpContext.Session.GetString(Variables.UserId)))
            {
                return RedirectToAction("TestMenu", "Home");
            }
            return View();
        }
    }
}