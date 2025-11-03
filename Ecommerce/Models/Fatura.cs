using System.Text.Json.Serialization;

namespace Ecommerce.Models
{
    public class Fatura
    {
        public int Id { get; set; }

        public int PedidoId { get; set; }
        [JsonIgnore]//Corrigir depois DTO
        public Pedido? Pedido { get; set; }

        public DateTime DataEmissao { get; set; } = DateTime.Now;
        public decimal ValorTotal { get; set; }

        // ✅ Correção aqui:
        public int MeioPagamentoId { get; set; }
        public MeioPagamento? MeioPagamento { get; set; }

        public bool Pago { get; set; }
    }
}