
namespace Ecommerce.Models
{
    public class Fatura
    {
        public int Id { get; set; }
        public int PedidoId { get; set; }
        public Pedido? Pedido { get; set; }
        public DateTime DataEmissao { get; set; } = DateTime.Now;
        public decimal ValorTotal { get; set; }
        public MeioPagamentoTipo MeioPagamento { get; set; }
        public bool Pago { get; set; }
    }
}