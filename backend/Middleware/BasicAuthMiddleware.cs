using System.Text;

namespace backend.Middleware
{
    public class BasicAuthMiddleware
    {
        private readonly RequestDelegate _next;
        private readonly string _user;
        private readonly string _pass;

        public BasicAuthMiddleware(RequestDelegate next)
        {
            _next = next;
            _user = Environment.GetEnvironmentVariable("AUTH_USER")
        ?? throw new InvalidOperationException("AUTH_USER não está definido no .env");
            _pass = Environment.GetEnvironmentVariable("AUTH_PASS")
                ?? throw new InvalidOperationException("AUTH_PASS não está definido no .env");
        }

        public async Task Invoke(HttpContext context)
        {
            var authHeader = context.Request.Headers.Authorization.ToString();

            if (string.IsNullOrEmpty(authHeader) || !authHeader.StartsWith("Basic "))
            {
                context.Response.StatusCode = 401;
                return;
            }

            var encoded = authHeader.Substring("Basic ".Length).Trim();
            var decoded = Encoding.UTF8.GetString(Convert.FromBase64String(encoded));

            var parts = decoded.Split(':');

            if (parts[0] != _user || parts[1] != _pass)
            {
                context.Response.StatusCode = 401;
                return;
            }

            await _next(context);
        }
    }
}
