using Ecommerce.Data;
using Ecommerce.Models;
using Microsoft.EntityFrameworkCore;

namespace Ecommerce.Routes
{
    public static class FaturaRoutes
    {
        public static void MapFaturaRoutes(this WebApplication app)
        {
            var group = app.MapGroup("/faturas");

            group.MapGet("/", async (AppDbContext db) =>
                await db.Faturas
                    .AsNoTracking()
                    .Select(f => new
                    {
                        f.Id,
                        f.PedidoId,
                        f.DataEmissao,
                        f.Pedido.ValorTotal,
                        f.MeioPagamento,
                        f.Pago
                    })
                    .ToListAsync()
                );

            group.MapGet("/{id:int}", async (int id, AppDbContext db) =>
            {
                var fatura = await db.Faturas
                    .AsNoTracking()
                    .Where(f => f.Id == id)
                    .Select(f => new
                    {
                        f.Id,
                        Pedido = new
                        {
                            f.Pedido.Id,
                            Cliente = new
                            {
                                f.Pedido.Cliente.Id,
                                f.Pedido.Cliente.Nome,
                                f.Pedido.Cliente.Email
                            },
                            Itens = f.Pedido.Itens.Select(i => new
                            {
                                i.Id,
                                i.ProdutoId,
                                i.Quantidade,
                                i.PrecoUnitario
                            })
                        },
                        f.DataEmissao,
                        f.ValorTotal,
                        f.MeioPagamento,
                        f.Pago
                    })
                    .FirstOrDefaultAsync();

                return fatura is null ? Results.NotFound() : Results.Ok(fatura);
            });

            group.MapPost("/", async (Fatura fatura, AppDbContext db) =>
            {
                var pedido = await db.Pedidos.FirstOrDefaultAsync(p => p.Id == fatura.PedidoId);

                if (pedido is null)
                    return Results.BadRequest("Pedido não encontrado");

                fatura.ValorTotal = pedido.ValorTotal;
                db.Faturas.Add(fatura);
                await db.SaveChangesAsync();
                return Results.Created($"/faturas/{fatura.Id}", new { fatura.Id, fatura.PedidoId, fatura.DataEmissao, fatura.ValorTotal, fatura.MeioPagamento, fatura.Pago});
            });

            group.MapDelete("/{id:int}", async (int id, AppDbContext db) =>
            {
                var fatura = await db.Faturas.FindAsync(id);
                if (fatura is null) return Results.NotFound();

                db.Faturas.Remove(fatura);
                await db.SaveChangesAsync();
                return Results.NoContent();
            });
        }
    }
}
