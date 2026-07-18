using System.Text;
using backend.Middleware;
using Microsoft.AspNetCore.Http;
using Xunit;

namespace backend.Tests.MiddlewareTests
{
    /// <summary>
    /// Valida que o BasicAuthMiddleware responde 401 de forma controlada em vez de rebentar
    /// com exceção quando o header Authorization é malformado
    /// </summary>
    public class BasicAuthMiddlewareTests : IDisposable
    {
        public BasicAuthMiddlewareTests()
        {
            Environment.SetEnvironmentVariable("AUTH_USER", "admin");
            Environment.SetEnvironmentVariable("AUTH_PASS", "secret");
        }

        public void Dispose()
        {
            Environment.SetEnvironmentVariable("AUTH_USER", null);
            Environment.SetEnvironmentVariable("AUTH_PASS", null);
        }

        private static BasicAuthMiddleware CreateMiddleware()
        {
            RequestDelegate next = _ => Task.CompletedTask;
            return new BasicAuthMiddleware(next);
        }

        [Fact]
        public async Task Invoke_WithoutAuthorizationHeader_Returns401()
        {
            var middleware = CreateMiddleware();
            var context = new DefaultHttpContext();

            await middleware.Invoke(context);

            Assert.Equal(401, context.Response.StatusCode);
        }

        [Fact]
        public async Task Invoke_WithNonBase64Header_Returns401InsteadOfThrowing()
        {
            var middleware = CreateMiddleware();
            var context = new DefaultHttpContext();
            context.Request.Headers.Authorization = "Basic %%%not-base64%%%";

            var exception = await Record.ExceptionAsync(() => middleware.Invoke(context));

            Assert.Null(exception);
            Assert.Equal(401, context.Response.StatusCode);
        }

        [Fact]
        public async Task Invoke_WithBase64ButNoColon_Returns401InsteadOfThrowing()
        {
            var middleware = CreateMiddleware();
            var context = new DefaultHttpContext();
            var encoded = Convert.ToBase64String(Encoding.UTF8.GetBytes("adminwithoutcolon"));
            context.Request.Headers.Authorization = $"Basic {encoded}";

            var exception = await Record.ExceptionAsync(() => middleware.Invoke(context));

            Assert.Null(exception);
            Assert.Equal(401, context.Response.StatusCode);
        }

        [Fact]
        public async Task Invoke_WithWrongCredentials_Returns401()
        {
            var middleware = CreateMiddleware();
            var context = new DefaultHttpContext();
            var encoded = Convert.ToBase64String(Encoding.UTF8.GetBytes("admin:wrong-password"));
            context.Request.Headers.Authorization = $"Basic {encoded}";

            await middleware.Invoke(context);

            Assert.Equal(401, context.Response.StatusCode);
        }

        [Fact]
        public async Task Invoke_WithCorrectCredentials_CallsNext()
        {
            var called = false;
            RequestDelegate next = _ =>
            {
                called = true;
                return Task.CompletedTask;
            };
            var middleware = new BasicAuthMiddleware(next);
            var context = new DefaultHttpContext();
            var encoded = Convert.ToBase64String(Encoding.UTF8.GetBytes("admin:secret"));
            context.Request.Headers.Authorization = $"Basic {encoded}";

            await middleware.Invoke(context);

            Assert.True(called);
        }

        [Fact]
        public async Task Invoke_WithPasswordContainingColon_MatchesCorrectly()
        {
            Environment.SetEnvironmentVariable("AUTH_PASS", "pass:with:colons");
            var called = false;
            RequestDelegate next = _ =>
            {
                called = true;
                return Task.CompletedTask;
            };
            var middleware = new BasicAuthMiddleware(next);
            var context = new DefaultHttpContext();
            var encoded = Convert.ToBase64String(Encoding.UTF8.GetBytes("admin:pass:with:colons"));
            context.Request.Headers.Authorization = $"Basic {encoded}";

            await middleware.Invoke(context);

            Assert.True(called);
        }
    }
}
