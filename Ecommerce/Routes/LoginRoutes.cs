using Ecommerce.Models;
using Ecommerce.Dtos;
using Ecommerce.Data;
using Microsoft.EntityFrameworkCore;

namespace Ecommerce.Routes
{
    public static class LoginRoutes
    {
        public static void MapPosLogin(this WebApplication app)
        {
            app.MapPost("/login", async (LoginRequest login, AppDbContext db) =>
            {
                var cliente = await db.Clientes
                    .AsNoTracking()
                    .FirstOrDefaultAsync(c => c.Email == login.Email);

                if(cliente is null)
                    return Results.Unauthorized();
                
                bool senhaOk = BCrypt.Net.BCrypt.Verify(login.Senha, cliente.SenhaHash);

                if(!senhaOk)
                    return Results.Unauthorized();

                var clienteResposta = new
                {
                    cliente.Id,
                    cliente.Nome,
                    cliente.Email,
                    cliente.Telefone,
                    cliente.Endereco
                };

                return Results.Ok(clienteResposta);
            });
        }
    }
}