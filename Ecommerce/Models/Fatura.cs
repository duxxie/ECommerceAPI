namespace Ecommerce.Models;

public class Fatura
{
    public int Id { get; set; }
    public int PedidoId { get; set; }
    public DateTime DataEmissao { get; set; } = DateTime.Now;
    public decimal ValorTotal { get; set; }
    public string MeioPagamento { get; set; } = string.Empty;

    //Relacionamentos
    public Pedido? Pedido { get; set; }
}
