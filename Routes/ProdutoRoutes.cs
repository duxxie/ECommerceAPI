using Ecommerce.Data;
using Ecommerce.Models;
using Microsoft.EntityFrameworkCore;

namespace Ecommerce.Routes
{
    public static class ProdutoRoutes
    {
        public static void MapProdutoRoutes(this WebApplication app)
        {
            var group = app.MapGroup("/produtos");

            group.MapGet("/", async (AppDbContext db) =>
                await db.Produtos.ToListAsync());

            group.MapGet("/{id:int}", async (int id, AppDbContext db) =>
                await db.Produtos.FindAsync(id) is Produto p ? Results.Ok(p) : Results.NotFound("Produto não encontrado."));

            group.MapPost("/", async (Produto produto, AppDbContext db) =>
            {
                db.Produtos.Add(produto);
                await db.SaveChangesAsync();
                return Results.Created($"/produtos/{produto.Id}", produto);
            });

            group.MapDelete("/{id:int}", async (int id, AppDbContext db) =>
            {
                var produto = await db.Produtos.FindAsync(id);
                if (produto is null) return Results.NotFound();

                db.Produtos.Remove(produto);
                await db.SaveChangesAsync();
                return Results.NoContent();
            });
        }
    }
}
