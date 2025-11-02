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
        public StatusEntrega? StatusEntrega { get; set; }
    }
}
