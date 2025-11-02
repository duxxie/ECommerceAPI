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
                await db.Faturas.Include(f => f.Pedido).Include(f => f.MeioPagamento).ToListAsync());

            group.MapGet("/{id:int}", async (int id, AppDbContext db) =>
                await db.Faturas.Include(f => f.Pedido).Include(f => f.MeioPagamento)
                    .FirstOrDefaultAsync(f => f.Id == id)
                    is Fatura fatura ? Results.Ok(fatura) : Results.NotFound());

            group.MapPost("/", async (Fatura fatura, AppDbContext db) =>
            {
                db.Faturas.Add(fatura);
                await db.SaveChangesAsync();
                return Results.Created($"/faturas/{fatura.Id}", fatura);
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
