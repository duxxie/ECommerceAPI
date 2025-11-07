namespace Ecommerce.Models
{
    public class Pedido
    {
        public int Id { get; set; }
        public DateTime DataPedido { get; set; } = DateTime.Now;
        public decimal ValorTotal { get; set; }
        public int ClienteId { get; set; }
        public Cliente? Cliente { get; set; }
        public List<ItemPedido> Itens { get; set; } = new();
        public Fatura? Fatura { get; set; }
        public StatusEntrega StatusEntrega { get; set; } = StatusEntrega.AguardandoSeparacao;
    }
}


// group.MapPost("/", async (Pedido pedidoCreate, AppDbContext db) =>
//             {
//                 var clienteExiste = await db.Clientes.AnyAsync(c => c.Id == pedidoCreate.ClienteId);
//                 if (!clienteExiste) return Results.BadRequest("Cliente não encontrado");

//                 var pedido = new Pedido
//                 {
//                     ClienteId = pedidoCreate.ClienteId,
//                     ValorTotal = 
//                 };

//                 db.Pedidos.Add(pedido);
//                 await db.SaveChangesAsync();

//                 return Results.Created($"/pedidos/{pedido.Id}", new { pedido.Id });
//             });
