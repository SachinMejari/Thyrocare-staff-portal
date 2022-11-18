using System.Collections.Generic;

namespace Staff.Portal.Models.ServiceResponse
{
    public class Masters
    {
        public List<TestDetails> OFFER { get; set; }
        public List<TestDetails> POP { get; set; }
        public List<TestDetails> PROFILE { get; set; }
        public List<TestDetails> TESTS { get; set; }
        public List<TestDetails> NEWPROFILES { get; set; }
    }
}
