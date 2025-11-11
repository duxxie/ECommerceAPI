using Ecommerce.Data;
using Ecommerce.Models;
using Microsoft.EntityFrameworkCore;

namespace Ecommerce.Routes
{
    public static class MeioPagamentoRoutes
    {
        // public static void MapMeioPagamentoRoutes(this WebApplication app)
        // {
        //     var group = app.MapGroup("/meiospagamento");

        //     group.MapGet("/", async (AppDbContext db) =>
        //         await db.MeiosPagamento.Include(m => m.Faturas).ToListAsync());

        //     group.MapGet("/{id:int}", async (int id, AppDbContext db) =>
        //         await db.MeiosPagamento.Include(m => m.Faturas)
        //             .FirstOrDefaultAsync(m => m.Id == id)
        //             is MeioPagamento meio ? Results.Ok(meio) : Results.NotFound());

        //     group.MapPost("/", async (MeioPagamento meio, AppDbContext db) =>
        //     {
        //         db.MeiosPagamento.Add(meio);
        //         await db.SaveChangesAsync();
        //         return Results.Created($"/meiospagamento/{meio.Id}", meio);
        //     });

        //     group.MapDelete("/{id:int}", async (int id, AppDbContext db) =>
        //     {
        //         var meio = await db.MeiosPagamento.FindAsync(id);
        //         if (meio is null) return Results.NotFound();

        //         db.MeiosPagamento.Remove(meio);
        //         await db.SaveChangesAsync();
        //         return Results.NoContent();
        //     });
        // }
    }
}
