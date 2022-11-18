using Microsoft.AspNetCore.Mvc;

namespace Staff.Portal.WebUI
{
    public class LogOutController : Controller
    {
        public IActionResult Index()
        {
            HttpContext.Session.Clear();
            return RedirectToAction("Index", "Login");            
        }
    }
}