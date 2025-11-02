using Ecommerce.Data;
using Ecommerce.Models;
using Microsoft.EntityFrameworkCore;

namespace Ecommerce.Routes
{
    public static class CarrinhoRoutes
    {
        public static void MapCarrinhoRoutes(this WebApplication app)
        {
            var group = app.MapGroup("/carrinhos");

            group.MapGet("/", async (AppDbContext db) =>
                await db.Carrinhos.Include(c => c.Itens).ThenInclude(i => i.Produto).ToListAsync());

            group.MapGet("/{id:int}", async (int id, AppDbContext db) =>
                await db.Carrinhos.Include(c => c.Itens).ThenInclude(i => i.Produto)
                    .FirstOrDefaultAsync(c => c.Id == id)
                    is Carrinho carrinho ? Results.Ok(carrinho) : Results.NotFound());

            group.MapPost("/", async (Carrinho carrinho, AppDbContext db) =>
            {
                db.Carrinhos.Add(carrinho);
                await db.SaveChangesAsync();
                return Results.Created($"/carrinhos/{carrinho.Id}", carrinho);
            });

            group.MapDelete("/{id:int}", async (int id, AppDbContext db) =>
            {
                var carrinho = await db.Carrinhos.FindAsync(id);
                if (carrinho is null) return Results.NotFound();

                db.Carrinhos.Remove(carrinho);
                await db.SaveChangesAsync();
                return Results.NoContent();
            });
        }
    }
}
