using System.Text;

namespace backend.Middleware
{
    /// <summary>
    /// Middleware para autenticação básica HTTP
    /// </summary>
    public class BasicAuthMiddleware
    {
        private readonly RequestDelegate _next;
        private readonly string _user;
        private readonly string _pass;

        /// <summary>
        /// Inicializa uma nova instância do BasicAuthMiddleware
        /// </summary>
        /// <param name="next">Próximo middleware na pipeline</param>
        /// <exception cref="InvalidOperationException">Lançado se AUTH_USER ou AUTH_PASS não estão definidos</exception>
        public BasicAuthMiddleware(RequestDelegate next)
        {
            _next = next;
            _user = Environment.GetEnvironmentVariable("AUTH_USER")
        ?? throw new InvalidOperationException("AUTH_USER não está definido no .env");
            _pass = Environment.GetEnvironmentVariable("AUTH_PASS")
                ?? throw new InvalidOperationException("AUTH_PASS não está definido no .env");
        }

        /// <summary>
        /// Processa a requisição HTTP verificando a autenticação básica
        /// </summary>
        /// <param name="context">Contexto HTTP da requisição</param>
        /// <returns>Tarefa assíncrona representando o processamento da requisição</returns>
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
