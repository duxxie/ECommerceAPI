namespace Ecommerce.Models;

public class Fatura
{
    public int Id { get; set; }
    public int PedidoId { get; set; }
    public int MeioPagamentoId { get; set; }
    public decimal ValorTotal { get; set; }
    public string Status { get; set; } = "Pendente";
    public DateTime DataEmissao { get; set; } = DateTime.Now;

    // Relacionamentos
    public Pedido? Pedido { get; set; }
    public MeioPagamento? MeioPagamento { get; set; }
}
