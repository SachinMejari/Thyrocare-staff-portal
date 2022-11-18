using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;

namespace Staff.Portal.WebUI.Controllers
{
    [Route("error")]
    public class ErrorController : Controller
    {
        
        [Route("500")]
        public IActionResult AppError()
        {
            
            return View();
        }
    }
}