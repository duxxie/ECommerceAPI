using Microsoft.EntityFrameworkCore;
using Ecommerce.Data;
using Ecommerce.Models;

namespace Ecommerce.Routes;

public static class CarrinhoRoutes
{
    public static void MapCarrinhoRoutes(this IEndpointRouteBuilder app)
    {
        var group = app.MapGroup("/carrinhos");

        group.MapGet("/", async (AppDbContext db) =>
            await db.Carrinhos
                .Include(c => c.Itens)
                .ThenInclude(i => i.Produto)
                .ToListAsync());

        group.MapPost("/", async (AppDbContext db, Carrinho carrinho) =>
        {
            db.Carrinhos.Add(carrinho);
            await db.SaveChangesAsync();
            return Results.Created($"/carrinhos/{carrinho.Id}", carrinho);
        });

        group.MapDelete("/{id:int}", async (AppDbContext db, int id) =>
        {
            var carrinho = await db.Carrinhos.FindAsync(id);
            if (carrinho is null) return Results.NotFound();

            db.Carrinhos.Remove(carrinho);
            await db.SaveChangesAsync();
            return Results.Ok(carrinho);
        });
    }
}
