using Ecommerce.Data;
using Ecommerce.Models;
using Microsoft.EntityFrameworkCore;

namespace Ecommerce.Routes
{
    public static class StatusEntregaRoutes
    {
        // public static void MapStatusEntregaRoutes(this WebApplication app)
        // {
        //     var group = app.MapGroup("/statusentrega");

        //     group.MapGet("/", async (AppDbContext db) =>
        //         await db.StatusEntregas.ToListAsync());

        //     group.MapGet("/{id:int}", async (int id, AppDbContext db) =>
        //         await db.StatusEntregas.FindAsync(id) is StatusEntrega s ? Results.Ok(s) : Results.NotFound());

        //     group.MapPost("/", async (StatusEntrega status, AppDbContext db) =>
        //     {
        //         db.StatusEntregas.Add(status);
        //         await db.SaveChangesAsync();
        //         return Results.Created($"/statusentrega/{status.Id}", status);
        //     });

        //     group.MapDelete("/{id:int}", async (int id, AppDbContext db) =>
        //     {
        //         var status = await db.StatusEntregas.FindAsync(id);
        //         if (status is null) return Results.NotFound();

        //         db.StatusEntregas.Remove(status);
        //         await db.SaveChangesAsync();
        //         return Results.NoContent();
        //     });
        // }
    }
}
