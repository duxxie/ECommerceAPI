using Microsoft.EntityFrameworkCore;
using Ecommerce.Data;
using Ecommerce.Models;

namespace Ecommerce.Routes;

public static class PedidoRoutes
{
    public static void MapPedidoRoutes(this IEndpointRouteBuilder app)
    {
        var group = app.MapGroup("/pedidos");

        group.MapGet("/", async (AppDbContext db) =>
            await db.Pedidos
                .Include(p => p.Itens)
                .ThenInclude(i => i.Produto)
                .ToListAsync());

        group.MapGet("/{id:int}", async (AppDbContext db, int id) =>
            await db.Pedidos
                .Include(p => p.Itens)
                .ThenInclude(i => i.Produto)
                .FirstOrDefaultAsync(p => p.Id == id)
                is Pedido pedido
                ? Results.Ok(pedido)
                : Results.NotFound());

        group.MapPost("/", async (AppDbContext db, Pedido pedido) =>
        {
            decimal total = 0;
            foreach (var item in pedido.Itens)
            {
                var produto = await db.Produtos.FindAsync(item.ProdutoId);
                if (produto == null)
                    return Results.BadRequest($"Produto {item.ProdutoId} não encontrado.");

                item.PrecoUnitario = produto.Preco;
                total += produto.Preco * item.Quantidade;
            }

            pedido.ValorTotal = total;
            db.Pedidos.Add(pedido);
            await db.SaveChangesAsync();

            return Results.Created($"/pedidos/{pedido.Id}", pedido);
        });

        group.MapDelete("/{id:int}", async (AppDbContext db, int id) =>
        {
            var pedido = await db.Pedidos.FindAsync(id);
            if (pedido is null) return Results.NotFound();
            db.Pedidos.Remove(pedido);
            await db.SaveChangesAsync();
            return Results.Ok(pedido);
        });
    }
}
